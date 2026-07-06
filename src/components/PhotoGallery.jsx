import React from 'react';
import { motion } from 'framer-motion';

const PhotoGallery = () => {
  const images = [
    '/gallery/gallery-1.png',
    '/gallery/gallery-2.png',
    '/gallery/gallery-3.png',
    '/gallery/gallery-4.png',
    '/gallery/gallery-5.png'
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h4 style={{ color: 'var(--accent-orange)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Gallery</h4>
          <h2 style={{ fontSize: '36px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', margin: '0 0 20px 0' }}>MEMORIES & MOMENTS</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>
            A glimpse into the amazing talent and unforgettable moments from our previous competitions and events.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {images.map((src, index) => {
            return (
              <motion.div
                key={index}
                className="gallery-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
              >
                <div className="gallery-image-wrapper">
                  <img src={src} alt={`Amazing Kids Gallery ${index + 1}`} />
                  <div className="gallery-overlay">
                    <div>Amazing Moment</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      <style>{`
        .gallery-grid {
          column-count: 3;
          column-gap: 20px;
        }
        .gallery-item {
          break-inside: avoid;
          margin-bottom: 20px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          background-color: #fff;
          position: relative;
        }
        .gallery-image-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .gallery-image-wrapper img {
          width: 100%;
          display: block;
          transition: transform 0.5s ease;
        }
        .gallery-image-wrapper:hover img {
          transform: scale(1.1);
        }
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px 20px 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          font-weight: bold;
          font-size: 18px;
        }
        .gallery-image-wrapper:hover .gallery-overlay {
          opacity: 1;
        }

        @media (max-width: 992px) {
          .gallery-grid {
            column-count: 2;
          }
        }
        @media (max-width: 576px) {
          .gallery-grid {
            column-count: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default PhotoGallery;
