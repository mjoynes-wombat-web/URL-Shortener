//INIT
const express = require('express');    //Retrieve Express.
const bodyParser = require('body-parser');    //Retrieve Body-Parser.
const app = express();    //Setup application from Express.

//CONFIG
const port = 3000;    //Port for server.

app.use(bodyParser.json());    //Setting up body-parser for json creation.
app.use(bodyParser.urlencoded({
    extended: true,
}));                                                

app.use('/', require('./routes')(express));    //Pull in routes from api.js v1 and set their root url to api/v1.

exports.server = app.listen(port, () => {    //Setup server to run on the configed port and console out success.
    console.log('Sever active on', port + '.');
    console.log('Checking out commit after pull request.');
});