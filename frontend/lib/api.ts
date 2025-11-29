import axios from 'axios';

// Create an axios instance with default config
export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
