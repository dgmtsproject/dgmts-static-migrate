
import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Screenshots from './components/Screenshots';
import Pricing from './components/Pricing';
import CTA from './components/CTA';

const PileDrivingPage = () => {
  return (
    <div className="pile-driving-page">
      <Hero />
      <Features />
      <Screenshots />
      <Pricing />
      <CTA />
    </div>
  );
};

export default PileDrivingPage;
