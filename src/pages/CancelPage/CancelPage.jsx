
import React from 'react';
import { Link } from 'react-router-dom';
import './CancelPage.css';

const CancelPage = () => {
  return (
    <div className="cancel-page-container">
      <div className="cancel-card">
        <div className="cancel-icon">✗</div>
        <h1 className="cancel-title">Payment Cancelled</h1>
        <p className="cancel-message">Your payment was not processed. You can go back to the payment page to try again.</p>
        <Link to="/payment" className="back-link">Go to Payment Page</Link>
      </div>
    </div>
  );
};

export default CancelPage;
