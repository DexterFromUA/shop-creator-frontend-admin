import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

const EmailLogin = ({ setMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      addToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.error || 'Invalid email or password.', 'error');
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
          required
        />
        <div className="auth-actions">
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button type="button" className="auth-button auth-button--secondary" onClick={() => setMode('signup')}>
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailLogin; 