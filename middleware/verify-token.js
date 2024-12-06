// middleware/verify-token.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;                         // Assign decoded payload to req.user
        next();                                    // Call next() to invoke the next middleware function
    } catch (error) {
        res.status(401).json({ error: 'Invalid authorization token.' })
    }
}

module.exports = verifyToken