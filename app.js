const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const userRoutes = require('./routes/userRoutes');  // Import User routes
const workoutRoutes = require('./routes/workoutRoutes'); // Import Workout routes


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// User routes
app.use('/api/users', userRoutes);

// Workout routes
app.use('/api/workouts', workoutRoutes);



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