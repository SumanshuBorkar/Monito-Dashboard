import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ServicesContext } from '../../context/ServicesContext';
import StatusBadge from '../dashboard/StatusBadge';
import EventList from './EventList';
import axios from 'axios';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ServicesContext);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [page, setPage] = useState(1);
  const service = state.services.find(s => s.id === parseInt(id)) || {};

  const fetchEvents = async () => {
    if (!hasMoreEvents || loadingEvents) return;
    
    setLoadingEvents(true);
    try {
      const { data } = await axios.get(`/api/services/${id}/events?page=${page}&limit=20`);
      dispatch({ type: 'APPEND_EVENTS', payload: { id, events: data } });
      setHasMoreEvents(data.length === 20);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (!service.name) {
      // Fetch service if not in cache
      axios.get(`/api/services/${id}`)
        .then(({ data }) => {
          dispatch({ type: 'ADD_SERVICE', payload: data });
        });
    }
    
    fetchEvents();
    
    return () => {
      dispatch({ type: 'CLEAR_EVENTS' });
    };
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-gray-600 mt-1">{service.type} Service</p>
            </div>
            <StatusBadge status={service.status} size="lg" />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1 text-gray-900">October 15, 2023</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-gray-900">Just now</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Events</h2>
          <EventList 
            serviceId={id} 
            loadMore={fetchEvents} 
            hasMore={hasMoreEvents} 
            isLoading={loadingEvents}
          />
        </div>
      </div>
    </div>
  );
}