const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const Customer = require('../models/Customer');
const Appointment = require('../models/Appointment');
const GalleryImage = require('../models/Gallery');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const sampleServices = [
  {
    name: 'Maginoo Royal Treatment',
    description: 'Premium walk-in package: appointment, haircut + hot towel, complimentary massage, beard trim & shape + pomade, free massage scents spray',
    category: 'Packages',
    duration: 120,
    price: 599,
    status: 'Active',
    image: null
  },
  {
    name: 'Maginoo Royal Package (Walk-in)',
    description: 'Walk-in package: haircut + hot towel, complimentary massage, beard trim & shape + pomade, free massage scents spray',
    category: 'Packages',
    duration: 90,
    price: 499,
    status: 'Active',
    image: null
  },
  {
    name: 'Hair Braid Styles',
    description: 'Professional hair braiding styles depending on style and length',
    category: 'Haircuts',
    duration: 120,
    price: 1500,
    status: 'Active',
    image: '/uploads/services/hair-braid.jpg'
  },
  {
    name: 'Maginoo Classic',
    description: 'Regular hair cut, facial massage, hot towel',
    category: 'Haircuts',
    duration: 45,
    price: 179,
    status: 'Active',
    image: null
  },
  {
    name: 'Kids Haircut',
    description: 'Haircut service for kids',
    category: 'Haircuts',
    duration: 30,
    price: 200,
    status: 'Active',
    image: '/uploads/services/kids-haircut.jpg'
  },
  {
    name: 'Tricycle Drivers / Senior / PWD',
    description: 'Special discounted haircut for tricycle drivers, senior citizens, and PWD',
    category: 'Haircuts',
    duration: 30,
    price: 149,
    status: 'Active',
    image: null
  },
  {
    name: 'Home Service',
    description: 'Haircut home service (transportation fee depends on location)',
    category: 'Haircuts',
    duration: 60,
    price: 499,
    status: 'Active',
    image: null
  },
  {
    name: 'Maginoo Scents',
    description: 'The signature scent for the modern gentleman. Avail Maginoo Scents and get a free haircut',
    category: 'Add-ons',
    duration: 30,
    price: 450,
    status: 'Active',
    image: null
  },
  {
    name: 'Maginoo Pomade',
    description: 'Premium pomade for the modern gentleman',
    category: 'Add-ons',
    duration: 15,
    price: 350,
    status: 'Active',
    image: null
  }
];

const sampleBarbers = [
  {
    name: 'Miguel Santos',
    role: 'Master Barber',
    profileImage: '',
    status: 'Active',
    workingHours: { start: '08:00', end: '17:00' },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Senior Barber',
    profileImage: '',
    status: 'Active',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    name: 'Juan Dela Cruz',
    role: 'Barber',
    profileImage: '',
    status: 'Active',
    workingHours: { start: '10:00', end: '19:00' },
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    name: 'Antonio Reyes',
    role: 'Senior Barber',
    profileImage: '',
    status: 'Active',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
  }
];

