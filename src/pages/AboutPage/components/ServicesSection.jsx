import React from 'react';
import { 
  Drill, 
  FlaskConical, 
  PenTool, 
  Activity, 
  ClipboardCheck,
  Scan
} from 'lucide-react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: <Drill className="service-icon" />,
      title: "Drilling",
      items: [
        "Drilling Supervision/Logger Services",
        "ATVs and Truck Mounted Drill Rigs",
        "Asphalt & Concrete Coring Machines",
        "Soil and Rock Coring",
        "HSA and Mud Rotary"
      ],
      color: "blue"
    },
    {
      icon: <FlaskConical className="service-icon" />,
      title: "Materials Testing",
      items: [
        "Soil, Asphalt, Concrete & Aggregate",
        "Laboratory Testing",
        "In-situ Testing"
      ],
      color: "green"
    },
    {
      icon: <PenTool className="service-icon" />,
      title: "Engineering Analysis and Design",
      items: [
        "Geo-Structure",
        "Geotechnical Engineering"
      ],
      color: "purple"
    },
    {
      icon: <Activity className="service-icon" />,
      title: "Instrumentation",
      items: [
        "PDA, Piezometers, Inclinometers",
        "Vibration, Noise & Crack Monitoring"
      ],
      color: "orange"
    },
    {
      icon: <ClipboardCheck className="service-icon" />,
      title: "Inspection",
      items: [
        "Third Party Inspection",
        "Special Inspection"
      ],
      color: "teal"
    },
    {
      icon: <Scan className="service-icon" />,
      title: "Non Destructive Testing",
      items: [
        "Ultrasonic Testing",
        "Magnetic Particle Testing",
        "Dye Penetrant Testing"
      ],
      color: "red"
    }
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">
            Comprehensive solutions for all your geotechnical and materials testing needs
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card ${service.color}`}>
              <div className="service-card-header">
                <div className={`service-icon-wrapper ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
              </div>
              <ul className="service-list">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="service-list-item">
                    <span className="service-bullet">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
