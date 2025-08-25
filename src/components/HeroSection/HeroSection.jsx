import React from 'react';
import './HeroSection.css';

const HeroSection = ({ 
  badge, 
  title, 
  subtitle, 
  primaryButtonText = "Get Started", 
  onPrimaryClick,
  children,
  image1,
  image2,
  imageAlt = "Hero Image"
}) => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-section">
            <div className="hero-text-content">
              {badge && (
                <span className="hero-badge">
                  <span className="hero-badge-dot"></span>
                  {badge}
                </span>
              )}
              <h1 className="hero-title">
                {title}
              </h1>
              <p className="hero-subtitle">
                {subtitle}
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={onPrimaryClick}
                  className="hero-btn-primary"
                >
                  {primaryButtonText}
                  <span className="hero-btn-arrow">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z" fill="white"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image-section">
            <div className="hero-image-container">
              <div className="hero-image-main">
                <img 
                  alt={imageAlt} 
                  loading="lazy" 
                  width="560" 
                  height="520" 
                  decoding="async" 
                  className="hero-image-primary" 
                  src={image1}
                />
              </div>
              <div className="hero-image-secondary">
                <img 
                  alt="Secondary Hero Image" 
                  loading="lazy" 
                  width="350" 
                  height="420" 
                  decoding="async" 
                  className="hero-image-secondary-img" 
                  src={image2}
                />
                <div className="hero-image-blur-bg"></div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
