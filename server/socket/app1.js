/*
 * @author Wan Zulsarhan
 * Location In Production : /var/www/node_app/socket
 * Description : Socket Server
 * Client Init is at myplugin/socket/wzs21_socket_client.php
 */


const PORT = 5000;


"use strict";
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const server = app.listen(PORT,  function () {
    console.log('listening on port ' + PORT);
});

const io = require('socket.io')(server);


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('static'));


/*
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(PORT);
*/

app.get('/socket/socket-client', function (req, res, next) {
    //console.log("aasd");
    //development
    res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js');

    //production
    //res.sendFile(__dirname + '/res/socket.io.js');
});

var Socket = require('./wzs21_Class/Socket.js');

// ***************************************************************************** //
// CODE START HERE 

var socket = new Socket(io);
socket.init();