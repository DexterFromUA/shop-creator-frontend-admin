import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const EmailLogin = ({ setMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login({ email: userCredential.user.email, name: userCredential.user.displayName || 'User' });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
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
        {error && <div className="error-message">{error}</div>}
        <div className="auth-actions">
          <button type="submit" className="auth-button">Login</button>
          <button type="button" className="auth-button auth-button--secondary" onClick={() => setMode('signup')}>
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailLogin; 