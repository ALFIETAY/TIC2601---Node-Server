// Defination of database table for exercise
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const Exercise = sequelize.define('Exercise', {
  exercise_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' } },
  exercise_name: { type: DataTypes.STRING(100), allowNull: false },
  primary_muscle: { type: DataTypes.STRING(50), allowNull: false },
  secondary_muscle: { type: DataTypes.STRING(50) },
}, {
  tableName: 'Exercises',
  timestamps: false,
});

Exercise.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Exercise, { foreignKey: 'user_id' });

module.exports = Exercise;
