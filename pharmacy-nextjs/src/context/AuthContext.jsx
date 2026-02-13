'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('session_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setSessionToken(token);
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('session_token');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
      const response = await fetch(`${apiUrl}/modules/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionToken(data.session_token);
        setUser(data.user);
        setJustLoggedIn(true);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('session_token', data.session_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        setTimeout(() => setJustLoggedIn(false), 5000);
        
        return { success: true };
      }
      
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please check your connection.' };
    }
  };

  const logout = useCallback(async () => {
    if (sessionToken) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';
        await fetch(`${apiUrl}/modules/logout.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setUser(null);
    setSessionToken(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
    }
  }, [sessionToken]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      sessionToken, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      justLoggedIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
