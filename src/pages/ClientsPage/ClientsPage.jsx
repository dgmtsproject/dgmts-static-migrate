import React from 'react';
import { ResponsiveHoneycomb, Hexagon } from 'react-honeycomb';
import './ClientsPage.css';
import labella_logo from '../../assets/logos/labella.png';
import county_of_lousia_logo from '../../assets/logos/county_of_lousia.jpeg';
import dcg_logo from '../../assets/logos/dcgcontractor.jpg';
import atkin_logo from '../../assets/logos/atkin.png';
import schnabel_logo from '../../assets/logos/Schnabel-Logo.webp';
import sagres_logo from '../../assets/logos/sagres.png';
import puris_logo from '../../assets/logos/puris.png';
import hdr_logo from '../../assets/logos/hdr.png';
import plan_source_logo from '../../assets/logos/plan_source.png';
import tgm_logo from '../../assets/logos/tgm.png';
import thomson_and_cooke_logo from '../../assets/logos/thompson_and_cooke.jpeg';
import hico_america_logo from '../../assets/logos/hico_america.png';
import kokosing_logo from '../../assets/logos/kokosing.jpeg';
import schnabel_foundations_logo from '../../assets/logos/schnabel.png';

const ClientsPage = () => {
  // Complete list of actual DGMTS clients
  const clients = [
    { "name": "AECOM", "website": "https://aecom.com/" },
    { "name": "AERO Systems Engineering", "website": "https://www.aerosys.net/", logo_url:"https://www.aerosys.net/wp-content/uploads/2022/09/ase-logo-larg.png"},
    { "name": "Aldridge Electric Inc", "website": "https://www.aldridgegroup.com/" },
    { "name": "Allan Myers", "website": "https://www.allanmyers.com/" },
    { "name": "Alpha Corporation", "website": "https://www.alphacorporation.com/", logo_url:"https://www.alphacorporation.com/wp-content/uploads/2016/06/Alpha-Corporation-Logo-WEB-120-px.png"},
    { "name": "Anchor Construction Corporation", "website": "https://anchorconst.com/" },
    { "name": "Ardent Company LLC", "website": "https://ardentco.com/"},
    { "name": "ATCS", "website": "https://atcs.com/" ,logo_url:"https://atcs.com/wp-content/uploads/ATCS-logo-2022-NAVY-header-340x156-small.png"},
    { "name": "AtkinsRéalis", "website": "https://www.atkinsrealis.com/" , logo_url: atkin_logo},
    { "name": "Black & Veatch", "website": "https://www.bv.com/" },
    { "name": "Branscome Paving Co", "website": "https://branscome.com/" },
    { "name": "C.A. Murren & Sons Co., Inc", "website": "https://camurren.com/" },
    { "name": "Capitol Riverfront", "website": "https://www.capitolriverfront.org/" },
    { "name": "Case Architects and Remodelers", "website": "https://www.casedesign.com/", logo_url:"https://www.casedesign.com/wp-content/themes/case-redesign/images/case-logo.svg" },
    { "name": "CES Consulting LLC", "website": "https://ces-consultingllc.com/" },
    { "name": "Chemung Contracting Corporation", "website": "https://www.chemungcontracting.com/" , logo_url:"https://www.chemungcontracting.com/wp-content/uploads/2017/10/Chemung-logo.png"},
    { "name": "Chesapeake Contracting Group", "website": "https://www.ccgmd.com/" },
    { "name": "City of Baltimore", "website": "https://www.baltimorecity.gov/" },
    { "name": "Clark Construction Group, LLC", "website": "https://www.clarkconstruction.com/" },
    { "name": "Concrete General, Inc.", "website": "https://www.concretegeneral.com/" },
    { "name": "County of Louisa", "website": "https://www.louisacounty.gov/", logo_url: county_of_lousia_logo },
    { "name": "CP&Y", "website": "https://www.cpyi.com/" },
    { "name": "DC Water", "website": "https://www.dcwater.com/" },
    { "name": "Delve Underground", "website": "https://delveunderground.com/" , logo_url:"https://delveunderground.com/uploads/fullscreen-landscape/_1200x630_crop_center-center_82_none/Delve-Logo-Placeholder.jpg?mtime=1690477955"},
    { "name": "Development Facilitators, Inc", "website": "https://www.dfiengineering.com/" },
    { "name": "Dominion Construction Group", "website": "https://www.dcgcontractor.com/", logo_url: dcg_logo },
    { "name": "EBA Engineering", "website": "https://ebaengineering.com/" },
    { "name": "ETC", "website": "https://etc-web.com/" , logo_url:"https://www.etc-web.com/wp-content/uploads/logo_etc.png"},
    { "name": "F & R", "website": "https://www.fandr.com/" , logo_url:"https://www.fandr.com/wp-content/uploads/2025/05/Froehling-Robertson-Logo-2-2048x536.png"},
    { "name": "F.H. Paschen", "website": "https://www.fhpaschen.com/" },
    { "name": "FAY", "website": "https://www.shikunusa.com/" },
    { "name": "Flippo Construction Company, Inc.", "website": "https://flippo.com/" },
    { "name": "Fort Myer Construction Corp.", "website": "https://fortmyer.us/" , logo_url:"https://media.licdn.com/dms/image/v2/C4E0BAQGDd2F8xUi9Ww/company-logo_200_200/company-logo_200_200/0/1631361377624/fmcc_logo?e=2147483647&v=beta&t=_Aau1vjrnxKWa1hyWTILh_BoHgsnOLycT5zud_CUsWg"},
    { "name": "Greeley and Hansen", "website": "https://www.greeley-hansen.com/" },
    { "name": "Grunley Construction Company, Inc.", "website": "https://grunley.com/" },
    { "name": "Haley and Aldrich Inc", "website": "https://www.haleyaldrich.com/" },
    { "name": "Halo Development LLC", "website": "https://www.halo-development.com/", logo_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqrRbXbvaLl2zfLlPM3TDYZvsng5vn8cceFQ&s" },
    { "name": "HDR Inc", "website": "https://www.hdrinc.com/", logo_url: hdr_logo },
    { "name": "HICO America", "website": "https://www.hicoamerica.com/" , logo_url: hico_america_logo },
    { "name": "HRCP", "website": null , logo_url:"https://hrcpjobs.com/wp-content/uploads/2021/06/cropped-hrcp-logo-raster.png"},
    { "name": "JMT", "website": "https://jmt.com/" },
    { "name": "KIEWIT Corporation", "website": "https://www.kiewit.com/" },
    { "name": "Kokosing Construction Company Inc", "website": "https://www.kokosing.biz/", logo_url: kokosing_logo },
    { "name": "Labella Associates", "website": "https://www.labellapc.com/" , logo_url: labella_logo},
    { "name": "LANGAN", "website": "https://www.langan.com/" },
    { "name": "Metro Paving Corporation", "website": "https://www.metropaving.net/" , logo_url:"https://www.metropaving.net/mt-content/uploads/2020/02/logo-2_5e4ad126db3fb.png"},
    { "name": "MFO Homes", "website": "https://www.mfocore.com/" , logo_url:"https://img1.wsimg.com/isteam/ip/fcc3241e-4b8f-4fb6-b4b5-e476a4af9f6a/grayscale_transparent_nobuffer.png/:/rs=w:138,h:100,cg:true,m/cr=w:138,h:100/qt=q:95"},
    { "name": "Mimar Architect", "website": "https://mimararchitecture.com/" , logo_url:"https://mimararchitecture.com/wp-content/uploads/2023/04/Mimar-Group-Logo-WIde-Navy-2048x634.png"},
    { "name": "Murphy-Puris Corporation", "website": "https://puriscorp.com/" , logo_url:"https://puriscorp.com/wp-content/uploads/2022/11/MPC-Blue-a-PURIS-Company.png"},
    { "name": "O'Berry Engineering, Inc.", "website": null },
    { "name": "PGH Wong", "website": "https://pghwong.com/" },
    { "name": "PSI Intertek Inc.", "website": "https://www.intertek.com/building/psi/" , logo_url:"https://www.intertek.com/globalassets/_media/co-branded-logos/psi.svg"},
    { "name": "Puris Corp", "website": "https://puriscorp.com/" ,logo_url: puris_logo},
    { "name": "RS&H", "website": "https://www.rsandh.com/" },
    { "name": "Sagres Construction", "website": "https://www.sagresconstruction.com/" , logo_url:sagres_logo},
    { "name": "Schnabel Engineering", "website": "https://www.schnabel-eng.com/" , logo_url: schnabel_logo},
    { "name": "Schnabel Foundations", "website": "https://www.schnabel.com/" , logo_url: schnabel_foundations_logo},
    { "name": "Shirley Contracting Company, LLC", "website": "https://shirleycontracting.com/" },
    { "name": "Skanska", "website": "https://www.skanska.com/" , logo_url:"https://www.usa.skanska.com/4ae4c0/globalassets/common-items/skanska_logotype_posblue.svg"},
    { "name": "T.Y. Lin International", "website": "https://www.tylin.com/" },
    { "name": "Terra Site Constructors", "website": "https://terraconstructs.com/" },
    { "name": "Terracon", "website": "https://www.terracon.com/" },
    { "name": "TGM Construction", "website": "https://www.tgmconstruction.co/", logo_url: tgm_logo },
    { "name": "The King's Masons", "website": "https://kingsmasons.com/" },
    { "name": "The Plan Source", "website": "http://www.plan-source.com/" , logo_url: plan_source_logo },
    { "name": "Thomson & Cooke Architects", "website": "https://www.thomsoncooke.com/", logo_url: thomson_and_cooke_logo },
    { "name": "VDOT", "website": "https://www.vdot.virginia.gov/" , logo_url:"https://www.vdot.virginia.gov/media/vdotvirginiagov/website-developers-only/site-assets/images/vdot-logo.png"},
    { "name": "Volkert", "website": "https://volkert.com/" },
    { "name": "Wengell, McDonnell & Costello, Inc.", "website": "https://wmcengineers.com/", logo_url:"https://wmcengineers.com/new/wp-content/uploads/2021/04/logo_transparent.png" },
    { "name": "Whitman, Requardt and Associates, LLP", "website": "https://wrallp.com/" },
    { "name": "WMATA", "website": "https://www.wmata.com/" },
    { "name": "Wright Angle Consulting, PLLC", "website": "https://wrightanglepllc.com/" },
    { "name": "WSP", "website": "https://www.wsp.com/" , logo_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/WSP_logo.svg/102px-WSP_logo.svg.png"},
    { "name": "WSSC", "website": "https://www.wsscwater.com/" }
  ];

  // Function to get logo URL - prefer logo_url, fallback to Clearbit API
  const getLogoUrl = (client) => {
    // First check if client has a direct logo_url
    if (client.logo_url) {
      return client.logo_url;
    }
    
    // Fallback to Clearbit Logo API if website exists
    if (!client.website) return null;
    try {
      const domain = new URL(client.website).hostname.replace('www.', '');
      return `https://logo.clearbit.com/${domain}`;
    } catch (e) {
      return null;
    }
  };

  // Function to get initials from company name
  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  // Function to handle logo load error - show initials instead
  const handleLogoError = (e) => {
    const logoWrapper = e.target.closest('.logo-wrapper');
    if (logoWrapper) {
      logoWrapper.style.display = 'none';
    }
    const initialsEl = e.target.closest('.logo-container')?.querySelector('.initials-container');
    if (initialsEl) {
      initialsEl.style.display = 'flex';
    }
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
                      <div className="logo-container">
                        {getLogoUrl(client) && (
                          <div className="logo-wrapper">
                            <img 
                              src={getLogoUrl(client)} 
                              alt={client.name} 
                              loading="lazy"
                              className="client-logo"
                              onError={handleLogoError}
                            />
                          </div>
                        )}
                        <div 
                          className="initials-container"
                          style={{ display: getLogoUrl(client) ? 'none' : 'flex' }}
                        >
                          <span className="initials-text">
                            {getInitials(client.name)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back Face - Company Name */}
                    <div className="hexagon-face hexagon-back">
                      <div className="company-info">
                        <h3 className="company-name">{client.name}</h3>
                        {client.website && (
                          <a 
                            href={client.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="company-website"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit Website →
                          </a>
                        )}
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
