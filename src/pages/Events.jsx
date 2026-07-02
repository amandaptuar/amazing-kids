import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Trophy, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

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

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
              {events.map((ev, index) => {
                const regOpen = isRegistrationOpen(ev.reg_start_date, ev.reg_end_date);
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
                          <Clock size={16} style={{ color: regOpen ? '#10b981' : '#ef4444' }} />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: regOpen ? '#10b981' : '#ef4444' }}>
                            {regOpen ? 'Registration is Open' : 'Registration Closed'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '25px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                          <strong>Window:</strong> {new Date(ev.reg_start_date).toLocaleDateString()} - {new Date(ev.reg_end_date).toLocaleDateString()}
                        </div>

                        {ev.sport_category ? (
                          <Link 
                            to={`/program/${ev.sport_category}`} 
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', padding: '14px', backgroundColor: 'var(--primary-blue)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-blue)'}
                          >
                            View Live Rankings <ArrowRight size={18} />
                          </Link>
                        ) : (
                          <button 
                            disabled
                            style={{ width: '100%', padding: '14px', backgroundColor: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'not-allowed' }}
                          >
                            No Rankings Available
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
