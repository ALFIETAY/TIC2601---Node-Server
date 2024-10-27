const sequelize = require('./sequelize');
const User = require('./models/user');
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');
const WorkoutExercise = require('./models/workout_exercise');
const Measurement = require('./models/measurement');
const DeloadHistory = require('./models/deload_history');

sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
}).catch(error => {
  console.error("Error syncing database:", error);
});
