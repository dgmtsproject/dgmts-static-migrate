import React from 'react';
import { 
  Drill, 
  Compass, 
  Layers, 
  Truck, 
  Wrench, 
  Users, 
  ArrowRight
} from 'lucide-react';
import './DrillingInSituTestingPage.css';

const DrillingInSituTestingPage = () => {
  const services = [
    {
      icon: <Drill className="drilling-icon-lg" />,
      title: "Drilling Supervision",
      description: "Supervision of drilling and Logger services."
    },
    {
      icon: <Layers className="drilling-icon-lg" />,
      title: "Soil Investigation Drilling",
      description: "Drilling for comprehensive soil investigation."
    },
    {
      icon: <Compass className="drilling-icon-lg" />,
      title: "In-Situ Coring",
      description: "In-site rock and asphalt coring services."
    },
    {
      icon: <Truck className="drilling-icon-lg" />,
      title: "Water Well Drilling",
      description: "Specialized water well drilling services."
    }
  ];

  return (
    <div className="drilling-page">
      {/* Hero Section */}
      <section className="drilling-hero">
        <div className="drilling-hero-content">
          <div className="drilling-hero-text">
            <h1 className="drilling-hero-title">
              Drilling & In-Situ Testing
            </h1>
            <p className="drilling-hero-subtitle">
              DGMTS provides services of supervision of drilling, Logger services, drilling for soil investigation, water well drilling and in-site rock and asphalt coring.
            </p>
            <button className="drilling-hero-cta">
              Learn More <ArrowRight className="drilling-arrow-icon" />
            </button>
          </div>
          <div className="drilling-hero-image-container">
            <img src="/assets/photo-49-75pJ_R5R.jpg" alt="Drilling and In-Situ Testing" 
            className="drilling-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="drilling-section">
        <div className="drilling-container">
          <div className="drilling-section-header">
            <h2 className="drilling-section-title">Our Capabilities</h2>
            <p className="drilling-section-subtitle">
              DGMTS owns and operates three drilling rigs and three drilling crews as well as coring equipment. Drill rig equipment is highly maintained and presently consists of one ATV CME 55, one ATV CME 45C and one truck mounted Mobile B56 drill rig.
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

      {/* Equipment and Team Section */}
      <section className="drilling-section white-bg">
        <div className="drilling-container">
          <div className="drilling-two-col">
            <div className="drilling-image-card">
              <img 
                src="/assets/photo-84-DjvvmQdE.jpg" 
                alt="Drilling Equipment"
              />
            </div>
            <div>
              <h2 className="drilling-section-title">
                Advanced Equipment & Expert Team
              </h2>
              <div className="drilling-feature-list">
                <div className="drilling-feature-item">
                  <div className="drilling-feature-icon green">
                    <Wrench className="drilling-icon-md" />
                  </div>
                  <div>
                    <h3 className="drilling-feature-title">Drilling Rigs & Equipment</h3>
                    <p className="drilling-feature-desc">
                      These rigs are capable of drilling up to 200 feet deep holes using hollow stem auger and mud rotary methods. All drill rigs are equipped with onboard water tanks with capacities ranging from 250-to-350-gallon. Additionally, our drill rigs are equipped with drilling fluid pumps for grouting, as well as for mud rotary drilling and/or rock coring. Our drilling department also has concrete and asphalt coring machines. Our support equipment includes service trucks, trailers, light towers, generators and welding equipment.
                    </p>
                  </div>
                </div>
                <div className="drilling-feature-item">
                  <div className="drilling-feature-icon blue">
                    <Users className="drilling-icon-md" />
                  </div>
                  <div>
                    <h3 className="drilling-feature-title">Experienced Team</h3>
                    <p className="drilling-feature-desc">
                      Each of our drill rigs is outfitted with state-of-the-art Automatic SPT Hammers for sampling the subsurface profile as drilling progresses. Our capabilities also extend to undisturbed sampling in soil and NQ core drilling in rock. Our drilling team members are highly professional, trained and experienced in various environments, ensuring the highest quality of service.
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

export default DrillingInSituTestingPage;
