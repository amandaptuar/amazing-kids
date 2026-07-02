import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: '🏆',
      title: "India's 1st Ranking Event",
      description: 'The first-ever dedicated ranking competition platform exclusively for young talents aged 3 to 12 years in India.'
    },
    {
      icon: '🌱',
      title: 'Grassroot Development',
      description: 'Focused on identifying and nurturing talent early, preparing perfect athletes and artists for the nation.'
    },
    {
      icon: '🏅',
      title: 'National Recognition',
      description: 'Every participant gets a platform to showcase their skills, earn a national rank, and get recognized for their hard work.'
    },
    {
      icon: '🏟️',
      title: 'Professional Venues',
      description: 'Competitions held on professional synthetic tracks, courts, and stages ensuring a safe and premium experience.'
    }
  ];

  return (
    <section style={{ backgroundColor: 'var(--bg-light)', padding: '100px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 className="section-title">WHY AMAZING KIDS?</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            We provide a unique, structured environment for young kids to discover their potential, compete healthily, and grow.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px' 
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'var(--white)',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }}
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '20px',
                display: 'inline-block',
                padding: '20px',
                backgroundColor: 'var(--primary-light)',
                borderRadius: '50%'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                color: 'var(--text-dark)', 
                fontFamily: 'var(--font-heading)',
                marginBottom: '15px'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '15px', 
                lineHeight: '1.7',
                margin: 0
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
