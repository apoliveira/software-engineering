
var io = require("socket.io")();
var passportSocketIo = require("passport.socketio");
var Presentation = require("./models/presentation");

// passportSocketIo.authorize excludes unauthorized access
// but we want to pass the connection along either way!
var passSuccess = function(data, accept) {
	accept();
};

// passportSocketIo.authorize excludes unauthorized access
// but we want to pass the connection along either way!
var passFailure = function(data, message, error, accept) {
	accept();
};

io.use(passportSocketIo.authorize({
	cookieParser: global.cookieParser,
	key: 'connect.sid',
	secret: "SOME SUPER SECRET SECRET",
	store: global.sessionStore,
	success: passSuccess,
	fail: passFailure,
}));

var whiteboard = io.of("/whiteboard");
var presentation = io.of("/presentation");

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

presentation.curPage = {};

presentation.on("connection", function( socket ) {

	socket.on("join", function(room) {
		socket.join(room);
		socket.room = room;
		if( presentation.curPage[room] )
			socket.emit("change page", { pageNum: presentation.curPage[room] });
	});

	socket.on("change page", function(data) {
		var user = socket.client.request.user;
		if( user ) {
			Presentation.findOne( { _id: data.presentationId }, function( err, pdf ) {
				if( pdf.author_id == user.id ) {
					presentation.curPage[socket.room] = data.pageNum;
					presentation.to(socket.room).emit("change page", data);
				}
			});
		}
	});

	// Presentation whiteboard
	var emit = function( msg ) {
		return function(data) {
			data = data || {};
			data.id = this.id;
			presentation.to(this.room).emit(msg, data);
		};
	};
	
	socket.on("start", emit("start") );
	socket.on("drag", emit("drag") );
	socket.on("done", emit("done") );
	socket.on("undo", emit("undo") );
	socket.on("clearAll", emit("clearAll") );
});

module.exports = io;
