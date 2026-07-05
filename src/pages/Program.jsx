import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { programsData } from '../data/programsData';
import { X, Trophy, MapPin, Calendar, Activity, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Reusable Modal Component
const ProfileModal = ({ participant, metricName, onClose }) => {
  if (!participant) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            <X size={20} style={{ color: 'var(--text-dark)' }} />
          </button>

          {/* Modal Header */}
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '40px 20px 20px', textAlign: 'center', borderBottom: '4px solid var(--accent-orange)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', fontWeight: 'bold', margin: '0 auto 15px auto', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              {participant.students?.full_name?.charAt(0) || '?'}
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>{participant.students?.full_name}</h2>
            <div style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>AIR Rank: #{participant.air_rank}</div>
          </div>

          {/* Modal Details Grid */}
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Calendar size={18} style={{ color: 'var(--primary-blue)' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase' }}>Date of Birth</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{participant.students?.dob || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Activity size={18} style={{ color: 'var(--primary-blue)' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase' }}>{metricName || 'Score/Time'}</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{participant.metric_value}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', gridColumn: '1 / -1' }}>
                <MapPin size={18} style={{ color: 'var(--primary-blue)' }} />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase' }}>Location Details</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    Dist: {participant.students?.district}, {participant.students?.state} <br/>
                    School: {participant.students?.schools?.school_name || 'Independent'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const Program = () => {
  const { category } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  
  // Real-time Supabase State
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRankings, setLoadingRankings] = useState(false);
  
  const categoryKey = category?.toLowerCase();
  const data = programsData[categoryKey];

  useEffect(() => {
    setCurrentPage(1);
    fetchEventsForCategory();
  }, [categoryKey]);

  useEffect(() => {
    if (selectedEventId) {
      fetchRankingsForEvent(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchEventsForCategory = async () => {
    setLoadingEvents(true);
    const { data: eventList, error } = await supabase
      .from('events')
      .select('*')
      .eq('sport_category', categoryKey)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (!error && eventList && eventList.length > 0) {
      setEvents(eventList);
      setSelectedEventId(eventList[0].id); // Auto-select the most recent event
    } else {
      setEvents([]);
      setSelectedEventId(null);
      setRankings([]);
    }
    setLoadingEvents(false);
  };

  const fetchRankingsForEvent = async (eventId) => {
    setLoadingRankings(true);
    const { data: rankList, error } = await supabase
      .from('rankings')
      .select(`
        *,
        students (
          full_name,
          dob,
          state,
          district,
          schools ( school_name )
        )
      `)
      .eq('event_id', eventId)
      .order('air_rank', { ascending: true });

    if (!error && rankList) {
      setRankings(rankList);
    }
    setLoadingRankings(false);
  };

  if (!data) {
    return <Navigate to="/" replace />; // Redirect if invalid category
  }

  const { title, heroImage, description, metricName } = data;
  
  const topPerformers = rankings.slice(0, 3);
  
  // Pagination logic (20 per page)
  const itemsPerPage = 20;
  const totalPages = Math.ceil(rankings.length / itemsPerPage);
  const currentParticipants = rankings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Dynamic Hero Banner */}
      <section style={{
        position: 'relative',
        height: '45vh',
        minHeight: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--primary-dark)',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("${heroImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        paddingTop: '80px' // For fixed header
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontFamily: 'var(--font-heading)', margin: '0 0 15px 0', textTransform: 'uppercase' }}>
            {title}
          </h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6' }}>
            {description}
          </p>
        </motion.div>
      </section>

      {/* EVENT SELECTOR */}
      <section style={{ padding: '40px 0 0 0', backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', width: '100%' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '16px' }}>Select Competition:</div>
            
            {loadingEvents ? (
              <div style={{ color: '#64748b' }}>Loading active events...</div>
            ) : events.length === 0 ? (
              <div style={{ color: '#ef4444', fontWeight: 'bold' }}>No active events found for {title}.</div>
            ) : (
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedEventId || ''} 
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  style={{ appearance: 'none', padding: '12px 40px 12px 20px', fontSize: '15px', fontWeight: 'bold', color: 'var(--primary-blue)', backgroundColor: 'white', border: '2px solid var(--primary-blue)', borderRadius: '8px', cursor: 'pointer', outline: 'none', width: '100%', minWidth: '250px', maxWidth: '350px' }}
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name} ({ev.age_category})</option>
                  ))}
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--primary-blue)', pointerEvents: 'none' }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      <section style={{ padding: '60px 0 40px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h4 style={{ color: 'var(--accent-orange)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>INDIA'S BEST</h4>
            <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', margin: '0' }}>TOP PERFORMERS</h2>
          </div>

          {loadingRankings ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Generating Live Leaderboard...</div>
          ) : rankings.length === 0 && events.length > 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>No scores submitted for this event yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px' }}>
              {topPerformers.map((rank, index) => (
                <motion.div 
                  key={rank.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ backgroundColor: 'var(--primary-dark)', padding: '30px 20px 20px', position: 'relative' }}>
                    {index === 0 && <Trophy size={32} style={{ position: 'absolute', top: '15px', right: '15px', color: '#fbbf24' }} />}
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid white', margin: '0 auto', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', fontWeight: 'bold' }}>
                      {rank.students?.full_name?.charAt(0) || '?'}
                    </div>
                  </div>
                  <div style={{ padding: '25px 20px' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>{rank.students?.full_name}</h3>
                    <div style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>Rank #{rank.air_rank} • {rank.metric_value}</div>
                    
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-light)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ marginBottom: '5px' }}><strong>School:</strong> {rank.students?.schools?.school_name || 'Independent'}</div>
                      <div><strong>State:</strong> {rank.students?.state}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Paginated Rank List Table */}
      {rankings.length > 0 && (
        <section style={{ padding: '40px 0' }}>
          <div className="container">
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              
              <div style={{ padding: '25px 30px', backgroundColor: 'var(--primary-dark)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>LIVE NATIONAL RANKING LIST</h3>
                <span style={{ fontSize: '14px', opacity: 0.8 }}>Showing Page {currentPage} of {totalPages}</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-light)', fontSize: '13px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Rank</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Profile</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{metricName || 'Score'}</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>State</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>School</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentParticipants.map((rank, idx) => (
                      <tr key={rank.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>#{rank.air_rank}</td>
                        <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: 'var(--primary-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                            {rank.students?.full_name?.charAt(0)}
                          </div>
                          <span style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '15px' }}>{rank.students?.full_name}</span>
                        </td>
                        <td style={{ padding: '15px 20px', color: 'var(--text-dark)', fontWeight: 'bold' }}>{rank.metric_value}</td>
                        <td style={{ padding: '15px 20px', color: 'var(--text-light)', fontSize: '14px' }}>{rank.students?.state}</td>
                        <td style={{ padding: '15px 20px', color: 'var(--text-light)', fontSize: '14px' }}>{rank.students?.schools?.school_name || 'Independent'}</td>
                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                          <button 
                            onClick={() => setSelectedParticipant(rank)}
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--primary-blue)',
                              border: '1px solid var(--primary-blue)',
                              padding: '6px 15px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--primary-blue)'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--primary-blue)'; }}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px', backgroundColor: 'var(--bg-light)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: currentPage === page ? 'var(--primary-blue)' : 'white',
                        color: currentPage === page ? 'white' : 'var(--text-dark)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </section>
      )}

      {/* Render Modal if a participant is selected */}
      <ProfileModal 
        participant={selectedParticipant} 
        metricName={metricName}
        onClose={() => setSelectedParticipant(null)} 
      />

    </main>
  );
};

export default Program;
