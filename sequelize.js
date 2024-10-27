const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.db'  // Path to the local database file
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection to SQLite established successfully.'))
  .catch(error => console.error('Unable to connect to SQLite:', error));

module.exports = sequelize;
