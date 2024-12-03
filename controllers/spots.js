// controllers/spots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Spot = require('../models/spot.js');
const router = express.Router();
const mongoose = require('mongoose');

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;           // This line will make sure that newly submitted spots on the client-side would be able to immediately render information about the author.
        const spot = await Spot.create(req.body);
        spot._doc.author = req.user;
        res.status(201).json(spot)
    } catch(error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const spots = await Spot.find({}) 
        .populate('author')                          // The populate() method in Mongoose is used to replace a reference field in a document (like an ID) with the actual data from the referenced document.
        .sort({ createdAt: 'desc' })
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:spotId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId).populate('author');
        res.status(200).json(spot)
    } catch (error){
        res.status(500).json(error)
    }
})

router.put('/:spotId', async (req, res) => {
    try{
        const spot = await Spot.findById(req.params.spotId)             // Retrive the spot we want to update from the database.
        if (!spot.author.equals(req.user._id)) {                         // Check if the user (this Id) has permission to update the resource.
        return res.status(403).send('You are not allowed to Update this Spot!')
        }
        const updatedSpot = await Spot.findByIdAndUpdate(                // Update Spot
            req.params.spotId, req.body, { new: true })                  
            updatedSpot._doc.author = req.user;                          // Apend the req.user to the author.
        res.status(200).json(updatedSpot)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:spotId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.spotId)) {
            return res.status(400).send('Invalid Spot ID format.');
        }
        
        const spot = await Spot.findById(req.params.spotId)                     // Find the SpotId. 
        if (!spot.author.equals(req.user._id)) {                                // Check the permissions.
            return res.status(403).send('You are not allowed to delete this Spot!.')
        } 
        const deletedSpot = await Spot.findByIdAndDelete(req.params.spotId)     // Remove spot from the database.
        res.status(200).json(deletedSpot)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
