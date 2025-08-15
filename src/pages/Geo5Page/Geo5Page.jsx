import { useState, useRef, useEffect } from 'react';
import './Geo5Page.css';
import geo5Logo from '../../assets/logos/geo5-logo.png';
import geo1 from '../../assets/geo5-images/1-stability-min.png';
import geo2 from '../../assets/geo5-images/2-excavation-min.png';
import geo3 from '../../assets/geo5-images/3-shallow-foundation-min.png';
import geo4 from '../../assets/geo5-images/4-pile-foundation-min.png';
import geo5 from '../../assets/geo5-images/5-settlement-min.png';
import geo6 from '../../assets/geo5-images/6-retaining-wall-min.png';
import geo7 from '../../assets/geo5-images/7-tunnel-shaft-min.png';
import geo8 from '../../assets/geo5-images/8-geological-modelling-min.png';
import geo9 from '../../assets/geo5-images/9-survey-laboratory-min.png';

const slides = [
  {
    image: 'https://data.fine.cz/feature-carousel-image/intuitive-friendly-1.png',
    title: 'Intuitive Interface Top-Down Workflow',
    description: 'GEO5 programs have unified environment and intuitive top-down workflow.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/survey-to-design.png',
    title: 'From the Survey to the Advanced Design',
    description: 'GEO5 integrates geological data modeling with advanced geotechnical tasks.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/analytic-fem-1.png',
    title: 'Analytical Methods & FEM',
    description: 'GEO5 enables comparison of two independent solutions.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/geo5-geological-data-collector-app-stratigraphy-site-investigation-mobile.png',
    title: 'Mobile App for Borehole Logging',
    description: 'Collect geological data in the field and send it to the Stratigraphy program.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/bim.png',
    title: 'BIM Support',
    description: 'GEO5 export data to common BIM formats and share them with third-party programs.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/normy.png',
    title: 'Many Standards and Methods',
    description: 'GEO5 is a universal tool for engineers all over the world.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/reports.png',
    title: 'Comprehensive Outputs',
    description: 'GEO5 output reports can be easily edited or exported to PDF or MS Word formats.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/linked-together-1.png',
    title: 'Programs Linked Together',
    description: 'GEO5 enables to transfer data between individual programs.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/geo5_23_languages_feature.png',
    title: 'Output Report Languages',
    description: 'GEO5 generates output reports in variety of languages - useful for foreign projects.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/training-materials.png',
    title: 'Training Materials',
    description: 'Our tutorials and manuals guide you quickly through the programs.'
  },
  {
    image: 'https://data.fine.cz/feature-carousel-image/geo5_catalogs-of-manufacturers-concrete-retaining-blocks-steel-sheeting-profiles-geotechnical-software-2.png',
    title: 'Catalogs of Manufacturers',
    description: 'GEO5 contains catalogs of profiles, sheet piles, anchors, nails, geogrids and blocks.'
  },
  {
    image: '/assets/uploads/geo5-carousel-image-1.png',
    title: 'Advanced Slope Stability Analysis',
    description: 'GEO5 provides comprehensive slope stability verification with multiple calculation methods and detailed safety factor analysis.'
  },
  {
    image: '/assets/uploads/geo5-carousel-image-2.png',
    title: '3D Terrain Modeling & Visualization',
    description: 'Create detailed 3D models of terrain surfaces with integrated geological data for enhanced project visualization.'
  },
  {
    image: '/assets/uploads/geo5-carousel-image-3.png',
    title: 'Multi-Layer Geological Analysis',
    description: 'Analyze complex geological structures with detailed soil layer identification and comprehensive stability verification.'
  },
  {
    image: '/assets/uploads/geo5-carousel-image-4.png',
    title: 'Ground Loss & Settlement Analysis',
    description: 'Evaluate building damage risk and ground settlement effects with detailed damage assessment classifications.'
  }
];

const solutionCards = [
  {
    label: 'Stability Analysis',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/stability-analysis/',
    image: geo1,
    description: 'Slope and stability calculations to evaluate safety factors and potential failure mechanisms.'
  },
  {
    label: 'Excavation Design',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/excavation-design/',
    image: geo2,
    description: 'Design checks for excavations, bracing and staged construction to ensure safe temporary works.'
  },
  {
    label: 'Retaining Wall Design',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/walls-and-gabions/',
    image: geo6,
    description: 'Tools for designing retaining structures, walls and gabions with earth pressure analysis.'
  },
  {
    label: 'Shallow Foundations',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/shallow-foundations/',
    image: geo3,
    description: 'Bearing capacity and settlement checks for footings and shallow foundation systems.'
  },
  {
    label: 'Pile Foundations',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/deep-foundations/',
    image: geo4,
    description: 'Analysis and design of pile groups, individual piles and deep foundation systems.'
  },
  {
    label: 'Settlement Calculations',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/settlement-analysis/',
    image: geo5,
    description: 'Estimation of settlements and long-term consolidation effects on structures.'
  },
  {
    label: 'Tunnels and Shafts',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/tunnels-and-shafts/',
    image: geo7,
    description: 'Design support for tunnels, shafts and underground excavations, including lining checks.'
  },
  {
    label: 'Geological Modelling',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/stratigraphy/',
    image: geo8,
    description: 'Create and visualize geological layers and borehole data for informed subsurface models.'
  },
  {
    label: 'Geological Survey',
    url: 'https://www.finesoftware.eu/geotechnical-software/solutions/geological-survey/',
    image: geo9,
    description: 'Field data collection and survey tools for boreholes, lab results and site investigations.'
  },
];

