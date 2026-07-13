import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(to right, #f8fafc, #e3f2fd)', 
      color: 'var(--text-dark)', 
      padding: '80px 0 20px', 
      borderTop: '4px solid var(--primary-blue)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '50px',
          marginBottom: '60px'
        }}>
          
          {/* Column 1: Brand & Socials */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <img src="/logo.png" alt="Amazing Kids Logo" style={{ height: '60px', objectFit: 'contain' }} />
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '25px', lineHeight: '1.7' }}>
              India's First Ranking Competition platform for students aged 3 to 12 years. Preparing kids at the grassroot level for a brighter future.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {[
                { name: 'Facebook', href: 'https://facebook.com', svg: <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.05 10.13 23.95V15.54H7.08V12.07H10.13V9.39C10.13 6.36 11.92 4.7 14.66 4.7C15.97 4.7 17.34 4.93 17.34 4.93V7.89H15.83C14.34 7.89 13.88 8.82 13.88 9.76V12.07H17.2L16.67 15.54H13.88V23.95C19.61 23.05 24 18.1 24 12.07Z"/></svg> },
                { name: 'Twitter', href: 'https://twitter.com', svg: <svg width="18" height="18" fill="#000000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { name: 'YouTube', href: 'https://youtube.com', svg: <svg width="18" height="18" fill="#FF0000" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { name: 'Instagram', href: 'https://instagram.com', svg: <svg width="18" height="18" fill="#E4405F" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { name: 'WhatsApp', href: 'https://wa.me/919933791710', svg: <svg width="18" height="18" fill="#25D366" viewBox="0 0 24 24"><path d="M17.47 13.5v-.01c-.13-.02-1.22-.6-1.41-.67-.2-.07-.34-.1-.48.11-.14.22-.53.67-.66.81-.12.13-.25.15-.45.05-.2-.1-1-.37-1.88-1.15-.69-.61-1.16-1.37-1.3-1.6-.13-.21-.01-.33.09-.43.09-.09.2-.21.3-.32.1-.11.14-.19.2-.31.07-.13.04-.24-.01-.34-.06-.1-.49-1.17-.67-1.6-.18-.42-.35-.36-.48-.37h-.42c-.14 0-.37.05-.56.26-.2.21-.74.72-.74 1.76s.76 2.05.87 2.19c.1.14 1.5 2.27 3.63 3.19.5.22.9.35 1.2.45.5.16.96.14 1.32.08.41-.06 1.22-.5 1.39-.98.17-.48.17-.89.12-.98-.05-.09-.19-.14-.39-.24z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.26 4.88L2 22l5.24-1.23C8.65 21.56 10.28 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.23c-1.5 0-2.96-.38-4.26-1.11l-.3-.18-3.16.74.84-3.04-.2-.33A8.23 8.23 0 013.77 12c0-4.54 3.7-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.69 8.23-8.23 8.23z"/></svg> }
              ].map((platform, idx) => (
                <a key={idx} href={platform.href} target="_blank" rel="noreferrer" aria-label={platform.name} style={{ 
                  backgroundColor: 'white',
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {platform.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--primary-dark)', fontSize: '20px', marginBottom: '25px', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-light)', fontSize: '15px' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Programs', path: '/program/athlete' },
                { name: 'Event List', path: '/events' },
                { name: 'Become an Affiliate', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    style={{ transition: 'all 0.3s ease', textDecoration: 'none', color: 'inherit', display: 'inline-block' }} 
                    onMouseOver={(e) => { e.target.style.color = 'var(--primary-blue)'; e.target.style.transform = 'translateX(5px)'; }} 
                    onMouseOut={(e) => { e.target.style.color = 'var(--text-light)'; e.target.style.transform = 'translateX(0)'; }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 style={{ color: 'var(--primary-dark)', fontSize: '20px', marginBottom: '25px', fontFamily: 'var(--font-heading)' }}>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-light)', fontSize: '15px' }}>
              {[
                { label: 'Athletic', slug: 'athlete' },
                { label: 'Cycling', slug: 'cyclist' },
                { label: 'Skating', slug: 'skater' },
                { label: 'Dancer', slug: 'dancer' },
                { label: 'Artist', slug: 'artist' },
                { label: 'Musician', slug: 'musician' }
              ].map(cat => (
                <li key={cat.slug}>
                  <Link to={`/program/${cat.slug}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none', transition: 'all 0.3s ease' }}
                     onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary-blue)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                     onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <span style={{ color: 'var(--primary-blue)', fontSize: '12px' }}>▶</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 style={{ color: 'var(--primary-dark)', fontSize: '20px', marginBottom: '25px', fontFamily: 'var(--font-heading)' }}>Become an Affiliate</h4>
            <div style={{ color: 'var(--text-light)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Address:</strong><br />
                  Flat no. 9 , Patil Park, Bldg no. 6,<br />
                  Opp Vasant Market, Nashik,<br />
                  Maharashtra 422101
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Phone:</strong><br />
                  +91 9527557335<br />
                  +91 9730757335
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Email:</strong><br />
                  amazingkidsofindia@gmail.com
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(0,0,0,0.08)', 
          paddingTop: '25px', 
          textAlign: 'center', 
          color: 'var(--text-light)', 
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span>&copy; {new Date().getFullYear()} <strong>Amazing Kids of India</strong>. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
