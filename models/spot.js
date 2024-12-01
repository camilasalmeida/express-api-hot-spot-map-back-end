// models/spot.js

const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    message: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rejected'],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  },
  { timestamps: true }
);

const spotSchema = new mongoose.Schema(
  {
    spotName: {
      type: String,
      required: true
    },
      address: {
        type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Restaurant', 'Bar', 'NightClub', 'Party', 'CoffeeShop', 'WineTasting',
        'Concert', 'ComedyClub', 'MovieTheater', 'EscapeRoom', 'AmusementPark',
         'ArtGallery', 'Museum', 'Theater', 'Exhibition', 'Sports', 'OutdoorActivity', 'Ski',
        'Spa', 'Workshop', 'Class', 'Trip', 'Camping',
      ]
    },
    dresscode: {
      type: String,
      required: true,
      enum: [
        'Formal', 'Casual', 'Business Casual', 'Smart Casual', 
        'Black Tie', 'Theme Specific', 'None'
      ]
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guests: [guestSchema]
  },
  { timestamps: true }
);


const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;