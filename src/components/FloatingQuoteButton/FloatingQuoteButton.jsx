import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingQuoteButton.css';

const FloatingQuoteButton = () => {
  const [isJiggling, setIsJiggling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jiggleInterval = setInterval(() => {
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 4000);
    }, 7000);
    return () => clearInterval(jiggleInterval);
  }, []);

  return (
    <div
      className={`floating-quote-button ${isJiggling ? 'jiggling' : ''}`}
      onClick={() => navigate('/contact')}
    >
      <div className="quote-button-content">
        <div className="quote-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11H15M9 15H12M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V7C20 8.10457 19.1046 9 18 9H6C4.89543 9 4 8.10457 4 7V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 9V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="quote-text">
          <span className="quote-main">Request</span>
          <span className="quote-sub">Quote</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingQuoteButton;