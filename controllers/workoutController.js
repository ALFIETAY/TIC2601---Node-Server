// API Controllers for Workout
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workout_exercise');
const Exercise = require('../models/exercise');
const DeloadHistory = require('../models/deload_history');
const { Op } = require('sequelize');

// Get user's workout schedule - Check if Deload is Active or Not Active depending on date
exports.getWorkoutSchedule = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Step 1: Retrieve all workouts for the user, ordered by date
        const workouts = await Workout.findAll({
            where: { user_id },
            attributes: ['workout_id', 'workout_date', 'fatigue_rating', 'deload_flag'],
            order: [['workout_date', 'DESC']]
        });

        if (!workouts.length) {
            return res.status(404).json({ message: 'No workouts found for the specified user.' });
        }

        // Step 2: Retrieve all deload history records for the user
        const deloadHistories = await DeloadHistory.findAll({
            where: { user_id },
            attributes: ['start_date', 'end_date']
        });

        // Step 3: Check each workout against the deload periods
        const workoutSchedule = workouts.map((workout) => {
            let deloadStatus = false;
            
            // Loop through each deload period to see if the workout date falls within any period
            for (const deload of deloadHistories) {
                if (
                    new Date(workout.workout_date) >= new Date(deload.start_date) &&
                    new Date(workout.workout_date) <= new Date(deload.end_date)
                ) {
                    deloadStatus = true;
                    break;
                }
            }

            // Return the workout object with the deload status
            return {
                workout_id: workout.workout_id,
                workout_date: workout.workout_date,
                fatigue_rating: workout.fatigue_rating,
                deload: deloadStatus // Set to "Active" or "Not Active"
            };
        });

        res.status(200).json({
            message: 'Workouts retrieved successfully',
            workouts: workoutSchedule
        });
    } catch (error) {
        console.error("Error retrieving workouts:", error);
        res.status(500).json({ message: 'Error retrieving workouts', error: error.message });
    }
};

// Add workout
exports.addWorkout = async (req, res) => {
    try {
        const { user_id, fatigue_rating, deload_flag } = req.body;

        // Validate required fields
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Set workout_date to the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Create a new workout
        const workout = await Workout.create({
            user_id,
            workout_date: currentDate,
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

// Retrieve exercises by workout_id
exports.getExercisesByWorkoutId = async (req, res) => {
    try {
        const { workout_id } = req.params;

        // Find all exercises associated with the specified workout_id 
        const exercises = await WorkoutExercise.findAll({
            where: { workout_id },
            attributes: ['id', 'set_number', 'reps', 'weight','superset_id'],
            include: [
                {
                    model: Exercise,
                    attributes: ['exercise_name', 'primary_muscle', 'secondary_muscle']
                }
            ],
            order: [['set_number', 'ASC']] // Order by set number if desired
        });

        // If no exercises found, return 404
        if (!exercises.length) {
            return res.status(404).json({ message: 'No exercises found for the specified workout_id.' });
        }

        // Format response
        const response = exercises.map(record => ({
            id: record.id,
            set_number: record.set_number,
            reps: record.reps,
            weight: record.weight,
            exercise_name: record.Exercise.exercise_name,
            primary_muscle: record.Exercise.primary_muscle,
            secondary_muscle: record.Exercise.secondary_muscle,
            superset_id:record.superset_id
        }));

        res.json({ workout_id, exercises: response });
    } catch (error) {
        console.error("Error retrieving exercises by workout_id:", error);
        res.status(500).json({ message: 'Error retrieving exercises', error: error.message });
    }
};

// Update fatigue rating for a specific workout
exports.updateFatigueRating = async (req, res) => {
    try {
        const { workout_id } = req.params; // Get workout_id from route parameters
        const { fatigue_rating } = req.body; // Get new fatigue rating from request body

        // Validate that fatigue_rating is provided
        if (fatigue_rating === undefined) {
            return res.status(400).json({ message: 'Fatigue rating is required.' });
        }

        // Find the workout by workout_id
        const workout = await Workout.findByPk(workout_id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found.' });
        }

        // Update the fatigue rating
        workout.fatigue_rating = fatigue_rating;
        await workout.save();

        res.status(200).json({
            message: 'Fatigue rating updated successfully',
            workout
        });
    } catch (error) {
        console.error('Error updating fatigue rating:', error);
        res.status(500).json({ message: 'Error updating fatigue rating', error: error.message });
    }
};

// Delete WorkoutExercise by id
exports.deleteWorkoutExercise = async (req, res) => {
    try {
        const { id } = req.params; // Retrieve user_id, workout_id, and exercise_id from URL parameters
        
        // Find the WorkoutExercise entry using user_id, workout_id, and exercise_id
        const workoutExercise = await WorkoutExercise.findOne({
            where: {
                id: id
            }
        });

        // Check if the specified entry exists
        if (!workoutExercise) {
            return res.status(404).json({ message: 'Workout exercise not found for the ID.' });
        }

        // Delete the found entry
        await workoutExercise.destroy();
        
        // Send success response
        res.status(200).json({ message: 'Workout exercise deleted successfully.' });
    } catch (error) {
        console.error("Error deleting workout exercise:", error);
        res.status(500).json({ message: 'Error deleting workout exercise', error: error.message });
    }
};
