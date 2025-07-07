import axios from 'axios';

// Ensure the API URL has a protocol
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Check if URL already has a protocol
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return apiUrl;
  }
  
  // Add http:// protocol if missing (for localhost development)
  return `http://${apiUrl}`;
};

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request URL for debugging
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
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
      console.error(`Resolved API URL: ${getApiUrl()}`);
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