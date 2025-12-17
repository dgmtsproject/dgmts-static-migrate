import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';
import './UnsubscribePage.css';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'not_found'
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const unsubscribe = async () => {
      if (!token && !email) {
        setStatus('error');
        setMessage('Missing unsubscribe link parameters.');
        return;
      }

      try {
        let query = supabase.from('subscribers');

        if (token) {
          query = query.eq('token', token);
        } else if (email) {
          query = query.eq('email', email);
        }

        const { data: subscribers, error: fetchError } = await query.select('*');

        if (fetchError) throw fetchError;

        if (!subscribers || subscribers.length === 0) {
          setStatus('not_found');
          setMessage('Subscriber not found. You may have already unsubscribed.');
          return;
        }

        const subscriber = subscribers[0];

        if (!subscriber.is_active) {
          setStatus('success');
          setMessage('You have already unsubscribed from our newsletter.');
          return;
        }

        // Update subscriber to inactive
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ is_active: false })
          .eq('id', subscriber.id);

        if (updateError) throw updateError;

        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter. We\'re sorry to see you go!');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your unsubscribe request. Please try again later.');
      }
    };

    unsubscribe();
  }, [token, email]);

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-container">
        <div className="unsubscribe-content">
          {status === 'loading' && (
            <>
              <div className="loading-spinner"></div>
              <h2>Processing your request...</h2>
              <p>Please wait while we unsubscribe you from our newsletter.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>Unsubscribed Successfully</h2>
              <p>{message}</p>
              <p className="unsubscribe-note">
                If you change your mind, you can always subscribe again from our website.
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Return to Homepage
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">✗</div>
              <h2>Error</h2>
              <p>{message}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Return to Homepage
              </button>
            </>
          )}

          {status === 'not_found' && (
            <>
              <div className="info-icon">ℹ</div>
              <h2>Not Found</h2>
              <p>{message}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/')}
              >
                Return to Homepage
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;

