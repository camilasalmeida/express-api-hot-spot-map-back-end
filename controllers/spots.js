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

router.post('/:spotId/guests', async (req, res) => {
    try {
        req.body.author = req.user._id                                          // Append the user to the author.
        const spot = await Spot.findById(req.params.spotId)                     // Find the parent/spot Id.
        spot.guests.push(req.body)                                              // We will use the push() method to add the new guest data to the guests array inside of the Spot document.
        await spot.save()                                                       // Save the guest to our database.
        const newGuest = spot.guests[spot.guests.length - 1]                    // Locate the new Guest using its position at the end of the the spot.guests array.
        newGuest._doc.author = req.user;                                        // Append the author property with a user object.
        res.status(200).json(newGuest)
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put('/:spotId/guests/:guestId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId)                     // Find the parent document that holds an array of Guests.
        const guest = spot.guests.id(req.params.guestId)                        // Find the specific guest we wish to update within the array. To do so, we will use the MongooseDocumentArray(SPOT).prototype(GUEST).id()(ID(REQ.PARAMS.GUESTID)) method. This method is called on the array of a document, and returns an embedded subdocument based on the provided ObjectId ( req.params.guestId ).
        guest.text = req.body.text                                              // Update its text property.
        await spot.save()                                                       // Save the document (spot).
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:spotId/guests/:guestId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId)                  // Find the parent.
        spot.guests.remove({ _id: req.params.guestId })                       //
        await spot.save()
        res.status(200).json({ message: 'Ok' })

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
