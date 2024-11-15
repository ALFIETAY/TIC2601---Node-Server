const express = require('express');
const router = express.Router();
const supersetController = require('../controllers/supersetController');
const authenticateToken = require('../middleware/authToken'); 

// Protected routes
// Route to create a superset
router.post('/create', authenticateToken, supersetController.createSuperset);

// Route to remove a superset
router.delete('/remove', authenticateToken, supersetController.removeSuperset);

module.exports = router;
