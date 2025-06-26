import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import './Auth.css';
import { auth } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }
    if (!window.recaptchaVerifier && recaptchaContainer) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      window.recaptchaVerifier.render();
      console.log('reCAPTCHA verifier initialized');
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('PhoneAuth handleSubmit called');
    // Basic phone number validation
    if (!phoneNumber || phoneNumber.length < 10) {
      addToast('Please enter a valid phone number', 'error');
      return;
    }
    try {
      const appVerifier = window.recaptchaVerifier;
      console.log('Using appVerifier:', appVerifier);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      console.log('Confirmation result:', confirmationResult);
      addToast('Verification code sent!', 'success');
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
      addToast(errorMessage, 'error');
    }
  };

  // Проверяем доступность Firebase
  if (!auth) {
    return (
      <div className="auth-form">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚧</div>
          <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Phone Auth Not Available
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Firebase is not configured. Please use email authentication.
          </p>
          <button 
            className="auth-button" 
            onClick={() => navigate('/auth')}
          >
            Back to Email Auth
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="recaptcha-container" />
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>📱</div>
      <div className="auth-subtitle">We&rsquo;ll send a verification code to your phone number.</div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="auth-input"
        />
        <button type="submit" className="auth-button">
          Send Verification Code
        </button>
        <a href="#" style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontSize: '0.98rem', textAlign: 'center', textDecoration: 'underline', display: 'block' }}>
          Need help?
        </a>
      </form>
    </>
  );
};

export default PhoneAuth; 