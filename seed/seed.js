const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjusted path
const Spot = require('../models/spot'); // Adjusted path
require('dotenv').config();

// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotspotmapapp';

mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Spot.deleteMany({});
    console.log('User and Spot collections cleared.');

    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);

    // Sample Users
    const users = [
      {
        username: 'camilasalmeida',
        email: 'camilasalmeida@example.com',
        hashedPassword: hashedPassword1,
      },
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        hashedPassword: hashedPassword2,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded successfully:', createdUsers);

    // Assign authors to spots
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

    spots.forEach((spot, index) => {
      spot.author = createdUsers[index % createdUsers.length]._id;
    });

    const createdSpots = await Spot.insertMany(spots);
    console.log('Spots seeded successfully:', createdSpots);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the seed function
seedDatabase();
