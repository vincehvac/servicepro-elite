# ServicePro Elite API Documentation

## Overview
ServicePro Elite provides a comprehensive REST API for managing field service operations. This documentation covers all available endpoints, authentication, and usage examples.

## Base URL
```
https://api.serviceproelite.com/api/v1
```

## Authentication
All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer details
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Jobs
- `GET /jobs` - List all jobs
- `POST /jobs` - Create new job
- `GET /jobs/:id` - Get job details
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

### Scheduling
- `GET /scheduling/board` - Get schedule board
- `POST /scheduling/appointments` - Create appointment
- `PUT /scheduling/appointments/:id` - Update appointment
- `GET /scheduling/availability` - Check technician availability
- `POST /scheduling/dispatch` - Dispatch technician

### Inventory
- `GET /inventory` - List inventory items
- `POST /inventory` - Add inventory item
- `PUT /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item

### Invoices
- `GET /invoices` - List invoices
- `POST /invoices` - Create invoice
- `GET /invoices/:id` - Get invoice details
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice

### Reports
- `GET /reports/dashboard` - Get dashboard data
- `GET /reports/jobs` - Get job reports
- `GET /reports/revenue` - Get revenue reports
- `GET /reports/technicians` - Get technician performance reports

## WebSocket Events
Real-time updates are available through WebSocket connections:

- `job:updated` - Job status updated
- `appointment:created` - New appointment created
- `appointment:updated` - Appointment updated
- `notification:new` - New notification
- `location:update` - Technician location update

## Error Handling
The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed error messages:
```json
{
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Rate Limiting
API requests are rate limited to:
- 1000 requests per hour per user
- 100 requests per minute per user

## Pagination
List endpoints support pagination using `page` and `limit` parameters:
```
GET /customers?page=1&limit=50
```

## Filtering and Search
Most list endpoints support filtering and search:
```
GET /customers?search=john&type=residential&status=active
```

## Examples

### Login
```bash
curl -X POST https://api.serviceproelite.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Customer
```bash
curl -X POST https://api.serviceproelite.com/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "(555) 123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "ST",
      "zipCode": "12345"
    }
  }'
```

### Create Appointment
```bash
curl -X POST https://api.serviceproelite.com/api/v1/scheduling/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "jobId": "job-uuid",
    "technicianId": "technician-uuid",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T12:00:00Z",
    "notes": "Customer requested morning appointment"
  }'
```

## SDKs and Libraries
- JavaScript/Node.js: `@serviceproelite/sdk`
- Python: `serviceproelite-python`
- PHP: `serviceproelite-php`
- Ruby: `serviceproelite-ruby`

## Support
For API support, please contact:
- Email: api-support@serviceproelite.com
- Documentation: https://docs.serviceproelite.com
- Status Page: https://status.serviceproelite.com