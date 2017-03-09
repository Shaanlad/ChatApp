var express = require('express'), 
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server), 
	userArray = [];

server.listen(3000);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
	console.log('It\'s alive')
});

io.on('connection', function (socket) {
	socket.on('new user', function (data, callback) {
		if (userArray.indexOf(data) != -1) {
			callback(false);
		}
		else {
			socket.alias = data;
			userArray.push(socket.alias);
			updateUserArray();
			callback(true);
		}
	});

	function updateUserArray() {
		io.emit('usernames', userArray);
	}

	socket.on('chat message', function (data){
    	io.emit('new message', {msg: data, alias: socket.alias});
  	});

	socket.on('disconnect', function (data) {
		if(!socket.alias) return;
		userArray.splice(userArray.indexOf(socket.alias), 1);
		updateUserArray();
	})
});
