// Defination of database table for measurement
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const Measurement = sequelize.define('Measurement', {
  measurement_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  weight: { type: DataTypes.DECIMAL(5, 2) },
  bodyfat_percentage: { type: DataTypes.DECIMAL(5, 2) },
  waistline: { type: DataTypes.DECIMAL(5, 2) },
}, {
  tableName: 'Measurements',
  timestamps: false,
});

Measurement.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Measurement, { foreignKey: 'user_id' });

module.exports = Measurement;
