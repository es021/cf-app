/*
 * @author Wan Zulsarhan
 * Location : /var/www/node_app/socket
 * Description : Socket Server in production server
 */

"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PORT = 5000;
var server = app.listen(PORT,  function () {
    console.log('listening on port ' + PORT);
});

var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('static'));


/// this is important
app.get('/socket', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/socket/socket-client', function (req, res, next) {
    res.sendFile(__dirname + '/res/socket.io.js');
});


var Socket = require('./wzs21_Class/Socket.js');
// ***************************************************************************** //
// CODE START HERE 

var socket = new Socket(io); 
socket.init();