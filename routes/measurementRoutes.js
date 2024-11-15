const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');
const authenticateToken = require('../middleware/authToken');

// Protected routes
// GET route to retrieve measurements by user_id
router.get('/:user_id', authenticateToken, measurementController.getUserMeasurements);

// Route to add a measurement
router.post('/add', authenticateToken , measurementController.addMeasurement);

// Route to get the latest measurement for a user
router.get('/latest/:user_id', authenticateToken, measurementController.getLatestMeasurement);

module.exports = router;
