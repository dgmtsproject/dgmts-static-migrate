import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { sendPaymentEmail } from '../../utils/emailService';
import { checkPaymentPortalSession, getSessionUserData } from '../../utils/paymentPortalAuth';
import './PaymentPage.css';
import { Wrench, X } from 'lucide-react';
import visaLogo from '../../assets/logos/Visa_logo.png';
import mastercardLogo from '../../assets/logos/mastercard.png';
import amexLogo from '../../assets/logos/american-express.png';
import discoverLogo from '../../assets/logos/discover.png';

const API_BASE_URL = 'https://imsite.dullesgeotechnical.com';

const UNDER_MAINTENANCE = false; // Toggle maintenance mode: set to true to enable maintenance mode

const PaymentPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Billing Info, 2: Card Details
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(12);
  const [showCardPopup, setShowCardPopup] = useState(false);

  // Billing Information (Step 1)
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    email: '',
    invoiceNo: '',
    invoiceAmount: '',
    paymentNote: ''
  });

  // Card Details (Step 2)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cardCode: ''
  });

  // Terms acknowledgement
  const [termsAcknowledged, setTermsAcknowledged] = useState(false);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      formattedValue = parts.length ? parts.join(' ') : v;
    }

    // Format expiration date
    if (name === 'expirationDate') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        formattedValue = v.substring(0, 2) + '/' + v.substring(2, 4);
      } else {
        formattedValue = v;
      }
    }

    // Format CVV
    if (name === 'cardCode') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    if (error) setError('');
  };

  const calculateServiceCharge = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;
    return (numAmount * 0.029) + 0.30;
  };

  const calculateTotalAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;
    const serviceCharge = calculateServiceCharge(amount);
    return numAmount + serviceCharge;
  };

  const validateBillingInfo = () => {
    const errors = [];
    
    if (!billingData.firstName.trim()) errors.push('First Name is required');
    if (!billingData.lastName.trim()) errors.push('Last Name is required');
    if (!billingData.address.trim()) errors.push('Address is required');
    if (!billingData.city.trim()) errors.push('City is required');
    if (!billingData.state.trim()) errors.push('State is required');
    if (!billingData.zip.trim()) errors.push('ZIP Code is required');
    if (!billingData.email.trim()) errors.push('Email is required');
    if (!billingData.invoiceNo.trim()) errors.push('Invoice No. is required');
    
    const invoiceAmount = parseFloat(billingData.invoiceAmount);
    if (!billingData.invoiceAmount || isNaN(invoiceAmount) || invoiceAmount <= 0) {
      errors.push('Invoice Amount is required and must be a valid positive number');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (billingData.email && !emailRegex.test(billingData.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!billingData.paymentNote.trim()) {
      errors.push('Description of Services is required');
    }

    return errors;
  };

  const validateCardDetails = () => {
    const errors = [];
    
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.push('Please enter a valid card number');
    }
    if (!cardData.expirationDate || !/^\d{2}\/\d{2}$/.test(cardData.expirationDate)) {
      errors.push('Please enter expiration date in MM/YY format');
    }
    if (!cardData.cardCode || cardData.cardCode.length < 3) {
      errors.push('Please enter a valid CVV');
    }
    if (!termsAcknowledged) {
      errors.push('You must acknowledge the payment terms to proceed');
    }

    return errors;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateBillingInfo();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setTransactionId('');

    const validationErrors = validateCardDetails();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateTotalAmount(billingData.invoiceAmount).toFixed(2), // Send total amount including service charge
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          expirationDate: cardData.expirationDate,
          cardCode: cardData.cardCode,
          firstName: billingData.firstName,
          lastName: billingData.lastName,
          address: billingData.address,
          city: billingData.city,
          state: billingData.state,
          zip: billingData.zip,
          country: billingData.country
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Payment processing failed');
        setIsLoading(false);
        return;
      }

      if (data.status === 'success') {
        setSuccess(true);
        setTransactionId(data.transactionId || '');
        
        // Calculate amounts for database and redirect
        const totalAmount = calculateTotalAmount(billingData.invoiceAmount);
        const customerName = `${billingData.firstName} ${billingData.lastName}`;
        
        // Save payment data to Supabase
        try {
          // Get current time in EST (America/New_York timezone - Georgia, USA)
          const estTime = new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York' 
          });
          const estDate = new Date(estTime);
          
          const { error: dbError } = await supabase
            .from('payments')
            .insert({
              customer_name: customerName,
              customer_email: billingData.email,
              customer_address: `${billingData.address}, ${billingData.city}, ${billingData.state} ${billingData.zip}`,
              invoice_no: billingData.invoiceNo,
              payment_note: billingData.paymentNote || null,
              amount: totalAmount,
              payment_method: 'authorize.net',
              transaction_id: data.transactionId || null,
              status: 'success',
              response: JSON.stringify(data),
              notes: `Auth Code: ${data.authCode || 'N/A'}, Account Type: ${data.accountType || 'N/A'}`,
              environment_type: 'PROD',
              created_at: estDate.toISOString()
            });

          if (dbError) {
            console.error('Error saving payment to database:', dbError);
            // Don't fail the payment if database save fails, just log it
          }

          // Send payment confirmation email
          try {
            const serviceCharge = calculateServiceCharge(billingData.invoiceAmount);
            await sendPaymentEmail(billingData.email, {
              customerName: customerName,
              customerEmail: billingData.email,
              customerAddress: `${billingData.address}, ${billingData.city}, ${billingData.state} ${billingData.zip}`,
              invoiceNo: billingData.invoiceNo,
              paymentNote: billingData.paymentNote || '',
              transactionId: data.transactionId || '',
              amount: totalAmount,
              invoiceAmount: billingData.invoiceAmount,
              serviceCharge: serviceCharge,
              paymentMethod: 'Credit Card'
            });
            console.log('Payment confirmation email sent');
          } catch (emailErr) {
            console.error('Error sending payment confirmation email:', emailErr);
            // Don't fail the payment if email fails, just log it
          }
        } catch (dbErr) {
          console.error('Error saving payment to database:', dbErr);
          // Don't fail the payment if database save fails, just log it
        }

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          try {
            navigate('/success', { 
              state: { 
                transactionId: data.transactionId,
                amount: totalAmount,
                invoiceAmount: billingData.invoiceAmount,
                serviceCharge: calculateServiceCharge(billingData.invoiceAmount),
                invoiceNo: billingData.invoiceNo
              },
              replace: true
            });
          } catch (navError) {
            console.error('Navigation error:', navError);
            // Fallback: use window.location if navigate fails
            window.location.href = '/success';
          }
        }, 2000);
      } else {
        setError(data.error || 'Payment processing failed');
        
        // Save failed payment attempt to Supabase
        try {
          const totalAmount = calculateTotalAmount(billingData.invoiceAmount);
          const customerName = `${billingData.firstName} ${billingData.lastName}`;
          
          // Get current time in EST (America/New_York timezone - Georgia, USA)
          const estTime = new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York' 
          });
          const estDate = new Date(estTime);
          
          await supabase
            .from('payments')
            .insert({
              customer_name: customerName,
              customer_email: billingData.email,
              customer_address: `${billingData.address}, ${billingData.city}, ${billingData.state} ${billingData.zip}`,
              invoice_no: billingData.invoiceNo,
              payment_note: billingData.paymentNote || null,
              amount: totalAmount,
              payment_method: 'authorize.net',
              transaction_id: null,
              status: 'failed',
              response: JSON.stringify(data),
              notes: `Error: ${data.error || 'Payment failed'}`,
              environment_type: 'PROD',
              created_at: estDate.toISOString()
            });
        } catch (dbErr) {
          console.error('Error saving failed payment to database:', dbErr);
        }
      }
    } catch (err) {
      setError(`Payment failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
    setTermsAcknowledged(false);
  };
 
  // Check authentication on component mount
  useEffect(() => {
    const session = checkPaymentPortalSession();
    if (!session || !session.isValid) {
      // User is not authenticated, redirect to login
      navigate('/payment-login');
    } else {
      setIsAuthenticated(true);
      // Optionally, you can pre-fill email from user data
      const userData = getSessionUserData();
      if (userData && userData.email) {
        setBillingData(prev => ({ ...prev, email: userData.email }));
      }
    }
    setAuthLoading(false);
  }, [navigate]);

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

  // Show card popup 2 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCardPopup(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="payment-page bg-texture">
        <section className="payment-section">
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#666' }}>Verifying access...</p>
          </div>
        </section>
      </main>
    );
  }

  // If not authenticated, render nothing (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="payment-page bg-texture">
      {/* Accepted Payment Cards Popup */}
      {showCardPopup && (
        <div className="card-popup-overlay" onClick={() => setShowCardPopup(false)}>
          <div className="card-popup" onClick={(e) => e.stopPropagation()}>
            <button 
              className="card-popup-close" 
              onClick={() => setShowCardPopup(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h3 className="card-popup-title">Accepted Payment Cards</h3>
            <p className="card-popup-subtitle">We accept the following cards</p>
            <div className="card-logos-grid">
              <div className="card-logo-item">
                <img src={visaLogo} alt="Visa" />
              </div>
              <div className="card-logo-item">
                <img src={mastercardLogo} alt="Mastercard" />
              </div>
              <div className="card-logo-item">
                <img src={amexLogo} alt="American Express" />
              </div>
              <div className="card-logo-item">
                <img src={discoverLogo} alt="Discover" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <section className="payment-section">
        {UNDER_MAINTENANCE ? (
          <div className="maintenance-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <Wrench size={64} color="#666" style={{ marginBottom: '20px' }} />
            <h1 style={{ color: '#333', marginBottom: '20px' }}>Payment Portal Under Maintenance</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Currently this payment portal is under maintenance, for enquiries please contact accounts department
            </p>
            <p style={{ fontSize: '16px', color: '#999' }}>
              Redirecting to homepage in {countdown} seconds...
            </p>
          </div>
        ) : (
          <>
            <div className="payment-header">
              <h1 className="payment-heading">Payment</h1>
              <p>Please fill out the form below to complete your payment.</p>
            </div>

        {/* Step Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '30px',
          gap: '20px'
        }}>
          <div style={{
            padding: '10px 20px',
            backgroundColor: step >= 1 ? '#007bff' : '#e9ecef',
            color: step >= 1 ? 'white' : '#6c757d',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Step 1: Billing Information
          </div>
          <div style={{
            padding: '10px 20px',
            backgroundColor: step >= 2 ? '#007bff' : '#e9ecef',
            color: step >= 2 ? 'white' : '#6c757d',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Step 2: Card Details
          </div>
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

        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '4px',
            margin: '20px 0',
            border: '1px solid #c3e6cb'
          }}>
            <h3 style={{ marginTop: 0 }}>Payment Processed Successfully!</h3>
            {transactionId && (
              <p><strong>Transaction ID:</strong> {transactionId}</p>
            )}
            <p>Redirecting to success page...</p>
            <div style={{ marginTop: '10px' }}>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#c3e6cb', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#28a745',
                  animation: 'redirectProgress 2s linear forwards'
                }}></div>
              </div>
            </div>
          </div>
        )}

        <div className="payment-grid">
          <div className="payment-form-container">
            {step === 1 ? (
              // Step 1: Billing Information
              <form onSubmit={handleContinueToPayment} className="payment-form">
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Billing Information</h2>
                
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={billingData.firstName} 
                    onChange={handleBillingChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={billingData.lastName} 
                    onChange={handleBillingChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={billingData.email} 
                    onChange={handleBillingChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address*</label>
                  <textarea 
                    id="address" 
                    name="address" 
                    rows="3" 
                    value={billingData.address} 
                    onChange={handleBillingChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="city">City*</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      value={billingData.city} 
                      onChange={handleBillingChange} 
                      required 
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State*</label>
                    <input 
                      type="text" 
                      id="state" 
                      name="state" 
                      value={billingData.state} 
                      onChange={handleBillingChange} 
                      required 
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="zip">ZIP Code*</label>
                    <input 
                      type="text" 
                      id="zip" 
                      name="zip" 
                      value={billingData.zip} 
                      onChange={handleBillingChange} 
                      required 
                      disabled={isLoading}
                      maxLength="10"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country*</label>
                    <input 
                      type="text" 
                      id="country" 
                      name="country" 
                      value={billingData.country} 
                      onChange={handleBillingChange} 
                      required 
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="invoiceNo">Invoice No.*</label>
                  <input 
                    type="text" 
                    id="invoiceNo" 
                    name="invoiceNo" 
                    value={billingData.invoiceNo} 
                    onChange={handleBillingChange} 
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
                    value={billingData.invoiceAmount} 
                    onChange={handleBillingChange} 
                    required 
                    disabled={isLoading}
                  />
                </div>

                {billingData.invoiceAmount && parseFloat(billingData.invoiceAmount) > 0 && (
                  <div className="amount-breakdown" style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '4px',
                    margin: '15px 0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Invoice Amount:</span>
                      <span>${parseFloat(billingData.invoiceAmount).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Service Charge (2.9% + $0.30):</span>
                      <span>${calculateServiceCharge(billingData.invoiceAmount).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #dee2e6', paddingTop: '8px' }}>
                      <span>Total Payable:</span>
                      <span>${calculateTotalAmount(billingData.invoiceAmount).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="paymentNote">Description of Services*</label>
                  <textarea 
                    id="paymentNote" 
                    name="paymentNote" 
                    rows="4" 
                    value={billingData.paymentNote} 
                    onChange={handleBillingChange} 
                    required
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
                  Continue and Pay
                </button>
              </form>
            ) : (
              // Step 2: Card Details
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Card Details</h2>

                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Payment Summary</h3>
                  <p><strong>Invoice No:</strong> {billingData.invoiceNo}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Invoice Amount:</span>
                    <span>${parseFloat(billingData.invoiceAmount || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Service Charge (2.9% + $0.30):</span>
                    <span>${calculateServiceCharge(billingData.invoiceAmount || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #dee2e6', paddingTop: '8px', marginTop: '8px' }}>
                    <span>Total Payable:</span>
                    <span>${calculateTotalAmount(billingData.invoiceAmount || 0).toFixed(2)}</span>
                  </div>
                  <p style={{ marginTop: '15px', marginBottom: 0 }}>
                    <strong>Billing Address:</strong> {billingData.address}, {billingData.city}, {billingData.state} {billingData.zip}
                  </p>
                </div>


                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number*</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber" 
                    value={cardData.cardNumber} 
                    onChange={handleCardChange} 
                    placeholder="1234 5678 9012 3456"
                    required 
                    disabled={isLoading}
                    maxLength="19"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label htmlFor="expirationDate">Expiration (MM/YY)*</label>
                    <input 
                      type="text" 
                      id="expirationDate" 
                      name="expirationDate" 
                      value={cardData.expirationDate} 
                      onChange={handleCardChange} 
                      placeholder="MM/YY"
                      required 
                      disabled={isLoading}
                      maxLength="5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardCode">CVV*</label>
                    <input 
                      type="password" 
                      id="cardCode" 
                      name="cardCode" 
                      value={cardData.cardCode} 
                      onChange={handleCardChange} 
                      required 
                      disabled={isLoading}
                      maxLength="4"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Acknowledgement */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '20px',
                  marginTop: '20px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ 
                    marginTop: 0, 
                    marginBottom: '15px', 
                    fontSize: '1.1rem',
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    Online Payment Terms
                  </h3>
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#555',
                    marginBottom: '15px',
                    paddingRight: '10px'
                  }}>
                    <p style={{ marginTop: 0, marginBottom: '12px' }}>
                      Our website offers the option to make payments for services rendered, including geotechnical investigations, material testing, inspections, and related consulting work. By submitting a payment through this website, you agree to the following:
                    </p>
                    <ul style={{ 
                      margin: '12px 0', 
                      paddingLeft: '20px',
                      listStyleType: 'disc'
                    }}>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Third-Party Processing:</strong> DGMTS uses secure, third-party payment processors to handle all online transactions.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Processing Fees:</strong> A service fee charged by the third-party processor will be added to the total payment amount. This fee is not retained by DGMTS and is collected directly by the payment processor. The total amount shown during checkout will reflect this additional fee.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Authorized Use:</strong> You confirm that the payment method used is valid and that you are authorized to use it.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Verification:</strong> All transactions are subject to verification, fraud checks, and approval.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Taxes and Charges:</strong> Unless otherwise stated, service prices do not include applicable taxes, which may be added during the payment process.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Refunds:</strong> Payments are non-refundable except as specified in your service agreement or with prior written approval. Any applicable refunds may be subject to administrative deductions or processing delays.
                      </li>
                    </ul>
                    <p style={{ marginTop: '12px', marginBottom: 0 }}>
                      While DGMTS takes all reasonable measures to safeguard your information, we are not liable for any errors, breaches, or failures on the part of third-party processors. By proceeding with payment, you agree to comply with the terms and privacy policies of the third-party provider.
                    </p>
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    <input
                      type="checkbox"
                      checked={termsAcknowledged}
                      onChange={(e) => setTermsAcknowledged(e.target.checked)}
                      disabled={isLoading}
                      style={{
                        marginRight: '10px',
                        marginTop: '3px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        width: '18px',
                        height: '18px',
                        flexShrink: 0
                      }}
                    />
                    <span style={{ color: '#333' }}>
                      I acknowledge that I have read and agree to the Online Payment Terms stated above.*
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="submit-button" 
                    disabled={isLoading}
                    style={{ 
                      backgroundColor: '#6c757d',
                      flex: 1
                    }}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={isLoading || !termsAcknowledged}
                    style={{ 
                      opacity: (isLoading || !termsAcknowledged) ? 0.6 : 1,
                      cursor: (isLoading || !termsAcknowledged) ? 'not-allowed' : 'pointer',
                      flex: 2
                    }}
                  >
                    {isLoading ? 'Processing Payment...' : 'Pay $' + calculateTotalAmount(billingData.invoiceAmount || 0).toFixed(2)}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        </>
        )}
      </section>
    </main>
  );
};

export default PaymentPage;
