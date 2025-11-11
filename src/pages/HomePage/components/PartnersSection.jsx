import React from 'react';
import './PartnersSection.css';

const PartnersSection = () => {
  return (
    <section className="partners-section home-section ">
      <div className="">
        {/* CTA Section */}
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