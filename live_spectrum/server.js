var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/super-secret-admin.html', function (req, res) {
  res.sendfile(__dirname + '/admin.html');
});

io.sockets.on('connection', function (socket) {

    // Listen to client slots change
	socket.on('slot', function(data) {
        // Tell the adm where the slot is
		io.sockets.emit('adm', { slot: data.slot });
	});

    // Listen to adm hits
	socket.on('hit', function(data) {
        // Tell the adm where the slot is
		io.sockets.emit('change-' + data.slot, { color: 'red' });
	});
});
