// src/components/dashboard/EditServiceForm.js
import React, { useState, useEffect, useContext } from 'react';
import { ServicesContext } from '../../context/ServicesContext';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function EditServiceForm({ isOpen, close, service }) {
  const [formData, setFormData] = useState({ name: '', type: 'API' });
  const { editService } = useContext(ServicesContext);

  // Use useEffect to populate the form when the 'service' prop changes
  useEffect(() => {
    if (service) {
      setFormData({ name: service.name || '', type: service.type || 'API' });
    }
  }, [service]); // Dependency array: re-run when 'service' prop changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (service && service.id) { // Ensure service and its ID exist before attempting to edit
      editService(service.id, formData);
      close();
    } else {
      console.error("Attempted to edit service without a valid service object or ID.");
      // Optionally show a notification here
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={close} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Edit Service
              </Dialog.Title>
              
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Service Name
                  </label>
                  <input
                    type="text"
                    id="edit-name" // Changed ID to avoid potential conflicts if both forms are ever mounted
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">
                    Service Type
                  </label>
                  <select
                    id="edit-type" // Changed ID
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="API">API</option>
                    <option value="Database">Database</option>
                    <option value="Queue">Queue</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={close}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}