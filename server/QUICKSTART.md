# Ginoong Barbero - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/ginoong-barbero
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed Sample Data (Optional)
```bash
npm run seed
```

This creates:
- 7 sample services (haircuts, beard services, packages)
- 4 sample barbers with different schedules
- 5 sample customers with various spending levels
- 5 sample appointments (past and future)

### 5. Start the Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 🧪 Test the API

### Check Server Health
```bash
curl http://localhost:5000/api/health
```

### Get All Services
```bash
curl http://localhost:5000/api/services
```

### Get Dashboard Metrics
```bash
curl http://localhost:5000/api/dashboard/metrics
```

### Create a New Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "+1234567899"
    },
    "serviceId": "SERVICE_ID_HERE",
    "barberId": "BARBER_ID_HERE",
    "dateTime": "2024-12-25T10:00:00.000Z"
  }'
```

### Get Available Time Slots
```bash
curl "http://localhost:5000/api/appointments/available-slots?date=2024-12-25&barberId=BARBER_ID_HERE"
```

## 📊 Frontend Integration

### Booking Wizard Flow
1. **GET** `/api/services` - Load services by category
2. **GET** `/api/barbers?status=Active` - Load available barbers
3. **GET** `/api/appointments/available-slots?date=YYYY-MM-DD&barberId=ID` - Get time slots
4. **POST** `/api/appointments` - Create booking

### Admin Dashboard Flow
1. **GET** `/api/dashboard/metrics` - Main dashboard cards
2. **GET** `/api/appointments?status=Pending` - Pending approvals
3. **GET** `/api/dashboard/today-schedule` - Today's appointments
4. **PATCH** `/api/appointments/:id` - Update appointment status

## 🛠️ Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed sample data
npm run seed

# Clear all data
npm run clear
```

## 📱 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/services` | GET | Get all services |
| `/api/barbers` | GET | Get all barbers |
| `/api/customers` | GET | Get all customers |
| `/api/appointments` | GET/POST | Manage appointments |
| `/api/appointments/available-slots` | GET | Get time slots |
| `/api/dashboard/metrics` | GET | Dashboard analytics |

## 🔧 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use
- Change PORT in `.env` file
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### Missing Dependencies
```bash
npm install express mongoose cors dotenv express-async-handler
```

## 📚 Next Steps

1. **Frontend Integration**: Use the API endpoints in your React/Vue/Angular app
2. **Authentication**: Add JWT authentication middleware
3. **File Upload**: Implement image upload for barber profiles
4. **Notifications**: Add email/SMS notifications for appointments
5. **Payment Integration**: Add Stripe/PayPal for payments
6. **Real-time Updates**: Add Socket.io for live queue updates

## 🎯 Key Features Ready to Use

✅ **Appointment Booking**: Complete booking flow with availability checking  
✅ **Customer Management**: Auto-creation and profile management  
✅ **Service Management**: Full CRUD with categories  
✅ **Analytics Dashboard**: Revenue, customer, and appointment analytics  
✅ **Time Slot Management**: Smart availability calculation  
✅ **Data Validation**: Comprehensive input validation  
✅ **Error Handling**: Production-ready error responses  

Happy coding! 🎉