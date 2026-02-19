import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Request interceptor to attach JWT token
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

// Login user
export async function loginUser(data) {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
}

// Register user
export async function registerUser(data) {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
}

// Export axios instance as default
export default api;
