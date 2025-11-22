import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './PaymentPage.css';
import Modal from '../../components/Modal/Modal';
import { supabase } from '../../supabaseClient'
import { Wrench } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const UNDER_MAINTENANCE = true;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    invoiceNo: '',
    invoiceAmount: '',
    paymentNote: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(12);

  useEffect(() => {
    if (UNDER_MAINTENANCE) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.customerName.trim()) errors.push('Customer Name is required');
    if (!formData.customerEmail.trim()) errors.push('Customer Email is required');
    if (!formData.customerAddress.trim()) errors.push('Customer Address is required');
    if (!formData.invoiceNo.trim()) errors.push('Invoice No. is required');
    if (!formData.invoiceAmount || parseFloat(formData.invoiceAmount) <= 0) {
      errors.push('Amount must be a valid positive number');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.customerEmail && !emailRegex.test(formData.customerEmail)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  const calculateServiceCharge = (amount) => {
    const numAmount = parseFloat(amount);
    return (numAmount * 0.029) + 0.30;
  };

  const calculateTotalAmount = (amount) => {
    const numAmount = parseFloat(amount);
    const serviceCharge = calculateServiceCharge(amount);
    return numAmount + serviceCharge;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    setStatus('Processing...');
    
    try {
      // Calculate amounts
      const invoiceAmount = parseFloat(formData.invoiceAmount);
      const serviceCharge = calculateServiceCharge(invoiceAmount);
      const totalAmount = calculateTotalAmount(invoiceAmount);
      
      // Create Stripe checkout session using Supabase Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          amount: totalAmount, // Send total amount in dollars
          originalAmount: invoiceAmount, // Send original amount for database
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerAddress: formData.customerAddress,
          invoiceNo: formData.invoiceNo,
          paymentNote: formData.paymentNote,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = session.url;

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed: ' + error.message);
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const serviceCharge = formData.invoiceAmount ? calculateServiceCharge(formData.invoiceAmount) : 0;
  const totalAmount = formData.invoiceAmount ? calculateTotalAmount(formData.invoiceAmount) : 0;

  return (
    <main className="payment-page bg-texture">
    <section className="payment-section">
      {UNDER_MAINTENANCE ? (
        <div className="maintenance-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Wrench size={64} color="#666" style={{ marginBottom: '20px' }} />
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Payment Portal Under Maintenance</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Currently this payment portal is under maintenance, for enquiries please contact accounts department</p>
          <p style={{ fontSize: '16px', color: '#999' }}>Redirecting to homepage in {countdown} seconds...</p>
        </div>
      ) : (
        <>
          <div className="payment-header">
            <h1 className="payment-heading">Payment</h1>
            <p>Please fill out the form below to complete your payment.</p>
          </div>
          
          {error && (
            <div className="error-message" style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '4px',
              margin: '20px 0',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <div className="payment-grid">
            <div className="payment-form-container">
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name*</label>
                  <input 
                    type="text" 
                    id="customerName" 
                    name="customerName" 
                    value={formData.customerName} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerEmail">Customer Email*</label>
                  <input 
                    type="email" 
                    id="customerEmail" 
                    name="customerEmail" 
                    value={formData.customerEmail} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerAddress">Customer Address*</label>
                  <textarea 
                    id="customerAddress" 
                    name="customerAddress" 
                    rows="3" 
                    value={formData.customerAddress} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="invoiceNo">Invoice No.*</label>
                  <input 
                    type="text" 
                    id="invoiceNo" 
                    name="invoiceNo" 
                    value={formData.invoiceNo} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="invoiceAmount">Invoice Amount ($)*</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    id="invoiceAmount" 
                    name="invoiceAmount" 
                    value={formData.invoiceAmount} 
                    onChange={handleChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                {formData.invoiceAmount && parseFloat(formData.invoiceAmount) > 0 && (
                  <div className="amount-breakdown" style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '4px',
                    margin: '15px 0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Invoice Amount:</span>
                      <span>${parseFloat(formData.invoiceAmount).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Service Charge (2.9% + $0.30):</span>
                      <span>${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #dee2e6', paddingTop: '8px' }}>
                      <span>Total Payable:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="paymentNote">Payment Note</label>
                  <textarea 
                    id="paymentNote" 
                    name="paymentNote" 
                    rows="4" 
                    value={formData.paymentNote} 
                    onChange={handleChange} 
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isLoading}
                  style={{ 
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Processing...' : 'Submit Payment'}
                </button>
              </form>
              
              {status && (
                <p className="status-message" style={{
                  backgroundColor: status.includes('success') ? '#d4edda' : '#fff3cd',
                  color: status.includes('success') ? '#155724' : '#856404',
                  padding: '12px',
                  borderRadius: '4px',
                  margin: '15px 0'
                }}>
                  {status}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isLoading && setIsModalOpen(false)} 
        onConfirm={handleConfirm} 
        title="Confirm Payment Details"
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ marginBottom: '15px' }}>Please confirm the details before proceeding:</p>
          
          <table style={{ width: '100%', borderSpacing: '0 8px' }}>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Customer Name:</td>
              <td>{formData.customerName}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Customer Email:</td>
              <td>{formData.customerEmail}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Customer Address:</td>
              <td>{formData.customerAddress}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Invoice Number:</td>
              <td>{formData.invoiceNo}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Invoice Amount:</td>
              <td>${parseFloat(formData.invoiceAmount).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Service Charge:</td>
              <td>${serviceCharge.toFixed(2)}</td>
            </tr>
            <tr style={{ borderTop: '1px solid #dee2e6' }}>
              <td style={{ fontWeight: 'bold', paddingRight: '20px', paddingTop: '8px' }}>Total Payable:</td>
              <td style={{ fontWeight: 'bold', paddingTop: '8px' }}>${totalAmount.toFixed(2)}</td>
            </tr>
            {formData.paymentNote && (
              <tr>
                <td style={{ fontWeight: 'bold', paddingRight: '20px' }}>Payment Note:</td>
                <td>{formData.paymentNote}</td>
              </tr>
            )}
          </table>
          
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px', 
            marginTop: '20px',
            fontSize: '14px'
          }}>
            <p style={{ margin: '0', textAlign: 'justify' }}>
              <strong>Disclaimer:</strong> By selecting "Confirm & Pay", you will be redirected to a third-party payment processor's website to complete your transaction. Please note that your payment will be processed according to the terms, conditions, and privacy policies of the payment processor. DGMTS does not own or control the website to which you are being redirected.
            </p>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default PaymentPage;