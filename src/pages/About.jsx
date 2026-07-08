import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css'; // Reuse the global Home styles

const About = () => {
  return (
    <div className="home-wrapper" style={{ marginTop: '0', paddingTop: '80px' }}>
      
      {/* Start Page Header */}
      <section 
        className="position-relative d-flex align-items-center justify-content-between" 
        style={{ 
          minHeight: '350px', 
          backgroundColor: '#18191D', 
          backgroundImage: 'linear-gradient(rgba(24, 25, 29, 0.65), rgba(24, 25, 29, 0.65)), url("/assets/about_hero_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <div className="container-custom position-relative" style={{ zIndex: 1, paddingTop: '50px' }}>
          <nav aria-label="breadcrumb">
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 10px 0', display: 'flex', gap: '10px', fontSize: '18px' }}>
              <li><Link to="/" style={{ color: '#E9A132', textDecoration: 'none' }}>Home</Link></li>
              <li style={{ color: 'white' }}>/</li>
              <li style={{ color: 'white' }}>About</li>
            </ol>
          </nav>
          <h1 style={{ fontSize: '48px', color: 'white', margin: 0, fontWeight: 700 }}>About Us</h1>
        </div>
      </section>
      {/* End Page Header */}
 
      {/* Start About Section */}
      <section className="section-padding position-relative bg-white">
        <div className="container-custom">
          <div className="about-grid">
            
            {/* Left Image + Experience Box */}
            <motion.div 
              className="experience-box"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/assets/about_experience_photo.png" 
                alt="Experience" 
                className="experience-img" 
              />
              <div className="experience-badge d-flex flex-column justify-content-center align-items-center">
                <h3 className="d-flex justify-content-center align-items-center">
                  <span>1st</span>
                </h3>
                <h2 style={{ fontSize: '18px', fontWeight: 'normal', margin: 0 }}>Time in India</h2>
              </div>
            </motion.div>
            
            {/* Right Content */}
            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="section-heading mb-4">
                <h3 className="text-accent" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '10px' }}>About - Amazing Kids of India</h3>
                <h2 style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.2, marginBottom: '20px' }}>
                  India's First <span className="text-accent">Ranking</span> Competition
                </h2>
                <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                  NASPE INDIA National Academy for Sports & Physical Education, India - Amazing Kids a unique platform for students aged 3 years to 10 years are recognized and awarded a ranking competition.
                </p>
                <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6, marginTop: '15px' }}>
                  Preparing Kids at grassroot level for future... We urge you to support and help us build a perfect athlete for our Nation – India.
                </p>
              </div>
 
              <div className="about-features" style={{ marginTop: '30px' }}>
                <div className="about-feature">
                  <i style={{ position: 'absolute', left: 0, top: '5px', color: '#E9A132' }}>✓</i>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 600 }}>Professional Standards</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>We maintain high quality in venues, judges, and formatting.</p>
                </div>
                <div className="about-feature">
                  <i style={{ position: 'absolute', left: 0, top: '5px', color: '#E9A132' }}>✓</i>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 600 }}>Inclusive Platform</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Open to all young talents across India, based purely on merit.</p>
                </div>
              </div>
 
              <div className="about-action-btns">
                <Link to="/contact" className="btn-accent">Get A Quote</Link>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="video-link">
                  <span className="video-icon">
                    <Play size={20} fill="currentColor" />
                  </span>
                  Watch the video
                </a>
              </div>
            </motion.div>
 
          </div>
        </div>
      </section>
      {/* End About Section */}
   
      {/* Start Service/Programs Section */}
      <section className="section-padding bg-gray">
        <div className="container-custom">
          
          <div className="section-heading text-center" style={{ marginBottom: '50px' }}>
            <h3 className="text-accent" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '10px' }}>Our Programs</h3>
            <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#18191D', lineHeight: 1.2 }}>Unleashing Young Champions</h2>
          </div>

          <div className="services-grid">
            
            {/* Service Card 1 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/kid_athlete.png" alt="Athlete" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/athlete">Athlete Ranking</Link></h3>
                <p className="prof-card-desc">Comprehensive physical fitness and athletic skill evaluation for young talents.</p>
                <Link to="/program/athlete" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>
 
            {/* Service Card 2 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/kid_skater.png" alt="Skating" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/skater">Skating Championship</Link></h3>
                <p className="prof-card-desc">Speed, balance, and agility testing through competitive skating events.</p>
                <Link to="/program/skater" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>
 
            {/* Service Card 3 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/assets/hero_cycling.png" alt="Cycling" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/cyclist">Cyclist Events</Link></h3>
                <p className="prof-card-desc">Endurance and stamina ranking programs specially designed for kids.</p>
                <Link to="/program/cyclist" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>
 
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 500, margin: 0, color: '#18191D' }}>
              <span className="text-accent">Amazing Kids</span> programs built specifically for your child's growth
            </h4>
            <Link to="/program/athlete" className="btn-accent" style={{ padding: '12px 30px' }}>Find More Programs</Link>
          </div>
        </div>
      </section>
      {/* End Service Section */}

      {/* Start Milestones & Stats Section */}
      <section className="section-padding bg-dark-section" style={{ color: 'white', position: 'relative' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'center' }}>
            
            {/* Stat Item 1 */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#E9A132', marginBottom: '10px' }}>15,000+</h2>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>Children Evaluated</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Empowering grassroot talent with structured skill assessments.</p>
            </div>

            {/* Stat Item 2 */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#E9A132', marginBottom: '10px' }}>200+</h2>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>School Collaborations</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Partnering with leading schools to integrate physical literacy.</p>
            </div>

            {/* Stat Item 3 */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#E9A132', marginBottom: '10px' }}>28+</h2>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>States Covered</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Establishing national presence across all corners of India.</p>
            </div>

            {/* Stat Item 4 */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#E9A132', marginBottom: '10px' }}>1st</h2>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>Systematic Ranking</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Leading India's first standardized kid sports ranking matrix.</p>
            </div>

          </div>
        </div>
      </section>
      {/* End Milestones & Stats Section */}

      {/* Start Our Evaluation Process Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          
          <div className="section-heading text-center" style={{ marginBottom: '60px' }}>
            <h3 className="text-accent" style={{ fontSize: '18px', fontWeight: 500, marginBottom: '10px' }}>Our Method</h3>
            <h2 style={{ fontSize: '42px', fontWeight: 700, color: '#18191D', lineHeight: 1.2 }}>How We Evaluate & Rank Talents</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            
            {/* Step 1 */}
            <div style={{ padding: '30px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '14px', fontWeight: 700, color: '#E9A132' }}>STEP 01</div>
              <div style={{ width: '50px', height: '50px', background: 'rgba(233,161,50,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E9A132" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#18191D', marginBottom: '10px' }}>Skill Registration</h3>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, margin: 0 }}>Register online under specific competitive divisions (Under-10, 14, 18, or Open Categories).</p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '30px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '14px', fontWeight: 700, color: '#E9A132' }}>STEP 02</div>
              <div style={{ width: '50px', height: '50px', background: 'rgba(233,161,50,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E9A132" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#18191D', marginBottom: '10px' }}>Performance Trials</h3>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, margin: 0 }}>Unbiased, strict on-field trials conducted by NASPE Certified physical education evaluators.</p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '30px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '14px', fontWeight: 700, color: '#E9A132' }}>STEP 03</div>
              <div style={{ width: '50px', height: '50px', background: 'rgba(233,161,50,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E9A132" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#18191D', marginBottom: '10px' }}>Metric Scoring</h3>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, margin: 0 }}>Skill points computed objectively based on precise speed, balance, agility, and stamina parameters.</p>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '30px', background: '#F8F9FA', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '14px', fontWeight: 700, color: '#E9A132' }}>STEP 04</div>
              <div style={{ width: '50px', height: '50px', background: 'rgba(233,161,50,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E9A132" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#18191D', marginBottom: '10px' }}>National Ranking</h3>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, margin: 0 }}>Student achievements uploaded online onto the live national ranking leaderboard system.</p>
            </div>

          </div>
        </div>
      </section>
      {/* End Our Evaluation Process Section */}

      {/* Start Testimonial Section */}
      <section
        style={{
          position: 'relative',
          padding: '100px 0',
          backgroundImage: 'url("/assets/testimonials-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          overflow: 'hidden',
        }}
      >
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(18,19,22,0.93) 0%, rgba(18,19,22,0.75) 60%, rgba(18,19,22,0.90) 100%)',
          zIndex: 1,
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>

          {/* Section Header */}
          <div className="text-center" style={{ maxWidth: '700px', margin: '0 auto 60px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#E9A132', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
              ★ &nbsp;Testimonials&nbsp; ★
            </h3>
            <h2 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px', color: 'white' }}>
              What They're <span style={{ color: '#E9A132' }}>Saying?</span>
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
              Hear from the parents, coaches, and schools who have witnessed the transformative power of Amazing Kids ranking competitions.
            </p>
          </div>

          {/* Cards Row — horizontally scrollable */}
          <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
            <div style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(310px, 1fr)',
              gap: '28px',
            }}>
              {[
                {
                  name: 'Rahul Sharma',
                  role: 'Parent, New Delhi',
                  img: '/assets/rahul.png',
                  text: '"The Amazing Kids competition has given my son a fantastic national-level platform. The professional ranking system from NASPE India truly helps athletes understand their potential!"'
                },
                {
                  name: 'Priya Patel',
                  role: 'School Principal, Mumbai',
                  img: '/assets/priya.png',
                  text: '"As an educator, I highly appreciate the unbiased and structured sports events organized by Amazing Kids. It is exactly the kind of exposure students in India need today."'
                },
                {
                  name: 'Vikram Singh',
                  role: 'Sports Coach, Bangalore',
                  img: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=E9A132&color=fff',
                  text: '"This is hands down the best organized athletic ranking event we have participated in. The transparent scoring system gives our trainees a clear path to improvement."'
                },
                {
                  name: 'Anjali Desai',
                  role: 'Mother, Chennai',
                  img: 'https://ui-avatars.com/api/?name=Anjali+Desai&background=1E88E5&color=fff',
                  text: '"My daughter gained immense confidence after participating in the skating championship. The environment is supportive, safe, and highly professional!"'
                }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '20px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}>
                  {/* Quote mark */}
                  <div style={{ fontSize: '64px', lineHeight: 1, color: '#E9A132', opacity: 0.6, fontFamily: 'Georgia, serif', marginBottom: '10px', marginTop: '-10px' }}>"</div>

                  {/* Review text */}
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, margin: '0 0 28px 0', fontStyle: 'italic', flexGrow: 1 }}>
                    {item.text}
                  </p>

                  {/* Stars */}
                  <div style={{ color: '#E9A132', fontSize: '16px', letterSpacing: '3px', marginBottom: '20px' }}>★★★★★</div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E9A132' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'white', margin: '0 0 3px 0' }}>{item.name}</h3>
                      <p style={{ fontSize: '13px', color: '#E9A132', fontWeight: 500, margin: 0 }}>{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
      {/* End Testimonial Section */}

    </div>
  );
};

export default About;
