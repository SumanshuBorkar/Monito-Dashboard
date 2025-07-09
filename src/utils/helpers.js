
export const debounce = (func, wait = 300, immediate = false) => {
    let timeout;
    return function(...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  
  
  export const formatStatus = (status) => {
    const statusMap = {
      online: 'Online',
      degraded: 'Degraded',
      offline: 'Offline'
    };
    return statusMap[status?.toLowerCase()] || status || 'Unknown';
  };
  
 
  export const getStatusClasses = (status, type = 'bg') => {
    const classMap = {
      online: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      degraded: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      offline: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      }
    };
  
    const normalizedStatus = status?.toLowerCase() || 'offline';
    return classMap[normalizedStatus]?.[type] || 
      (type === 'bg' 
        ? 'bg-gray-100 dark:bg-gray-800/30' 
        : 'text-gray-800 dark:text-gray-400');
  };
  

  export const formatDateTime = (dateString, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
  
    return new Date(dateString).toLocaleString(
      navigator.language, 
      { ...defaultOptions, ...options }
    );
  };
  

  export const simulateDelay = (min = 300, max = 1000) => {
    if (process.env.NODE_ENV === 'development') {
      const delay = Math.random() * (max - min) + min;
      return new Promise(resolve => setTimeout(resolve, delay));
    }
    return Promise.resolve();
  };

  export const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      return {
        message: error.response.data?.message || 'Server responded with an error',
        status: error.response.status,
        data: error.response.data
      };
    }
    
    if (error.request) {
      return { message: 'Network error - please check your connection' };
    }
    
    return { message: error.message || 'An unknown error occurred' };
  };
  

  export const optimisticArrayUpdate = (array, item, action = 'update') => {
    switch (action) {
      case 'add':
        return [...array, { ...item, isOptimistic: true }];
      case 'update':
        return array.map(i => i.id === item.id ? { ...i, ...item, isOptimistic: true } : i);
      case 'delete':
        return array.filter(i => i.id !== item.id);
      default:
        return array;
    }
  };
