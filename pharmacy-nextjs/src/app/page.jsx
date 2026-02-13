'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, loading, justLoggedIn } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
        // Show welcome screen for 2 seconds if just logged in
        if (justLoggedIn) {
          setShowWelcome(true);
          setTimeout(() => {
             
            redirectToDashboard();
          }, 2000);
        } else {
          // Redirect immediately if already logged in
          redirectToDashboard();
        }
      }
    }
  }, [isAuthenticated, user, loading, justLoggedIn, router, redirectToDashboard]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redirectToDashboard = () => {
    switch (user?.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'pharmacist':
        router.push('/pharmacist');
        break;
      case 'cashier':
        router.push('/cashier');
        break;
      default:
        router.push('/login');
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return '👑';
      case 'pharmacist':
        return '💊';
      case 'cashier':
        return '💰';
      default:
        return '👤';
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'pharmacist':
        return 'Pharmacist';
      case 'cashier':
        return 'Cashier';
      default:
        return 'User';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (showWelcome && user) {
    return (
      <div style={welcomeContainerStyle}>
        <div style={welcomeCardStyle}>
          <div style={iconContainerStyle}>
            <div style={roleIconStyle}>{getRoleIcon()}</div>
          </div>
          
          <h1 style={greetingStyle}>{getGreeting()}!</h1>
          <h2 style={nameStyle}>{user.full_name}</h2>
          
          <div style={roleTagStyle}>
            <span style={roleTextStyle}>{getRoleTitle()}</span>
          </div>
          
          <p style={messageStyle}>
            Welcome to Pharmacy ERP System
          </p>
          
          <div style={loadingContainerStyle}>
            <div style={spinnerStyle}></div>
            <p style={loadingTextStyle}>Loading your dashboard...</p>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div style={floatingIcon1}>💊</div>
        <div style={floatingIcon2}>🏥</div>
        <div style={floatingIcon3}>⚕️</div>
        <div style={floatingIcon4}>💉</div>
      </div>
    );
  }

  return (
    <div style={loadingContainerFullStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={logoStyle}>💊</div>
        <h2 style={titleStyle}>Pharmacy ERP System</h2>
        <div style={spinnerStyle}></div>
        <p style={loadingTextStyle}>Loading...</p>
      </div>
    </div>
  );
}

// Styles
const welcomeContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden'
};

const welcomeCardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '60px 80px',
  textAlign: 'center',
  boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
  animation: 'fadeInUp 0.6s ease',
  position: 'relative',
  zIndex: 1,
  maxWidth: '500px'
};

const iconContainerStyle = {
  marginBottom: '30px'
};

const roleIconStyle = {
  fontSize: '80px',
  animation: 'bounce 1s ease infinite'
};

const greetingStyle = {
  margin: '0 0 10px 0',
  fontSize: '2rem',
  color: '#2d3748',
  fontWeight: '600'
};

const nameStyle = {
  margin: '0 0 20px 0',
  fontSize: '1.8rem',
  color: '#667eea',
  fontWeight: '700'
};

const roleTagStyle = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '10px 30px',
  borderRadius: '50px',
  marginBottom: '20px'
};

const roleTextStyle = {
  color: '#fff',
  fontWeight: '600',
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const messageStyle = {
  color: '#718096',
  fontSize: '16px',
  marginBottom: '30px'
};

const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #e2e8f0',
  borderTop: '4px solid #667eea',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
  color: '#718096',
  fontSize: '14px',
  margin: 0
};

const loadingContainerFullStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff'
};

const logoStyle = {
  fontSize: '80px',
  marginBottom: '20px',
  animation: 'bounce 1s ease infinite'
};

const titleStyle = {
  fontSize: '2rem',
  marginBottom: '30px',
  fontWeight: '600'
};

const floatingIcon1 = {
  position: 'absolute',
  top: '10%',
  left: '10%',
  fontSize: '80px',
  opacity: 0.1,
  animation: 'float 6s ease-in-out infinite'
};

const floatingIcon2 = {
  position: 'absolute',
  top: '70%',
  right: '15%',
  fontSize: '60px',
  opacity: 0.1,
  animation: 'float 8s ease-in-out infinite'
};

const floatingIcon3 = {
  position: 'absolute',
  bottom: '15%',
  left: '20%',
  fontSize: '70px',
  opacity: 0.1,
  animation: 'float 7s ease-in-out infinite 1s'
};

const floatingIcon4 = {
  position: 'absolute',
  top: '30%',
  right: '10%',
  fontSize: '50px',
  opacity: 0.1,
  animation: 'float 9s ease-in-out infinite 2s'
};
