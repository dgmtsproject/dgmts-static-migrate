import { useRef, useEffect } from 'react';
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
  Zap,
  Database,
  Briefcase,
  Megaphone
} from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import './ITDigitalServicesPage.css';
import HeroSection from '../../components/HeroSection';
import dataManagementSoftwarePicture from '../../assets/applications/dgmts-management-software.png';
import monitoringSoftwarePicture from '../../assets/applications/dgmts-monitoring-software.png';
import app1 from '../../assets/applications/1.png';
import app2 from '../../assets/applications/2.png';
import app3 from '../../assets/applications/3.png';
import app4 from '../../assets/applications/4.png';
import app5 from '../../assets/applications/5.png';

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

  // Do NOT hijack the mouse wheel here. Leave wheel scrolling to the page vertical scroll.

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

  // Add event listeners — only drag/ mouse interactions for horizontal scrolling
  target.addEventListener('mousedown', handleMouseDown);
    target.addEventListener('mouseleave', handleMouseLeave);
    target.addEventListener('mouseup', handleMouseUp);
    target.addEventListener('mousemove', handleMouseMove);

    return () => {
  target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mouseleave', handleMouseLeave);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const services = [
    {
      icon: <Code className="itds-service-icon" />,
  title: "Web & Mobile App Development",
  description: "Responsive web and mobile apps for field data capture, borehole logs, site photos, approvals, and on-site QA/QC.",
      backgroundImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <TrendingUp className="itds-service-icon" />,
      title: "Digital Marketing & SEO",
  description: "Industry-focused SEO and campaigns for engineering services—case studies, niches, and local ranking for tenders and clients.",
      backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Shield className="itds-service-icon" />,
  title: "Cybersecurity & Compliance",
  description: "Protect drawings, reports, and monitoring feeds with role-based access, audit trails, encryption, and secure backups.",
      backgroundImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <BarChart3 className="itds-service-icon" />,
      title: "Business Intelligence",
  description: "Dashboards for CPT/SPT trends, lab progress, instrumentation status, costs, and KPIs—turn project data into decisions.",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Cloud className="itds-service-icon" />,
  title: "Cloud & IT Consulting",
  description: "Cloud migration, networking, SSO, and infrastructure planning for project portals, data pipelines, and secure collaboration.",
      backgroundImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Database className="itds-service-icon" />,
      title: "Data Management",
  description: "Unify borehole, lab, GIS, and monitoring data. ETL, QA/QC rules, schema design, APIs, and integrations with existing tools.",
      backgroundImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=center"
    },
    {
      icon: <Briefcase className="itds-service-icon" />,
  title: "Custom Software & ERP Development",
  description: "Job costing, resource scheduling, procurement, document control, and approvals tailored to engineering operations."
    },
    {
      icon: <Smartphone className="itds-service-icon" />,
      title: "Real-time Instrument Monitoring",
  description: "Real-time feeds, thresholds and alarms, maps, and automated reports for piezos, inclinometers, strain gauges, and more."
    },
    {
      icon: <Palette className="itds-service-icon" />,
      title: "Brand Identity & UI/UX Design",
  description: "Engineering-focused brand systems, proposal/report templates, and intuitive dashboards that teams love to use."
    },
    {
      icon: <Megaphone className="itds-service-icon" />,
      title: "Content Creation & Ad Management",
  description: "Technical content, case studies, and targeted ads that speak to contractors, consultants, and authorities."
    }
  ];

  const portfolio = [
    {
      image: dataManagementSoftwarePicture,
      title: "DGMTS Management Software",
      category: "Data Management Platform",
      description: "DGMTS Management Dashboard is a smart business solution that streamlines operations, tracks projects, manages resources, and simplifies reporting—all in one place. Designed for efficiency and collaboration, it helps teams stay organized, boost productivity, and ensure smooth workflows across all company branches.",
      technologies: ["React", "Node.js","Express.js", "MongoDB", "AWS"]
    },
    {
      image: monitoringSoftwarePicture,
      title: "DGMTS Monitoring Software",
      category: "Data Monitoring Platform",
      description: "DGMTS Monitoring System is a powerful platform for real-time project monitoring, data visualization, and system alerts. It allows teams to manage projects, analyze data through interactive graphs, track alarms, and streamline file management—all from a centralized dashboard.",
      technologies: ["React", "Tailwind CSS","Django", "PostgreSQL", "Google Maps API"]
    },
    
  ];

  const features = [
    {
      icon: <Zap className="itds-feature-icon" />,
  title: "Built for Geotechnical Workflows",
  description: "Tools align with how engineers work—site investigation, monitoring, analysis, and reporting."
    },
    {
      icon: <Users className="itds-feature-icon" />,
  title: "Field-to-Office Continuity",
  description: "Seamless flow from field apps to cloud dashboards and deliverables—no double entry."
    },
    {
      icon: <Shield className="itds-feature-icon" />,
  title: "Security & Compliance",
  description: "Role-based access, auditability, backups, and best practices to keep project data safe."
    }
  ];

  return (
    <div className="itds-container">
      {/* Hero Section */}
      <HeroSection
  badge="Engineering-Focused Digital Solutions"
  title="Geotechnical IT & Digital Services"
  subtitle="Software, cloud, and data solutions built for geotechnical workflows—from field data capture to analysis, dashboards, and reporting."
        primaryButtonText="Discover Our Solutions"
        image1="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center"
        image2="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?cs=srgb&dl=pexels-luis-gomes-166706-546819.jpg&fm=jpg"
  imageAlt="Geotechnical software UI"
      />
      <div className='bg-texture'>
      {/* Services Carousel Section */}
      <section className="itds-services-section">
        <div className="itds-services-content">
          <div className="itds-services-horizontal-container" ref={carouselRef}>
            <div className="itds-services-intro-card">
              <div className="itds-services-intro-content">
                <h2 className="itds-services-main-title">
                  IT & Digital Services for Geotechnical Teams
                </h2>
                <p className="itds-services-main-description">
                  We design and deliver digital tools that fit engineering workflows—site investigation, instrumentation, lab testing, reporting, and project delivery. Our solutions are built to integrate seamlessly with existing processes, improving data accuracy, workflow efficiency, and collaboration across project teams. By connecting field and office operations through intuitive, purpose-built interfaces, we help engineers make faster, better-informed decisions throughout every stage of the project lifecycle.
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

      {/* Page Flip Applications Gallery */}
      <section className="itds-pageflip-section">
        <div className="itds-pageflip-content">
          <h2 className="itds-pageflip-title">Application Gallery</h2>
          <p className="itds-pageflip-subtitle">
            Browse through our developed applications with a page flip effect.
          </p>
          <div className="itds-pageflip-container">
            <HTMLFlipBook
              width={800}
              height={450}
              size="stretch"
              minWidth={600}
              maxWidth={1000}
              minHeight={338}
              maxHeight={563}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="itds-flip-book"
            >
              <div className="itds-page itds-page-cover">
                <div className="itds-cover-content">
                  <div className="itds-cover-icon">
                    <Code className="itds-cover-icon-svg" />
                  </div>
                  <h3 className="itds-cover-title">Our Applications</h3>
                  <p className="itds-cover-subtitle">Interactive Portfolio</p>
                  <div className="itds-cover-decoration">
                    <div className="itds-decoration-line"></div>
                    <div className="itds-decoration-dot"></div>
                    <div className="itds-decoration-line"></div>
                  </div>
                  <p className="itds-cover-description">Flip through to explore our innovative geotechnical software solutions</p>
                </div>
              </div>
              <div className="itds-page">
                <img src={app1} alt="Application 1" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={app2} alt="Application 2" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={app3} alt="Application 3" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={app4} alt="Application 4" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={app5} alt="Application 5" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={dataManagementSoftwarePicture} alt="DGMTS Management Software" className="itds-page-image" />
              </div>
              <div className="itds-page">
                <img src={monitoringSoftwarePicture} alt="DGMTS Monitoring Software" className="itds-page-image" />
              </div>
              <div className="itds-page itds-page-back-cover">
                <div className="itds-cover-content">
                  <div className="itds-cover-icon">
                    <Zap className="itds-cover-icon-svg" />
                  </div>
                  <h3 className="itds-cover-title">Thank You</h3>
                  <p className="itds-cover-subtitle">For Your Interest</p>
                  <div className="itds-cover-decoration">
                    <div className="itds-decoration-line"></div>
                    <div className="itds-decoration-dot"></div>
                    <div className="itds-decoration-line"></div>
                  </div>
                  <p className="itds-cover-description">Ready to transform your geotechnical workflows? Let's discuss your next project.</p>
                  <div className="itds-contact-hint">
                    <ArrowRight className="itds-contact-arrow" />
                    <span>Contact us below</span>
                  </div>
                </div>
              </div>
            </HTMLFlipBook>
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
              <h2 className="itds-cta-title">Ready to modernize your geotechnical workflows?</h2>
              <p className="itds-cta-description">Let&apos;s discuss your engineering software needs and the quickest wins we can deliver.</p>
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
          <svg width="388" height="500" viewBox="0 0 388 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.05" d="M203 -28.5L4.87819e-05 250.5L881.5 250.5L881.5 -28.5002L203 -28.5Z" fill="url(#paint0_linear_971_6910)"></path><defs><linearGradient id="paint0_linear_971_6910" x1="60.5" y1="111" x2="287" y2="111" gradientUnits="userSpaceOnUse"><stop offset="0.520507" stopColor="white"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></linearGradient></defs></svg>
        </span>
        <span className="itds-cta-deco itds-cta-deco-2" aria-hidden="true">
          <svg width="324" height="500" viewBox="0 0 324 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.05" d="M203 -28.5L4.87819e-05 250.5L881.5 250.5L881.5 -28.5002L203 -28.5Z" fill="url(#paint0_linear_971_6911)"></path><defs><linearGradient id="paint0_linear_971_6911" x1="60.5" y1="111" x2="287" y2="111" gradientUnits="userSpaceOnUse"><stop offset="0.520507" stopColor="white"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></linearGradient></defs></svg>
        </span>
        <span className="itds-cta-deco itds-cta-deco-3" aria-hidden="true">
          <svg width="43" height="56" viewBox="0 0 43 56" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><circle cx="40.9984" cy="1.49626" r="1.49626" transform="rotate(90 40.9984 1.49626)" fill="white"></circle><circle cx="27.8304" cy="1.49626" r="1.49626" transform="rotate(90 27.8304 1.49626)" fill="white"></circle><circle cx="14.6644" cy="1.49626" r="1.49626" transform="rotate(90 14.6644 1.49626)" fill="white"></circle><circle cx="1.49642" cy="1.49626" r="1.49626" transform="rotate(90 1.49642 1.49626)" fill="white"></circle><circle cx="40.9984" cy="14.6642" r="1.49626" transform="rotate(90 40.9984 14.6642)" fill="white"></circle><circle cx="27.8304" cy="14.6642" r="1.49626" transform="rotate(90 27.8304 14.6642)" fill="white"></circle><circle cx="14.6644" cy="14.6642" r="1.49626" transform="rotate(90 14.6644 14.6642)" fill="white"></circle><circle cx="1.49642" cy="14.6642" r="1.49626" transform="rotate(90 1.49642 14.6642)" fill="white"></circle><circle cx="40.9984" cy="27.8302" r="1.49626" transform="rotate(90 40.9984 27.8302)" fill="white"></circle><circle cx="27.8304" cy="27.8302" r="1.49626" transform="rotate(90 27.8304 27.8302)" fill="white"></circle><circle cx="14.6644" cy="27.8302" r="1.49626" transform="rotate(90 14.6644 27.8302)" fill="white"></circle><circle cx="1.49642" cy="27.8302" r="1.49626" transform="rotate(90 1.49642 27.8302)" fill="white"></circle><circle cx="40.9984" cy="40.9982" r="1.49626" transform="rotate(90 40.9984 40.9982)" fill="white"></circle><circle cx="27.8304" cy="40.9963" r="1.49626" transform="rotate(90 27.8304 40.9963)" fill="white"></circle><circle cx="14.6644" cy="40.9982" r="1.49626" transform="rotate(90 14.6644 40.9982)" fill="white"></circle><circle cx="1.49642" cy="40.9963" r="1.49626" transform="rotate(90 1.49642 40.9963)" fill="white"></circle><circle cx="40.9984" cy="54.1642" r="1.49626" transform="rotate(90 40.9984 54.1642)" fill="white"></circle><circle cx="27.8304" cy="54.1642" r="1.49626" transform="rotate(90 27.8304 54.1642)" fill="white"></circle><circle cx="14.6644" cy="54.1642" r="1.49626" transform="rotate(90 14.6644 54.1642)" fill="white"></circle><circle cx="1.49642" cy="54.1642" r="1.49626" transform="rotate(90 1.49642 54.1642)" fill="white"></circle></g>
          </svg>
        </span>
      </section>
      </div>
    </div>
  );
};

export default ITDigitalServicesPage;