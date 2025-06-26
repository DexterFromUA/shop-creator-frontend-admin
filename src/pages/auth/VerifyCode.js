import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import './Auth.css';
import { auth } from '../../firebase';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const phoneNumber = location.state?.phoneNumber;

  // Redirect if no phone number is provided
  React.useEffect(() => {
    if (!phoneNumber) {
      navigate('/auth');
    }
  }, [phoneNumber, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      addToast('Please enter a valid 6-digit code', 'error');
      return;
    }

    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        addToast('No confirmation result. Please restart verification.', 'error');
        return;
      }

      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);

      console.log('USER CRED', userCredential);
      
      // Для Phone auth нужно создать пользователя в нашей системе
      // Пока просто устанавливаем базовую сессию
      const userData = {
        phone: userCredential.user.phoneNumber,
        name: 'Phone User',
        id: userCredential.user.uid,
        emailVerified: false,
        phoneVerified: true,
        role: 'USER'
      };
      
      // Устанавливаем пользователя напрямую (минуем GraphQL для phone auth)
      localStorage.setItem('shop_admin_auth', JSON.stringify(userData));
      localStorage.setItem('shop_admin_token', 'phone_auth_token');
      
      addToast('Phone verification successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Invalid verification code. Please try again.', 'error');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-header">
        <h1 className="auth-title">Enter Verification Code</h1>
        <p className="auth-description">
          We sent a code to {phoneNumber}
        </p>
      </div>
      <div className="auth-box">
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="auth-input"
            maxLength={6}
          />
          <button type="submit" className="auth-button">
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode; 