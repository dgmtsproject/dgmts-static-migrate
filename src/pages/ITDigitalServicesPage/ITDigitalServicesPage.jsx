import React from 'react';
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

const ITDigitalServicesPage = () => {
  const services = [
    {
      icon: <Code className="itds-service-icon" />,
      title: "Web & Mobile App Development",
      description: "Custom web and mobile applications tailored to your business needs."
    },
    {
      icon: <TrendingUp className="itds-service-icon" />,
      title: "Digital Marketing & SEO",
      description: "Strategies to boost your online presence and search engine ranking."
    },
    {
      icon: <Shield className="itds-service-icon" />,
      title: "Secure Client Portal Access",
      description: "Secure portals for clients to access their data and services."
    },
    {
      icon: <BarChart3 className="itds-service-icon" />,
      title: "Centralized Dashboards",
      description: "Unified dashboards for a complete overview of your business."
    },
    {
      icon: <Smartphone className="itds-service-icon" />,
      title: "Real-time Instrument Monitoring",
      description: "Live monitoring of your instruments and devices."
    },
    {
      icon: <Database className="itds-service-icon" />,
      title: "Data Visualization & Analytics",
      description: "In-depth data analysis and visualization for informed decisions."
    },
    {
      icon: <Briefcase className="itds-service-icon" />,
      title: "Custom Software & ERP",
      description: "Bespoke software and ERP solutions for your specific requirements."
    },
    {
      icon: <Cloud className="itds-service-icon" />,
      title: "Cloud & IT Consulting",
      description: "Expert advice on cloud adoption and IT infrastructure."
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
      <section className="itds-hero">
        <div className="itds-hero-content">
          <div className="itds-hero-text">
            <h1 className="itds-hero-title">Transforming Businesses with Technology</h1>
            <p className="itds-hero-subtitle">
              We deliver innovative IT and digital solutions that empower your business to thrive in the digital age.
            </p>
            <button className="itds-hero-cta">
              Discover Our Solutions <ArrowRight className="itds-arrow-icon" />
            </button>
          </div>
          <div className="itds-hero-image-container">
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center" alt="Modern UI" className="itds-hero-image" />
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="itds-services-section">
        <div className="itds-services-content">
          <div className="itds-services-header">
            <h2 className="itds-services-title">Our Full Range of Services</h2>
            <p className="itds-services-subtitle">
              A comprehensive suite of services to meet all your IT and digital needs.
            </p>
          </div>
          <div className="itds-services-grid">
            {services.map((service, index) => (
              <div key={index} className="itds-service-card">
                <div className="itds-service-icon-wrapper">
                  {service.icon}
                </div>
                <h3 className="itds-service-title">{service.title}</h3>
                <p className="itds-service-description">{service.description}</p>
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
                            <h3 className="itds-portfolio-title">{item.title}</h3>
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
        <div className="itds-cta-content">
          <h2 className="itds-cta-title">Ready to Start Your Project?</h2>
          <p className="itds-cta-description">
            Let's connect and discuss how we can bring your vision to life.
          </p>
          <button className="itds-cta-btn">
            Contact Us <ArrowRight className="itds-arrow-icon" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ITDigitalServicesPage;