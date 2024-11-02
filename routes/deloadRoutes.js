const express = require('express');
const router = express.Router();
const deloadController = require('../controllers/deloadController');

// Route to add a new deload period
router.post('/add_deload', deloadController.addDeloadPeriod);

// Route to get the deload status for a user
router.get('/:user_id', deloadController.getDeloadStatus);

module.exports = router;
