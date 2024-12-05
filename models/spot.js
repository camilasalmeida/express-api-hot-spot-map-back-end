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
    image: {
      type: String,                                                               // Stores the image URL (if uploaded to a cloud service or local directory)
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
        'Concert', 'ComedyClub', 'MovieTheater', 'EscapeRoom', 'AmusementPark', 'Game', 
         'ArtGallery', 'Museum', 'Theater', 'Exhibition', 'Sports', 'OutdoorActivity', 'Beach','Hike', 'Ski',
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