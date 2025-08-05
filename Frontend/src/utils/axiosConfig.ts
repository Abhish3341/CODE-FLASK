import axios from 'axios';

// Ensure the API URL has a protocol
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Check if URL already has a protocol
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return apiUrl;
  }

  // Add https:// protocol by default (more secure), or http:// for localhost
  if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
    return `http://${apiUrl}`;
  }
  
  return `https://${apiUrl}`;
};

// Log the API URL being used
console.log(`🔌 API URL configured as: ${import.meta.env.VITE_API_URL || 'http://localhost:8000'}`);
console.log(`🔌 Resolved API URL: ${getApiUrl()}`);

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 51000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request URL for debugging
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${getApiUrl()}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.message === 'Network Error') {
      console.error('Network error - API server may be down or unreachable');
      console.error(`API URL: ${import.meta.env.VITE_API_URL}`);
      console.log(`Resolved API URL used for requests: ${getApiUrl()}`);
      
      // Provide more helpful error information
      if (getApiUrl().includes('codeflask.live')) {
        console.error('The API domain may not be properly configured or DNS is not resolving.');
        console.error('Try using the deployed API URL or check your network connection.');
      }
    }
    
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;