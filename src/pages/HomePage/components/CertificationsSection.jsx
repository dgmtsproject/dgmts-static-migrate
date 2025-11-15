import React from 'react';
import './CertificationsSection.css';

const CertificationsSection = ({ data }) => {
  // Default data for Home page
  const defaultData = {
    certifications: [
      'Virginia Department of Transportation (VDOT)',
      'District Department of Transportation (DDOT)',
      'Metropolitan Washington Airport Authority (MWAA)',
      'Washington Metropolitan Area Transit Authority (WMATA)',
      'Maryland Department of Transportation (MDOT)',
      'Maryland Transit Administration (MTA)',
      'Maryland Transportation Authority (MDTA)'
    ],
    secondCard: {
      title: 'RESOURCES',
      sections: [
        {
          title: 'DGMTS Staff:',
          items: [
            'Geotechnical Engineers/Geologists',
            'Project Managers / QAM',
            'QC Inspectors & Field Technicians',
            'Drillers',
            'Lab / Managers / Technicians',
            'Software Developers & IT Specialists'
          ]
        },
        {
          title: 'DGMTS Trainings:',
          items: [
            'OSHA-10',
            'Nuclear Gauge Safety',
            'E&S',
            'Work Zone Safety',
          ]
        },
        {
          title: 'DGMTS Certifications:',
          items: [
            'VDOT',
            'WACEL',
            'MDOT',
            'ACI',
            'MARTCP',
            'CWI',
            'NICET'
          ]
        }
      ]
    }
  };

  const displayData = data || defaultData;

  return (
    <section className="bg-texture certifications-section">
      <div className="">
        <div className="certifications-grid">
          {/* MBE/DBE Certifications */}
          <div className="cert-card mbe-card">
            <div className="cert-header">
              <h3>MBE/DBE<br />CERTIFICATIONS</h3>
            </div>
            <div className="cert-body">
              <ul className="cert-list">
                {displayData.certifications.map((cert, index) => (
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

          {/* Second Card (Resources or Clientele) */}
          <div className="cert-card resources-card">
            <div className="cert-header">
              <h3>{displayData.secondCard.title}</h3>
            </div>
            <div className="cert-body">
              {displayData.secondCard.sections ? (
                displayData.secondCard.sections.map((section, index) => (
                  <div key={index} className="resources-section">
                    <h4>{section.title}</h4>
                    <ul className="resource-list">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="resource-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="cert-list">
                  {displayData.secondCard.items.map((item, index) => (
                    <li key={index} className="cert-item">
                      <div className="cert-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;