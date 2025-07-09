import { useState, useEffect } from 'react';

const usePageVisibility = () => {

  // and handle environments where 'document' might not be defined (e.g., SSR).
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === 'undefined') {
      // For SSR or environments without a document, assume visible or handle as needed.
      // Returning true is a common default, but you might adjust based on specific SSR needs.
      return true;
    }
    return !document.hidden;
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }


    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); 
  return isVisible;
};

export default usePageVisibility;
