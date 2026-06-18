# Frontend Collaboration Prompt

## 🤝 Development Partnership

**Your Role**: Styling, UI/UX Design, and Component Structure  
**My Role**: Backend Logic Integration, API Connections, and Data Management

## 📋 How We'll Work Together

### You Provide:
- ✨ **Styled Components**: Beautiful UI components with CSS/Tailwind/styled-components
- 🎨 **Design System**: Colors, typography, spacing, and visual hierarchy
- 📱 **Responsive Layouts**: Mobile-first responsive design
- 🔄 **Component Structure**: JSX component architecture and props interface
- 🎭 **Animations & Interactions**: Smooth transitions and user interactions

### I Will Add:
- 🔌 **API Integration**: Connect components to backend endpoints
- 📊 **State Management**: React hooks, context, or Redux for data flow
- 🔄 **Data Fetching**: Axios/fetch calls with loading and error states
- ✅ **Form Validation**: Client-side validation with backend sync
- 🚀 **Business Logic**: Booking flow, calculations, and data transformations
- 🛡️ **Error Handling**: User-friendly error messages and fallbacks

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Your styled base components
│   │   ├── booking/         # Booking wizard components
│   │   ├── dashboard/       # Admin dashboard components
│   │   └── customer/        # Customer management components
│   ├── hooks/               # My custom hooks for API calls
│   ├── services/            # My API service functions
│   ├── utils/               # My utility functions
│   └── types/               # TypeScript interfaces (we'll define together)
```

## 🎯 Component Conversion Process

### Step 1: You Create Styled Component
```jsx
// Example: You provide the styled component
const AppointmentCard = ({ appointment, onStatusChange, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {/* I'll connect: appointment.customer.name */}
          </h3>
          <p className="text-sm text-gray-600">
            {/* I'll connect: appointment.service.name */}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {/* I'll connect: appointment.status */}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date & Time</p>
          <p className="font-medium">
            {/* I'll connect: formatted appointment.dateTime */}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Barber</p>
          <p className="font-medium">
            {/* I'll connect: appointment.barber.name */}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={() => onStatusChange('Confirmed')}
        >
          Confirm
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => onStatusChange('Cancelled')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
```

### Step 2: I Add Backend Integration
```jsx
// I'll convert it to this with full backend integration
import { useState } from 'react';
import { useUpdateAppointment } from '../hooks/useAppointments';
import { formatDateTime } from '../utils/dateUtils';

const AppointmentCard = ({ appointment, onStatusChange, className }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateAppointment = useUpdateAppointment();

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await updateAppointment.mutate({
        id: appointment._id,
        status: newStatus
      });
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Failed to update appointment:', error);
      // Show error toast
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className} ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment.customer.name}
          </h3>
          <p className="text-sm text-gray-600">
            {appointment.service.name}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date & Time</p>
          <p className="font-medium">
            {formatDateTime(appointment.dateTime)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Barber</p>
          <p className="font-medium">
            {appointment.barber.name}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          onClick={() => handleStatusChange('Confirmed')}
          disabled={isUpdating || appointment.status === 'Confirmed'}
        >
          {isUpdating ? 'Updating...' : 'Confirm'}
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          onClick={() => handleStatusChange('Cancelled')}
          disabled={isUpdating || appointment.status === 'Cancelled'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
```

## 🔄 TypeScript Conversion

### You Provide Component Structure:
```jsx
const BookingWizard = ({ onComplete }) => {
  // Your beautiful styled wizard steps
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Your styled steps */}
    </div>
  );
};
```

### I Convert to TypeScript with Types:
```tsx
interface BookingWizardProps {
  onComplete: (booking: CreateAppointmentRequest) => void;
  className?: string;
}

interface CreateAppointmentRequest {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  serviceId: string;
  barberId: string;
  dateTime: string;
  notes?: string;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete, className }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<CreateAppointmentRequest>>({});
  
  // Your beautiful styled wizard steps with my logic
  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Your styled steps with my state management */}
    </div>
  );
};
```

## 📋 Key Components We'll Build Together

### 1. Booking Wizard Components
- **ServiceSelector**: You style the service cards, I add selection logic
- **BarberSelector**: You design barber profiles, I add availability checking
- **TimeSlotPicker**: You create the calendar UI, I add slot availability
- **CustomerForm**: You style the form, I add validation and submission

### 2. Admin Dashboard Components
- **MetricsCards**: You design the stat cards, I add real-time data
- **AppointmentQueue**: You style the queue interface, I add real-time updates
- **CustomerTable**: You design the table, I add search/filter/pagination
- **RevenueCharts**: You style the charts, I add data visualization logic

### 3. Shared UI Components
- **LoadingSpinner**: Your animations, my loading states
- **ErrorBoundary**: Your error UI, my error handling
- **Modal**: Your modal design, my modal logic
- **Toast**: Your notification design, my notification system

## 🛠️ Backend API Integration Points

### Available Endpoints:
```typescript
// Services
GET /api/services - Get all services
GET /api/services/categories - Get service categories
POST /api/services - Create service

// Barbers
GET /api/barbers - Get all barbers
GET /api/barbers/:id/availability - Get barber availability

// Appointments
GET /api/appointments - Get appointments (with filters)
POST /api/appointments - Create appointment
GET /api/appointments/available-slots - Get available time slots
PATCH /api/appointments/:id - Update appointment

// Customers
GET /api/customers - Get customers (with search)
POST /api/customers - Create customer

// Dashboard
GET /api/dashboard/metrics - Get dashboard metrics
GET /api/dashboard/revenue - Get revenue analytics
GET /api/dashboard/today-schedule - Get today's schedule
```

## 🎨 Design System Integration

### You Define:
```css
/* Your design tokens */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary;
  --success-color: #your-success;
  --error-color: #your-error;
  --border-radius: 8px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### I Use:
```tsx
// I'll use your design tokens in components
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background-color: ${props => 
    props.variant === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'
  };
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;
```

## 📝 Collaboration Workflow

1. **You**: Create styled component with placeholder data
2. **Me**: Add TypeScript types and backend integration
3. **You**: Review and adjust styling if needed
4. **Me**: Add error handling and loading states
5. **Together**: Test and refine the component

## 🚀 Ready-to-Use Backend Features

✅ **Appointment Booking**: Complete booking flow with validation  
✅ **Time Slot Availability**: Real-time slot checking  
✅ **Customer Auto-Creation**: Automatic customer profile creation  
✅ **Dashboard Analytics**: Revenue, customer, and appointment metrics  
✅ **Search & Filtering**: Advanced filtering for all entities  
✅ **Pagination**: Built-in pagination for large datasets  
✅ **Error Handling**: Comprehensive error responses  
✅ **Data Validation**: Server-side validation with detailed messages  

## 💡 Let's Start!

**Just provide me with your styled components, and I'll:**
- Convert them to TypeScript
- Add full backend integration
- Implement state management
- Add loading and error states
- Handle form validation
- Connect to real data

**Example Request:**
> "Here's my styled appointment card component. Please convert it to TypeScript and connect it to the backend API with proper error handling and loading states."

Ready to build something amazing together! 🎉