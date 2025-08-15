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

      {/* New Section: Two Columns with Images and Text */}
      <section className="home-section new-two-column-section">
        <div className="home-container">
          <div className="new-two-column-content">
            <div className="image-gallery">
              <img src="https://tunnelingonline.com/wp-content/uploads/2025/04/Picture1.jpg" alt="Placeholder Image 1" className="gallery-image" />
              <img src="https://static.iheartsitebuilder.com/a7c34ca42e7841bd9fd59b90f5e378ce/i/a734a5555c5449759afd22a9acd93734/1/4SoifmQpDrHbZJ6Vyc2hJ/ameritech-slope-constructors-home-gallery-16-1280w.jpg" alt="Placeholder Image 2" className="gallery-image" />
              <img src="https://static.iheartsitebuilder.com/a7c34ca42e7841bd9fd59b90f5e378ce/i/a6ba0161925c4ca7ac756eef83a1db33/1/4SoifmQpDrHbZJ6Vyc2hJ/ameritech-slope-constructors-home-gallery-09-1280w.jpg" alt="Placeholder Image 3" className="gallery-image" />
              <img src="https://static.iheartsitebuilder.com/a7c34ca42e7841bd9fd59b90f5e378ce/i/b2b9ce490a5243e397eb7be257d1f51b/1/4SoifmQpDrHbZJ6Vyc2hJ/ameritech-slope-constructors-home-gallery-10-1280w.jpg" alt="Placeholder Image 4" className="gallery-image" />
            </div>
            <div className="text-content">
              <h2 className="section-title">Our Commitment to Excellence</h2>
              <p className="section-subtitle">
                DGMTS is dedicated to providing top-tier geotechnical and material testing services. Our commitment extends to every project, ensuring precision, reliability, and client satisfaction. We leverage cutting-edge technology and a team of experienced professionals to deliver solutions that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

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