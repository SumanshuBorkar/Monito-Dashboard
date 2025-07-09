import { useState, useEffect, useContext } from "react"
import { createPortal } from "react-dom"
import { ServicesContext } from "../../context/ServicesContext"

export default function EditServiceForm({ isOpen, close, service, showNotification }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "API",
    description: "",
    url: "",
    status: "active",
  })

  const { editService } = useContext(ServicesContext)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        type: service.type || "API",
        description: service.description || "",
        url: service.url || "",
        status: service.status || "active", 
      })
    }
  }, [service])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await editService(service.id, formData)
      showNotification("Service updated successfully!")
      close()
    } catch (error) {
      showNotification("Failed to update service", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Service</h3>
          <button type="button" onClick={close} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
              Service Name *
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">
              Service Type *
            </label>
            <select
              id="edit-type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isSubmitting}
            >
              <option value="API">API</option>
              <option value="Database">Database</option>
              <option value="Queue">Queue</option>
              <option value="Storage">Storage</option>
              <option value="Cache">Cache</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="2"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700">
              Service URL
            </label>
            <input
              type="url"
              id="edit-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://example.com/api"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isSubmitting}
            >
              <option value="Online">Online</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
