import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { auth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {},
        },
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic phone number validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      navigate('/verify', { state: { phoneNumber } });
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
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