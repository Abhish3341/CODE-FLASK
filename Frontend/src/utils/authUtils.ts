import axios from 'axios';

export const refreshToken = async () => {
    try {
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) {
            throw new Error('No token found');
        }

        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                }
            }
        );

        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            return response.data.token;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    }
};