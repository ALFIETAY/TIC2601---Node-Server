const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// GET route to retrieve measurements by user_id
router.get('/:user_id', measurementController.getUserMeasurements);

module.exports = router;
