import React from 'react';

export default function StatusBadge({ status }) {
  const statusColors = {
    Online: 'bg-green-100 text-green-800',
    Degraded: 'bg-yellow-100 text-yellow-800',
    Offline: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
}