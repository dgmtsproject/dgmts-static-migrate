import React from 'react';
import './CertificationsSection.css';

const CertificationsSection = () => {
  const certifications = [
    'Virginia Department of Transportation (VDOT)',
    'District Department of Transportation (DDOT)',
    'Metropolitan Washington Airport Authority (MWAA)',
    'Washington Metropolitan Area Transit Authority (WMATA)',
    'Maryland Department of Transportation (MDOT)',
    'Maryland Transit Administration (MTA)',
    'Maryland Transportation Authority (MDTA)'
  ];

  const resources = {
    staff: [
      'Geotechnical Engineers/Geologists',
      'Project Managers / QAM',
      'QC Inspectors & Field Technicians',
      'Drillers',
      'Lab Director / Managers / Technicians'
    ],
    trainings: [
      'OSHA-10',
      'Nuclear Gauge Safety',
      'E&S'
    ],
    certifications: [
      'VDOT',
      'WACEL',
      'MDOT',
      'ACI'
    ]
  };

  return (
    <section className="certifications-section home-section-sm bg-texture">
      <div className="container">
        <div className="certifications-grid">
          {/* MBE/DBE Certifications */}
          <div className="cert-card mbe-card">
            <div className="cert-header">
              <h3>MBE/DBE<br />CERTIFICATIONS</h3>
            </div>
            <div className="cert-body">
              <ul className="cert-list">
                {certifications.map((cert, index) => (
                  <li key={index} className="cert-item">
                    <div className="cert-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="cert-card resources-card">
            <div className="cert-header">
              <h3>RESOURCES</h3>
            </div>
            <div className="cert-body">
              <div className="resources-section">
                <h4>DGMTS Staff:</h4>
                <ul className="resource-list">
                  {resources.staff.map((item, index) => (
                    <li key={index} className="resource-item">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="resources-section">
                <h4>DGMTS Trainings:</h4>
                <ul className="resource-list">
                  {resources.trainings.map((item, index) => (
                    <li key={index} className="resource-item">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="resources-section">
                <h4>DGMTS Certifications:</h4>
                <ul className="resource-list">
                  {resources.certifications.map((item, index) => (
                    <li key={index} className="resource-item">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;