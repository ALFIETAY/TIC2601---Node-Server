// API Controllers for Workout
const Workout = require('../models/workout');
const WorkoutExercise = require('../models/workout_exercise');
const Exercise = require('../models/exercise');

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

// Get exercise history over time for a specific exercise_id
exports.getExerciseHistory = async (req, res) => {
    try {
        const { user_id, exercise_id } = req.params;

        // Step 1: Find all workout_ids for the specified user_id
        const userWorkouts = await Workout.findAll({
            where: { user_id },
            attributes: ['workout_id'] // Only fetch the workout_id
        });

        // If no workouts are found for the user, return a 404
        if (!userWorkouts.length) {
            return res.status(404).json({ message: 'No workouts found for the specified user.' });
        }

        // Extract workout_ids as an array
        const workoutIds = userWorkouts.map(workout => workout.workout_id);
        console.log("Workout IDs for user:", workoutIds);

        // Step 2: Find all ids in WorkoutExercise that match the workout_ids and exercise_id
        const workoutExerciseEntries = await WorkoutExercise.findAll({
            where: {
                workout_id: workoutIds, // Filter by user's workout IDs array
                exercise_id: exercise_id // Filter by specified exercise_id
            },
            attributes: ['id'], 
        });

        console.log ("workout E:", workoutExerciseEntries)
        
        // Extract the ids for direct querying
        const workoutExerciseIds = workoutExerciseEntries.map(entry => entry.id);
        console.log("WorkoutExercise IDs:", workoutExerciseIds);

        // Step 3: Query WorkoutExercise directly using the retrieved `id`s
        const exerciseHistory = await WorkoutExercise.findAll({
            where: {
                id: workoutExerciseIds // Filter by the primary key `id`s directly
            },
            attributes: ['workout_id', 'set_number', 'reps', 'weight'], // Only fetch necessary fields
            order: [['workout_id', 'ASC'], ['set_number', 'ASC']]
        });

        // If no records found, return 404
        if (!exerciseHistory.length) {
            return res.status(404).json({ message: 'No records found for the specified exercise and user.' });
        }

        // Format the response
        const response = exerciseHistory.map(record => ({
            workout_id: record.workout_id,
            set_number: record.set_number,
            reps: record.reps,
            weight: record.weight
        }));

        console.log("Final Response:", response);
        res.json({ exercise_id, user_id, history: response });
    } catch (error) {
        console.error("Error retrieving exercise history:", error);
        res.status(500).json({ message: 'Error retrieving exercise history', error: error.message });
    }
};


// Get Measurements, Track measurements (weight, bodyfat%, waistline)

// Add workouts

// Remove workouts

//
