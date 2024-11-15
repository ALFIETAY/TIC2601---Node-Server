// Middleware to authenticate JWT token and attach user ID
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'key.env' });

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = user.userId; // Attach userId from token to request
        next();
    });
};

module.exports = authenticateToken;
