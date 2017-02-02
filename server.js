var express = require('express');
var body_parser = require('body-parser');
var app = express();

//Config
var port = 3000;

app.use('/api/v1', require('./version1/routes/api.js')(express));

var server = app.listen(port, () => {
    console.log('Sever active on', port + '.');
});

module.exports = server;