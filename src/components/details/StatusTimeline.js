import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StatusTimeline({ events }) {
  const processData = () => {
    const statusMap = {
      Online: 2,
      Degraded: 1,
      Offline: 0
    };
    
    const timeline = [];
    const dataPoints = [];
    
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    sortedEvents.forEach(event => {
      const status = event.message.includes('online') ? 'Online' : 
                    event.message.includes('degraded') ? 'Degraded' : 'Offline';
      
      timeline.push(new Date(event.timestamp).toLocaleTimeString());
      dataPoints.push(statusMap[status]);
    });
    
    return { timeline, dataPoints };
  };
  
  const { timeline, dataPoints } = processData();
  
  const data = {
    labels: timeline,
    datasets: [
      {
        label: 'Service Status',
        data: dataPoints,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: ctx => {
          const value = ctx.dataset.data[ctx.dataIndex];
          return value === 2 ? 'rgb(34, 197, 94)' : 
                 value === 1 ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)';
        }
      }
    ]
  };
  
  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 2,
        ticks: {
          callback: (value) => {
            return value === 2 ? 'Online' : 
                   value === 1 ? 'Degraded' : 'Offline';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.dataset.data[ctx.dataIndex];
            return value === 2 ? 'Online' : 
                   value === 1 ? 'Degraded' : 'Offline';
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
