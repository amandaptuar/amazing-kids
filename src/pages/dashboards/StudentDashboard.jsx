import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Trophy, Medal, Star, Target, MapPin, Calendar, Activity, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const StudentDashboard = () => {
  const { role, profile, loading } = useAuth();
  
  const [myEvents, setMyEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [bestRank, setBestRank] = useState({ air: '--', state: '--', district: '--' });
  const [isBirthday, setIsBirthday] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [redeemingId, setRedeemingId] = useState(null);

  const goodies = [
    { id: 1, name: 'Amazing Kids Cap', cost: 1000, icon: '🧢', color: '#f59e0b', desc: 'Premium cotton cap' },
    { id: 2, name: 'Sports Sipper', cost: 1500, icon: '🥤', color: '#3b82f6', desc: '750ml leak-proof bottle' },
    { id: 3, name: 'Champion T-Shirt', cost: 3000, icon: '👕', color: '#10b981', desc: 'Breathable dry-fit tee' },
    { id: 4, name: 'Smart Fitness Band', cost: 8000, icon: '⌚', color: '#8b5cf6', desc: 'Track your activity' }
  ];

  const handleRedeem = async (goodie) => {
    if (points < goodie.cost) {
      Swal.fire({
        title: 'Insufficient Points',
        text: `You need ${goodie.cost - points} more points to redeem the ${goodie.name}. Play arcade games or win tournaments to earn more!`,
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    const result = await Swal.fire({
      title: 'Confirm Redemption',
      text: `Are you sure you want to spend ${goodie.cost} points on ${goodie.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, redeem it!'
    });

    if (result.isConfirmed) {
      setRedeemingId(goodie.id);
      try {
        const newPoints = points - goodie.cost;
        const { error } = await supabase.from('students').update({ points: newPoints }).eq('id', profile.id);
        
        if (error) throw error;
        
        setPoints(newPoints);
        Swal.fire({
          title: 'Success!',
          text: `You have successfully redeemed the ${goodie.name}. It will be shipped to your registered address or school.`,
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while redeeming. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setRedeemingId(null);
      }
    }
  };

  useEffect(() => {
    if (role === 'student' && profile) {
      fetchStudentData();
    }
  }, [role, profile]);

  const fetchStudentData = async () => {
    setDataLoading(true);
    try {
      console.log("Fetching for profile ID:", profile.id);
      
      // 0. Fetch user points explicitly
      const { data: userData } = await supabase.from('students').select('points, dob').eq('id', profile.id).single();
      if (userData) {
        setPoints(userData.points || 0);
        // Check birthday
        if (userData.dob) {
          const dobDate = new Date(userData.dob);
          const today = new Date();
          if (dobDate.getMonth() === today.getMonth() && dobDate.getDate() === today.getDate()) {
            setIsBirthday(true);
            setShowBirthdayModal(true);
          }
        }
      }

      // 1. Fetch Registrations
      const { data: registrations, error: regError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('student_id', profile.id);

      // 2. Fetch Events manually
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('*');

      // 3. Fetch Rankings manually
      const { data: ranks, error: ranksError } = await supabase
        .from('rankings')
        .select('*')
        .eq('student_id', profile.id);

      // Combine them in JS to prevent any Supabase inner join failures
      let highestAir = Infinity;
      let highestState = Infinity;
      let highestDistrict = Infinity;

      const combinedEvents = (registrations || []).map(reg => {
        const eventData = allEvents?.find(e => e.id === reg.event_id) || {};
        const rankInfo = ranks?.find(r => r.event_id === reg.event_id);
        
        if (rankInfo) {
          if (rankInfo.air_rank < highestAir) highestAir = rankInfo.air_rank;
          if (rankInfo.state_rank < highestState) highestState = rankInfo.state_rank;
          if (rankInfo.district_rank < highestDistrict) highestDistrict = rankInfo.district_rank;
        }

        return {
          ...reg,
          events: eventData,
          rank: rankInfo || null
        };
      });

      // Sort by registration date descending
      combinedEvents.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date));

      setMyEvents(combinedEvents);

      if (highestAir !== Infinity) {
        setBestRank({
          air: highestAir,
          state: highestState,
          district: highestDistrict
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
  if (role !== 'student' || !profile) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <h2 style={{ color: '#ef4444' }}>Unauthorized Access</h2>
        <p>You must be logged in as a registered Student to view this page.</p>
        <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>Login Here</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--bg-light)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      
      {/* Student Profile Header */}
      <div style={{ backgroundColor: 'white', padding: '40px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={profile.photo_url || "https://randomuser.me/api/portraits/lego/1.jpg"} 
              alt="Student Profile" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-light)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} 
            />
            {bestRank.air === 1 && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fbbf24', padding: '8px', borderRadius: '50%', border: '3px solid white' }}>
                <Trophy size={20} style={{ color: 'white' }} />
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '32px', color: 'var(--text-dark)' }}>{profile.full_name}</h1>
              <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Student Account</span>
            </div>
            <p style={{ margin: '0 0 10px 0', color: 'var(--primary-blue)', fontWeight: 'bold' }}>ID: {profile.custom_student_id}</p>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> {profile.district}, {profile.state}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Target size={16}/> {profile.schools?.school_name || 'Independent Participant'}</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', backgroundColor: '#fffbeb', padding: '15px 25px', borderRadius: '16px', border: '1px solid #fde68a', boxShadow: '0 10px 20px rgba(251,191,36,0.1)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#b45309', fontWeight: 'bold', letterSpacing: '1px' }}>Global Points</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'monospace' }}>{points.toLocaleString()}</div>
            <Link to="/store" style={{ display: 'inline-block', marginTop: '5px', fontSize: '12px', color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: 'bold' }}>Shop Goodies &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        
        {/* Global Rankings Overview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', margin: '0 0 5px 0' }}>Personal Best Ranks</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Your highest achievements across all participated events.</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          <motion.div whileHover={{ y: -5 }} style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-orange)', letterSpacing: '1px' }}>All India Rank</p>
              <h3 style={{ margin: 0, fontSize: '36px', fontFamily: 'var(--font-heading)' }}>#{bestRank.air}</h3>
            </div>
            <Trophy size={48} style={{ opacity: 0.2 }} />
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} style={{ backgroundColor: '#10b981', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>State Rank</p>
              <h3 style={{ margin: 0, fontSize: '36px', fontFamily: 'var(--font-heading)' }}>#{bestRank.state}</h3>
            </div>
            <Medal size={48} style={{ opacity: 0.2 }} />
          </motion.div>

          <motion.div whileHover={{ y: -5 }} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>District Rank</p>
              <h3 style={{ margin: 0, fontSize: '36px', fontFamily: 'var(--font-heading)' }}>#{bestRank.district}</h3>
            </div>
            <Star size={48} style={{ opacity: 0.2 }} />
          </motion.div>
        </div>

        {/* Participated Events */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div style={{ padding: '25px 30px', borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0, color: 'var(--text-dark)' }}>My Competitions & Live Ranks</h2>
          </div>
          
          {dataLoading ? (
            <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>Syncing your records...</div>
          ) : myEvents.length === 0 ? (
            <div style={{ padding: '60px 30px', textAlign: 'center' }}>
              <Calendar size={48} style={{ color: '#cbd5e1', margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', margin: '0 0 10px 0' }}>No Events Yet</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>You haven't participated in any events yet.</p>
              <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                Browse Upcoming Events <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'white', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Competition Details</th>
                    <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Performance Score</th>
                    <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>All India Rank</th>
                    <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>State Rank</th>
                    <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((event) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 30px' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '15px' }}>{event.events?.name || 'Unknown Event'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', textTransform: 'capitalize' }}>
                          {event.events?.sport_category || 'General'} • {event.events ? new Date(event.events.event_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '20px 30px' }}>
                        {event.rank ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#eff6ff', padding: '6px 12px', borderRadius: '8px', color: 'var(--primary-blue)', fontWeight: 'bold' }}>
                            <Activity size={16} /> {event.rank.metric_value}
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#94a3b8', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '8px' }}>Pending Evaluation</span>
                        )}
                      </td>
                      <td style={{ padding: '20px 30px' }}>
                        {event.rank ? (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-orange)' }}>#{event.rank.air_rank}</span>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>--</span>
                        )}
                      </td>
                      <td style={{ padding: '20px 30px' }}>
                        {event.rank ? (
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>#{event.rank.state_rank}</span>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>--</span>
                        )}
                      </td>
                      <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                        {event.rank ? (
                          <Link 
                            to={`/certificate/${event.event_id}/${profile.id}`} 
                            style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: 'var(--primary-blue)', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = 'var(--primary-blue)'; }}
                          >
                            Download
                          </Link>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          )}
        </div>

      </div>
      {/* Birthday Modal */}
      <AnimatePresence>
        {showBirthdayModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
            onClick={() => setShowBirthdayModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              style={{ backgroundColor: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center', maxWidth: '500px', position: 'relative', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti effect using framer motion divs for simplicity */}
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ width: '200px', height: '200px', position: 'absolute', top: '-100px', left: '-100px', background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(255,255,255,0) 70%)' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ width: '200px', height: '200px', position: 'absolute', bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(255,255,255,0) 70%)' }} />
              
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>🎂</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', color: 'var(--primary-dark)', margin: '0 0 15px 0' }}>Happy Birthday!</h2>
              <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '30px' }}>
                Wishing you a fantastic day filled with joy and success. Keep being amazing, <strong style={{color: 'var(--primary-blue)'}}>{profile.full_name}</strong>!
              </p>
              
              <button 
                onClick={() => setShowBirthdayModal(false)}
                style={{ backgroundColor: 'var(--accent-orange)', color: 'white', border: 'none', padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer' }}
              >
                Thank You!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentDashboard;
