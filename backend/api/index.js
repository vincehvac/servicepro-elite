const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// In-memory data stores
let users = [
  {
    id: 1,
    email: 'admin@servicepro.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
    company_id: 1
  }
];

let customers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0101', address: '123 Main St', company_id: 1 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0102', address: '456 Oak Ave', company_id: 1 }
];

let jobs = [
  { id: 1, customer_id: 1, title: 'HVAC Repair', status: 'scheduled', priority: 'high', scheduled_date: '2025-10-15', technician_id: 1 },
  { id: 2, customer_id: 2, title: 'AC Installation', status: 'in_progress', priority: 'medium', scheduled_date: '2025-10-14', technician_id: 2 }
];

let appointments = [
  { id: 1, job_id: 1, technician_id: 1, start_time: '2025-10-15T09:00:00Z', end_time: '2025-10-15T11:00:00Z', status: 'scheduled' },
  { id: 2, job_id: 2, technician_id: 2, start_time: '2025-10-14T14:00:00Z', end_time: '2025-10-14T16:00:00Z', status: 'in_progress' }
];

let inventory = [
  { id: 1, name: 'Air Filter', sku: 'AF-001', quantity: 150, unit_price: 15.99, category: 'filters' },
  { id: 2, name: 'Refrigerant R-410A', sku: 'REF-410', quantity: 50, unit_price: 89.99, category: 'refrigerants' }
];

let invoices = [
  { id: 1, job_id: 1, customer_id: 1, amount: 450.00, status: 'pending', due_date: '2025-10-30' },
  { id: 2, job_id: 2, customer_id: 2, amount: 3500.00, status: 'paid', due_date: '2025-10-20' }
];

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = 'mock-jwt-token-' + user.id;
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role: role || 'technician',
    company_id: 1
  };
  users.push(newUser);
  res.status(201).json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
});

// Customer routes
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = { id: customers.length + 1, ...req.body, company_id: 1 };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  customers[index] = { ...customers[index], ...req.body };
  res.json(customers[index]);
});

app.delete('/api/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  customers.splice(index, 1);
  res.status(204).send();
});

// Job routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.post('/api/jobs', (req, res) => {
  const newJob = { id: jobs.length + 1, ...req.body, status: 'pending' };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const index = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Job not found' });
  jobs[index] = { ...jobs[index], ...req.body };
  res.json(jobs[index]);
});

app.delete('/api/jobs/:id', (req, res) => {
  const index = jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Job not found' });
  jobs.splice(index, 1);
  res.status(204).send();
});

// Scheduling routes
app.get('/api/scheduling/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/scheduling/appointments', (req, res) => {
  const newAppointment = { id: appointments.length + 1, ...req.body, status: 'scheduled' };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/scheduling/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Appointment not found' });
  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

// Inventory routes
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/api/inventory', (req, res) => {
  const newItem = { id: inventory.length + 1, ...req.body };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', (req, res) => {
  const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  inventory[index] = { ...inventory[index], ...req.body };
  res.json(inventory[index]);
});

// Invoice routes
app.get('/api/invoices', (req, res) => {
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = invoices.find(i => i.id === parseInt(req.params.id));
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

app.post('/api/invoices', (req, res) => {
  const newInvoice = { id: invoices.length + 1, ...req.body, status: 'pending' };
  invoices.push(newInvoice);
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', (req, res) => {
  const index = invoices.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
  invoices[index] = { ...invoices[index], ...req.body };
  res.json(invoices[index]);
});

// Reports routes
app.get('/api/reports/dashboard', (req, res) => {
  res.json({
    total_customers: customers.length,
    active_jobs: jobs.filter(j => j.status === 'in_progress').length,
    total_revenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    completed_jobs: jobs.filter(j => j.status === 'completed').length
  });
});

app.get('/api/reports/revenue', (req, res) => {
  const monthlyRevenue = invoices.reduce((acc, inv) => {
    const month = new Date(inv.due_date).getMonth();
    acc[month] = (acc[month] || 0) + inv.amount;
    return acc;
  }, {});
  res.json(monthlyRevenue);
});

// Notifications routes
app.get('/api/notifications', (req, res) => {
  res.json([
    { id: 1, message: 'New job assigned', type: 'info', read: false, created_at: new Date().toISOString() },
    { id: 2, message: 'Invoice payment received', type: 'success', read: false, created_at: new Date().toISOString() }
  ]);
});

// Integrations routes
app.get('/api/integrations', (req, res) => {
  res.json([
    { name: 'QuickBooks', status: 'connected', last_sync: new Date().toISOString() },
    { name: 'Google Maps', status: 'connected', last_sync: new Date().toISOString() },
    { name: 'Stripe', status: 'disconnected', last_sync: null }
  ]);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;