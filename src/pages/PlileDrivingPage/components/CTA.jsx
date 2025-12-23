import "./CTA.css"
const CTA = () => {
  return (
    <div className="cta-section">
      <div className="cta-background">
        <div className="cta-circle large"></div>
        <div className="cta-circle small"></div>
      </div>

      <div className="cta-container">
        <div className="cta-card">
          <h2 className="cta-title">
            Let's make DGMTS your next <br />
            <span className="cta-title-accent">growth partner</span>
          </h2>
          
          <div className="cta-benefits">
            <div className="benefit-item">
               <div className="benefit-icon">
                  <i className="fa-solid fa-check"></i>
               </div>
               <span>Get better returns on your time & money</span>
            </div>
            <div className="benefit-item">
               <div className="benefit-icon">
                  <i className="fa-solid fa-check"></i>
               </div>
               <span>Save 75% of your time per project</span>
            </div>
          </div>
          
          <div className="cta-buttons">
            <button className="btn btn-cta-primary">Get access →</button>
            <button className="btn btn-cta-secondary">Book a call</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;