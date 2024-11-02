const WorkoutExercise = require('../models/workout_exercise');
const { Op } = require('sequelize');

// Create a new superset
exports.createSuperset = async (req, res) => {
    try {
        const { workout_id, exercise_ids } = req.body;

        // Validate that exactly two exercise_ids are provided
        if (!exercise_ids || exercise_ids.length !== 2) {
            return res.status(400).json({ message: 'Two exercise IDs must be provided to create a superset.' });
        }

        // Get the latest `superset_id` and increment it
        const lastSuperset = await WorkoutExercise.findOne({
            where: { superset_id: { [Op.not]: null } },
            attributes: ['superset_id'],
            order: [['superset_id', 'DESC']]
        });

        // Increment the last superset_id or start at 1 if none exists
        const superset_id = lastSuperset ? lastSuperset.superset_id + 1 : 1;

        // Update the exercises with the new `superset_id`
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


// Update an existing superset
exports.updateSuperset = async (req, res) => {
    try {
        const { workout_id, old_exercise_ids, new_exercise_ids } = req.body;

        // Validate that exactly two exercise_ids are provided in both old and new
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

        // Step 2: Get the latest `superset_id` and increment it for the new superset
        const lastSuperset = await WorkoutExercise.findOne({
            where: { superset_id: { [Op.not]: null } },
            attributes: ['superset_id'],
            order: [['superset_id', 'DESC']]
        });

        // Increment the last superset_id or start at 1 if none exists
        const new_superset_id = lastSuperset ? lastSuperset.superset_id + 1 : 1;

        // Step 3: Assign the new `superset_id` to the specified new exercises
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
