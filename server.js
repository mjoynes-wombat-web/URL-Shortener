//INIT
var express = require('express');                                   //Retrieve Express.
var bodyParser = require('body-parser');                            //Retrieve Body-Parser.
var app = express();                                                //Setup application from Express.

//CONFIG
var port = 3000;                                                    //Port for server.

app.use(bodyParser.json());                                         //Setting up body-parser for json creation.
app.use(bodyParser.urlencoded({
    extended: true,
}));                                                

app.use('/api/v0.9', require('./version0.9/routes/api.js')(express));   //Pull in routes from v0.9 api.js and set their root url to api/v1.

app.use('/api/v1', require('./version1/routes/api.js')(express));   //Pull in routes from api.js v1 and set their root url to api/v1.

var server = app.listen(port, () => {                               //Setup server to run on the configed port and console out success.
    console.log('Sever active on', port + '.');
});

module.exports = server;                                            //Export the server variable to be used by other modules.