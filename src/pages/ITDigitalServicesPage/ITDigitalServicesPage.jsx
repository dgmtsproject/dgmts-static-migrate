import React, { useRef, useEffect } from 'react';
import {
  Code,
  Smartphone,
  Cloud,
  Shield,
  TrendingUp,
  BarChart3,
  Users,
  Palette,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Headphones,
  Database,
  Briefcase,
  PenTool,
  Megaphone
} from 'lucide-react';
import './ITDigitalServicesPage.css';
import HeroSection from '../../components/HeroSection';

const ITDigitalServicesPage = () => {
  const carouselRef = useRef(null);
  const cardsRef = useRef(null);

  // Add horizontal scrolling with mouse wheel and drag functionality
  useEffect(() => {
    // choose target: on small screens, attach to cards track; otherwise attach to whole horizontal container
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
    const target = isMobile ? cardsRef.current : carouselRef.current;
    if (!target) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse wheel horizontal scrolling
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        target.scrollLeft += e.deltaY;
      }
    };

    // Drag to scroll functionality
    const handleMouseDown = (e) => {
      isDown = true;
      target.style.cursor = 'grabbing';
      startX = e.pageX - target.offsetLeft;
      scrollLeft = target.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      if (target) target.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      if (target) target.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - target.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      target.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    target.addEventListener('wheel', handleWheel, { passive: false });
    target.addEventListener('mousedown', handleMouseDown);
    target.addEventListener('mouseleave', handleMouseLeave);
    target.addEventListener('mouseup', handleMouseUp);
    target.addEventListener('mousemove', handleMouseMove);

    return () => {
      target.removeEventListener('wheel', handleWheel);
      target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mouseleave', handleMouseLeave);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const services = [
    {
      icon: <Code className="itds-service-icon" />,
      title: "Web & Mobile Development",
      description: "Custom web and mobile applications tailored to your business needs with modern frameworks and cutting-edge technology.",
      backgroundImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <TrendingUp className="itds-service-icon" />,
      title: "Digital Marketing & SEO",
      description: "Comprehensive digital marketing strategies to boost your online presence and drive meaningful engagement.",
      backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Shield className="itds-service-icon" />,
      title: "Cybersecurity Solutions",
      description: "Advanced security measures to protect your digital assets and ensure compliance with industry standards.",
      backgroundImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <BarChart3 className="itds-service-icon" />,
      title: "Business Intelligence",
      description: "Transform your data into actionable insights with powerful analytics and visualization tools.",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Cloud className="itds-service-icon" />,
      title: "Cloud Infrastructure",
      description: "Scalable cloud solutions that grow with your business and ensure high availability and performance.",
      backgroundImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Database className="itds-service-icon" />,
      title: "Data Management",
      description: "Comprehensive data solutions including migration, integration, and real-time processing systems.",
      backgroundImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Briefcase className="itds-service-icon" />,
      title: "Custom Software & ERP",
      description: "Bespoke software and ERP solutions for your specific requirements."
    },
    {
      icon: <Smartphone className="itds-service-icon" />,
      title: "Real-time Instrument Monitoring",
      description: "Live monitoring of your instruments and devices."
    },
    {
      icon: <Palette className="itds-service-icon" />,
      title: "Brand Identity & UI/UX Design",
      description: "Compelling brand identities and user-friendly interfaces."
    },
    {
      icon: <Megaphone className="itds-service-icon" />,
      title: "Content Creation & Ad Management",
      description: "Engaging content and effective ad campaigns to reach your audience."
    }
  ];

  const portfolio = [
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center",
      title: "HealthTracker Pro",
      category: "Healthcare Management Platform",
      description: "A comprehensive patient management system that streamlines appointment scheduling, medical records, and billing processes for healthcare providers.",
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop&crop=center",
      title: "EcoDelivery",
      category: "Sustainable Logistics Mobile App",
      description: "A green delivery platform that optimizes routes for minimal carbon footprint while connecting local businesses with eco-conscious consumers.",
      technologies: ["React Native", "Express.js", "PostgreSQL", "Google Maps API"]
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=center",
      title: "ManufactureFlow",
      category: "Industrial ERP System",
      description: "An integrated enterprise resource planning system designed for manufacturing companies to manage inventory, production, quality control, and supply chain operations.",
      technologies: ["Angular", "Spring Boot", "Oracle DB", "Apache Kafka"]
    },
    {
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop&crop=center",
        title: "InsightIQ Dashboard",
        category: "Business Intelligence Platform",
        description: "A powerful data analytics dashboard that transforms raw business data into actionable insights through interactive visualizations and predictive analytics.",
        technologies: ["Vue.js", "Python", "TensorFlow", "Elasticsearch"]
    }
  ];

  const features = [
    {
      icon: <Zap className="itds-feature-icon" />,
      title: "Innovative Solutions",
      description: "We leverage the latest technologies to deliver cutting-edge solutions that drive business growth."
    },
    {
      icon: <Users className="itds-feature-icon" />,
      title: "Client-Centric Approach",
      description: "Your success is our priority. We work closely with you to understand your needs and deliver tailored solutions."
    },
    {
      icon: <Shield className="itds-feature-icon" />,
      title: "Reliability & Security",
      description: "We build robust and secure applications, ensuring your data and systems are always protected."
    }
  ];

  return (
    <div className="itds-container">
      {/* Hero Section */}
      <HeroSection
        badge="Digital Innovation Solutions"
        title="Transforming Businesses with Technology"
        subtitle="We deliver innovative IT and digital solutions that empower your business to thrive in the digital age."
        primaryButtonText="Discover Our Solutions"
        image1="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center"
        image2="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?cs=srgb&dl=pexels-luis-gomes-166706-546819.jpg&fm=jpg"
        imageAlt="Modern UI"
      />

      {/* Services Carousel Section */}
      <section className="itds-services-section">
        <div className="itds-services-content">
          <div className="itds-services-horizontal-container" ref={carouselRef}>
            <div className="itds-services-intro-card">
              <div className="itds-services-intro-content">
                <h2 className="itds-services-main-title">
                  Our Full Range of Services
                </h2>
                <p className="itds-services-main-description">
                  We offer cutting-edge technology solutions, streamline business processes, 
                  and enhance digital experiences to drive your company forward.
                </p>
              </div>
            </div>
            
            {services.slice(0, 6).map((service, index) => (
              <div key={index} className="itds-service-carousel-card">
                <div className="itds-service-card-content">
                  <img 
                    src={service.backgroundImage} 
                    alt={service.title}
                    className="itds-service-card-bg-image"
                  />
                  <div className="itds-service-card-overlay"></div>
                  <div className="itds-service-card-icon">
                    {service.icon}
                  </div>
                  <div className="itds-service-card-text">
                    <h3 className="itds-service-card-title">{service.title}</h3>
                    <p className="itds-service-card-description">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="itds-portfolio-section">
        <div className="itds-portfolio-content">
            <div className="itds-portfolio-header">
                <h2 className="itds-portfolio-title">Our Developed Applications</h2>
                <p className="itds-portfolio-subtitle">
                    A glimpse into some of the innovative solutions we have delivered.
                </p>
            </div>
            <div className="itds-portfolio-grid">
                {portfolio.map((item, index) => (
                    <div key={index} className="itds-portfolio-card">
                        <div className="itds-portfolio-image-container">
                            <img src={item.image} alt={item.title} className="itds-portfolio-image" />
                        </div>
                        <div className="itds-portfolio-content">
                            <h3 className="itds-portfolio-item-title">{item.title}</h3>
                            <p className="itds-portfolio-category">{item.category}</p>
                            <p className="itds-portfolio-description">{item.description}</p>
                            
                            <div className="itds-portfolio-technologies">
                                <h4 className="itds-portfolio-tech-title">Technologies Used</h4>
                                <div className="itds-portfolio-tech-tags">
                                    {item.technologies.map((tech, techIndex) => (
                                        <span key={techIndex} className="itds-portfolio-tech-tag">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="itds-features-section">
        <div className="itds-features-content">
          <div className="itds-features-header">
            <h2 className="itds-features-title">Why Choose Us?</h2>
            <p className="itds-features-subtitle">
              The key benefits of partnering with us for your digital transformation.
            </p>
          </div>
          <div className="itds-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="itds-feature-card">
                <div className="itds-feature-icon-wrapper">{feature.icon}</div>
                <h3 className="itds-feature-title">{feature.title}</h3>
                <p className="itds-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="itds-cta-section">
        <div className="itds-cta-inner container">
          <div className="itds-cta-left">
            <div className="itds-cta-copy">
              <h2 className="itds-cta-title">Ready to Start Your Project?</h2>
              <p className="itds-cta-description">Let&apos;s connect and discuss how we can bring your vision to life.</p>
            </div>
          </div>
          <div className="itds-cta-right">
            <div className="itds-cta-action">
              <a className="itds-cta-btn" href="#contact">
                Contact Us <ArrowRight className="itds-arrow-icon" />
              </a>
            </div>
          </div>
        </div>

        <span className="itds-cta-deco itds-cta-deco-1" aria-hidden="true">
          <svg width="388" height="250" viewBox="0 0 388 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.05" d="M203 -28.5L4.87819e-05 250.5L881.5 250.5L881.5 -28.5002L203 -28.5Z" fill="url(#paint0_linear_971_6910)"></path><defs><linearGradient id="paint0_linear_971_6910" x1="60.5" y1="111" x2="287" y2="111" gradientUnits="userSpaceOnUse"><stop offset="0.520507" stopColor="white"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></linearGradient></defs></svg>
        </span>
        <span className="itds-cta-deco itds-cta-deco-2" aria-hidden="true">
          <svg width="324" height="250" viewBox="0 0 324 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.05" d="M203 -28.5L4.87819e-05 250.5L881.5 250.5L881.5 -28.5002L203 -28.5Z" fill="url(#paint0_linear_971_6911)"></path><defs><linearGradient id="paint0_linear_971_6911" x1="60.5" y1="111" x2="287" y2="111" gradientUnits="userSpaceOnUse"><stop offset="0.520507" stopColor="white"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></linearGradient></defs></svg>
        </span>
        <span className="itds-cta-deco itds-cta-deco-3" aria-hidden="true">
          <svg width="43" height="56" viewBox="0 0 43 56" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="40.9984" cy="1.49626" r="1.49626" transform="rotate(90 40.9984 1.49626)" fill="white"></circle><circle cx="27.8304" cy="1.49626" r="1.49626" transform="rotate(90 27.8304 1.49626)" fill="white"></circle><circle cx="14.6644" cy="1.49626" r="1.49626" transform="rotate(90 14.6644 1.49626)" fill="white"></circle><circle cx="1.49642" cy="1.49626" r="1.49626" transform="rotate(90 1.49642 1.49626)" fill="white"></circle><circle cx="40.9984" cy="14.6642" r="1.49626" transform="rotate(90 40.9984 14.6642)" fill="white"></circle><circle cx="27.8304" cy="14.6642" r="1.49626" transform="rotate(90 27.8304 14.6642)" fill="white"></circle><circle cx="14.6644" cy="14.6642" r="1.49626" transform="rotate(90 14.6644 14.6642)" fill="white"></circle><circle cx="1.49642" cy="14.6642" r="1.49626" transform="rotate(90 1.49642 14.6642)" fill="white"></circle><circle cx="40.9984" cy="27.8302" r="1.49626" transform="rotate(90 40.9984 27.8302)" fill="white"></circle><circle cx="27.8304" cy="27.8302" r="1.49626" transform="rotate(90 27.8304 27.8302)" fill="white"></circle><circle cx="14.6644" cy="27.8302" r="1.49626" transform="rotate(90 14.6644 27.8302)" fill="white"></circle><circle cx="1.49642" cy="27.8302" r="1.49626" transform="rotate(90 1.49642 27.8302)" fill="white"></circle><circle cx="40.9984" cy="40.9982" r="1.49626" transform="rotate(90 40.9984 40.9982)" fill="white"></circle><circle cx="27.8304" cy="40.9963" r="1.49626" transform="rotate(90 27.8304 40.9963)" fill="white"></circle><circle cx="14.6644" cy="40.9982" r="1.49626" transform="rotate(90 14.6644 40.9982)" fill="white"></circle><circle cx="1.49642" cy="40.9963" r="1.49626" transform="rotate(90 1.49642 40.9963)" fill="white"></circle><circle cx="40.9984" cy="54.1642" r="1.49626" transform="rotate(90 40.9984 54.1642)" fill="white"></circle><circle cx="27.8304" cy="54.1642" r="1.49626" transform="rotate(90 27.8304 54.1642)" fill="white"></circle><circle cx="14.6644" cy="54.1642" r="1.49626" transform="rotate(90 14.6644 54.1642)" fill="white"></circle><circle cx="1.49642" cy="54.1642" r="1.49626" transform="rotate(90 1.49642 54.1642)" fill="white"></circle></g>
          </svg>
        </span>
      </section>
    </div>
  );
};

export default ITDigitalServicesPage;