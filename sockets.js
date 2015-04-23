
var io = require("socket.io")();

io.on("connection", function( socket ) {

	socket.on("join", function( room ) {
		socket.join(room);
		socket.room = room;
	});

	var emit = function( msg ) {
		return function(data) {
			data.id = this.id;
			io.to(this.room).emit(msg, data);
		};
	};
	
	socket.on("start", emit("start") );
	socket.on("drag", emit("drag") );
	socket.on("done", emit("done") );

});

module.exports = io;
