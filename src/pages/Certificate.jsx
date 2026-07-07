import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Printer, ArrowLeft, Trophy, MapPin, Target, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Certificate = () => {
  const { eventId, studentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertData = async () => {
      try {
        const { data: perfData } = await supabase
          .from('performances')
          .select('*')
          .eq('event_id', eventId)
          .eq('student_id', studentId)
          .maybeSingle();

        if (!perfData) {
          setData({ status: 'pending' });
          return;
        }

        const { data: eventData } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        const { data: allRankings } = await supabase
          .from('rankings')
          .select('*, students(id, state, district, full_name, photo_url, dob, gender, email, schools(school_name))')
          .eq('event_id', eventId)
          .order('air_rank', { ascending: true });

        let studentRankRecord = null;
        let stateRank = 'N/A';
        let districtRank = 'N/A';
        let ageGroup = 'N/A';

        if (allRankings && allRankings.length > 0) {
          studentRankRecord = allRankings.find(r => r.student_id === studentId);
          
          if (studentRankRecord) {
            const studentState = studentRankRecord.students?.state;
            const studentDistrict = studentRankRecord.students?.district;
            
            if (studentState) {
                const stateRankings = allRankings.filter(r => r.students?.state === studentState);
                stateRank = stateRankings.findIndex(r => r.student_id === studentId) + 1;
                
                if (studentDistrict) {
                    const districtRankings = stateRankings.filter(r => r.students?.district === studentDistrict);
                    districtRank = districtRankings.findIndex(r => r.student_id === studentId) + 1;
                }
            }

            // Calculate Age Group
            if (studentRankRecord.students?.dob) {
                const dob = new Date(studentRankRecord.students.dob);
                const age = new Date().getFullYear() - dob.getFullYear();
                if (age <= 10) ageGroup = 'Under 10';
                else if (age <= 14) ageGroup = 'Under 14';
                else if (age <= 18) ageGroup = 'Under 18';
                else ageGroup = 'Open';
            }
          }
        }

        if (eventData && studentRankRecord) {
          setData({ 
            event: eventData, 
            student: studentRankRecord.students, 
            rank: studentRankRecord,
            stateRank,
            districtRank,
            ageGroup
          });
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId && studentId) {
      fetchCertData();
    }
  }, [eventId, studentId]);

  const handleDownloadAndSave = async () => {
    Swal.fire({
      title: 'Generating Certificate...',
      text: 'Please wait while we save your official certificate.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const certElement = document.getElementById('certificate-container');
      
      // Create an off-screen clone for perfect high-resolution rendering regardless of screen size
      const clone = certElement.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.transform = 'none';
      clone.style.width = '1123px';
      clone.style.height = '794px';
      clone.classList.remove('cert-scale');
      document.body.appendChild(clone);

      // Wait a fraction of a second for DOM to render the clone
      await new Promise(resolve => setTimeout(resolve, 150));

      const canvas = await html2canvas(clone, {
        scale: 2, 
        useCORS: true,
        logging: false,
        width: 1123,
        height: 794
      });

      // Cleanup clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1123, 794]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
      const pdfBlob = pdf.output('blob');

      // Upload to Supabase Storage
      const fileName = `${studentId}-${eventId}-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      // Save to Database
      const { error: dbError } = await supabase
        .from('certificates')
        .upsert({
          student_id: studentId,
          event_id: eventId,
          pdf_url: publicUrl
        }, { onConflict: 'student_id,event_id' }); 

      if (dbError) throw dbError;

      // --- SEND CONGRATULATORY EMAIL ---
      try {
        let greeting_title = '';
        let message_body = '';
        const airRank = data.rank?.air_rank || 999;
        
        if (airRank <= 10) {
           greeting_title = '🏆 Incredible Performance!';
           message_body = `Congratulations! You have secured Global Rank #${airRank}, State Rank #${data.stateRank}, and District Rank #${data.districtRank}. You are among the Top 10 absolute best in India! We are incredibly proud of your achievement.`;
        } else {
           greeting_title = '🌟 Great Effort!';
           message_body = `You secured Global Rank #${airRank}. You are just a few steps behind the top spot! Keep practicing hard, stay dedicated, and you will definitely be the absolute best in the upcoming events. We believe in you!`;
        }

        await emailjs.send(
          'service_chhvd7x',
          'template_2izpqag',
          {
            email: data.student?.email,
            full_name: data.student?.full_name,
            event_name: data.event?.name,
            greeting_title: greeting_title,
            message_body: message_body,
            global_rank: airRank,
            state_rank: data.stateRank,
            district_rank: data.districtRank,
            pdf_url: publicUrl
          },
          'w1_bsQnbIzah00g7n'
        );
      } catch(emailError) {
        console.error('Failed to send certificate email:', emailError);
      }

      Swal.fire({
        title: 'Success!',
        text: 'Certificate saved to database and downloaded. A copy has been emailed to you!',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });

      // Download the PDF locally
      pdf.save(`Certificate_${data.student?.full_name?.replace(/\\s+/g, '_') || 'Participant'}.pdf`);

    } catch (error) {
      console.error("Error saving certificate:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save certificate. ' + error.message,
        icon: 'error'
      });
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="loader"></div></div>;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Certificate not found.</div>;
  
  if (data.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: '20px', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Scores Pending ⏳</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '25px' }}>
            Your official scores have not been uploaded by the event administrators yet. You can download and print your certificate once the final results are published!
          </p>
          <Link to="/dashboard/student" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'var(--primary-blue)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', transition: 'transform 0.2s' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', fontFamily: 'var(--font-body)' }}>
      
      {/* Controls (Hidden in Print) */}
      <div className="no-print" style={{ maxWidth: '1123px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <Link to="/dashboard/student" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <button 
          onClick={handleDownloadAndSave}
          style={{ backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
        >
          <Printer size={20} /> Download Official PDF
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        
        {/* LANDSCAPE A4 CERTIFICATE (1123px x 794px) */}
        <div 
          id="certificate-container"
          className="cert-scale"
          style={{ 
            width: '1123px', 
            height: '794px',
            backgroundColor: 'white', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            position: 'relative',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f8fafc\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'10\'/%3E%3C/g%3E%3C/svg%3E")',
            overflow: 'hidden'
          }}
        >
          {/* Elegant Geometric Borders */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px solid #cbd5e1', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '22px', left: '22px', right: '22px', bottom: '22px', border: '3px solid var(--primary-dark)', pointerEvents: 'none' }}></div>
          
          {/* Top Corner Graphics */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '180px', height: '180px', backgroundColor: 'var(--primary-blue)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '180px', height: '180px', backgroundColor: 'var(--accent-orange)', clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>

          <div style={{ position: 'relative', zIndex: 10, padding: '40px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
            
            <img src="/logo.png" alt="Logo" style={{ height: '70px', marginBottom: '15px' }} />
            
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--primary-dark)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '4px' }}>
              Certificate of Excellence
            </h1>
            
            <p style={{ fontSize: '18px', color: '#64748b', fontStyle: 'italic', marginBottom: '20px', letterSpacing: '1px' }}>Proudly presented to</p>
            
            {/* Student Profile & Name Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '20px', padding: '15px 40px', backgroundColor: '#f8fafc', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', border: '4px solid var(--accent-orange)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                {data.student?.photo_url ? (
                  <img src={data.student.photo_url} alt={data.student.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '32px', color: 'var(--primary-blue)', fontWeight: 'bold' }}>{data.student?.full_name?.charAt(0)}</span>
                )}
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--primary-dark)', margin: '0', textTransform: 'capitalize' }}>
                {data.student?.full_name}
              </h2>
            </div>
            
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '800px', lineHeight: '1.6', margin: '0 0 25px 0' }}>
              For displaying outstanding dedication and remarkable skill by successfully competing in the <br/>
              <strong style={{ color: 'var(--primary-blue)', fontSize: '20px', textTransform: 'uppercase' }}>{data.event?.name}</strong> <br/>
              held on <strong style={{ color: '#334155' }}>{new Date(data.event?.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> at {data.event?.venue}.
            </p>

            {/* Performance Summary Grid (Horizontal/Landscape friendly) */}
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px', marginBottom: 'auto' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Event</div>
                <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 'bold' }}>{data.event?.sport_category || 'Athletics'}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Age Group</div>
                <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 'bold' }}>{data.ageGroup}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>District</div>
                <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.student?.district}</div>
              </div>

              {/* Ranks */}
              <div style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>Global Rank</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>#{data.rank?.air_rank || 'N/A'}</div>
              </div>
              <div style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>State Rank</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>#{data.stateRank}</div>
              </div>
              <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>District Rank</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>#{data.districtRank}</div>
              </div>
            </div>
            
            {/* Signatures & Seal Floor */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', padding: '0 40px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center', width: '180px' }}>
                <div style={{ borderBottom: '2px solid #94a3b8', height: '40px', marginBottom: '10px' }}></div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Event Director</p>
              </div>
              
              {/* Golden Seal */}
              <div style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: '#fbbf24', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '13px', textAlign: 'center', border: '2px solid #b45309', boxShadow: '0 0 0 4px #fef3c7, 0 10px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ border: '1px dashed #b45309', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Trophy size={24} style={{ marginBottom: '5px', color: '#b45309' }} />
                  <span>OFFICIAL<br/>SEAL</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', width: '180px' }}>
                <div style={{ borderBottom: '2px solid #94a3b8', height: '40px', marginBottom: '10px' }}></div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>Managing Director</p>
              </div>
            </div>

            {/* Unique Certificate Number */}
            <div style={{ position: 'absolute', bottom: '25px', left: '35px', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1.5px', userSelect: 'none', fontFamily: 'monospace' }}>
              CERT ID: AK-{eventId?.substring(0,4).toUpperCase()}-{studentId?.substring(0,4).toUpperCase()}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .cert-scale {
            transform: scale(0.85);
            transform-origin: top center;
            margin-bottom: -120px;
          }
        }
        @media (max-width: 950px) {
          .cert-scale {
            transform: scale(0.65);
            transform-origin: top center;
            margin-bottom: -280px;
          }
        }
        @media (max-width: 768px) {
          .cert-scale {
            transform: scale(0.5);
            transform-origin: top center;
            margin-bottom: -400px;
          }
        }
        @media (max-width: 550px) {
          .cert-scale {
            transform: scale(0.35);
            transform-origin: top center;
            margin-bottom: -520px; 
          }
        }
        @media (max-width: 400px) {
          .cert-scale {
            transform: scale(0.28);
            transform-origin: top center;
            margin-bottom: -570px;
          }
        }

        @media print {
          body * { visibility: hidden; }
          #certificate-container, #certificate-container * { visibility: visible; }
          #certificate-container {
            position: absolute;
            left: 0; top: 0;
            width: 1123px; height: 794px;
            margin: 0; padding: 0;
            box-shadow: none; border: none;
            transform: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          @page { size: landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
