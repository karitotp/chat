
var express = require('express');
var app = express();
var path = require('path');   
var http = require('http').Server(app);
var io   = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public'))); 


var users = [];

io.on('connection', function(socket) {

  socket.on('login', function(msg) {
    console.log('Usuario conectado: %s', msg);
    socket.emit('login', {
      "user": "System",
      "text": "Welcome to the chat"
    });
    users.push(msg);
  });



  socket.on('chat_message', function(msg) {
  	var text = '<p class="chat_message"><b>' + msg.user + '</b>:' + msg.chat_message + '</p>';
    io.emit('chat_message', {
      "user": msg.user,
      "text": text
    });

    
  });

  socket.on('location', function(position) {
    console.log(position);
    io.emit('location',position);
  });
});



http.listen(3000, function() {
  console.log('listening on *:3000');
});