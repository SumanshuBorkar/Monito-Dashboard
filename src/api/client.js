import axios from 'axios';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token (if needed)
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token here if needed
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error - please check your connection',
      });
    }
    
    // Handle different error statuses
    const { status, data } = error.response;
    
    let errorMessage = 'An error occurred';
    if (status >= 500) {
      errorMessage = 'Server error - please try again later';
    } else if (status === 404) {
      errorMessage = 'Resource not found';
    } else if (data && data.message) {
      errorMessage = data.message;
    }
    
    return Promise.reject({
      ...error,
      message: errorMessage,
      status,
    });
  }
);

// Add a method to simulate network delays in development
if (process.env.NODE_ENV === 'development') {
  const originalRequest = apiClient.request;
  apiClient.request = async function (config) {
    // Simulate network delay (300-1000ms)
    const delay = Math.random() * 700 + 300;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 5% error rate
    if (Math.random() < 0.05) {
      return Promise.reject({
        response: {
          status: 500,
          data: { message: 'Simulated server error' }
        }
      });
    }
    
    return originalRequest.call(this, config);
  };
}

export default apiClient;
