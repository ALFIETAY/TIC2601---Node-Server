// API Controllers for Workout
const Workout = require('../models/workout');

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
