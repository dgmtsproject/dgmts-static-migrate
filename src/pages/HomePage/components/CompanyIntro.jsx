
import React, { useEffect, useRef, useState } from 'react'; // React referenced for environments not using automatic runtime
import PropTypes from 'prop-types';
import './CompanyIntro.css';

// Roles (chips) definitions
const teamRoles = [
  { label: 'Professional Engineers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="#4f8cff"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#b3d1ff"/></svg>
  )},
  { label: 'Geotechnical Engineers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="#ffb347"/><path d="M8 12h8" stroke="#fff" strokeWidth="2"/></svg>
  )},
  { label: 'Structural Engineers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="6" fill="#7ed957"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>
  )},
  { label: 'Geologists', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="4" fill="#ff6f91"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>
  )},
  { label: 'Project Managers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="6" fill="#ffd700"/><path d="M12 8v8" stroke="#fff" strokeWidth="2"/></svg>
  )},
  { label: 'Construction Engineers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="8" fill="#a0e7e5"/><path d="M8 16l8-8" stroke="#fff" strokeWidth="2"/></svg>
  )},
  { label: 'Inspectors', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="10" fill="#bdb2ff"/><path d="M12 6v12" stroke="#fff" strokeWidth="2"/></svg>
  )},
  { label: 'Technicians', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="6" fill="#ffb3c6"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>
  )},
  { label: 'Designers', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="#f3ffbd"/><path d="M8 8h8v8H8z" stroke="#fff" strokeWidth="2"/></svg>
  )},
  { label: 'Admin Support', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="10" fill="#c1c8e4"/><path d="M6 12h12" stroke="#fff" strokeWidth="2"/></svg>
  )},
];

const pillars = [
  {
    title: 'Diverse Expertise',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h16v4H4zM4 10h10v4H4zM4 16h6v4H4z" fill="currentColor" /></svg>
    ),
    text: 'A multidisciplinary team spanning engineering, geology, design, inspection and support functions.'
  },
  {
    title: '70+ Professionals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><path d="M3 18c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 18c0-2.2 1.8-4 4-4h1c2.2 0 4 1.8 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    text: 'A robust bench ready for complex consulting and site services at scale.'
  },
  {
    title: 'Quality & Professionalism',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.3L12 16.6 6.4 19.6l1.1-6.3L3 8.9 9 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/></svg>
    ),
    text: 'Professional standards guide every interaction, deliverable and onsite decision.'
  },
  {
    title: 'Sustained Excellence',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12a8 8 0 0116 0v6H4z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12v6M12 10v8M16 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    text: 'Continuous improvement ensures durable value across all operations.'
  },
  {
    title: 'Fast-Track Delivery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 5l6 7-6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    text: 'Proven track record completing fast‑track projects and meeting deadlines efficiently.'
  },
  {
    title: 'Regional Presence',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    text: 'Headquarters in Chantilly, VA with branch offices in Prince George\'s County (MD), Hampton and Washington DC.'
  },
  {
    title: 'Accredited Labs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    text: 'Two accredited, well‑equipped full‑service laboratories in Chantilly and Hampton, Virginia.'
  }
];

// Simple intersection observer hook for counter
const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, inView]);
  return [ref, inView];
};

const AnimatedNumber = ({ target = 70, duration = 1400 }) => {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start; const easeOut = t => 1 - Math.pow(1 - t, 3);
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = easeOut(progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [inView, target, duration]);
  return <span ref={ref} aria-label={`${target}+ professionals`}>{value}+</span>;
};

AnimatedNumber.propTypes = {
  target: PropTypes.number,
  duration: PropTypes.number,
};

const CompanyIntro = () => {
  return (
    <React.Fragment>
    <section className="company-intro home-section" aria-labelledby="company-intro-heading">
      <div className="container">
        <div className="intro-content">
          <header className="intro-hero">
            <h2 id="company-intro-heading" className="intro-heading">Our Strength Lies In Our Diverse Team</h2>
            <p className="intro-sub">
              At <strong className="text-primary">Dulles Geotechnical and Materials Testing Services, Inc. (DGMTS)</strong>, our highly trained and experienced team of more than <strong className="text-primary">70</strong> professionals spans disciplines including professional, geotechnical and structural engineering, geology, project and construction management, inspection, technical services, design and administrative support—ready to deliver superior consulting and site services while upholding industry standards. <strong>Professionalism and quality</strong> are at the heart of everything we do.
            </p>
          </header>

          <div className="team-strength-card" role="group" aria-label="Team strength">
            <div className="team-strength-number"><AnimatedNumber target={70} /><span className="suffix">people</span></div>
            <div className="team-strength-label">Multidisciplinary Professionals</div>
          </div>

          <div className="role-chips-wrapper" aria-label="Team roles">
            <p className="role-chips-heading">Disciplines & Roles</p>
            <div className="role-chips">
              {teamRoles.map(role => (
                <span className="role-chip" key={role.label} tabIndex={0} aria-label={role.label}>
                  {role.icon}
                  {role.label}
                </span>
              ))}
            </div>
          </div>

          <div className="pillars-grid" aria-label="Core values and differentiators">
            {pillars.map(p => (
              <div className="pillar" key={p.title}>
                <div className="pillar-icon" aria-hidden="true">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </React.Fragment>
  );
};

export default CompanyIntro;