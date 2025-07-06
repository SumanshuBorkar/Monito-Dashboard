import React, { useContext, useState, useEffect } from 'react';
import { ServicesContext } from '../../context/ServicesContext';
import { debounce } from '../../utils/helpers';

export default function FilterBar() {
  const { state, dispatch } = useContext(ServicesContext);
  const [searchTerm, setSearchTerm] = useState(state.filters.search || '');
  
  // Debounced search
  const handleSearchChange = debounce((value) => {
    dispatch({ 
      type: 'UPDATE_FILTERS', 
      payload: { search: value } 
    });
  }, 300);

  useEffect(() => {
    handleSearchChange(searchTerm);
    return () => handleSearchChange.cancel();
  }, [searchTerm]);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex space-x-3">
        <div>
          <select
            value={state.filters.status || ''}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_FILTERS', 
              payload: { status: e.target.value || null } 
            })}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Degraded">Degraded</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        
        <button
          onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}