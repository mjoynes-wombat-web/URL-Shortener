// INIT
const express = require('express'); // Retrieve Express.
const bodyParser = require('body-parser'); // Retrieve Body-Parser.
const log = require('debug-tool-express'); // Retrieve the logger.
require('dotenv').config();    // Require dotenv and configure it from the .env file.

const app = express(); // Setup application from Express.

// CONFIG
const port = process.env.PORT; // Port for server;

// Setting up body-parser for json creation.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Pull in routes from api.js v1 and set their root url to api/v1.
app.use('/', require('./routes')(express));

// Setup server to run on the configured port and console out success.
module.exports = app.listen(port, () => {
  log.debug({
    logMsg: `Sever active on ${port}.`,
    level: 'INFO',
  });
});
