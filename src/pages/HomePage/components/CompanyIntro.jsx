import React, { useEffect, useRef, useState } from 'react'; // React referenced for environments not using automatic runtime
import PropTypes from 'prop-types';
import './CompanyIntro.css';
import { Users, Building, Construction, Map, Briefcase, Radar, Server, Laptop } from 'lucide-react';

// Roles (chips) definitions
const teamRoles = [
  { label: 'Professional Engineers', icon: Users, color: 'linear-gradient(135deg,#4f8cff,#6fb6ff)' },
  { label: 'Geotechnical Engineers', icon: Building, color: 'linear-gradient(135deg,#ffb347,#ff9a8b)' },
  { label: 'Structural Engineers', icon: Construction, color: 'linear-gradient(135deg,#7ed957,#5fd56a)' },
  { label: 'Geologists', icon: Map, color: 'linear-gradient(135deg,#ff6f91,#ff9bb3)' },
  { label: 'Project Managers', icon: Briefcase, color: 'linear-gradient(135deg,#ffd700,#ffde7a)' },
  { label: 'Construction Engineers', icon: Construction, color: 'linear-gradient(135deg,#a0e7e5,#6fe3df)' },
  { label: 'Inspectors', icon: Radar, color: 'linear-gradient(135deg,#bdb2ff,#c7baff)' },
  { label: 'Technicians', icon: Server, color: 'linear-gradient(135deg,#ffb3c6,#ff7fa1)' },
  { label: 'Designers', icon: Laptop, color: 'linear-gradient(135deg,#9be15d,#57a845)' },
  { label: 'Admin Support', icon: Users, color: 'linear-gradient(135deg,#c1c8e4,#9fb0ff)' },
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
    <section className="home-section company-intro bg-texture" aria-labelledby="company-intro-heading">
      {/* SVG defs for chip gradient */}
      <svg width="0" height="0" aria-hidden="true" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--secondary-color)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="intro-content">
        <div className="intro-grid">
          <div className="intro-left">
            <header className="intro-hero">
              <h2 id="company-intro-heading" className="intro-heading">Our Strength Lies In Our Diverse Team</h2>
              <p className="intro-sub">
                At <strong className="text-primary">Dulles Geotechnical and Materials Testing Services, Inc. (DGMTS)</strong>, our highly trained and experienced team of more than <strong className="text-primary">70</strong> professionals spans disciplines including professional, geotechnical and structural engineering, geology, project and construction management, inspection, technical services, design and administrative support—ready to deliver superior consulting and site services while upholding industry standards. <strong>Professionalism and quality</strong> are at the heart of everything we do.
              </p>
            </header>
          </div>

          <div className="intro-right">
            <div className="role-chips-wrapper" aria-label="Team roles">
              <div className="role-chips">
                {teamRoles.map(role => {
                  const Icon = role.icon;
                  return (
                    <span className="role-chip" key={role.label} tabIndex={0} aria-label={role.label}>
                        <span className="chip-icon" aria-hidden="true" style={{ background: role.color }}>
                          <Icon size={16} color="#ffffff" />
                        </span>
                      {role.label}
                    </span>
                  );
                })}
              </div>

              <div className="team-strength-card" role="group" aria-label="Team strength">
                <div className="team-strength-number"><AnimatedNumber target={90} /><span className="suffix">people</span></div>
                <div className="team-strength-label">Multidisciplinary Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </React.Fragment>
  );
};

export default CompanyIntro;