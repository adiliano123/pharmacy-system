// API utility functions
import axios from 'axios';
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateSaleInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  CreateStockBatchInput,
  UpdateStockBatchInput,
  SalesReportParams,
  AuditTrailParams,
  RegisterInput,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Generic fetch wrapper
  fetch: async (endpoint: string, options?: RequestInit) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  },

  // Products
  products: {
    getAll: () => api.fetch('/products'),
    getById: (id: number) => api.fetch(`/products/${id}`),
    create: (data: CreateProductInput) => api.fetch('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: UpdateProductInput) => api.fetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => api.fetch(`/products/${id}`, {
      method: 'DELETE',
    }),
  },

  // Sales
  sales: {
    getAll: () => api.fetch('/sales'),
    getById: (id: number) => api.fetch(`/sales/${id}`),
    create: (data: CreateSaleInput) => api.fetch('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Customers
  customers: {
    getAll: () => api.fetch('/customers'),
    getById: (id: number) => api.fetch(`/customers/${id}`),
    create: (data: CreateCustomerInput) => api.fetch('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: UpdateCustomerInput) => api.fetch(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Stock
  stock: {
    getAll: () => api.fetch('/stock'),
    getById: (id: number) => api.fetch(`/stock/${id}`),
    create: (data: CreateStockBatchInput) => api.fetch('/stock', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: UpdateStockBatchInput) => api.fetch(`/stock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => api.fetch(`/stock/${id}`, {
      method: 'DELETE',
    }),
    lowStock: () => api.fetch('/stock/low-stock'),
    expiringSoon: () => api.fetch('/stock/expiring-soon'),
  },

  // Reports
  reports: {
    sales: (params?: SalesReportParams) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return api.fetch(`/reports/sales${query ? `?${query}` : ''}`);
    },
    inventory: () => api.fetch('/reports/inventory'),
    topSelling: (limit?: number) => api.fetch(`/reports/top-selling${limit ? `?limit=${limit}` : ''}`),
    expiry: () => api.fetch('/reports/expiry'),
  },

  // Compliance
  compliance: {
    expiredProducts: () => api.fetch('/compliance/expired-products'),
    auditTrail: (params?: AuditTrailParams) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return api.fetch(`/compliance/audit-trail${query ? `?${query}` : ''}`);
    },
    stockDiscrepancies: () => api.fetch('/compliance/stock-discrepancies'),
    regulatoryReport: () => api.fetch('/compliance/regulatory-report'),
  },

  // Auth
  auth: {
    login: (email: string, password: string) => api.fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    register: (data: RegisterInput) => 
      api.fetch('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () => api.fetch('/logout', { method: 'POST' }),
    me: () => api.fetch('/me'),
  },
};

export { axiosInstance };
