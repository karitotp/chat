var socketio = require('socket.io');
var express = require('express');
 
var server = express(); // better instead
  server.use(express.static(__dirname + '/public'));


server.listen(8080);


