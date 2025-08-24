import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      name: 'Geotechnical Engineering',
      shortDescription: 'DGMTS delivers comprehensive geotechnical engineering services with precision, safety, and innovation.',
      image: '/assets/photo-44-tVa5E9qI.jpg',
      url: '/services/geotechnical'
    },
    {
      name: 'Construction Inspection & Testing',
      shortDescription: 'Quality assurance and quality control inspection and testing services for earthwork, concrete, asphalt, and steel in roads, airports, buildings, and other infrastructure.',
      image: '/assets/photo-38-BKtxCF64.jpg',
      url: '/services/construction-inspection-testing'
    },
    {
      name: 'Laboratory Testing',
      shortDescription: 'DGMTS offers a wide range of laboratory testing services for concrete, soil, asphalt and water analysis.',
      image: '/assets/photo-77-DXi5GhsD.jpg',
      url: '/services/laboratory-testing'
    },
    {
      name: 'Drilling & In-Situ Testing',
      shortDescription: 'Supervision of drilling, logger services, drilling for soil investigation, water well drilling and in-site rock and asphalt coring.',
      image: '/assets/photo-49-75pJ_R5R.jpg',
      url: '/services/drilling-in-situ-testing'
    },
    {
      name: 'Instrumentation & Condition Surveys',
      shortDescription: 'Automated monitoring systems for safety and stability of buildings, excavations, retaining walls, tunnels, railways, and bridges.',
      image: '/assets/photo-54-C2ZQWtDJ.jpg',
      url: '/services/instrumentation-condition-surveys'
    },
    {
      name: 'Materials Testing',
      shortDescription: 'Comprehensive testing of concrete, soil, aggregate, and asphalt to ensure compliance and quality.',
      image: '/assets/photo-77-DXi5GhsD.jpg',
      url: '/services/laboratory-testing'
    }
  ];

  return (
    <section className="services-section home-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Engineering Services</h2>
          <p className="section-subtitle">
            Comprehensive engineering solutions backed by decades of experience and industry-leading expertise
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image">
                <img src={service.image} alt={service.name} />
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <h3 className="service-title">
                  <a href={service.url ? service.url : `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {service.name}
                  </a>
                </h3>
                <p className="service-description">
                  {service.shortDescription}
                </p>
                <div className="service-footer">
                  <a 
                    href={service.url ? service.url : `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="service-link"
                  >
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;