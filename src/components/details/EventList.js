import React, { useContext } from 'react';
import { ServicesContext } from '../../context/ServicesContext';
import { SkeletonEventItem } from '../ui/Skeleton';
import InfiniteLoader from '../ui/InfiniteLoader';
import { formatDateTime } from '../../utils/helpers';

const EventItem = ({ event }) => (
  <div className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div className={`w-3 h-3 rounded-full mt-1 ${
      event.type === 'up' ? 'bg-green-500' : 
      event.type === 'down' ? 'bg-red-500' : 'bg-yellow-500'
    }`}></div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.message}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {formatDateTime(event.timestamp)}
      </p>
    </div>
  </div>
);

export default function EventList({ serviceId, loadMore, hasMore, isLoading }) {
  const { state } = useContext(ServicesContext);
  const events = state.events[serviceId] || [];

  return (
    <div className="space-y-3">
      {/* Loading state for initial load */}
      {isLoading && events.length === 0 ? (
        <>
          <SkeletonEventItem />
          <SkeletonEventItem />
          <SkeletonEventItem />
        </>
      ) : (
        <InfiniteLoader
          onLoadMore={loadMore}
          hasMore={hasMore}
          loading={isLoading}
          threshold={0.1}
        >
          {events.map(event => (
            <EventItem key={event.id} event={event} />
          ))}
        </InfiniteLoader>
      )}

      {/* Empty state */}
      {!isLoading && events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No events recorded for this service</p>
        </div>
      )}
    </div>
  );
}
