import React from 'react';
import {
  FlaskConical,
  Award,
  Users,
  Settings,
  ArrowRight,
  CheckCircle,
  Microscope,
  Building2,
  ClipboardCheck
} from 'lucide-react';
import './LaboratoryTestingPage.css';
import HeroSection from '../../components/HeroSection';
import ProjectsList from '../../components/ProjectsList';
import photo77 from '../../assets/gallery/photo-77.jpg';
import photo86 from '../../assets/gallery/photo-86.jpg';
import photo64 from '../../assets/gallery/photo-64.jpg';

const LaboratoryTestingPage = () => {
  const services = [
    {
      icon: <Microscope className="lab-icon-lg" />,
      title: "Direct Shear Testing",
      description: "Peak and residual direct shear testing for soil analysis."
    },
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Consolidation Testing",
      description: "Comprehensive consolidation and permeability testing."
    },
    {
      icon: <CheckCircle className="lab-icon-lg" />,
      title: "Soil Index Testing",
      description: "Moisture/density testing and complete soil classification."
    },
    {
      icon: <FlaskConical className="lab-icon-lg" />,
      title: "Material Testing",
      description: "Testing for concrete, asphalt, aggregate, and water analysis."
    },
    {
      icon: <Settings className="lab-icon-lg" />,
      title: "Corrosivity Testing",
      description: "Water analysis and corrosivity testing services."
    }
  ];

  const labProjects = [
    {
      title: "Transform I-66-Outside the Beltway",
      location: "Virginia",
      owner: "VDOT",
      client: "Intertek-PSI"
    },
    {
      title: "Purple Line",
      location: "Bethesda, Maryland (MDOT-MTA)",
      owner: "MDOT-MTA",
      client: "Intertek-ECS"
    },
    {
      title: "Harry Nice Middleton Bridge",
      location: "Newburg, Maryland (MDTA)",
      owner: "MDTA",
      client: "Intertek-SKANSKA"
    },
    {
      title: "I-64 Hampton Roads Express Lanes (HREL) Segment A",
      location: "Virginia",
      owner: "VDOT",
      client: "Terracon"
    },
    {
      title: "I-64 and I-464 Interchange Exit 291 Ramp Improvements",
      location: "Chesapeake, Virginia",
      owner: "VDOT",
      client: "Intertek-PSI"
    },
    {
      title: "American Legion Bridge I-270 to I-70",
      location: "Maryland",
      owner: "MDOT",
      client: "Halmar-FCC JV"
    },
    {
      title: "VRE Springfield / Franconia Station",
      location: "Virginia",
      owner: "VDOT",
      client: "HDR Inc."
    }
  ];

  return (
    <div className="lab-page">
      {/* Hero Section */}
      <HeroSection
        badge="Professional Laboratory Services"
        title="Laboratory Testing"
        subtitle="Dulles Geotechnical and Materials Testing Services (DGMTS) provides independent construction materials testing at our two in-house testing laboratory facilities in Chantilly and Hampton, ensuring efficiency and cost savings for our clients."
        primaryButtonText="Our Services"
        image1={photo77}
        image2={photo86}
        imageAlt="Laboratory Testing"
      />
      <div className='bg-texture'>
        {/* Services Grid */}
        <section className="lab-section">
          <div className="lab-container">
            <div className="lab-section-header">
              <h2 className="lab-section-title">Our Testing Services</h2>
              <p className="lab-section-subtitle">
                Our laboratory offers a full suite of geotechnical and material testing services to ensure the integrity and performance of soils and construction materials.
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

        {/* Accreditation Section */}
        <section className="lab-section">
          <div className="lab-container">
            <div className="lab-section-header">
              <h2 className="lab-section-title">Accreditation & Standards</h2>
              <p className="lab-section-subtitle">
                Our commitment to excellence is reflected in our accreditations and operational efficiency.
              </p>
            </div>

            <div className="lab-accreditation-grid">
              <div className="lab-accreditation-card lab-accent-green">
                <div className="lab-accreditation-icon">
                  <Award className="lab-icon-lg" />
                </div>
                <h3 className="lab-accreditation-title">Industry Accreditation</h3>
                <p className="lab-accreditation-desc">
                  Our laboratories are accredited by the American Association of State Highway and Transportation Officials (AASHTO) and we are members of the Washington Area Council of Engineering Laboratories, Inc. (WACEL). Our accreditation conforms to the requirements of ASTM D3740, ASTM E329, and AASHTO R-18.
                </p>
              </div>

              <div className="lab-accreditation-card lab-accent-blue">
                <div className="lab-accreditation-icon">
                  <ClipboardCheck className="lab-icon-lg" />
                </div>
                <h3 className="lab-accreditation-title">Efficient Operations</h3>
                <p className="lab-accreditation-desc">
                  In response to the fast-paced nature of today's projects, we strive to keep operations running smoothly and efficiently through electronic report transmittals and a unique laboratory database management system.
                </p>
              </div>

              <div className="lab-accreditation-card lab-accent-purple">
                <div className="lab-accreditation-icon">
                  <Building2 className="lab-icon-lg" />
                </div>
                <h3 className="lab-accreditation-title">One-Stop Shop Solution</h3>
                <p className="lab-accreditation-desc">
                  DGMTS is a one-stop shop for all construction material testing solutions. We have partnerships with other accredited laboratories to utilize their services for any tests not performed in-house, ensuring comprehensive support for all your testing needs. We can setup an additional laboratory near the project site.
                </p>
              </div>
            </div>

            
          </div>
        </section>

        {/* Equipment Section */}
        <section className="lab-section">
          <div className="lab-container">
            <div className="lab-two-col">
              <div>
                <h2 className="lab-section-title">
                  Advanced Laboratory Equipment
                </h2>
                <p className="lab-feature-desc" style={{ marginBottom: '1.5rem' }}>
                  DGMTS laboratories are fully equipped with all necessary equipment to perform several tests on disturbed and un-disturbed soil samples, aggregate, concrete, asphalt, water analysis, and corrosivity testing.
                </p>
                <div className="lab-feature-list">
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon green">
                      <CheckCircle className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Soil Testing Equipment</h3>
                      <p className="lab-feature-desc">
                        We have seven proctor and CBR equipment sets, enabling us to perform multiple tests simultaneously and ensure quick turnaround times.
                      </p>
                    </div>
                  </div>
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon green">
                      <CheckCircle className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Consolidation & Shear Testing</h3>
                      <p className="lab-feature-desc">
                        Three consolidation test equipment sets and direct shear test equipment for comprehensive soil behavior analysis.
                      </p>
                    </div>
                  </div>
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon green">
                      <CheckCircle className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Compression Testing</h3>
                      <p className="lab-feature-desc">
                        Three compression machines for concrete and material strength testing, ensuring accurate and reliable results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lab-image-card">
                <img
                  src={photo64}
                  alt="Laboratory Equipment"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Staff Section */}
        <section className="lab-section">
          <div className="lab-container">
            <div className="lab-two-col">
              <div className="lab-image-card">
                <img
                  src={photo77}
                  alt="Laboratory Staff"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="lab-section-title">
                  Professional Laboratory Team
                </h2>
                <p
                  className='lab-feature-desc'
                >Our laboratory’s strength lies in its skilled and well-structured team dedicated to maintaining the highest standards of testing and analysis.</p>
                <div className="lab-feature-list">
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon blue">
                      <Users className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Expert Management</h3>
                      <p className="lab-feature-desc">
                        Our professional laboratory team comprises of one Laboratory Director, two highly experienced Laboratory Managers, and six laboratory Technicians.
                      </p>
                    </div>
                  </div>
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon blue">
                      <CheckCircle className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Certified Technicians</h3>
                      <p className="lab-feature-desc">
                        Our certified field and laboratory technicians have extensive experience across various sectors, including retail, commercial, hospitality, healthcare, energy, and transportation projects such as highways, bridges, and aviation. They are proficient in sampling and testing protocols for a wide range of materials.
                      </p>
                    </div>
                  </div>
                  <div className="lab-feature-item">
                    <div className="lab-feature-icon blue">
                      <Users className="lab-icon-md" />
                    </div>
                    <div>
                      <h3 className="lab-feature-title">Flexible Staffing</h3>
                      <p className="lab-feature-desc">
                        We have the flexibility to hire additional staff as needed to meet project demands and ensure timely completion of all testing services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectsList
          title="Laboratory Testing Projects"
          subtitle="DGMTS laboratories conducted testing for various mega projects across the region."
          projects={labProjects}
        />
      </div>
    </div>
  );
};

export default LaboratoryTestingPage;
