import React from 'react';
import { ResponsiveHoneycomb, Hexagon } from 'react-honeycomb';
import './ClientsPage.css';

const ClientsPage = () => {
  // Complete list of clients with logos, some without logos (will use initials)
  const clients = [
    { name: 'AECOM', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0022_AECOM.png', category: 'engineering', hasLogo: true },
    { name: 'AKRF', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_AKRF.png', category: 'engineering', hasLogo: true },
    { name: 'Amazon', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Amazon.png', category: 'technology', hasLogo: true },
    { name: 'Arcadis', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0013_Arcadis-1.png', category: 'engineering', hasLogo: true },
    { name: 'BDI', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_BDI.png', category: 'engineering', hasLogo: true },
    { name: 'BHP', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_BHP.png', category: 'mining', hasLogo: true },
    { name: 'Brandt', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Brandt.png', category: 'construction', hasLogo: true },
    { name: 'Braun Intertec', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Braun-Intertec.png', category: 'engineering', hasLogo: true },
    { name: 'Chevron', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_Chevron.png', category: 'energy', hasLogo: true },
    { name: 'CDOT', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_CDOT.png', category: 'government', hasLogo: true },
    { name: 'Colliers', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Colliers.png', category: 'realestate', hasLogo: true },
    { name: 'DWRSC', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0004_DWRSC-1.png', category: 'government', hasLogo: true },
    { name: 'EXP', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_EXP.png', category: 'engineering', hasLogo: true },
    { name: 'Exxon Mobile', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Exxon-Mobile.png', category: 'energy', hasLogo: true },
    { name: 'FDOT', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_FDOT.png', category: 'government', hasLogo: true },
    { name: 'GEI', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0008_GEI.png', category: 'engineering', hasLogo: true },
    { name: 'Geocomp', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Geocomp.png', category: 'engineering', hasLogo: true },
    { name: 'Geosyntic', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_Geosyntic.png', category: 'engineering', hasLogo: true },
    { name: 'Gilbane', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Gilbane.png', category: 'construction', hasLogo: true },
    { name: 'Grupo Mexico', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Grupo-Mexico.png', category: 'mining', hasLogo: true },
    { name: 'GTR', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_GTRpng.png', category: 'engineering', hasLogo: true },
    { name: 'GZA', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0007_GZA.png', category: 'engineering', hasLogo: true },
    { name: 'Haley Aldrich', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0002_Haley-Aldrich.png', category: 'engineering', hasLogo: true },
    { name: 'HNTB', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0016_HNTB.png', category: 'engineering', hasLogo: true },
    { name: 'JACOBS', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0012_JACOBS-1.png', category: 'engineering', hasLogo: true },
    { name: 'Kiewit', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0011_Kiewit-1.png', category: 'construction', hasLogo: true },
    { name: 'Kimley Horn', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Kimley-Horn.png', category: 'engineering', hasLogo: true },
    { name: 'LADWP', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0005_LADWP.png', category: 'government', hasLogo: true },
    { name: 'Langan', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0015_Langan.png', category: 'engineering', hasLogo: true },
    { name: 'MDOT', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_MDOT.png', category: 'government', hasLogo: true },
    { name: 'Montrose Environmental', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Montrose-Environmental.png', category: 'environmental', hasLogo: true },
    { name: 'Mott Macdonald', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Mott-Macdonald.png', category: 'engineering', hasLogo: true },
    { name: 'MRCE', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_MRCE.png', category: 'engineering', hasLogo: true },
    { name: 'NBC', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_NBC.png', category: 'construction', hasLogo: true },
    { name: 'NIOSH', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0017_NIOSH.png', category: 'government', hasLogo: true },
    { name: 'NV5', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_NV5.png', category: 'engineering', hasLogo: true },
    { name: 'Parsons', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_Parsons.png', category: 'engineering', hasLogo: true },
    { name: 'PGE', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0014_PGE.png', category: 'energy', hasLogo: true },
    { name: 'Port Authority NYNJ', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Port-Authority-NYNJ.png', category: 'government', hasLogo: true },
    { name: 'Olsson', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Olsson.png', category: 'engineering', hasLogo: true },
    { name: 'Ramboll', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0019_Ramboll.png', category: 'engineering', hasLogo: true },
    { name: 'Rio Tinto', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_RioTinto.png', category: 'mining', hasLogo: true },
    { name: 'Roux', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0003_Roux.png', category: 'environmental', hasLogo: true },
    { name: 'Scnabel', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Scnabel.png', category: 'engineering', hasLogo: true },
    { name: 'Sevenson', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Sevenson.png', category: 'construction', hasLogo: true },
    { name: 'Shannon Wilson', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_Shannon-Wilson.png', category: 'engineering', hasLogo: true },
    { name: 'Sixense', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0006_Sixense.png', category: 'technology', hasLogo: true },
    { name: 'Skanska', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Skanska.png', category: 'construction', hasLogo: true },
    { name: 'SLR', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_SLR.png', category: 'environmental', hasLogo: true },
    { name: 'Socotec', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Socotec.png', category: 'engineering', hasLogo: true },
    { name: 'Stantec', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0001_Stantec.png', category: 'engineering', hasLogo: true },
    { name: 'Terracon', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0020_Terracon.png', category: 'engineering', hasLogo: true },
    { name: 'Tesla', logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0021_Tesla.png', category: 'technology', hasLogo: true },
    { name: 'Tetra Tech', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-tetra-tech.png', category: 'engineering', hasLogo: true },
    { name: 'Texas Univ', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_texas-univ.png', category: 'education', hasLogo: true },
    { name: 'TRC', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-TRC.png', category: 'engineering', hasLogo: true },
    { name: 'Trimble', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white-_0010_Trimble.png', category: 'technology', hasLogo: true },
    { name: 'Trinity Consultants', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-_Trinity-Consultants.png', category: 'environmental', hasLogo: true },
    { name: 'Turner', logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Turner.png', category: 'construction', hasLogo: true },
    { name: 'USACOE', logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_USACOE.png', category: 'government', hasLogo: true },
    // Adding clients without logos - using initials
    { name: 'Metropolitan Transit Authority', initials: 'MTA', category: 'government', hasLogo: false },
    { name: 'Infrastructure Group LLC', initials: 'IGL', category: 'engineering', hasLogo: false },
    { name: 'Coastal Engineering Partners', initials: 'CEP', category: 'engineering', hasLogo: false },
    { name: 'Urban Development Corp', initials: 'UDC', category: 'construction', hasLogo: false },
    { name: 'Regional Water Board', initials: 'RWB', category: 'government', hasLogo: false },
  ];

  // Function to get initials from company name
  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  // Function to get a color based on company name (for consistent colors)
  const getColorFromName = (name) => {
    // Return consistent color matching the front face of logo hexagons
    return 'transparent';
  };

  return (
    <div className="clients-page">
      {/* Hero Section */}
      <section className="clients-hero">
        <div className="">
          <div className="clients-hero-content">
            <h1 className="clients-hero-title">
              Building Tomorrow&apos;s Infrastructure
              <span className="highlight-text"> Together</span>
            </h1>
            <p className="clients-hero-subtitle">
              Partnering with industry leaders across engineering, construction, and technology sectors to deliver excellence in every project
            </p>
            <div className="clients-stats">
              <div className="stat-item">
                <div className="stat-number">{clients.length}+</div>
                <div className="stat-label">Trusted Partners</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honeycomb Grid Section */}
      <section className="clients-honeycomb-section">
        <div className="">
          <div className="honeycomb-container">
            <ResponsiveHoneycomb
              defaultWidth={1200}
              size={90}
              items={clients}
              renderItem={(client) => (
                <Hexagon className="hexagon-item">
                  <div className="hexagon-content">
                    {/* Front Face - Logo or Initials */}
                    <div className="hexagon-face hexagon-front">
                      {client.hasLogo ? (
                        <div className="logo-container">
                          <img 
                            src={client.logo} 
                            alt={client.name} 
                            loading="lazy"
                            className="client-logo"
                          />
                        </div>
                      ) : (
                        <div 
                          className="initials-container"
                          style={{ background: getColorFromName(client.name) }}
                        >
                          <span className="initials-text">
                            {client.initials || getInitials(client.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Back Face - Company Name */}
                    <div className="hexagon-face hexagon-back">
                      <div className="company-info">
                        <h3 className="company-name">{client.name}</h3>
                        <span className="company-category">{client.category}</span>
                      </div>
                    </div>
                  </div>
                </Hexagon>
              )}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="clients-cta-section">
        <div className="">
          <div className="clients-cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Join Our Network?</h2>
              <p className="cta-description">
                Partner with DGMTS and experience the difference that expertise, dedication, and innovation can make for your next project.
              </p>
              <div className="cta-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Industry-Leading Expertise</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Proven Track Record</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Collaborative Approach</span>
                </div>
              </div>
              <div className="cta-actions">
                <a href="/contact" className="btn btn-primary btn-lg">Start a Partnership</a>
                <a href="/about" className="btn btn-secondary btn-lg">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;
