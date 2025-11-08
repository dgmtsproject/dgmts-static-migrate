import React, { useEffect, useRef } from 'react';
import './PartnersSection.css';

const PartnersSection = () => {
  // Function to get logo URL - prefer logo_url, fallback to Clearbit API
  const getLogoUrl = (client) => {
    if (client.logo_url) {
      return client.logo_url;
    }
    if (!client.website) return null;
    try {
      const domain = new URL(client.website).hostname.replace('www.', '');
      return `https://logo.clearbit.com/${domain}`;
    } catch (e) {
      return null;
    }
  };

  // Function to calculate position on arc
  // SVG viewBox is 1200x720
  // All arcs are centered at (600, 680) with different radii
  // This ensures blur effects and circumferences are perfectly aligned
  const getPositionOnArc = (radiusInSVG, angle) => {
    const radians = (angle * Math.PI) / 180;
    const svgCenterX = 600;
    const svgCenterY = 680;
    
    // Calculate position on arc in SVG coordinates
    const svgX = svgCenterX + radiusInSVG * Math.cos(Math.PI - radians);
    const svgY = svgCenterY - radiusInSVG * Math.sin(Math.PI - radians);
    
    // Convert to percentage (SVG viewBox is 1200x720)
    const x = (svgX / 1200) * 100;
    const y = (svgY / 720) * 100;
    
    return { left: `${x}%`, top: `${y}%` };
  };

  // Function to generate evenly spaced angles on a semi-circle
  const generateEvenAngles = (count, minAngle = 30, maxAngle = 150) => {
    if (count === 0) return [];
    if (count === 1) return [(minAngle + maxAngle) / 2];

    const angles = [];
    const step = (maxAngle - minAngle) / (count - 1);
    
    for (let i = 0; i < count; i++) {
      angles.push(minAngle + i * step);
    }
    
    return angles;
  };

  // Selected DGMTS clients arranged in concentric circles (from innermost to outermost)
  // Innermost circle - 2 clients (radius ~15%)
  const innerCircle = [
    { name: "AECOM", website: "https://aecom.com/", layer: "inner" },
    { name: "HDR Inc", website: "https://www.hdrinc.com/", layer: "inner" }
  ];

  // Second circle - 4 clients (radius ~25%)
  const secondCircle = [
    { name: "Black & Veatch", website: "https://www.bv.com/", layer: "second" },
    { name: "Skanska", website: "https://www.skanska.com/", logo_url: "https://www.usa.skanska.com/4ae4c0/globalassets/common-items/skanska_logotype_posblue.svg", layer: "second" },
    { name: "WSP", website: "https://www.wsp.com/", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/WSP_logo.svg/102px-WSP_logo.svg.png", layer: "second" },
    { name: "Terracon", website: "https://www.terracon.com/", layer: "second" }
  ];

  // Third circle - 6 clients (radius ~35%)
  const thirdCircle = [
    { name: "KIEWIT Corporation", website: "https://www.kiewit.com/", layer: "third" },
    { name: "AtkinsRéalis", website: "https://www.atkinsrealis.com/", layer: "third" },
    { name: "DC Water", website: "https://www.dcwater.com/", layer: "third" },
    { name: "VDOT", website: "https://www.vdot.virginia.gov/", logo_url: "https://www.vdot.virginia.gov/media/vdotvirginiagov/website-developers-only/site-assets/images/vdot-logo.png", layer: "third" },
    { name: "LANGAN", website: "https://www.langan.com/", layer: "third" },
    { name: "Haley and Aldrich Inc", website: "https://www.haleyaldrich.com/", layer: "third" }
  ];

  // Outermost circle - 8 clients (radius ~45%)
  const outermostCircle = [
    { name: "ATCS", website: "https://atcs.com/", logo_url: "https://atcs.com/wp-content/uploads/ATCS-logo-2022-NAVY-header-340x156-small.png", layer: "outermost" },
    { name: "Clark Construction Group, LLC", website: "https://www.clarkconstruction.com/", layer: "outermost" },
    { name: "JMT", website: "https://jmt.com/", layer: "outermost" },
    { name: "Schnabel Engineering", website: "https://www.schnabel-eng.com/", layer: "outermost" },
    { name: "Fort Myer Construction Corp.", website: "https://fortmyer.us/", logo_url: "https://media.licdn.com/dms/image/v2/C4E0BAQGDd2F8xUi9Ww/company-logo_200_200/company-logo_200_200/0/1631361377624/fmcc_logo?e=2147483647&v=beta&t=_Aau1vjrnxKWa1hyWTILh_BoHgsnOLycT5zud_CUsWg", layer: "outermost" },
    { name: "WSSC", website: "https://www.wsscwater.com/", layer: "outermost" },
    { name: "WMATA", website: "https://www.wmata.com/", layer: "outermost" },
    { name: "Grunley Construction Company, Inc.", website: "https://grunley.com/", layer: "outermost" }
  ];

  // Generate evenly spaced angles for each circle
  const innerAngles = generateEvenAngles(2);
  const secondAngles = generateEvenAngles(4);
  const thirdAngles = generateEvenAngles(6);
  const outermostAngles = generateEvenAngles(8);

  // Combine all partners with their calculated arc positions
  // All arcs are centered at (600, 680)
  const partners = [
    // Innermost circle - 2 clients on arc (radius 180)
    ...innerCircle.map((client, i) => ({
      ...client,
      position: getPositionOnArc(180, innerAngles[i]),
      logo: getLogoUrl(client)
    })),
    
    // Second circle - 4 clients on arc (radius 300)
    ...secondCircle.map((client, i) => ({
      ...client,
      position: getPositionOnArc(300, secondAngles[i]),
      logo: getLogoUrl(client)
    })),
    
    // Third circle - 6 clients on arc (radius 420)
    ...thirdCircle.map((client, i) => ({
      ...client,
      position: getPositionOnArc(420, thirdAngles[i]),
      logo: getLogoUrl(client)
    })),
    
    // Outermost circle - 8 clients on arc (radius 540)
    ...outermostCircle.map((client, i) => ({
      ...client,
      position: getPositionOnArc(530, outermostAngles[i]),
      logo: getLogoUrl(client)
    }))
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mq && mq.matches) {
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
    <section ref={sectionRef} className="partners-section home-section">
      <div className="">
        <div className="section-header">
          <h2 className="section-title">Our Partners & Clients</h2>
          <p className="section-subtitle">
            Trusted by leading organizations across the Mid-Atlantic region

          </p>
        </div>

        {/* Concentric Semi-Circles Design */}
        <div className="partners-concentric-container">
          <svg className="partners-svg" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMax meet">
            {/* Draw concentric semi-circle paths */}
            <defs>
              <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
              </filter>
              <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
              </filter>
              <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
              </filter>
              <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
              </filter>
              
              <radialGradient id="fillGradient1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.05 }} />
              </radialGradient>
              <radialGradient id="fillGradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.15 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.08 }} />
              </radialGradient>
              <radialGradient id="fillGradient3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.1 }} />
              </radialGradient>
              <radialGradient id="fillGradient4" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.25 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.15 }} />
              </radialGradient>
              
              <linearGradient id="arcGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="arcGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="arcGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="arcGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#2795d0', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#28a745', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
            
            {/* Filled circles with blur effects - positioned behind logos */}
            {/* All circles centered at (600, 680) for perfect alignment */}
            {/* Innermost filled circle - most blur */}
            <circle 
              cx="600" 
              cy="680" 
              r="180" 
              fill="url(#fillGradient4)" 
              filter="url(#blur4)"
              className="filled-circle"
            />
            
            {/* Middle filled circle */}
            <circle 
              cx="600" 
              cy="680" 
              r="300" 
              fill="url(#fillGradient3)" 
              filter="url(#blur3)"
              className="filled-circle"
            />
            
            {/* Outer filled circle */}
            <circle 
              cx="600" 
              cy="680" 
              r="420" 
              fill="url(#fillGradient2)" 
              filter="url(#blur2)"
              className="filled-circle"
            />
            
            {/* Outermost filled circle - lightest blur */}
            <circle 
              cx="600" 
              cy="680" 
              r="540" 
              fill="url(#fillGradient1)" 
              filter="url(#blur1)"
              className="filled-circle"
            />
            
            {/* Arc borders - all centered at (600, 680) */}
            <path 
              d="M 60 680 A 540 540 0 0 1 1140 680" 
              fill="none" 
              stroke="url(#arcGradient1)" 
              strokeWidth="2" 
              className="arc-path"
            />
            
            <path 
              d="M 180 680 A 420 420 0 0 1 1020 680" 
              fill="none" 
              stroke="url(#arcGradient2)" 
              strokeWidth="2" 
              className="arc-path"
            />
            
            <path 
              d="M 300 680 A 300 300 0 0 1 900 680" 
              fill="none" 
              stroke="url(#arcGradient3)" 
              strokeWidth="2" 
              className="arc-path"
            />
            
            <path 
              d="M 420 680 A 180 180 0 0 1 780 680" 
              fill="none" 
              stroke="url(#arcGradient4)" 
              strokeWidth="2" 
              className="arc-path"
            />
          </svg>

          {/* Partner logos positioned absolutely */}
          <div className="partners-logos-overlay">
            {partners.map((partner, index) => (
              <div
                key={index}
                className={`partner-item partner-${partner.layer}`}
                style={{
                  left: partner.position.left,
                  top: partner.position.top,
                  animationDelay: `${index * 80}ms`
                }}
                tabIndex="0"
              >
                <div className="partner-logo-circle">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      loading="lazy"
                      className="partner-logo-img"
                    />
                  ) : (
                    <div className="partner-initials">
                      {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
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