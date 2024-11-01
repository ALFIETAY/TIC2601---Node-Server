const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const userRoutes = require('./routes/userRoutes');  // Import User routes
const workoutRoutes = require('./routes/workoutRoutes'); // Import Workout routes
const measurementRoutes = require('./routes/measurementRoutes'); // Import Measurement routes
const exerciseRoutes = require('./routes/exerciseRoutes'); // Import exercise routes

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// User routes 
app.use('/api/users', userRoutes);

// Workout routes
app.use('/api/workouts', workoutRoutes);

// Measurement routes
app.use('/api/measurements', measurementRoutes);

// Exercise routes
app.use('/api/exercises', exerciseRoutes);

// Connect to the database and sync models
sequelize.sync().then(() => {
  console.log('Database & tables created!');
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
