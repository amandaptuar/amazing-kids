import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Star } from 'lucide-react';
import './Home.css';

const heroSlides = [
  {
    image: '/assets/hero_athletics.png',
    subtitle: 'INDIA\'S FIRST RANKING COMPETITION',
    title: <>Inventive and interested<br />in innovation</>,
    desc: <>NASPE INDIA National Academy for Sports & Physical Education.<br/>Preparing Kids at grassroot level for future.</>
  },
  {
    image: '/assets/hero_skating.png',
    subtitle: 'EMPOWERING FUTURE LEADERS',
    title: <>Discover Your Child's<br />True Potential</>,
    desc: <>A unique platform for students aged 3 years to 10 years.<br/>Recognized and awarded a ranking competition.</>
  },
  {
    image: '/assets/hero_cycling.png',
    subtitle: 'SUPPORT OUR NATION - INDIA',
    title: <>Excellence in<br />Early Education</>,
    desc: <>We urge you to support and help us build a perfect athlete<br/>for our Nation – India.</>
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home-wrapper">
      {/* Start Hero Carousel */}
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="hero-overlay"></div>
            <div className="container-custom position-relative" style={{ zIndex: 2 }}>
              <div className="hero-content">
                <h2>{slide.subtitle}</h2>
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                <div className="d-flex justify-content-center">
                  <Link to="/contact" className="btn-accent">Get A Quote</Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      {/* End Hero Carousel */}

      {/* Animated Text */}
      <div className="moving-text-wrap">
        <div className="moving-text">
          <span>* India's First Ranking Competition</span>
          <span>* Amazing Kids of India</span>
          <span>* NASPE INDIA</span>
          <span>* National Academy for Sports & Physical Education</span>
          <span>* India's First Ranking Competition</span>
          <span>* Amazing Kids of India</span>
        </div>
        <div className="moving-text">
          <span>* India's First Ranking Competition</span>
          <span>* Amazing Kids of India</span>
          <span>* NASPE INDIA</span>
          <span>* National Academy for Sports & Physical Education</span>
          <span>* India's First Ranking Competition</span>
          <span>* Amazing Kids of India</span>
        </div>
      </div>
      {/* End Animated Text */}

      {/* Start Service Section (Programs) */}
      <section className="section-padding bg-gray">
        <div className="container-custom">
          <div className="section-heading d-flex justify-content-between align-items-end flex-wrap gap-4">
            <div>
              <h3 className="text-accent">Our Programs List</h3>
              <h2>We Provide The Solution<br />For Our Kids</h2>
            </div>
          </div>
          
          <div className="services-grid">
            {/* Service 1 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/kid_athlete.png" alt="Athlete" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/athlete">Youngest Fastest Athlete</Link></h3>
                <ul className="prof-card-features">
                  <li><span className="feat-label">Track Event:</span> Age 3-4 (30m), 5-6 (50m), 7-10 (80m), 11-12 (80/100m)</li>
                  <li><span className="feat-label">Height Jump:</span> Height + Distance calculated</li>
                  <li><span className="feat-label">Venue:</span> Grass / Mud / Synthetic</li>
                  <li><span className="feat-label">Regulations:</span> Shoes Compulsory, comfortable shorts, Athlete wear</li>
                </ul>
                <Link to="/program/athlete" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/kid_skater.png" alt="Skater" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/skater">Youngest Fastest Skater</Link></h3>
                <ul className="prof-card-features">
                  <li><span className="feat-label">Speed-Track:</span> Age 3-8 (3 laps), Age 9-12 (5 laps)</li>
                  <li><span className="feat-label">Venue:</span> Track Speed B Court</li>
                  <li><span className="feat-label">Format:</span> Beginner / Quad / Inline</li>
                  <li><span className="feat-label">Equipment:</span> Helmets compulsory & protective gear</li>
                </ul>
                <Link to="/program/skater" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/assets/hero_cycling.png" alt="Cyclist" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/cyclist">Youngest Fastest Cyclist</Link></h3>
                <ul className="prof-card-features">
                  <li><span className="feat-label">Time Trial:</span> Age 3-6 (250m), Age 7-12 (500m)</li>
                  <li><span className="feat-label">Venue:</span> Cycling Track, Lap & Road Circuit Race</li>
                  <li><span className="feat-label">Regulations:</span> Competitors may enter 1 or 2 events</li>
                  <li><span className="feat-label">Equipment:</span> Safe bicycle and helmet compulsory</li>
                </ul>
                <Link to="/program/cyclist" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>

            {/* Service 4 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/assets/kids_singing.png" alt="Musician" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/musician">Youngest Musician</Link></h3>
                <p className="prof-card-desc">A musician is an individual who creates, performs, or composes music. Music is a universal form of art and expression, and musicians play a pivotal role in bringing it to life.</p>
                <Link to="/program/musician" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>

            {/* Service 5 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/assets/kids_drawing.png" alt="Artist" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/artist">Youngest Artist</Link></h3>
                <p className="prof-card-desc">Drawing is a creative and expressive art form that involves creating images, designs, or illustrations on a surface using various drawing tools and techniques.</p>
                <Link to="/program/artist" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>

            {/* Service 6 */}
            <div className="professional-card">
              <div className="prof-card-img-wrap">
                <div className="prof-img-clipper">
                  <img src="/assets/kids_dancing.png" alt="Dancer" className="prof-card-img" />
                </div>
                <div className="prof-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
              </div>
              <div className="prof-card-content">
                <h3 className="prof-card-title"><Link to="/program/dancer">Youngest Dancer</Link></h3>
                <p className="prof-card-desc">Dancing is a highly expressive and physical art form that involves rhythmic and coordinated body movements, often accompanied by music.</p>
                <Link to="/program/dancer" className="prof-card-btn mt-auto">Explore Program <span>→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Service Section */}

      {/* Animated Programs Text */}
      <div className="moving-text-wrap" style={{ backgroundColor: '#E9A132', padding: '15px 0' }}>
        <div className="moving-text">
          <span style={{ color: 'white' }}>* Youngest Fastest Athlete</span>
          <span style={{ color: 'white' }}>* Youngest Fastest Skater</span>
          <span style={{ color: 'white' }}>* Youngest Fastest Cyclist</span>
          <span style={{ color: 'white' }}>* Youngest Musician</span>
          <span style={{ color: 'white' }}>* Youngest Artist</span>
          <span style={{ color: 'white' }}>* Youngest Dancer</span>
        </div>
        <div className="moving-text">
          <span style={{ color: 'white' }}>* Youngest Fastest Athlete</span>
          <span style={{ color: 'white' }}>* Youngest Fastest Skater</span>
          <span style={{ color: 'white' }}>* Youngest Fastest Cyclist</span>
          <span style={{ color: 'white' }}>* Youngest Musician</span>
          <span style={{ color: 'white' }}>* Youngest Artist</span>
          <span style={{ color: 'white' }}>* Youngest Dancer</span>
        </div>
      </div>
      {/* End Animated Programs Text */}

      {/* Start About Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="about-grid">
            <div className="experience-box">
              <img src="/naspe.png" alt="Experience" className="experience-img" />
              <div className="experience-badge">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <h3>1st</h3>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Time in India</p>
              </div>
            </div>
            
            <div className="about-content">
              <div className="section-heading" style={{ marginBottom: '30px' }}>
                <h3 className="text-accent">About - Amazing kids of India</h3>
                <h2>India's First Ranking Competition</h2>
                <p style={{ color: '#666', marginTop: '20px', lineHeight: '1.8' }}>
                  NASPE INDIA National Academy for Sports & Physical Education, India - Amazing Kids a unique platform for students aged 3 years to 10 years are recognized and awarded a ranking competition (First time in India). 
                </p>
                <p style={{ color: '#666', marginTop: '15px', lineHeight: '1.8' }}>
                  Preparing Kids at grassroot level for future... We urge you to support and help us build a perfect athlete for our Nation – India.
                </p>
              </div>

              <div className="about-action-btns">
                <Link to="/about" className="btn-accent">Read More</Link>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="video-link">
                  <span className="video-icon">
                    <Play size={20} fill="currentColor" />
                  </span>
                  Watch the video
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End About Section */}

      {/* Start Photo Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-heading d-flex justify-content-between align-items-end flex-wrap gap-4">
            <div>
              <h3 className="text-accent">Our Photo Gallery</h3>
              <h2>Take a look at our<br />Completed Events</h2>
            </div>
          </div>
          
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/gallery/gallery-1.png" alt="Event 1" />
              <div className="gallery-overlay">
                <h3 style={{ margin: 0, fontSize: '28px' }}>Event Highlights</h3>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gallery/gallery-2.png" alt="Event 2" />
              <div className="gallery-overlay">
                <h3 style={{ margin: 0, fontSize: '24px' }}>Event Highlights</h3>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gallery/gallery-3.png" alt="Event 3" />
              <div className="gallery-overlay">
                <h3 style={{ margin: 0, fontSize: '20px' }}>Event Highlights</h3>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/gallery/gallery-4.png" alt="Event 4" />
              <div className="gallery-overlay">
                <h3 style={{ margin: 0, fontSize: '20px' }}>Event Highlights</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Photo Gallery */}

      {/* Start Results Section */}
      <section className="section-padding bg-gray">
        <div className="container-custom">
          <div className="section-heading text-center mb-5">
            <h3 className="text-accent">Champions Wall</h3>
            <h2>Recent Rankings & Results</h2>
          </div>
          
          <div className="results-showcase">
            {/* 2026 Featured Section */}
            <div className="result-showcase-item featured-2026" style={{
              backgroundImage: 'linear-gradient(to right, rgba(24,25,29,0.92) 0%, rgba(24,25,29,0.6) 60%, rgba(24,25,29,0.1) 100%), url("/assets/rankings-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="result-overlay-content">
                <div className="badge-new">Latest Update</div>
                <h2>2026 National Rankings</h2>
                <p>The newest generation of amazing kids are setting records. Discover the latest ranking results and current national leaders.</p>
                <Link to="/leaderboard" className="btn-accent mt-4">View 2026 Rankings</Link>
              </div>
              <div className="featured-2026-img-side">
                <img src="/assets/rankings-bg.png" alt="Rankings" style={{ display: 'none' }} />
              </div>
            </div>

            <div className="results-split-grid">
              {/* 2024 Arnold Results */}
              <div className="arnold-results-card">
                <div className="arnold-header">
                  <h3>2024 Arnold Results</h3>
                  <p>Outstanding performances from the 2024 games.</p>
                </div>
                <ul className="arnold-list">
                  <li>
                    <div className="arnold-icon"><Star size={20} fill="currentColor" /></div>
                    <div className="arnold-text">YOUNGEST FASTEST ATHLETE</div>
                  </li>
                  <li>
                    <div className="arnold-icon"><Star size={20} fill="currentColor" /></div>
                    <div className="arnold-text">YOUNGEST FASTEST CYCLIST</div>
                  </li>
                  <li>
                    <div className="arnold-icon"><Star size={20} fill="currentColor" /></div>
                    <div className="arnold-text">
                      YOUNGEST FASTEST SKATER
                      <span>Skipping Timing</span>
                    </div>
                  </li>
                  <li>
                    <div className="arnold-icon"><Star size={20} fill="currentColor" /></div>
                    <div className="arnold-text">
                      YOUNGEST LONGEST RING THROW
                      <span>Distance</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 2023 Rankings Mini Gallery */}
              <div className="rankings-2023-card">
                <div className="arnold-header">
                  <h3>2023 Ranking Archives</h3>
                  <p>Historical data from the 2023 competitions.</p>
                </div>
                <div className="mini-gallery-grid">
                  <div className="mini-gallery-item">
                    <img src="/assets/hero_athletics.png" alt="Athletic" />
                    <div className="mini-gallery-overlay"><span>Athletic</span></div>
                  </div>
                  <div className="mini-gallery-item">
                    <img src="/assets/hero_cycling.png" alt="Cyclist" />
                    <div className="mini-gallery-overlay"><span>Cyclist</span></div>
                  </div>
                  <div className="mini-gallery-item">
                    <img src="/assets/hero_skating.png" alt="Skater" />
                    <div className="mini-gallery-overlay"><span>Skater</span></div>
                  </div>
                  <div className="mini-gallery-item">
                    <img src="/assets/kids_drawing.png" alt="Others" />
                    <div className="mini-gallery-overlay"><span>Artist, Dancer...</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Results Section */}

      {/* Start Blog Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-heading text-center">
            <h3 className="text-accent">Find The Blogs</h3>
            <h2>LATEST NEWS</h2>
          </div>
          
          <div className="blog-grid">
            {[
              {
                title: "Khelo India Youth Games: Nurturing Grassroot Level Physical Fitness & Sports for Kids",
                subtitle: "Promoting early athletics development across schools and sports academies in India.",
                url: "https://kheloindia.gov.in/",
                img: "/assets/hero_athletics.png"
              },
              {
                title: "National Roller Skating Championships: Local Contests Shaping Future Speed Skating Stars",
                subtitle: "How community events and clubs are driving roller skating's growth for young athletes.",
                url: "https://indiaskate.com/",
                img: "/assets/hero_skating.png"
              },
              {
                title: "Cycling Federation of India Launches Youth Talent Hunt & Junior Cycling Academies",
                subtitle: "Establishing specialized physical academies and competitive paths for under-14 cyclist riders.",
                url: "https://cyclingfederationofindia.org/",
                img: "/assets/hero_cycling.png"
              }
            ].map((news, index) => (
              <div className="blog-card" key={index}>
                <div className="blog-thumb">
                  <img src={news.img} alt={news.title} />
                </div>
                <div className="blog-info">
                  <div className="blog-meta">
                    <span>By Admin</span>
                    <span>No Comments</span>
                  </div>
                  <h3 className="blog-title">
                    <a href={news.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {news.title}
                    </a>
                  </h3>
                  <p className="blog-subtitle">{news.subtitle}</p>
                </div>
                <a href={news.url} target="_blank" rel="noreferrer" className="blog-btn">
                  <span>Read More</span>
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End Blog Section */}

      {/* Start Contact Section */}
      <section
        className="contact-section-bg"
        style={{
          backgroundImage: 'linear-gradient(rgba(18,19,22,0.82), rgba(18,19,22,0.88)), url("/assets/contact-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '100px 0',
        }}
      >
        <div className="container-custom">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#E9A132', fontWeight: 600, fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Get in touch</p>
            <h2 style={{ color: 'white', fontSize: '42px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>All Over India We Take Competition</h2>
            <div style={{ width: '60px', height: '4px', background: '#E9A132', borderRadius: '2px', margin: '20px auto 0' }}></div>
          </div>

          <div className="contact-grid">
            {/* Left: Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Phone */}
              <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px 30px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s ease' }}>
                <div className="contact-icon" style={{ flexShrink: 0 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <p style={{ color: '#E9A132', margin: '0 0 6px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Have Any Question?</p>
                  <p style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 700, lineHeight: 1.4 }}>+91 9527557335<br/>+91 9730757335</p>
                </div>
              </div>
              {/* Email */}
              <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="contact-icon" style={{ flexShrink: 0 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <p style={{ color: '#E9A132', margin: '0 0 6px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Send Email</p>
                  <p style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 700 }}>amazingkidsofindia@gmail.com</p>
                </div>
              </div>
              {/* Address */}
              <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '28px 30px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div className="contact-icon" style={{ flexShrink: 0, marginTop: '4px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <p style={{ color: '#E9A132', margin: '0 0 6px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Address</p>
                  <p style={{ color: 'white', margin: 0, fontSize: '17px', fontWeight: 600, lineHeight: 1.6 }}>Flat no. 9, Patil Park, Bldg no. 6,<br/>Nashik, Opp. Vasant Market,<br/>Maharashtra — 422101</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-wrap" style={{ background: 'white', borderRadius: '20px', padding: '50px', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h2 style={{ color: '#18191D', fontSize: '28px', fontWeight: 800, margin: '0 0 8px' }}>Contact Us</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '15px' }}>We'd love to hear from you</p>
              </div>
              <form>
                <input type="text" className="contact-form-input" placeholder="Your Name" />
                <input type="email" className="contact-form-input" placeholder="Your Email" />
                <textarea className="contact-form-textarea" placeholder="Message here ..." rows="5"></textarea>
                <button type="submit" className="btn-accent" style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 700 }}>Submit Now →</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* End Contact Section */}

    </main>
  );
};

export default Home;
