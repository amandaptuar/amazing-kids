import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Fast and snappy loading
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.75)', // Transparent white overlay
            backdropFilter: 'blur(8px)', // Glassmorphism effect so website is visible behind
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Logo Container */}
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
            
            {/* Logo inside */}
            <motion.img 
              src="/logo.png" 
              alt="Amazing Kids Logo"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                height: '70px', 
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1
              }} 
            />
          </div>
          
          {/* Premium Clean Loading Text */}
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              color: 'var(--primary-dark)', 
              fontFamily: 'var(--font-heading)', 
              fontSize: '16px', 
              fontWeight: 'bold',
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}
          >
            Loading<motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >...</motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
