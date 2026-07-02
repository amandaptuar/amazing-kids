import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Building, Calendar, Trophy, Activity, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SchoolDashboard = () => {
  const { role, profile, loading } = useAuth();

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
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
              <h3 style={{ margin: 0, fontSize: '28px', color: 'var(--text-dark)' }}>0</h3>
            </div>
            <div style={{ backgroundColor: 'var(--bg-light)', padding: '15px', borderRadius: '12px' }}>
              <Users size={24} style={{ color: '#ef4444' }}/>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-light)', fontSize: '14px', textTransform: 'uppercase', fontWeight: 'bold' }}>Events Participated</p>
              <h3 style={{ margin: 0, fontSize: '28px', color: 'var(--text-dark)' }}>0</h3>
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
          <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>No students have registered under your school yet. Once they register, their profiles and event rankings will appear here automatically.</p>
        </div>

      </div>
    </div>
  );
};

export default SchoolDashboard;
