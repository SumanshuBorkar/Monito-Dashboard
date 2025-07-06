// src/context/ServicesContext.js (Updated)
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const initialState = {
    services: [],
    filteredServices: [],
    currentService: null,
    events: [],
    filters: { status: '', search: '' },
    loading: false,
    error: null,
    deletedService: null,
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

        case 'FETCH_SERVICES_FAILURE':
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
                    s.id === action.payload.tempId ? { ...action.payload.data, id: action.payload.newId, isOptimistic: false } : s
                ),
                filteredServices: filterServices(
                    state.services.map(s =>
                        s.id === action.payload.tempId ? { ...action.payload.data, id: action.payload.newId, isOptimistic: false } : s
                    ),
                    state.filters
                ),
            };

        case 'UNDO_ADD':
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

        case 'UPDATE_SERVICE': // New case for updating a service
            return {
                ...state,
                services: state.services.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload.updatedData } : s
                ),
                filteredServices: filterServices(
                    state.services.map(s =>
                        s.id === action.payload.id ? { ...s, ...action.payload.updatedData } : s
                    ),
                    state.filters
                ),
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
            ? (service.name && service.name.toLowerCase().includes(filters.search.toLowerCase()))
            : true;
        return matchesStatus && matchesSearch;
    });
}

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const showNotification = useCallback((message) => {
        console.log('Notification:', message);
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
            payload: { ...serviceData, id: tempId, status: 'Online' }
        });

        try {
            const { data } = await axios.post('/api/services', serviceData);
            dispatch({
                type: 'CONFIRM_SERVICE',
                payload: { tempId, newId: data.id, data }
            });
            showNotification('Service added successfully!'); // Added success notification
        } catch (error) {
            dispatch({ type: 'UNDO_ADD', payload: tempId });
            showNotification('Failed to add service: ' + error.message);
        }
    }, [showNotification]);

    const deleteService = useCallback(async (id) => {
        dispatch({ type: 'DELETE_SERVICE_OPTIMISTIC', payload: id });

        try {
            await axios.delete(`/api/services/${id}`);
            showNotification('Service deleted successfully!'); // Added success notification
        } catch (error) {
            dispatch({ type: 'UNDO_DELETE' });
            showNotification('Failed to delete service: ' + error.message);
        }
    }, [showNotification]);

    const editService = useCallback(async (id, updatedData) => {
        try {
            // Optional: Optimistic update for edit
            // dispatch({ type: 'UPDATE_SERVICE_OPTIMISTIC', payload: { id, updatedData } });
            await axios.put(`/api/services/${id}`, updatedData);
            dispatch({ type: 'UPDATE_SERVICE', payload: { id, updatedData } }); // Confirm update
            showNotification('Service updated successfully!'); // Added success notification
        } catch (error) {
            // Optional: Rollback if optimistic update was applied
            // dispatch({ type: 'UNDO_UPDATE_SERVICE', payload: { id, originalData } });
            showNotification('Failed to update service: ' + error.message);
        }
    }, [showNotification]);


    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return (
        <ServicesContext.Provider value={{ state, dispatch, fetchServices, addService, deleteService, editService }}>
            {children}
        </ServicesContext.Provider>
    );
};