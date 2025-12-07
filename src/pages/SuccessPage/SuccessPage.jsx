import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const { transactionId, amount, invoiceAmount, serviceCharge, invoiceNo } = location.state || {};

  return (
    <div className="success-page-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        
        {transactionId && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Transaction Details</h3>
            {invoiceNo && (
              <p style={{ margin: '8px 0' }}>
                <strong>Invoice No:</strong> {invoiceNo}
              </p>
            )}
            {invoiceAmount && (
              <div style={{ margin: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Invoice Amount:</span>
                  <span>${parseFloat(invoiceAmount).toFixed(2)}</span>
                </div>
                {serviceCharge && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Service Charge:</span>
                    <span>${parseFloat(serviceCharge).toFixed(2)}</span>
                  </div>
                )}
                {amount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #dee2e6', paddingTop: '4px', marginTop: '4px' }}>
                    <span>Total Paid:</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
            {amount && !invoiceAmount && (
              <p style={{ margin: '8px 0' }}>
                <strong>Amount:</strong> ${parseFloat(amount).toFixed(2)}
              </p>
            )}
            <p style={{ margin: '8px 0' }}>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p style={{ 
              margin: '15px 0 0 0', 
              fontSize: '14px', 
              color: '#6c757d',
              fontStyle: 'italic'
            }}>
              Please save this transaction ID for your records.
            </p>
          </div>
        )}
        
        <Link to="/" className="home-link">Go to Homepage</Link>
      </div>
    </div>
  );
};

export default SuccessPage;
