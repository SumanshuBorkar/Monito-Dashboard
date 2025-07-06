import React, { useContext, useRef, useEffect } from 'react';
import { ServicesContext } from '../../context/ServicesContext';
import { SkeletonEventItem } from '../ui/Skeleton';

export default function EventList({ serviceId, loadMore, hasMore, isLoading }) {
  const { state } = useContext(ServicesContext);
  const loaderRef = useRef();
  const events = state.events[serviceId] || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="space-y-3">
      {isLoading && events.length === 0 ? (
        <>
          <SkeletonEventItem />
          <SkeletonEventItem />
          <SkeletonEventItem />
        </>
      ) : events.map(event => (
        <div key={event.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
          <div className={`w-3 h-3 rounded-full mt-1 ${
            event.type === 'up' ? 'bg-green-500' : 
            event.type === 'down' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">{event.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!hasMore && events.length > 0 && (
        <p className="text-center text-gray-500 py-4">No more events</p>
      )}
      
      {!hasMore && events.length === 0 && (
        <p className="text-center text-gray-500 py-4">No events recorded</p>
      )}
    </div>
  );
}