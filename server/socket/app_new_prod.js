/*
 * @author Wan Zulsarhan
 * Location : /var/www/node_app/socket
 * Description : Socket Server in production server
 */

"use strict";
var bodyParser = require('body-parser');
var express = require('express')
        , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//app.use('/socket', express.static(path.join(__dirname, 'public')));
//app.use('/socket', require('./routes'));

app.use(express.static(__dirname + '/socket/res'));
app.use(bodyParser.urlencoded({extended: false}));

/// this is important
app.get('/socket', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/socket/socket-client', function (req, res, next) {
    res.sendFile(__dirname + '/res/socket.io.js');
});

var PORT = 5000;

server.listen(PORT, function () {
    console.log('listening on port ' + PORT);
});


var Socket = require('./wzs21_Class/Socket.js');
// ***************************************************************************** //
// CODE START HERE 

var socket = new Socket(io);
socket.init();