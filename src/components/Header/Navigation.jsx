import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Users, Briefcase, GalleryVertical, Mail, Map, CreditCard, Building, Construction, FlaskConical, Drill, Radar, Laptop, Server, Newspaper, Library, FolderOpen, UserCircle, CalendarDays } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const megaMenuData = {
    aboutUs: {
      title: 'About Us',
      sections: [
        {
          title: 'About Us',
          items: [
            { name: 'Company History and Mission', path: '/about', icon: Users, description: 'Learn about our company history and mission' },
            { name: 'Gallery', path: '/gallery', icon: GalleryVertical, description: 'View our project gallery' },
            { name: 'Our Offices', path: '/location', icon: Map, description: 'Find our office location' },
          ]
        },
        {
          title: 'Knowledge Center',
          items: [
            { name: 'Engineering Updates', path: '/blog', icon: Newspaper, description: 'Technical insights and guides' },
            { name: 'Published Papers', path: '/published-papers', icon: Library, description: 'Contributions to the research community' },
            { name: 'Events & Workshops', path: '/events', icon: CalendarDays, description: 'Upcoming events and workshops' },
          ]
        }
      ]
    },
    services: {
      title: 'Engineering Services',
      sections: [
        {
          title: 'Core Services',
          items: [
            { name: 'Geotechnical Engineering', path: '/services/geotechnical', icon: Building, description: 'Comprehensive geotechnical analysis' },
            { name: 'Construction Inspection & Testing', path: '/services/construction-inspection-testing', icon: Construction, description: 'Quality assurance for construction projects' },
            { name: 'Laboratory Testing', path: '/services/laboratory-testing', icon: FlaskConical, description: 'Advanced material testing capabilities' },
          ]
        },
        {
          title: 'Specialized Services',
          items: [
            { name: 'Drilling & In-situ Testing', path: '/services/drilling-in-situ-testing', icon: Drill, description: 'Field testing and drilling services' },
            { name: 'Instrumentation & Surveys', path: '/services/instrumentation-condition-surveys', icon: Radar, description: 'Monitoring and condition assessment' },
          ]
        }
      ]
    }
  };

  const handleMegaMenuEnter = (menuKey) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMegaMenu(menuKey);
  };

  const handleMegaMenuLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setActiveMegaMenu(null);
      closeTimer.current = null;
    }, 160);
  };

  const closeTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="mega-menu-nav">
      <div className="mega-menu-container">
        <div className="mega-menu-inner">
            {/* Desktop Navigation */}
          <div className="desktop-nav">
            <Link to="/" className="desktop-nav-link">Home</Link>
            {Object.entries(megaMenuData).map(([key, menu]) => (
              <div
                key={key}
                className="mega-menu-item"
                onMouseEnter={() => handleMegaMenuEnter(key)}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button className={`mega-menu-button ${activeMegaMenu === key ? 'active' : ''}`}>
                  <span>{menu.title}</span>
                  <ChevronDown />
                </button>
                
                {/* Mega Menu Dropdown */}
                {activeMegaMenu === key && (
                  <div
                    className={`mega-menu-dropdown ${key === 'solutions' || key === 'knowledgeCenter' ? 'mega-menu-dropdown--narrow' : ''}`}
                    onMouseEnter={() => {
                      if (closeTimer.current) {
                        clearTimeout(closeTimer.current);
                        closeTimer.current = null;
                      }
                    }}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className="mega-menu-grid">
                      {menu.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mega-menu-section">
                          <h3>{section.title}</h3>
                          <div className="space-y-3">
                            {section.items.map((item, itemIndex) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={itemIndex}
                                  to={item.path}
                                  className="mega-menu-link"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  <Icon />
                                  <div className="mega-menu-link-content">
                                    <div className="title">{item.name}</div>
                                    <div className="description">{item.description}</div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link to="/it-services" className="desktop-nav-link">IT & Digital Services</Link>
            <Link to="/geo5-software" className="desktop-nav-link">GEO5 Software</Link>
            <Link to="/pile-driving" className="desktop-nav-link">Pile Driving Software</Link>
            <Link to="/clients" className="desktop-nav-link">Our Clients</Link>
            <Link to="/projects" className="desktop-nav-link">Our Projects</Link>
            <Link to="/contact" className="desktop-nav-link">Contact Us</Link>
            <Link to="/careers" className="desktop-nav-link">Careers</Link>
            <Link to="/payment" className="desktop-nav-link">Payment</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav-actions">
            <div className="mobile-menu-button">
              <button onClick={toggleMobileMenu} aria-label="Toggle menu">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          
          {Object.entries(megaMenuData).map(([key, menu]) => (
            <div key={key} className="mobile-menu-section">
              <h3 className="mobile-menu-title">{menu.title}</h3>
              <div className="mobile-menu-sublist">
                {menu.sections.flatMap(section => section.items).map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className="mobile-menu-sublink"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <Link to="/it-services" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>IT & Digital Services</Link>
          <Link to="/geo5-software" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>GEO5 Software</Link>
          <Link to="/clients" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Clients</Link>
          <Link to="/projects" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Projects</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          <Link to="/careers" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Careers</Link>
          <Link to="/payment" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Payment</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;