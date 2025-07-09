"use client"

import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./components/dashboard/Dashboard"
import ServiceDetails from "./components/details/ServiceDetails"
import Notification from "./components/ui/Notification"
import Navbar from "./Navbar"

function App() {
  const [notification, setNotification] = useState({ show: false, type: "", message: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard showNotification={showNotification} />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
        </Routes>

        <Notification
          show={notification.show}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ show: false, type: "", message: "" })}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
