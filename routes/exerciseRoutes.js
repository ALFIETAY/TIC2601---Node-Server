const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Route to add an exercise
router.post('/add_exercise', exerciseController.addExercise);

// Route to delete an exercise 
router.delete('/:user_id/:exercise_id', exerciseController.deleteExercise);

// GET route to retrieve past 4 weeks exercise history
router.get('/exercise_history/:user_id', exerciseController.getExerciseHistory);

// Route to add a set, reps, and weight for a specific workout and exercise
router.post('/record_workout_exercise', exerciseController.addWorkoutExercise);

module.exports = router;
