const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pharmacy-system/api';

export const apiClient = {
  async get(endpoint, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },
};

export default apiClient;
