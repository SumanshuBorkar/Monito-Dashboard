import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import StatusBadge from "../dashboard/StatusBadge"
import * as api from "../../data/services"

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const serviceData = await api.getService(id)
        setService(serviceData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchService()

    const interval = setInterval(fetchService, 5000)
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">Service not found or error loading service details.</p>
          <button onClick={() => navigate("/")} className="mt-2 text-blue-600 hover:text-blue-800 underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate("/")} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Service Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{service.type} Service</p>
              {service.description && <p className="text-gray-600 mt-3 max-w-2xl">{service.description}</p>}
              {service.url && (
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-500">URL: </span>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {service.url}
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <StatusBadge status={service.status} size="lg" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created</h3>
              <p className="mt-1 text-lg text-gray-900">{new Date(service.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{new Date(service.createdAt).toLocaleTimeString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Updated</h3>
              <p className="mt-1 text-lg text-gray-900">{new Date(service.updatedAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{new Date(service.updatedAt).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event History</h2>

          {service.events && service.events.length > 0 ? (
            <div className="space-y-4">
              {service.events
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 ${
                          event.type === "up"
                            ? "bg-green-500"
                            : event.type === "down"
                              ? "bg-red-500"
                              : event.type === "degraded"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.message}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.type === "up"
                              ? "bg-green-100 text-green-800"
                              : event.type === "down"
                                ? "bg-red-100 text-red-800"
                                : event.type === "degraded"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {event.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
              <p className="mt-1 text-sm text-gray-500">No events have been recorded for this service yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
