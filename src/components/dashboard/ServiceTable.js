import React from 'react';
import ServiceRow from './ServiceRow';
import { SkeletonTableRow } from '../ui/Skeleton';

export default function ServiceTable({ services, loading }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </>
        ) : services.length > 0 ? (
          services.map(service => <ServiceRow key={service.id} service={service} />)
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              No services found
            </td>
          </tr>
        )}
      </tbody>
      </table>
    </div>
  );
}

  