import axios from 'axios';
// import { getCookie } from './cookieUtils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://dev.chez.gg/';
// let isFetchingSession = false;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

apiClient.interceptors.request.use(
    async (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request]: ${config.method.toUpperCase()} ${config.url}`, config);
        }
        return config;
    },
    (error) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response]:`, response);
        }
        return response.data;
    },
    async (error) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('[API Response Error]', error);
        }

        if (error.response?.status === 401) {
            // Token refresh ?? 
        }

        const errorData = error.response?.data || {};
        return Promise.reject({
            message: errorData.message || 'Server Error',
            status: error.response?.status,
            details: errorData,
        });
    }
);

const request = async (method, url, data = {}, params = {}, headers = {}) => {
    try {
        const response = await apiClient({
            method,
            url,
            data,
            params,
            headers,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const api = {
    get: (url, params = {}, headers = {}) => request('get', url, {}, params, headers),
    post: (url, data = {}, headers = {}) => request('post', url, data, {}, headers),
    put: (url, data = {}, headers = {}) => request('put', url, data, {}, headers),
    delete: (url, data = {}, headers = {}) => request('delete', url, data, {}, headers),
};

export { apiClient };
export default api;
