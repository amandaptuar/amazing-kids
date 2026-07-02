import React from 'react';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Programs from '../components/Programs';
import LatestNews from '../components/LatestNews';
import Games from '../components/ClubPlayers';
import Features from '../components/Features';

const Home = () => {
  return (
    <main>
      <Hero />
      <AboutUs />
      <Programs />
      <LatestNews />
      <Games />
      <Features />
    </main>
  );
};

export default Home;
