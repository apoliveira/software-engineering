
var url = location.href.split("/");
var id = url[url.length - 1];

var socket = io.connect(":3000/whiteboard");

socket.emit("join", id );

socket.on("start", function(data) {
	start(data);
});

socket.on("drag", function(data) {
	drag(data);
});

socket.on("done", function(data) {
	done(data);
});

socket.on("undo", function(data) {
	undo(data);
});

socket.on("clearAll", function() {
	clearAll();
});
