const WorkoutExercise = require('../models/workout_exercise');
const { Op } = require('sequelize');

// Create a new superset
exports.createSuperset = async (req, res) => {
    console.log(req.body);
    try {
        const { workout_id, user_id, ids } = req.body;

        // Validate that exactly two exercise_ids are provided
        if (!ids || ids.length !== 2) {
            return res.status(400).json({ message: 'Two IDs must be provided to create a superset.' });
        }
        // Sort the exercise_ids to ensure consistency in `superset_id`
        const [exercise1, exercise2] = ids.sort((a, b) => a - b);

        // Generate a unique `superset_id` based on workout_id, user_id, and sorted exercise_ids
        const superset_id = `${workout_id}-${user_id}-${exercise1}-${exercise2}`;

        // Update both WorkoutExercise records with the new `superset_id`
        await WorkoutExercise.update(
            { superset_id },
            {
                where: {
                    id: ids
                }
            }
        );

        res.status(200).json({
            message: 'Superset created successfully',
            superset_id,
            exercises: ids
        });
    } catch (error) {
        console.error("Error creating superset:", error);
        res.status(500).json({ message: 'Error creating superset', error: error.message });
    }
};

// Remove Superset API
exports.removeSuperset = async (req, res) => {
    try {
        const { ids } = req.body;

        // Validate that exactly two ids are provided
        if (!ids || ids.length !== 2) {
            return res.status(400).json({ message: 'Two IDs must be provided to remove a superset.' });
        }
        // Clear the `superset_id` for the specified exercises in the workout
        await WorkoutExercise.update(
            { superset_id: null },
            {
                where: {
                    id: ids,
                    superset_id: {
                        [Op.ne]: null // Ensure we're only clearing existing supersets
                    }
                }
            }
        );

        res.status(200).json({
            message: 'Superset removed successfully',
            exercises: ids
        });
    } catch (error) {
        console.error("Error removing superset:", error);
        res.status(500).json({ message: 'Error removing superset', error: error.message });
    }
};
