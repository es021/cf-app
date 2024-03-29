/*
 * @author Wan Zulsarhan
 * Location : /var/www/cf-app/socket
 * Description : Socket Server in production server
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const isProd = (process.env.NODE_ENV === "production");
// if (isProd) {
//     console.log = function (mes) {
//         return;
//     };
// }

const { Port } = require('./config/socket-config');

// this is important
app.get('/socket', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(Port, function () {
    console.log('listenings on port ' + Port);
});

// ***************************************************************************** //
// CODE START HERE 

var SocketServer = require('./server/socket/model/SocketServer.js');
var socketServer = new SocketServer(io);
socketServer.init();