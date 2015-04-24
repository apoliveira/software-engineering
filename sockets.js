
var io = require("socket.io")();

var whiteboard = io.of("/whiteboard");

whiteboard.on("connection", function( socket ) {

	socket.on("join", function( room ) {
		socket.join(room);
		socket.room = room;
	});

	var emit = function( msg ) {
		return function(data) {
			data = data || {};
			data.id = this.id;
			whiteboard.to(this.room).emit(msg, data);
		};
	};
	
	socket.on("start", emit("start") );
	socket.on("drag", emit("drag") );
	socket.on("done", emit("done") );
	socket.on("undo", emit("undo") );
	socket.on("clearAll", emit("clearAll") );

});

module.exports = io;
