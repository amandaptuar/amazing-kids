import React from 'react';
import { motion } from 'framer-motion';

const MatchSchedule = () => {
  return (
    <section style={{ 
      backgroundColor: 'var(--primary-dark)',
      backgroundImage: 'linear-gradient(rgba(5, 44, 84, 0.9), rgba(5, 44, 84, 0.9)), url("https://images.unsplash.com/photo-1574629810360-7efbb824f605?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      color: 'white',
      padding: '100px 0'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ 
              fontSize: '32px', 
              margin: 0,
              fontFamily: 'var(--font-heading)',
              borderLeft: '4px solid var(--accent-orange)',
              paddingLeft: '15px'
            }}
          >
            MATCH SCHEDULE
          </motion.h2>
          
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             style={{ display: 'flex', gap: '10px' }}
          >
            <button style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer' }}>&lt;</button>
            <button style={{ width: '40px', height: '40px', backgroundColor: 'var(--accent-orange)', border: 'none', color: 'white', cursor: 'pointer' }}>&gt;</button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ color: 'var(--accent-orange)', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '2px' }}>UPCOMING MATCH</div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(20px, 8vw, 80px)', width: '100%' }}>
            {/* Team 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', color: 'var(--text-dark)' }}>
                ★
              </div>
              <h3 style={{ fontSize: '20px', margin: 0, fontFamily: 'var(--font-heading)' }}>Amazing Kids A</h3>
            </div>
            
            {/* VS */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }}>VS</div>
            </div>
            
            {/* Team 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#e0e0e0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', color: '#555' }}>
                🛡️
              </div>
              <h3 style={{ fontSize: '20px', margin: 0, fontFamily: 'var(--font-heading)' }}>Titans FC</h3>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '30px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span> 22 Sep 2026 - 6:00 PM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏟️</span> Grand Stadium, NY
            </div>
          </div>
          
          <motion.button 
            className="btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginTop: '30px' }}
          >
            VIEW DETAILS
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MatchSchedule;
