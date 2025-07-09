"use client"

import { useState, useContext } from "react"
import { ServicesContext } from "../../context/ServicesContext"
import ServiceTable from "./ServiceTable"
import FilterBar from "./FilterBar"
import ServiceForm from "./ServiceForm"
import StatusSummary from "./StatusSummary"

export default function Dashboard({ showNotification }) {
  const { state } = useContext(ServicesContext)
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor the health of all services in real-time</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="-ml-1 mr-2 text-lg" aria-hidden="true">
            +
          </span>
          Add Service
        </button>
      </div>

      <StatusSummary services={state.services} />
      <FilterBar />

      <div className="mt-6">
        {state.error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error loading services: {state.error}</p>
              </div>
            </div>
          </div>
        ) : (
          <ServiceTable services={state.filteredServices} loading={state.loading} showNotification={showNotification} />
        )}
      </div>

      <ServiceForm isOpen={isFormOpen} close={() => setIsFormOpen(false)} showNotification={showNotification} />
    </div>
  )
}
