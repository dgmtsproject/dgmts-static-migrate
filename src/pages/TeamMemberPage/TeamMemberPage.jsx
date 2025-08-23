import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './TeamMemberPage.css';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { teamMembers } from './teamData.js';

const TeamMemberPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  const teamMember = teamMembers.find(member => member.id === parseInt(id));

  if (!teamMember) {
    return <div className="team-member-not-found"><h2>Team Member Not Found</h2></div>;
  }

  return (
    <main className="team-member-page">
      <section className="member-banner" style={{ backgroundImage: `url(${teamMember.bannerUrl})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1>{teamMember.name}</h1>
          <h2>{teamMember.role}</h2>
        </div>
      </section>

      <div className="member-details-container">
        <div className="member-details-grid">
          <aside className="member-sidebar">
            <div className="member-card">
              <div className="member-image-wrapper">
                <img src={teamMember.imageUrl} alt={teamMember.name} className="member-image" />
              </div>
              <div className="member-card-info">
                <h3 className="member-name">{teamMember.name}</h3>
                <p className="member-role">{teamMember.role}</p>
                <p className="member-degree">{teamMember.degree}</p>
              </div>
              <div className="member-social-links">
                <a href={teamMember.social.facebook} aria-label="Facebook"><Facebook /></a>
                <a href={teamMember.social.twitter} aria-label="Twitter"><Twitter /></a>
                <a href={teamMember.social.linkedin} aria-label="LinkedIn"><Linkedin /></a>
                <a href={teamMember.social.youtube} aria-label="YouTube"><Youtube /></a>
                <a href={teamMember.social.instagram} aria-label="Instagram"><Instagram /></a>
              </div>
            </div>
          </aside>

          <section className="member-main-content">
            <div className="content-tabs">
              <button onClick={() => setActiveTab('about')} className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}>
                About
              </button>
              <button onClick={() => setActiveTab('contact')} className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}>
                Contact
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'about' && (
                <article className="tm-about-section" dangerouslySetInnerHTML={{ __html: teamMember.about }}></article>
              )}
              {activeTab === 'contact' && (
                <div className="contact-section">
                  <div className="contact-item">
                    <MapPin className="contact-icon" />
                    <div>
                      <h4>Address</h4>
                      <p>{teamMember.contact.address}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>{teamMember.contact.phone}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Mail className="contact-icon" />
                    <div>
                      <h4>Email</h4>
                      <p><a href={`mailto:${teamMember.contact.email}`}>{teamMember.contact.email}</a></p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Globe className="contact-icon" />
                    <div>
                      <h4>Website</h4>
                      <p><a href={teamMember.contact.website} target="_blank" rel="noopener noreferrer">{teamMember.contact.website}</a></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TeamMemberPage;
