import "./Hero.css"
const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-pattern"></div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Next-Gen Engineering Solutions</span>
            </div>
            
            <h1 className="hero-title">
              Professional <br />
              <span className="hero-title-accent">Pile Driving Log</span>
            </h1>
            
            <p className="hero-description">
              DGMTS provides expert geotechnical field solutions. Our digital logging app eliminates manual paperwork, ensuring precision, reliability, and instant report generation.
            </p>
            
            <div className="hero-buttons">
              <a href="https://dgmts-pile-driver-2.vercel.app/" target="_blank" className="btn btn-primary">Start Free Trial</a>
              <a href="https://dgmts-pile-driver-2.vercel.app/" target="_blank" className="btn btn-secondary">Watch Demo</a>
            </div>
            
            <div className="hero-platforms">
              <div className="platform-item">
                <i className="fa-brands fa-apple"></i>
                <span>iOS</span>
              </div>
              <div className="platform-item">
                <i className="fa-brands fa-android"></i>
                <span>Android</span>
              </div>
              <div className="platform-item">
                <i className="fa-solid fa-desktop"></i>
                <span>Desktop</span>
              </div>
            </div>
          </div>
          
          <div className="hero-mockup">
            <div className="mockup-wrapper">
               <div className="mockup-inner">
                  <div className="mockup-header">
                    <div className="mockup-logo">DGMTS</div>
                    <div className="mockup-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                  <div className="mockup-content">
                    <div className="timer-display">
                      <div className="timer-value">00:15:24</div>
                      <div className="timer-label">ELAPSED TIME</div>
                    </div>
                    <div className="control-buttons">
                      <div className="control-btn start-btn">START</div>
                      <div className="control-btn stop-btn">STOP</div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="floating-notification">
              <div className="notification-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="notification-text">
                <div className="notification-title">Blow Log Saved</div>
                <div className="notification-time">2 seconds ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero