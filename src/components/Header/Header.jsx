import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './Header.css';
import logoImg from '../../assets/logos/cropped-logo.png';
import swamImg from '../../assets/logos/swam.png';
import mbeImg from '../../assets/logos/mbe.png';
import dbeImg from '../../assets/logos/dbe.png';
import geo5Img from '../../assets/logos/geo5-logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            {/* Left: Logo + Company Info */}
            <div className="company-info">
              <Link to="/" className="logo-link">
                <img 
                  src={logoImg} 
                  alt="DGMTS Logo" 
                  className="logo"
                />
              </Link>
              <div className="company-details">
                <h1 className="company-name">
                  Dulles Geotechnical and Material Testing Services Inc.
                </h1>
                <p className="company-tagline">
                  A Certified SWaM and MBE/DBE Firm
                </p>
                <div className="certifications">
                  <img 
                    src={swamImg} 
                    alt="SWAM Certification" 
                    className="cert-logo"
                  />
                  <img 
                    src={mbeImg} 
                    alt="MBE Certification" 
                    className="cert-logo"
                  />
                  <img 
                    src={dbeImg} 
                    alt="DBE Certification" 
                    className="cert-logo"
                  />
                </div>
              </div>
            </div>

            {/* Right: Partner Logo */}
            <div className="partner-logo">
              <img 
                src={geo5Img} 
                alt="Geo5 Authorized Partner" 
                className="geo5-logo"
              />
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