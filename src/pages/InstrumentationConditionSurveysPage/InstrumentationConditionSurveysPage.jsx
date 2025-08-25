import React from 'react';
import { 
  Monitor, 
  Building, 
  ClipboardCheck, 
  Camera, 
  ArrowRight
} from 'lucide-react';
import './InstrumentationConditionSurveysPage.css';
import photo54 from '../../assets/gallery/photo-54.jpg';

const InstrumentationConditionSurveysPage = () => {
  const services = [
    {
      icon: <Monitor className="inst-icon-lg" />,
      title: "Automated Monitoring Systems",
      description: "Monitoring safety and stability of buildings, excavations, retaining walls, tunnels, railways, and bridges."
    },
    {
      icon: <Building className="inst-icon-lg" />,
      title: "Risk Detection & Alleviation",
      description: "Assisting clients in detecting and alleviating risk, optimizing designs and methods."
    },
    {
      icon: <ClipboardCheck className="inst-icon-lg" />,
      title: "Regulatory Compliance",
      description: "Documenting regulatory compliance for various projects."
    },
    {
      icon: <Camera className="inst-icon-lg" />,
      title: "Innovative Solutions",
      description: "Implementing innovative solutions for challenging projects with advanced sensing technologies."
    }
  ];

  return (
    <div className="inst-page">
      {/* Hero Section */}
      <section className="inst-hero">
        <div className="inst-hero-content">
          <div className="inst-hero-text">
            <h1 className="inst-hero-title">
              Instrumentation & Condition Surveys
            </h1>
            <p className="inst-hero-subtitle">
              DGMTS provides automated systems for monitoring the safety and stability of buildings, excavations, retaining walls, tunnels, railways, and bridges.
            </p>
            <button className="inst-hero-cta">
              Learn More <ArrowRight className="inst-arrow-icon" />
            </button>
          </div>
          <div className="inst-hero-image-container">
            <img src={photo54} alt="Instrumentation and Condition Surveys" className="inst-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="inst-section">
        <div className="inst-container">
          <div className="inst-section-header">
            <h2 className="inst-section-title">Our Expertise</h2>
            <p className="inst-section-subtitle">
              We have assisted our clients, infrastructure operators and contractors, and construction engineers in detecting and alleviating risk, optimizing designs and methods, and documenting regulatory compliance.
            </p>
          </div>
          
          <div className="inst-service-grid">
            {services.map((service, index) => (
              <div key={index} className="inst-service-card">
                <div className="inst-service-icon">
                  {service.icon}
                </div>
                <h3 className="inst-service-title">{service.title}</h3>
                <p className="inst-service-desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Technologies and Surveys Section */}
      <section className="inst-section white-bg">
        <div className="inst-container">
          <div className="inst-full-width-content">
            <h2 className="inst-section-title">
              Advanced Technologies & Condition Surveys
            </h2>
            <div className="inst-feature-grid">
              <div className="inst-feature-item">
                <div className="inst-feature-icon green">
                  <Monitor className="inst-icon-md" />
                </div>
                <div>
                  <h3 className="inst-feature-title">Advanced Sensing Technologies</h3>
                  <p className="inst-feature-desc">
                    DGMTS specialized in implementing innovative solutions for challenging projects. With extensive experience in instrumentation, we harness a wide range of both traditional and advanced sensing technologies. Our instrumentation services encompass PDAs, Piezometers, Inclinometers, Vibration, Noise & Crack Monitoring and has resources and necessary expertise that provides indigenous virtual monitoring services with remote access to collect data in real time.
                  </p>
                </div>
              </div>
              <div className="inst-feature-item">
                <div className="inst-feature-icon blue">
                  <ClipboardCheck className="inst-icon-md" />
                </div>
                <div>
                  <h3 className="inst-feature-title">Pre- and Post-Construction Condition Surveys</h3>
                  <p className="inst-feature-desc">
                    DGMTS provide pre- and post-construction condition survey services to review the condition of structures and properties before and after construction activities. Our experienced staff and proprietary professional reporting system ensure thorough and accurate assessments.
                  </p>
                </div>
              </div>
              <div className="inst-feature-item">
                <div className="inst-feature-icon purple">
                  <Camera className="inst-icon-md" />
                </div>
                <div>
                  <h3 className="inst-feature-title">Assessment Techniques</h3>
                  <p className="inst-feature-desc">
                    DGMTS utilize standardized forms, stilleutiliz photographs, videotaping, visual observations, crack monitoring gauges, and non-destructive testing techniques for pre-construction condition assessments of the structures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstrumentationConditionSurveysPage;
