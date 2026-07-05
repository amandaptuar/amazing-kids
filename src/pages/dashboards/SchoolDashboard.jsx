import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Building, Calendar, Trophy, Activity, ArrowUpRight, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

const SchoolDashboard = () => {
  const { role, profile, loading } = useAuth();
  const [myStudents, setMyStudents] = useState([]);
  const [eventsParticipated, setEventsParticipated] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (role === 'school' && profile?.id) {
        try {
          // 1. Fetch Students
          const { data: studentsData, error: studentError } = await supabase
            .from('students')
            .select('id, full_name, dob, gender, points, email, parent_name, address, state, district, games_interested')
            .eq('school_id', profile.id)
            .order('points', { ascending: false });

          if (studentError) throw studentError;
          setMyStudents(studentsData || []);

          // 2. Fetch Events count if there are students
          if (studentsData && studentsData.length > 0) {
            const studentIds = studentsData.map(s => s.id);
            const { count, error: countError } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact', head: true })
              .in('student_id', studentIds);
              
            if (!countError && count) {
              setEventsParticipated(count);
            }
          }
        } catch (error) {
          console.error("Error fetching school dashboard data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    
    fetchSchoolData();
  }, [role, profile]);

  const handleViewProfile = (student) => {
    Swal.fire({
      title: `<h3 style="margin:0; color:var(--primary-dark); font-family:var(--font-heading)">${student.full_name}</h3>`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Email:</strong> ${student.email || 'N/A'}</p>
          <p><strong>Parent/Guardian:</strong> ${student.parent_name || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> ${student.dob || 'N/A'}</p>
          <p><strong>Gender:</strong> ${student.gender || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
          <p><strong>Location:</strong> ${student.address || 'N/A'}</p>
          <p><strong>State & District:</strong> ${student.state || 'N/A'}, ${student.district || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
          <p><strong>Global Points:</strong> <span style="color:var(--accent-orange); font-weight:bold">${student.points || 0}</span></p>
          <p><strong>Interests:</strong> ${student.games_interested ? student.games_interested.join(', ') : 'None specified'}</p>
        </div>
      `,
      confirmButtonText: 'Close Profile',
      confirmButtonColor: '#3b82f6',
      width: '500px',
      padding: '20px'
    });
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="loader"></div></div>;
  if (role !== 'school' || !profile) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <h2 style={{ color: '#ef4444' }}>Unauthorized Access</h2>
        <p>You must be logged in as a registered School to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      {/* Dashboard Header */}
      <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '32px' }}>{profile.school_name} Dashboard</h1>
            <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>School ID: {profile.custom_school_id}</p>
          </div>
          <Building size={48} style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-light)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Registered Students</p>
              <h3 style={{ margin: 0, fontSize: '28px', color: 'var(--text-dark)' }}>{dataLoading ? '...' : myStudents.length}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--bg-light)', padding: '15px', borderRadius: '12px' }}>
              <Users size={24} style={{ color: '#ef4444' }}/>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-light)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Events Participated</p>
              <h3 style={{ margin: 0, fontSize: '28px', color: 'var(--text-dark)' }}>{dataLoading ? '...' : eventsParticipated}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--bg-light)', padding: '15px', borderRadius: '12px' }}>
              <Activity size={24} style={{ color: '#ef4444' }}/>
            </div>
          </div>
        </div>

        {/* School Actions */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '15px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0 }}>Your Students</h2>
          </div>
          
          {dataLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading students...</div>
          ) : myStudents.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>No students have registered under your school yet. Once they register, their profiles and event rankings will appear here automatically.</p>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Student Name</th>
                    <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Gender</th>
                    <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Date of Birth</th>
                    <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0' }}>Global Points</th>
                    <th style={{ padding: '15px 20px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myStudents.map((student, idx) => (
                    <tr key={student.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '15px 20px', fontWeight: '500', color: '#0f172a' }}>{student.full_name}</td>
                      <td style={{ padding: '15px 20px', color: '#475569' }}>{student.gender}</td>
                      <td style={{ padding: '15px 20px', color: '#475569' }}>{student.dob || 'Not Provided'}</td>
                      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--accent-orange)' }}>{student.points || 0}</td>
                      <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleViewProfile(student)}
                          style={{ padding: '6px 12px', backgroundColor: '#eff6ff', color: 'var(--primary-blue)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SchoolDashboard;
