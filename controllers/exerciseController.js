const Exercise = require('../models/exercise');

//Add exercise
exports.addExercise = async (req, res) => {
    try {
        const { user_id, exercise_name, primary_muscle, secondary_muscle } = req.body;

        // Validate required fields
        if (!exercise_name || !primary_muscle) {
            return res.status(400).json({ message: 'Exercise name and primary muscle are required.' });
        }

        // Create a new exercise
        const exercise = await Exercise.create({
            user_id: user_id || null, // Allows shared exercises with user_id as NULL
            exercise_name,
            primary_muscle,
            secondary_muscle: secondary_muscle || null
        });

        res.status(200).json({
            message: 'Exercise added successfully',
            exercise
        });
    } catch (error) {
        console.error("Error adding exercise:", error);
        res.status(500).json({ message: 'Error adding exercise', error: error.message });
    }
};

// Remove exercise
exports.deleteExercise = async (req, res) => {
    try {
        const { user_id, exercise_id } = req.params;

        // Find the exercise by ID and user ID
        const exercise = await Exercise.findOne({
            where: { exercise_id, user_id }
        });

        // If the exercise is not found, return 404
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found for the specified user.' });
        }

        // Delete the exercise
        await exercise.destroy();

        res.status(200).json({
            message: 'Exercise deleted successfully'
        });
    } catch (error) {
        console.error("Error deleting exercise:", error);
        res.status(500).json({ message: 'Error deleting exercise', error: error.message });
    }
};

// Retrieve exercises by workout_id


// Add sets/reps/weight for each exercise