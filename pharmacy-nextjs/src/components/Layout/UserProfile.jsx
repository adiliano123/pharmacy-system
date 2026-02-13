'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for real-time greeting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getTimeBasedGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Debug: Log current time
    console.log('UserProfile - Current time:', now.toLocaleString());
    console.log('UserProfile - Current hour:', hour);
    
    let greeting = '';
    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good Evening';
    } else {
      greeting = 'Good Evening';
    }
    
    console.log('UserProfile - Selected greeting:', greeting, 'for hour:', hour);
    return greeting;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e';
      case 'pharmacist': return '#3182ce';
      case 'cashier': return '#38a169';
      default: return '#718096';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑';
      case 'pharmacist': return '💊';
      case 'cashier': return '💰';
      default: return '👤';
    }
  };

  return (
    <div style={containerStyle}>
      <div 
        style={profileButtonStyle}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span style={{ fontSize: '24px', marginRight: '10px' }}>
          {getRoleIcon(user.role)}
        </span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: '#2d3748' }}>
            {user.full_name}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: '#fff',
            background: getRoleColor(user.role),
            padding: '2px 8px',
            borderRadius: '10px',
            display: 'inline-block',
            marginTop: '2px',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            {user.role}
          </div>
        </div>
        <span style={{ marginLeft: '10px', fontSize: '12px' }}>▼</span>
      </div>

      {showMenu && (
        <>
          <div 
            style={overlayStyle} 
            onClick={() => setShowMenu(false)}
          />
          <div style={menuStyle}>
            <div style={greetingStyle}>
              {getTimeBasedGreeting()}, {user.full_name}! 👋
            </div>
            <div style={menuItemStyle}>
              <strong>Username:</strong> {user.username}
            </div>
            {user.email && (
              <div style={menuItemStyle}>
                <strong>Email:</strong> {user.email}
              </div>
            )}
            <div style={menuItemStyle}>
              <strong>Current Time:</strong> {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
            <button 
              onClick={handleLogout}
              style={logoutButtonStyle}
            >
              🚪 Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const greetingStyle = {
  padding: '10px 0',
  fontSize: '14px',
  fontWeight: '600',
  color: '#667eea',
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '10px'
};

const containerStyle = {
  position: 'relative'
};

const profileButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  background: '#fff',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s',
  border: '2px solid transparent'
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999
};

const menuStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '10px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  padding: '15px',
  minWidth: '250px',
  zIndex: 1000,
  border: '1px solid #e2e8f0'
};

const menuItemStyle = {
  padding: '8px 0',
  fontSize: '13px',
  color: '#4a5568'
};

const logoutButtonStyle = {
  width: '100%',
  padding: '10px',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s'
};

export default UserProfile;
