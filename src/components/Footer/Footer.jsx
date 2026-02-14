import React, { useState, useEffect } from 'react';
import './Footer.css';
import swamImg from '../../assets/logos/swam.png';
import mbeImg from '../../assets/logos/mbe.png';
import dbeImg from '../../assets/logos/dbe.png';
import geo5Img from '../../assets/logos/geo5-logo.png';
import logoIcon from '../../assets/logos/logo-icon.png';
import tpBgLogo from '../../assets/logos/cropped-logo-transparent.png';
import { supabase } from '../../supabaseClient';
import { sendNewsletterWelcome } from '../../utils/emailService';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState(null);

  useEffect(() => {
    // Check if user is subscribed
    const savedEmail = localStorage.getItem('subscriberEmail');
    if (savedEmail) {
      setSubscribedEmail(savedEmail);
    }

    // Listen for storage changes (e.g., when unsubscribed in another tab or page)
    const handleStorageChange = (e) => {
      if (e.key === 'subscriberEmail') {
        setSubscribedEmail(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-page updates)
    const handleUnsubscribe = () => {
      setSubscribedEmail(null);
    };

    window.addEventListener('unsubscribed', handleUnsubscribe);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unsubscribed', handleUnsubscribe);
    };
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!email.trim()) {
          alert('Please fill the email field.')
          setIsSubmitting(false);
          return
        }
    
        try {
          // First, check if email already exists
          const { data: existingSubscriber, error: checkError } = await supabase
            .from('subscribers')
            .select('email, is_active')
            .eq('email', email)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 is "not found" error, which is expected if email doesn't exist
            throw checkError;
          }

          if (existingSubscriber) {
            if (existingSubscriber.is_active) {
              alert('This email is already subscribed to our newsletter!');
              setEmail('');
              setIsSubmitting(false);
              return;
            } else {
              // Reactivate inactive subscriber
              const reactivateToken = `${Date.now()}${Math.random()}`;
              const { error: updateError } = await supabase
                .from('subscribers')
                .update({
                  is_active: true,
                  token: reactivateToken,
                  date_joined: new Date().toISOString()
                })
                .eq('email', email);

              if (updateError) throw updateError;

              // Send welcome email
              try {
                await sendNewsletterWelcome(
                  email,
                  email.split('@')[0], // Use email prefix as name if no name provided
                  reactivateToken
                );
              } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
                // Don't fail the subscription if email fails
              }

              alert('Welcome back! Your subscription has been reactivated.');
              localStorage.setItem('subscriberEmail', email);
              setSubscribedEmail(email);
              setEmail('');
            }
          } else {
            // Insert new subscriber
            const newToken = `${Date.now()}${Math.random()}`;
            const { error } = await supabase
              .from('subscribers')
              .insert([
                {
                  email: email,
                  date_joined: new Date().toISOString(),
                  is_active: true,
                  token: newToken
                }
              ])

            if (error) throw error

            // Send welcome email
            try {
              await sendNewsletterWelcome(
                email,
                email.split('@')[0], // Use email prefix as name if no name provided
                newToken
              );
            } catch (emailError) {
              console.error('Error sending welcome email:', emailError);
              // Don't fail the subscription if email fails
            }

            alert('Thank you for subscribing to our newsletter!');
            localStorage.setItem('subscriberEmail', email);
            setSubscribedEmail(email);
            setEmail('');
          }

          setIsSubmitting(false);
    
        } catch (err) {
          console.error('Error subscribing:', err)
          alert('There was an error subscribing to the newsletter. Please try again.');
          setIsSubmitting(false);
        }
  };

  // Quick links for footer (simple site navigation)
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services/geotechnical' },
    { name: 'Engineering Updates', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Company Info & Social */}
            <div className="footer-section footer-about">
              <div className="footer-company-info">
                <div className="footer-branding">
                  <img src={tpBgLogo} className="footer-logo" alt="DGMTS Logo" />
                  <div className="footer-brand" role="heading" aria-level="2">DGMTS</div>
                </div>
                <p className="footer-description">
                  DGMTS ensures nondiscrimination in all programs and activities in accordance with Title VI of the Civil Rights Act of 1964.
                </p>
                <p className="footer-description">
                  If you need more information or special assistance for persons with disabilities or limited English proficiency,
                  contact the Human Resources Department at{' '}
                  <a href="tel:7034889953" className="footer-link">703.488.9953</a> or{' '}
                  <a href="mailto:info@dullesgeotechnical.com" className="footer-link">info@dullesgeotechnical.com</a>.
                </p>

                {/* Social Media */}
                <div className="footer-social">
                  <a href="https://www.linkedin.com/in/dullesgeotechnical/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.81C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/dullesgeotech/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>

                {/* Certification Logos */}
                <div className="footer-certifications">
                  <img 
                    src={swamImg} 
                    alt="SWAM Certification" 
                    className="cert-logo"
                  />
                  <img 
                    src={mbeImg} 
                    alt="MBE Certification" 
                    className="cert-logo"
                  />
                  <img 
                    src={dbeImg} 
                    alt="DBE Certification" 
                    className="cert-logo"
                  />
                  <img 
                    src={geo5Img} 
                    alt="Geo5 Authorized Partner" 
                    className="cert-logo geo5-logo"
                  />
                </div>
              </div>
            </div>

            {/* Services & Contact */}
            <div className="footer-section footer-services-contact">
              <div className="services-contact-grid">
                {/* Quick Links Column (single column) */}
                <div className="services-column">
                  <h3 className="footer-title">Quick Links</h3>
                  <ul className="footer-links">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link.path} className="footer-link">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="contact-column">
                  <h3 className="footer-title">Contact Us</h3>
                  <div className="contact-info">
                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>14155 Sullyfield Circle, Suite H, Chantilly, VA 20151</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>100 M Street SE, Suite 600, Washington, DC 20003</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>1001 Prince Georges Blvd, Suite 800, Upper Marlboro, MD 20774</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>2024 Exploration Way, Hampton, VA, 23666</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>
                          <a href="tel:7034889953" className="footer-link">703.488.9953</a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="contact-text">
                        <p>
                          <a href="mailto:info@dullesgeotechnical.com" className="footer-link">
                            info@dullesgeotechnical.com
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Newsletter Signup/Unsubscribe */}
                    <div className="newsletter-signup">
                      {subscribedEmail ? (
                        <>
                          <h5 className="newsletter-title">Newsletter</h5>
                          <p className="newsletter-subscribed">
                            ✓ You're subscribed with: <strong>{subscribedEmail}</strong>
                          </p>
                          <a 
                            href={`/unsubscribe?email=${encodeURIComponent(subscribedEmail)}`}
                            className="unsubscribe-link"
                          >
                            Unsubscribe
                          </a>
                        </>
                      ) : (
                        <>
                          <h5 className="newsletter-title">Newsletter Signup</h5>
                          <form onSubmit={handleNewsletterSubmit} className="newsletter-form" aria-label="Newsletter form">
                            <div className="input-group">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="newsletter-input"
                                required
                                aria-label="Email address"
                              />
                              <button type="submit" disabled={isSubmitting} className="newsletter-button" aria-label="Subscribe">
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                              </button>
                            </div>
                            <p className="newsletter-disclaimer">
                              Get notified about news and updates.
                            </p>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright">
        <div className="container">
          <div className="copyright-content">
            <p>
              © Copyright 2025 DGMTS | 
              <a href="/terms-and-conditions" className="footer-link"> Terms and Conditions</a> | 
              <a href="/privacy-policy" className="footer-link"> Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;