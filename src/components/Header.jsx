import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authAPI';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { 
      name: 'Program', 
      href: '#', 
      hasDropdown: true,
      dropdownItems: [
        { name: '🏃 Athlete', path: '/program/athlete' },
        { name: '⛸️ Skater', path: '/program/skater' },
        { name: '🚴 Cyclist', path: '/program/cyclist' },
        { name: '💃 Dancer', path: '/program/dancer' },
        { name: '🎵 Musician', path: '/program/musician' },
        { name: '🎨 Artist', path: '/program/artist' },
        { name: '🏅 High Jump', path: '/program/highjump' },
        { name: '🎯 Throw', path: '/program/throw' },
        { name: '🏆 School Leaderboard', path: '/leaderboard' }
      ]
    },
    { name: 'Event', href: '/events' },
    { name: 'Goodies Store', href: '/store' },
    { name: 'Become an Affiliate', href: '/contact' }
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: isScrolled ? '10px 0' : '20px 0',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Amazing Kids Logo" style={{ height: '50px', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '25px', color: 'var(--text-dark)', fontSize: '13px', fontWeight: '600' }}>
            {navLinks.map((link, index) => (
              <li 
                key={index} 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(index)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                <Link to={link.href} style={{ transition: 'color 0.3s', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-blue)'} onMouseOut={(e) => e.target.style.color = 'var(--text-dark)'}>
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} style={{ marginLeft: '4px' }} />}
                </Link>
                
                {/* Dropdown Menu */}
                {link.hasDropdown && activeDropdown === index && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      backgroundColor: 'white',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      padding: '10px 0',
                      minWidth: '220px',
                      maxHeight: '380px',
                      overflowY: 'auto',
                      borderTop: '10px solid transparent',
                      backgroundClip: 'padding-box',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {link.dropdownItems.map((item, idx) => (
                      <Link 
                        key={idx} 
                        to={item.path} 
                        style={{ 
                          padding: '10px 20px', 
                          color: 'var(--text-dark)', 
                          textDecoration: 'none', 
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.3s, color 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                          e.currentTarget.style.color = 'var(--primary-blue)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-dark)';
                        }}
                      >
                        <span style={{ color: 'var(--accent-orange)', fontSize: '10px' }}>▶</span> {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {loading ? (
              <div style={{ width: '150px', height: '35px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            ) : user ? (
              <>
                <Link to={role === 'admin' ? '/admin' : `/dashboard/${role}`} className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Profile</Link>
                <button onClick={handleLogout} className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Login</Link>
                <Link to="/register/school" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>School</Link>
                <Link to="/register/student" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" style={{ display: 'none', color: 'var(--text-dark)', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 80px)', backgroundColor: 'rgba(255, 255, 255, 0.98)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {navLinks.map((link, index) => (
                <div key={index}>
                  <Link 
                    to={link.href} 
                    onClick={() => { if (!link.hasDropdown) setMobileMenuOpen(false); }}
                    style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-dark)', display: 'block', padding: '10px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {link.dropdownItems.map((item, idx) => (
                        <Link 
                          key={idx} 
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'block', padding: '5px 0' }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loading ? (
                   <div style={{ width: '100%', height: '40px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                ) : user ? (
                  <>
                    <Link to={role === 'admin' ? '/admin' : `/dashboard/${role}`} onClick={() => setMobileMenuOpen(false)} className="btn" style={{ textAlign: 'center', width: '100%', textDecoration: 'none' }}>Profile</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn" style={{ backgroundColor: '#e2e8f0', color: 'var(--text-dark)', width: '100%' }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn" style={{ backgroundColor: '#10b981', textAlign: 'center', width: '100%', textDecoration: 'none' }}>Login</Link>
                    <Link to="/register/school" onClick={() => setMobileMenuOpen(false)} className="btn" style={{ backgroundColor: '#ef4444', textAlign: 'center', width: '100%', textDecoration: 'none' }}>School</Link>
                    <Link to="/register/student" onClick={() => setMobileMenuOpen(false)} className="btn" style={{ backgroundColor: '#3b82f6', textAlign: 'center', width: '100%', textDecoration: 'none' }}>Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
