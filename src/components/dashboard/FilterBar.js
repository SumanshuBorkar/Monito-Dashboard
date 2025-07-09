import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ServicesContext } from '../../context/ServicesContext';
import { debounce } from '../../utils/helpers'; // Ensure this exports a NAMED 'debounce' function with .cancel()

export default function FilterBar() {
  const { state, dispatch } = useContext(ServicesContext);
  const [searchTerm, setSearchTerm] = useState(state.filters.search || '');

  // Use useRef to create a stable debounced function instance across renders.
  // This prevents 'handleSearchChange' from being redefined on every render,
  // ensuring the useEffect dependency array is stable and cleanup works correctly.
  const debouncedDispatchSearch = useRef(
    debounce((value) => {
      dispatch({
        type: 'UPDATE_FILTERS',
        payload: { search: value }
      });
    }, 300) // 300ms debounce delay
  ).current;

  // Effect to trigger the debounced search whenever searchTerm changes.
  // The cleanup function ensures any pending debounced calls are cancelled
  // if the component unmounts or searchTerm changes before the delay.
  useEffect(() => {
    // Only dispatch if the searchTerm actually changes from the current filter state
    // to prevent unnecessary dispatches on initial render if values are already the same.
    if (searchTerm !== state.filters.search) {
      debouncedDispatchSearch(searchTerm);
    }

    // Cleanup function: cancel any pending debounced calls when the effect re-runs or component unmounts.
    return () => {
      // Ensure the cancel method exists before calling it (good defensive practice)
      if (debouncedDispatchSearch && typeof debouncedDispatchSearch.cancel === 'function') {
        debouncedDispatchSearch.cancel();
      }
    };
  }, [searchTerm, debouncedDispatchSearch, state.filters.search]); // Add dependencies for clarity and correctness

  // Memoized change handler for the search input to prevent unnecessary re-renders
  const handleSearchInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []); // No dependencies needed as it only updates local state

  // Memoized change handler for the status select
  const handleStatusChange = useCallback((e) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: { status: e.target.value || null } // Use null for 'All Statuses' or empty string based on your reducer logic
    });
  }, [dispatch]); // dispatch is stable, but good practice to include

  // Memoized click handler for the Reset button
  const handleResetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' }); // Assuming you have this action type in your reducer
    setSearchTerm(''); // Also reset the local search term state
  }, [dispatch]);

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
            onChange={handleSearchInputChange} // Use the memoized handler
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm p-2 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex space-x-3">
        <div>
          <select
            value={state.filters.status || ''}
            onChange={handleStatusChange} // Use the memoized handler
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Degraded">Degraded</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters} // Use the memoized handler
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
