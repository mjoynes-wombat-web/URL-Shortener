const Sequelize = require('sequelize');    // Require sequelize.

require('dotenv').config();    // Require dotenv and configure it from the .env file.

// Create a connection to the database.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,    // Set the host.
    dialect: process.env.DB_SCHEMA,    // Set the dialect.
    port: process.env.DB_PORT,    // Set the port.
    // Set the max and min connections and maximum idle time.
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    // Set logging to false to prevent database overload.
    logging: false,
    dialectOptions: {
      ssl: !!parseInt(process.env.DB_SSL, 10),
    },
  });

const url = sequelize.define('urls', {    // Set up the urls table.
  URL: {    // Create a URL column that's a string.
    type: Sequelize.STRING,
  },
  shortURL: {    // Create a shortURL column that's a string.
    type: Sequelize.STRING,
  },
});

sequelize.sync();    // Synchronize the database with the table above.

exports.sequelize = sequelize;    // Export the database connection to make it accessible.
exports.url = url;    // Export the url table to make it accessible.
