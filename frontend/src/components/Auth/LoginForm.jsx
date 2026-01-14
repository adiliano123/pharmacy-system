import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px'
};

const loginBoxStyle = {
  background: 'rgba(255, 255, 255, 0.98)',
  borderRadius: '24px',
  padding: '50px 40px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '450px'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.8rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '5px'
};

const subtitleStyle = {
  margin: 0,
  color: '#718096',
  fontSize: '14px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#2d3748',
  fontSize: '14px',
  fontWeight: '600'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '2px solid #e2e8f0',
  fontSize: '15px',
  transition: 'all 0.2s',
  outline: 'none',
  fontFamily: 'inherit'
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
  background: '#fee',
  border: '1px solid #fcc',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  color: '#c33',
  fontSize: '14px'
};

const infoBoxStyle = {
  marginTop: '25px',
  padding: '15px',
  background: '#f7fafc',
  borderRadius: '10px',
  borderLeft: '4px solid #667eea',
  color: '#4a5568'
};

export default LoginForm;
