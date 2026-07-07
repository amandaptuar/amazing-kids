import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import './dashboard.css';

const StudentDashboard = () => {
  const { role, profile, loading } = useAuth();
  
  const [myEvents, setMyEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [bestRank, setBestRank] = useState({ air: '--', state: '--', district: '--' });
  const [points, setPoints] = useState(0);
  const [studentData, setStudentData] = useState(null);

  // Modal States
  const [showDobModal, setShowDobModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form States
  const [dobInput, setDobInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [dobError, setDobError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (role === 'student' && profile) {
      fetchStudentData();

      // Realtime Subscriptions
      const channel = supabase.channel('student-dashboard-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'performances', filter: `student_id=eq.${profile.id}` }, () => {
          fetchStudentData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students', filter: `id=eq.${profile.id}` }, () => {
          fetchStudentData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'event_participants', filter: `student_id=eq.${profile.id}` }, () => {
          fetchStudentData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [role, profile]);

  const fetchStudentData = async () => {
    setDataLoading(true);
    try {
      const { data: userData } = await supabase.from('students').select('*').eq('id', profile.id).single();
      if (userData) {
        setStudentData(userData);
        setPoints(userData.points || 0);
        setDobInput(userData.dob || '');
        setNameInput(userData.full_name || '');
        
        let loc = '';
        if (userData.district && userData.state) {
          loc = `${userData.district}, ${userData.state}`;
        } else {
          loc = userData.address || '';
        }
        setAddressInput(loc);
      }

      const { data: registrations } = await supabase.from('event_participants').select('*').eq('student_id', profile.id);
      const { data: allEvents } = await supabase.from('events').select('*');
      const { data: ranks } = await supabase.from('rankings').select('*').eq('student_id', profile.id);
      const { data: perf } = await supabase.from('performances').select('*').eq('student_id', profile.id);

      let highestAir = Infinity;
      let highestState = Infinity;
      let highestDistrict = Infinity;

      // Combine unique event IDs from both registrations and performances
      const eventIds = new Set([
        ...(registrations || []).map(r => r.event_id),
        ...(perf || []).map(p => p.event_id)
      ]);

      const combinedEvents = Array.from(eventIds).map(eventId => {
        const reg = registrations?.find(r => r.event_id === eventId) || { event_id: eventId, registration_date: new Date().toISOString() };
        const eventData = allEvents?.find(e => e.id === eventId) || {};
        const perfInfo = perf?.find(p => p.event_id === eventId);
        const rankInfo = ranks?.find(r => r.event_id === eventId);
        
        // Use rankings table for ranks, fallback to performances table if not found
        const combinedRank = {
          national_rank: rankInfo?.air_rank ?? rankInfo?.national_rank ?? perfInfo?.national_rank,
          state_rank: rankInfo?.state_rank ?? perfInfo?.state_rank,
          district_rank: rankInfo?.district_rank ?? perfInfo?.district_rank,
          metric_value: perfInfo?.metric_value ?? rankInfo?.metric_value
        };

        if (combinedRank.national_rank != null && combinedRank.national_rank < highestAir) highestAir = combinedRank.national_rank;
        if (combinedRank.state_rank != null && combinedRank.state_rank < highestState) highestState = combinedRank.state_rank;
        if (combinedRank.district_rank != null && combinedRank.district_rank < highestDistrict) highestDistrict = combinedRank.district_rank;

        return {
          ...reg,
          events: eventData,
          rank: (perfInfo || rankInfo) ? combinedRank : null
        };
      });

      combinedEvents.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date));
      setMyEvents(combinedEvents);

      setBestRank({
        air: highestAir !== Infinity ? highestAir : '--',
        state: highestState !== Infinity ? highestState : '--',
        district: highestDistrict !== Infinity ? highestDistrict : '--'
      });

    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveDob = async () => {
    if (!dobInput) {
      setDobError(true);
      return;
    }
    setDobError(false);
    try {
      const { error } = await supabase.from('students').update({ dob: dobInput }).eq('id', profile.id);
      if (error) throw error;
      setStudentData(prev => ({ ...prev, dob: dobInput }));
      setShowDobModal(false);
      showToast('Date of birth updated');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update DOB', 'error');
    }
  };

  const handleSaveProfile = async () => {
    if (!nameInput || !addressInput) {
      setProfileError(true);
      return;
    }
    setProfileError(false);
    
    // Parse address back to district and state if possible
    let district = '';
    let state = '';
    const parts = addressInput.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      district = parts[0];
      state = parts[1];
    }

    try {
      const updates = { full_name: nameInput };
      if (district && state) {
        updates.district = district;
        updates.state = state;
      } else {
        updates.address = addressInput;
      }

      const { error } = await supabase.from('students').update(updates).eq('id', profile.id);
      if (error) throw error;
      
      setStudentData(prev => ({ ...prev, ...updates }));
      setShowProfileModal(false);
      showToast('Profile details updated');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Quick validation
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Please upload an image smaller than 2MB', 'warning');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-pics/${profile.id}-${Date.now()}.${fileExt}`;
      
      // Upload to 'certificates' bucket (which we know exists) inside a profile-pics folder
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('students')
        .update({ photo_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setStudentData(prev => ({ ...prev, photo_url: publicUrl }));
      showToast('Profile picture updated successfully!');
    } catch (err) {
      console.error('Avatar upload error:', err);
      Swal.fire('Upload Failed', 'There was an error uploading your picture. Make sure the storage bucket is properly configured.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Helpers
  const calcAge = (dobIso) => {
    if (!dobIso) return '—';
    const dob = new Date(dobIso + "T00:00:00");
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  };

  const formatDate = (iso) => {
    if (!iso) return 'Not set';
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso; // fallback
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const initials = (name) => {
    if (!name) return 'ST';
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

  if (role !== 'student' || !profile) {
    return <Navigate to="/login" />;
  }

  const displayName = studentData?.full_name || profile.full_name;
  let displayLoc = '';
  if (studentData?.district && studentData?.state) {
    displayLoc = `${studentData.district}, ${studentData.state}`;
  } else {
    displayLoc = studentData?.address || `${profile.district}, ${profile.state}`;
  }

  const personalBest = [
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
              Student Dashboard
              <span className="brand-sub">AKI Talent Program</span>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="points-pill">
              <span className="dot"></span>
              <span className="label">Points</span>
              <span>{points}</span>
            </div>
            <Link to="/store" className="btn-shop">
              Shop Goodies
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-band"></div>

      <div className="shell" style={{ marginTop: 0 }}>
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="avatar" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => document.getElementById('avatarUpload').click()}>
            {uploadingAvatar ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' }}>
                 <div style={{ width: '30px', height: '30px', border: '3px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            ) : studentData?.photo_url ? (
              <>
                <img src={studentData.photo_url} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
              </>
            ) : (
              <>
                {initials(displayName)}
                <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
              </>
            )}
            <input type="file" id="avatarUpload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            <style>{`.avatar:hover .avatar-overlay { opacity: 1 !important; }`}</style>
          </div>

          <div className="profile-id-block">
            <div className="profile-name-row">
              <div className="profile-name">{displayName}</div>
              <button className="btn-edit-inline" aria-label="Update name and address" onClick={() => setShowProfileModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg>
              </button>
            </div>
            <div className="profile-meta-row">
              <span className="id-chip">{profile.custom_student_id}</span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                <span>{displayLoc}</span>
              </span>
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V6a2 2 0 012-2h12a2 2 0 012 2v16M4 22h16M9 22V9h6v13" /></svg>
                {studentData?.parent_name || 'Student Account'}
              </span>
            </div>
          </div>

          <div className="dob-block">
            <div className="dob-stat">
              <span className="label">Date of birth</span>
              <span className="value">{formatDate(studentData?.dob)}</span>
            </div>
            <div className="age-badge">
              <span className="num">{calcAge(studentData?.dob)}</span>
              <span className="txt">Years</span>
            </div>
            <button className="btn-edit-dob" aria-label="Update date of birth" onClick={() => setShowDobModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg>
            </button>
          </div>
        </div>

        {/* PERSONAL BEST RANKS */}
        <div className="section-heading">
          <h2>Personal Best Ranks</h2>
          <p>Your highest achievements across all participated events.</p>
        </div>
        <div className="ranks-row">
          {personalBest.map((r, i) => (
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

        {/* COMPETITIONS */}
        <div className="section-heading">
          <h2>My Competitions & Live Ranks</h2>
          <p>Every event you've entered, and how it's scored.</p>
        </div>

        <div className="competitions-wrap">
          {myEvents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No competitions yet. Join an event to see your ranks here!
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Competition Details</th>
                    <th>Performance Score</th>
                    <th>All India Rank</th>
                    <th>State Rank</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <div className="comp-name">{c.events?.name || 'Unknown Event'}</div>
                        <div className="comp-sub">{c.events?.sport_category || 'General'} • {formatDate(c.events?.event_date?.split('T')[0])}</div>
                      </td>
                      <td>
                        {c.rank ? <span className="score-value">{c.rank.metric_value} {c.events?.event_type}</span> : <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Pending</span>}
                      </td>
                      <td>
                        {c.rank?.national_rank ? (
                          <span className="rank-chip">
                            <span className="swatch" style={{ background: tierFor(c.rank.national_rank).color }}></span>
                            #{c.rank.national_rank}
                          </span>
                        ) : '--'}
                      </td>
                      <td>
                        {c.rank?.state_rank ? (
                          <span className="rank-chip">
                            <span className="swatch" style={{ background: tierFor(c.rank.state_rank).color }}></span>
                            #{c.rank.state_rank}
                          </span>
                        ) : '--'}
                      </td>
                      <td>
                        {c.rank ? (
                          <Link to={`/certificate/${c.event_id}/${profile.id}`} className="btn-cert">
                            Download
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          </Link>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="comp-cards">
                {myEvents.map((c, i) => (
                  <div className="comp-card" key={i}>
                    <div className="comp-card-top">
                      <div>
                        <div className="comp-name">{c.events?.name}</div>
                        <div className="comp-sub">{c.events?.sport_category}</div>
                      </div>
                      {c.rank && (
                        <Link to={`/certificate/${c.event_id}/${profile.id}`} className="btn-cert">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        </Link>
                      )}
                    </div>
                    <div className="comp-card-stats">
                      <div className="comp-stat">
                        <div className="label">Score</div>
                        <div className="val">{c.rank ? c.rank.metric_value : '--'}</div>
                      </div>
                      <div className="comp-stat">
                        <div className="label">AIR</div>
                        <div className="val">{c.rank?.national_rank ? `#${c.rank.national_rank}` : '--'}</div>
                      </div>
                      <div className="comp-stat">
                        <div className="label">State</div>
                        <div className="val">{c.rank?.state_rank ? `#${c.rank.state_rank}` : '--'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="foot-note">Data shown reflects your latest verified competition results.</footer>
      </div>

      {/* DOB MODAL */}
      <div className={`modal-overlay ${showDobModal ? 'open' : ''}`}>
        <div className="modal">
          <h3>Update date of birth</h3>
          <p className="hint">This keeps your age accurate for age-group eligibility across competitions.</p>
          <label className="field-label" htmlFor="dobInput">Date of birth</label>
          <input type="date" id="dobInput" className="field-input" value={dobInput} onChange={e => setDobInput(e.target.value)} />
          <div className={`field-error ${dobError ? 'show' : ''}`}>Please choose a valid date of birth.</div>
          <div className="modal-actions">
            <button className="btn-ghost" onClick={() => setShowDobModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveDob}>Save changes</button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <div className={`modal-overlay ${showProfileModal ? 'open' : ''}`}>
        <div className="modal">
          <h3>Update profile details</h3>
          <p className="hint">Keep your name and address current so certificates and mailers reach the right place.</p>
          <label className="field-label" htmlFor="nameInput">Full name</label>
          <input type="text" id="nameInput" className="field-input" style={{ marginBottom: 16 }} placeholder="e.g. Riya Kumari" value={nameInput} onChange={e => setNameInput(e.target.value)} />
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

export default StudentDashboard;
