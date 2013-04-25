var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

// Define some colors
slots = {
    slot1: {
        color: 'red',
        snd: 'sn'
    },
    slot2: {
        color: 'blue',
        snd: 'bd'
    },
    slot3: {
        color: 'green',
        snd: 'hh1'
    },
    slot4: {
        color: 'yellow',
        snd: 'hh2'
    }
    // TODO add more slots, up to 11
};

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/coin.wav', function (req, res) {
  res.sendfile(__dirname + '/coin.wav');
});
app.get('/sn.wav', function (req, res) {
  res.sendfile(__dirname + '/sn.wav');
});
app.get('/hh1.wav', function (req, res) {
  res.sendfile(__dirname + '/hh1.wav');
});
app.get('/hh2.wav', function (req, res) {
  res.sendfile(__dirname + '/hh2.wav');
});
app.get('/bd.wav', function (req, res) {
  res.sendfile(__dirname + '/bd.wav');
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
		io.sockets.emit('change-' + data.slot, { color: slots[data.slot].color, snd: slots[data.slot].snd });
	    setTimeout(function () {
            io.sockets.emit('change-' + data.slot, { color: '' });
        }, 200);
	});
});
