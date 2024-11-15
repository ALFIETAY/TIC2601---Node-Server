// User API Routes
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST route to create a new user
router.post('/signup', userController.signup);

// POST route to login user, this does not return JSON data for security
router.post('/login', userController.login); 

// PUT route to update user password
router.put('/forget', userController.forgetPass);

module.exports = router;
