import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { programsData } from '../data/programsData';
import { X, Trophy, MapPin, Calendar, Activity, ChevronDown, Award, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import * as india from '../lib/indiaData';

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
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(255, 255, 255, 0.9)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              cursor: 'pointer', 
              zIndex: 10, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
            onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '45px 20px 30px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', border: '4px solid white', margin: '0 auto 15px auto', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '36px', fontWeight: 'bold', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
              {participant.photoUrl ? (
                <img src={participant.photoUrl} alt={participant.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                participant.fullName?.charAt(0) || '?'
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 'bold' }}>{participant.fullName}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(233, 161, 50, 0.2)', color: '#fbbf24', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', marginTop: '10px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <Trophy size={14} /> National Rank: #{participant.rank}
            </div>
          </div>

          {/* Modal Details Grid */}
          <div style={{ padding: '30px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(30, 136, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e88e5', flexShrink: 0 }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Date of Birth</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>{participant.dob || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(233, 161, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E9A132', flexShrink: 0 }}>
                  <Activity size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>{metricName || 'Performance'}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>{participant.metricValue}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', flexShrink: 0, marginTop: '2px' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Affiliation & Location</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '4px', lineHeight: '1.5' }}>
                    {participant.schoolName} <br />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{participant.district ? `${participant.district}, ` : ''}{participant.state}</span>
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
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  
  // Real-time Supabase State
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRankings, setLoadingRankings] = useState(false);
  
  // Filters
  const [genderFilter, setGenderFilter] = useState('All');
  const [ageGroupFilter, setAgeGroupFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  
  const categoryKey = category?.toLowerCase();
  const data = programsData[categoryKey];

  useEffect(() => {
    if (data) {
      setCurrentPage(1);
      fetchEventsForCategory();
    }
  }, [categoryKey]);

  useEffect(() => {
    if (selectedEventId) {
      fetchRankingsForEvent(selectedEventId);
    } else {
      setRankings([]);
    }
  }, [selectedEventId]);

  const fetchEventsForCategory = async () => {
    setLoadingEvents(true);
    
    // Support plural and alternative forms in the database
    let categorySearchList = [categoryKey];
    if (categoryKey === 'athlete') categorySearchList.push('athletics');
    if (categoryKey === 'skater') categorySearchList.push('skating', 'skate');
    if (categoryKey === 'cyclist') categorySearchList.push('cycling', 'cycle');
    if (categoryKey === 'dancer') categorySearchList.push('dancing', 'dance');
    if (categoryKey === 'musician') categorySearchList.push('singing', 'music', 'song');
    if (categoryKey === 'artist') categorySearchList.push('drawing', 'art', 'painting');

    const { data: eventList, error } = await supabase
      .from('events')
      .select('*')
      .in('sport_category', categorySearchList)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (!error && eventList && eventList.length > 0) {
      setEvents(eventList);
      setSelectedEventId(eventList[0].id);
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
          gender,
          photo_url,
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

  // Render Rank Badge Helper
  const renderRankBadge = (rank) => {
    if (rank === 1) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(251, 191, 36, 0.3)' }}>🥇</div>;
    if (rank === 2) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(203, 213, 225, 0.3)' }}>🥈</div>;
    if (rank === 3) return <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', color: '#9a3412', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(254, 215, 170, 0.3)' }}>🥉</div>;
    return <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>#{rank}</div>;
  };

  // Normalize real Supabase rankings only
  const normalizedList = rankings.map((item, index) => ({
    id: item.id,
    rank: item.air_rank || (index + 1),
    fullName: item.students?.full_name,
    photoUrl: item.students?.photo_url,
    dob: item.students?.dob,
    gender: item.students?.gender,
    metricValue: item.metric_value,
    state: item.students?.state,
    district: item.students?.district,
    schoolName: item.students?.schools?.school_name || 'Independent Candidate',
  }));

  // Filter normalized list
  const filteredList = normalizedList.filter(p => {
    let matchGender = true;
    if (genderFilter !== 'All') {
       matchGender = (p.gender || '').toLowerCase() === genderFilter.toLowerCase();
    }
    
    let matchAge = true;
    if (ageGroupFilter !== 'All') {
       // Parse DOB format: DD-MM-YYYY or YYYY-MM-DD
       let dobYear = 2015; // default fallback
       if (p.dob) {
         const parts = p.dob.split('-');
         if (parts.length === 3) {
           // check if YYYY is first or last
           dobYear = parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
         }
       }
       const age = new Date().getFullYear() - dobYear;
       if (ageGroupFilter === 'U-10') matchAge = age <= 10;
       else if (ageGroupFilter === 'U-14') matchAge = age > 10 && age <= 14;
       else if (ageGroupFilter === 'U-18') matchAge = age > 14 && age <= 18;
    }
    
    let matchState = true;
    if (stateFilter !== 'All') {
       matchState = p.state === stateFilter;
    }
    
    let matchDistrict = true;
    if (districtFilter !== 'All') {
       matchDistrict = p.district === districtFilter;
    }

    return matchGender && matchAge && matchState && matchDistrict;
  });

  // Re-rank items after filter is applied
  const dynamicRankings = filteredList.map((p, index) => ({
    ...p,
    dynamic_rank: index + 1
  }));

  const topPerformers = dynamicRankings.slice(0, 3);
  
  // Pagination logic (20 per page)
  const itemsPerPage = 20;
  const totalPages = Math.ceil(dynamicRankings.length / itemsPerPage);
  const currentParticipants = dynamicRankings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allStates = india.getAllStates();
  const availableDistricts = stateFilter === 'All' 
    ? [] 
    : india.getDistrictsByState(stateFilter) || [];

  const handleStateChange = (e) => {
    setStateFilter(e.target.value);
    setDistrictFilter('All');
    setCurrentPage(1);
  };


  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      
      {/* Dynamic Hero Banner */}
      <section style={{
        position: 'relative',
        height: '42vh',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url("${heroImage}")`,
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
            <Award size={16} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fbbf24' }}>Official Rankings</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontFamily: 'var(--font-heading)', margin: '0 0 15px 0', letterSpacing: '-1.5px', fontWeight: 'bold' }}>
            {title}
          </h1>
          <p style={{ fontSize: '17px', maxWidth: '650px', margin: '0 auto', opacity: 0.9, lineHeight: '1.6', color: '#e2e8f0' }}>
            {description}
          </p>
        </motion.div>
      </section>


      {/* No Events Empty State */}
      {!loadingEvents && events.length === 0 && (
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '60px 40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🏆</div>
            <h2 style={{ fontSize: '22px', color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '0 0 12px 0', fontWeight: 'bold' }}>No Events Published Yet</h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: '0 0 28px 0' }}>There are no published events for this program right now. Check back soon or register your school to participate in upcoming national trials.</p>
            <button
              onClick={() => navigate('/events')}
              style={{ backgroundColor: '#E9A132', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#d48a20'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#E9A132'}
            >
              View All Events
            </button>
          </div>
        </section>
      )}

      {/* EVENT SELECTOR (only if database events exist) */}
      {events.length > 0 && (
        <section style={{ padding: '35px 0 0 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px 25px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} style={{ color: '#E9A132' }} />
                <span>Select Event Arena:</span>
              </div>
              
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <select 
                  value={selectedEventId || ''} 
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  style={{ appearance: 'none', width: '100%', padding: '10px 40px 10px 18px', fontSize: '14px', fontWeight: '700', color: '#0f172a', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#E9A132'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name} ({ev.age_category})</option>
                  ))}
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '15px', top: '12px', color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Performers Section */}
      <section style={{ padding: '50px 0 30px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#E9A132', fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>National Arena</span>
            <h2 style={{ fontSize: '32px', color: '#0f172a', fontFamily: 'var(--font-heading)', margin: '5px 0 0 0', fontWeight: 'bold' }}>TOP PERFORMERS</h2>
          </div>

          {loadingRankings ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#E9A132', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
              <h4 style={{ fontWeight: '600' }}>Compiling leaderboard...</h4>
            </div>
          ) : dynamicRankings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
              <Search size={48} style={{ color: '#94a3b8', margin: '0 auto 15px auto' }} />
              <h3 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 'bold' }}>No Rankings Found</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>No participants found matching the selected search criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '30px', justifyContent: 'center' }}>
              {topPerformers.map((rank, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const borderGlow = isFirst 
                  ? '0 15px 35px rgba(251, 191, 36, 0.12)' 
                  : (isSecond ? '0 10px 25px rgba(148, 163, 184, 0.08)' : '0 10px 25px rgba(249, 115, 22, 0.08)');
                
                const borderColor = isFirst ? '#fcd34d' : (isSecond ? '#cbd5e1' : '#fed7aa');
                
                return (
                  <motion.div 
                    key={rank.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      textAlign: 'center',
                      boxShadow: borderGlow,
                      border: `1.5px solid ${borderColor}`,
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Crown badge for rank 1 */}
                    {isFirst && (
                      <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#fcd34d', color: '#78350f', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' }}>
                        CHAMPION
                      </div>
                    )}
                    
                    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '35px 20px 25px', position: 'relative' }}>
                      <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px solid white', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', overflow: 'hidden' }}>
                        {rank.photoUrl ? (
                          <img src={rank.photoUrl} alt={rank.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          rank.fullName?.charAt(0) || '?'
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '25px 20px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontFamily: 'var(--font-heading)', color: '#0f172a', fontWeight: 'bold' }}>{rank.fullName}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyBehavior: 'space-between', width: '100%', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                        {renderRankBadge(rank.dynamic_rank)}
                        <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px' }}>{rank.metricValue}</span>
                      </div>
                      
                      <div style={{ backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '12px', fontSize: '13px', color: '#64748b', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <strong>School:</strong> 
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{rank.schoolName}</span>
                        </div>
                        <div><strong>State:</strong> {rank.state}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Paginated Rank List Table */}
      {dynamicRankings.length > 0 && (
        <section style={{ padding: '30px 0 50px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              
              {/* Header with filters */}
              <div className="filter-header-container" style={{ padding: '25px 30px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>LIVE LEADERBOARD</span>
                    {stateFilter !== 'All' && <span style={{ fontSize: '13px', fontWeight: 'normal', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '15px' }}>{stateFilter}</span>}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px', display: 'block' }}>Ranks update dynamically based on search filters</span>
                </div>
                
                <div className="filter-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={genderFilter} onChange={e => {setGenderFilter(e.target.value); setCurrentPage(1);}} className="filter-select" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '13px', backgroundColor: '#1e293b', cursor: 'pointer' }}>
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  
                  <select value={ageGroupFilter} onChange={e => {setAgeGroupFilter(e.target.value); setCurrentPage(1);}} className="filter-select" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '13px', backgroundColor: '#1e293b', cursor: 'pointer' }}>
                    <option value="All">All Ages</option>
                    <option value="U-10">Under 10</option>
                    <option value="U-14">Under 14</option>
                    <option value="U-18">Under 18</option>
                  </select>
                  
                  {/* State Filter */}
                  <select value={stateFilter} onChange={handleStateChange} className="filter-select" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '13px', backgroundColor: '#1e293b', cursor: 'pointer' }}>
                    <option value="All">All States (National)</option>
                    {allStates.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  
                  {/* District Filter */}
                  {stateFilter !== 'All' && (
                    <select value={districtFilter} onChange={e => {setDistrictFilter(e.target.value); setCurrentPage(1);}} className="filter-select" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '13px', backgroundColor: '#1e293b', cursor: 'pointer' }}>
                      <option value="All">All Districts</option>
                      {availableDistricts.map(dst => <option key={dst} value={dst}>{dst}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Table Layout (Hidden on Mobile) */}
              <div className="table-responsive-desktop" style={{ display: 'block', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', width: '80px' }}>Rank</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>Student Profile</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>{metricName || 'Score'}</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>State</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0' }}>School</th>
                      <th style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentParticipants.map((rank) => (
                      <tr key={rank.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'white', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                          {renderRankBadge(rank.dynamic_rank)}
                        </td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                              {rank.photoUrl ? (
                                <img src={rank.photoUrl} alt={rank.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                rank.fullName?.charAt(0) || '?'
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{rank.fullName}</div>
                              {rank.dob && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>DOB: {rank.dob}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#0f172a', fontWeight: '700', verticalAlign: 'middle' }}>{rank.metricValue}</td>
                        <td style={{ padding: '14px 20px', color: '#475569', fontSize: '13px', fontWeight: '500', verticalAlign: 'middle' }}>{rank.state}</td>
                        <td style={{ padding: '14px 20px', color: '#475569', fontSize: '13px', verticalAlign: 'middle', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rank.schoolName}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', verticalAlign: 'middle' }}>
                          <button 
                            onClick={() => setSelectedParticipant(rank)}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#E9A132',
                              border: '1.5px solid #E9A132',
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E9A132'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E9A132'; }}
                          >
                            View Card
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Grid Layout (Visible on Mobile) */}
              <div className="cards-responsive-mobile" style={{ display: 'none', padding: '15px', flexDirection: 'column', gap: '15px' }}>
                {currentParticipants.map((rank) => (
                  <div key={rank.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {renderRankBadge(rank.dynamic_rank)}
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', overflow: 'hidden' }}>
                          {rank.photoUrl ? (
                            <img src={rank.photoUrl} alt={rank.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            rank.fullName?.charAt(0) || '?'
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{rank.fullName}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>State: {rank.state}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginLeft: 'auto', fontWeight: '800', color: '#E9A132', fontSize: '15px' }}>
                        {rank.metricValue}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', color: '#64748b', border: '1px solid #e2e8f0' }}>
                      <strong>School:</strong> {rank.schoolName}
                    </div>

                    <button 
                      onClick={() => setSelectedParticipant(rank)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#E9A132',
                        border: '1px solid #E9A132',
                        padding: '8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      View Profile Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                      style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: currentPage === page ? '#E9A132' : 'white',
                        color: currentPage === page ? 'white' : '#0f172a',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        fontSize: '13px',
                        transition: 'all 0.2s'
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
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .table-responsive-desktop {
            display: none !important;
          }
          .cards-responsive-mobile {
            display: flex !important;
          }
          .filter-header-container {
            flex-direction: column;
            align-items: stretch !important;
            padding: 20px !important;
            gap: 15px !important;
          }
          .filter-controls {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 10px !important;
          }
          .filter-select {
            width: 100%;
          }
        }
      `}</style>

    </main>
  );
};

export default Program;
