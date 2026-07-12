import React, { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authAPI';

const Auth = () => {
  useSEO({
    title: 'Login',
    description: "Login to your Amazing Kids of India account.",
    keywords: "login, amazing kids account, student dashboard login",
    url: "https://amazingkidsofindia.com/auth"
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { role } = await loginUser(email, password);
      // Route based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'school') navigate('/dashboard/school');
      else if (role === 'student') navigate('/dashboard/student');
      else navigate('/'); // Fallback
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-light)', paddingTop: '80px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', marginBottom: '30px' }}>Welcome Back</h2>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-light)', marginBottom: '5px' }}>Email Address / User ID</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-light)', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '15px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '10px' }}>Don't have an account?</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/register/student" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Register as Student</Link>
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>|</span>
            <Link to="/register/school" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Register as School</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
