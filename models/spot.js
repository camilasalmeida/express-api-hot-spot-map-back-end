// models/spot.js

const mongoose = require('mongoose')

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
      default: null, // Explicitly set to null if not provided
    },
    time: {
      type: String,
      default: '', // Use an empty string for optional time
    },
    message: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rejected'],
      default: 'Pending', // Default value
    },
    image: {
      type: String,                                                               // Stores the image URL (if uploaded to a cloud service or local directory)
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //response: { type: String, enum: ['Yes', 'No', 'Maybe', 'No Response'], default: 'No Response' }, // Track guest's response
},
{ timestamps: true }
)

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
        'AmusementPark', 'ArtGallery', 'Bar', 'Beach', 'BikeRide', 'BoardGames', 
        'BoatRide', 'Camping', 'ComedyClub', 'Concert', 'CookingClassSession', 
        'CookingTogether', 'CoffeeShop', 'DayTrip', 'DigitalDetox', 'Dinner', 
        'EscapeRoom', 'Exhibition', 'FireplaceChill', 'ForestWalk', 'Game', 
        'GymSession', 'HolidayMarkets', 'HomeSpa', 'HotStoneMassage', 
        'IceBathRecoverySession', 'IndoorMovieNight', 'IndoorPhotoshoot', 
        'ManicureAndPedicureSession', 'MassageSession', 'MeditationSession', 
        'MiniGolf', 'MovieNight', 'MovieTheater', 'Museum', 'MusicJam', 
        'NatureWalk', 'NightClub', 'PajamaParty', 'Picnic', 'Potluck', 
        'Restaurant', 'RooftopSession', 'ScienceMuseum', 'SkiingSession', 
        'SnowboardingSession', 'SnowfallWatching', 'SpaSession', 'Sports', 
        'TacoNight', 'Theater', 'Trip', 'VintageShopping', 'VideoGameSession', 
        'WineTasting', 'WinterSaunaSession',
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
)


const Spot = mongoose.model('Spot', spotSchema)

module.exports = Spot