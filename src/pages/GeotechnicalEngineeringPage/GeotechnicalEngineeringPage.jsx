import React from 'react';
import { 
  Shield, 
  Users, 
  Target, 
  Award, 
  Layers,
  Settings,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import './GeotechnicalEngineeringPage.css';
import HeroSection from '../../components/HeroSection';
import photo44 from '../../assets/gallery/photo-44.jpg';
import photo87 from '../../assets/gallery/photo-87.jpg';
import teamMember1 from '../../assets/team-members/team-member-1.jpg';

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
      <HeroSection
        badge="Geotechnical Excellence"
        title="Geotechnical Engineering Excellence"
        subtitle="DGMTS delivers comprehensive geotechnical engineering services with precision, safety, and innovation. From site investigation to foundation design, we ensure your projects stand on solid ground."
        primaryButtonText="Get Started"
        image2={photo44}
        image1={photo87}
        imageAlt="Geotechnical Engineering"
      />
      <div className='bg-texture'>
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
      <section className="geotech-section">
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
                src={photo87}
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

      {/* Leadership Section */}
      <section className="geotech-section">
        <div className="geotech-container">
          <div className="geotech-leadership">
            <div className="geotech-leadership-content">
              <h2 className="geotech-section-title">Expert Leadership</h2>
              <div className="geotech-leadership-card">
                <div className="geotech-leadership-text">
                  <h3 className="geotech-leadership-name">Dr. Tariq Hamid, PhD, PE, CCM</h3>
                  <p className="geotech-leadership-title">President</p>
                  <p className="geotech-leadership-description">
                    Our president, Dr. Tariq Hamid, PhD, PE, CCM has over 26 years of experience in geotechnical engineering, 
                    with special expertise in foundation engineering, retaining walls, support of excavation system design, 
                    material analysis, and finite element modeling.
                  </p>
                </div>
                <div className="geotech-leadership-image">
                  <img 
                    src={teamMember1}
                    alt="Dr. Tariq Hamid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      {/* Remaining sections... */}
    </div>
  );
};

export default GeotechnicalEngineeringPage;
