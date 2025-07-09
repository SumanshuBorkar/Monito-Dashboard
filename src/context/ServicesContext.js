
import { createContext, useReducer, useEffect, useCallback } from "react"
import * as api from "../data/services"

const initialState = {
  services: [],
  filteredServices: [],
  filters: { status: "", search: "" },
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
        filteredServices: filterServices(action.payload, state.filters),
        loading: false,
        error: null,
      }

    case "ADD_SERVICE":
      const newServices = [...state.services, action.payload]
      return {
        ...state,
        services: newServices,
        filteredServices: filterServices(newServices, state.filters),
      }

    case "UPDATE_SERVICE":
      const updatedServices = state.services.map((s) => (s.id === action.payload.id ? action.payload : s))
      return {
        ...state,
        services: updatedServices,
        filteredServices: filterServices(updatedServices, state.filters),
      }

    case "DELETE_SERVICE":
      const remainingServices = state.services.filter((s) => s.id !== action.payload)
      return {
        ...state,
        services: remainingServices,
        filteredServices: filterServices(remainingServices, state.filters),
      }

    case "UPDATE_FILTERS":
      const newFilters = { ...state.filters, ...action.payload }
      return {
        ...state,
        filters: newFilters,
        filteredServices: filterServices(state.services, newFilters),
      }

    case "RESET_FILTERS":
      const resetFilters = { status: "", search: "" }
      return {
        ...state,
        filters: resetFilters,
        filteredServices: filterServices(state.services, resetFilters),
      }

    default:
      return state
  }
}

function filterServices(services, filters) {
  return services.filter((service) => {
    const matchesStatus = filters.status ? service.status === filters.status : true
    const matchesSearch = filters.search ? service.name.toLowerCase().includes(filters.search.toLowerCase()) : true
    return matchesStatus && matchesSearch
  })
}

export const ServicesContext = createContext()

export const ServicesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchServices = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const services = await api.getAllServices()
      dispatch({ type: "SET_SERVICES", payload: services })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }, [])

  const addService = useCallback(async (serviceData) => {
    try {
      const newService = await api.createService(serviceData)
      dispatch({ type: "ADD_SERVICE", payload: newService })
      return newService
    } catch (error) {
      throw error
    }
  }, [])

  const editService = useCallback(async (id, updates) => {
    try {
      const updatedService = await api.updateService(id, updates)
      dispatch({ type: "UPDATE_SERVICE", payload: updatedService })
      return updatedService
    } catch (error) {
      throw error
    }
  }, [])

  const deleteService = useCallback(async (id) => {
    try {
      await api.deleteService(id)
      dispatch({ type: "DELETE_SERVICE", payload: id })
    } catch (error) {
      throw error
    }
  }, [])

  const updateFilters = useCallback((filters) => {
    dispatch({ type: "UPDATE_FILTERS", payload: filters })
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Refresh services every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchServices, 10000)
    return () => clearInterval(interval)
  }, [fetchServices])

  return (
    <ServicesContext.Provider
      value={{
        state,
        dispatch,
        fetchServices,
        addService,
        editService,
        deleteService,
        updateFilters,
      }}
    >
      {children}
    </ServicesContext.Provider>
  )
}
