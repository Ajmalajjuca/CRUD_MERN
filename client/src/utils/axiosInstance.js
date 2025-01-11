// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Ensure cookies are sent with requests if needed
});

// Add the Axios interceptor for token refresh
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                const refreshResponse = await axios.post('/refresh-token', null, { withCredentials: true });
                const newAccessToken = refreshResponse.data.accessToken;

                // Update the Authorization header with the new token
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry the failed request
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios.request(error.config);
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
