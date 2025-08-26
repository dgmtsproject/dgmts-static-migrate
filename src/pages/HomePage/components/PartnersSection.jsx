import React from 'react';
import './PartnersSection.css';

const PartnersSection = () => {
  const partners = [
    {
      name: 'Virginia Department of Transportation',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://www.virginiadot.org'
    },
    {
      name: 'Washington Metropolitan Area Transit Authority',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://www.wmata.com'
    },
    {
      name: 'Maryland Department of Transportation',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://www.mdot.maryland.gov'
    },
    {
      name: 'District Department of Transportation',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://ddot.dc.gov'
    },
    {
      name: 'Metropolitan Washington Airport Authority',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://www.mwaa.com'
    },
    {
      name: 'Geo5 Software',
      logo: 'https://www.websiteessentials.com.au/wp-content/uploads/2023/03/logoipsum-logo-6.png',
      url: 'https://www.finesoftware.eu'
    }
  ];

  return (
    <section className="partners-section home-section bg-texture">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Partners & Clients</h2>
          <p className="section-subtitle">
            Trusted by leading organizations across the Mid-Atlantic region
          </p>
        </div>

        <div className="partners-carousel">
          <div className="partners-track">
            {/* First set of partners */}
            {partners.map((partner, index) => (
              <div key={`first-${index}`} className="partner-item">
                <div className="partner-logo">
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                      <img src={partner.logo} alt={partner.name} />
                    </a>
                  ) : (
                    <img src={partner.logo} alt={partner.name} />
                  )}
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <div key={`second-${index}`} className="partner-item">
                <div className="partner-logo">
                  {partner.url ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                      <img src={partner.logo} alt={partner.name} />
                    </a>
                  ) : (
                    <img src={partner.logo} alt={partner.name} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="partners-cta modern-cta">
          <div className="modern-cta-content">
            <h2 className="modern-cta-heading">Let&apos;s make DGMTS your next growth partner</h2>
            <ul className="modern-cta-list">
              <li><span className="checkmark" aria-hidden="true">&#10003;</span> Get better returns on your time &amp; money</li>
              <li><span className="checkmark" aria-hidden="true">&#10003;</span> Save 75% of your time per project</li>
            </ul>
            <div className="modern-cta-actions">
              <a href="/contact" className="btn btn-primary btn-lg modern-btn">Get access &rarr;</a>
              <a href="/contact" className="btn btn-secondary btn-lg modern-btn">Book a call</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;