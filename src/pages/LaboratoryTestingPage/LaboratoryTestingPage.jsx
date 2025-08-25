import React from 'react';
import { 
  FlaskConical, 
  Award, 
  Users, 
  Settings, 
  ArrowRight
} from 'lucide-react';
import './LaboratoryTestingPage.css';
import photo77 from '../../assets/gallery/photo-77.jpg';

const LaboratoryTestingPage = () => {
  const services = [
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Concrete Testing",
      description: "Wide range of laboratory testing services for concrete."
    },
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Soil Analysis",
      description: "Comprehensive soil analysis and testing."
    },
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Asphalt Testing",
      description: "Laboratory testing services for asphalt."
    },
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Water Analysis",
      description: "Specialized water analysis services."
    }
  ];

  return (
    <div className="lab-page">
      {/* Hero Section */}
      <section className="lab-hero">
        <div className="lab-hero-content">
          <div className="lab-hero-text">
            <h1 className="lab-hero-title">
              Laboratory Testing
            </h1>
            <p className="lab-hero-subtitle">
              Dulles Geotechnical and Material Testing Services (DGMTS) offers a wide range of laboratory testing services for concrete, soil, asphalt and water analysis.
            </p>
            <button className="lab-hero-cta">
              Our Services <ArrowRight className="lab-arrow-icon" />
            </button>
          </div>
          <div className="lab-hero-image-container">
            <img src={photo77} alt="Laboratory Testing" className="lab-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="lab-section">
        <div className="lab-container">
          <div className="lab-section-header">
            <h2 className="lab-section-title">Our Expertise</h2>
            <p className="lab-section-subtitle">
              DGMTS provides independent construction materials testing at our testing laboratory facilities in Chantilly and Hampton, ensuring efficiency and cost savings for our clients.
            </p>
          </div>
          
          <div className="lab-service-grid">
            {services.map((service, index) => (
              <div key={index} className="lab-service-card">
                <div className="lab-service-icon">
                  {service.icon}
                </div>
                <h3 className="lab-service-title">{service.title}</h3>
                <p className="lab-service-desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation and Staff Section */}
      <section className="lab-section white-bg">
        <div className="lab-container">
          <div className="lab-content-block">
            {/* <div className="lab-image-card-full">
              <img 
                src="https://sunlabtech.com/wp-content/uploads/2018/08/Triaxial-Test-Apparatus.jpg" 
                alt="Laboratory Accreditation"
              />
            </div> */}
            <div>
              <h2 className="lab-section-title">
                Accreditation & Expert Staff
              </h2>
              <div className="lab-feature-list">
                <div className="lab-feature-item">
                  <div className="lab-feature-icon green">
                    <Award className="lab-icon-md" />
                  </div>
                  <div>
                    <h3 className="lab-feature-title">Accreditation</h3>
                    <p className="lab-feature-desc">
                      Our laboratories located in Chantilly and Hampton, Virginia are accredited by the American Association of State Highway and Transportation Officials (AASHTO) and Cement and Concrete Reference Laboratory (CCRL). We are a member of the Washington Area Council of Engineering Laboratories, Inc. (WACEL). Our Accreditation conforms to the requirements of ASTM D3740, ASTM E329, and AASHTO R-18. We participate in both the AASHTO and CCRL proficiency sample programs for soil and concrete.
                    </p>
                  </div>
                </div>
                <div className="lab-feature-item">
                  <div className="lab-feature-icon blue">
                    <Users className="lab-icon-md" />
                  </div>
                  <div>
                    <h3 className="lab-feature-title">Laboratory Management and Staff</h3>
                    <p className="lab-feature-desc">
                      In response to the fast paced nature of today's projects, we strive to keep operations running smoothly and efficiently through electronic report transmittals and a unique laboratory database management system. Our certified field and laboratory technicians have extensive experience across various sectors, including retail, commercial, hospitality, healthcare, energy, and transportation projects such as highways, bridges, and aviation. They are proficient in sampling and testing protocols for a wide range of materials. We have the flexibility to hire additional staff as needed to meet project demands and ensure timely completion of all testing services.
                    </p>
                  </div>
                </div>
                <div className="lab-feature-item">
                  <div className="lab-feature-icon purple">
                    <Settings className="lab-icon-md" />
                  </div>
                  <div>
                    <h3 className="lab-feature-title">Laboratory Equipment</h3>
                    <p className="lab-feature-desc">
                      DGMTS laboratories are fully equipped with all necessary equipment to perform several tests on disturbed and undisturbed soil samples, aggregate, concrete, asphalt, and water. We are well equipped to perform several tests at a time as we have multiple proctor and CBR, consolidation, and concrete compression testing equipment sets. Our Chantilly laboratory can also perm peak as well as residual direct shear tests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaboratoryTestingPage;
