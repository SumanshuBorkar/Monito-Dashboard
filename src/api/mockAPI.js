import { rest } from 'msw';

// Mock data stores
let services = [
  { id: 1, name: 'User API', type: 'API', status: 'Online' },
  { id: 2, name: 'Payment Service', type: 'API', status: 'Degraded' },
  { id: 3, name: 'MongoDB', type: 'Database', status: 'Online' },
];
let events = {
  1: [
    { id: 1, timestamp: '2023-10-27T10:00:00Z', message: 'Service started' },
    { id: 2, timestamp: '2023-10-28T14:30:00Z', message: 'High latency observed' },
  ],
  // ... other services
};

// Simulate status changes
setInterval(() => {
  services = services.map(service => 
    Math.random() > 0.8 ? { 
      ...service, 
      status: ['Online', 'Offline', 'Degraded'][Math.floor(Math.random()*3)]
    } : service
  );
}, 15000);

export const handlers = [
  // GET services
  rest.get('/api/services', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const name = req.url.searchParams.get('name_like');
    
    let result = services;
    if (status) result = result.filter(s => s.status === status);
    if (name) result = result.filter(s => 
      s.name.toLowerCase().includes(name.toLowerCase()));
    
    return simulateNetwork(res, ctx, result);
  }),
  
  // CRUD operations
  rest.post('/api/services', (req, res, ctx) => {
    const newService = { ...req.body, id: Date.now(), status: 'Online' };
    services.push(newService);
    return simulateNetwork(res, ctx, newService);
  }),
  
  // ... other endpoints
];

function simulateNetwork(res, ctx, data) {
  const shouldError = Math.random() < 0.05;
  const delay = Math.random() * 700 + 300;
  
  return shouldError
    ? res(ctx.delay(delay), ctx.status(500))
    : res(ctx.delay(delay), ctx.json(data));
}

// Register service worker
if (process.env.NODE_ENV === 'development') {
  const { setupWorker } = require('msw');
  setupWorker(...handlers).start();
}