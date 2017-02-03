var path = require('path');
var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
var alphaLen = alphabet.length;
var exports = module.exports = {};

exports.shorten = function (int){
    var short = '';

    while (int){
        var remain = int % alphaLen;
        int = Math.floor(int/alphaLen);
        short += alphabet[remain].toString();
    }

    return short;
};