const sampleCustomers = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    totalVisits: 5,
    totalSpent: 150,
    status: 'Active',
    isVIP: false
  },
  {
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1234567891',
    totalVisits: 12,
    totalSpent: 480,
    status: 'Active',
    isVIP: false
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1234567892',
    totalVisits: 25,
    totalSpent: 1250,
    status: 'Active',
    isVIP: false
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '+1234567893',
    totalVisits: 40,
    totalSpent: 2800,
    status: 'Active',
    isVIP: true
  },
  {
    name: 'James Davis',
    email: 'james.davis@email.com',
    phone: '+1234567894',
    totalVisits: 8,
    totalSpent: 320,
    status: 'Active',
    isVIP: false
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await Barber.deleteMany({});
    await Customer.deleteMany({});
    await Appointment.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`✅ Inserted ${services.length} services`);

    // Insert sample barbers
    const barbers = await Barber.insertMany(sampleBarbers);
    console.log(`✅ Inserted ${barbers.length} barbers`);

    // Insert sample customers
    const customers = await Customer.insertMany(sampleCustomers);
    console.log(`✅ Inserted ${customers.length} customers`);

    // Create sample appointments
    const sampleAppointments = [
      {
        customer: customers[0]._id,
        service: services[0]._id,
        barber: barbers[0]._id,
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'Confirmed',
        paymentStatus: 'Unpaid',
        totalAmount: services[0].price,
        duration: services[0].duration
      },
      {
        customer: customers[1]._id,
        service: services[1]._id,
        barber: barbers[1]._id,
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: 'Pending',
        paymentStatus: 'Unpaid',
        totalAmount: services[1].price,
        duration: services[1].duration
      },
      {
        customer: customers[2]._id,
        service: services[6]._id,
        barber: barbers[0]._id,
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'Completed',
        paymentStatus: 'Paid',
        totalAmount: services[6].price,
        duration: services[6].duration
      },
      {
        customer: customers[3]._id,
        service: services[4]._id,
        barber: barbers[2]._id,
        dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'Confirmed',
        paymentStatus: 'Unpaid',
        totalAmount: services[4].price,
        duration: services[4].duration
      },
      {
        customer: customers[4]._id,
        service: services[2]._id,
        barber: barbers[3]._id,
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'Completed',
        paymentStatus: 'Paid',
        totalAmount: services[2].price,
        duration: services[2].duration
      }
    ];

    const appointments = await Appointment.insertMany(sampleAppointments);
    console.log(`✅ Inserted ${appointments.length} appointments`);

    // Seed gallery images
    await GalleryImage.deleteMany({});
    const sampleGalleryImages = [
      {
        title: 'Signature Fade',
        url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
        category: 'Featured',
        description: 'Our signature fade technique perfected over years of craftsmanship.',
        order: 1
      },
      {
        title: 'Classic剃 Shave',
        url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
        category: 'Artistry',
        description: 'Traditional straight razor shave with hot towel treatment.',
        order: 2
      },
      {
        title: 'Modern Texture Cut',
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
        category: 'Cuts',
        description: 'Contemporary textured styling for the modern gentleman.',
        order: 3
      },
      {
        title: 'Premium Grooming Kit',
        url: 'https://images.unsplash.com/photo-1585747860019-024f4738bb06?auto=format&fit=crop&q=80&w=800',
        category: 'Equipment',
        description: 'Professional-grade tools used in every session.',
        order: 4
      },
      {
        title: 'Hot Towel Treatment',
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
        category: 'Treatment',
        description: 'Relaxing hot towel facial treatment for ultimate grooming.',
        order: 5
      },
      {
        title: 'Heritage Since 2018',
        url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
        category: 'History',
        description: 'Our journey from a small shop to a premium barbershop.',
        order: 6
      },
      {
        title: 'The Lounge',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&q=80&w=800',
        category: 'Lounge',
        description: 'Our signature waiting area with complimentary refreshments.',
        order: 7
      },
      {
        title: 'Beard Sculpting',
        url: 'https://images.unsplash.com/photo-1519019121990-63ca9b6e3b94?auto=format&fit=crop&q=80&w=800',
        category: 'Artistry',
        description: 'Precision beard shaping and detailing.',
        order: 8
      },
      {
        title: 'The Perfect Quiff',
        url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800',
        category: 'Cuts',
        description: 'Volume and definition in a classic quiff style.',
        order: 9
      }
    ];
    const galleryImages = await GalleryImage.insertMany(sampleGalleryImages);
    console.log(`✅ Inserted ${galleryImages.length} gallery images`);

    console.log('🎉 Sample data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Services: ${services.length}`);
    console.log(`- Barbers: ${barbers.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Appointments: ${appointments.length}`);
    console.log(`- Gallery Images: ${galleryImages.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

const clearDatabase = async () => {
  try {
    await Service.deleteMany({});
    await Barber.deleteMany({});
    await Customer.deleteMany({});
    await Appointment.deleteMany({});
    await GalleryImage.deleteMany({});
    
    console.log('🗑️ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Command line arguments
const command = process.argv[2];

const runSeeder = async () => {
  await connectDB();
  
  switch (command) {
    case 'seed':
      await seedDatabase();
      break;
    case 'clear':
      await clearDatabase();
      break;
    default:
      console.log('Usage:');
      console.log('  node seeders/sampleData.js seed  - Seed sample data');
      console.log('  node seeders/sampleData.js clear - Clear all data');
      mongoose.connection.close();
  }
};

runSeeder();