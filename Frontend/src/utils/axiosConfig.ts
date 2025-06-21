import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Increased timeout
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
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Handle specific status codes
        if (error.response.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please log in again.'));
        }

        if (error.response.status === 500) {
            console.error('Server error:', error.response.data);
            
            // Return safe fallback data for specific endpoints
            if (error.config.url === '/api/problems/stats') {
                return Promise.resolve({
                    data: {
                        problemsSolved: 0,
                        totalProblems: 0,
                        successRate: 0,
                        averageTime: 0,
                        ranking: 0,
                        totalSubmissions: 0,
                        timeSpent: 0,
                        difficultyBreakdown: {
                            easy: { solved: 0, attempted: 0 },
                            medium: { solved: 0, attempted: 0 },
                            hard: { solved: 0, attempted: 0 }
                        },
                        languageBreakdown: {
                            python: { solved: 0, attempted: 0 },
                            javascript: { solved: 0, attempted: 0 },
                            java: { solved: 0, attempted: 0 },
                            cpp: { solved: 0, attempted: 0 }
                        }
                    }
                });
            }

            if (error.config.url === '/api/dashboard') {
                return Promise.resolve({
                    data: {
                        stats: {
                            rank: 0,
                            problemsSolved: 0,
                            totalProblems: 0,
                            totalSubmissions: 0,
                            timeSpent: 0,
                            successRate: 0,
                            averageTime: 0,
                            easyProblems: { solved: 0, attempted: 0 },
                            mediumProblems: { solved: 0, attempted: 0 },
                            hardProblems: { solved: 0, attempted: 0 },
                            languageStats: {
                                python: { solved: 0, attempted: 0 },
                                javascript: { solved: 0, attempted: 0 },
                                java: { solved: 0, attempted: 0 },
                                cpp: { solved: 0, attempted: 0 }
                            }
                        },
                        recentActivity: [],
                        recommendedProblems: [],
                        userLevel: 'Easy'
                    }
                });
            }

            if (error.config.url === '/api/problems') {
                return Promise.resolve({
                    data: []
                });
            }

            return Promise.reject(new Error('An internal server error occurred. Please try again later.'));
        }

        if (error.response.status === 404) {
            return Promise.reject(new Error('Resource not found.'));
        }

        if (error.response.status >= 400 && error.response.status < 500) {
            const message = error.response.data?.error || 'Client error occurred.';
            return Promise.reject(new Error(message));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;