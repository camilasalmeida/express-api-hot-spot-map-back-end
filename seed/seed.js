const mongoose = require('mongoose');
const User = require('../models/user'); // Adjusted path
const Spot = require('../models/spot'); // Adjusted path
require('dotenv').config();

// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotspotmapapp';

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample Users
const users = [
  {
    username: 'camilasalmeida',
    email: 'camilasalmeida@example.com',
    hashedPassword: 'hashedpassword123', // Replace with actual hashed password
  },
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    hashedPassword: 'hashedpassword456', // Replace with actual hashed password
  },
];

// Sample Spots
const spots = [
  {
    spotName: 'Sunset Beach',
    address: '123 Ocean Drive',
    category: 'Beach',
    dresscode: 'Casual',
    guests: [
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        date: new Date('2024-12-25'),
        time: '18:00',
        message: 'Looking forward to this!',
        status: 'Confirmed',
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        date: new Date('2024-12-25'),
        time: '18:00',
        status: 'Pending',
      },
    ],
  },
  {
    spotName: 'Mountain Lodge',
    address: '456 Peak Road',
    category: 'SkiingSession',
    dresscode: 'Formal',
    guests: [
      {
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        date: new Date('2024-12-31'),
        time: '19:00',
        status: 'Rejected',
      },
    ],
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase(); // Clear the existing database (optional)
    console.log('Database cleared');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded:', createdUsers);

    // Assign author to spots
    spots.forEach((spot, index) => {
      spot.author = createdUsers[index % createdUsers.length]._id;
    });

    // Create spots
    const createdSpots = await Spot.insertMany(spots);
    console.log('Spots seeded:', createdSpots);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
seedDatabase();