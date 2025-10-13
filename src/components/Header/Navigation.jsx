import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Users, Briefcase, GalleryVertical, Mail, Map, CreditCard, Building, Construction, FlaskConical, Drill, Radar, Laptop, Server, Newspaper, Library, FolderOpen } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const megaMenuData = {
    company: {
      title: 'Company',
      sections: [
        {
          title: 'About Us',
          items: [
            { name: 'About DGMTS', path: '/about', icon: Users, description: 'Learn about our company history and mission' },
            // { name: 'Projects', path: '/projects', icon: FolderOpen, description: 'Explore our portfolio of successful projects' },
            { name: 'Careers', path: '/careers', icon: Briefcase, description: 'Join our team of professionals' },
            { name: 'Gallery', path: '/gallery', icon: GalleryVertical, description: 'View our project gallery' },
          ]
        },
        {
          title: 'Contact & Location',
          items: [
            { name: 'Contact Us', path: '/contact', icon: Mail, description: 'Get in touch with our team' },
            { name: 'Our Location', path: '/location', icon: Map, description: 'Find our office location' },
            { name: 'Payment Portal', path: '/payment', icon: CreditCard, description: 'Secure online payment system' },
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
    },
  
      knowledgeCenter: {
        title: 'Knowledge Center',
        sections: [
            {
                title: 'Resources',
                items: [
                    { name: 'Blog', path: '/blog', icon: Newspaper, description: 'Technical insights and guides' },
                    { name: 'Published Paper', path: '/published-papers', icon: Library, description: 'Contributions to the research community' },
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
            <Link to="/projects" className="desktop-nav-link">Projects</Link>
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
            <Link to="/geo5-software" className="desktop-nav-link">GEO5 Software</Link>
            <Link to="/it-services" className="desktop-nav-link">IT & Digital Services</Link>
            <Link to="/contact" className="desktop-nav-link">Contact</Link>
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
          <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;