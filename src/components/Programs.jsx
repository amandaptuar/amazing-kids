import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Bike, Music, Palette, Star } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      title: 'Youngest Fastest Athlete of India',
      icon: <Activity size={32} color="white" />,
      description: "Our athletic program features Track Events like Time Trials and 50m/100m dashes for various age groups. Competitions are held on grass, mud, or synthetic venues to discover India's fastest and most agile young athletes."
    },
    {
      title: 'Youngest High Jumper of India',
      icon: <Star size={32} color="white" />,
      description: "A thrilling high jump competition for young athletes, featuring beginner and advanced formats. Athletes compete to reach new heights across different age groups to find the best high jumper in the nation."
    },
    {
      title: 'Youngest Thrower of India',
      icon: <Zap size={32} color="white" />,
      description: "An exciting throwing event focusing on distance and technique. Young athletes compete across various throwing styles to showcase their strength and proficiency."
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
