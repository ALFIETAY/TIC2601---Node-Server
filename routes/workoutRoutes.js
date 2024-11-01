// Workout API Routes
const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

// GET route to get a user's workout schedule
router.get('/schedule/:user_id', workoutController.getWorkoutSchedule);
// GET route to get exercise history
router.get('/exercise-history/:user_id/:exercise_id', workoutController.getExerciseHistory);


module.exports = router;
