import React, { useContext, useEffect } from 'react';
import { ServicesContext } from './context/ServicesContext';
import usePolling from './hooks/usePolling';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const { state, dispatch, fetchServices } = useContext(ServicesContext);
  
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;