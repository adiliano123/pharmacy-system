import axios from 'axios';

const API_BASE_URL = 'http://localhost/pharmacy-system/api/modules';

// Create axios instance with interceptor for auth token
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (expired session)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    axios.post(`${API_BASE_URL}/login.php`, { username, password }),
  logout: (token) => 
    axios.post(`${API_BASE_URL}/logout.php`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  verifySession: (token) => 
    axios.get(`${API_BASE_URL}/verify_session.php`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const inventoryAPI = {
  getAll: () => apiClient.get('/get_inventory.php'),
  addMedicine: (data) => apiClient.post('/add_medicine.php', data),
  dispense: (inventoryId, qty, customerName = null, notes = null) => 
    apiClient.post('/dispense.php', {
      inventory_id: inventoryId,
      qty: parseInt(qty),
      customer_name: customerName,
      notes: notes
    })
};

export const salesAPI = {
  getAll: () => apiClient.get('/get_sales.php'),
  getEmployeeSales: () => apiClient.get('/get_employee_sales.php')
};
