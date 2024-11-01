// API Controllers for Workout
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workout_exercise');
const Exercise = require('../models/exercise');
const { Op } = require('sequelize');

// Get user's workout schedule
exports.getWorkoutSchedule = async (req, res) => {
    try {
        const { user_id } = req.params; // Get user_id from route parameters

        // Find all workouts for the user
        const workouts = await Workout.findAll({
            where: { user_id },
            attributes: { exclude: ['user_id'] }, // Exclude user_id from the result
            order: [['workout_date', 'DESC']] // Order by workout_date, latest being on the top
        });

        res.status(200).json({ message: 'Workouts retrieved successfully', workouts });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving workouts', error });
    }
};

// Add workout
exports.addWorkout = async (req, res) => {
    try {
        const { user_id, workout_date, fatigue_rating, deload_flag } = req.body;

        // Validate required fields
        if (!user_id || !workout_date) {
            return res.status(400).json({ message: 'User ID and workout date are required.' });
        }

        // Create a new workout
        const workout = await Workout.create({
            user_id,
            workout_date,
            fatigue_rating: fatigue_rating || null,
            deload_flag: deload_flag || false
        });

        res.status(200).json({
            message: 'Workout added successfully',
            workout
        });
    } catch (error) {
        console.error("Error adding workout:", error);
        res.status(500).json({ message: 'Error adding workout', error: error.message });
    }
};

// Remove workouts
exports.deleteWorkout = async (req, res) => {
    try {
        const { workout_id, user_id } = req.params;

        // Find the workout by ID and user ID
        const workout = await Workout.findOne({
            where: { workout_id, user_id }
        });

        // If workout is not found, return 404
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found for the specified user.' });
        }

        // Delete the workout, which will cascade to Workout_Exercises
        await workout.destroy();

        res.status(200).json({
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting workout:", error);
        res.status(500).json({ message: 'Error deleting workout', error: error.message });
    }
};



