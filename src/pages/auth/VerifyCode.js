import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import { auth } from '../../firebase';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const phoneNumber = location.state?.phoneNumber;

  // Redirect if no phone number is provided
  React.useEffect(() => {
    if (!phoneNumber) {
      navigate('/auth');
    }
  }, [phoneNumber, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        setError('No confirmation result. Please restart verification.');
        return;
      }

      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);

      console.log('USER CRED', userCredential);
      login({
        phoneNumber: userCredential.user.phoneNumber,
        name: 'New User',
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Enter Verification Code</h2>
        <p className="auth-subtitle">
          We sent a code to {phoneNumber}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="auth-input"
            maxLength={6}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode; 