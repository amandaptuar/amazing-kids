import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Trophy, Medal, Star, Target, MapPin } from 'lucide-react';

const StudentDashboard = () => {
  const { role, profile, loading } = useAuth();

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
  if (role !== 'student' || !profile) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <h2 style={{ color: '#ef4444' }}>Unauthorized Access</h2>
        <p>You must be logged in as a registered Student to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      
      {/* Student Profile Header */}
      <div style={{ backgroundColor: 'white', padding: '40px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <img 
            src={profile.photo_url || "https://randomuser.me/api/portraits/lego/1.jpg"} 
            alt="Student Profile" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-light)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} 
          />
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 5px 0', fontSize: '32px', color: 'var(--text-dark)' }}>{profile.full_name}</h1>
            <p style={{ margin: '0 0 10px 0', color: 'var(--primary-blue)', fontWeight: 'bold' }}>{profile.custom_student_id}</p>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> {profile.state}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Target size={16}/> {profile.schools?.school_name || 'No School Linked'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        
        {/* Global Rankings Overview */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '20px' }}>Live Ranking Overview</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-orange)' }}>All India Rank</p>
              <h3 style={{ margin: 0, fontSize: '32px', fontFamily: 'var(--font-heading)' }}># --</h3>
            </div>
            <Trophy size={48} style={{ opacity: 0.3 }} />
          </div>
          
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>State Rank</p>
              <h3 style={{ margin: 0, fontSize: '32px', fontFamily: 'var(--font-heading)' }}># --</h3>
            </div>
            <Medal size={48} style={{ opacity: 0.3 }} />
          </div>

          <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>District Rank</p>
              <h3 style={{ margin: 0, fontSize: '32px', fontFamily: 'var(--font-heading)' }}># --</h3>
            </div>
            <Star size={48} style={{ opacity: 0.3 }} />
          </div>
        </div>

        {/* Participated Events */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0 }}>My Events</h2>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>You haven't participated in any events yet. Check out the Programs tab to register for upcoming competitions!</p>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
