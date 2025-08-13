import React from 'react';
import HeroSlider from './components/HeroSlider';
import CompanyIntro from './components/CompanyIntro';
import FirmOverview from './components/FirmOverview';
import CertificationsSection from './components/CertificationsSection';
import ServicesSection from './components/ServicesSection';
import StatsSection from './components/StatsSection';
import NewsSection from './components/NewsSection';
import TestimonialsSection from './components/TestimonialsSection';
import PartnersSection from './components/PartnersSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <React.Fragment>
    <div className="home-page">
  <HeroSlider />
  <FirmOverview />
      <CompanyIntro />
      <CertificationsSection />
      <ServicesSection />
      <StatsSection />
      <NewsSection />
      <TestimonialsSection />
      <PartnersSection />
    </div>
    </React.Fragment>
  );
};

export default HomePage;