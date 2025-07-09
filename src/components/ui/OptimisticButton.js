import React, { useState } from 'react';

export default function OptimisticButton ({
  action,
  onSuccess,
  onError,
  className = '',
  children,
  successMessage = 'Success!',
  errorMessage = 'Error!',
  disabled = false,
  ...props
}){
  const [status, setStatus] = useState('idle'); 
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setStatus('pending');
    try {
      const result = await action();
      setStatus('success');
      setMessage(successMessage);
      if (onSuccess) onSuccess(result);
      
      // Reset status after delay
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setMessage(errorMessage);
      if (onError) onError(error);
      
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getButtonState = () => {
    switch (status) {
      case 'pending':
        return {
          className: 'bg-blue-500 hover:bg-blue-600 opacity-80 cursor-not-allowed',
          children: (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          )
        };
      case 'success':
        return {
          className: 'bg-green-500 hover:bg-green-600',
          children: (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )
        };
      case 'error':
        return {
          className: 'bg-red-500 hover:bg-red-600',
          children: (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )
        };
      default:
        return {
          className: disabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700',
          children
        };
    }
  };

  const buttonState = getButtonState();

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={status === 'pending' || disabled}
      className={`${buttonState.className} ${className} text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center`}
    >
      {buttonState.children}
    </button>
  );
};
