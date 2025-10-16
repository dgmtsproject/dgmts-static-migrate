import React from 'react';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  HardHat,
  ClipboardList,
  Building,
  Wrench,
  GraduationCap
} from 'lucide-react';
import './ConstructionInspectionPage.css';
import HeroSection from '../../components/HeroSection';
import ProjectsList from '../../components/ProjectsList';
import photo103 from '../../assets/gallery/photo-103.jpg';
import photo38 from '../../assets/gallery/photo-38.jpg';
import photo118 from '../../assets/gallery/photo-118.jpg';

const ConstructionInspectionPage = () => {
  const services = [
    {
      icon: <HardHat className="construction-icon-lg" />,
      title: "Third-Party Inspection Program (TPIP)",
      description: "Comprehensive inspections for single/multi-family dwellings and all building modifications/renovations focusing on structural safety, documentation review, and MEP systems."
    },
    {
      icon: <Shield className="construction-icon-lg" />,
      title: "Special Inspection Program (SPI)",
      description: "Monitoring of critical structural materials including steel construction, concrete, fireproofing, and foundation systems to ensure code compliance."
    },
    {
      icon: <ClipboardList className="construction-icon-lg" />,
      title: "Construction Materials Testing",
      description: "Quality assurance and testing of earthwork, concrete, asphalt, and steel for roads, airports, buildings, and civil infrastructure."
    },
    {
      icon: <Building className="construction-icon-lg" />,
      title: "Structural Element Inspection",
      description: "Inspection services for structural masonry, steel, fireproofing, EIFS, and evaluation of shallow and deep foundations."
    }
  ];

  const cmtProjects = [
    { title: "University of Maryland, College Park City Hall", location: "College Park, MD" },
    { title: "AvalonBay, Towson Circle Apartments", location: "Towson, MD" },
    { title: "MGM National Harbor", location: "Oxon Hill, MD" },
    { title: "Fire Marshall, William J. Burkholder Administrative Center", location: "Fairfax, VA" },
    { title: "Bush Hill Elementary School Modular Relocation", location: "Alexandria, VA" },
    { title: "Mount Pleasant Baptist Church", location: "Gainesville, VA" },
    { title: "Shiloh Baptist Church", location: "Lorton, VA" },
    { title: "Church of the Apostles", location: "Fairfax, VA" },
    { title: "St. Andrew's Episcopal Church", location: "Arlington, VA" }
  ];

  const specialInspectionProjects = [
    { title: "60 Randolph Pl NW", location: "Washington, DC" },
    { title: "1708 Hobart St NW", location: "Washington, DC" },
    { title: "47 Randolph Pl NW", location: "Washington, DC" },
    { title: "311 U St NW", location: "Washington, DC" },
    { title: "3706 Fulton St NW", location: "Washington, DC" },
    { title: "2910 18th St NW", location: "Washington, DC" },
    { title: "1545 6th St NW", location: "Washington, DC" },
    { title: "1460 Rhode Island Ave NW", location: "Washington, DC" },
    { title: "1223 Evarts St NE", location: "Washington, DC" },
    { title: "207 S St NE", location: "Washington, DC" },
    { title: "3112 7th St NE", location: "Washington, DC" },
    { title: "1721 Bay Street SE", location: "Washington, DC" },
    { title: "318 5th St SE", location: "Washington, DC" },
    { title: "321 6th St SE", location: "Washington, DC" },
    { title: "2237 Chester St SE", location: "Washington, DC" }
  ];

  const inspectionTypes = [
    {
      icon: <Shield className="construction-icon-lg" />,
      title: "Third-Party Inspection Program (TPIP)",
      description: "DGMTS provides inspections for a wide range of items including single/multi-family dwellings and all modifications/renovations for buildings of any type.",
      image: photo103,
      features: [
        "Structural safety and stability",
        "Documentation review",
        "Mechanical/Electrical/Plumbing systems",
        "Structural/Civil inspections",
        "Welding inspections"
      ]
    },
    {
      icon: <CheckCircle className="construction-icon-lg" />,
      title: "Special Inspection Program (SPI)",
      description: "DGMTS Special Inspection Program focuses on monitoring of critical structural materials to ensure code compliance.",
      image: photo118,
      features: [
        "Steel construction monitoring",
        "Concrete construction inspection",
        "Fireproofing verification",
        "Footings and foundation drainage",
        "Concrete floors on ground"
      ]
    }
  ];

  const materialsTestingServices = [
    {
      icon: <ClipboardList className="construction-icon-md" />,
      title: "Concrete Testing",
      items: ["Destructive testing", "Non-destructive testing", "Quality control"]
    },
    {
      icon: <HardHat className="construction-icon-md" />,
      title: "Soil & Aggregate Testing",
      items: ["Compaction testing", "Material analysis", "Quality assurance"]
    },
    {
      icon: <Building className="construction-icon-md" />,
      title: "Asphalt Testing",
      items: ["Pavement evaluation", "Material testing", "Quality control"]
    },
    {
      icon: <Wrench className="construction-icon-md" />,
      title: "Structural Elements",
      items: ["Masonry inspection", "Steel inspection", "Foundation inspection"]
    },
    {
      icon: <Shield className="construction-icon-md" />,
      title: "Fireproofing & EIFS",
      items: ["Sprayed-on fireproofing", "EIFS inspection", "Compliance verification"]
    },
    {
      icon: <Building className="construction-icon-md" />,
      title: "Foundation Systems",
      items: ["Shallow foundations", "Deep foundations", "Structural analysis"]
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
        loading="lazy"
      />

      {/* Services Grid */}
      <div className='bg-texture'>
        {/* Inspection Types Section */}
        <section className="construction-section construction-inspection-types">
          <div className="construction-container">
            <div className="construction-section-header">
              <h2 className="construction-section-title">Inspection Programs</h2>
              <p className="construction-section-subtitle">
                Comprehensive inspection services ensuring structural safety, code compliance, and quality assurance
              </p>
            </div>

            <div className="construction-inspection-grid">
              {inspectionTypes.map((inspection, index) => (
                <div key={index} className={`construction-inspection-card ${index % 2 === 1 ? 'construction-inspection-reverse' : ''}`}>
                  <div className="construction-inspection-image">
                    <img src={inspection.image} alt={inspection.title} loading="lazy" />
                  </div>
                  <div className="construction-inspection-content">
                    <div className="construction-inspection-header">
                      <div className="construction-inspection-icon-wrapper">
                        {inspection.icon}
                      </div>
                      <h3 className="construction-inspection-title">{inspection.title}</h3>
                    </div>
                    <p className="construction-inspection-desc">{inspection.description}</p>
                    <ul className="construction-inspection-features">
                      {inspection.features.map((feature, idx) => (
                        <li key={idx} className="construction-inspection-feature-item">
                          <CheckCircle className="construction-feature-check-icon" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materials Testing Section */}
        <section className="construction-section construction-materials-section">
          <div className="construction-container">
            <div className="construction-section-header">
              <h2 className="construction-section-title">Construction Materials Testing</h2>
              <p className="construction-section-subtitle">
                Quality assurance and quality control for earthwork, concrete, asphalt, and steel in roads, airports, buildings, and civil infrastructure
              </p>
            </div>

            <div className="construction-materials-grid">
              {materialsTestingServices.map((service, index) => (
                <div key={index} className="construction-material-card">
                  <div className="construction-material-icon">
                    {service.icon}
                  </div>
                  <h3 className="construction-material-title">{service.title}</h3>
                  <ul className="construction-material-list">
                    {service.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="construction-section construction-expertise-section">
          <div className="construction-container">
            <div className="construction-two-col">
              <div className="construction-image-card">
                <img
                  src={photo38}
                  alt="Materials Testing"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="construction-section-title">
                  Our Expertise & Capabilities
                </h2>
                <div className="construction-feature-list">
                  <div className="construction-feature-item">
                    <div className="construction-feature-icon purple">
                      <ClipboardList className="construction-icon-md" />
                    </div>
                    <div>
                      <h3 className="construction-feature-title">Comprehensive Testing Services</h3>
                      <p className="construction-feature-desc">
                        DGMTS offers quality assurance and quality control inspection and testing of earthwork, concrete, asphalt, and steel associated with the construction of roads, airports, buildings, and other civil infrastructure. Our expertise includes concrete, soil & aggregate, and asphalt testing, and inspection services for structural masonry, structural steel, sprayed-on fireproofing, exterior insulation and finishing systems (EIFS), including asphalt pavement evaluation and testing.
                      </p>
                    </div>
                  </div>
                  <div className="construction-feature-item">
                    <div className="construction-feature-icon blue">
                      <Wrench className="construction-icon-md" />
                    </div>
                    <div>
                      <h3 className="construction-feature-title">Advanced Testing Equipment</h3>
                      <p className="construction-feature-desc">
                        DGMTS has equipment for destructive & non-destructive concrete testing. We also provide inspection of various structural elements such as shallow and deep foundations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CMT Projects */}
        <ProjectsList
          title="Construction Materials Testing Projects"
          subtitle="Selected projects where we've provided comprehensive materials testing services"
          projects={cmtProjects}
        />

        {/* Special Inspection Projects */}
        <ProjectsList
          title="Special Inspection Projects"
          subtitle="Recent special inspection program projects throughout the Washington, DC area"
          projects={specialInspectionProjects}
        />
      </div>
    </div>
  );
};

export default ConstructionInspectionPage;
