import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchool } from '../services/authAPI';
import { Building, MapPin, Phone, Mail, Lock, ArrowRight, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import * as india from '../lib/indiaData';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const RegisterSchool = () => {
  const [formData, setFormData] = useState({
    schoolName: '', principalName: '', email: '', password: '', 
    state: '', district: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const allStates = india.getAllStates();
  const availableDistricts = formData.state ? india.getDistrictsByState(formData.state) || [] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strong Password Validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      Swal.fire({
        title: 'Weak Password',
        text: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
        icon: 'warning',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    setLoading(true);
    try {
      await registerSchool(formData);

      // Send Welcome Email via EmailJS
      try {
        await emailjs.send(
          'service_chhvd7x', 
          'template_y84feq3',
          {
            school_name: formData.schoolName,
            principal_name: formData.principalName,
            email: formData.email,
            password: formData.password
          },
          'w1_bsQnbIzah00g7n'
        );
        console.log('School welcome email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send school welcome email:', emailError);
      }

      window.location.href = '/dashboard/school';
    } catch (error) {
      Swal.fire({
        title: 'Registration Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#ef4444'
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
        <div style={{ backgroundColor: '#ef4444', padding: '40px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '250px', height: '250px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <Building size={48} style={{ position: 'relative', zIndex: 1, margin: '0 auto 15px auto', opacity: 0.9 }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '36px', position: 'relative', zIndex: 1 }}>School Registration</h2>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px', position: 'relative', zIndex: 1 }}>Register your institution to track your students' national rankings.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          
          <h3 style={{ fontSize: '18px', color: '#ef4444', marginBottom: '25px', borderBottom: '2px solid rgba(239, 68, 68, 0.1)', paddingBottom: '10px' }}>Institution Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>School Name</label>
              <div style={inputContainerStyle}>
                <Building size={18} style={iconStyle} />
                <input type="text" placeholder="Official School Name" required value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} style={inputStyle} />
              </div>
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Principal Name</label>
              <div style={inputContainerStyle}>
                <User size={18} style={iconStyle} />
                <input type="text" placeholder="Principal's Full Name" required value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: '#ef4444', marginBottom: '25px', marginTop: '10px', borderBottom: '2px solid rgba(239, 68, 68, 0.1)', paddingBottom: '10px' }}>Location Details</h3>
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
          </div>

          <h3 style={{ fontSize: '18px', color: '#ef4444', marginBottom: '25px', marginTop: '10px', borderBottom: '2px solid rgba(239, 68, 68, 0.1)', paddingBottom: '10px' }}>Account Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Official Email (Login ID)</label>
              <div style={inputContainerStyle}>
                <Mail size={18} style={iconStyle} />
                <input type="email" placeholder="school@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
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

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px' }}>
              Already registered? <Link to="/login" style={{ color: '#ef4444', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
            </p>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '16px 30px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)', transition: 'transform 0.2s' }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Registering...' : 'Register Institution'} <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterSchool;
