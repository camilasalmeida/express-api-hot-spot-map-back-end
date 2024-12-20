// server.js

const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const testJWTRouter = require('./controllers/test-jwt')
const usersRouter = require('./controllers/users')
const profilesRouter = require('./controllers/profiles')
const spotsRouter = require('./controllers/spots.js')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

//console.log('Users router loaded');
//console.log(require.resolve('./controllers/users'));

app.use(cors());
app.use(express.json());

app.use('/spots', spotsRouter);
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);

app.listen(process.env.PORT || 3000)