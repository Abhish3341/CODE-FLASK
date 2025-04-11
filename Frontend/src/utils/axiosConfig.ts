import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000
});

// Add request interceptor
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

// Add response interceptor with better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
            // Return default stats data if stats endpoint fails
            if (error.config.url === '/api/problems/stats') {
                return Promise.resolve({
                    data: {
                        problemsSolved: 0,
                        totalProblems: 0,
                        successRate: 0,
                        averageTime: 0,
                        ranking: 0
                    }
                });
            }
            return Promise.reject(new Error('An internal server error occurred. Please try again later.'));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;