import axios from 'axios';

// Configure axios base URL - adjust this to match your Laravel backend
// Laravel api.php routes are automatically prefixed with /api
// Default to localhost:8000 to match Laravel's default serve command
let API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Ensure baseURL ends with /api (Laravel's api.php routes are prefixed with /api)
if (!API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.endsWith('/')
    ? `${API_BASE_URL}api`
    : `${API_BASE_URL}/api`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (add auth token if needed)
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;

