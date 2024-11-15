const Measurement = require('../models/measurement');

// Get measurement of user
exports.getUserMeasurements = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user_id from URL parameters

        // Ensure the `user_id` in the request matches the authenticated `userId`
        if (parseInt(user_id) !== req.userId) {
            return res.status(403).json({ message: 'Access denied: unauthorized user' });
        }

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

// Add a measurement for a user
exports.addMeasurement = async (req, res) => {
    try {
        const { user_id, weight, bodyfat_percentage, waistline } = req.body;

        // Validate required fields
        if (!user_id || !weight || !bodyfat_percentage || !waistline) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Set the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Create a new measurement
        const measurement = await Measurement.create({
            user_id: req.userId, // User user_id from token
            date: currentDate,
            weight,
            bodyfat_percentage: bodyfat_percentage,
            waistline: waistline
        });

        res.status(201).json({
            message: 'Measurement added successfully',
            measurement
        });
    } catch (error) {
        console.error("Error adding measurement:", error);
        res.status(500).json({ message: 'Error adding measurement', error: error.message });
    }
};

// Get the latest measurement for a user
exports.getLatestMeasurement = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Ensure the `user_id` in the request matches the authenticated `userId`
        if (parseInt(user_id) !== req.userId) {
            return res.status(403).json({ message: 'Access denied: unauthorized user' });
        }

        // Find the latest measurement for the user based on date
        const latestMeasurement = await Measurement.findOne({
            where: { user_id },
            order: [['date', 'DESC']], // Order by date in descending order to get the latest
            limit: 1
        });

        // If no measurement found
        if (!latestMeasurement) {
            return res.status(404).json({ message: 'No measurements found for the specified user.' });
        }

        res.json({
            message: 'Latest measurement retrieved successfully',
            measurement: latestMeasurement
        });
    } catch (error) {
        console.error("Error retrieving latest measurement:", error);
        res.status(500).json({ message: 'Error retrieving latest measurement', error: error.message });
    }
};
