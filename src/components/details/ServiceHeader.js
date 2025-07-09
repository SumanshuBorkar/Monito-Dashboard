import React from 'react';
import StatusBadge from '../dashboard/StatusBadge';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ServiceHeader = ({ service, onBack }) => {
  if (!service) return null;
  
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{service.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{service.type} Service</p>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(service.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(service.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <StatusBadge status={service.status} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
