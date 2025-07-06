// In src/components/dashboard/ServiceRow.js
import { useState } from 'react';
import EditServiceForm from './EditServiceForm';

export default function ServiceRow({ service }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  return (
    <>
      <tr>
        {/* ... existing cells ... */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => setIsEditOpen(true)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            {/* Delete button */}
          </div>
        </td>
      </tr>
      
      <EditServiceForm 
        isOpen={isEditOpen}
        close={() => setIsEditOpen(false)}
        service={service}
      />
    </>
  );
}