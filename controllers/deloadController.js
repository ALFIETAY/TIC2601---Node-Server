const DeloadHistory = require('../models/deload_history');
const Workout = require('../models/workout');
const { Op } = require('sequelize');

// Add deload period
exports.addDeloadPeriod = async (req, res) => {
    try {
        const { user_id, start_date, end_date } = req.body;

        // Validation
        if (!user_id || !start_date || !end_date) {
            return res.status(400).json({ message: 'user_id, start_date, and end_date are required.' });
        }

        // Create a new deload period
        const deloadPeriod = await DeloadHistory.create({
            user_id,
            start_date,
            end_date
        });

        res.status(200).json({
            message: 'Deload period added successfully',
            deloadPeriod
        });
    } catch (error) {
        console.error("Error adding deload period:", error);
        res.status(500).json({ message: 'Error adding deload period', error: error.message });
    }
};

// Get deload status for user and update deload_flag if necessary
exports.getDeloadStatus = async (req, res) => {
    try {
        const { user_id } = req.params;
        const currentDate = new Date();

        // Check for any active deload period for the user
        const activeDeload = await DeloadHistory.findOne({
            where: {
                user_id,
                start_date: { [Op.lte]: currentDate },
                end_date: { [Op.gte]: currentDate }
            }
        });

        // If there is an active deload period, set deload_flag to true for relevant workouts
        if (activeDeload) {
            await Workout.update(
                { deload_flag: true },
                {
                    where: {
                        user_id,
                        workout_date: { [Op.between]: [activeDeload.start_date, activeDeload.end_date] }
                    }
                }
            );
            res.json({
                user_id,
                deload: "Active"
            });
        } else {
            // Set deload_flag to false for workouts outside deload period
            await Workout.update(
                { deload_flag: false },
                {
                    where: {
                        user_id,
                        workout_date: { [Op.lt]: currentDate }
                    }
                }
            );
            res.json({
                user_id,
                deload: "Not Active"
            });
        }
    } catch (error) {
        console.error("Error retrieving deload status:", error);
        res.status(500).json({ message: 'Error retrieving deload status', error: error.message });
    }
};
