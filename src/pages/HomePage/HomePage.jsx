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
import BlogsSection from './components/BlogsSection';
import './HomePage.css';
import photo48 from '../../assets/gallery/photo-48.jpg';
import photo105 from '../../assets/gallery/photo-105.jpg';
import photo37 from '../../assets/gallery/photo-37.jpg';
import photo74 from '../../assets/gallery/photo-74.jpg';
import CoreValues from './components/CoreValues';

const HomePage = () => {
  return (
    <React.Fragment>
    <div className="home-page">
  <HeroSlider />
  <FirmOverview />
      <CompanyIntro />
      <CoreValues/>
      <CertificationsSection />

      {/* New Section: Two Columns with Images and Text */}
      <section className="home-section new-two-column-section" >
        <div className="home-container">
          <div className="new-two-column-content">
            <div className="image-gallery">
              <img src={photo48} alt="Image 1" className="gallery-image" />
              <img src={photo105} alt="Image 2" className="gallery-image" />
              <img src={photo37} alt="Image 3" className="gallery-image" />
              <img src={photo74} alt="Image 4" className="gallery-image" />
            </div>
            <div className="text-content">
              <h2 className="section-title" style={{ color: 'white' }}>Our Commitment to Excellence</h2>
              <p className="section-subtitle" style={{ color: '#f1f5f9' }}>
                DGMTS is dedicated to providing top-tier geotechnical and material testing services. Our commitment extends to every project, ensuring precision, reliability, and client satisfaction. We leverage cutting-edge technology and a team of experienced professionals to deliver solutions that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      <StatsSection />
      <BlogsSection />
      {/* <NewsSection /> */}
      <TestimonialsSection />
      <PartnersSection />

     

    </div>
    </React.Fragment>
  );
};

export default HomePage;