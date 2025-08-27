import React from 'react';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  HardHat,
  ClipboardList,
  Building,
  Wrench
} from 'lucide-react';
import './ConstructionInspectionPage.css';
import HeroSection from '../../components/HeroSection';
import photo103 from '../../assets/gallery/photo-103.jpg';
import photo38 from '../../assets/gallery/photo-38.jpg';

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
      <HeroSection
        badge="DGMTS Quality Assurance"
        title="Construction Inspection & Testing"
        subtitle="DGMTS provides quality assurance and quality control inspection and testing services for earthwork, concrete, asphalt, and steel in the construction of roads, airports, buildings, and other civil infrastructure."
        primaryButtonText="Our Services"
        image2={photo38}
        image1={photo103}
        imageAlt="Construction Inspection"
      />

      {/* Services Grid */}
      <div className='bg-texture'>
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
        <section className="construction-section">
          <div className="construction-container">
            <div className="construction-two-col">
              <div className="construction-image-card">
                <img
                  src={photo103}
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
    </div>
  );
};

export default ConstructionInspectionPage;
