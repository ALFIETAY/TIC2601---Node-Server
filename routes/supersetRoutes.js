const express = require('express');
const router = express.Router();
const supersetController = require('../controllers/supersetController');

// Route to create a superset
router.post('/create_superset', supersetController.createSuperset);

// Route to update a superset
router.put('/update_superset', supersetController.updateSuperset);

module.exports = router;
