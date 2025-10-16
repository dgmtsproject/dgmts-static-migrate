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
import ProjectsList from '../../components/ProjectsList';
import photo44 from '../../assets/gallery/photo-44.jpg';
import photo35 from '../../assets/gallery/photo-35.jpg';
import photo87 from '../../assets/gallery/photo-87.jpg';
import photo91 from '../../assets/gallery/photo-91.jpg';

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

  const geotechnicalProjects = [
    { title: "BWI Airport Concourse E", location: "Maryland" },
    { title: "DC 295/I-295 Near Term Improvements", location: "Washington, DC" },
    { title: "Foxcroft Mall", location: "Martinsburg, West Virginia" },
    { title: "U.S. Consulate", location: "Hamilton, Bermuda" },
    { title: "U.S. Consulate", location: "Madrid, Spain" },
    { title: "Marine Security Guard Residence (MSGR) Expansion", location: "US Embassy Khartoum, Sudan" },
    { title: "Retaining Walls, 6024 Telegraph Road", location: "Alexandria, VA" },
    { title: "Holly Springs Residential Development", location: "Capitol Heights, Prince George's County, MD" },
    { title: "Miller Ham Radio Hobby Tower", location: "Great Falls, VA" },
    { title: "Walmart Parking Lot Improvement", location: "Warrenton, VA" },
    { title: "Pedestrian Bridge Foundation", location: "Alexandria, VA" }
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

      {/* Comprehensive Services Overview - Part 1 */}
      <section className="geotech-section">
        <div className="geotech-container">
          <div className="geotech-two-col">
            <div className="geotech-overview-content">
              <h2 className="geotech-section-title">Comprehensive Geotechnical Services</h2>
              <p className="geotech-overview-text">
                DGMTS offers a comprehensive portfolio of geotechnical engineering services. Our experienced teams of registered professional engineers provide preliminary and design level geotechnical engineering services with accuracy and safety in compliance with the approved plans, according to environmental considerations and client requirements.
              </p>
            </div>
            
            <div className="geotech-image-card">
              <img 
                src={photo91}
                alt="Geotechnical Services"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Services Overview - Part 2 */}
      <section className="geotech-section">
        <div className="geotech-container">
          <div className="geotech-two-col">
            <div className="geotech-image-card">
              <img 
                src={photo35}
                alt="Engineering Excellence"
                loading="lazy"
              />
            </div>

            <div className="geotech-overview-content">
              <p className="geotech-overview-text">
                We develop unique subsurface investigation and laboratory testing programs, according to project type, scope, technical complexity, client needs, governing entities requirements and according to industry standards. Our President, Dr. Tariq Hamid, PhD, PE has 30+ year experience in geotechnical engineering with special emphasis on foundation engineering, retaining wall, support of excavation system design, material analysis & finite element modelling.
              </p>
            </div>
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
                id="geotech-overview-image"

                alt="Engineering team"
                loading="lazy"
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
                    Our president, Dr. Tariq Hamid, PhD, PE, CCM has over 30 years of experience in geotechnical engineering, 
                    with special expertise in foundation engineering, retaining walls, support of excavation system design, 
                    material analysis, and finite element modeling.
                  </p>
                </div>
                <div className="geotech-leadership-image">
                  <img 
                    src={teamMember1}
                    alt="Dr. Tariq Hamid"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectsList 
        title={<>Featured Geotechnical<br />Engineering Projects</>}
        subtitle="A selection of our notable geotechnical engineering projects across various sectors"
        projects={geotechnicalProjects}
      />
      </div>
      {/* Remaining sections... */}
    </div>
  );
};

export default GeotechnicalEngineeringPage;
