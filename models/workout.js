// Defination of database table for workout
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const Workout = sequelize.define('Workout', {
  workout_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' } },
  workout_date: { type: DataTypes.DATEONLY, allowNull: false },
  fatigue_rating: { type: DataTypes.DECIMAL(3, 2) },
  deload_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
  workout_time: { type: DataTypes.TIME, allowNull: false }
}, {
  tableName: 'Workouts',
  timestamps: false,
});

Workout.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Workout, { foreignKey: 'user_id' });

module.exports = Workout;
