import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API calls
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getSettings: () => api.get('/users/settings'),
  updateSettings: (settingsData) => api.put('/users/settings', settingsData),
};

// Transactions API calls
export const transactionsAPI = {
  getAll: (params = {}) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (transactionData) => api.post('/transactions', transactionData),
  update: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  delete: (id) => api.delete(`/transactions/${id}`),
  getStats: () => api.get('/transactions/stats/summary'),
};

// Invoices API calls
export const invoicesAPI = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (invoiceData) => api.post('/invoices', invoiceData),
  update: (id, invoiceData) => api.put(`/invoices/${id}`, invoiceData),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: () => api.get('/invoices/stats/summary'),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesChart: () => api.get('/dashboard/charts/sales'),
  getPerformanceChart: () => api.get('/dashboard/charts/performance'),
  getPageVisits: () => api.get('/dashboard/page-visits'),
  getSocialTraffic: () => api.get('/dashboard/social-traffic'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getOverview: () => api.get('/dashboard/overview'),
};

// Billing API calls
export const billingAPI = {
  getBillingInfo: () => api.get('/billing/info'),
  addBillingInfo: (billingData) => api.post('/billing/info', billingData),
  updateBillingInfo: (id, billingData) => api.put(`/billing/info/${id}`, billingData),
  deleteBillingInfo: (id) => api.delete(`/billing/info/${id}`),
  getPaymentMethods: () => api.get('/billing/payment-methods'),
  addPaymentMethod: (methodData) => api.post('/billing/payment-methods', methodData),
  deletePaymentMethod: (id) => api.delete(`/billing/payment-methods/${id}`),
  getPaymentHistory: (params = {}) => api.get('/billing/history', { params }),
  getBillingSummary: () => api.get('/billing/summary'),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Remove localStorage user management - fetch from API instead
export const getUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    const response = await api.get('/users/profile');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Event system for profile updates
export const profileUpdateEvent = new EventTarget();

export const dispatchProfileUpdate = (userData) => {
  profileUpdateEvent.dispatchEvent(new CustomEvent('profileUpdated', { detail: userData }));
};

export default api;
