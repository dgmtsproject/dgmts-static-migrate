import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TeamMemberPage.css';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { fetchAboutLeaders } from '../../utils/aboutLeaders';

const TeamMemberPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [teamMember, setTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const list = await fetchAboutLeaders();
      const key = String(id);
      const found = list.find((m) => String(m.id) === key || String(m.slug) === key) || null;
      if (!cancelled) {
        setTeamMember(found);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true };
  }, [id]);

  if (loading) {
    return <div className="team-member-not-found"><h2>Loading…</h2></div>;
  }

  if (!teamMember) {
    return <div className="team-member-not-found"><h2>Team Member Not Found</h2></div>;
  }

  const social = teamMember.social || {};
  const hasSocial = Object.values(social).some((v) => v && v !== '#');
  const contact = teamMember.contact || {};

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
                {teamMember.degree ? <p className="member-degree">{teamMember.degree}</p> : null}
              </div>
              {hasSocial && (
              <div className="member-social-links">
                {social.facebook && social.facebook !== '#' && <a href={social.facebook} aria-label="Facebook"><Facebook /></a>}
                {social.twitter && social.twitter !== '#' && <a href={social.twitter} aria-label="Twitter"><Twitter /></a>}
                {social.linkedin && social.linkedin !== '#' && <a href={social.linkedin} aria-label="LinkedIn"><Linkedin /></a>}
                {social.youtube && social.youtube !== '#' && <a href={social.youtube} aria-label="YouTube"><Youtube /></a>}
                {social.instagram && social.instagram !== '#' && <a href={social.instagram} aria-label="Instagram"><Instagram /></a>}
              </div>
              )}
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
                  {contact.address && (
                  <div className="contact-item">
                    <MapPin className="contact-icon" />
                    <div>
                      <h4>Address</h4>
                      <p>{contact.address}</p>
                    </div>
                  </div>
                  )}
                  {contact.phone && (
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                  )}
                  {contact.email && (
                  <div className="contact-item">
                    <Mail className="contact-icon" />
                    <div>
                      <h4>Email</h4>
                      <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                    </div>
                  </div>
                  )}
                  {contact.website && (
                  <div className="contact-item">
                    <Globe className="contact-icon" />
                    <div>
                      <h4>Website</h4>
                      <p><a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer">{contact.website}</a></p>
                    </div>
                  </div>
                  )}
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
