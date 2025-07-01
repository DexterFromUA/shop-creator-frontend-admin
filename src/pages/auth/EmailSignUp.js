import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

const EmailSignUp = ({ setMode }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const { register, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    
    const fullName = `${firstName} ${lastName}`.trim();
    const result = await register(email, password, fullName);
    
    if (result.success) {
      addToast('Account created successfully!', 'success');
      
      // If there's an invite token, redirect back to the invite page
      if (inviteToken) {
        navigate(`/invite/${inviteToken}`);
      } else {
        navigate('/stores');
      }
    } else {
      addToast(result.error || 'Failed to create account. Email may already be in use.', 'error');
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="auth-input"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="auth-input"
            required
          />
        </div>
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="auth-input"
          required
        />
        <div className="auth-actions">
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <button type="button" className="auth-button auth-button--secondary" onClick={() => setMode('login')}>
            Already have an account? Login
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailSignUp; 