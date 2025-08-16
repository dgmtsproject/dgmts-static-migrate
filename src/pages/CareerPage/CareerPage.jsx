import './CareerPage.css';

const CareerPage = () => (
  <main className="career-page">
    <section className="career-section job-openings">
      <h1 className="career-heading">Join Our Team</h1>
      <div className="career-content">
        <p>We are always looking for talented and passionate individuals to join our team. At DGMTS, we believe that our employees are our greatest asset. We offer a dynamic and collaborative work environment where you can grow your skills and make a real impact.</p>
        <p>Check out our current job openings below and take the first step towards a rewarding career with us.</p>
      </div>
    </section>

    <section className="career-section">
      <h2 className="career-heading">Open Positions</h2>
      <div className="career-content">
        <div className="job-listing">
          <h3>Geotechnical Engineer</h3>
          <p><strong>Location:</strong> Chantilly, VA</p>
          <p>We are seeking a motivated Geotechnical Engineer to join our team. The ideal candidate will have a strong understanding of soil mechanics and foundation design.</p>
          <a href="#" className="apply-button">Apply Now</a>
        </div>
        <div className="job-listing">
          <h3>Construction Materials Testing Technician</h3>
          <p><strong>Location:</strong> Hampton, VA</p>
          <p>We are looking for a detail-oriented and reliable Construction Materials Testing Technician. This role involves conducting field and laboratory tests on various construction materials.</p>
          <a href="#" className="apply-button">Apply Now</a>
        </div>
        <div className="job-listing">
          <h3>Driller</h3>
          <p><strong>Location:</strong> Chantilly, VA</p>
          <p>We have an opening for an experienced Driller to operate and maintain our drilling equipment. A CDL is required for this position.</p>
          <a href="#" className="apply-button">Apply Now</a>
        </div>
      </div>
    </section>

    <section className="career-section why-join-us">
      <h2 className="career-heading">Why Work With Us?</h2>
      <div className="career-content">
        <ul>
          <li>Competitive salary and benefits package</li>
          <li>Opportunities for professional development and growth</li>
          <li>A collaborative and supportive team environment</li>
          <li>Challenging and rewarding projects</li>
          <li>Commitment to safety and quality</li>
        </ul>
      </div>
    </section>
  </main>
);

export default CareerPage;
