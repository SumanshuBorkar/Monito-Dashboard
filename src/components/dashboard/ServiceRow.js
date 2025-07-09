"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import StatusBadge from "./StatusBadge"
import { ServicesContext } from "../../context/ServicesContext"
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline"

export default function ServiceRow({ service, onEdit, showNotification }) {
  const { deleteService } = useContext(ServicesContext)
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/service/${service.id}`)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(service.id)
        showNotification("Service deleted successfully!")
      } catch (error) {
        showNotification("Failed to delete service", "error")
      }
    }
  }

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleViewDetails}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{service.name}</div>
            <div className="text-sm text-gray-500">{service.description || "No description"}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{service.type}</div>
        <div className="text-sm text-gray-500">{service.url || "N/A"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={service.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(service)
            }}
            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
          >
            <PencilIcon className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </button>
          <button onClick={handleDelete} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50">
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
