var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    // Listen to client slots change
	socket.on('slot', function(data) {
        // Tell the adm where the slot is
		socket.emit('adm', { slot: 'slot1' });
	});

    // Listen to adm hits
	socket.on('hit', function(data) {
        // Tell the adm where the slot is
		socket.emit('change-' + data.slot, { color: 'red' });
	});
});
