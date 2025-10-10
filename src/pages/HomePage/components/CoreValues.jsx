import React from 'react';
import './CoreValues.css';
import { Layers, Award, Trophy, Zap, Globe, Server } from 'lucide-react';

const pillars = [
  {
    title: 'Diverse Expertise',
    icon: (
      <Layers aria-hidden="true" />
    ),
    text: 'A multidisciplinary team spanning engineering, geology, design, inspection and support functions.'
  },
  
  {
    title: 'Quality & Professionalism',
    icon: (
      <Award aria-hidden="true" />
    ),
    text: 'Professional standards guide every interaction, deliverable and onsite decision.'
  },
  {
    title: 'Sustained Excellence',
    icon: (
      <Trophy aria-hidden="true" />
    ),
    text: 'Continuous improvement ensures durable value across all operations.'
  },
  {
    title: 'Fast-Track Delivery',
    icon: (
      <Zap aria-hidden="true" />
    ),
    text: 'Proven track record completing fast‑track projects and meeting deadlines efficiently.'
  },
  {
    title: 'Regional Presence',
    icon: (
      <Globe aria-hidden="true" />
    ),
    text: 'Headquarters in Chantilly, VA with branch offices in Prince George\'s County (MD), Hampton and Washington DC.'
  },
  {
    title: 'Accredited Labs',
    icon: (
      <Server aria-hidden="true" />
    ),
    text: 'Two accredited, well‑equipped full‑service laboratories in Chantilly and Hampton, Virginia.'
  }
];

const CoreValues = () => {
  return (
    <section className="core-values home-section" aria-labelledby="core-values-heading">
      <div className="">
        <div className="core-values-content">
          <header className="core-values-hero">
            <h2 id="core-values-heading" className="core-values-heading">
              What Sets Us Apart
            </h2>
            <p className="core-values-sub">
              Our commitment to excellence is built on six fundamental pillars that drive everything we do. 
              These core values ensure we deliver exceptional results while maintaining the highest standards 
              of professionalism and quality.
            </p>
          </header>

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
  );
};

export default CoreValues;