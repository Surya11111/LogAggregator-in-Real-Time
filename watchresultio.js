var io = require('socket.io')();

io.on('connection', function(socket) {

	socket.on('join:room', function(data) {
		console.log("New client is joining: ", data.room);
		socket.join(data.room);
	});

	socket.on('watchlist:onResult', function(data) {
		io.to(data.room).emit('room:message', {'room':data.room, 'message':data.message});
		socket.to(data.room.name).emit('watchlist:getdata', {'room':data.room, 'message':data.message});
	});
});

module.exports = io;
