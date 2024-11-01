const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// GET route to retrieve measurements by user_id
router.get('/:user_id', measurementController.getUserMeasurements);

// Route to add a measurement
router.post('/add', measurementController.addMeasurement);

// Route to get the latest measurement for a user
router.get('/latest/:user_id', measurementController.getLatestMeasurement);

module.exports = router;
