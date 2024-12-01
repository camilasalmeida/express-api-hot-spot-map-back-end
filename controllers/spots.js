// controllers/spots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Spot = require('../models/spot.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;           // This line will make sure that newly submitted spots on the client-side would be able to immediately render information about the author.
        const spot = await Spot.create(req.body);
        spot._doc.author = req.user;
        res.status(201).json(spot);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const spots = await Spot.find({}) 
        .populate('author')                          // The populate() method in Mongoose is used to replace a reference field in a document (like an ID) with the actual data from the referenced document.
        .sort({ createdAt: 'desc' });
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json(error);
    }
})











module.exports = router;
