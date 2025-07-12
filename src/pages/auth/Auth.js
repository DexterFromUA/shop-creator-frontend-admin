import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import EmailLogin from './EmailLogin';
import EmailSignUp from './EmailSignUp';
import './Auth.css';

function isAppleDevice() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_993_122)">
      <path d="M19.805 10.2305C19.805 9.55078 19.7483 8.86719 19.625 8.19922H10.2V12.0547H15.6016C15.375 13.2812 14.6016 14.332 13.5234 15.0352V17.2852H16.6016C18.4688 15.5703 19.805 13.1719 19.805 10.2305Z" fill="#4285F4"/>
      <path d="M10.2 20C12.6992 20 14.7891 19.1641 16.6016 17.2852L13.5234 15.0352C12.5312 15.7031 11.3047 16.0859 10.2 16.0859C7.78906 16.0859 5.75781 14.3672 5.02344 12.1953H1.84375V14.5156C3.67969 17.7422 6.75781 20 10.2 20Z" fill="#34A853"/>
      <path d="M5.02344 12.1953C4.80469 11.5273 4.6875 10.8203 4.6875 10C4.6875 9.17969 4.80469 8.47266 5.02344 7.80469V5.48438H1.84375C1.22656 6.67969 0.875 8.08594 0.875 10C0.875 11.9141 1.22656 13.3203 1.84375 14.5156L5.02344 12.1953Z" fill="#FBBC05"/>
      <path d="M10.2 3.91406C11.4297 3.91406 12.5391 4.33594 13.4141 5.16406L16.6641 2.02344C14.7891 0.257812 12.6992 0 10.2 0C6.75781 0 3.67969 2.25781 1.84375 5.48438L5.02344 7.80469C5.75781 5.63281 7.78906 3.91406 10.2 3.91406Z" fill="#EA4335"/>
    </g>
    <defs>
      <clipPath id="clip0_993_122">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const urlMode = searchParams.get('mode');
  const { addToast } = useToast();
  const [mode, setMode] = useState(urlMode || 'login');

  const handleGoogleLogin = () => {
    addToast('Google login integration coming soon!', 'info');
  };

  const handleAppleLogin = () => {
    addToast('Apple login is not set up yet.', 'info');
  };

  return (
    <>
      <div className="auth-bg" />
      <div className="auth-page-wrapper">
        <div className="auth-header">
          {mode === 'login' && (
            <>
              <h1 className="auth-title">{inviteToken ? 'Sign in to accept invite' : 'Welcome back'}</h1>
              <p className="auth-description">
                {inviteToken 
                  ? 'Sign in to your account to accept the team invitation and join the store.'
                  : 'Securely log in or create an account to access your Shop Admin dashboard.\nManage your products, orders, and customers all in one place.'
                }
              </p>
            </>
          )}
          {mode === 'signup' && (
            <>
              <h1 className="auth-title">{inviteToken ? 'Create account to accept invite' : 'Create an account'}</h1>
              <p className="auth-description">
                {inviteToken 
                  ? 'Create a new account to accept the team invitation and join the store.'
                  : 'Securely log in or create an account to access your Shop Admin dashboard.\nManage your products, orders, and customers all in one place.'
                }
              </p>
            </>
          )}
        </div>
        <div className="auth-box">
          <div className="auth-top">
            <div className="auth-form-outer">
              {mode === 'login' && <EmailLogin setMode={setMode} />}
              {mode === 'signup' && <EmailSignUp setMode={setMode} />}
            </div>
          </div>
          <div className="auth-bottom">
            <div className="auth-provider-btns-row">
              <button className="auth-provider-btn google-btn" onClick={handleGoogleLogin}>
                <span className="provider-icon"><GoogleIcon /></span>
                <span className="provider-label">Google</span>
              </button>
              {isAppleDevice() && (
                <button className="auth-provider-btn apple-btn" onClick={handleAppleLogin}>
                  <span className="provider-icon"></span>
                  <span className="provider-label">Apple</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth; 