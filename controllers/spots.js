// controllers/spots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Spot = require('../models/spot.js');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');                                // Add multer for file uploads
const upload = multer({ dest: 'uploads/' });                     // Set 'uploads/' as the destination for uploaded files
const { sendEmail } = require('../services/emailService');

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;                           // This line will make sure that newly submitted spots on the client-side would be able to immediately render information about the author.
        const spot = await Spot.create(req.body);
        spot._doc.author = req.user;
        res.status(201).json(spot)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const spots = await Spot.find({})
            .populate('author', 'username')                          // The populate() method in Mongoose is used to replace a reference field in a document (like an ID) with the actual data from the referenced document.
            .sort({ createdAt: 'desc' })
        //console.log('Populated Spots:', spots);
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:spotId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId)
            .populate('author', 'username')
            .populate('guests.author', 'username');
        res.status(200).json(spot)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:spotId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId)             // Retrive the spot we want to update from the database.
        if (!spot.author.equals(req.user._id)) {                         // Check if the user (this Id) has permission to update the resource.
            return res.status(403).send('You are not allowed to Update this Spot!')
        }
        const updatedSpot = await Spot.findByIdAndUpdate(                // Update Spot
            req.params.spotId,
            req.body,
            { new: true }
        )
        updatedSpot._doc.author = req.user;                          // Apend the req.user to the author.
        res.status(200).json(updatedSpot)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:spotId', async (req, res) => {
    try {
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


//Modify the POST /:spotId/guests endpoint to send an email when a guest is added.
router.post('/:spotId/guests', async (req, res) => {
    try {
        req.body.author = req.user._id                                          // Append the user to the author. 
        const spot = await Spot.findById(req.params.spotId)                     // Find the parent/spot Id.
        // Formating the time
        const timeFormatted = req.body.time
            ? new Date(`1970-01-01T${req.body.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            : 'Not provided';
        req.body.time = timeFormatted; // Overwrite time with formatted version

        spot.guests.push(req.body)                                              // We will use the push() method to add the new guest data to the guests array inside of the Spot document.
        await spot.save()                                                       // Save the guest to our database.
        const newGuest = spot.guests[spot.guests.length - 1]                    // Locate the new Guest using its position at the end of the the spot.guests array.
        newGuest._doc.author = req.user;                                        // Append the author property with a user object.

        //Send email to the guest
        const subject = `You're Invited to ${spot.spotName}!`;
        const text = `Hi ${newGuest.name.toUpperCase()},

You've been invited to ${spot.spotName.toUpperCase()} by ${req.user.username}.

Address: ${spot.address || 'Not provided'}
Category: ${spot.category || 'Not provided'}
Date: ${newGuest.date || 'Not provided'}
Time: ${newGuest.time || 'Not provided'}
Message: ${newGuest.message || 'No additional message.'}

Photo: ${newGuest.image ? `See attached photo` : 'No photo provided'}

Please respond to this invitation.`;

        await sendEmail(req.body.email, subject, text);
        res.status(201).json(newGuest)
    } catch (error) {
        res.status(500).json(error);
    }
})

router.put('/:spotId/guests/:guestId', async (req, res) => {
    console.log('Spot ID:', req.params.spotId, 'Guest ID:', req.params.guestId);
    console.log('Request Body:', req.body);
    try {
        const spot = await Spot.findById(req.params.spotId)                     // Find the parent document that holds an array of Guests.
        if (!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }

        const guest = spot.guests.id(req.params.guestId)                        // Find the specific guest we wish to update within the array. To do so, we will use the MongooseDocumentArray(SPOT).prototype(GUEST).id()(ID(REQ.PARAMS.GUESTID)) method. This method is called on the array of a document, and returns an embedded subdocument based on the provided ObjectId ( req.params.guestId ).
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        Object.assign(guest, req.body);
        console.log('Guest After Update:', guest);
        //guest.text = req.body.text                                              // Update its text property.
        await spot.save()                                                       // Save the document (spot).
        //res.status(200).json({ message: 'Ok' })
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:spotId/guests/:guestId', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId)                  // Find the parent.
        spot.guests.remove({ _id: req.params.guestId })
        await spot.save()
        res.status(200).json({ message: 'Ok' })
    } catch (error) {
        res.status(500).json(error)
    }
})

//----------------adding this route ------------------//

router.put('/:spotId/guests/:guestId/respond', async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.spotId);
        const guest = spot.guests.id(req.params.guestId);

        if (!guest) return res.status(404).json({ error: 'Guest not found' });

        guest.status = req.body.status; // Accept or Reject
        await spot.save();

        res.status(200).json({ message: `Guest has ${req.body.status} the invitation.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
