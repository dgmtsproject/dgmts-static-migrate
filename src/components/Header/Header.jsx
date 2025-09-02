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
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-content">
              {/* Company Info */}
              <div className="company-info">
                <Link to="/" className="logo-link">
                  <img src={logoImg} alt="DGMTS Logo" className="logo" />
                </Link>
                <div className="company-details">
                  <h1 className="company-name">
                    Dulles Geotechnical & Material Testing Services Inc.
                  </h1>
                  <p className="company-tagline">
                    A Certified SWaM and MBE/DBE Firm
                  </p>
                  <div className="certifications">
                    <img src={swamImg} alt="SWAM Certification" className="cert-logo" />
                    <img src={mbeImg} alt="MBE Certification" className="cert-logo" />
                    <img src={dbeImg} alt="DBE Certification" className="cert-logo" />
                  </div>
                </div>
              </div>

              {/* Partner Logo */}
              <div className="partner-logo">
                <img src={geo5Img} alt="Geo5 Authorized Partner" className="geo5-logo" />
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