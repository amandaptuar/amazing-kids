import React from 'react';
import { motion } from 'framer-motion';

const LatestNews = () => {
  const newsItems = [
    {
      id: 1,
      title: 'How Our Youth Team Grew This Season',
      category: 'Club News',
      date: '15 Sep 2026',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'A look back at the incredible journey and development of our youth squad over the past few months.'
    },
    {
      id: 2,
      title: 'New Training Facilities Opened',
      category: 'Facilities',
      date: '12 Sep 2026',
      image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'We are thrilled to unveil our state-of-the-art training grounds designed to help our athletes excel.'
    },
    {
      id: 3,
      title: 'Player Spotlight: The Rising Stars',
      category: 'Players',
      date: '10 Sep 2026',
      image: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'Meet the emerging talents who have been making waves and setting new records in recent tournaments.'
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
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <h2 className="section-title">LATEST NEWS & UPDATES</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            Stay updated with the latest happenings, achievements, and announcements from the Amazing Kids club.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '40px' 
        }}>
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -12 }}
              style={{ 
                backgroundColor: 'var(--white)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Image Container */}
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={news.image} 
                  alt={news.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '20px', 
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--text-dark)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {news.category}
                </div>
              </div>

              {/* Content Container */}
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span> {news.date}
                </div>
                
                <h3 style={{ 
                  fontSize: '22px', 
                  margin: '0 0 15px', 
                  fontFamily: 'var(--font-heading)', 
                  color: 'var(--text-dark)',
                  lineHeight: '1.4'
                }}>
                  {news.title}
                </h3>
                
                <p style={{ 
                  fontSize: '15px', 
                  color: 'var(--text-light)', 
                  marginBottom: '25px',
                  lineHeight: '1.7',
                  flex: 1
                }}>
                  {news.description}
                </p>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-dark)', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: 0
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    READ FULL STORY <span style={{ fontSize: '18px' }}>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
