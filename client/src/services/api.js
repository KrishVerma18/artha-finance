import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for secure HttpOnly cookie exchange
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred with the financial service.';
    return Promise.reject(new Error(message));
  }
);

export default api;
