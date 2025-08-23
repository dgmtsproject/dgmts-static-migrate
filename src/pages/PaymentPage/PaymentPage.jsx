import { useState } from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    invoiceNo: '',
    invoiceAmount: '',
    paymentNote: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');
    // I'll implement the submission logic later
    console.log(formData);
    setStatus('Payment processed successfully!');
  };

  return (
    <main className="payment-page">
      <section className="payment-section">
        <div className="payment-header">
          <h1 className="payment-heading">Payment</h1>
          <p>Please fill out the form below to complete your payment.</p>
        </div>
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
                ></textarea>
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="invoiceAmount">Invoice Amount*</label>
                <input 
                  type="number" 
                  id="invoiceAmount" 
                  name="invoiceAmount" 
                  value={formData.invoiceAmount} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentNote">Payment Note</label>
                <textarea 
                  id="paymentNote" 
                  name="paymentNote" 
                  rows="4" 
                  value={formData.paymentNote} 
                  onChange={handleChange} 
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Submit Payment</button>
            </form>
            {status && <p className="status-message">{status}</p>}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
