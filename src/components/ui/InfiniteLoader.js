import React, { useRef, useEffect } from 'react';

const InfiniteLoader = ({ onLoadMore, hasMore, loading, threshold = 0.1, children }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div>
      {children}
      <div ref={loaderRef} className="py-4 flex justify-center">
        {hasMore && loading && (
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
        {!hasMore && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No more items to load
          </p>
        )}
      </div>
    </div>
  );
};

export default InfiniteLoader;
