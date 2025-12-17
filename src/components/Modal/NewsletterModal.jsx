
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './NewsletterModal.css'; // Make sure this path is correct
import logo from "../../assets/logos/cropped-logo.png";
const devMode = false;
const NewsletterModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only show modal on homepage
        const isHomepage = location.pathname === '/' || location.pathname === '/home';
        
        if (!isHomepage) {
            return; // Don't show modal if not on homepage
        }

        // if dev mode is on always show the modal
        if (devMode) {
            setIsVisible(true);
        }
        // Check if user has already subscribed (never show again)
        const hasSubscribed = localStorage.getItem('newsletterSubscribed');
        const alreadyShown = sessionStorage.getItem('newsletterModalShown');
        
        if (hasSubscribed || alreadyShown) {
            return; // Don't show if already subscribed or already shown this session
        }
        
        const timer = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem('newsletterModalShown', 'true');
        }, 7000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const closeModal = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !name) {
            alert('Please enter your name and email address.');
            return;
        }
        setIsSubmitting(true);

        const token = `${Date.now()}${Math.random()}`;

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
                    setIsSubmitting(false);
                    closeModal();
                    return;
                } else {
                    // Reactivate inactive subscriber
                    const { error: updateError } = await supabase
                        .from('subscribers')
                        .update({
                            name: name,
                            token: token,
                            is_active: true,
                            date_joined: new Date().toISOString()
                        })
                        .eq('email', email);

                    if (updateError) throw updateError;

                    // Send welcome email
                    try {
                        await supabase.functions.invoke('send-email', {
                            method: 'POST',
                            body: JSON.stringify({
                                type: 'newsletter',
                                name: name,
                                email: email,
                                token: token
                            }),
                        });
                    } catch (emailError) {
                        console.error('Error sending welcome email:', emailError);
                        // Don't fail the subscription if email fails
                    }

                    alert('Welcome back! Your subscription has been reactivated.');
                    // Mark as subscribed so popup never shows again
                    localStorage.setItem('newsletterSubscribed', 'true');
                    closeModal();
                }
            } else {
                // Insert new subscriber
                const { error: insertError } = await supabase
                    .from('subscribers')
                    .insert([
                        {
                            date_joined: new Date().toISOString(),
                            name,
                            email,
                            token,
                            is_active: true
                        },
                    ]);

                if (insertError) throw insertError;

                // Send welcome email
                try {
                    await supabase.functions.invoke('send-email', {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'newsletter',
                            name: name,
                            email: email,
                            token: token
                        }),
                    });
                } catch (emailError) {
                    console.error('Error sending welcome email:', emailError);
                    // Don't fail the subscription if email fails
                }

                alert('Thank you for subscribing!');
                // Mark as subscribed so popup never shows again
                localStorage.setItem('newsletterSubscribed', 'true');
                closeModal();
            }
        } catch (error) {
            console.error('Error with subscription:', error);
            alert('There was an error processing your subscription. Please try again.');
        }

        setIsSubmitting(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`newsletter-modal ${isVisible ? 'show' : ''}`}>
            <div className="newsletter-modal-overlay" onClick={closeModal}></div>
            <div className="newsletter-modal-content">
                <button className="newsletter-modal-close" onClick={closeModal}>&times;</button>
                <div className="newsletter-modal-body">
                    <div className="newsletter-modal-header">
                        <img src={logo} alt="DGMTS Logo" style={{ height: '60px', marginBottom: '15px' }} />
                        <h3 style={{ color: '#003366', marginBottom: '10px' }}>Stay Updated with DGMTS</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Get the latest news, blog posts, and updates from Dulles Geotechnical and Material Testing Services delivered to your inbox.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="newsletter-modal-form">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name" 
                                style={{ width: '100%', padding: '12px 15px', border: '2px solid #ddd', borderRadius: '25px', fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.3s ease' }}
                                required 
                            />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address" 
                                style={{ width: '100%', padding: '12px 15px', border: '2px solid #ddd', borderRadius: '25px', fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.3s ease' }}
                                required 
                            />
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                style={{ width: '100%', background: 'linear-gradient(45deg, #007bff, #0056b3)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.3s ease' }}>
                                {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="newsletter-modal-footer">
                        <p style={{ fontSize: '12px', color: '#999', margin: '15px 0 5px 0', textAlign: 'center' }}>
                            Your email is safe with us. Unsubscribe anytime.
                        </p>
                        <p style={{ fontSize: '11px', color: '#ccc', margin: '0', textAlign: 'center' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); closeModal(); }} style={{ color: '#007bff', textDecoration: 'none' }}>No thanks, maybe later</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterModal;
