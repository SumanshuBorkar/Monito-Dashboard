import { useCallback, useContext } from 'react';
import { ServicesContext } from '../context/ServicesContext';
import apiClient from '../api/client';

const useOptimisticCRUD = () => {
  const { state, dispatch } = useContext(ServicesContext);

  const createService = useCallback(async (serviceData) => {
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic update
    dispatch({
      type: 'ADD_SERVICE_OPTIMISTIC',
      payload: { ...serviceData, id: tempId, status: 'Online', isOptimistic: true }
    });

    try {
      const { data } = await apiClient.post('/services', serviceData);
      // Replace temp ID with real ID
      dispatch({ 
        type: 'CONFIRM_SERVICE', 
        payload: { tempId, service: data } 
      });
      return data;
    } catch (error) {
      // Rollback on error
      dispatch({ type: 'UNDO_CREATE', payload: tempId });
      throw error;
    }
  }, [dispatch]);

  const updateService = useCallback(async (id, updates) => {
    const originalService = state.services.find(s => s.id === id);
    
    // Optimistic update
    dispatch({
      type: 'UPDATE_SERVICE_OPTIMISTIC',
      payload: { id, updates, isOptimistic: true }
    });

    try {
      const { data } = await apiClient.put(`/services/${id}`, updates);
      dispatch({ 
        type: 'CONFIRM_UPDATE', 
        payload: { id, service: data } 
      });
      return data;
    } catch (error) {
      // Rollback on error
      dispatch({ 
        type: 'REVERT_UPDATE', 
        payload: { id, service: originalService } 
      });
      throw error;
    }
  }, [dispatch, state.services]);

  const deleteService = useCallback(async (id) => {
    const serviceToDelete = state.services.find(s => s.id === id);
    
    // Optimistic update
    dispatch({ type: 'DELETE_SERVICE_OPTIMISTIC', payload: id });

    try {
      await apiClient.delete(`/services/${id}`);
      dispatch({ type: 'CONFIRM_DELETE', payload: id });
    } catch (error) {
      // Rollback on error
      dispatch({ 
        type: 'UNDO_DELETE', 
        payload: serviceToDelete 
      });
      throw error;
    }
  }, [dispatch, state.services]);

  return {
    createService,
    updateService,
    deleteService,
    isOptimistic: (id) => {
      const service = state.services.find(s => s.id === id);
      return service?.isOptimistic || false;
    }
  };
};

export default useOptimisticCRUD;
