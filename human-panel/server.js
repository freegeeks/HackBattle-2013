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

// all points in the grid
var points = {};

io.sockets.on('connection', function (socket) {

    // Listen to client position selection
	socket.on('position', function(data) {

        // add to the point list
        points[socket.id] = { x:data.x, y: data.y };

        // Tell the adm where the item is
		io.sockets.emit('adm', { id: socket.id, x: data.x, y: data.y });
	});

    // Listen to adm hits
	socket.on('pattern', function(data) {
        patterns[data.pattern]();
	});

    var paint = function (color) {
		io.sockets.emit('change-color', { color: color });
    };

    var patterns = {};
    patterns.crazy = function () {
        setTimeout(function () { paint('red') }, 0);
        setTimeout(function () { paint('blue') }, 100);
        setTimeout(function () { paint('yellow') }, 200);
        setTimeout(function () { paint('green') }, 300);
        setTimeout(function () { paint('orange') }, 400);
        setTimeout(function () { paint('purple') }, 500);
        setTimeout(function () { paint('black') }, 500);
        setTimeout(function () { paint('darkblue') }, 600);
        setTimeout(function () { paint('brown') }, 700);
        setTimeout(function () { paint('pink') }, 800);
        setTimeout(function () { paint('white') }, 900);
    };
});
