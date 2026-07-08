import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, Trophy, Award, Building, LogOut, RefreshCw, BarChart3, 
  Search, ArrowLeft, Download, ShieldAlert, Award as AwardIcon, 
  Compass, Settings, Menu, X, Landmark, User, MapPin, Mail, ChevronRight 
} from 'lucide-react';
import Swal from 'sweetalert2';
import './school-dashboard.css';

const SchoolDashboard = () => {
  const { role, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [myStudents, setMyStudents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [bestRank, setBestRank] = useState({ air: '--', state: '--', district: '--' });
  const [schoolData, setSchoolData] = useState(null);
  const [allSchoolsLeaderboard, setAllSchoolsLeaderboard] = useState([]);

  // Category breakdown counts
  const [categoryCounts, setCategoryCounts] = useState({
    athlete: 0,
    cyclist: 0,
    skater: 0,
    dancer: 0,
    artist: 0,
    musician: 0
  });

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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
      const studentIds = students.map(s => s.id);

      if (students.length > 0) {
        const { data: perfs } = await supabase
          .from('performances')
          .select('student_id, event_id, metric_value, events (name, sport_category)')
          .in('student_id', studentIds);

        const { data: ranks } = await supabase
          .from('rankings')
          .select('student_id, event_id, air_rank, state_rank, district_rank, events (name, sport_category)')
          .in('student_id', studentIds);

        const enrichedStudents = students.map(st => {
          const stPerfs = perfs?.filter(p => p.student_id === st.id) || [];
          const stRanks = ranks?.filter(r => r.student_id === st.id) || [];
          let stBestAir = Infinity;
          let stBestState = Infinity;
          
          const eventPerformancesList = [];

          const eventIds = new Set([
            ...stPerfs.map(p => p.event_id),
            ...stRanks.map(r => r.event_id)
          ]);

          for (const eventId of eventIds) {
            const perf = stPerfs.find(p => p.event_id === eventId) || {};
            const r = stRanks.find(rank => rank.event_id === eventId) || {};
            const eventName = perf.events?.name || r.events?.name || 'Competition';
            const sportCategory = perf.events?.sport_category || r.events?.sport_category || '';
            const air = r.air_rank;
            const state = r.state_rank;
            const dist = r.district_rank;

            if (air != null && air < stBestAir) stBestAir = air;
            if (state != null && state < stBestState) stBestState = state;

            eventPerformancesList.push({
              eventId,
              eventName,
              sportCategory,
              airRank: air,
              stateRank: state,
              districtRank: dist,
              metricValue: perf.metric_value
            });
          }

          return {
            ...st,
            bestAir: stBestAir !== Infinity ? stBestAir : null,
            bestState: stBestState !== Infinity ? stBestState : null,
            performancesList: eventPerformancesList
          };
        });
        setMyStudents(enrichedStudents);

        // Fetch categories breakdown counts
        const { data: participations } = await supabase
          .from('event_participants')
          .select('student_id, event_id, events (sport_category)')
          .in('student_id', studentIds);

        const counts = { athlete: 0, cyclist: 0, skater: 0, dancer: 0, artist: 0, musician: 0 };
        participations?.forEach(p => {
          const cat = p.events?.sport_category;
          if (cat && counts[cat] !== undefined) {
            counts[cat]++;
          }
        });
        setCategoryCounts(counts);

      } else {
        setMyStudents([]);
        setCategoryCounts({ athlete: 0, cyclist: 0, skater: 0, dancer: 0, artist: 0, musician: 0 });
      }

      // 3. Compute Dynamic School Rankings
      const { data: allSchools } = await supabase.from('schools').select('id, school_name, state, district');
      const { data: allStudentsData } = await supabase.from('students').select('points, school_id');

      const schoolScores = {};
      if (allSchools) {
        allSchools.forEach(sch => {
          schoolScores[sch.id] = { 
            id: sch.id, 
            school_name: sch.school_name, 
            state: sch.state, 
            district: sch.district, 
            score: 0,
            studentCount: 0
          };
        });
      }
      if (allStudentsData) {
        allStudentsData.forEach(st => {
          if (st.school_id && schoolScores[st.school_id]) {
            schoolScores[st.school_id].score += (st.points || 0);
            schoolScores[st.school_id].studentCount++;
          }
        });
      }

      const sortedSchools = Object.values(schoolScores)
        .sort((a, b) => b.score - a.score)
        .map((s, idx) => ({ ...s, rank: s.score > 0 ? idx + 1 : '--' }));
      
      setAllSchoolsLeaderboard(sortedSchools);

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
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
      showToast('School profile updated successfully');
      fetchSchoolData();
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

  const initials = (name) => {
    if (!name) return 'SC';
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  if (loading || dataLoading) {
    return (
      <div id="naspe-loader" style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <div className="loader-stage">
          <div className="track-ring">
            <svg viewBox="0 0 220 220">
              <defs>
                <linearGradient id="naspeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F0632B" />
                  <stop offset="100%" stopColor="#E8952C" />
                </linearGradient>
              </defs>
              <circle className="bg-ring" cx="110" cy="110" r="100"></circle>
              <circle className="spin-ring" cx="110" cy="110" r="86"></circle>
              <circle
                id="naspe-progress-ring"
                className="progress-ring"
                cx="110"
                cy="110"
                r="100"
                style={{ strokeDasharray: '450 628.3' }}
              ></circle>
            </svg>
            <div className="mascot-wrap">
              <img src="/assets/naspe-mascot.png" alt="NASPE India mascot loading" />
              <div className="mascot-shadow"></div>
            </div>
          </div>
          <div className="loader-text">
            <p className="loader-eyebrow">NASPE India</p>
            <p className="loader-title">
              Loading Amazing Kids of India<span className="dots"><span>.</span><span>.</span><span>.</span></span>
            </p>
            <div className="loader-bar-track" style={{ width: '120px', margin: '12px auto 0' }}>
              <div className="loader-bar-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
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

  const totalPoints = myStudents.reduce((sum, s) => sum + (s.points || 0), 0);
  const avgPoints = myStudents.length > 0 ? Math.round(totalPoints / myStudents.length) : 0;

  // Point brackets for distribution bar chart
  const pointBrackets = { '0-100': 0, '101-300': 0, '301-600': 0, '600+': 0 };
  myStudents.forEach(st => {
    const pts = st.points || 0;
    if (pts <= 100) pointBrackets['0-100']++;
    else if (pts <= 300) pointBrackets['101-300']++;
    else if (pts <= 600) pointBrackets['301-600']++;
    else pointBrackets['600+']++;
  });

  const maxCount = Math.max(...Object.values(pointBrackets), 1);

  // Top athletes (leaderboard within school)
  const topAthletes = [...myStudents]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  const filteredStudents = myStudents.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.custom_student_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="school-dash-container">
      {/* MOBILE HEADER BAR */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', backgroundColor: '#111827', borderBottom: '1px solid #1f2937', display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 100 }} className="mobile-only-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="school-brand-logo" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>AK</div>
          <span className="school-brand-title" style={{ fontSize: '0.9rem' }}>Amazing Kids</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className={`school-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="school-sidebar-brand">
          <div className="school-brand-logo">AK</div>
          <div>
            <span className="school-brand-title">Amazing Kids</span>
            <span className="school-brand-subtitle">Institution Panel</span>
          </div>
        </div>

        <ul className="school-sidebar-menu">
          <li className="school-menu-item">
            <button className={`school-menu-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}>
              <BarChart3 size={18} /> Dashboard Overview
            </button>
          </li>
          <li className="school-menu-item">
            <button className={`school-menu-btn ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => { setActiveTab('roster'); setSelectedStudent(null); setSidebarOpen(false); }}>
              <Users size={18} /> Student Roster
            </button>
          </li>
          <li className="school-menu-item">
            <button className={`school-menu-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => { setActiveTab('leaderboard'); setSidebarOpen(false); }}>
              <Trophy size={18} /> Rankings & Leaderboard
            </button>
          </li>
          <li className="school-menu-item">
            <button className={`school-menu-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
              <Settings size={18} /> Institution Profile
            </button>
          </li>
        </ul>

        <div className="school-sidebar-footer">
          <div className="school-user-info">
            <div className="school-user-avatar">{initials(displayName)}</div>
            <div className="school-user-details">
              <div className="school-user-name">{displayName}</div>
              <div className="school-user-role">{profile.custom_school_id}</div>
            </div>
          </div>
          <button className="school-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      {/* MAIN DISPLAY AREA */}
      <main className="school-main">
        {/* HEADER */}
        <div className="school-header-bar">
          <div>
            <h1 className="school-header-title">
              {activeTab === 'overview' && 'Overview Analytics'}
              {activeTab === 'roster' && 'Student Directory'}
              {activeTab === 'leaderboard' && 'National Leaderboard'}
              {activeTab === 'settings' && 'Institution Settings'}
            </h1>
            <p className="school-header-subtitle">
              {activeTab === 'overview' && 'Real-time performance distribution and institutional talent stats.'}
              {activeTab === 'roster' && 'Track student metrics, historical event timings, and certificates.'}
              {activeTab === 'leaderboard' && 'See where your school stands against institutions across India.'}
              {activeTab === 'settings' && 'Update contact information, school credentials, and location.'}
            </p>
          </div>
          <button className="school-sync-btn" onClick={fetchSchoolData}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Metrics */}
            <div className="school-metrics-grid">
              <div className="school-metric-card">
                <div>
                  <div className="school-metric-label">Enrolled Students</div>
                  <div className="school-metric-value">{myStudents.length}</div>
                  <div className="school-metric-sub">Active athletes</div>
                </div>
                <div className="school-metric-icon" style={{ backgroundColor: 'rgba(30, 136, 229, 0.1)', color: '#1e88e5' }}>
                  <Users size={24} />
                </div>
              </div>

              <div className="school-metric-card">
                <div>
                  <div className="school-metric-label">Cumulative Points</div>
                  <div className="school-metric-value">{totalPoints.toLocaleString()}</div>
                  <div className="school-metric-sub">Total score</div>
                </div>
                <div className="school-metric-icon" style={{ backgroundColor: 'rgba(233, 161, 50, 0.1)', color: '#E9A132' }}>
                  <Trophy size={24} />
                </div>
              </div>

              <div className="school-metric-card">
                <div>
                  <div className="school-metric-label">Average Points</div>
                  <div className="school-metric-value">{avgPoints}</div>
                  <div className="school-metric-sub">Per enrolled student</div>
                </div>
                <div className="school-metric-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Compass size={24} />
                </div>
              </div>

              <div className="school-metric-card">
                <div>
                  <div className="school-metric-label">All India Rank</div>
                  <div className="school-metric-value">#{bestRank.air}</div>
                  <div className="school-metric-sub">National standing</div>
                </div>
                <div className="school-metric-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <AwardIcon size={24} />
                </div>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="school-charts-grid">
              {/* Dynamic SVG Bar Chart */}
              <div className="school-chart-card">
                <div className="school-chart-header">
                  <div>
                    <h3 className="school-chart-title">Student Score Spread</h3>
                    <div className="school-chart-subtitle">Number of students categorized by point brackets</div>
                  </div>
                </div>
                <div style={{ padding: '10px 0' }}>
                  <svg className="school-chart-svg" viewBox="0 0 400 200">
                    {/* Gridlines */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Y-Axis Labels */}
                    <text x="30" y="24" fill="#64748b" fontSize="10" textAnchor="end">{maxCount}</text>
                    <text x="30" y="74" fill="#64748b" fontSize="10" textAnchor="end">{Math.round(maxCount / 2)}</text>
                    <text x="30" y="124" fill="#64748b" fontSize="10" textAnchor="end">0</text>

                    {/* Bars */}
                    {Object.entries(pointBrackets).map(([bracket, count], index) => {
                      const barWidth = 45;
                      const gap = 35;
                      const x = 70 + index * (barWidth + gap);
                      const barHeight = (count / maxCount) * 130;
                      const y = 170 - barHeight;

                      return (
                        <g key={bracket}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="#E9A132"
                            rx="4"
                            className="school-chart-bar"
                          />
                          {/* Count Label */}
                          <text x={x + barWidth / 2} y={y - 8} fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
                            {count}
                          </text>
                          {/* Bracket X Label */}
                          <text x={x + barWidth / 2} y="188" fill="#64748b" fontSize="10" textAnchor="middle">
                            {bracket}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Dynamic Categories Distribution */}
              <div className="school-chart-card">
                <h3 className="school-chart-title">Participation by Sport</h3>
                <div className="school-chart-subtitle" style={{ marginBottom: '20px' }}>Total event entries in each program</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {Object.entries(categoryCounts).map(([category, count], idx) => {
                    const totalCounts = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 1;
                    const percent = Math.round((count / totalCounts) * 100);
                    const colors = ['#E9A132', '#1e88e5', '#10b981', '#8b5cf6', '#ef4444', '#ec4899'];
                    
                    return (
                      <div key={category}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px', textTransform: 'capitalize' }}>
                          <span>{category}</span>
                          <span style={{ color: '#64748b' }}>{count} ({percent}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', backgroundColor: colors[idx % colors.length], borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Roster & Top Athletes */}
            <div className="school-dashboard-details">
              <div className="school-panel">
                <h3 className="school-panel-title"><Trophy size={18} style={{ color: '#E9A132' }} /> Top Performing Athletes</h3>
                <div className="school-table-wrapper">
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>Athlete</th>
                        <th>Student ID</th>
                        <th>Points</th>
                        <th style={{ textAlign: 'right' }}>Ranks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topAthletes.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No student rankings available yet.</td>
                        </tr>
                      ) : (
                        topAthletes.map((st, i) => (
                          <tr key={st.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#1e88e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                  {st.full_name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 'bold' }}>{st.full_name}</span>
                              </div>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{st.custom_student_id}</td>
                            <td style={{ fontWeight: 'bold', color: '#1e88e5' }}>{st.points || 0}</td>
                            <td style={{ textAlign: 'right' }}>
                              <span className="school-badge school-badge-warning" style={{ fontSize: '0.68rem' }}>
                                AIR #{st.bestAir || '--'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions / Announcements */}
              <div className="school-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 className="school-panel-title">School Milestones</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '15px', backgroundColor: '#fffbeb', borderLeft: '4px solid #E9A132', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Official Partner Institute</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>Verified School Level badge active.</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>Top 50 State Ranking</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>Your school is in the state top brackets.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= ROSTER TAB ================= */}
        {activeTab === 'roster' && !selectedStudent && (
          <div className="school-panel">
            <div className="school-search-bar">
              <div className="school-search-input-wrapper">
                <input 
                  type="text" 
                  className="school-search-input" 
                  placeholder="Search students by name or custom student ID..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="school-table-wrapper">
              <table className="school-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Custom ID</th>
                    <th>Gender</th>
                    <th>Global Points</th>
                    <th>Live Rank</th>
                    <th>Event Performance</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        No students enrolled under your school match the search query.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(st => (
                      <tr key={st.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                              {st.photo_url ? (
                                <img src={st.photo_url} alt={st.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                initials(st.full_name)
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{st.full_name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{st.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{st.custom_student_id}</td>
                        <td style={{ textTransform: 'capitalize' }}>{st.gender}</td>
                        <td>
                          <span className="school-badge school-badge-primary" style={{ fontWeight: 'bold' }}>
                            {st.points || 0} pts
                          </span>
                        </td>
                        <td>
                          <span className="school-badge school-badge-warning" style={{ fontSize: '0.7rem' }}>
                            AIR #{st.bestAir || '--'}
                          </span>
                        </td>
                        <td>
                          {st.performancesList && st.performancesList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {st.performancesList.slice(0, 2).map((p, idx) => (
                                <div key={idx} style={{ fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: '600', color: '#475569' }}>{p.eventName}</span>
                                  <span className="school-badge school-badge-success" style={{ padding: '2px 6px', fontSize: '0.65rem', lineHeight: '1' }}>
                                    AIR #{p.airRank || '--'}
                                  </span>
                                </div>
                              ))}
                              {st.performancesList.length > 2 && (
                                <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                                  + {st.performancesList.length - 2} more events
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No events recorded</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="school-sync-btn"
                            style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => handleViewStudent(st)}
                          >
                            Detailed Profile <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Student View Sub-tab */}
        {activeTab === 'roster' && selectedStudent && (
          <div className="school-panel student-detail-container">
            <button 
              className="school-sync-btn"
              style={{ marginBottom: '20px' }}
              onClick={() => setSelectedStudent(null)}
            >
              <ArrowLeft size={14} /> Back to Student Roster
            </button>

            <div className="student-detail-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="student-detail-pfp">
                  {selectedStudent.photo_url ? (
                    <img src={selectedStudent.photo_url} alt={selectedStudent.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    initials(selectedStudent.full_name)
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}>
                    {selectedStudent.full_name}
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
                    ID: {selectedStudent.custom_student_id} • {selectedStudent.gender} • {selectedStudent.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ padding: '12px 20px', backgroundColor: 'rgba(30, 136, 229, 0.08)', borderRadius: '12px', border: '1px solid rgba(30, 136, 229, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e88e5', fontFamily: 'monospace' }}>
                    {selectedStudent.points || 0}
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#1e88e5', fontWeight: 600, letterSpacing: '0.5px' }}>Global Points</div>
                </div>

                <div style={{ padding: '12px 20px', backgroundColor: 'rgba(233, 161, 50, 0.08)', borderRadius: '12px', border: '1px solid rgba(233, 161, 50, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E9A132', fontFamily: 'monospace' }}>
                    #{selectedStudent.bestAir || '--'}
                  </div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#E9A132', fontWeight: 600, letterSpacing: '0.5px' }}>Best AIR Rank</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Demographics</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <div><strong>Date of Birth:</strong> {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'N/A'}</div>
                  <div><strong>State:</strong> {selectedStudent.state}</div>
                  <div><strong>District:</strong> {selectedStudent.district}</div>
                  <div><strong>Address:</strong> {selectedStudent.address || 'N/A'}</div>
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Contact Info</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <div><strong>Email Address:</strong> {selectedStudent.email}</div>
                  <div><strong>Phone Number:</strong> {selectedStudent.phone || 'N/A'}</div>
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px', color: '#0f172a' }}>
              Competition History & Scores
            </h3>

            {loadingStudent ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading event performance...</div>
            ) : studentPerformances.length === 0 ? (
              <div style={{ padding: '30px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', textAlign: 'center', border: '1px dashed #cbd5e1', marginBottom: '30px' }}>
                This student has not recorded any performance history.
              </div>
            ) : (
              <div className="school-table-wrapper" style={{ marginBottom: '35px' }}>
                <table className="school-table">
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th>Event Name</th>
                      <th>Category</th>
                      <th>Score Value</th>
                      <th>AIR Rank</th>
                      <th>State Rank</th>
                      <th>District Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformances.map((perf, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold' }}>{perf.events?.name}</td>
                        <td style={{ textTransform: 'capitalize' }}>{perf.events?.sport_category}</td>
                        <td style={{ fontWeight: 'bold', color: '#1e88e5' }}>
                          {perf.metric_value || 'Pending'}
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '4px' }}>
                            {perf.metric_value ? perf.events?.event_type : ''}
                          </span>
                        </td>
                        <td>{perf.national_rank ? `#${perf.national_rank}` : 'Pending'}</td>
                        <td>{perf.state_rank ? `#${perf.state_rank}` : 'Pending'}</td>
                        <td>{perf.district_rank ? `#${perf.district_rank}` : 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px', color: '#0f172a' }}>
              Official Certificates
            </h3>
            
            {studentCertificates.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                No certificates generated for this student.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {studentCertificates.map(cert => (
                  <div key={cert.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <AwardIcon size={20} style={{ color: '#10b981' }} />
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#0f172a' }}>{cert.events?.name}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {new Date(cert.created_at).toLocaleDateString()}</div>
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#eff6ff', color: '#1e88e5', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Download PDF <Download size={14} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= LEADERBOARD TAB ================= */}
        {activeTab === 'leaderboard' && (
          <>
            {/* Live Rankings Cards */}
            <div className="school-leaderboard-grid">
              <div className="school-rank-card">
                <div className="school-rank-medal gold">1</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>All India Rank</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>#{bestRank.air}</div>
                  <div style={{ fontSize: '0.78rem', color: '#d18f2b', fontWeight: 500 }}>National percentile</div>
                </div>
              </div>

              <div className="school-rank-card">
                <div className="school-rank-medal silver">2</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>State Rank</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>#{bestRank.state}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>State level standings</div>
                </div>
              </div>

              <div className="school-rank-card">
                <div className="school-rank-medal bronze">3</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>District Rank</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>#{bestRank.district}</div>
                  <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 500 }}>District level standings</div>
                </div>
              </div>
            </div>

            {/* School Leaderboard Comparison */}
            <div className="school-panel">
              <h3 className="school-panel-title">Institutional Points Table (Top 10 Schools)</h3>
              <div className="school-table-wrapper">
                <table className="school-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                      <th>Institution Name</th>
                      <th>Location</th>
                      <th>Registered Students</th>
                      <th style={{ textAlign: 'right' }}>Cumulative Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSchoolsLeaderboard.slice(0, 10).map((sch, i) => {
                      const isCurrentSchool = sch.id === profile.id;
                      return (
                        <tr 
                          key={sch.id} 
                          style={{ 
                            backgroundColor: isCurrentSchool ? 'rgba(233, 161, 50, 0.05)' : 'transparent',
                            fontWeight: isCurrentSchool ? 'bold' : 'normal',
                            borderLeft: isCurrentSchool ? '4px solid #E9A132' : 'none'
                          }}
                        >
                          <td style={{ textAlign: 'center', fontWeight: '700' }}>
                            {sch.rank === 1 && <span style={{ color: '#E9A132' }}>🥇 1</span>}
                            {sch.rank === 2 && <span style={{ color: '#94a3b8' }}>🥈 2</span>}
                            {sch.rank === 3 && <span style={{ color: '#d97706' }}>🥉 3</span>}
                            {sch.rank > 3 && `#${sch.rank}`}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building size={16} style={{ color: isCurrentSchool ? '#E9A132' : '#64748b' }} />
                              <span>{sch.school_name}</span>
                              {isCurrentSchool && <span style={{ fontSize: '0.7rem', backgroundColor: '#E9A132', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>YOUR SCHOOL</span>}
                            </div>
                          </td>
                          <td style={{ color: '#64748b' }}>{sch.district}, {sch.state}</td>
                          <td>{sch.studentCount} students</td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold', color: isCurrentSchool ? '#E9A132' : '#0f172a' }}>
                            {sch.score.toLocaleString()} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="school-panel" style={{ maxWidth: '650px' }}>
            <h3 className="school-panel-title">Update School Profile</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="field-label" htmlFor="schoolName" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  School / Institution Name
                </label>
                <input 
                  type="text" 
                  id="schoolName" 
                  className="school-search-input" 
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Greenwood High School"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="schoolAddress" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>
                  Address / Location (City, State)
                </label>
                <input 
                  type="text" 
                  id="schoolAddress" 
                  className="school-search-input" 
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Please format as <strong>City, State</strong> for correct location parsing and rankings.
                </span>
              </div>

              {profileError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} /> Both fields are required.
                </div>
              )}

              <button 
                type="submit" 
                className="btn"
                style={{ padding: '12px 24px', alignSelf: 'flex-start', marginTop: '10px' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </main>

      <div className={`toast ${toastMessage ? 'show' : ''}`} style={{ left: 'calc(50% + 140px)' }}>{toastMessage}</div>

      {/* FLOATING MOBILE SIDEBAR TOGGLE BUTTON */}
      <button 
        className="mobile-sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#E9A132',
          color: '#111827',
          border: 'none',
          boxShadow: '0 4px 15px rgba(233, 161, 50, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default SchoolDashboard;
