import React from 'react';
import { motion } from 'framer-motion';

const Standings = () => {
  const teams = [
    { pos: 1, club: 'Amazing Kids A', p: 10, w: 8, d: 1, l: 1, f: 24, a: 8, gd: 16, pts: 25 },
    { pos: 2, club: 'Titans FC', p: 10, w: 7, d: 2, l: 1, f: 20, a: 10, gd: 10, pts: 23 },
    { pos: 3, club: 'Spartans', p: 10, w: 6, d: 2, l: 2, f: 18, a: 12, gd: 6, pts: 20 },
    { pos: 4, club: 'United Youth', p: 10, w: 5, d: 3, l: 2, f: 15, a: 11, gd: 4, pts: 18 },
    { pos: 5, club: 'City Strikers', p: 10, w: 4, d: 2, l: 4, f: 12, a: 14, gd: -2, pts: 14 },
    { pos: 6, club: 'Amazing Kids B', p: 10, w: 3, d: 4, l: 3, f: 10, a: 10, gd: 0, pts: 13 },
  ];

  return (
    <section style={{ backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">STANDINGS & RANKINGS</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--primary-dark)', color: 'white', fontFamily: 'var(--font-heading)' }}>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>POS</th>
                  <th style={{ padding: '15px 20px', textAlign: 'left' }}>CLUB</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>P</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>W</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>D</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>L</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>F</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>A</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>GD</th>
                  <th style={{ padding: '15px 20px', textAlign: 'center' }}>PTS</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    style={{ 
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                      fontWeight: team.club.includes('Amazing Kids') ? '600' : '400'
                    }}
                    whileHover={{ backgroundColor: '#f0f7ff' }}
                  >
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.pos}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', backgroundColor: team.club.includes('Amazing Kids') ? 'var(--accent-orange)' : '#ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '10px' }}>
                        ★
                      </div>
                      {team.club}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.p}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.w}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.d}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.l}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-light)' }}>{team.f}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-light)' }}>{team.a}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>{team.gd}</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-dark)' }}>{team.pts}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Standings;
