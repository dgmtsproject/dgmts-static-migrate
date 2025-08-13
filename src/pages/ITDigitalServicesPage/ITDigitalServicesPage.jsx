import React, { useState, useRef, useEffect } from 'react';
import './ITDigitalServicesPage.css';

const slides = [
  {
    image: 'https://placehold.co/600x320?text=Custom+Software',
    title: 'Custom Software Development',
    description: 'Tailor-made software solutions designed to optimize your business processes and enhance productivity.'
  },
  {
    image: 'https://placehold.co/600x320?text=Web+%26+Mobile+Apps',
    title: 'Web & Mobile Applications',
    description: "Responsive websites and mobile apps that boost your brand's online presence and user engagement."
  },
  {
    image: 'https://placehold.co/600x320?text=Digital+Marketing+%26+SEO',
    title: 'Digital Marketing & SEO',
    description: 'Data-driven marketing strategies and SEO optimization to increase visibility and attract more customers.'
  },
  {
    image: 'https://placehold.co/600x320?text=Client+Portal',
    title: 'Secure Client Portal Access',
    description: 'Access your project data, reports, and monitoring information through our secure DGMTS-imSite client portal with personalized login credentials.'
  },
  {
    image: 'https://placehold.co/600x320?text=Dashboard',
    title: 'Centralized Dashboard',
    description: 'Manage all your monitoring projects from a unified dashboard with easy access to files, alarms, and summaries.'
  },
  {
    image: 'https://placehold.co/600x320?text=Instrument+Monitoring',
    title: 'Real-time Instrument Monitoring',
    description: 'Monitor a wide range of instruments in real time with detailed graphs, alerts, and performance tracking.'
  },
  {
    image: 'https://placehold.co/600x320?text=Data+Visualization',
    title: 'Data Visualization & Analytics',
    description: 'Visualize and analyze collected data through interactive charts and automated reports for informed decisions.'
  }
];

const serviceBoxes = [
  {
    icon: '💻',
    title: 'Custom Software & ERP',
    desc: 'Tailored solutions to streamline business processes.'
  },
  {
    icon: '📱',
    title: 'Web & Mobile Apps',
    desc: 'Modern, responsive web and mobile platforms.'
  },
  {
    icon: '☁️',
    title: 'Cloud & IT Consulting',
    desc: 'Cloud migration, cybersecurity, and infrastructure planning.'
  },
  {
    icon: '📈',
    title: 'Digital Marketing & SEO',
    desc: 'Drive traffic with effective campaigns.'
  },
  {
    icon: '🎨',
    title: 'Brand Identity & UI/UX',
    desc: 'Crafting visual identities and intuitive interfaces.'
  },
  {
    icon: '📝',
    title: 'Content & Ad Management',
    desc: 'Engaging content and optimized ad strategies.'
  }
];

const techStack = [
  { name: 'React', icon: '⚛️' },
  { name: 'Node.js', icon: '🟩' },
  { name: 'Python', icon: '🐍' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Figma', icon: '🎨' },
  { name: 'MySQL', icon: '🗄️' },
  { name: 'WordPress', icon: '📰' }
];

export default function ITDigitalServicesPage() {
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
    <div className="itds-page">
      {/* Hero Slider Section */}
      <section className="itds-slider-section">
        <h2 className="itds-slider-title"><strong>Our Digital Solutions</strong></h2>
        <div className="itds-slider-container">
          <div className="itds-slides-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {slides.map((slide, i) => (
              <div className="itds-slide" key={i}>
                <img src={slide.image} alt={slide.title} />
                <div className="itds-slide-content">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="itds-controls">
            <button onClick={() => changeSlide(-1)} aria-label="Previous slide">&#10094;</button>
            <button onClick={() => changeSlide(1)} aria-label="Next slide">&#10095;</button>
          </div>
          <div className="itds-dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={i === activeIndex ? 'itds-active-dot' : ''}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Icon Boxes for Services */}
      <section className="itds-services-section">
        <div className="itds-section-header">
          <h2>Our Services</h2>
          <div className="itds-section-divider"></div>
        </div>
        <div className="itds-services-grid">
          {serviceBoxes.map((box, idx) => (
            <div className="itds-service-box" key={idx}>
              <div className="itds-service-icon">{box.icon}</div>
              <h4>{box.title}</h4>
              <p>{box.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="itds-why-section">
        <div className="itds-section-header">
          <h2>Why Choose Us?</h2>
          <div className="itds-section-divider"></div>
        </div>
        <ul className="itds-why-list">
          <li><span>🚀</span> Modern, scalable solutions for every business size</li>
          <li><span>🔒</span> Security-first approach to all digital services</li>
          <li><span>🤝</span> Dedicated support and transparent communication</li>
          <li><span>🎯</span> Results-driven strategies and measurable outcomes</li>
        </ul>
      </section>

      {/* Tech Stack Section */}
      <section className="itds-tech-section">
        <div className="itds-section-header">
          <h2>Our Tech Stack</h2>
          <div className="itds-section-divider"></div>
        </div>
        <div className="itds-tech-grid">
          {techStack.map((tech, idx) => (
            <div className="itds-tech-item" key={idx}>
              <span className="itds-tech-icon">{tech.icon}</span>
              <span className="itds-tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="itds-content-section">
        <div className="itds-content">
          <p>Our IT & Digital Services division is dedicated to providing innovative technology solutions that drive business growth, enhance digital presence, and streamline operations. With a focus on efficiency, security, and scalability, we offer a comprehensive suite of services tailored to meet the demands of modern businesses.</p>
          <p><strong>Custom Software & ERP Development</strong> – Tailored solutions to streamline business processes.</p>
          <p><strong>Web & Mobile App Development</strong> – Modern, responsive web and mobile platforms.</p>
          <p><strong>Cloud & IT Consulting</strong> – Cloud migration, cybersecurity, and infrastructure planning.</p>
          <p><strong>Digital Marketing & SEO</strong> – Drive traffic with effective campaigns.</p>
          <p><strong>Brand Identity & UI/UX Design</strong> – Crafting visual identities and intuitive interfaces.</p>
          <p><strong>Content Creation & Ad Management</strong> – Engaging content and optimized ad strategies.</p>
          <p>We&apos;re here to elevate your digital journey with end-to-end IT services.</p>
        </div>
        <div className="itds-buttons">
          <a href="/contact" className="itds-btn-primary">Contact Us</a>
        </div>
        <p className="itds-email-text">
          or email us at <a href="mailto:instrumentation@dullesgeotechnical.com">instrumentation@dullesgeotechnical.com</a>
        </p>
      </section>
    </div>
  );
}
