import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../services/authAPI';
import { User, MapPin, Phone, Mail, Lock, Calendar, School, Gamepad2, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import * as india from '../lib/indiaData';
import Swal from 'sweetalert2';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', dob: '', gender: 'Male',
    parentName: '', state: '', district: '', address: '', schoolId: '', games: []
  });
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  const allStates = india.getAllStates();
  const availableDistricts = formData.state ? india.getDistrictsByState(formData.state) || [] : [];

  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase.from('schools').select('id, school_name');
      if (data) setSchools(data);
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerStudent(formData);
      window.location.href = '/dashboard/student';
    } catch (error) {
      Swal.fire({
        title: 'Registration Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = { marginBottom: '20px' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
  const iconStyle = { position: 'absolute', left: '15px', color: 'var(--text-light)' };
  const inputStyle = { width: '100%', padding: '14px 15px 14px 45px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '15px', transition: 'all 0.3s ease', backgroundColor: '#f9fafb' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)', padding: '100px 20px 60px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="container" style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        
        {/* Header Section */}
        <div style={{ backgroundColor: 'var(--primary-blue)', padding: '40px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '250px', height: '250px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '36px', position: 'relative', zIndex: 1 }}>Student Registration</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px', position: 'relative', zIndex: 1 }}>Join the Amazing Kids platform and compete nationally!</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          
          <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '25px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px' }}>Personal Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <div style={inputContainerStyle}>
                <User size={18} style={iconStyle} />
                <input type="text" placeholder="Student's Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={inputStyle} />
              </div>
            </div>
            
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <div style={inputContainerStyle}>
                  <Calendar size={18} style={iconStyle} />
                  <input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{...inputStyle, paddingLeft: '15px'}}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Parent Name</label>
              <div style={inputContainerStyle}>
                <User size={18} style={iconStyle} />
                <input type="text" placeholder="Guardian's Name" required value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '25px', marginTop: '10px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px' }}>Location Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
            <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Full Address</label>
              <div style={inputContainerStyle}>
                <MapPin size={18} style={iconStyle} />
                <input type="text" placeholder="Street Address, City" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>State</label>
              <div style={inputContainerStyle}>
                <MapPin size={18} style={iconStyle} />
                <select 
                  required 
                  value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value, district: ''})} 
                  style={{...inputStyle, paddingLeft: '45px', appearance: 'auto'}}
                >
                  <option value="" disabled>-- Select State --</option>
                  {allStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>District</label>
              <div style={inputContainerStyle}>
                <MapPin size={18} style={iconStyle} />
                <select 
                  required 
                  value={formData.district} 
                  onChange={e => setFormData({...formData, district: e.target.value})} 
                  style={{...inputStyle, paddingLeft: '45px', appearance: 'auto'}}
                  disabled={!formData.state}
                >
                  <option value="" disabled>-- Select District --</option>
                  {availableDistricts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Taluka</label>
              <div style={inputContainerStyle}>
                <MapPin size={18} style={iconStyle} />
                <input type="text" placeholder="Your Taluka" required value={formData.taluka} onChange={e => setFormData({...formData, taluka: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '25px', marginTop: '10px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px' }}>School & Programs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Select Your School</label>
              <div style={inputContainerStyle}>
                <School size={18} style={iconStyle} />
                <select required value={formData.schoolId} onChange={e => setFormData({...formData, schoolId: e.target.value})} style={{...inputStyle, paddingLeft: '45px', appearance: 'auto'}}>
                  <option value="" disabled>-- Select a registered school --</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.school_name}</option>
                  ))}
                </select>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'gray' }}>* Only registered schools are shown. Ask your school to register first if not listed.</p>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '25px', marginTop: '10px', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px' }}>Account Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address (Login ID)</label>
              <div style={inputContainerStyle}>
                <Mail size={18} style={iconStyle} />
                <input type="email" placeholder="student@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
              </div>
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Create Password</label>
              <div style={inputContainerStyle}>
                <Lock size={18} style={iconStyle} />
                <input type="password" placeholder="Min 6 characters" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px' }}>
              Already registered? <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
            </p>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '16px 30px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s' }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Registering...' : 'Complete Registration'} <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterStudent;
