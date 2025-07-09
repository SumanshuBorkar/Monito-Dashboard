import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Network error - please check your connection',
      });
    }
    
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

if (process.env.NODE_ENV === 'development') {
  const originalRequest = apiClient.request;
  apiClient.request = async function (config) {
    const delay = Math.random() * 700 + 300;
    await new Promise(resolve => setTimeout(resolve, delay));
    
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
