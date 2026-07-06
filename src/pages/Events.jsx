import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Trophy, Users, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Events = () => {
  const { user, role, profile } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registeringId, setRegisteringId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Winners Modal State
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [winnersList, setWinnersList] = useState([]);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');

  useEffect(() => {
    fetchEvents();
    if (role === 'student' && profile?.id) {
      fetchMyRegistrations();
    }
  }, [role, profile]);

  const fetchMyRegistrations = async () => {
    const { data } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('student_id', profile.id);
      
    if (data) {
      setMyRegistrations(data.map(r => r.event_id));
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('event_date', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const isRegistrationOpen = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Add one day to end date to make it inclusive
    endDate.setDate(endDate.getDate() + 1);
    
    return now >= startDate && now < endDate;
  };

  const isEventFinished = (eventDateStr) => {
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(23, 59, 59, 999);
    const now = new Date();
    return now > eventDate;
  };

  const handleCheckWinners = async (ev) => {
    setSelectedEventName(ev.name);
    setShowWinnersModal(true);
    setLoadingWinners(true);

    const { data, error } = await supabase
      .from('rankings')
      .select(`
        air_rank,
        state_rank,
        district_rank,
        metric_value,
        students (
          full_name,
          custom_student_id,
          schools (school_name)
        )
      `)
      .eq('event_id', ev.id)
      .order('air_rank', { ascending: true });
      
    if (data) {
      setWinnersList(data);
    }
    setLoadingWinners(false);
  };

  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleRegisterClick = async (ev) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    
    if (role !== 'student') {
      Swal.fire({ title: 'Access Denied', text: "Only Student accounts can register for competitions. Please login with a student account.", icon: 'error' });
      return;
    }

    // --- RESTRICTION 1: Profile Completion ---
    if (!profile.address) {
       Swal.fire({ title: 'Registration Blocked', text: "Please complete your profile (add your Address) by contacting your school or admin before registering for official events.", icon: 'warning' });
       return;
    }

    // --- RESTRICTION 2: Age Category Verification ---
    if (profile.dob) {
      const age = calculateAge(profile.dob);
      let maxAge = 99;

      if (ev.age_category === 'U-10') maxAge = 10;
      else if (ev.age_category === 'U-14') maxAge = 14;
      else if (ev.age_category === 'U-18') maxAge = 18;

      if (age > maxAge && ev.age_category !== 'Open') {
        Swal.fire({ title: 'Age Restriction', text: `You are ${age} years old. This event is strictly for the ${ev.age_category} category. You are not eligible to participate.`, icon: 'error' });
        return;
      }
    } else {
      Swal.fire({ title: 'Registration Blocked', text: "Your Date of Birth is missing from your profile. Please ask your school or admin to update your DOB to verify eligibility.", icon: 'warning' });
      return;
    }

    setRegisteringId(ev.id);
    try {
      const { error } = await supabase.from('event_participants').insert({
        event_id: ev.id,
        student_id: profile.id
      });
      
      if (error) {
        if (error.code === '23505') throw new Error('You are already registered for this event!');
        throw error;
      }
      
      // Award 500 points for participating!
      const { data: studentData } = await supabase.from('students').select('points').eq('id', profile.id).single();
      const currentPoints = studentData?.points || 0;
      await supabase.from('students').update({ points: currentPoints + 500 }).eq('id', profile.id);
      
      // Send Event Registration Email
      try {
        await emailjs.send(
          'service_f6n79v2',
          'template_cuxgyxy',
          {
            full_name: profile.full_name,
            email: user.email,
            event_name: ev.name,
            sport_category: ev.sport_category || 'General',
            age_category: ev.age_category,
            event_date: new Date(ev.event_date).toLocaleDateString(),
            event_venue: ev.venue
          },
          'UKEENwEz0TyMGGdVF'
        );
      } catch(emailError) {
        console.error('Failed to send event registration email:', emailError);
      }

      Swal.fire({ title: 'Success!', text: "Successfully Registered for the Event! 🎉 You earned 500 Global Points!", icon: 'success' });
      setMyRegistrations([...myRegistrations, ev.id]);
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message || "An error occurred while registering.", icon: 'error' });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      
      {/* Login Popup Modal */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <button onClick={() => setShowLoginPopup(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={32} style={{ color: 'var(--primary-blue)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', fontSize: '24px', color: 'var(--text-dark)' }}>Login Required</h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px', lineHeight: '1.6' }}>You must be logged into a Student account to register for competitions.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => navigate('/login')} style={{ padding: '14px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                  Login to Account
                </button>
                <button onClick={() => navigate('/register/student')} style={{ padding: '14px', backgroundColor: '#f1f5f9', color: 'var(--primary-dark)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                  Create Student Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '40vh',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e3a8a 100%)',
        color: 'white',
        textAlign: 'center',
        paddingTop: '80px',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 0)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '30px', marginBottom: '20px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Trophy size={16} style={{ color: 'var(--accent-orange)' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>Official Tournaments</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontFamily: 'var(--font-heading)', margin: '0 0 15px 0', letterSpacing: '-1px' }}>
            Live Competitions
          </h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6' }}>
            Discover upcoming national events, register your students, and compete for the top rank in India.
          </p>
        </motion.div>
      </section>

      {/* Events Grid Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', margin: '0 0 10px 0' }}>All Upcoming Events</h2>
              <p style={{ margin: 0, color: '#64748b' }}>Browse through our officially sanctioned national tournaments.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: '#64748b' }}>
              <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
              <h3>Loading Events Data...</h3>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <Calendar size={64} style={{ color: '#cbd5e1', margin: '0 auto 20px auto' }} />
              <h3 style={{ fontSize: '24px', color: 'var(--text-dark)', margin: '0 0 10px 0' }}>No Events Scheduled</h3>
              <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are currently no active competitions published in the database. Please check back later!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '30px' }}>
              {events.map((ev, index) => {
                const regOpen = isRegistrationOpen(ev.reg_start_date, ev.reg_end_date);
                const isFinished = isEventFinished(ev.event_date);
                const eventDate = new Date(ev.event_date);
                
                return (
                  <motion.div 
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Card Header (Date & Category) */}
                    <div style={{ padding: '25px', backgroundColor: 'var(--primary-dark)', color: 'white', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {ev.sport_category || 'General'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: 'white', color: 'var(--primary-dark)', width: '60px', height: '65px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b' }}>{eventDate.toLocaleString('default', { month: 'short' })}</span>
                          <span style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.1', fontFamily: 'var(--font-heading)' }}>{eventDate.getDate()}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>{ev.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', opacity: 0.8 }}>
                            <MapPin size={14} /> {ev.venue}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '30px 25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                          <Users size={18} style={{ color: 'var(--primary-blue)', marginBottom: '8px' }} />
                          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Age Group</div>
                          <div style={{ fontSize: '15px', color: 'var(--text-dark)', fontWeight: 'bold' }}>{ev.age_category}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                          <Trophy size={18} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
                          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Format</div>
                          <div style={{ fontSize: '15px', color: 'var(--text-dark)', fontWeight: 'bold' }}>{ev.event_type}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                          <Clock size={16} style={{ color: isFinished ? '#64748b' : (regOpen ? '#10b981' : '#ef4444') }} />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: isFinished ? '#64748b' : (regOpen ? '#10b981' : '#ef4444') }}>
                            {isFinished ? 'Event Concluded' : (regOpen ? 'Registration is Open' : 'Registration Closed')}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '25px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                          <strong>Window:</strong> {new Date(ev.reg_start_date).toLocaleDateString()} - {new Date(ev.reg_end_date).toLocaleDateString()}
                        </div>

                        {isFinished ? (
                          <button 
                            onClick={() => handleCheckWinners(ev)}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)' }}
                          >
                            <Trophy size={18} color="#fbbf24" /> Check Winner List
                          </button>
                        ) : myRegistrations.includes(ev.id) ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', border: '1px solid #bbf7d0' }}>
                            <CheckCircle size={18} /> Registered Successfully
                          </div>
                        ) : !regOpen ? (
                          <button 
                            disabled
                            style={{ width: '100%', padding: '14px', backgroundColor: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'not-allowed' }}
                          >
                            Registration Closed
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRegisterClick(ev)}
                            disabled={registeringId === ev.id}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', padding: '14px', backgroundColor: 'var(--accent-orange)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: registeringId === ev.id ? 'wait' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
                            onMouseOver={(e) => { if(registeringId !== ev.id) e.currentTarget.style.backgroundColor = '#ea580c'; }}
                            onMouseOut={(e) => { if(registeringId !== ev.id) e.currentTarget.style.backgroundColor = 'var(--accent-orange)'; }}
                          >
                            {registeringId === ev.id ? 'Processing...' : 'Register for Event'}
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Winners Modal */}
      <AnimatePresence>
        {showWinnersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}
            onClick={() => setShowWinnersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: '0', borderRadius: '24px', maxWidth: '800px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
            >
              <div style={{ backgroundColor: 'var(--primary-dark)', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Trophy size={28} color="#fbbf24" />
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '24px' }}>Official Winner List</h2>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>{selectedEventName}</p>
                  </div>
                </div>
                <button onClick={() => setShowWinnersModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ padding: '30px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
                {loadingWinners ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }}></div>
                    Fetching live rankings...
                  </div>
                ) : winnersList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <AlertCircle size={48} style={{ color: '#cbd5e1', margin: '0 auto 15px auto' }} />
                    <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', margin: '0 0 10px 0' }}>Results Not Published Yet</h3>
                    <p style={{ color: '#64748b' }}>The event administrators have not uploaded the final scores for this competition.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', width: '80px' }}>Rank</th>
                        <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>Student Profile</th>
                        <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>Institution</th>
                        <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Score / Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {winnersList.map((winner, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: winner.air_rank <= 3 ? 'rgba(251, 191, 36, 0.05)' : 'white' }}>
                          <td style={{ padding: '20px', fontWeight: 'bold', fontSize: '18px', color: winner.air_rank === 1 ? '#fbbf24' : winner.air_rank === 2 ? '#94a3b8' : winner.air_rank === 3 ? '#b45309' : '#64748b' }}>
                            #{winner.air_rank}
                          </td>
                          <td style={{ padding: '20px' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '15px' }}>{winner.students?.full_name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {winner.students?.custom_student_id}</div>
                          </td>
                          <td style={{ padding: '20px', color: '#64748b', fontSize: '14px' }}>
                            {winner.students?.schools?.school_name || 'Independent'}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-blue)', fontSize: '16px' }}>
                            {winner.metric_value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Events;
