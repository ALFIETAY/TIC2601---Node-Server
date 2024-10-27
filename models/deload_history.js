// Defination of database table for deload history
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const DeloadHistory = sequelize.define('DeloadHistory', {
  deload_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' } },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  tableName: 'Deload_History',
  timestamps: false,
});

DeloadHistory.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(DeloadHistory, { foreignKey: 'user_id' });

module.exports = DeloadHistory;
