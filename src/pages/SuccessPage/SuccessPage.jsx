
import React from 'react';
import { Link } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  return (
    <div className="success-page-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">Thank you for your payment. Your transaction has been completed successfully.</p>
        <Link to="/" className="home-link">Go to Homepage</Link>
      </div>
    </div>
  );
};

export default SuccessPage;
