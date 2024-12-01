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
      required: true
    },
    time: {
      type: String,
      required: true
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
        required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Restaurant', 'Bar', 'Concert', 'MovieTheater', 'CoffeeShop', 
        'Sports', 'OutdoorActivity', 'Spa', 'Experience', 'Workshop', 
        'Class', 'ArtGallery', 'Museum', 'AmusementPark', 'EscapeRoom', 
        'ComedyClub', 'WineTasting', 'Trip'
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