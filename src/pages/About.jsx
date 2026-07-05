import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <main style={{ paddingTop: '80px', backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      
      <div style={{ textAlign: 'center', paddingTop: '60px', backgroundColor: 'var(--white)' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
          ABOUT <span style={{ color: 'var(--accent-orange)' }}>PAGE</span>
        </h1>
      </div>

      {/* Main Content Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
            gap: '60px',
            alignItems: 'center' 
          }}>
            
            {/* Left Side: Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/hero-banner.png" 
                alt="NASPE India Amazing Kids" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }} 
              />
            </motion.div>

            {/* Right Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 style={{ 
                color: 'var(--accent-orange)', 
                fontSize: '14px', 
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                margin: '0 0 10px 0'
              }}>
                ABOUT
              </h4>
              
              <h2 style={{ 
                fontSize: '36px', 
                color: 'var(--text-dark)', 
                fontFamily: 'var(--font-heading)', 
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              }}>
                WELCOME TO THE NASPE INDIA
              </h2>
              
              <div style={{ 
                width: '60px', 
                height: '3px', 
                backgroundColor: 'var(--accent-orange)', 
                marginBottom: '30px' 
              }}></div>

              <div style={{ 
                color: 'var(--text-dark)', 
                fontSize: '15px', 
                lineHeight: '1.8',
                fontFamily: 'var(--font-body)',
                fontWeight: '500'
              }}>
                <p style={{ marginBottom: '20px' }}>
                  <strong>ABOUT &ndash; NASPE INDIA</strong> National Academy for Sports & Physical Education, India- Amazing Kids a unique platform for students aged 3 years to 10 years are recognized and awarded a ranking competition ( First time in India ) . Preparing Kids at grassroot level for future ...
                </p>
                <p style={{ marginBottom: '20px' }}>
                  ( Next Paragraph ) and awarded a ranking competition ( First time in India ) . Preparing Kids at grassroot level for future We urge you to support and help us build a perfect athlete for our Nation &ndash; India .
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--primary-dark)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '250px',
          fontWeight: '900',
          color: 'rgba(255,255,255,0.03)',
          fontFamily: 'var(--font-heading)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          VISION
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--accent-orange)' }}></div>
            </div>
            
            <h2 style={{ 
              fontSize: '28px', 
              color: 'black', 
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: '900',
              marginBottom: '20px' 
            }}>
              Our Vision For The Future
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(22px, 4vw, 32px)', 
              color: 'white', 
              lineHeight: '1.6', 
              fontWeight: '300',
              fontFamily: 'var(--font-heading)'
            }}>
              "To revolutionize physical education and arts at the grassroot level in India, ensuring every talented child is discovered, nurtured, and provided the professional platform they deserve to become the champions of tomorrow."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ padding: '120px 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            marginBottom: '70px',
            maxWidth: '600px'
          }}>
            <h4 style={{ color: 'var(--accent-orange)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
              Our Pillars
            </h4>
            <h2 style={{ fontSize: '36px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', margin: '0 0 20px 0', lineHeight: '1.2' }}>
              OUR CORE VALUES
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
              The fundamental principles that guide our national academy and ensure a premium experience for every participating child.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
            gap: '30px' 
          }}>
            {[
              { 
                title: 'Excellence', 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-blue)' }}>
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                ), 
                desc: 'We maintain professional standards in our venues, judges, and competition formatting to ensure the highest quality experience.' 
              },
              { 
                title: 'Inclusivity', 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-blue)' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                ), 
                desc: 'A platform open to all young talents across India, regardless of their background, focusing purely on merit and dedication.' 
              },
              { 
                title: 'Growth', 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-blue)' }}>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                ), 
                desc: 'Our primary goal is not just to rank, but to provide constructive feedback that fuels the continuous growth of the child.' 
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                style={{
                  backgroundColor: 'var(--white)',
                  padding: '40px',
                  borderRadius: '0',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderLeft: '4px solid transparent',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderLeftColor = 'var(--primary-blue)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.04)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '25px' }}>{value.icon}</div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', marginBottom: '15px', fontWeight: '700' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-light)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
