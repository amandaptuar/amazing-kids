import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertTriangle } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const NotFound = () => {
  useSEO({
    title: '404 - Page Not Found',
    description: "The page you are looking for does not exist on Amazing Kids of India.",
    keywords: "404, page not found, amazing kids error",
    url: "https://amazingkidsofindia.com/404"
  });

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
      backgroundColor: 'var(--bg-light)',
      backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'white',
          padding: '50px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          backgroundColor: 'var(--primary-gold)',
          opacity: 0.1,
          borderRadius: '50%'
        }}></div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px auto'
          }}
        >
          <AlertTriangle size={48} color="#ef4444" />
        </motion.div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '48px',
          color: 'var(--text-dark)',
          margin: '0 0 10px 0',
          lineHeight: '1.2'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '22px',
          color: 'var(--primary-blue)',
          margin: '0 0 20px 0',
          fontWeight: 'bold'
        }}>
          Page Not Found
        </h2>
        
        <p style={{
          color: '#64748b',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '35px'
        }}>
          Oops! The page you are looking for seems to have run off the track. It might have been moved, renamed, or perhaps never existed.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            backgroundColor: 'var(--primary-blue)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link to="/program/athlete" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            backgroundColor: '#f8fafc',
            color: 'var(--text-dark)',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          >
            <Search size={18} />
            Explore Programs
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
