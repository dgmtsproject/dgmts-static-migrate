import  { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Company',
      path: '#',
      dropdown: [
        { name: 'About', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact', path: '/contact' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Location', path: '/location' }
      ]
    },
    {
      name: 'Engineering Services',
      path: '#',
        dropdown: [
          { name: 'Geotechnical Engineering', path: '/services/geotechnical' },
          { name: 'Construction Inspection and Testing', path: '/services/construction-inspection-testing' },
          { name: 'Drilling and In-situ Testing', path: '/services/drilling-in-situ-testing' },
          { name: 'Laboratory Testing', path: '/services/laboratory-testing' },
          { name: 'Instrumentation and Condition Surveys', path: '/services/instrumentation-condition-surveys' }
        ]
    },
    {
      name: 'Knowledge Center',
      path: '#',
      dropdown: [
        { name: 'Blog & Published Papers', path: '/knowledge/blog' },
        { name: 'Technical Resources', path: '/knowledge/resources' }
      ]
    },
  // ...existing code...
    { name: 'Payment', path: '/payment' },
    { name: 'Geo5 Software', path: '/geo5-software' },
    { name: 'IT & Digital Services', path: '/it-services' }
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-wrapper">
          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Menu */}
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {navigationItems.map((item, index) => (
              <li 
                key={index} 
                className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button 
                      className="nav-link dropdown-toggle"
                      onClick={() => handleDropdownToggle(index)}
                    >
                      {item.name}
                      <svg 
                        className={`dropdown-arrow ${activeDropdown === index ? 'rotate' : ''}`}
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16"
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </button>
                    <ul className={`dropdown-menu ${activeDropdown === index ? 'active' : ''}`}>
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <li key={dropdownIndex} className="dropdown-item">
                          <Link 
                            to={dropdownItem.path} 
                            className="dropdown-link"
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={item.path} 
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;