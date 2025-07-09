import { useState, useEffect } from 'react';

/**
 * Custom React hook to track the visibility state of the current page.
 * Returns `true` if the page is visible, `false` otherwise.
 * It handles server-side rendering (SSR) compatibility.
 *
 * @returns {boolean} - True if the page is visible, false if hidden.
 */
const usePageVisibility = () => {
  // Initialize state based on document.hidden.
  // Use a functional update for useState to ensure it's only computed once,
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
    // Ensure the 'document' object is available before trying to add event listeners.
    if (typeof document === 'undefined') {
      return;
    }

    /**
     * Event handler for the native 'visibilitychange' event.
     * Updates the 'isVisible' state based on 'document.hidden'.
     */
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Add the event listener when the component mounts.
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function: remove the event listener when the component unmounts.
    // This prevents memory leaks.
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount.

  // Return the current visibility status.
  // The consuming component can then use this boolean to conditionally render or execute logic.
  return isVisible;
};

export default usePageVisibility;
