/*
 * @author Wan Zulsarhan
 * Location : /var/www/cf-app/socket
 * Description : Socket Server in production server
 */

var bodyParser = require('body-parser');
var express = require('express')
        , http = require('http');
//make sure you keep this order
var app = express();    
var server = http.createServer(app);
//var io = require('socket.io').listen(server);
var io = require('socket.io')(server);

const isProd = (process.env.NODE_ENV === "production");

if (isProd) {
    console.log = function (mes) {
        return;
    };
}

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

const { Port } = require('./config/socket-config');

server.listen(Port, function () {
    console.log('listening on port ' + Port);
});

// ***************************************************************************** //
// CODE START HERE 

var SocketServer = require('./server/socket/model/SocketServer.js');
var socketServer = new SocketServer(io);
socketServer.init();