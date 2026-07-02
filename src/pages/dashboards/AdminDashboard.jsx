import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Building, Calendar, Trophy, Lock, Search, ChevronRight, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { role, loading, forceAdminLogin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ students: 0, schools: 0, events: 0 });
  
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [events, setEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Create Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventData, setEventData] = useState({
    name: '', date: '', venue: '', age_category: '', type: 'TIME',
    sport_category: '', reg_start: '', reg_end: ''
  });

  useEffect(() => {
    if (role === 'admin') {
      fetchDashboardData();
    }
  }, [role]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    
    // Fetch stats
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: schoolCount } = await supabase.from('schools').select('*', { count: 'exact', head: true });
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
    setStats({ students: studentCount || 0, schools: schoolCount || 0, events: eventCount || 0 });

    // Fetch Schools Data
    const { data: schoolsData } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
    if (schoolsData) setSchools(schoolsData);

    // Fetch Events Data
    const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (eventsData) setEvents(eventsData);

    // Fetch Students Data (with linked school info)
    const { data: studentsData } = await supabase.from('students').select(`
      *,
      schools (
        school_name,
        custom_school_id
      )
    `).order('created_at', { ascending: false });
    
    if (studentsData) setStudents(studentsData);
    
    setDataLoading(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsCreatingEvent(true);
    try {
      const { error } = await supabase.from('events').insert([{
        name: eventData.name,
        sport_category: eventData.sport_category,
        event_date: eventData.date,
        venue: eventData.venue,
        age_category: eventData.age_category,
        event_type: eventData.type,
        reg_start_date: eventData.reg_start,
        reg_end_date: eventData.reg_end,
        status: 'PUBLISHED'
      }]);
      
      if (error) throw error;
      
      alert("Event created successfully!");
      setShowEventForm(false);
      setEventData({ name: '', date: '', venue: '', age_category: '', type: 'TIME', sport_category: '', reg_start: '', reg_end: '' });
      fetchDashboardData(); // Refresh list
    } catch (err) {
      alert("Error creating event: " + err.message + "\n\nPlease ensure you ran the RLS SQL fix for events.");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}><div className="loader"></div></div>;
  
  if (role !== 'admin') {
    return <AdminLogin forceAdminLogin={forceAdminLogin} />;
  }

  const statCards = [
    { title: 'Registered Students', value: stats.students, icon: <Users size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.3)' },
    { title: 'Registered Schools', value: stats.schools, icon: <Building size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.3)' },
    { title: 'Active Competitions', value: stats.events, icon: <Trophy size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.3)' }
  ];

  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '14px', transition: 'all 0.2s', marginTop: '5px' };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)', paddingTop: '80px' }}>
      
      {/* Modern Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 80px)', padding: '30px 20px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: '80px', zIndex: 10 }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--primary-dark)', padding: '10px', borderRadius: '12px' }}>
            <Lock size={24} style={{ color: 'var(--accent-orange)' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '18px', color: 'var(--text-dark)', letterSpacing: '-0.5px' }}>Admin Center</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-light)' }}>Super User Access</p>
          </div>
        </div>

        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', paddingLeft: '15px' }}>Main Menu</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { id: 'students', icon: <Users size={20} />, label: 'Students Directory' },
            { id: 'schools', icon: <Building size={20} />, label: 'Schools Directory' },
            { id: 'events', icon: <Calendar size={20} />, label: 'Competitions' },
          ].map(tab => (
            <li key={tab.id} style={{ marginBottom: '8px' }}>
              <button 
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 15px', 
                  cursor: 'pointer', 
                  backgroundColor: activeTab === tab.id ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseOut={(e) => { if(activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ opacity: activeTab === tab.id ? 1 : 0.7 }}>{tab.icon}</div>
                <span style={{ flex: 1 }}>{tab.label}</span>
                {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 50px', marginLeft: '280px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '28px', color: 'var(--text-dark)' }}>
              {activeTab === 'overview' ? 'System Overview' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Database`}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time statistics and administrative controls.</p>
          </div>
          <button 
            onClick={fetchDashboardData} 
            disabled={dataLoading}
            style={{ padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          >
            {dataLoading ? 'Syncing...' : 'Sync Database'}
          </button>
        </motion.div>

        {dataLoading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
            Fetching latest records securely...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  {statCards.map((stat, idx) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={idx} 
                      style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: `0 10px 30px ${stat.shadow}`, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.8)' }}
                    >
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '15px', fontWeight: '600' }}>{stat.title}</p>
                          <h3 style={{ margin: 0, fontSize: '42px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>{stat.value.toLocaleString()}</h3>
                        </div>
                        <div style={{ background: stat.bg, width: '60px', height: '60px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: `0 8px 20px ${stat.shadow}` }}>
                          {stat.icon}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === 'students' && (
                <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '18px' }}>Registered Students</h3>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '8px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '250px' }}>
                      <Search size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                      <input type="text" placeholder="Search ID or Name..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'white', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Student Profile</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Linked Institution</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Location Details</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No students found in the database.</td></tr>
                        ) : (
                          students.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                                    {s.full_name.charAt(0)}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '15px' }}>{s.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {s.custom_student_id} • {s.gender}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                {s.schools ? (
                                  <>
                                    <div style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px' }}>{s.schools.school_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Ref: {s.schools.custom_school_id}</div>
                                  </>
                                ) : <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Independent</span>}
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: '500', color: 'var(--text-dark)', fontSize: '14px' }}>{s.district}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{s.state}</div>
                              </td>
                              <td style={{ padding: '20px 30px', fontSize: '14px', color: '#64748b' }}>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SCHOOLS TAB */}
              {activeTab === 'schools' && (
                <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '18px' }}>Registered Institutions</h3>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '8px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '250px' }}>
                      <Search size={16} style={{ color: '#94a3b8', marginRight: '10px' }} />
                      <input type="text" placeholder="Search schools..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'white', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Institution Details</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Principal Contact</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Location</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schools.length === 0 ? (
                          <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No schools found in the database.</td></tr>
                        ) : (
                          schools.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                    <Building size={20} />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '15px' }}>{s.school_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {s.custom_school_id}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: '500', color: 'var(--text-dark)', fontSize: '14px' }}>{s.principal_name}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{s.email}</div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: '500', color: 'var(--text-dark)', fontSize: '14px' }}>{s.district}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{s.state}</div>
                              </td>
                              <td style={{ padding: '20px 30px', fontSize: '14px', color: '#64748b' }}>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === 'events' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Create Event Banner */}
                  {!showEventForm && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setShowEventForm(true)}
                      style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e3a8a 100%)', borderRadius: '20px', padding: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(30, 58, 138, 0.2)' }}
                    >
                      <div>
                        <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontFamily: 'var(--font-heading)' }}>Host a New Competition</h2>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '15px' }}>Create an event, set categories, and open registrations instantly.</p>
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                        <PlusCircle size={20} /> Create Event
                      </div>
                    </motion.div>
                  )}

                  {/* Event Creation Form */}
                  <AnimatePresence>
                    {showEventForm && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f1f5f9' }}
                      >
                        <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                          <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar style={{ color: 'var(--primary-blue)' }} /> Event Configuration
                          </h3>
                          <button onClick={() => setShowEventForm(false)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        
                        <form onSubmit={handleCreateEvent} style={{ padding: '30px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Name</label>
                              <input type="text" required value={eventData.name} onChange={e => setEventData({...eventData, name: e.target.value})} style={inputStyle} placeholder="e.g. National 100m Sprint" />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sport / Program</label>
                              <select required value={eventData.sport_category} onChange={e => setEventData({...eventData, sport_category: e.target.value})} style={inputStyle}>
                                <option value="">Select Sport...</option>
                                <option value="athletic">Athletic</option>
                                <option value="cycling">Cycling</option>
                                <option value="skating">Skating</option>
                                <option value="dancer">Dancer</option>
                                <option value="artist">Artist</option>
                                <option value="musician">Musician</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venue Location</label>
                              <input type="text" required value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} style={inputStyle} placeholder="Stadium Name, City" />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Competition Date</label>
                              <input type="date" required value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} style={inputStyle} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age Category</label>
                              <select required value={eventData.age_category} onChange={e => setEventData({...eventData, age_category: e.target.value})} style={inputStyle}>
                                <option value="">Select Category</option>
                                <option value="U-10">Under 10</option>
                                <option value="U-14">Under 14</option>
                                <option value="U-18">Under 18</option>
                                <option value="Open">Open Category</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ranking Metric</label>
                              <select required value={eventData.type} onChange={e => setEventData({...eventData, type: e.target.value})} style={inputStyle}>
                                <option value="TIME">Time (Lower is better - Athletics/Swimming)</option>
                                <option value="SCORE">Score (Higher is better - Archery/Shooting)</option>
                                <option value="DISTANCE">Distance (Higher is better - Jumps/Throws)</option>
                                <option value="POINTS">Points (Higher is better - General)</option>
                              </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reg. Start</label>
                                <input type="date" required value={eventData.reg_start} onChange={e => setEventData({...eventData, reg_start: e.target.value})} style={inputStyle} />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reg. End</label>
                                <input type="date" required value={eventData.reg_end} onChange={e => setEventData({...eventData, reg_end: e.target.value})} style={inputStyle} />
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                            <button type="submit" disabled={isCreatingEvent} style={{ padding: '14px 30px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '10px', cursor: isCreatingEvent ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
                              {isCreatingEvent ? 'Broadcasting...' : 'Publish Competition'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Events List */}
                  <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '18px' }}>Active Competitions</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'white', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Competition Name</th>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Details</th>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Schedule & Venue</th>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #f1f5f9' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No active events found in the system.</td></tr>
                          ) : (
                            events.map(ev => (
                              <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
                                <td style={{ padding: '20px 30px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                      <Trophy size={20} />
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '15px' }}>{ev.name}</div>
                                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', textTransform: 'capitalize' }}>Program: {ev.sport_category || 'General'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '20px 30px' }}>
                                  <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                                    <span style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{ev.age_category}</span>
                                    <span style={{ display: 'inline-block', backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{ev.event_type}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '20px 30px' }}>
                                  <div style={{ fontWeight: '500', color: 'var(--text-dark)', fontSize: '14px' }}>{new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{ev.venue}</div>
                                </td>
                                <td style={{ padding: '20px 30px' }}>
                                  <span style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#16a34a', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>
                                    PUBLISHED
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ forceAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    
    setTimeout(() => {
      if (email === 'jude@1022' && password === '1022') {
        forceAdminLogin();
      } else {
        setError('Security Alert: Invalid admin credentials detected.');
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.8)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#eff6ff', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', transform: 'rotate(-10deg)' }}>
            <Lock size={36} style={{ color: 'var(--primary-blue)', transform: 'rotate(10deg)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', margin: 0, fontSize: '28px' }}>Admin Gateway</h2>
          <p style={{ color: '#64748b', fontSize: '15px', margin: '10px 0 0 0' }}>Enter your credentials to access the system core.</p>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '25px', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca', fontWeight: '500' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
              <input 
                type="text" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '15px', transition: 'all 0.2s', backgroundColor: '#f8fafc' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#94a3b8' }} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '15px', transition: 'all 0.2s', backgroundColor: '#f8fafc' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            style={{ padding: '16px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: isLoggingIn ? 'not-allowed' : 'pointer', marginTop: '15px', fontSize: '16px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            onMouseOver={(e) => !isLoggingIn && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !isLoggingIn && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {isLoggingIn ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
