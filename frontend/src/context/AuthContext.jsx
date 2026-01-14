import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(localStorage.getItem('session_token'));

  const logout = useCallback(async () => {
    try {
      if (sessionToken) {
        await authAPI.logout(sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
    }
  }, [sessionToken]);

  const verifySession = useCallback(async () => {
    try {
      const response = await authAPI.verifySession(sessionToken);
      if (response.data.valid) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [sessionToken, logout]);

  useEffect(() => {
    // Verify session on mount
    if (sessionToken) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [sessionToken, verifySession]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      if (response.data.success) {
        const { session_token, user } = response.data;
        setSessionToken(session_token);
        setUser(user);
        localStorage.setItem('session_token', session_token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const value = {
    user,
    sessionToken,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
