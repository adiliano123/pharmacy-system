'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Animated pharmacy elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '80px',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}>💊</div>
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        fontSize: '60px',
        opacity: 0.1,
        animation: 'float 8s ease-in-out infinite'
      }}>🏥</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        fontSize: '70px',
        opacity: 0.1,
        animation: 'float 7s ease-in-out infinite 1s'
      }}>⚕️</div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        fontSize: '50px',
        opacity: 0.1,
        animation: 'float 9s ease-in-out infinite 2s'
      }}>💉</div>
      
      <div style={loginBoxStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '10px' }}>💊</div>
          <h1 style={titleStyle}>Pharmacy ERP System</h1>
          <p style={subtitleStyle}>Employee Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={errorBoxStyle}>
              <span style={{ marginRight: '8px' }}>⚠️</span>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={infoBoxStyle}>
          <p style={{ margin: '5px 0', fontSize: '13px' }}>
            <strong>Default Credentials:</strong>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Username: <code>admin</code> | Password: <code>admin123</code>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Username: <code>pharmacist1</code> | Password: <code>admin123</code>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Username: <code>cashier1</code> | Password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%), url("/pharmacy.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden'
};

const loginBoxStyle = {
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '50px 40px',
  boxShadow: '0 25px 70px rgba(0,0,0,0.3), 0 0 100px rgba(255,255,255,0.2)',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  position: 'relative',
  zIndex: 1,
  animation: 'fadeInUp 0.6s ease'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#ffffff',
  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
  marginBottom: '5px'
};

const subtitleStyle = {
  margin: 0,
  color: '#ffffff',
  fontSize: '14px',
  textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  fontSize: '15px',
  transition: 'all 0.2s',
  outline: 'none',
  fontFamily: 'inherit',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#2d3748'
};

const buttonStyle = {
  width: '100%',
  padding: '14px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '16px',
  transition: 'all 0.3s',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
};

const errorBoxStyle = {
  background: 'rgba(254, 238, 238, 0.9)',
  border: '1px solid rgba(252, 204, 204, 0.8)',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  color: '#c33',
  fontSize: '14px',
  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
};

const infoBoxStyle = {
  marginTop: '25px',
  padding: '15px',
  background: 'rgba(247, 250, 252, 0.8)',
  borderRadius: '10px',
  borderLeft: '4px solid rgba(102, 126, 234, 0.8)',
  color: '#ffffff',
  textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
};

export default LoginForm;
