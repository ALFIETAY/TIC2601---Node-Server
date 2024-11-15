const express = require('express');
const router = express.Router();
const deloadController = require('../controllers/deloadController');
const authenticateToken = require('../middleware/authToken'); 

// Protected routes
// Route to add a new deload period
router.post('/add_deload', authenticateToken, deloadController.addDeloadPeriod);

// Route to get the deload status for a user
router.get('/:user_id', authenticateToken, deloadController.getDeloadStatus);

module.exports = router;
