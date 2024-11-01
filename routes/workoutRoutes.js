// Workout API Routes
const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

// GET route to get a user's workout schedule
router.get('/schedule/:user_id', workoutController.getWorkoutSchedule);
// GET route to get exercise history
router.get('/exercise-history/:user_id/:exercise_id', workoutController.getExerciseHistory);
// POST route to add a workout
router.post('/add_workout', workoutController.addWorkout);
// DELETE route to remove a workout
router.delete('/:user_id/:workout_id', workoutController.deleteWorkout);

module.exports = router;
