# Ginoong Barbero Backend API

A comprehensive backend service for a premium barbershop management and booking platform built with Node.js, Express, and MongoDB.

## Features

- **Appointment Management**: Complete booking system with time slot availability
- **Customer Management**: Customer profiles with visit history and spending analytics
- **Service Management**: Full CRUD operations for barbershop services
- **Barber Management**: Staff scheduling and availability management
- **Dashboard Analytics**: Revenue, appointment, and customer analytics
- **Real-time Queue Management**: Live appointment status updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error middleware
- **Date Handling**: Native JavaScript Date with timezone support

## Project Structure

```
server/
├── configs/
│   └── db.js                 # Database connection
├── middleware/
│   └── errorMiddleware.js    # Error handling middleware
├── controllers/
│   ├── appointmentController.js
│   ├── customerController.js
│   ├── serviceController.js
│   ├── barberController.js
│   └── dashboardController.js
├── models/
│   ├── Appointment.js
│   ├── Customer.js
│   ├── Service.js
│   └── Barber.js
├── routes/
│   ├── appointmentRoutes.js
│   ├── customerRoutes.js
│   ├── serviceRoutes.js
│   ├── barberRoutes.js
│   └── dashboardRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Installation & Setup

1. **Clone and navigate to the project**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/ginoong-barbero
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status
- `GET /` - API information and available endpoints

### Appointments
- `GET /api/appointments` - Get all appointments (with filtering & pagination)
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get single appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Customers
- `GET /api/customers` - Get all customers (with search & pagination)
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get single customer with history
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/stats` - Get customer statistics

### Services
- `GET /api/services` - Get all services (with filtering)
- `POST /api/services` - Create new service
- `GET /api/services/:id` - Get single service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/categories` - Get service categories
- `GET /api/services/popular` - Get popular services
- `GET /api/services/category/:category` - Get services by category

### Barbers
- `GET /api/barbers` - Get all barbers
- `POST /api/barbers` - Create new barber
- `GET /api/barbers/:id` - Get single barber
- `PUT /api/barbers/:id` - Update barber
- `DELETE /api/barbers/:id` - Delete barber
- `GET /api/barbers/:id/availability` - Get barber availability

### Dashboard Analytics
- `GET /api/dashboard/metrics` - Main dashboard metrics
- `GET /api/dashboard/revenue` - Revenue analytics
- `GET /api/dashboard/appointments` - Appointment analytics
- `GET /api/dashboard/customers` - Customer analytics
- `GET /api/dashboard/today-schedule` - Today's schedule

## Data Models

### Service Model
```javascript
{
  name: String,           // Service name
  description: String,    // Service description
  category: String,       // Haircuts, Beard, Hair Color, Add-ons, Packages
  duration: Number,       // Duration in minutes
  price: Number,          // Service price
  status: String          // Active, Inactive
}
```

### Barber Model
```javascript
{
  name: String,           // Barber name
  role: String,           // Senior Barber, Barber, Master Barber
  profileImage: String,   // Profile image URL
  status: String,         // Active, Inactive
  workingHours: {
    start: String,        // e.g., "09:00"
    end: String           // e.g., "18:00"
  },
  workingDays: [String]   // Array of working days
}
```

### Customer Model
```javascript
{
  name: String,           // Customer name
  email: String,          // Unique email
  phone: String,          // Phone number
  totalVisits: Number,    // Total visits count
  totalSpent: Number,     // Total amount spent
  lastAppointment: Date,  // Last appointment date
  status: String,         // Active, Inactive
  isVIP: Boolean,         // VIP status
  notes: String           // Additional notes
}
```

### Appointment Model
```javascript
{
  customer: ObjectId,     // Reference to Customer
  service: ObjectId,      // Reference to Service
  barber: ObjectId,       // Reference to Barber
  dateTime: Date,         // Appointment date and time
  status: String,         // Pending, Confirmed, Completed, Cancelled
  paymentStatus: String,  // Unpaid, Paid, Refunded
  totalAmount: Number,    // Total appointment cost
  duration: Number,       // Appointment duration
  notes: String           // Additional notes
}
```

## Key Features

### Automatic Customer Creation
When creating an appointment, if the customer doesn't exist, a new customer profile is automatically created.

### Smart Time Slot Management
The system automatically calculates available time slots based on:
- Barber working hours
- Existing appointments
- Service duration
- 30-minute slot intervals

### Customer Analytics
- Automatic VIP status based on spending (≥$2000)
- Customer tier system (Bronze, Silver, Gold, Platinum)
- Visit and spending tracking

### Appointment Status Automation
When an appointment status changes to "Completed":
- Customer's `totalVisits` is incremented
- Customer's `totalSpent` is updated
- Customer's `lastAppointment` is updated

### Comprehensive Error Handling
- Input validation with detailed error messages
- Mongoose error handling (validation, cast errors, duplicates)
- 404 and 500 error responses
- Development vs production error details

## Query Parameters

### Appointments
- `page`, `limit` - Pagination
- `date` - Filter by specific date
- `barberId` - Filter by barber
- `serviceId` - Filter by service
- `status` - Filter by appointment status
- `paymentStatus` - Filter by payment status
- `sortBy`, `sortOrder` - Sorting options

### Customers
- `page`, `limit` - Pagination
- `search` - Search by name, email, or phone
- `status` - Filter by customer status
- `isVIP` - Filter VIP customers
- `sortBy`, `sortOrder` - Sorting options

### Services
- `category` - Filter by service category
- `status` - Filter by service status
- `search` - Search by name or description
- `sortBy`, `sortOrder` - Sorting options

## Response Format

All API responses follow this structure:

```javascript
{
  "success": true,
  "data": {}, // Response data
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

Error responses:
```javascript
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

## Development

### Adding New Features
1. Create/update models in `models/`
2. Add controller logic in `controllers/`
3. Define routes in `routes/`
4. Update `server.js` if needed

### Database Indexes
The models include optimized indexes for:
- Efficient querying by status, dates, and references
- Text search capabilities
- Compound indexes for availability checking

### Error Handling
Use the `asyncHandler` wrapper for all async controller functions to ensure proper error handling.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up proper logging
5. Use PM2 or similar for process management
6. Set up MongoDB indexes in production

## License

This project is licensed under the ISC License.