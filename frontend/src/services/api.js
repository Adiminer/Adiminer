import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const solveProblem = async (problemData) => {
  try {
    const response = await api.post('/solve', problemData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProblemDetails = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const saveToHistory = async (problemId) => {
  try {
    const response = await api.post('/history', { problemId });
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;