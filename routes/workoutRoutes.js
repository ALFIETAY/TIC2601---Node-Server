// Workout API Routes
const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

// GET route to get a user's workout schedule
router.get('/schedule/:user_id', workoutController.getWorkoutSchedule);

router.delete('/workout_exercises/:id', workoutController.deleteWorkoutExercise);

// POST route to add a workout
router.post('/add_workout', workoutController.addWorkout);

// DELETE route to remove a workout
router.delete('/:user_id/:workout_id', workoutController.deleteWorkout);

// Route to update fatigue rating
router.put('/fatigue_rating/:workout_id', workoutController.updateFatigueRating);

// GET route to retrieve exercise by workout_id 
router.get('/exercises/:workout_id', workoutController.getExercisesByWorkoutId);

// DELETE route to delete workout_exercises by id
// router.delete('/workout_exercises/:user_id/:workout_id/:exercise_id', workoutController.deleteWorkoutExercise);


// router.get('/workout_exercises/:id', workoutController.get);


module.exports = router;
