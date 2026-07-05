import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Games = () => {
  const games = [
    {
      id: 1,
      title: 'Athletic',
      info: 'Track events, sprints, and physical challenges designed to test agility, speed, and endurance.',
      image: '/kid_athlete.png'
    },
    {
      id: 2,
      title: 'Cyclist',
      info: 'High-speed track racing and road circuit challenges for passionate young cyclists.',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Dancer',
      info: 'A stage to showcase rhythm, grace, and creative storytelling through various beautiful dance forms.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Artist',
      info: 'Express boundless creativity and imagination through drawing, painting, and visual arts.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      title: 'Skater',
      info: 'Thrilling speed skating competitions featuring both quad and inline roller skating categories.',
      image: '/kid_skater.png'
    },
    {
      id: 6,
      title: 'Musician',
      info: 'Perform, compose, and create beautiful melodies in our dedicated musical talent competitions.',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
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
    <section style={{ backgroundColor: 'var(--white)', padding: '100px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 className="section-title">OUR GAMES</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            Explore the diverse range of competitive and creative events we host for talented kids.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '30px'
          }}
        >
          {games.map(game => (
            <motion.div 
              key={game.id} 
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
              style={{
                backgroundColor: 'var(--bg-light)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={game.image} 
                  alt={game.title} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                }} />
                <h3 style={{ 
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  fontSize: '24px', 
                  margin: 0, 
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '700'
                }}>
                  <div style={{ 
                    backgroundColor: 'var(--primary-blue)', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}>
                    <Play size={16} color="white" fill="white" />
                  </div>
                  {game.title}
                </h3>
              </div>
              
              <div style={{ padding: '25px', backgroundColor: 'var(--white)' }}>
                <p style={{ fontSize: '15px', color: 'var(--text-light)', lineHeight: '1.7', margin: 0 }}>
                  {game.info}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Games;
