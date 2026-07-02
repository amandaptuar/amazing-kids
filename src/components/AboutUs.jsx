import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section style={{ backgroundColor: 'var(--bg-light)', padding: '80px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px' }}>
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ flex: '1 1 500px' }}
          >
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              ABOUT - AMAZING KIDS OF INDIA
            </h2>
            <div style={{ 
              width: '50px', 
              height: '3px', 
              backgroundColor: 'var(--accent-orange)', 
              marginBottom: '30px' 
            }} />
            
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '20px' }}>
              <strong>NASPE INDIA</strong> (National Academy for Sports & Physical Education, India) - Amazing Kids is a unique platform for students aged 3 years to 10 years where they are recognized and awarded in a ranking competition <strong>(First time in India)</strong>.
            </p>
            
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '30px' }}>
              Preparing kids at the grassroot level for the future. We urge you to support and help us build perfect athletes for our Nation – India.
            </p>
            
            <motion.button 
              className="btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LEARN MORE
            </motion.button>
          </motion.div>
          
          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: '1 1 400px', position: 'relative' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-15px', 
              left: '-15px', 
              width: '100%', 
              height: '100%', 
              border: '4px solid var(--accent-orange)', 
              borderRadius: '8px',
              zIndex: 0
            }} />
            <img 
              src="/naspe.png" 
              alt="NASPE India" 
              style={{ width: '100%', height: 'auto', borderRadius: '8px', position: 'relative', zIndex: 1, boxShadow: '0 15px 30px rgba(0,0,0,0.1)', objectFit: 'contain' }} 
            />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
