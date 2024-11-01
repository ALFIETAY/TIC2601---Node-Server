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
            let deloadStatus = "Not Active";
            
            // Loop through each deload period to see if the workout date falls within any period
            for (const deload of deloadHistories) {
                if (
                    new Date(workout.workout_date) >= new Date(deload.start_date) &&
                    new Date(workout.workout_date) <= new Date(deload.end_date)
                ) {
                    deloadStatus = "Active";
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
            attributes: ['id', 'set_number', 'reps', 'weight'],
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
            secondary_muscle: record.Exercise.secondary_muscle
        }));

        res.json({ workout_id, exercises: response });
    } catch (error) {
        console.error("Error retrieving exercises by workout_id:", error);
        res.status(500).json({ message: 'Error retrieving exercises', error: error.message });
    }
};

// Add deload or fatigue rating