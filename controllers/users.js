// controllers/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        // Check if the email and username are already taken
        const usernameInDatabase = await User.findOne({ username: req.body.username })
        if (usernameInDatabase) {
            return res.json({error: 'Username already taken.'});
            
        }

        const emailInDatabase = await User.findOne({ email: req.body.email });
        if (emailInDatabase) {
            return res.json({error: 'Email already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        //const token = jwt.sign({ username: user.username, email: user.email, _id: user._id }, process.env.JWT_SECRET);
        const token = jwt.sign(
            {username: user.username, _id: user._id},
            process.env.JWT_SECRET
        )
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    //console.log("in login")
    try {
        // const user = await User.findOne({
        //     $or: [{ email: req.body.email }, { username: req.body.username }],         // The $or operator makes your query flexible by allowing it to match one field or another, making it ideal for scenarios like logging in with either an email or a username.
        // });
        const user = await User.findOne({username: req.body.username})

        // const user = await User.findOne({
        //     email: req.body.email,
        //     username: req.body.username
        // });


        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({
                username: user.username,
                _id: user._id
                },
                process.env.JWT_SECRET)
            res.status(200).json({ token })
        } else {
            res.status(401).json({ error: 'Invalid email, username or password.' })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

module.exports = router