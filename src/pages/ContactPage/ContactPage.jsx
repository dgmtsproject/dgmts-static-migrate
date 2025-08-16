import React, { useState } from 'react';
import './ContactPage.css';
import supabase from '../../supabaseClient'

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
      // Use the Supabase client to invoke the Edge Function to avoid CORS preflight Authorization rejection
      const { error } = await supabase.functions.invoke('send-email', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (error) {
        console.error('Edge function error:', error);
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
    <main className="contact-page">
      <section className="contact-section">
        <h1 className="contact-heading">Contact Us</h1>
        <div className="contact-content">
          <p>Have a question or want to work with us? Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
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
      </section>
    </main>
  );
};

export default ContactPage;
