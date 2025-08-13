import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      name: 'Geotechnical Engineering',
      shortDescription: 'Comprehensive geotechnical analysis, foundation design, and soil investigation services for construction projects.',
      image: 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    {
      name: 'Materials Testing',
      shortDescription: 'Quality control testing of construction materials including concrete, steel, asphalt, and aggregates.',
      image: 'https://images.pexels.com/photos/3862379/pexels-photo-3862379.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    {
      name: 'Special Inspections',
      shortDescription: 'Specialized inspection services for structural components, welds, and construction quality assurance.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    {
      name: 'Environmental Services',
      shortDescription: 'Environmental site assessments, contamination testing, and remediation consulting services.',
      image: 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    {
      name: 'Drilling Services',
      shortDescription: 'Professional drilling services for geotechnical investigation, sampling, and monitoring well installation.',
      image: 'https://images.pexels.com/photos/162639/nuclear-power-plant-cooling-tower-nuclear-power-plant-sky-162639.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
    },
    {
      name: 'Laboratory Testing',
      shortDescription: 'Full-service laboratory testing with state-of-the-art equipment and certified technicians.',
      image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
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
                  <a href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {service.name}
                  </a>
                </h3>
                <p className="service-description">
                  {service.shortDescription}
                </p>
                <div className="service-footer">
                  <a 
                    href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
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