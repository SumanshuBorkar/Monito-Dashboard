// src/components/ui/Skeleton.js
import React from 'react';

export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-8 bg-gray-200 rounded-md w-24"></div>
    </td>
  </tr>
);

export const SkeletonEventItem = () => (
  <div className="animate-pulse flex items-start p-4 border border-gray-200 rounded-lg">
    <div className="w-3 h-3 rounded-full mt-1 bg-gray-200"></div>
    <div className="ml-4 flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);