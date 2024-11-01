const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Route to add an exercise
router.post('/add_exercise', exerciseController.addExercise);

// Route to delete an exercise
router.delete('/:user_id/:exercise_id', exerciseController.deleteExercise);

module.exports = router;