export default function Geo5Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setActiveIndex(idx => (idx + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval.current);
  }, []);

  const goToSlide = idx => {
    setActiveIndex(idx);
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % slides.length);
    }, 5000);
  };

  const changeSlide = dir => {
    goToSlide((activeIndex + dir + slides.length) % slides.length);
  };

  return (
    <div className="geo5-page">
      <section className="geo5-hero">
        <div className="container">
          <div className="geo5-hero-content">
            <div className="geo5-hero-left">
              <img src={geo5Logo} alt="GEO5 Logo" className="geo5-logo" />
              <div className="geo5-hero-text">
                <h1 className="geo5-title">Geotechnical Software</h1>
                <p className="geo5-subtitle">From Geological Survey to Geotechnical Design</p>
                <div className="geo5-hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">25+</span>
                    <span className="stat-label">Programs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100K+</span>
                    <span className="stat-label">Users</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">190+</span>
                    <span className="stat-label">Countries</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="geo5-hero-video">
              <div className="video-container">
                <iframe 
                  width="536" 
                  height="315" 
                  src="https://www.youtube.com/embed/gTkKkcYSLAk?autoplay=1&mute=1&loop=1&playlist=gTkKkcYSLAk&controls=0" 
                  title="GEO5 Overview Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="geo5-distributor">
        <div className="container">
          <div className="distributor-layout">
            <div className="distributor-left">
              <div className="section-header">
                <h2>Authorized U.S. Distributor</h2>
                <div className="section-divider"></div>
              </div>
              <div className="geo5-description">
                <p><strong>DGMTS</strong> is proud to be an authorized distributor in the United States for <strong>GEO5</strong>, a cutting-edge geotechnical engineering software suite developed by <strong>Fine Software</strong>, as part of our technology solutions. <strong>GEO5</strong> is a user-friendly and powerful platform that covers the full scope of geotechnical analysis—from site investigation and soil profiling to the design of foundations, retaining structures, slopes, and underground works.</p>
                
                <p>As an <strong>authorized U.S. distributor, DGMTS</strong> provides <strong>sales, training, and technical support</strong> for GEO5, empowering engineering professionals to streamline workflows, reduce risk, and improve design quality. Whether you&apos;re working on small-scale projects or large infrastructure developments, GEO5 delivers the performance and confidence needed for successful geotechnical engineering outcomes.</p>
              </div>
            </div>
            
            <div className="distributor-right">
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <h4>Comprehensive Analysis</h4>
                  <p>Full scope geotechnical analysis from site investigation to design</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h4>User-Friendly Interface</h4>
                  <p>Intuitive modeling tools and robust computational methods</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌍</div>
                  <h4>International Standards</h4>
                  <p>Compliance with international design codes and standards</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎓</div>
                  <h4>Training & Support</h4>
                  <p>Complete sales, training, and technical support services</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="solutions-section">
            <div className="section-header">
              <h2>Geotechnical Solutions</h2>
              <div className="section-divider"></div>
            </div>
            <div className="geo5-cards">
              {solutionCards.map(card => (
                <a className="geo5-card" href={card.url} target="_blank" rel="noopener noreferrer" key={card.label} aria-label={card.label}>
                  <img src={card.image} alt={card.label} className="card-image" />
                  <div className="card-content">
                    <h4 className="card-title">{card.label}</h4>
                    <p className="card-description">{card.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="geo5-buttons">
            <a href="https://www.finesoftware.eu/geotechnical-software/solutions/" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Learn More
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="geo5-carousel-section">
        <div className="container">
          <div className="section-header">
            <h2>Key Features & Capabilities</h2>
            <div className="section-divider"></div>
          </div>
          <div className="geo5-carousel-container">
            <div className="geo5-slider-container">
              <div className="geo5-slides-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {slides.map((slide, i) => (
                  <div className="geo5-slide" key={i}>
                    <div className="slide-image-container">
                      <img src={slide.image} alt={slide.title} className="geo5-slide-img" />
                    </div>
                    <div className="geo5-slide-content">
                      <h3>{slide.title}</h3>
                      <p dangerouslySetInnerHTML={{ __html: slide.description }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="geo5-controls">
              <button onClick={() => changeSlide(-1)} aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button onClick={() => changeSlide(1)} aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            <div className="geo5-dots">
              {slides.map((_, i) => (
                <button 
                  key={i} 
                  className={`dot ${i === activeIndex ? 'active-dot' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
