import { setupWorker } from "msw/browser"
import { http, HttpResponse } from "msw"

let services = [
  {
    id: 1,
    name: "User Authentication API",
    type: "API",
    status: "Online",
    description: "Handles user login and registration",
    url: "https://api.example.com/auth",
    createdAt: "2025-07-01T08:00:00Z",
    updatedAt: new Date().toISOString(),
    events: [
      { id: 1, type: "up", timestamp: "2025-07-01T08:00:00Z", message: "Service deployed" },
      { id: 2, type: "degraded", timestamp: "2025-07-02T09:15:00Z", message: "Performance issues detected" },
    ],
  },
  {
    id: 2,
    name: "Payment Processing",
    type: "API",
    status: "Degraded",
    description: "Processes payments and transactions",
    url: "https://api.example.com/payments",
    createdAt: "2025-06-25T11:00:00Z",
    updatedAt: new Date().toISOString(),
    events: [
      { id: 3, type: "up", timestamp: "2025-06-25T11:00:00Z", message: "Service deployed" },
      { id: 4, type: "down", timestamp: "2025-06-28T10:00:00Z", message: "Service outage detected" },
      { id: 5, type: "degraded", timestamp: "2025-06-29T14:30:00Z", message: "Partial service restoration" },
    ],
  },
  {
    id: 3,
    name: "Database Cluster",
    type: "Database",
    status: "Online",
    description: "Primary database cluster",
    url: "db.example.com:5432",
    createdAt: "2025-06-20T09:00:00Z",
    updatedAt: new Date().toISOString(),
    events: [{ id: 6, type: "up", timestamp: "2025-06-20T09:00:00Z", message: "Database cluster initialized" }],
  },
]

setInterval(() => {
  services = services.map((service) => {
    if (Math.random() < 0.15) {
      const statuses = ["Online", "Degraded", "Offline"]
      const currentIndex = statuses.indexOf(service.status)
      const availableStatuses = statuses.filter((_, index) => index !== currentIndex)
      const newStatus = availableStatuses[Math.floor(Math.random() * availableStatuses.length)]

      const event = {
        id: Date.now() + Math.random(),
        type: newStatus.toLowerCase() === "online" ? "up" : newStatus.toLowerCase() === "offline" ? "down" : "degraded",
        timestamp: new Date().toISOString(),
        message: `Status changed to ${newStatus}`,
      }

      return {
        ...service,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        events: [...(service.events || []), event],
      }
    }
    return service
  })
}, 15000)

const simulateNetwork = (responseData, options = {}) => {
  const shouldError = Math.random() < (options.errorRate || 0.05) 
  const delay = Math.random() * 700 + 300 

  if (shouldError) {
    return HttpResponse.json({ message: "Simulated server error" }, { status: 500, delay })
  }

  return HttpResponse.json(responseData, { delay })
}

// API handlers
export const handlers = [
  http.get("/api/services", ({ request }) => {
    console.log("MSW: Intercepting GET /api/services")

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const search = url.searchParams.get("search") || url.searchParams.get("name_like")
    const fields = url.searchParams.get("fields")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    let result = [...services]

    if (status) {
      result = result.filter((s) => s.status === status)
    }
    if (search) {
      result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (fields) {
      const fieldList = fields.split(",")
      result = result.map((service) => {
        const filtered = {}
        fieldList.forEach((field) => {
          if (service[field] !== undefined) {
            filtered[field] = service[field]
          }
        })
        return filtered
      })
    }

    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)

    return simulateNetwork({
      services: paginated,
      total: result.length,
      page,
      limit,
    })
  }),

  http.get("/api/services/status", () => {
    console.log("MSW: Intercepting GET /api/services/status")

    const statuses = services.map(({ id, status, updatedAt }) => ({
      id,
      status,
      updatedAt,
    }))
    return simulateNetwork(statuses)
  }),

  http.get("/api/services/:id", ({ params }) => {
    console.log(`MSW: Intercepting GET /api/services/${params.id}`)

    const service = services.find((s) => s.id === Number.parseInt(params.id))
    if (!service) {
      return HttpResponse.json({ message: "Service not found" }, { status: 404 })
    }
    return simulateNetwork(service)
  }),

  http.post("/api/services", async ({ request }) => {
    console.log("MSW: Intercepting POST /api/services")

    try {
      const serviceData = await request.json()
      const newService = {
        ...serviceData,
        id: services.length ? Math.max(...services.map((s) => s.id)) + 1 : 1,
        status: "Online",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        events: [
          {
            id: Date.now(),
            type: "up",
            timestamp: new Date().toISOString(),
            message: "Service created and deployed",
          },
        ],
      }

      services.push(newService)
      return simulateNetwork(newService)
    } catch (error) {
      return HttpResponse.json({ message: "Invalid request data" }, { status: 400 })
    }
  }),

  http.put("/api/services/:id", async ({ params, request }) => {
    console.log(`MSW: Intercepting PUT /api/services/${params.id}`)

    const service = services.find((s) => s.id === Number.parseInt(params.id))
    if (!service) {
      return HttpResponse.json({ message: "Service not found" }, { status: 404 })
    }

    try {
      const updates = await request.json()
      const updatedService = {
        ...service,
        ...updates,
        id: service.id, 
        updatedAt: new Date().toISOString(),
        events: service.events,
      }

      const significantFields = ["name", "type", "url", "description"]
      const hasSignificantChanges = significantFields.some(
        (field) => updates[field] && updates[field] !== service[field],
      )

      if (hasSignificantChanges) {
        updatedService.events = [
          ...service.events,
          {
            id: Date.now(),
            type: "update",
            timestamp: new Date().toISOString(),
            message: "Service configuration updated",
          },
        ]
      }

      services = services.map((s) => (s.id === updatedService.id ? updatedService : s))
      return simulateNetwork(updatedService)
    } catch (error) {
      return HttpResponse.json({ message: "Invalid request data" }, { status: 400 })
    }
  }),

  
  http.delete("/api/services/:id", ({ params }) => {
    console.log(`MSW: Intercepting DELETE /api/services/${params.id}`)

    const serviceId = Number.parseInt(params.id)
    const serviceExists = services.some((s) => s.id === serviceId)

    if (!serviceExists) {
      return HttpResponse.json({ message: "Service not found" }, { status: 404 })
    }

    services = services.filter((s) => s.id !== serviceId)
    return simulateNetwork({ message: "Service deleted successfully" })
  }),

  http.get("/api/services/:id/events", ({ params, request }) => {
    console.log(`MSW: Intercepting GET /api/services/${params.id}/events`)

    const service = services.find((s) => s.id === Number.parseInt(params.id))
    if (!service) {
      return HttpResponse.json({ message: "Service not found" }, { status: 404 })
    }

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")

    const events = service.events || []
    const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const start = (page - 1) * limit
    const paginatedEvents = sortedEvents.slice(start, start + limit)

    return simulateNetwork(paginatedEvents)
  }),
]

let worker

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  worker = setupWorker(...handlers)

  worker
    .start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
    .then(() => {
      console.log("MSW: Mock Service Worker started successfully")
    })
    .catch((error) => {
      console.error("MSW: Failed to start Mock Service Worker:", error)
    })
}

export { worker }
