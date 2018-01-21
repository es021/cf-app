/*
 * @author Wan Zulsarhan
 * Location : /var/www/cf-app/socket
 * Description : Socket Server in production server
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const { Port } = require('./config/socket-config');

// this is important
app.get('/socket', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(Port, function () {
    console.log('listening on port ' + Port);
});

// ***************************************************************************** //
// CODE START HERE 

var Socket = require('./server/socket/model/Socket.js');
var socket = new Socket(io);
socket.init();