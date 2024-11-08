// Defination of database table for workout_exercise
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Workout = require('./workout');
const Exercise = require('./exercise');

const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  workout_id: { type: DataTypes.INTEGER, references: { model: Workout, key: 'workout_id' } },
  exercise_id: { type: DataTypes.INTEGER, references: { model: Exercise, key: 'exercise_id' } },
  set_number: { type: DataTypes.INTEGER, allowNull: false },
  reps: { type: DataTypes.INTEGER, allowNull: false },
  weight: { type: DataTypes.DECIMAL(5, 2) },
  superset_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'Workout_Exercises',
  timestamps: false,
  primaryKey: false
});

WorkoutExercise.belongsTo(Workout, { foreignKey: 'workout_id', onDelete: 'CASCADE' });
WorkoutExercise.belongsTo(Exercise, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });
Workout.hasMany(WorkoutExercise, { foreignKey: 'workout_id' });
Exercise.hasMany(WorkoutExercise, { foreignKey: 'exercise_id' });

module.exports = WorkoutExercise;
