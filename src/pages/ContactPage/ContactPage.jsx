import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import './ContactPage.css';
import { sendContactForm } from '../../utils/emailService'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const { error } = await sendContactForm(
        formData.name,
        formData.email,
        formData.message
      );

      if (error) {
        console.error('Email service error:', error);
        setStatus(`Error: ${error.message || 'Something went wrong'}`);
      } else {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('Error: Could not send message.');
    }
  };

  return (
    <main className="contact-page bg-texture">
      {/* SVG defs for gradient used by icons */}
      <svg width="0" height="0" aria-hidden="true" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="headingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--secondary-color)" />
          </linearGradient>
        </defs>
      </svg>
      <section className="contact-section">
        <div className="contact-header">
          <h1 className="contact-heading">Contact Us</h1>
          <p>Have a question or want to work with us? Fill out the form below or use the contact details provided. We&apos;ll get back to you as soon as possible.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
            {status && <p className="status-message">{status}</p>}
          </div>
          <div className="contact-details">
            <div className="contact-info-item">
              <MapPin size={32} className="contact-icon" stroke="url(#headingGradient)" />
              <h3 className="contact-info-title">Addresses</h3>
              <ul className="address-list">
                <li>14155 Sullyfield Circle, Suite H, Chantilly, VA 20151</li>
                <li>100 M Street SE, Suite 600, Washington, DC 20003</li>
                <li>1001 Prince Georges Blvd, Suite 800, Upper Marlboro, MD 20774</li>
                <li>King Commerce Center, 2046 Exploration Way, Unit A, Hampton, VA 23666.</li>
              </ul>
            </div>
            <div className="contact-info-item">
              <Phone size={32} className="contact-icon" stroke="url(#headingGradient)" />
              <h3 className="contact-info-title">Phone</h3>
              <p>703.488.9953</p>
            </div>
            <div className="contact-info-item">
              <Mail size={32} className="contact-icon" stroke="url(#headingGradient)" />
              <h3 className="contact-info-title">Email</h3>
              <p><a href="mailto:info@dullesgeotechnical.com">info@dullesgeotechnical.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;