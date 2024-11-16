// Defination of database table for user
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false }, // Remove defaultValue
  last_login: { type: DataTypes.DATE, allowNull: true } // Last login timestamp, initially null
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User;

