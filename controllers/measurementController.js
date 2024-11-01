const Measurement = require('../models/measurement');

// Get measurement of user
exports.getUserMeasurements = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user_id from URL parameters

        // Query measurements for the specified user_id
        const measurements = await Measurement.findAll({
            where: { user_id },
            attributes: ['date', 'weight', 'bodyfat_percentage', 'waistline'],
            order: [['date', 'ASC']] // Order by date in ascending order
        });

        // If no measurements are found, return a 404 response
        if (!measurements.length) {
            return res.status(404).json({ message: 'No measurements found for the specified user.' });
        }

        // Send the measurements in the response
        res.json({ user_id, measurements });
    } catch (error) {
        console.error("Error retrieving measurements:", error);
        res.status(500).json({ message: 'Error retrieving measurements', error: error.message });
    }
};

// Add measurement for user


// Get latest user measurement 