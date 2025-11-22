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
import photo48 from '../../assets/gallery/photo-48.jpg';
import instrumentationHeroImage1 from '../../assets/instrumentation/project7_1.png';
import instrumentationHeroImage2 from '../../assets/instrumentation/project7_2.png';
import instrumentationImage3 from '../../assets/instrumentation/project7_4.png';

import preConstructionImage from '../../assets/instrumentation/picture_1.jpg';

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
      title: "Structural Health & Vibration",
      description: "We ensure asset integrity through Concrete Temperature Loggers and Crack Monitoring, alongside compliant Vibration & Noise Recording."
    },
    {
      icon: <Building2 className="inst-icon-lg" />,
      title: "Geotechnical & Ground Stability",
      description: "Our subsurface solutions include Piezometers and Inclinometers, utilizing Settlement Plates and Slopes Monitoring for stability."
    },
    {
      icon: <ScanEyeIcon className="inst-icon-lg" />,
      title: "Automated Surveying & Movement",
      description: "We deploy Automated Total Stations (AMTS) for Track Monitoring, Remote Monitoring, and Horizontal & Vertical Movement checks."
    },
    {
      icon: <FileSearch className="inst-icon-lg" />,
      title: "Data & Advanced Sensing",
      description: "We integrate Traditional & Advanced Sensing Technologies with centralized Software, Cloud, and Data Solutions for actionable insights."
    }
  ];

  const surveyInfo = {
    image: preConstructionImage,
    title: "Structural Condition Surveys",
    description: "DGMTS provides comprehensive pre-construction and post-construction condition surveys for various structures and properties. Our pre-construction assessments document existing conditions using standardized forms, photographs, videotaping, visual observations, and crack monitoring gauges. Following construction completion, we conduct thorough post-construction evaluations to document any changes, ensure structural integrity, and provide detailed comparison with pre-construction conditions using our proprietary reporting system."
  };

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
      title: "Instrumentation - MDOT Tennyson Wetland Mitigation",
      displayTitle: "Instrumentation - MDOT Tennyson Wetland Mitigation",
      location: "St Mary's County MD"
    },
    {
      title: "Arlington National Cemetery Southern Expansion, Arlington, Virginia – Geotechnical Instrumentation (DGMTS project No. 21261)",
      displayTitle: "Arlington National Cemetery Southern Expansion",
      location: "Arlington, Virginia"
    },
    {
      title: "Washington Union Station, Amtrak Track 22 Rehabilitation, Washington DC (DGMTS 20078)",
      displayTitle: "Washington Union Station Track 22 Rehabilitation",
      location: "Washington, DC"
    },
    {
      title: "Potomac Yards Metrorail Station",
      displayTitle: "Potomac Yards Metrorail Station",
      location: "City of Alexandria"
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
        image1={instrumentationHeroImage2}
        image2={instrumentationHeroImage1}
        imageAlt="Instrumentation and Condition Surveys"
      />
      <div className='bg-texture'>
        {/* Our Instrumentation Services Section */}
        <section className="inst-section">
          <div className="inst-container">
            <div className="inst-section-header">
              <h2 className="inst-section-title">Our Instrumentation Services</h2>
              <p className="inst-section-subtitle">
                Advanced monitoring technologies for structural health, geotechnical stability, and automated surveying solutions.
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

        <section className="inst-section inst-survey-section" id="structural-condition-surveys">
          <div className="inst-container">
            <div className="inst-two-column-layout">
              {/* Left Column: Content */}
              <div className="inst-right-column">
                <div className="inst-text-content">
                  <h2 className="inst-column-heading">{surveyInfo.title}</h2>
                  <p className="inst-column-subheading">
                    {surveyInfo.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="inst-left-column">
                <img src={surveyInfo.image} alt={surveyInfo.title} className="inst-large-image" loading="lazy" />
              </div>
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
                <img src={instrumentationHeroImage1} alt="Instrumentation Equipment" className="inst-large-image" loading="lazy" />
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
                <img src={instrumentationImage3} alt="Monitoring Systems" className="inst-dual-image" loading="lazy" />
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
