import React from 'react';
import { 
  Drill, 
  FlaskConical, 
  Building, 
  Monitor, 
  ClipboardCheck,
  Search,
  Wrench
} from 'lucide-react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: <Drill className="service-icon" />,
      title: "Drilling",
      items: [
        'Mud Rotary and Hollow Stem Auger',
        'Standard Penetration Tests',
        'Undisturbed Samples',
        'Environmental Samples',
        'Rock Coring',
        'Piezometer Installation',
        'Inclinometer Installation',
        'Monitor Well Development',
        'Well Abandonment',
        'Concrete/Asphalt Coring',
        'Grouting',
        'Infiltration Testing',
        'Installation of Groundwater Monitoring Well'
      ],
      color: "blue"
    },
    
    {
      icon: <Building className="service-icon" />,
      title: "Geotechnical Engineering",
      items: [
        'Analysis and Design of Foundation',
        'Shallow Foundation',
        'Micropiles',
        'ACP',
        'H-Piles',
        'Driven Piles',
        'Drill Shaft',
        'Retaining Wall Design',
        'Slope Stability Analysis',
        'Pavement Design',
        'SOE Design'
      ],
      color: "purple"
    },
    {
      icon: <Monitor className="service-icon" />,
      title: "Instrumentation & IT Solutions",
      items: [
        'Vibration & Noise Recording',
        'Horizontal & Vertical Movement Monitoring',
        'Concrete Temperature Loggers',
        'Crack Monitoring',
        'Slopes Monitoring',
        'Settlement Plates',
        'Traditional & Advanced Sensing Technologies',
        'Piezometers',
        'Inclinometers',
        'Track Monitoring',
        'Remote Monitoring',
        'Automated Total Station (AMTS)',
        'Software, Cloud and Data Solutions'
      ],
      color: "orange"
    },
    {
      icon: <ClipboardCheck className="service-icon" />,
      title: "Construction Inspection & Material Testing",
      categories: [
        {
          name: 'Inspection & Testing',
          items: [
            'Soil & Aggregate',
            'Concrete, Asphalt',
            'Fireproofing',
            'Structural Masonry',
            'Structural Steel'
          ]
        },
        {
          name: 'Special Inspection',
          items: ['As per DCRA']
        },
        {
          name : 'Industry Specialization',
          items: [
            'FAA',
            'Building Envelope',
            'Pre-cast Plant Inspection']
        }
      ],
      color: "teal"
    },
    {
      icon: <Search className="service-icon" />,
      title: "In-Situ Testing",
      items: [
        'DCP Testing',
        'PDA Testing, CAPWAP and WEAP Analysis',
        'Windsor Probe',
        'Schmidt Hammer'
      ],
      color: "red"
    },
    {
      icon: <Wrench className="service-icon" />,
      title: "Unique Inspection & Testing",
      items: [
        'Anchor Bolt Load Testing',
        'Pullout Resistance',
        'Concrete Permeability Testing',
        'Pile Load Test Coordination',
        'Johnson Permeability Testing',
        'Bridge Drag Testing',
        'C-Factor Pipe Friction Testing'
      ],
      color: "orange"
    },
    {
      icon: <FlaskConical className="service-icon" />,
      title: "Laboratory Testing",
      categories: [
        {
          name: 'Soils & Aggregates',
          items: [
            'Natural Moisture Content',
            'Atterberg Limits',
            'pH',
            'Specific Gravity',
            'Particle Size Analysis',
            'Gradation',
            'Moisture Density Relationship',
            'Organic Content',
            'Shrink Swell Testing',
            'One-Dimensional Consolidation',
            'Direct and Residual Shear Test',
            'Unconfined and Triaxial Compression Testing',
            'Soil Corrosion Testing'
          ]
        },
        {
          name: 'Asphalt',
          items: [
            'Density of Asphalt Cores',
            'Extraction and Gradation',
            'Marshal Stability',
            'Unit Weight'
          ]
        },
        {
          name: 'Concrete',
          items: [
            'Compressive Strength Testing',
            'Tensile Strength Testing',
            'Concrete Mix-Design',
            'Concrete Permeability'
          ]
        }
      ],
      color: "green"
    },
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
              <div className="service-header">
                <div className={`icon-container ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
              </div>
              
              <div className="service-content">
                {service.categories ? (
                  service.categories.map((category, catIndex) => (
                    <div key={catIndex} className="service-category">
                      <h4 className="category-name">{category.name}</h4>
                      <div className="items-grid">
                        {category.items.map((item, itemIndex) => (
                          <span key={itemIndex} className="service-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="items-grid">
                    {service.items.map((item, itemIndex) => (
                      <span key={itemIndex} className="service-tag">{item}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;