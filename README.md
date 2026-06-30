# Ginoong Barbero

A premium barbershop management and booking platform built with React, Express.js, and MongoDB.

## Tech Stack

**Client:**
- React 19 + Vite
- Tailwind CSS 4
- React Router 7
- Framer Motion / GSAP animations
- Recharts (dashboard analytics)
- Axios (API client)

**Server:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + Google OAuth
- Helmet (security headers)
- express-validator (input validation)
- Custom rate limiter

## Features

**Booking System:**
- Multi-step booking wizard (service > barber > datetime > confirm)
- Real-time time slot availability
- Double-booking prevention
- Google OAuth for customers

**Admin Dashboard:**
- Revenue and appointment analytics
- Today's schedule view
- Service, barber, and customer management
- Gallery management with image uploads
- Real-time updates via SSE

**Security:**
- Rate limiting (general: 100/15min, auth: 10/15min, booking: 5/15min)
- Input validation on all endpoints
- Helmet security headers
- Configurable CORS origins
- JWT with 7-day expiry

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud project (for OAuth)

## Installation

```bash
# Clone the repo
git clone <repo-url>
cd Ginoong_BARBERO

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Environment Setup

**Server** — copy `server/.env.example` to `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ginoong-barbero
PORT=5001
NODE_ENV=development
JWT_SECRET=your-real-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
CLIENT_URL=http://localhost:5173,http://localhost:5174
ADMIN_EMAIL=your-admin-email@example.com
```

**Client** — create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Running the App

```bash
# Start server (from /server)
npm run dev

# Start client (from /client)
npm run dev
```

Server runs on `http://localhost:5001`, client on `http://localhost:5173`.

### Seed Sample Data

```bash
cd server
npm run seed    # Populate sample services, barbers, customers
npm run clear   # Clear all data
```

## API Endpoints

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/health` | GET | Public | Health check |
| `/api/auth/login` | POST | Public | Email/password login |
| `/api/auth/google` | POST | Public | Google OAuth (admin) |
| `/api/auth/google-customer` | POST | Public | Google OAuth (customer) |
| `/api/services` | GET | Public | List services |
| `/api/services/categories` | GET | Public | List categories |
| `/api/services/popular` | GET | Public | Popular services |
| `/api/barbers` | GET | Public | List barbers |
| `/api/barbers/:id/availability` | GET | Public | Barber time slots |
| `/api/appointments` | GET | Staff | List appointments |
| `/api/appointments` | POST | Public | Create booking |
| `/api/appointments/available-slots` | GET | Public | Available time slots |
| `/api/appointments/:id` | PATCH | Staff | Update status |
| `/api/customers` | GET | Staff | List customers |
| `/api/customers/stats` | GET | Staff | Customer analytics |
| `/api/dashboard/metrics` | GET | Staff | Dashboard metrics |
| `/api/dashboard/revenue` | GET | Staff | Revenue analytics |
| `/api/dashboard/today-schedule` | GET | Staff | Today's appointments |
| `/api/gallery` | GET | Public | Gallery images |

## Project Structure

```
Ginoong_BARBERO/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   ├── features/
│   │   │   ├── admin/          # Admin dashboard views
│   │   │   ├── booking/        # Booking wizard steps
│   │   │   └── landing/        # Landing page sections
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Route pages
│   │   ├── services/           # API service layer
│   │   └── utils/              # Utilities
│   └── ...
├── server/                     # Express backend
│   ├── configs/                # DB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth, validation, rate limiting
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── seeders/                # Sample data
│   ├── uploads/                # Uploaded files
│   ├── utils/                  # SSE, helpers
│   └── server.js               # Entry point
└── README.md
```

## License

ISC
