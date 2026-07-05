import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Printer, ArrowLeft } from 'lucide-react';

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

        const { data: studentData } = await supabase
          .from('students')
          .select('full_name, schools (school_name)')
          .eq('id', studentId)
          .single();

        const { data: rankData } = await supabase
          .from('rankings')
          .select('*')
          .eq('event_id', eventId)
          .eq('student_id', studentId)
          .maybeSingle();

        if (eventData && studentData) {
          setData({ event: eventData, student: studentData, rank: rankData });
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

  const handlePrint = () => {
    window.print();
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
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px', fontFamily: 'var(--font-body)' }}>
      
      {/* Controls (Hidden in Print) */}
      <div className="no-print" style={{ maxWidth: '900px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard/student" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          style={{ backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
        >
          <Printer size={20} /> Print / Save as PDF
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div 
          id="certificate-container"
          className="cert-scale"
          style={{ 
            width: '900px', 
            height: '636px',
            backgroundColor: 'white', 
            padding: '40px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            position: 'relative',
            border: '1px solid #e2e8f0',
            backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Borders */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', border: '8px solid var(--primary-dark)', opacity: 0.1 }}></div>
          <div style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px', border: '2px solid var(--accent-orange)' }}></div>
          
          {/* Top Graphics */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '150px', backgroundColor: 'var(--primary-blue)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '150px', height: '150px', backgroundColor: 'var(--accent-orange)', clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>

          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 40px' }}>
            
            <img src="/logo.png" alt="Logo" style={{ height: '80px', marginBottom: '20px' }} />
            
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', color: 'var(--primary-dark)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '4px' }}>
              Certificate of Achievement
            </h1>
            
            <p style={{ fontSize: '18px', color: '#64748b', fontStyle: 'italic', marginBottom: '30px' }}>This is proudly presented to</p>
            
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--accent-orange)', margin: '0 0 10px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', display: 'inline-block', minWidth: '500px' }}>
              {data.student.full_name}
            </h2>
            
            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', lineHeight: '1.6', margin: '20px 0 40px 0' }}>
              For outstanding performance and successful participation in the <br/>
              <strong style={{ color: 'var(--primary-dark)', fontSize: '20px' }}>{data.event.name}</strong> <br/>
              held on {new Date(data.event.event_date).toLocaleDateString()} at {data.event.venue}.
              {data.rank && (
                <>
                  <br /><br />
                  <span style={{ backgroundColor: '#eff6ff', color: 'var(--primary-blue)', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>All India Rank: #{data.rank.air_rank}</span>
                </>
              )}
            </p>
            
            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 50px', marginTop: 'auto' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', height: '40px', marginBottom: '10px' }}></div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>Event Director</p>
              </div>
              
              {/* Seal */}
              <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--primary-dark)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', border: '4px dashed var(--accent-orange)', transform: 'rotate(-15deg)' }}>
                OFFICIAL<br/>SEAL
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', height: '40px', marginBottom: '10px' }}></div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>Managing Director</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .cert-scale {
            transform: scale(0.8);
            transform-origin: top center;
          }
        }
        @media (max-width: 768px) {
          .cert-scale {
            transform: scale(0.6);
            transform-origin: top center;
          }
        }
        @media (max-width: 550px) {
          .cert-scale {
            transform: scale(0.42);
            transform-origin: top center;
            margin-bottom: -300px; /* offset the scaled height so page doesn't have huge gap */
          }
        }
        @media (max-width: 400px) {
          .cert-scale {
            transform: scale(0.35);
            transform-origin: top center;
            margin-bottom: -400px;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-container, #certificate-container * {
            visibility: visible;
          }
          #certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
            transform: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
