import React, { useEffect, useState } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Star, Flame, Crown, Building, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Leaderboard = () => {
  useSEO({
    title: 'Global Leaderboard',
    description: "View the national points leaderboard for Amazing Kids of India ranking competitions.",
    keywords: "kids leaderboard, sports ranking, amazing kids points",
    url: "https://amazingkidsofindia.com/leaderboard"
  });
  const [leaders, setLeaders] = useState([]);
  const [schoolLeaders, setSchoolLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'schools' ? 'schools' : 'students';
  });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'schools') {
      setActiveTab('schools');
    }
  }, [location.search]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Fetch top 50 students sorted by points
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          points,
          district,
          state,
          schools ( school_name )
        `)
        .order('points', { ascending: false, nullsFirst: false })
        .limit(50);

      if (!error && data) {
        setLeaders(data.filter(s => s.points > 0));
      }

      // Fetch all students to aggregate school points
      const { data: allStudentsData, error: schoolErr } = await supabase
        .from('students')
        .select(`
          points,
          school_id,
          schools ( id, school_name, district, state )
        `)
        .not('school_id', 'is', null);
        
      if (!schoolErr && allStudentsData) {
        const schoolPoints = {};
        allStudentsData.forEach(student => {
          if (!student.schools || !student.points) return;
          const sId = student.schools.id;
          if (!schoolPoints[sId]) {
            schoolPoints[sId] = {
               id: sId,
               name: student.schools.school_name,
               district: student.schools.district,
               state: student.schools.state,
               points: 0,
               studentCount: 0
            };
          }
          schoolPoints[sId].points += student.points;
          schoolPoints[sId].studentCount += 1;
        });
        
        const sortedSchools = Object.values(schoolPoints)
          .filter(s => s.points > 0)
          .sort((a, b) => b.points - a.points)
          .slice(0, 50);
          
        setSchoolLeaders(sortedSchools);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (index) => {
    if (index === 0) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', icon: <Crown size={24} color="#fbbf24" /> }; // Gold
    if (index === 1) return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: <Medal size={24} color="#94a3b8" /> }; // Silver
    if (index === 2) return { color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)', icon: <Medal size={24} color="#b45309" /> }; // Bronze
    return { color: '#64748b', bg: 'transparent', icon: null };
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ backgroundColor: '#fffbeb', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', boxShadow: '0 10px 25px rgba(251,191,36,0.3)' }}>
              <Trophy size={40} color="#fbbf24" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--primary-dark)', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Hall of Fame</h1>
            <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              The ultimate ranking of Amazing Kids based on Global Points earned through games and activities!
            </p>
          </motion.div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab('students')}
            style={{ 
              padding: '12px 30px', 
              borderRadius: '50px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: activeTab === 'students' ? 'var(--primary-blue)' : 'white',
              color: activeTab === 'students' ? 'white' : '#64748b',
              boxShadow: activeTab === 'students' ? '0 10px 20px rgba(59, 130, 246, 0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
          >
            <Users size={18} /> Top Students
          </button>
          <button 
            onClick={() => setActiveTab('schools')}
            style={{ 
              padding: '12px 30px', 
              borderRadius: '50px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: activeTab === 'schools' ? 'var(--accent-orange)' : 'white',
              color: activeTab === 'schools' ? 'white' : '#64748b',
              boxShadow: activeTab === 'schools' ? '0 10px 20px rgba(249, 115, 22, 0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
          >
            <Building size={18} /> Top Schools
          </button>
        </div>

        {/* Leaderboard Table Area */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
          
          <div style={{ backgroundColor: 'var(--primary-dark)', padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '20px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={20} color="#fbbf24" /> Top Scorers
            </h2>
            <div style={{ color: '#cbd5e1', fontSize: '13px' }}>Live Updates</div>
          </div>

          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
              Crunching the numbers...
            </div>
          ) : leaders.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <Star size={48} color="#cbd5e1" style={{ margin: '0 auto 15px auto' }} />
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-dark)' }}>No Points Awarded Yet</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Be the first to play games and claim the top spot!</p>
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              {activeTab === 'students' && leaders.map((student, index) => {
                const style = getRankStyle(index);
                return (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '15px 20px', 
                      backgroundColor: style.bg,
                      borderRadius: '16px',
                      marginBottom: '10px',
                      border: index < 3 ? `1px solid ${style.color}40` : '1px solid transparent',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.03)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    
                    <div style={{ width: '50px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: style.color, display: 'flex', justifyContent: 'center' }}>
                      {style.icon ? style.icon : `#${index + 1}`}
                    </div>
                    
                    <div style={{ marginLeft: '15px', display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: index < 3 ? style.color : '#f1f5f9', color: index < 3 ? 'white' : 'var(--text-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{student.full_name}</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                          {student.schools?.school_name || 'Independent'} • {student.state}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)', fontFamily: 'monospace' }}>
                        {student.points.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Points</div>
                    </div>
                  </motion.div>
                );
              })}

              {activeTab === 'schools' && schoolLeaders.map((school, index) => {
                const style = getRankStyle(index);
                return (
                  <motion.div 
                    key={school.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '15px 20px', 
                      backgroundColor: style.bg,
                      borderRadius: '16px',
                      marginBottom: '10px',
                      border: index < 3 ? `1px solid ${style.color}40` : '1px solid transparent',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.03)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    
                    <div style={{ width: '50px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: style.color, display: 'flex', justifyContent: 'center' }}>
                      {style.icon ? style.icon : `#${index + 1}`}
                    </div>
                    
                    <div style={{ marginLeft: '15px', display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: index < 3 ? style.color : '#f1f5f9', color: index < 3 ? 'white' : 'var(--text-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                        <Building size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{school.name}</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                          {school.district}, {school.state} • {school.studentCount} Students
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-dark)', fontFamily: 'monospace' }}>
                        {school.points.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Points</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
