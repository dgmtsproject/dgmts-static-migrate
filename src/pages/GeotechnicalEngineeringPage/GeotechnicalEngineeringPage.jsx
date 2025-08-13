import React from 'react';
import { 
  Shield, 
  Users, 
  Target, 
  Award, 
  CheckCircle, 
  Layers,
  Settings,
  TrendingUp,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react';
import './GeotechnicalEngineeringPage.css';

const GeotechnicalEngineeringPage = () => {
  const services = [
    {
      icon: <Layers className="geotech-icon-lg" />,
      title: "Site Investigation",
      description: "Comprehensive subsurface exploration and soil analysis"
    },
    {
      icon: <Settings className="geotech-icon-lg" />,
      title: "Foundation Design",
      description: "Expert foundation recommendations and structural support"
    },
    {
      icon: <Shield className="geotech-icon-lg" />,
      title: "Risk Assessment",
      description: "Proactive identification and mitigation of geotechnical risks"
    },
    {
      icon: <TrendingUp className="geotech-icon-lg" />,
      title: "Material Testing",
      description: "Advanced laboratory testing and material analysis"
    }
  ];

  const expertise = [
    "Foundation Engineering",
    "Retaining Walls",
    "Support of Excavation Systems",
    "Material Analysis",
    "Finite Element Modeling",
    "Environmental Compliance"
  ];

  return (
    <div className="geotech-page">
      {/* Hero Section */}
      <section className="geotech-hero">
        <div className="geotech-hero-content">
          <div className="geotech-hero-text">
            <h1 className="geotech-hero-title">
              Geotechnical Engineering <span className="geotech-highlight">Excellence</span>
            </h1>
            <p className="geotech-hero-subtitle">
              DGMTS delivers comprehensive geotechnical engineering services with precision, 
              safety, and innovation. From site investigation to foundation design, we ensure 
              your projects stand on solid ground.
            </p>
            <button className="geotech-hero-cta">
              Get Started <ArrowRight className="geotech-arrow-icon" />
            </button>
          </div>
          <div className="geotech-hero-image-container">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&crop=center" alt="Geotechnical Engineering" className="geotech-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="geotech-section">
        <div className="geotech-container">
          <div className="geotech-section-header">
            <h2 className="geotech-section-title">Our Core Services</h2>
            <p className="geotech-section-subtitle">
              Comprehensive geotechnical solutions tailored to your project's unique requirements
            </p>
          </div>
          
          <div className="geotech-service-grid">
            {services.map((service, index) => (
              <div key={index} className="geotech-service-card">
                <div className="geotech-service-icon">
                  {service.icon}
                </div>
                <h3 className="geotech-service-title">{service.title}</h3>
                <p className="geotech-service-desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose DGMTS */}
      <section className="geotech-section white-bg">
        <div className="geotech-container">
          <div className="geotech-two-col">
            <div>
              <h2 className="geotech-section-title">
                Why Choose <span className="geotech-primary-text">DGMTS?</span>
              </h2>
              <div className="geotech-feature-list">
                <div className="geotech-feature-item">
                  <div className="geotech-feature-icon green">
                    <Shield className="geotech-icon-md" />
                  </div>
                  <div>
                    <h3 className="geotech-feature-title">Industry-Leading Equipment</h3>
                    <p className="geotech-feature-desc">
                      One of the most well-equipped geotechnical firms in the region with state-of-the-art testing equipment and technology.
                    </p>
                  </div>
                </div>
                <div className="geotech-feature-item">
                  <div className="geotech-feature-icon blue">
                    <Users className="geotech-icon-md" />
                  </div>
                  <div>
                    <h3 className="geotech-feature-title">Expert Team</h3>
                    <p className="geotech-feature-desc">
                      Experienced registered professional engineers, geotechnical engineers, and geologists ensuring precision and safety.
                    </p>
                  </div>
                </div>
                <div className="geotech-feature-item">
                  <div className="geotech-feature-icon purple">
                    <Target className="geotech-icon-md" />
                  </div>
                  <div>
                    <h3 className="geotech-feature-title">Tailored Solutions</h3>
                    <p className="geotech-feature-desc">
                      Custom subsurface investigation and testing programs designed for your specific project requirements and industry standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="geotech-image-card">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=800&fit=crop&crop=center" 
                alt="Engineering team"
              />
              <div className="geotech-badge">
                <Award className="geotech-icon-lg yellow" />
                <div>
                  <div className="geotech-badge-title">26+ Years</div>
                  <div className="geotech-badge-sub">Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining sections... */}
    </div>
  );
};

export default GeotechnicalEngineeringPage;
