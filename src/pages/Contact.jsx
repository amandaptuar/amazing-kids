import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Building } from 'lucide-react';

const Contact = () => {
  return (
    <main style={{ paddingTop: '80px', backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      
      {/* Page Heading */}
      <div style={{ textAlign: 'center', paddingTop: '60px', backgroundColor: 'var(--white)' }}>
        <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
          CONTACT <span style={{ color: 'var(--accent-orange)' }}>US</span>
        </h1>
      </div>

      {/* Main Content Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
            gap: '60px'
          }}>
            
            {/* Left Side: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 style={{ color: 'var(--accent-orange)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                OUR CONTACTS
              </h4>
              <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', margin: '0 0 20px 0', lineHeight: '1.2' }}>
                GET IN TOUCH WITH US
              </h2>
              <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-orange)', marginBottom: '30px' }}></div>
              <p style={{ color: 'var(--text-light)', fontSize: '16px', lineHeight: '1.7', marginBottom: '40px' }}>
                Get in touch to discuss your child's competition and academy needs today. Please give us a call, drop us an email or fill out the contact form and we'll get back to you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--primary-light)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <MapPin size={24} style={{ color: 'var(--primary-blue)' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Head Office</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px', lineHeight: '1.6' }}>
                      Flat no. 9, Patil Park, Nashik Bldg. No. 6<br/>Opp Vasant Market, Maharashtra<br/>Nashik 422101
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--primary-light)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Building size={24} style={{ color: 'var(--primary-blue)' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Center Office</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px', lineHeight: '1.6' }}>
                      Abbas Chamber, Camp Pune
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--primary-light)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Phone size={24} style={{ color: 'var(--primary-blue)' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Phone Number</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px', lineHeight: '1.6' }}>
                      +91 9527557335<br/>+91 9730757335
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ backgroundColor: 'var(--primary-light)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Mail size={24} style={{ color: 'var(--primary-blue)' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Email Us</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '15px', lineHeight: '1.6' }}>
                      amazingkidsofindia@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                backgroundColor: 'var(--bg-light)',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
              }}
            >
              <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', margin: '0 0 10px 0' }}>
                WE WOULD LOVE TO HEAR FROM YOU
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '30px' }}>
                Your email address will not be published. Required fields are marked *
              </p>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input type="text" placeholder="Name *" required style={{
                    width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', outline: 'none', transition: 'border 0.3s'
                  }} onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                </div>
                
                <div>
                  <input type="email" placeholder="Email address *" required style={{
                    width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', outline: 'none', transition: 'border 0.3s'
                  }} onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                </div>

                <div>
                  <input type="tel" placeholder="Your Phone" style={{
                    width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', outline: 'none', transition: 'border 0.3s'
                  }} onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
                </div>

                <div>
                  <textarea placeholder="Your Message" rows="5" style={{
                    width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px', outline: 'none', transition: 'border 0.3s', resize: 'vertical'
                  }} onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'} onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}></textarea>
                </div>

                <button type="submit" style={{
                  padding: '16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }} onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'} onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}>
                  SUBMIT
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section style={{ height: '400px', width: '100%', backgroundColor: '#eee' }}>
        <iframe 
          title="Nashik Office Location"
          src="https://maps.google.com/maps?q=Vasant%20Market,%20Nashik&t=&z=13&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </main>
  );
};

export default Contact;
