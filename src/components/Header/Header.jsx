import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Header.css';
import logoImg from '../../assets/logos/cropped-logo.png';
import swamImg from '../../assets/logos/swam.png';
import mbeImg from '../../assets/logos/mbe.png';
import dbeImg from '../../assets/logos/dbe.png';
import geo5Img from '../../assets/logos/geo5-logo.png';

const Header = () => {
  // scroll behavior removed — header remains static

  return (
  <header className={`modern-header`}>
      {/* Hero Section */}
      <div className="header-hero">
        <div className="header-hero__container">
          {/* Main Content Row */}
          <div className="header-main">
            {/* Left: Main Logo */}
            <div className="header-brand">
              <Link to="/" className="brand-logo">
                <img src={logoImg} alt="DGMTS Logo" />
              </Link>
            </div>

            {/* Center: Company Info */}
            <div className="header-info">
              <h1 className="company-title">
                <span className="title-primary">Dulles Geotechnical</span>
                <span className="title-secondary">& Material Testing Services Inc.</span>
              </h1>
              <div className="company-subtitle">
                <div className="subtitle-line"></div>
                <span>Professional Engineering Excellence</span>
                <div className="subtitle-line"></div>
              </div>
              
              {/* Certifications below subtitle */}
              <div className="header-certifications">
                <div className="cert-badge">
                  <img src={swamImg} alt="SWAM Certification" />
                  <span>SWaM Certified</span>
                </div>
                <div className="cert-badge">
                  <img src={mbeImg} alt="MBE Certification" />
                  <span>MBE Certified</span>
                </div>
                <div className="cert-badge">
                  <img src={dbeImg} alt="DBE Certification" />
                  <span>DBE Certified</span>
                </div>
              </div>
            </div>

            {/* Right: Partner Logo */}
            <div className="header-partner">
              <div className="partner-badge">
                <span className="partner-label">Authorized Partner</span>
                <img src={geo5Img} alt="Geo5 Authorized Partner" />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="header-mobile">
            <div className="mobile-top">
              <Link to="/" className="mobile-logo">
                <img src={logoImg} alt="DGMTS Logo" />
              </Link>
              <div className="mobile-partner">
                <img src={geo5Img} alt="Geo5 Partner" />
              </div>
            </div>
            
            <div className="mobile-info">
              <h1 className="mobile-title">
                Dulles Geotechnical & Material Testing Services Inc.
              </h1>
              <p className="mobile-subtitle">Professional Engineering Excellence</p>
            </div>

            <div className="mobile-certifications">
              <img src={swamImg} alt="SWAM" />
              <img src={mbeImg} alt="MBE" />
              <img src={dbeImg} alt="DBE" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation />
    </header>
  );
};

export default Header;