var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var json = [];
io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    var objMsg = {
      id: socket.id,
      msg: msg
    };
    io.emit('chat message', objMsg);
  });
  socket.on('location', function(aposition) {
    console.log(aposition);
    aposition.properties.id = socket.id;
    if (json.length > 0) {
      aposition.geometry.coordinates[0] = aposition.geometry.coordinates[0] + json.length;
      aposition.geometry.coordinates[1] = aposition.geometry.coordinates[1] + json.length;
    }
    json.push(aposition);
    io.emit('location', json);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});