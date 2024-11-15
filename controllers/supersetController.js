const WorkoutExercise = require('../models/workout_exercise');
const { Op } = require('sequelize');

// Create a new superset
exports.createSuperset = async (req, res) => {
    console.log(req.body);
    try {
        const { workout_id, exercise_ids } = req.body;
        const user_id = req.userId; // Get user_id from JWT token

        // Validate that exactly two exercise_ids are provided
        if (!exercise_ids || exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two IDs must be provided to create a superset.' });
        }

        // Sort the exercise_ids to ensure consistency in `superset_id`
        const [exercise1, exercise2] = exercise_ids.sort((a, b) => a - b);

        // Generate a unique `superset_id` based on workout_id, user_id, and sorted exercise_ids
        const superset_id = `${workout_id}-${user_id}-${exercise1}-${exercise2}`;

        // Ensure both exercises belong to the specified workout
        const exercises = await WorkoutExercise.findAll({
            where: {
                workout_id,
                id: exercise_ids,
            },
            attributes: ['id']
        });

        if (exercises.length !== 2) {
            return res.status(400).json({ message: 'Both exercises must belong to the specified workout to create a superset.' });
        }

        // Update both WorkoutExercise records with the new `superset_id`
        await WorkoutExercise.update(
            { superset_id },
            {
                where: {
                    id: exercise_ids
                }
            }
        );

        res.status(200).json({
            message: 'Superset created successfully',
            superset_id,
            exercises: exercise_ids
        });
    } catch (error) {
        console.error("Error creating superset:", error);
        res.status(500).json({ message: 'Error creating superset', error: error.message });
    }
};

// Remove Superset API
exports.removeSuperset = async (req, res) => {
    try {
        const { exercise_ids } = req.body;
        const user_id = req.userId; // Get user_id from JWT token

        // Validate that exactly two exercise_ids are provided
        if (!exercise_ids || exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two exercise IDs must be provided to remove a superset.' });
        }

        // Check that the exercises have the same superset ID
        const exercises = await WorkoutExercise.findAll({
            where: {
                id: exercise_ids,
                superset_id: {
                    [Op.ne]: null // Ensure we're only clearing existing supersets
                }
            },
            attributes: ['superset_id']
        });

        if (exercises.length !== 2 || exercises[0].superset_id !== exercises[1].superset_id) {
            return res.status(400).json({ message: 'The specified exercises do not form a valid superset.' });
        }

        // Clear the `superset_id` for the specified exercises in the workout
        await WorkoutExercise.update(
            { superset_id: null },
            {
                where: {
                    id: exercise_ids
                }
            }
        );

        res.status(200).json({
            message: 'Superset removed successfully',
            exercises: exercise_ids
        });
    } catch (error) {
        console.error("Error removing superset:", error);
        res.status(500).json({ message: 'Error removing superset', error: error.message });
    }
};
