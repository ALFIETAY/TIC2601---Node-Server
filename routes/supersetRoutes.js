const express = require('express');
const router = express.Router();
const supersetController = require('../controllers/supersetController');

// Route to create a superset
router.post('/create', supersetController.createSuperset);

// Route to remove a superset
router.delete('/remove', supersetController.removeSuperset);

module.exports = router;
