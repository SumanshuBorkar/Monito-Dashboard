import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ServicesContext } from './context/ServicesContext';
import usePolling from './hooks/usePolling';
import Dashboard from './components/dashboard/Dashboard';
import ServiceDetails from './components/details/ServiceDetails';
import Notification from './components/ui/Notification';
import axios from 'axios';
import Navbar from './Navbar';

function App() {
  const { state, dispatch } = useContext(ServicesContext);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  // Status-only polling
  usePolling(async () => {
    try {
      const { data } = await axios.get('/api/services?fields=id,status');
      dispatch({ type: 'UPDATE_STATUSES', payload: data });
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 15000);

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
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;