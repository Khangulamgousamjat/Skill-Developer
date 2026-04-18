import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 60000, // 60 seconds max to account for backend cold-starts
});

// Utility to pre-warm the server
export const pingServer = () => {
  api.get('/health').catch(() => {
    // Silently fail if health endpoint isn't set up yet, the goal is just to wake the server
  });
};

// Simple in-memory cache
const cache = new Map();

console.log('API URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.method === 'get' && config.cache) {
    const key = config.url + JSON.stringify(config.params);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < 30000) {
      // Return cached response for 30 seconds
      config.adapter = () => Promise.resolve(cached.data);
    }
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
