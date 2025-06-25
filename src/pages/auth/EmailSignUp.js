import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const EmailSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      login({ email: userCredential.user.email, name: userCredential.user.displayName || 'User' });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. Email may already be in use.');
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="auth-input"
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="auth-button">Sign Up</button>
      </form>
    </>
  );
};

export default EmailSignUp; 