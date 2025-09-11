import React, { useEffect, useRef } from 'react';
import './PartnersSection.css';

const PartnersSection = () => {
  const partners = [
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0022_AECOM.png', name: 'AECOM' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_AKRF.png', name: 'AKRF' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Amazon.png', name: 'Amazon' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0013_Arcadis-1.png', name: 'Arcadis' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_BDI.png', name: 'BDI' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_BHP.png', name: 'BHP' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Brandt.png', name: 'Brandt' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Braun-Intertec.png', name: 'Braun Intertec' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_Chevron.png', name: 'Chevron' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_CDOT.png', name: 'CDOT' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Colliers.png', name: 'Colliers' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0004_DWRSC-1.png', name: 'DWRSC' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_EXP.png', name: 'EXP' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Exxon-Mobile.png', name: 'Exxon Mobile' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_FDOT.png', name: 'FDOT' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0008_GEI.png', name: 'GEI' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Geocomp.png', name: 'Geocomp' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_Geosyntic.png', name: 'Geosyntic' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Gilbane.png', name: 'Gilbane' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Grupo-Mexico.png', name: 'Grupo Mexico' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_GTRpng.png', name: 'GTR' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0007_GZA.png', name: 'GZA' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0002_Haley-Aldrich.png', name: 'Haley Aldrich' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0016_HNTB.png', name: 'HNTB' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0012_JACOBS-1.png', name: 'JACOBS' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0011_Kiewit-1.png', name: 'Kiewit' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Kimley-Horn.png', name: 'Kimley Horn' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0005_LADWP.png', name: 'LADWP' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0015_Langan.png', name: 'Langan' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_MDOT.png', name: 'MDOT' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Montrose-Environmental.png', name: 'Montrose Environmental' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Mott-Macdonald.png', name: 'Mott Macdonald' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_MRCE.png', name: 'MRCE' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_NBC.png', name: 'NBC' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0017_NIOSH.png', name: 'NIOSH' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_NV5.png', name: 'NV5' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_Parsons.png', name: 'Parsons' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0014_PGE.png', name: 'PGE' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Port-Authority-NYNJ.png', name: 'Port Authority NYNJ' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Olsson.png', name: 'Olsson' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0019_Ramboll.png', name: 'Ramboll' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white_RioTinto.png', name: 'Rio Tinto' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0003_Roux.png', name: 'Roux' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Scnabel.png', name: 'Scnabel' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-Sevenson.png', name: 'Sevenson' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/12/Logo-white_Shannon-Wilson.png', name: 'Shannon Wilson' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0006_Sixense.png', name: 'Sixense' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Skanska.png', name: 'Skanska' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_SLR.png', name: 'SLR' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_Socotec.png', name: 'Socotec' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0001_Stantec.png', name: 'Stantec' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0020_Terracon.png', name: 'Terracon' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2023/01/Logo-white-_0021_Tesla.png', name: 'Tesla' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-tetra-tech.png', name: 'Tetra Tech' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_texas-univ.png', name: 'Texas Univ' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-TRC.png', name: 'TRC' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white-_0010_Trimble.png', name: 'Trimble' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/04/Logo-white-_Trinity-Consultants.png', name: 'Trinity Consultants' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2024/06/Logo-white_Turner.png', name: 'Turner' },
    { logo: 'https://www.spectotechnology.com/wp-content/uploads/2025/01/Logo-white_USACOE.png', name: 'USACOE' }
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mq && mq.matches) {
      // If user prefers reduced motion, just add class immediately
      node.classList.add('in-view');
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('in-view');
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.15 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="partners-section home-section ">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Partners & Clients</h2>
          <p className="section-subtitle">
            Trusted by leading organizations across the Mid-Atlantic region
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partner-item"
              tabIndex="0"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="partner-logo">
                <img src={partner.logo} alt={partner.name} loading="lazy" />
              </div>
            </div>
          ))}
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