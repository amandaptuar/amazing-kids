import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Trophy, Users, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Events = () => {
  useSEO({
    title: 'Events & Competitions',
    description: "Browse and register for upcoming Amazing Kids of India ranking competitions and events.",
    keywords: "kids sports events, youth competitions, amazing kids events",
    url: "https://amazingkidsofindia.com/events"
  });
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
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getCategoryGradient = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c === 'athlete') return 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)';
    if (c === 'highjump') return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
    if (c === 'throw') return 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)';
    if (c.includes('skate') || c.includes('skating')) return 'linear-gradient(135deg, #1e40af 0%, #60a5fa 100%)';
    if (c.includes('cycl')) return 'linear-gradient(135deg, #064e3b 0%, #34d399 100%)';
    if (c.includes('dance')) return 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)';
    if (c.includes('music') || c.includes('sing')) return 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)';
    return 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
  };

  // Map DB values to display labels
  const categoryFilters = [
    { label: 'All Programs', value: 'All' },
    { label: 'Athlete', value: 'athlete' },
    { label: 'High Jump', value: 'highjump' },
    { label: 'Throw', value: 'throw' },
  ];

  const renderRankBadge = (rank) => {
    if (rank === 1) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(251, 191, 36, 0.3)' }}>🥇</div>;
    if (rank === 2) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(203, 213, 225, 0.3)' }}>🥈</div>;
    if (rank === 3) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', color: '#9a3412', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(254, 215, 170, 0.3)' }}>🥉</div>;
    return <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>#{rank}</div>;
  };

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

    // --- RESTRICTION 3: Registration Window Check ---
    const regOpen = isRegistrationOpen(ev.reg_start_date, ev.reg_end_date);
    if (!regOpen || isEventFinished(ev.event_date)) {
      Swal.fire({ title: 'Registration Closed', text: "The registration window for this event has closed or the event has ended.", icon: 'error' });
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

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(ev => (ev.sport_category || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '0px', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      
      {/* Login Popup Modal */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', border: '1px solid rgba(226, 232, 240, 0.8)' }}
            >
              <button onClick={() => setShowLoginPopup(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                <X size={20} />
              </button>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#fffbeb', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto', border: '1px solid #fde68a' }}>
                <AlertCircle size={32} style={{ color: '#d97706' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Login Required</h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px', lineHeight: '1.6' }}>You must be logged into a Student account to register for active national tournaments.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => navigate('/login')} style={{ padding: '14px', backgroundColor: '#E9A132', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(233, 161, 50, 0.3)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d18f2b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E9A132'}>
                  Login to Account
                </button>
                <button onClick={() => navigate('/register/student')} style={{ padding: '14px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
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
        height: '42vh',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url("/assets/events_hero_banner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        paddingTop: '90px',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 18px', borderRadius: '30px', marginBottom: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Trophy size={16} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fbbf24' }}>Official Tournaments</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontFamily: 'var(--font-heading)', margin: '0 0 15px 0', letterSpacing: '-1.5px', fontWeight: 'bold' }}>
            National Arenas & Trials
          </h1>
          <p style={{ fontSize: '17px', maxWidth: '650px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6', color: '#e2e8f0' }}>
            Discover officially sanctioned events, register your profile, participate in trials, and climb the All India Rankings.
          </p>
        </motion.div>
      </section>

      {/* Category Filter Pills & Events Grid */}
      <section style={{ padding: '50px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header & Filter Pill Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '45px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 'bold' }}>Active Competitions</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Register directly to earn global ranking points.</p>
              </div>
            </div>

            {/* Premium Category Filters — using exact DB values */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              {categoryFilters.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedCategory(value)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedCategory === value ? '#E9A132' : '#e2e8f0',
                    backgroundColor: selectedCategory === value ? '#E9A132' : 'white',
                    color: selectedCategory === value ? 'white' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedCategory === value ? '0 4px 12px rgba(233, 161, 50, 0.2)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (selectedCategory !== value) {
                      e.currentTarget.style.borderColor = '#E9A132';
                      e.currentTarget.style.color = '#E9A132';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedCategory !== value) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#64748b' }}>
              <div style={{ width: '45px', height: '45px', border: '4px solid #e2e8f0', borderTopColor: '#E9A132', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Loading competitions...</h3>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <Calendar size={54} style={{ color: '#94a3b8', margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 'bold' }}>No Events Found</h3>
              <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>We couldn't find any active {selectedCategory !== 'All' ? `${selectedCategory} ` : ''}competitions right now. Please check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '30px' }}>
              {filteredEvents.map((ev, index) => {
                const regOpen = isRegistrationOpen(ev.reg_start_date, ev.reg_end_date);
                const isFinished = isEventFinished(ev.event_date);
                const eventDate = new Date(ev.event_date);
                
                return (
                  <motion.div 
                    key={ev.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)' }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Card Header (Dynamic Category Gradient) */}
                    <div style={{ padding: '22px 25px', background: getCategoryGradient(ev.sport_category), color: 'white', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '18px', right: '20px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {ev.sport_category || 'General'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ backgroundColor: 'white', color: '#0f172a', width: '56px', height: '60px', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>{eventDate.toLocaleString('default', { month: 'short' })}</span>
                          <span style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>{eventDate.getDate()}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontFamily: 'var(--font-heading)', lineHeight: '1.2', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', opacity: 0.9 }}>
                            <MapPin size={13} style={{ flexShrink: 0 }} /> 
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <Users size={16} style={{ color: '#1e88e5', marginBottom: '6px' }} />
                          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Age Bracket</div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '2px' }}>{ev.age_category}</div>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          <Trophy size={16} style={{ color: '#E9A132', marginBottom: '6px' }} />
                          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Format</div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '2px' }}>{ev.event_type}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        {/* Timeline / Register Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <Clock size={15} style={{ color: isFinished ? '#64748b' : (regOpen ? '#10b981' : '#ef4444'), flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', fontWeight: '700', color: isFinished ? '#64748b' : (regOpen ? '#10b981' : '#ef4444') }}>
                            {isFinished ? 'Tournament Concluded' : (regOpen ? 'Registration is Live' : 'Registration Closed')}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} style={{ color: '#E9A132', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px' }}><strong>Register by:</strong> {new Date(ev.reg_end_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Interactive Dynamic Action Buttons */}
                        {isFinished ? (
                          <button 
                            onClick={() => handleCheckWinners(ev)}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
                          >
                            <Trophy size={16} color="#fbbf24" style={{ flexShrink: 0 }} /> Check Winner List
                          </button>
                        ) : myRegistrations.includes(ev.id) ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', width: '100%', padding: '12px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: '1px solid #bbf7d0' }}>
                            <CheckCircle size={16} style={{ flexShrink: 0 }} /> Registered Successfully
                          </div>
                        ) : !regOpen ? (
                          <button 
                            disabled
                            style={{ width: '100%', padding: '12px', backgroundColor: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'not-allowed' }}
                          >
                            Registration Closed
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRegisterClick(ev)}
                            disabled={registeringId === ev.id}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: '#E9A132', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: registeringId === ev.id ? 'wait' : 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(233, 161, 50, 0.2)' }}
                            onMouseOver={(e) => { if(registeringId !== ev.id) e.currentTarget.style.backgroundColor = '#d18f2b'; }}
                            onMouseOut={(e) => { if(registeringId !== ev.id) e.currentTarget.style.backgroundColor = '#E9A132'; }}
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
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowWinnersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: '0', borderRadius: '24px', maxWidth: '780px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(226, 232, 240, 0.8)' }}
            >
              <div style={{ backgroundColor: '#0f172a', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trophy size={26} color="#fbbf24" />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Official Leaderboard</h2>
                    <p style={{ margin: '3px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>{selectedEventName}</p>
                  </div>
                </div>
                <button onClick={() => setShowWinnersModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px', borderRadius: '50%', display: 'flex', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '25px', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }}>
                {loadingWinners ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#E9A132', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }}></div>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Fetching live rankings...</span>
                  </div>
                ) : winnersList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                    <AlertCircle size={44} style={{ color: '#cbd5e1', margin: '0 auto 15px auto' }} />
                    <h3 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 6px 0', fontWeight: 'bold' }}>Results Under Compilation</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '380px', margin: '0 auto', lineHeight: '1.5' }}>Our technical board is processing the trial records. Rankings will go live shortly.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', width: '80px' }}>Rank</th>
                          <th style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>Student Name</th>
                          <th style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>School</th>
                          <th style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winnersList.map((winner, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: winner.air_rank <= 3 ? 'rgba(251, 191, 36, 0.02)' : 'white', transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '12px 20px', verticalAlign: 'middle' }}>
                              {renderRankBadge(winner.air_rank)}
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{winner.students?.full_name}</div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>ID: {winner.students?.custom_student_id}</div>
                            </td>
                            <td style={{ padding: '12px 20px', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
                              {winner.students?.schools?.school_name || 'Independent Candidate'}
                            </td>
                            <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: '700', color: '#E9A132', fontSize: '14px' }}>
                              {winner.metric_value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
