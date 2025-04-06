import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Remove /api since we'll include it in the endpoints
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't handle navigation here - just reject the error
    return Promise.reject(error);
  }
);

export default axiosInstance;