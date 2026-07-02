import React from 'react';
import { motion } from 'framer-motion';

const Programs = () => {
  const programs = [
    {
      title: 'Youngest Fastest Athlete of India',
      icon: '🏃',
      description: "Our athletic program features Track Events like Time Trials and Height Jumps for various age groups. Competitions are held on grass, mud, or synthetic venues to discover India's fastest and most agile young athletes."
    },
    {
      title: 'Youngest Fastest Skater of India',
      icon: '⛸️',
      description: "A thrilling speed-track competition for young skaters, featuring beginner, quad, and inline formats. Skaters compete in multi-lap races across different age groups to find the fastest young skater in the nation."
    },
    {
      title: 'Youngest Fastest Cyclist of India',
      icon: '🚴',
      description: "An exciting cycling event focusing on Time Trials and circuit races. Young cyclists compete across various distances from 250m to 500m to showcase their speed, endurance, and cycling proficiency."
    },
    {
      title: 'Youngest Musician of India',
      icon: '🎸',
      description: 'A musician is an individual who creates, performs, or composes music. Music is a universal form of art and expression, and musicians play a pivotal role in bringing it to life.'
    },
    {
      title: 'Youngest Artist of India',
      icon: '🎨',
      description: 'Drawing is a creative and expressive art form that involves creating images, designs, or illustrations on a surface using various drawing tools and techniques. Drawing can be a hobby, a form of artistic expression, or a professional skill.'
    },
    {
      title: 'Youngest Dancer of India',
      icon: '💃',
      description: 'Celebrating the joy, rhythm, and grace of movement. We recognize the youngest dance talents who bring stories to life on the stage.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section style={{ backgroundColor: 'var(--white)', padding: '80px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <h2 className="section-title">OUR COMPETITION CATEGORIES</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto' }}>
            Discover the exciting platforms we offer for talented children across India to showcase their skills, compete, and be recognized.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}
        >
          {programs.map((program, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
              style={{
                backgroundColor: 'var(--bg-light)',
                borderRadius: '12px',
                padding: '30px',
                borderTop: '5px solid var(--accent-orange)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: 'var(--primary-dark)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  {program.icon}
                </div>
                <h3 style={{ 
                  fontSize: '20px', 
                  margin: 0, 
                  color: 'var(--text-dark)',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: '1.3'
                }}>
                  {program.title}
                </h3>
              </div>
              
              <div style={{ flex: 1 }}>
                {program.description ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6' }}>
                    {program.description}
                  </p>
                ) : (
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {program.details.map((detail, idx) => (
                      <li key={idx} style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <strong style={{ color: 'var(--text-dark)', marginBottom: '2px' }}>{detail.label}</strong>
                        <span style={{ color: 'var(--text-dark)' }}>{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Programs;
