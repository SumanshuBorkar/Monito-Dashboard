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

export const getAllServices = () => {
  return Promise.resolve([...services])
}

export const getService = (id) => {
  const service = services.find((s) => s.id === Number.parseInt(id))
  return service ? Promise.resolve(service) : Promise.reject(new Error("Service not found"))
}

export const createService = (serviceData) => {
  const newService = {
    ...serviceData,
    id: Math.max(...services.map((s) => s.id), 0) + 1,
    status: "Online",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [
      {
        id: Date.now(),
        type: "up",
        timestamp: new Date().toISOString(),
        message: "Service created",
      },
    ],
  }
  services.push(newService)
  return Promise.resolve(newService)
}

export const updateService = (id, updates) => {
  const index = services.findIndex((s) => s.id === Number.parseInt(id))
  if (index === -1) {
    return Promise.reject(new Error("Service not found"))
  }

  services[index] = {
    ...services[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return Promise.resolve(services[index])
}

export const deleteService = (id) => {
  const index = services.findIndex((s) => s.id === Number.parseInt(id))
  if (index === -1) {
    return Promise.reject(new Error("Service not found"))
  }

  services.splice(index, 1)
  return Promise.resolve()
}

setInterval(() => {
  services = services.map((service) => {
    if (Math.random() < 0.1) {
      // 10% chance
      const statuses = ["Online", "Degraded", "Offline"]
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)]

      if (newStatus !== service.status) {
        const event = {
          id: Date.now() + Math.random(),
          type:
            newStatus.toLowerCase() === "online" ? "up" : newStatus.toLowerCase() === "offline" ? "down" : "degraded",
          timestamp: new Date().toISOString(),
          message: `Status changed to ${newStatus}`,
        }

        return {
          ...service,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          events: [...service.events, event],
        }
      }
    }
    return service
  })
}, 10000)
