const WorkoutExercise = require('../models/workout_exercise');
const { Op } = require('sequelize');

// Create a new superset
exports.createSuperset = async (req, res) => {
    try {
        const { workout_id, user_id, exercise_ids } = req.body;

        // Validate that exactly two exercise_ids are provided
        if (!exercise_ids || exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two exercise IDs must be provided to create a superset.' });
        }

        // Sort the exercise_ids to ensure consistency in `superset_id`
        const [exercise1, exercise2] = exercise_ids.sort((a, b) => a - b);

        // Generate a unique `superset_id` based on workout_id, user_id, and sorted exercise_ids
        const superset_id = `${workout_id}-${user_id}-${exercise1}-${exercise2}`;

        // Update both WorkoutExercise records with the new `superset_id`
        await WorkoutExercise.update(
            { superset_id },
            {
                where: {
                    workout_id,
                    exercise_id: exercise_ids
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

// Update Superset
exports.updateSuperset = async (req, res) => {
    try {
        const { workout_id, user_id, old_exercise_ids, new_exercise_ids } = req.body;

        // Validate that exactly two exercise_ids are provided in both old and new sets
        if (!old_exercise_ids || old_exercise_ids.length !== 2 || !new_exercise_ids || new_exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two old and two new exercise IDs must be provided to update a superset.' });
        }

        // Step 1: Clear the existing `superset_id` for the old exercises
        await WorkoutExercise.update(
            { superset_id: null },
            {
                where: {
                    workout_id,
                    exercise_id: old_exercise_ids
                }
            }
        );

        // Step 2: Sort the new exercise_ids to generate a consistent `superset_id`
        const [new_exercise1, new_exercise2] = new_exercise_ids.sort((a, b) => a - b);

        // Generate the new `superset_id` using workout_id, user_id, and sorted new_exercise_ids
        const new_superset_id = `${workout_id}-${user_id}-${new_exercise1}-${new_exercise2}`;

        // Step 3: Assign the new `superset_id` to the new exercises
        await WorkoutExercise.update(
            { superset_id: new_superset_id },
            {
                where: {
                    workout_id,
                    exercise_id: new_exercise_ids
                }
            }
        );

        res.status(200).json({
            message: 'Superset updated successfully',
            new_superset_id,
            exercises: new_exercise_ids
        });
    } catch (error) {
        console.error("Error updating superset:", error);
        res.status(500).json({ message: 'Error updating superset', error: error.message });
    }
};

// Remove Superset API
exports.removeSuperset = async (req, res) => {
    try {
        const { workout_id, user_id, exercise_ids } = req.body;

        // Validate that exactly two exercise_ids are provided
        if (!exercise_ids || exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two exercise IDs must be provided to remove a superset.' });
        }

        // Clear the `superset_id` for the specified exercises in the workout
        await WorkoutExercise.update(
            { superset_id: null },
            {
                where: {
                    workout_id,
                    exercise_id: exercise_ids,
                    superset_id: {
                        [Op.ne]: null // Ensure we're only clearing existing supersets
                    }
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
