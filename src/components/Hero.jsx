import React from 'react';

const Hero = () => {
  return (
    <section style={{
      position: 'relative',
      height: '65vh',
      minHeight: '450px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/hero-banner.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      marginTop: '90px'
    }}>
      {/* Empty hero section to display the background image prominently */}
    </section>
  );
};

export default Hero;
