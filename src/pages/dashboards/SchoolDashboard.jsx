import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import './dashboard.css';

const SchoolDashboard = () => {
  const { role, profile, loading } = useAuth();
  const [myStudents, setMyStudents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [bestRank, setBestRank] = useState({ air: '--', state: '--', district: '--' });
  const [schoolData, setSchoolData] = useState(null);

  // Student Detail View States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPerformances, setStudentPerformances] = useState([]);
  const [studentCertificates, setStudentCertificates] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form States
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    if (role === 'school' && profile?.id) {
      fetchSchoolData();

      // Realtime Subscriptions
      const channel = supabase.channel('school-dashboard-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'performances' }, () => {
          fetchSchoolData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students', filter: `school_id=eq.${profile.id}` }, () => {
          fetchSchoolData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schools', filter: `id=eq.${profile.id}` }, () => {
          fetchSchoolData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [role, profile]);

  const fetchSchoolData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch school details
      const { data: schoolDetail } = await supabase.from('schools').select('*').eq('id', profile.id).single();
      if (schoolDetail) {
        setSchoolData(schoolDetail);
        setNameInput(schoolDetail.school_name || '');
        
        let loc = '';
        if (schoolDetail.district && schoolDetail.state) {
          loc = `${schoolDetail.district}, ${schoolDetail.state}`;
        } else {
          loc = schoolDetail.address || '';
        }
        setAddressInput(loc);
      }

      // 2. Fetch Students
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', profile.id)
        .order('points', { ascending: false });

      const students = studentsData || [];

      if (students.length > 0) {
        const studentIds = students.map(s => s.id);
        const { data: perfs } = await supabase
          .from('performances')
          .select('student_id, event_id, metric_value')
          .in('student_id', studentIds);

        const { data: ranks } = await supabase
          .from('rankings')
          .select('student_id, event_id, air_rank, state_rank')
          .in('student_id', studentIds);

        const enrichedStudents = students.map(st => {
          const stPerfs = perfs?.filter(p => p.student_id === st.id) || [];
          const stRanks = ranks?.filter(r => r.student_id === st.id) || [];
          let stBestAir = Infinity;
          let stBestState = Infinity;
          
          const eventIds = new Set([
            ...stPerfs.map(p => p.event_id),
            ...stRanks.map(r => r.event_id)
          ]);

          for (const eventId of eventIds) {
            const p = stPerfs.find(perf => perf.event_id === eventId) || {};
            const r = stRanks.find(rank => rank.event_id === eventId) || {};
            const natRank = r.air_rank;
            const stateRank = r.state_rank;
            if (natRank != null && natRank < stBestAir) stBestAir = natRank;
            if (stateRank != null && stateRank < stBestState) stBestState = stateRank;
          }
          return {
            ...st,
            bestAir: stBestAir !== Infinity ? stBestAir : null,
            bestState: stBestState !== Infinity ? stBestState : null
          };
        });
        setMyStudents(enrichedStudents);
      } else {
        setMyStudents([]);
      }

      // 3. Compute Dynamic School Rankings
      const { data: allSchools } = await supabase.from('schools').select('id, state, district');
      const { data: allStudentsData } = await supabase.from('students').select('points, school_id');

      const schoolScores = {};
      if (allSchools) {
        allSchools.forEach(sch => {
          schoolScores[sch.id] = { id: sch.id, state: sch.state, district: sch.district, score: 0 };
        });
      }
      if (allStudentsData) {
        allStudentsData.forEach(st => {
          if (st.school_id && schoolScores[st.school_id]) {
            schoolScores[st.school_id].score += (st.points || 0);
          }
        });
      }

      const sortedSchools = Object.values(schoolScores).sort((a, b) => b.score - a.score);
      const mySchoolStats = sortedSchools.find(s => s.id === profile.id);

      let sAir = '--';
      let sState = '--';
      let sDist = '--';

      if (mySchoolStats && mySchoolStats.score > 0) {
        sAir = sortedSchools.findIndex(s => s.id === profile.id) + 1;
        
        const stateSchools = sortedSchools.filter(s => s.state === mySchoolStats.state);
        sState = stateSchools.findIndex(s => s.id === profile.id) + 1;

        const distSchools = stateSchools.filter(s => s.district === mySchoolStats.district);
        sDist = distSchools.findIndex(s => s.id === profile.id) + 1;
      }

      setBestRank({ air: sAir, state: sState, district: sDist });

    } catch (error) {
      console.error("Error fetching school dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = async () => {
    if (!nameInput || !addressInput) {
      setProfileError(true);
      return;
    }
    setProfileError(false);
    
    let district = '';
    let state = '';
    const parts = addressInput.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      district = parts[0];
      state = parts[1];
    }

    try {
      const updates = { school_name: nameInput };
      if (district && state) {
        updates.district = district;
        updates.state = state;
      } else {
        updates.address = addressInput;
      }

      const { error } = await supabase.from('schools').update(updates).eq('id', profile.id);
      if (error) throw error;
      
      setSchoolData(prev => ({ ...prev, ...updates }));
      setShowProfileModal(false);
      showToast('School details updated');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingStudent(true);
    
    try {
      const { data: regData } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('student_id', student.id);

      const { data: perfData } = await supabase
        .from('performances')
        .select('event_id, metric_value')
        .eq('student_id', student.id);
        
      const { data: rankData } = await supabase
        .from('rankings')
        .select('event_id, air_rank, state_rank, district_rank, metric_value')
        .eq('student_id', student.id);
        
      const { data: allEvents } = await supabase.from('events').select('*');

      const eventIds = new Set([
        ...(regData || []).map(r => r.event_id),
        ...(perfData || []).map(p => p.event_id),
        ...(rankData || []).map(r => r.event_id)
      ]);

      const mergedPerfs = Array.from(eventIds).map(eventId => {
        const p = (perfData || []).find(x => x.event_id === eventId) || {};
        const r = (rankData || []).find(x => x.event_id === eventId) || {};
        const eventData = allEvents?.find(e => e.id === eventId) || {};
        
        return {
          event_id: eventId,
          metric_value: p.metric_value ?? r.metric_value,
          national_rank: r.air_rank,
          state_rank: r.state_rank,
          district_rank: r.district_rank,
          events: eventData
        };
      });

      setStudentPerformances(mergedPerfs);

      const { data: certData } = await supabase
        .from('certificates')
        .select('*, events (name, event_date)')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      setStudentCertificates(certData || []);
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setLoadingStudent(false);
    }
  };

  // Helpers
  const initials = (name) => {
    if (!name) return 'SC';
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const tierFor = (rank) => {
    if (rank === 1) return { name: "gold", color: "#E7B740", deep: "#B5872A" };
    if (rank === 2) return { name: "silver", color: "#B8C2D6", deep: "#7E8AA6" };
    if (rank === 3) return { name: "bronze", color: "#C9834E", deep: "#96562C" };
    return { name: "steel", color: "#E3E1D8", deep: "#5B6480" };
  };

  const tierLabel = (rank) => {
    if (rank === 1) return "Top rank";
    if (rank === 2) return "Runner-up";
    if (rank === 3) return "Podium finish";
    return "Ranked";
  };

  const MedalSVG = ({ rank, size = 56 }) => {
    const t = tierFor(rank);
    return (
      <svg className="medal-svg" width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 30 L11 50 L20 47 L25 54 L33 36" fill={t.color} opacity="0.55" />
        <path d="M36 30 L45 50 L36 47 L31 54 L23 36" fill={t.color} opacity="0.35" />
        <circle cx="28" cy="24" r="18" fill={t.color} />
        <circle cx="28" cy="24" r="18" fill="none" stroke={t.deep} strokeWidth="2" />
        <text x="28" y="30" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="16" fill="#16203B">#{rank}</text>
      </svg>
    );
  };

  if (loading || dataLoading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#F7F6F2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '60px', height: '60px', border: '5px solid #E3E1D8', borderTopColor: '#E7B740', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#16203B', margin: 0, fontSize: '24px' }}>Loading Dashboard...</h2>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (role !== 'school' || !profile) {
    return <Navigate to="/login" />;
  }

  const displayName = schoolData?.school_name || profile.school_name;
  let displayLoc = '';
  if (schoolData?.district && schoolData?.state) {
    displayLoc = `${schoolData.district}, ${schoolData.state}`;
  } else {
    displayLoc = schoolData?.address || `${profile.district || ''} ${profile.state || ''}`.trim() || 'Location Not Set';
  }

  const schoolBest = [
    { scope: "All India Rank", rank: bestRank.air },
    { scope: "State Rank", rank: bestRank.state },
    { scope: "District Rank", rank: bestRank.district }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">AK</div>
            <div>
              School Dashboard
              <span className="brand-sub">AKI Talent Program</span>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="points-pill">
              <span className="dot"></span>
              <span className="label">Students</span>
              <span>{myStudents.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-band"></div>

      <div className="shell" style={{ marginTop: 0 }}>
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="avatar">{initials(displayName)}</div>

          <div className="profile-id-block">
            <div className="profile-name-row">
              <div className="profile-name">{displayName}</div>
              <button className="btn-edit-inline" aria-label="Update name and address" onClick={() => setShowProfileModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg>
              </button>
            </div>
            <div className="profile-meta-row">
              <span className="id-chip">{profile.custom_school_id}</span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                <span>{displayLoc}</span>
              </span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                {schoolData?.email || profile.email}
              </span>
            </div>
          </div>

          <div className="dob-block">
            <div className="age-badge" style={{ minWidth: '90px' }}>
              <span className="num">{myStudents.length}</span>
              <span className="txt">Enrolled</span>
            </div>
          </div>
        </div>

        {/* SCHOOL BEST RANKS */}
        {!selectedStudent && (
          <>
            <div className="section-heading">
              <h2>School Live Ranks</h2>
              <p>Your institution's current standing based on total student performance.</p>
            </div>
            <div className="ranks-row">
              {schoolBest.map((r, i) => (
                <div className="rank-card" key={i}>
                  {r.rank !== '--' ? <MedalSVG rank={r.rank} /> : (
                    <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#E3E1D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', color: '#5B6480' }}>--</div>
                  )}
                  <div className="rank-info">
                    <div className="scope">{r.scope}</div>
                    <div className="rank-num">#{r.rank}</div>
                    <div className="rank-tier" style={{ color: tierFor(r.rank !== '--' ? r.rank : null).deep }}>
                      {r.rank !== '--' ? tierLabel(r.rank) : 'Not Ranked'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


        {/* STUDENTS TABLE / DETAILED VIEW */}
        
        {selectedStudent ? (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginTop: '30px' }}>
            <button onClick={() => setSelectedStudent(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> 
              Back to Students List
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', overflow: 'hidden' }}>
                {selectedStudent.photo_url ? (
                  <img src={selectedStudent.photo_url} alt={selectedStudent.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials(selectedStudent.full_name)}
              </div>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px', color: '#0f172a' }}>{selectedStudent.full_name}</h2>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>
                  ID: {selectedStudent.custom_student_id} • {selectedStudent.gender} • {selectedStudent.email}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                  <strong>Global Points:</strong> <span style={{ color: '#b45309', fontWeight: 'bold' }}>{selectedStudent.points || 0}</span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '15px' }}>Events Participated & Rankings</h3>
            {loadingStudent ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading event history...</div>
            ) : studentPerformances.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#64748b', textAlign: 'center' }}>No event participation found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>Event Name</th>
                    <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>Score</th>
                    <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>AIR</th>
                    <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>State Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPerformances.map((perf, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#0f172a' }}>{perf.events?.name}</td>
                      <td style={{ padding: '15px', color: '#3b82f6', fontWeight: 'bold' }}>{perf.metric_value || <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '13px' }}>Pending</span>} <span style={{fontSize:'10px', color:'#94a3b8'}}>{perf.metric_value ? perf.events?.event_type : ''}</span></td>
                      <td style={{ padding: '15px' }}>{perf.national_rank ? `#${perf.national_rank}` : <span style={{ color: '#94a3b8', fontSize: '13px' }}>Pending</span>}</td>
                      <td style={{ padding: '15px' }}>{perf.state_rank ? `#${perf.state_rank}` : <span style={{ color: '#94a3b8', fontSize: '13px' }}>Pending</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '15px' }}>Generated Certificates</h3>
            {loadingStudent ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading certificates...</div>
            ) : studentCertificates.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#64748b', textAlign: 'center' }}>No certificates available.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {studentCertificates.map(cert => (
                  <div key={cert.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{cert.events?.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {new Date(cert.created_at).toLocaleDateString()}</div>
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', backgroundColor: '#eff6ff', color: '#3b82f6', textDecoration: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="section-heading">
              <h2>Registered Students</h2>
              <p>Every student from your school, and their performance.</p>
            </div>

        <div className="competitions-wrap">
          {myStudents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No students have registered under your school yet.
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Global Points</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myStudents.map((st, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', overflow: 'hidden' }}>
                             {st.photo_url ? <img src={st.photo_url} alt="pfp" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : initials(st.full_name)}
                          </div>
                          <div>
                            <div className="comp-name">{st.full_name}</div>
                            <div className="comp-sub">{st.email} • {st.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="score-value">{st.points || 0}</span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleViewStudent(st)}
                          style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          See More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="comp-cards">
                {myStudents.map((st, i) => (
                  <div className="comp-card" key={i}>
                    <div className="comp-card-top">
                      <div>
                        <div className="comp-name">{st.full_name}</div>
                        <div className="comp-sub">{st.email}</div>
                      </div>
                    </div>
                    <div className="comp-card-stats">
                      <div className="comp-stat">
                        <div className="label">Points</div>
                        <div className="val">{st.points || 0}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewStudent(st)}
                      style={{ width: '100%', backgroundColor: '#f1f5f9', border: 'none', color: '#3b82f6', padding: '10px', borderRadius: '0 0 16px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}
                    >
                      View Full Profile & Certificates
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        </>
        )}

        <footer className="foot-note">Data shown reflects your students' latest verified competition results.</footer>
      </div>

      {/* EDIT PROFILE MODAL */}
      <div className={`modal-overlay ${showProfileModal ? 'open' : ''}`}>
        <div className="modal">
          <h3>Update school details</h3>
          <p className="hint">Keep your school name and address current.</p>
          <label className="field-label" htmlFor="nameInput">School name</label>
          <input type="text" id="nameInput" className="field-input" style={{ marginBottom: 16 }} placeholder="e.g. Don Bosco School" value={nameInput} onChange={e => setNameInput(e.target.value)} />
          <label className="field-label" htmlFor="addressInput">Address (city, state)</label>
          <input type="text" id="addressInput" className="field-input" placeholder="e.g. Jalna, Maharashtra" value={addressInput} onChange={e => setAddressInput(e.target.value)} />
          <div className={`field-error ${profileError ? 'show' : ''}`}>Please fill in both fields before saving.</div>
          <div className="modal-actions">
            <button className="btn-ghost" onClick={() => setShowProfileModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveProfile}>Save changes</button>
          </div>
        </div>
      </div>

      <div className={`toast ${toastMessage ? 'show' : ''}`}>{toastMessage}</div>
    </div>
  );
};

export default SchoolDashboard;
