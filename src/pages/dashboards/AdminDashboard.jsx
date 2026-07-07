import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Building, Calendar, Trophy, Lock, Search, ChevronRight, PlusCircle, LayoutDashboard, Settings, ArrowLeft, Save, CheckCircle, Crown, Award, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const { role, loading, forceAdminLogin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ students: 0, schools: 0, events: 0 });
  
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [events, setEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Create Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventData, setEventData] = useState({
    name: '', date: '', venue: '', age_category: '', type: 'TIME',
    sport_category: '', sub_category: '', reg_start: '', reg_end: ''
  });

  // Scoring System State
  const [scoringEvent, setScoringEvent] = useState(null); // holds the selected event object
  const [participants, setParticipants] = useState([]);
  const [scores, setScores] = useState({}); // { studentId: scoreValue }
  const [savingScore, setSavingScore] = useState(null); // studentId being saved
  const [savedStatus, setSavedStatus] = useState({}); // { studentId: true }

  const [leaderboard, setLeaderboard] = useState([]);
  
  // Student Overview State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPerformances, setStudentPerformances] = useState([]);
  const [studentActiveEvents, setStudentActiveEvents] = useState([]);
  const [studentCertificates, setStudentCertificates] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);

  // School Overview State
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [loadingSchool, setLoadingSchool] = useState(false);

  // Search State
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

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

    // Fetch Students Data
    const { data: studentsData } = await supabase.from('students').select(`*, schools (school_name, custom_school_id)`).order('created_at', { ascending: false });
    if (studentsData) {
      setStudents(studentsData);
      // Generate Leaderboard
      const sortedStudents = [...studentsData].filter(s => s.points > 0).sort((a, b) => b.points - a.points);
      setLeaderboard(sortedStudents);
    }
    
    setDataLoading(false);
    setIsInitialLoad(false);
  };

  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingStudent(true);
    
    const { data: perfData } = await supabase
      .from('performances')
      .select(`
        metric_value,
        national_rank,
        state_rank,
        district_rank,
        events (
          name,
          sport_category,
          event_type,
          event_date
        )
      `)
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });
      
    if (perfData) {
      setStudentPerformances(perfData);
    }

    const { data: activeData } = await supabase
      .from('event_participants')
      .select(`
        events (
          name,
          sport_category,
          event_date
        )
      `)
      .eq('student_id', student.id);

    if (activeData) {
      setStudentActiveEvents(activeData);
    } else {
      setStudentActiveEvents([]);
    }

    const { data: certData } = await supabase
      .from('certificates')
      .select('*, events (name, event_date)')
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });

    if (certData) {
      setStudentCertificates(certData);
    } else {
      setStudentCertificates([]);
    }

    setLoadingStudent(false);
  };

  const handleViewSchool = async (school) => {
    setSelectedSchool(school);
    setLoadingSchool(true);
    
    const { data: studentsData } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', school.id)
      .order('points', { ascending: false });
      
    if (studentsData) {
      setSchoolStudents(studentsData);
    }
    setLoadingSchool(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // Explicit Validation
    if (eventData.date < today) {
      Swal.fire({ title: 'Invalid Date', text: "Event date cannot be in the past.", icon: 'warning' });
      return;
    }
    if (eventData.reg_start < today) {
      Swal.fire({ title: 'Invalid Date', text: "Registration start date cannot be in the past.", icon: 'warning' });
      return;
    }
    if (eventData.reg_end < eventData.reg_start) {
      Swal.fire({ title: 'Invalid Date', text: "Registration end date cannot be before registration start date.", icon: 'warning' });
      return;
    }
    if (eventData.reg_end >= eventData.date) {
      Swal.fire({ title: 'Invalid Date', text: "Registration must end before the event date.", icon: 'warning' });
      return;
    }

    setIsCreatingEvent(true);
    try {
      const { error } = await supabase.from('events').insert([{
        name: eventData.name,
        sport_category: eventData.sport_category,
        sub_category: eventData.sub_category,
        event_date: eventData.date,
        venue: eventData.venue,
        age_category: eventData.age_category,
        event_type: eventData.type,
        reg_start_date: eventData.reg_start,
        reg_end_date: eventData.reg_end,
        status: 'PUBLISHED'
      }]);
      
      if (error) throw error;
      
      Swal.fire({ title: 'Success!', text: "Event created successfully!", icon: 'success' });
      setShowEventForm(false);
      setEventData({ name: '', date: '', venue: '', age_category: '', type: 'TIME', sport_category: '', sub_category: '', reg_start: '', reg_end: '' });
      fetchDashboardData();
    } catch (err) {
      Swal.fire({ title: 'Error', text: "Error creating event: " + err.message + "\n\nPlease ensure you ran the RLS SQL fix for events.", icon: 'error' });
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // --- SCORING SYSTEM LOGIC ---
  const handleOpenScoring = async (ev) => {
    setScoringEvent(ev);
    setDataLoading(true);
    
    // Fetch participants joined with students & schools
    const { data: partData } = await supabase
      .from('event_participants')
      .select(`
        student_id,
        students (
          full_name,
          custom_student_id,
          schools ( school_name )
        )
      `)
      .eq('event_id', ev.id);

    // Fetch existing performances for this event
    const { data: perfData } = await supabase
      .from('performances')
      .select('student_id, metric_value')
      .eq('event_id', ev.id);

    if (partData) {
      setParticipants(partData);
      
      // Map existing scores into state
      const initialScores = {};
      if (perfData) {
        perfData.forEach(p => {
          initialScores[p.student_id] = p.metric_value;
        });
      }
      setScores(initialScores);
      setSavedStatus({});
    }
    
    setDataLoading(false);
  };

  const handleSaveScore = async (studentId) => {
    if (scoringEvent.event_date < today) {
      Swal.fire({ title: 'Event Closed', text: "Scores cannot be updated for an event that has already ended.", icon: 'error' });
      return;
    }

    const value = scores[studentId];
    if (!value) {
      Swal.fire({ title: 'Invalid Score', text: "Please enter a valid score/time.", icon: 'warning' });
      return;
    }

    setSavingScore(studentId);
    try {
      const { error } = await supabase
        .from('performances')
        .upsert({
          event_id: scoringEvent.id,
          student_id: studentId,
          metric_value: parseFloat(value)
        }, { onConflict: 'event_id,student_id' });

      if (error) throw error;
      
      setSavedStatus(prev => ({ ...prev, [studentId]: true }));
      setTimeout(() => {
        setSavedStatus(prev => ({ ...prev, [studentId]: false }));
      }, 3000);
      
    } catch (err) {
      Swal.fire({ title: 'Error', text: "Error saving score: " + err.message + "\nDid you run the SQL bypass for performances?", icon: 'error' });
    } finally {
      setSavingScore(null);
    }
  };


  if (loading || isInitialLoad) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '60px', height: '60px', border: '5px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', margin: 0, fontSize: '24px' }}>Loading Admin Center...</h2>
        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '10px' }}>Fetching secure platform data</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (role !== 'admin') return <AdminLogin forceAdminLogin={forceAdminLogin} />;

  const statCards = [
    { title: 'Registered Students', value: stats.students, icon: <Users size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', shadow: 'rgba(37, 99, 235, 0.3)' },
    { title: 'Registered Schools', value: stats.schools, icon: <Building size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
    { title: 'Active Competitions', value: stats.events, icon: <Trophy size={28} style={{ color: '#fff' }}/>, bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', shadow: 'rgba(16, 185, 129, 0.3)' }
  ];

  const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '14px', transition: 'all 0.2s', marginTop: '5px' };

  const filteredStudents = students.filter(s => {
    const query = (studentSearchQuery || '').toLowerCase();
    if (!query) return true;
    return (s.full_name && s.full_name.toLowerCase().includes(query)) || 
           (s.custom_student_id && s.custom_student_id.toLowerCase().includes(query)) ||
           (s.schools && s.schools.school_name && s.schools.school_name.toLowerCase().includes(query));
  });

  const filteredSchools = schools.filter(s => {
    const query = (schoolSearchQuery || '').toLowerCase();
    if (!query) return true;
    return (s.school_name && s.school_name.toLowerCase().includes(query)) || 
           (s.custom_school_id && s.custom_school_id.toLowerCase().includes(query)) ||
           (s.principal_name && s.principal_name.toLowerCase().includes(query));
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)', paddingTop: '80px', color: '#0f172a' }}>
      
      {/* Modern Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 80px)', padding: '30px 20px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: '80px', zIndex: 10 }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#2dd4bf', padding: '10px', borderRadius: '12px', boxShadow: '0 0 15px rgba(45, 212, 191, 0.3)' }}>
            <Lock size={24} style={{ color: '#0f172a' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '18px', color: '#0f172a', letterSpacing: '-0.5px' }}>Admin Center</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Super User Access</p>
          </div>
        </div>

        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', paddingLeft: '15px' }}>Main Menu</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Dashboard Overview' },
            { id: 'students', icon: <Users size={20} />, label: 'Students Directory' },
            { id: 'schools', icon: <Building size={20} />, label: 'Schools Directory' },
            { id: 'events', icon: <Calendar size={20} />, label: 'Competitions & Scores' },
            { id: 'leaderboard', icon: <Crown size={20} />, label: 'Points Leaderboard' },
          ].map(tab => (
            <li key={tab.id} style={{ marginBottom: '8px' }}>
              <button 
                onClick={() => { setActiveTab(tab.id); setScoringEvent(null); }}
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 15px', cursor: 'pointer', 
                  backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
                  border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: activeTab === tab.id ? '600' : '500',
                  transition: 'all 0.2s ease', textAlign: 'left', borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent'
                }}
                onMouseOver={(e) => { if(activeTab !== tab.id) { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; } }}
                onMouseOut={(e) => { if(activeTab !== tab.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
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
        
        {/* Header Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: '#ffffff', padding: '20px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '28px', color: '#0f172a' }}>
              {activeTab === 'overview' ? 'System Overview' : activeTab === 'leaderboard' ? 'Global Leaderboard Management' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Database`}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Real-time statistics and administrative controls.</p>
          </div>
          <button 
            onClick={fetchDashboardData} disabled={dataLoading}
            style={{ padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
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
            <motion.div key={activeTab + (scoringEvent ? 'scoring' : '')} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
                  {statCards.map((stat, idx) => (
                    <motion.div whileHover={{ y: -5 }} key={idx} style={{ background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: `0 10px 30px ${stat.shadow}`, position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '15px', fontWeight: '600' }}>{stat.title}</p>
                          <h3 style={{ margin: 0, fontSize: '42px', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>{stat.value.toLocaleString()}</h3>
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
              {activeTab === 'students' && !selectedStudent && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '15px' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Registered Students</h3>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <input 
                        type="text" 
                        placeholder="Search by name, ID, or school..." 
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: 'white' }}
                      />
                      <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Student Profile</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Linked Institution</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Location Details</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Joined Date</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No students found matching your search.</td></tr>
                        ) : (
                          filteredStudents.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{s.full_name.charAt(0)}</div>
                                  <div>
                                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>{s.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {s.custom_student_id} • {s.gender}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                {s.schools ? (
                                  <>
                                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{s.schools.school_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Ref: {s.schools.custom_school_id}</div>
                                  </>
                                ) : <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Independent</span>}
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>{s.district}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{s.state}</div>
                              </td>
                              <td style={{ padding: '20px 30px', fontSize: '14px', color: '#64748b' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                              <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                <button 
                                  onClick={() => handleViewStudent(s)}
                                  style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                >
                                  View Profile <ChevronRight size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {/* STUDENT OVERVIEW VIEW */}
              {activeTab === 'students' && selectedStudent && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  
                  {/* Header */}
                  <div style={{ padding: '30px', backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
                    <button onClick={() => setSelectedStudent(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                      <ArrowLeft size={16} /> Back to Directory
                    </button>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
                          {selectedStudent.full_name.charAt(0)}
                        </div>
                        <div>
                          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>{selectedStudent.full_name}</h2>
                          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px', display: 'flex', gap: '15px' }}>
                            <span><strong>ID:</strong> {selectedStudent.custom_student_id}</span>
                            <span><strong>Gender:</strong> {selectedStudent.gender}</span>
                            <span><strong>DOB:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8', fontFamily: 'monospace' }}>
                            {leaderboard.findIndex(s => s.id === selectedStudent.id) !== -1 
                              ? `#${leaderboard.findIndex(s => s.id === selectedStudent.id) + 1}` 
                              : 'N/A'}
                          </div>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#1d4ed8', fontWeight: 'bold' }}>Global Rank</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#b45309', fontFamily: 'monospace' }}>{selectedStudent.points?.toLocaleString() || 0}</div>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#b45309', fontWeight: 'bold' }}>Total Points</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '30px' }}>
                    {/* Student Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Contact & Location</h4>
                        <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                          <div><strong style={{ color: '#0f172a' }}>Email:</strong> {selectedStudent.email}</div>
                          <div><strong style={{ color: '#0f172a' }}>Phone:</strong> {selectedStudent.phone}</div>
                          <div><strong style={{ color: '#0f172a' }}>District:</strong> {selectedStudent.district}</div>
                          <div><strong style={{ color: '#0f172a' }}>State:</strong> {selectedStudent.state}</div>
                          <div><strong style={{ color: '#0f172a' }}>Address:</strong> {selectedStudent.address}</div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Institution Details</h4>
                        {selectedStudent.schools ? (
                          <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                            <div><strong style={{ color: '#0f172a' }}>School Name:</strong> {selectedStudent.schools.school_name}</div>
                            <div><strong style={{ color: '#0f172a' }}>School ID:</strong> {selectedStudent.schools.custom_school_id}</div>
                            <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>Verified Affiliation</div>
                          </div>
                        ) : (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                            Participating as an Independent Candidate. No school affiliated.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Participation History */}
                    <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Trophy size={20} color="#3b82f6" /> Competition History & Rankings</h3>
                    
                    {loadingStudent ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading performances...</div>
                    ) : studentPerformances.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                        <div style={{ marginBottom: '15px' }}>This student hasn't recorded any competition performances yet.</div>
                        {studentActiveEvents.length > 0 && (
                          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block', textAlign: 'left' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px' }}>Currently Registered For:</h4>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                              {studentActiveEvents.map((act, i) => (
                                <li key={i} style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#3b82f6' }}>•</span> 
                                  <strong style={{ color: '#0f172a' }}>{act.events?.sport_category || 'Event'}</strong> - {act.events?.name} ({new Date(act.events?.event_date).toLocaleDateString()})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Event Name</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Program</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Score / Time</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>District Rank</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>State Rank</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>National Rank</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentPerformances.map((perf, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#0f172a' }}>{perf.events?.name}</td>
                                <td style={{ padding: '15px 20px', color: '#64748b', textTransform: 'capitalize' }}>{perf.events?.sport_category || 'General'}</td>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#3b82f6' }}>{perf.metric_value} <span style={{ fontSize: '10px', color: '#94a3b8' }}>{perf.events?.event_type}</span></td>
                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                  <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: perf.district_rank <= 3 ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9', color: perf.district_rank <= 3 ? '#059669' : '#64748b' }}>
                                    {perf.district_rank ? `#${perf.district_rank}` : 'N/A'}
                                  </span>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                  <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: perf.state_rank <= 3 ? 'rgba(59, 130, 246, 0.1)' : '#f1f5f9', color: perf.state_rank <= 3 ? '#2563eb' : '#64748b' }}>
                                    {perf.state_rank ? `#${perf.state_rank}` : 'N/A'}
                                  </span>
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                  <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: perf.national_rank <= 3 ? 'rgba(251, 191, 36, 0.2)' : '#f1f5f9', color: perf.national_rank <= 3 ? '#b45309' : '#64748b' }}>
                                    {perf.national_rank ? `#${perf.national_rank}` : 'N/A'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                    )}

                    {/* Official Certificates */}
                    <div style={{ marginTop: '40px' }}>
                      <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Award size={20} color="#10b981" /> Official Certificates</h3>
                      
                      {loadingStudent ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading certificates...</div>
                      ) : studentCertificates.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                          This student has not downloaded any official certificates yet.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                          {studentCertificates.map(cert => (
                            <div key={cert.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', color: '#10b981' }}>
                                  <Award size={24} />
                                </div>
                                <div>
                                  <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '15px' }}>{cert.events?.name}</h4>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>Generated: {new Date(cert.created_at).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <a 
                                href={cert.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f1f5f9', color: '#0f172a', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                              >
                                View PDF <ExternalLink size={14} />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCHOOLS TAB */}
              {activeTab === 'schools' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', flexWrap: 'wrap', gap: '15px' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Registered Institutions</h3>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <input 
                        type="text" 
                        placeholder="Search by name, ID, or principal..." 
                        value={schoolSearchQuery}
                        onChange={(e) => setSchoolSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: 'white' }}
                      />
                      <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                    </div>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Institution Details</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Principal Contact</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchools.length === 0 ? (
                          <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No schools found matching your search.</td></tr>
                        ) : (
                          filteredSchools.map(s => (
                            <tr key={s.id} onClick={() => handleViewSchool(s)} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '20px 30px', fontWeight: 'bold' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                  <Building size={20} />
                                </div>
                                <div>
                                  {s.school_name}
                                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {s.custom_school_id}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '20px 30px' }}>{s.principal_name} <br/><span style={{fontSize:'12px', color:'#94a3b8'}}>{s.email}</span></td>
                            <td style={{ padding: '20px 30px', color: '#64748b' }}>
                              {s.district}, {s.state}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-20px' }}>
                                <ChevronRight size={16} color="#cbd5e1" />
                              </div>
                            </td>
                          </tr>
                          ))
                        )}
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === 'events' && !scoringEvent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Create Event Banner */}
                  {!showEventForm && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }} onClick={() => setShowEventForm(true)}
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
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
                          <h3 style={{ margin: 0 }}>Event Configuration</h3>
                          <button onClick={() => setShowEventForm(false)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        <form onSubmit={handleCreateEvent} style={{ padding: '30px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Event Name</label>
                              <input type="text" required value={eventData.name} onChange={e => setEventData({...eventData, name: e.target.value})} style={inputStyle} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Sport / Program</label>
                              <select required value={eventData.sport_category} onChange={e => setEventData({...eventData, sport_category: e.target.value})} style={inputStyle}>
                                <option value="">Select Sport...</option>
                                <option value="athlete">Athlete</option>
                                <option value="highjump">High Jump</option>
                                <option value="throw">Throw</option>
                              </select>
                            </div>
                            {['athlete', 'highjump', 'throw'].includes(eventData.sport_category) && (
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Sub Category</label>
                                <select required value={eventData.sub_category} onChange={e => setEventData({...eventData, sub_category: e.target.value})} style={inputStyle}>
                                  <option value="">Select Sub Category...</option>
                                  <option value="50m">50 m</option>
                                  <option value="25m">25 m</option>
                                  <option value="80m">80 m</option>
                                </select>
                              </div>
                            )}
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Venue Location</label>
                              <input type="text" required value={eventData.venue} onChange={e => setEventData({...eventData, venue: e.target.value})} style={inputStyle} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Competition Date</label>
                              <input type="date" min={today} required value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} style={inputStyle} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Age Category</label>
                              <select required value={eventData.age_category} onChange={e => setEventData({...eventData, age_category: e.target.value})} style={inputStyle}>
                                <option value="">Select Category</option>
                                <option value="U-10">Under 10</option>
                                <option value="U-14">Under 14</option>
                                <option value="U-18">Under 18</option>
                                <option value="Open">Open Category</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Ranking Metric</label>
                              <select required value={eventData.type} onChange={e => setEventData({...eventData, type: e.target.value})} style={inputStyle}>
                                <option value="TIME">Time (Lower is better)</option>
                                <option value="SCORE">Score (Higher is better)</option>
                                <option value="DISTANCE">Distance (Higher is better)</option>
                                <option value="POINTS">Points (Higher is better)</option>
                              </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Reg. Start</label>
                                <input type="date" min={today} required value={eventData.reg_start} onChange={e => setEventData({...eventData, reg_start: e.target.value})} style={inputStyle} />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Reg. End</label>
                                <input type="date" min={eventData.reg_start || today} max={eventData.date || undefined} required value={eventData.reg_end} onChange={e => setEventData({...eventData, reg_end: e.target.value})} style={inputStyle} />
                              </div>
                            </div>
                          </div>
                          
                          <button type="submit" disabled={isCreatingEvent} style={{ padding: '14px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
                            {isCreatingEvent ? 'Broadcasting...' : 'Publish Competition'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Events List */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>Active Competitions</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Competition Name</th>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Schedule & Venue</th>
                            <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Scoring</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map(ev => (
                            <tr key={ev.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>{ev.name}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', textTransform: 'capitalize' }}>Program: {ev.sport_category || 'General'} {ev.sub_category ? `(${ev.sub_category})` : ''} • {ev.age_category}</div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ fontWeight: '500', color: '#0f172a', fontSize: '14px' }}>{new Date(ev.event_date).toLocaleDateString()}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{ev.venue}</div>
                              </td>
                              <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                <button 
                                  onClick={() => handleOpenScoring(ev)}
                                  style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
                                >
                                  Manage Scores <ChevronRight size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></div>
                    </div>
                  </div>
                </div>
              )}

              {/* EVENT SCORING VIEW */}
              {activeTab === 'events' && scoringEvent && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  
                  {/* Header */}
                  <div style={{ padding: '30px', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                      <button onClick={() => setScoringEvent(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '10px', fontSize: '13px', fontWeight: 'bold' }}>
                        <ArrowLeft size={16} /> Back to Events
                      </button>
                      <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '24px' }}>{scoringEvent.name}</h2>
                      <div style={{ marginTop: '5px', opacity: 0.8, fontSize: '14px' }}>{scoringEvent.venue} • {scoringEvent.age_category} • {scoringEvent.event_type} Metric</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>{participants.length}</div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Participants</div>
                    </div>
                  </div>

                  {/* Scoring Table */}
                  <div style={{ padding: '30px' }}>
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '15px', color: '#60a5fa', fontSize: '14px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={18} /> Enter scores and click Save. The database will automatically generate National, State, and District ranks live!
                    </div>

                    <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                          <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Student ID & Name</th>
                          <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>School</th>
                          <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', width: '200px' }}>Score / Time ({scoringEvent.event_type})</th>
                          <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', width: '120px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.length === 0 ? (
                          <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No students have registered for this event yet.</td></tr>
                        ) : (
                          participants.map(p => (
                            <tr key={p.student_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '20px', fontWeight: 'bold', color: '#0f172a' }}>
                                {p.students?.full_name} <br/>
                                <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#64748b' }}>{p.students?.custom_student_id}</span>
                              </td>
                              <td style={{ padding: '20px', color: '#64748b', fontSize: '14px' }}>
                                {p.students?.schools?.school_name || 'Independent'}
                              </td>
                              <td style={{ padding: '20px' }}>
                                <input 
                                  type="number" 
                                  step="0.01"
                                  value={scores[p.student_id] || ''}
                                  onChange={(e) => setScores({...scores, [p.student_id]: e.target.value})}
                                  placeholder={scoringEvent.event_type === 'TIME' ? 'e.g. 12.5' : 'e.g. 100'}
                                  style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', fontWeight: 'bold', color: '#60a5fa', backgroundColor: '#f8fafc' }}
                                />
                              </td>
                              <td style={{ padding: '20px', textAlign: 'right' }}>
                                <button 
                                  onClick={() => handleSaveScore(p.student_id)}
                                  disabled={savingScore === p.student_id}
                                  style={{ 
                                    padding: '10px 15px', 
                                    backgroundColor: savedStatus[p.student_id] ? '#10b981' : '#3b82f6', 
                                    color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto',
                                    transition: 'background-color 0.3s'
                                  }}
                                >
                                  {savingScore === p.student_id ? 'Saving...' : savedStatus[p.student_id] ? <CheckCircle size={16} /> : <Save size={16} />}
                                  {savedStatus[p.student_id] ? 'Saved!' : 'Save'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table></div>
                  </div>
                </motion.div>
              )}

              {/* LEADERBOARD TAB */}
              {activeTab === 'leaderboard' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '25px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><Crown size={20} color="#fbbf24"/> Global Points Leaderboard</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', width: '80px' }}>Rank</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Student Profile</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>Linked Institution</th>
                          <th style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Total Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.length === 0 ? (
                          <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No points awarded yet.</td></tr>
                        ) : (
                          leaderboard.map((s, index) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index < 3 ? 'rgba(251, 191, 36, 0.05)' : 'transparent' }}>
                              <td style={{ padding: '20px 30px', fontWeight: 'bold', fontSize: '18px', color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : '#64748b' }}>
                                #{index + 1}
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: index < 3 ? (index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#b45309') : '#3b82f6', color: index < 3 ? '#0f172a' : 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{s.full_name.charAt(0)}</div>
                                  <div>
                                    <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>{s.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>ID: {s.custom_student_id}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '20px 30px' }}>
                                {s.schools ? (
                                  <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{s.schools.school_name}</div>
                                ) : <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Independent</span>}
                              </td>
                              <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'monospace' }}>{s.points?.toLocaleString()}</div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table></div>
                  </div>
                </div>
              )}

              {/* SCHOOL OVERVIEW VIEW */}
              {activeTab === 'schools' && selectedSchool && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  
                  {/* Header */}
                  <div style={{ padding: '30px', backgroundColor: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
                    <button onClick={() => setSelectedSchool(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                      <ArrowLeft size={16} /> Back to Institutions
                    </button>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
                          <Building size={40} />
                        </div>
                        <div>
                          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '28px' }}>{selectedSchool.school_name}</h2>
                          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px', display: 'flex', gap: '15px' }}>
                            <span style={{ backgroundColor: '#e2e8f0', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', color: '#475569' }}>{selectedSchool.custom_school_id}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={16} /> {schoolStudents.length} Registered Students</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', fontFamily: 'monospace' }}>
                          {schoolStudents.reduce((sum, s) => sum + (s.points || 0), 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#059669', fontWeight: 'bold' }}>Total School Points</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '30px' }}>
                    {/* School Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Principal & Contact</h4>
                        <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                          <div><strong style={{ color: '#0f172a' }}>Principal:</strong> {selectedSchool.principal_name}</div>
                          <div><strong style={{ color: '#0f172a' }}>Email:</strong> {selectedSchool.email}</div>
                          <div><strong style={{ color: '#0f172a' }}>Phone:</strong> {selectedSchool.phone}</div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px' }}>Location</h4>
                        <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                          <div><strong style={{ color: '#0f172a' }}>District:</strong> {selectedSchool.district}</div>
                          <div><strong style={{ color: '#0f172a' }}>State:</strong> {selectedSchool.state}</div>
                          <div><strong style={{ color: '#0f172a' }}>Registered On:</strong> {new Date(selectedSchool.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Students List */}
                    <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} color="#10b981" /> Affiliated Students List</h3>
                    
                    {loadingSchool ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading students...</div>
                    ) : schoolStudents.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                        No students have registered from this school yet.
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Student Name</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>AK ID</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Gender</th>
                              <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Points Earned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schoolStudents.map((student, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#0f172a' }}>{student.full_name}</td>
                                <td style={{ padding: '15px 20px', color: '#64748b', fontFamily: 'monospace' }}>{student.custom_student_id}</td>
                                <td style={{ padding: '15px 20px', color: '#64748b' }}>{student.gender || '-'}</td>
                                <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>{student.points?.toLocaleString() || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// ... AdminLogin component remains identical to previous 
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
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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
            <motion.div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '25px', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca', fontWeight: '500' }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#64748b' }} />
              <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '15px', transition: 'all 0.2s', backgroundColor: '#f8fafc' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#64748b' }} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '15px', transition: 'all 0.2s', backgroundColor: '#f8fafc' }} />
            </div>
          </div>
          <button type="submit" disabled={isLoggingIn} style={{ padding: '16px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: isLoggingIn ? 'not-allowed' : 'pointer', marginTop: '15px', fontSize: '16px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
            {isLoggingIn ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
