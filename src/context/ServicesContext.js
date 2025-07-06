import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const initialState = {
    services: [],
    filteredServices: [],
    currentService: null,
    events: [], // This is in initialState but not used in the reducer. Consider if it's needed.
    filters: { status: '', search: '' },
    loading: false,
    error: null,
    deletedService: null, // Initialize deletedService
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_SERVICES_REQUEST':
            return { ...state, loading: true, error: null };

        case 'FETCH_SERVICES_SUCCESS':
            return {
                ...state,
                loading: false,
                services: action.payload,
                filteredServices: filterServices(action.payload, state.filters)
            };

        case 'FETCH_SERVICES_FAILURE': // Added missing case
            return { ...state, loading: false, error: action.payload };

        case 'UPDATE_FILTERS':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
                filteredServices: filterServices(state.services, { ...state.filters, ...action.payload })
            };

        case 'UPDATE_STATUSES':
            return {
                ...state,
                services: state.services.map(s => {
                    const updated = action.payload.find(u => u.id === s.id);
                    return updated ? { ...s, status: updated.status } : s;
                }),
                filteredServices: filterServices(
                    state.services.map(s => {
                        const updated = action.payload.find(u => u.id === s.id);
                        return updated ? { ...s, status: updated.status } : s;
                    }),
                    state.filters
                )
            };

        case 'ADD_SERVICE_OPTIMISTIC':
            const newService = {
                ...action.payload,
                isOptimistic: true,
                id: action.payload.id || `temp-${Date.now()}`,
            };
            return {
                ...state,
                services: [...state.services, newService],
                filteredServices: filterServices([...state.services, newService], state.filters),
            };

        case 'CONFIRM_SERVICE':
            return {
                ...state,
                services: state.services.map(s =>
                    s.id === action.payload.tempId ? { ...action.payload.data, id: action.payload.newId, isOptimistic: false } : s // Set isOptimistic to false
                ),
                filteredServices: filterServices(
                    state.services.map(s =>
                        s.id === action.payload.tempId ? { ...action.payload.data, id: action.payload.newId, isOptimistic: false } : s
                    ),
                    state.filters
                ),
            };

        case 'UNDO_ADD': // Added missing case
            return {
                ...state,
                services: state.services.filter(s => s.id !== action.payload),
                filteredServices: filterServices(
                    state.services.filter(s => s.id !== action.payload),
                    state.filters
                ),
            };

        case 'DELETE_SERVICE_OPTIMISTIC':
            return {
                ...state,
                services: state.services.filter(s => s.id !== action.payload),
                filteredServices: filterServices(
                    state.services.filter(s => s.id !== action.payload),
                    state.filters
                ),
                deletedService: state.services.find(s => s.id === action.payload),
            };

        case 'UNDO_DELETE':
            return {
                ...state,
                services: [...state.services, state.deletedService],
                filteredServices: filterServices([...state.services, state.deletedService], state.filters),
                deletedService: null,
            };
        default:
            return state;
    }
}

// Helper function
function filterServices(services, filters) {
    return services.filter(service => {
        const matchesStatus = filters.status ? service.status === filters.status : true;
        const matchesSearch = filters.search
            ? (service.name && service.name.toLowerCase().includes(filters.search.toLowerCase())) // Added check for service.name
            : true;
        return matchesStatus && matchesSearch;
    });
}

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Placeholder for showNotification. You should replace this with your actual notification logic.
    const showNotification = useCallback((message) => {
        console.log('Notification:', message);
        // Example: You might dispatch a global notification action here or use a toast library
    }, []);

    const fetchServices = useCallback(async () => {
        try {
            dispatch({ type: 'FETCH_SERVICES_REQUEST' });
            const { data } = await axios.get('/api/services');
            dispatch({ type: 'FETCH_SERVICES_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_SERVICES_FAILURE', payload: error.message });
        }
    }, []);

    const addService = useCallback(async (serviceData) => {
        const tempId = `temp-${Date.now()}`;
        dispatch({
            type: 'ADD_SERVICE_OPTIMISTIC',
            payload: { ...serviceData, id: tempId, status: 'Online' } // Assuming 'Online' as default status
        });

        try {
            const { data } = await axios.post('/api/services', serviceData);
            dispatch({
                type: 'CONFIRM_SERVICE',
                payload: { tempId, newId: data.id, data }
            });
        } catch (error) {
            dispatch({ type: 'UNDO_ADD', payload: tempId });
            showNotification('Failed to add service: ' + error.message);
        }
    }, [showNotification]); // Dependency added

    const deleteService = useCallback(async (id) => {
        dispatch({ type: 'DELETE_SERVICE_OPTIMISTIC', payload: id });

        try {
            await axios.delete(`/api/services/${id}`);
        } catch (error) {
            dispatch({ type: 'UNDO_DELETE' });
            showNotification('Failed to delete service: ' + error.message);
        }
    }, [showNotification]); // Dependency added

    // Initial fetch
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return (
        <ServicesContext.Provider value={{ state, dispatch, fetchServices, addService, deleteService }}>
            {children}
        </ServicesContext.Provider>
    );
};