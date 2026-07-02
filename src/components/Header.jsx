import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authAPI';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, profile } = useAuth();
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
        { name: 'Athletic', path: '/program/athletic' },
        { name: 'Cycling', path: '/program/cycling' },
        { name: 'Skating', path: '/program/skating' },
        { name: 'Dancer', path: '/program/dancer' },
        { name: 'Artist', path: '/program/artist' },
        { name: 'Musician', path: '/program/musician' }
      ]
    },
    { name: 'Event', href: '/events' },
    { name: 'Associate Member', href: '#' },
    { name: 'Contact Us', href: '/contact' }
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
                      minWidth: '200px',
                      borderTop: '10px solid transparent', // Invisible bridge to prevent hover loss
                      backgroundClip: 'padding-box', // Keeps the border transparent while the background is white
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
            {user ? (
              <>
                <Link to={role === 'admin' ? '/admin' : `/dashboard/${role}`} className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: 'var(--primary-dark)', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Profile</Link>
                <button onClick={handleLogout} className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Login</Link>
                <Link to="/register/school" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>School</Link>
                <Link to="/register/student" className="btn" style={{ padding: '8px 15px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Student</Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" style={{ display: 'none', color: 'var(--text-dark)', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
