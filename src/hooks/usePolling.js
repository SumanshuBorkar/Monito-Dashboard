import { useEffect, useRef } from 'react';

export default function usePolling(callback, interval = 15000) {
  const savedCallback = useRef();
  const visibilityState = useRef(true);

  // Save callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Setup polling
  useEffect(() => {
    const tick = () => {
      if (visibilityState.current && savedCallback.current) {
        savedCallback.current();
      }
    };
    
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      visibilityState.current = !document.hidden;
      if (visibilityState.current) {
        savedCallback.current?.();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
