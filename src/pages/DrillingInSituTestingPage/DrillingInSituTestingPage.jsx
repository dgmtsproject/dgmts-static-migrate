import React from 'react';
import {
  Drill,
  Compass,
  Layers,
  Truck,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle,
  Settings,
  Lightbulb
} from 'lucide-react';
import './DrillingInSituTestingPage.css';
import HeroSection from '../../components/HeroSection';
import ProjectsList from '../../components/ProjectsList';
import photo56 from '../../assets/gallery/photo-56.jpg';
import photo84 from '../../assets/gallery/photo-84.jpg';
import photo49 from '../../assets/gallery/photo-49.jpg';
import photo112 from '../../assets/gallery/photo-112.png';
import photo113 from '../../assets/gallery/photo-113.png';
import photo114 from '../../assets/gallery/photo-114.png';

const DrillingInSituTestingPage = () => {
  const handleLearnMoreClick = () => {
    const element = document.getElementById('scope-of-services');
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
      icon: <Drill className="drilling-icon-lg" />,
      title: "Supervision of Drilling",
      description: "Professional oversight and management of drilling operations."
    },
    {
      icon: <Layers className="drilling-icon-lg" />,
      title: "Logger Services",
      description: "Comprehensive logging and documentation services."
    },
    {
      icon: <Compass className="drilling-icon-lg" />,
      title: "Drilling for Soil Investigation",
      description: "Detailed subsurface exploration and soil analysis."
    },
    {
      icon: <Truck className="drilling-icon-lg" />,
      title: "Water Well Drilling",
      description: "Specialized water well drilling services."
    },
    {
      icon: <CheckCircle className="drilling-icon-lg" />,
      title: "Rock and Asphalt Coring",
      description: "Precision coring services for rock and asphalt materials."
    }
  ];

  const drillingProjects = [
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
      title: "South Capital Street Corridor Project",
      location: "Washington DC",
      owner: "DDOT",
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
    }
  ];

  return (
    <div className="drilling-page">
      {/* Hero Section */}
      <HeroSection
        badge="Professional Drilling Services"
        title="Drilling & In-Situ Testing"
        subtitle="DGMTS owns and operates three drilling rigs and three drilling crews as well as coring equipment. We provide comprehensive drilling services for soil investigation, water well drilling, and rock and asphalt coring."
        primaryButtonText="Learn More"
        onPrimaryClick={handleLearnMoreClick}
        image1={photo84}
        image2={photo49}
        imageAlt="Drilling and In-Situ Testing"
      />
      <div className='bg-texture'>
        {/* Services Grid */}
        <section className="drilling-section" id="scope-of-services">
          <div className="drilling-container">
            <div className="drilling-section-header">
              <h2 className="drilling-section-title">Our Scope of Services</h2>
              <p className="drilling-section-subtitle">
                DGMTS provides a comprehensive range of drilling and in-situ testing services to meet diverse project requirements across various sectors.
              </p>
            </div>

            <div className="drilling-service-grid">
              {services.map((service, index) => (
                <div key={index} className="drilling-service-card">
                  <div className="drilling-service-icon">
                    {service.icon}
                  </div>
                  <h3 className="drilling-service-title">{service.title}</h3>
                  <p className="drilling-service-desc">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Details Section */}
        <section className="drilling-section">
          <div className="drilling-container">
            <div className="drilling-section-header">
              <h2 className="drilling-section-title">State-of-the-Art Equipment</h2>
              <p className="drilling-section-subtitle">
                DGMTS drill rig equipment is highly maintained and presently consists of:
              </p>
            </div>

            <div className="drilling-service-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              <div className="drilling-equipment-card">
                <div className="drilling-equipment-image">
                  <img
                    src={photo113}
                    alt="ATV CME 55 Drilling Rig"
                    loading="lazy"
                  />
                </div>
                <div className="drilling-equipment-content">
                  <h3 className="drilling-equipment-title"> ATV CME 55</h3>
                  <p className="drilling-equipment-desc">
                    Advanced all-terrain vehicle mounted drilling rig for versatile applications and challenging terrain conditions.
                  </p>
                </div>
              </div>

              <div className="drilling-equipment-card">
                <div className="drilling-equipment-image">
                  <img
                    src={photo112}
                    alt="ATV CME 45C Drilling Rig"
                    loading="lazy"
                  />
                </div>
                <div className="drilling-equipment-content">
                  <h3 className="drilling-equipment-title"> ATV CME 45C</h3>
                  <p className="drilling-equipment-desc">
                    Compact and efficient drilling rig designed for challenging terrain and precise drilling operations.
                  </p>
                </div>
              </div>

              <div className="drilling-equipment-card">
                <div className="drilling-equipment-image">
                  <img
                    src={photo56}
                    alt="Truck Mounted Mobile B56 Drill Rig"
                    loading="lazy"
                  />
                </div>
                <div className="drilling-equipment-content">
                  <h3 className="drilling-equipment-title"> Truck Mounted Mobile B56 Drill Rig</h3>
                  <p className="drilling-equipment-desc">
                    Heavy-duty truck mounted rig for large-scale drilling operations and deep earth penetration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="drilling-section">
          <div className="drilling-container">
            <div className="drilling-two-col">
              <div>
                <h2 className="drilling-section-title">
                  Advanced Capabilities
                </h2>
                <div className="drilling-feature-list">
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon blue">
                      <Drill className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Deep Drilling Capacity</h3>
                      <p className="drilling-feature-desc">
                        These rigs are capable of drilling up to 200 feet deep holes using hollow stem auger and mud rotary methods. All drill rigs are equipped with onboard water tanks with capacities ranging from 250-to-350-gallon.
                      </p>
                    </div>
                  </div>
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon blue">
                      <CheckCircle className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Automatic SPT Hammers</h3>
                      <p className="drilling-feature-desc">
                        Each of our drill rigs is outfitted with state-of-the-art Automatic SPT Hammers for sampling the subsurface profile as drilling progresses. Our capabilities also extend to undisturbed sampling in soil and NQ core drilling in rock.
                      </p>
                    </div>
                  </div>
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon blue">
                      <Wrench className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Drilling Fluid Pumps & Coring</h3>
                      <p className="drilling-feature-desc">
                        Additionally, our drill rigs are equipped with drilling fluid pumps for grouting, as well as for mud rotary drilling and/or rock coring. Our drilling department also has concrete and asphalt coring machines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="drilling-image-card">
                <img
                  src={photo84}
                  alt="Drilling Operations"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Equipment Section */}
        <section className="drilling-section">
          <div className="drilling-container">
            <div className="drilling-two-col">
              <div className="drilling-image-card">
                <img
                  src={photo49}
                  alt="Support Equipment"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="drilling-section-title">
                  Comprehensive Support Equipment
                </h2>
                <p className="drilling-feature-desc" style={{ marginBottom: '1.5rem' }}>
                  Our support equipment ensures seamless operations across all project sites:
                </p>
                <div className="drilling-feature-list">
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon purple">
                      <Truck className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Service Trucks & Trailers</h3>
                      <p className="drilling-feature-desc">
                        Fully equipped service trucks and trailers for efficient equipment transport and on-site support.
                      </p>
                    </div>
                  </div>
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon purple">
                      <Lightbulb className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Light Towers & Generators</h3>
                      <p className="drilling-feature-desc">
                        Portable lighting and power generation equipment for extended operations and night work.
                      </p>
                    </div>
                  </div>
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon purple">
                      <Settings className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Welding Equipment</h3>
                      <p className="drilling-feature-desc">
                        On-site welding capabilities for immediate repairs and equipment modifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="drilling-section">
          <div className="drilling-container">
            <div className="drilling-two-col">
              <div>
                <h2 className="drilling-section-title">
                  Expert Drilling Team
                </h2>
                <div className="drilling-feature-list">
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon green">
                      <Users className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Professional Team Structure</h3>
                      <p className="drilling-feature-desc">
                        Our expert team of drilling professionals includes a highly experienced drilling manager, drilling coordinator, and three teams of drilling crew members. This team is equipped to handle various drilling operations, ensuring precision and safety in all projects.
                      </p>
                    </div>
                  </div>
                  <div className="drilling-feature-item">
                    <div className="drilling-feature-icon green">
                      <CheckCircle className="drilling-icon-md" />
                    </div>
                    <div>
                      <h3 className="drilling-feature-title">Highly Trained Professionals</h3>
                      <p className="drilling-feature-desc">
                        Our drilling team members are highly professional, trained and experienced in various environments, ensuring the highest quality of service. DGMTS has completed various drilling projects including drilling supervision for various public and private sectors in Virginia, Maryland and Washington DC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="drilling-image-card">
                <img
                  src={photo114}
                  alt="Drilling Team"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectsList
          title="Drilling Projects"
          subtitle="DGMTS has successfully completed various drilling projects for public and private sectors across Virginia, Maryland, and Washington DC."
          projects={drillingProjects}
        />
      </div>
    </div>
  );
};

export default DrillingInSituTestingPage;
