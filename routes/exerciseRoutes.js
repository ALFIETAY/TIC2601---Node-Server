const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authenticateToken = require('../middleware/authToken'); 

// Protected routes
// Route to add an exercise
router.post('/add_exercise', authenticateToken, exerciseController.addExercise);

// Route to delete an exercise 
router.delete('/:user_id/:exercise_id', authenticateToken, exerciseController.deleteExercise);

// GET route to retrieve past 4 weeks exercise history
router.get('/exercise_history/:user_id', authenticateToken, exerciseController.getExerciseHistory);

// Route to add a set, reps, and weight for a specific workout and exercise
router.post('/record_workout_exercise', authenticateToken, exerciseController.addWorkoutExercise);

// Route to get all exercises of user
router.get('/all_exercise', authenticateToken, exerciseController.getExercises);

module.exports = router;
