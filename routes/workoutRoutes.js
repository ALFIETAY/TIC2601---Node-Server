// Workout API Routes
const express = require('express');
const workoutController = require('../controllers/workoutController');
const authenticateToken = require('../middleware/authToken');

const router = express.Router();

// Protected routes
// GET route to get a user's workout schedule
router.get('/schedule/:user_id', authenticateToken, workoutController.getWorkoutSchedule);

// DELETE route to delete workout_exercises by id
router.delete('/workout_exercises/:id', authenticateToken,  workoutController.deleteWorkoutExercise);

// POST route to add a workout
router.post('/add_workout', authenticateToken, workoutController.addWorkout);

// DELETE route to remove a workout
router.delete('/:user_id/:workout_id', authenticateToken, workoutController.deleteWorkout);

// Route to update fatigue rating
router.put('/fatigue_rating/:workout_id', authenticateToken, workoutController.updateFatigueRating);

// GET route to retrieve exercise by workout_id 
router.get('/exercises/:workout_id', authenticateToken, workoutController.getExercisesByWorkoutId);

module.exports = router;
