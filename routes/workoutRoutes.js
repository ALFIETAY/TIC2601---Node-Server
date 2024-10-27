// Workout API Routes
const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

// Route to get a user's workout schedule
router.get('/schedule/:user_id', workoutController.getWorkoutSchedule);

module.exports = router;
