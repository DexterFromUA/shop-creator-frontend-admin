import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { auth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic phone number validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // Clean up previous instance if it exists to avoid conflicts
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    try {
      const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      navigate('/verify', { state: { phoneNumber } });
    } catch (err) {
      console.error('Phone auth error:', err);
      let errorMessage = 'Failed to send verification code. Please try again.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number is not valid. Please include the country code (e.g., +1).';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>📱</div>
        <h2>Enter Phone Number</h2>
        <div className="auth-subtitle">We&rsquo;ll send a verification code to your phone number.</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="auth-input"
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Send Verification Code
          </button>
          <div id="recaptcha-container" />
          <a href="#" style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontSize: '0.98rem', textAlign: 'center', textDecoration: 'underline', display: 'block' }}>
            Need help?
          </a>
        </form>
      </div>
    </div>
  );
};

export default PhoneAuth; 