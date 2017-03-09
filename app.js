var express = require('express'), 
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server), 
	users = [];

server.listen(3000);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
	console.log('It\'s alive')
});

io.on('connection', function (socket) {
	socket.on('new user', function (data, callback) {
		if (users.indexOf(data) != -1) {
			callback(false);
		}
		else {
			socket.alias = data;
			users.push(socket.alias);
			io.emit('usernames', users);
			callback(true);
		}
	});

	socket.on('chat message', function (msg){
    	io.emit('new message', msg);
  });
});
