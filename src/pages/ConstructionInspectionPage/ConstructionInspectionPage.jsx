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
  Star,
  HardHat,
  ClipboardList,
  Building,
  Wrench
} from 'lucide-react';
import './ConstructionInspectionPage.css';

const ConstructionInspectionPage = () => {
  const services = [
    {
      icon: <HardHat className="construction-icon-lg" />,
      title: "Quality Assurance/Control",
      description: "Inspection and testing for earthwork, concrete, asphalt, and steel."
    },
    {
      icon: <ClipboardList className="construction-icon-lg" />,
      title: "Materials Testing",
      description: "Comprehensive testing of concrete, soil, aggregate, and asphalt."
    },
    {
      icon: <Building className="construction-icon-lg" />,
      title: "Structural Inspections",
      description: "Inspections for masonry, steel, fireproofing, and EIFS."
    },
    {
      icon: <Wrench className="construction-icon-lg" />,
      title: "Third-Party Inspections",
      description: "Structural, mechanical, electrical, plumbing, and welding inspections."
    }
  ];

  return (
    <div className="construction-page">
      {/* Hero Section */}
      <section className="construction-hero">
        <div className="construction-hero-content">
          <div className="construction-hero-text">
            <h1 className="construction-hero-title">
              Construction Inspection & Testing
            </h1>
            <p className="construction-hero-subtitle">
              DGMTS provides quality assurance and quality control inspection and testing services for earthwork, concrete, asphalt, and steel in the construction of roads, airports, buildings, and other civil infrastructure.
            </p>
            <button className="construction-hero-cta">
              Our Services <ArrowRight className="construction-arrow-icon" />
            </button>
          </div>
          <div className="construction-hero-image-container">
            <img src="https://www.letsbuild.com/wp-content/uploads/2023/07/shutterstock_1247187910.png" alt="Construction Inspection" className="construction-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="construction-section">
        <div className="construction-container">
          <div className="construction-section-header">
            <h2 className="construction-section-title">Our Expertise</h2>
            <p className="construction-section-subtitle">
              Our expertise includes testing of concrete, soil & aggregate, and asphalt, along with inspection services for structural masonry, structural steel, sprayed-on fireproofing, exterior insulation and finishing systems (EIFS), and asphalt pavement evaluation.
            </p>
          </div>
          
          <div className="construction-service-grid">
            {services.map((service, index) => (
              <div key={index} className="construction-service-card">
                <div className="construction-service-icon">
                  {service.icon}
                </div>
                <h3 className="construction-service-title">{service.title}</h3>
                <p className="construction-service-desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TPIP and SPI Section */}
      <section className="construction-section white-bg">
        <div className="construction-container">
          <div className="construction-two-col">
            <div className="construction-image-card">
              <img 
                src="https://planradar-website.s3.amazonaws.com/production/uploads/2023/03/inspection-site-management-tablet-iStock-1405772906.jpg" 
                alt="Inspection"
              />
            </div>
            <div>
              <h2 className="construction-section-title">
                Inspection Programs
              </h2>
              <div className="construction-feature-list">
                <div className="construction-feature-item">
                  <div className="construction-feature-icon green">
                    <Shield className="construction-icon-md" />
                  </div>
                  <div>
                    <h3 className="construction-feature-title">Third-Party Inspection Program (TPIP)</h3>
                    <p className="construction-feature-desc">
                      DGMTS provides inspections for a wide range of structures including single/multi-family dwellings, as well as modifications/renovations of any building type. Our Third-Party Inspection Program (TPIP) focuses on structural safety and stability, documentation review, mechanical/electrical/plumbing, structural/ civil and welding inspections.
                    </p>
                  </div>
                </div>
                <div className="construction-feature-item">
                  <div className="construction-feature-icon blue">
                    <CheckCircle className="construction-icon-md" />
                  </div>
                  <div>
                    <h3 className="construction-feature-title">Special Inspection Program (SPI)</h3>
                    <p className="construction-feature-desc">
                      DGMTS Special Inspection Program (SPI) focuses on monitoring of critical structural materials including steel construction, concrete construction, and fireproofing. Our certified inspectors ensure that footings, waterproofing/foundation drainage and concrete slabs on ground conform to all applicable codes and specifications requirements.
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

export default ConstructionInspectionPage;
