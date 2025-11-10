import React from 'react';
import {
  Monitor,
  ClipboardCheck,
  ScanEyeIcon,
  Lightbulb,
  Siren,
  FileSearch,
  Building2,
  GraduationCap
} from 'lucide-react';
import './InstrumentationConditionSurveysPage.css';
import HeroSection from '../../components/HeroSection';
import ProjectsList from '../../components/ProjectsList';
import photo54 from '../../assets/gallery/photo-54.jpg';
import photo52 from '../../assets/gallery/photo-52.jpg';
import photo48 from '../../assets/gallery/photo-48.jpg';
import photo117 from '../../assets/gallery/photo-117.jpg';

import preConstructionImage from '../../assets/instrumentation/picture_1.jpg';
import postConstructionImage from '../../assets/instrumentation/picture_2.jpg';

const InstrumentationConditionSurveysPage = () => {
  const handleLearnMoreClick = () => {
    const element = document.getElementById('structural-condition-surveys');
    if (element) {
      const navbarHeight = 64; // Height of the navigation bar in pixels
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      icon: <Monitor className="inst-icon-lg" />,
      title: "Automated Monitoring Systems",
      description: "Monitoring safety and stability of buildings, excavations, retaining walls, tunnels, railways, and bridges."
    },
    {
      icon: <Siren className="inst-icon-lg" />,
      title: "Risk Detection & Alleviation",
      description: "Assisting clients in detecting and alleviating risk, optimizing designs and methods."
    },
    {
      icon: <ClipboardCheck className="inst-icon-lg" />,
      title: "Regulatory Compliance",
      description: "Documenting regulatory compliance for various projects."
    },
    {
      icon: <Lightbulb className="inst-icon-lg" />,
      title: "Innovative Solutions",
      description: "Implementing innovative solutions for challenging projects with advanced sensing technologies."
    }
  ];

  const surveyTypes = [
    {
      image: preConstructionImage,
      title: "Pre-Construction Condition Survey",
      description: "Comprehensive assessment of structures and properties before construction activities begin. We utilize standardized forms, photographs, videotaping, visual observations, and crack monitoring gauges to document existing conditions."
    },
    {
      image: postConstructionImage,
      title: "Post-Construction Condition Survey",
      description: "Thorough evaluation of structures after construction completion to document any changes, ensure structural integrity, and provide comparison with pre-construction conditions using our proprietary reporting system."
    }
  ];

  const instruments = [
    "Piezometers",
    "Inclinometers",
    "Extensometers",
    "Strain Gauges",
    "Crack Meters",
    "Tilt Meters",
    "Seismograph",
    "Vibration Monitors",
    "PDAs",
    "Noise Monitors"
  ];

  const techniques = [
    "Visual Observations",
    "Crack Monitoring Gauges",
    "Non-Destructive Testing",
    "Real-Time Data Collection",
    "Remote Monitoring",
    "Videotaping & Photography",
    "Standardized Assessment Forms"
  ];

  const instrumentationProjects = [
    {
      title: "ANC Yellow Line - Instrumentation, Alington Virginia",
      displayTitle: "ANC Yellow Line - Instrumentation",
      location: "Arlington Virginia"
    },
    {
      title: "Summit School Road - Geotechnical Instrumentation and Monitoring",
      displayTitle: "Summit School Road",
      location: "Woodbridge, Virginia"
    },
    {
      title: "ANC DAR-B/C Vibration Monitoring - Geotechnical Instrumentation and Monitoring",
      displayTitle: "ANC DAR-B/C Vibration Monitoring",
      location: "Arlington, Virginia"
    },
    {
      title: "VPRA Long Bridge North: Phase 1 Instrumentation and Monitoring",
      displayTitle: "Long Bridge North Package Washington DC - Instrumentation Monitoring",
      location: "Washington DC"
    },
    {
      title: "Sheridan, Wilson, McClellan Road, Repairs Arlington National Cemetery, Arlington, Virginia – Geotechnical Engineering Services",
      displayTitle: "ANC Sheridan Area - Geotech and Instrumentation",
      location: "Arlington Virginia"
    },
    {
      title: "Potomac Yards - Instrumentation",
      displayTitle: "Potomac Yards - Instrumentation",
      location: "Potomac Yards"
    },
    {
      title: "Amtrack-Track 22 Track Monitoring",
      displayTitle: "Amtrack-Track 22 Track Monitoring",
      location: "Amtrack Track 22"
    },
    {
      title: "Instrumentation - MDOT Tennyson Wetland Mitigation",
      displayTitle: "Instrumentation - MDOT Tennyson Wetland Mitigation",
      location: "St Mary's County MD"
    }
  ];

  return (
    <div className="inst-page">
      {/* Hero Section */}
      <HeroSection
        badge="Advanced Monitoring Solutions"
        title="Instrumentation & Condition Surveys"
        subtitle="DGMTS provides automated systems for monitoring the safety and stability of buildings, excavations, retaining walls, tunnels, railways, and bridges."
        primaryButtonText="Learn More"
        onPrimaryClick={handleLearnMoreClick}
        image1={photo54}
        image2={photo52}
        imageAlt="Instrumentation and Condition Surveys"
      />
      <div className='bg-texture'>
        <section className="inst-section inst-survey-section" id="structural-condition-surveys">
          <div className="inst-container">
            <div className="inst-section-header">
              <h2 className="inst-section-title">Structural Condition Surveys</h2>
              <p className="inst-section-subtitle">
                DGMTS has resources and necessary expertise to perform comprehensive pre-construction and post-construction condition surveys for various structures and properties.
              </p>
            </div>

            <div className="inst-survey-grid">
              {surveyTypes.map((survey, index) => (
                <div key={index} className="inst-survey-card">
                  <div className="inst-survey-image-container">
                    <img src={survey.image} alt={survey.title} className="inst-survey-image" loading="lazy" />
                  </div>
                  <div className="inst-survey-content">
                    <h3 className="inst-survey-title">{survey.title}</h3>
                    <p className="inst-survey-desc">{survey.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Expertise Section */}
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

        {/* Instruments & Techniques Section */}
        <section className="inst-section inst-tech-section">
          <div className="inst-container">
            <div className="inst-section-header">
              <h2 className="inst-section-title">Our Technologies & Techniques</h2>
              <p className="inst-section-subtitle">
                We utilize a comprehensive range of geotechnical instruments and advanced assessment techniques for structural monitoring and health assessment.
              </p>
            </div>

            <div className="inst-tech-container">
              {/* Instruments */}
              <div className="inst-tech-block">
                <div className="inst-tech-header">
                  <Monitor className="inst-tech-header-icon" />
                  <h3 className="inst-tech-heading">Geotechnical Instruments</h3>
                </div>
                <p className="inst-tech-description">
                  Sensors used to monitor the health of structures in geotechnical and civil engineering projects with real-time data collection and remote access capabilities.
                </p>
                <div className="inst-chips-container">
                  {instruments.map((instrument, index) => (
                    <span key={index} className="inst-chip inst-chip-blue">
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>

              {/* Techniques */}
              <div className="inst-tech-block">
                <div className="inst-tech-header">
                  <ScanEyeIcon className="inst-tech-header-icon" />
                  <h3 className="inst-tech-heading">Assessment Techniques</h3>
                </div>
                <p className="inst-tech-description">
                  Comprehensive methodologies for accurate condition assessment and documentation of structural properties.
                </p>
                <div className="inst-chips-container">
                  {techniques.map((technique, index) => (
                    <span key={index} className="inst-chip inst-chip-green">
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Expertise Section */}
        <section className="inst-section">
          <div className="inst-container">
            {/* Main Two Column Layout */}
            <div className="inst-two-column-layout">
              {/* Left Column: Large Image */}
              <div className="inst-left-column">
                <img src={photo54} alt="Instrumentation Equipment" className="inst-large-image" loading="lazy" />
              </div>

              {/* Right Column: Text Content */}
              <div className="inst-right-column">
                <div className="inst-text-content">
                  <h2 className="inst-column-heading">Proven Experience & Leadership</h2>
                  <p className="inst-column-subheading">
                    DGMTS has successfully completed several projects related to condition assessments and instrument installation for structural monitoring solutions. We provide indigenous online monitoring services for civil engineering structural projects with remote access to real-time data.
                  </p>
                  
                  {/* Expertise Highlight */}
                  <div className="inst-expertise-box">
                    <div className="inst-expertise-icon">
                      <GraduationCap className="inst-icon-md" />
                    </div>
                    <div className="inst-expertise-content">
                      <h4 className="inst-expertise-title">Expert Leadership</h4>
                      <p className="inst-expertise-text">
                        Our President, <strong>Tariq Hamid, PhD, PE</strong>, has extensive knowledge and experience in structural condition assessments and pre-construction surveys, ensuring the highest standards of quality and accuracy in all our projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Images Below - Separate Block */}
            <div className="inst-two-images-row">
              <div className="inst-image-wrapper">
                <img src={photo48} alt="Field Instrumentation" className="inst-dual-image" loading="lazy" />
              </div>
              <div className="inst-image-wrapper">
                <img src={photo117} alt="Monitoring Systems" className="inst-dual-image" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Instrumentation Projects Section */}
        <ProjectsList
          title="Instrumentation Projects"
          subtitle="Explore our comprehensive portfolio of instrumentation and monitoring projects across various locations and applications."
          projects={instrumentationProjects}
        />
      </div>
    </div>
  );
};

export default InstrumentationConditionSurveysPage;
