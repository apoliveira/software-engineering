
// url is of the form:
// url:port/presentation/id/present
// we want to get the second to last portion
var url = location.href.split("/");
var socketId = url[url.length - 2];

var socket = io.connect("/presentation");

socket.on("change page", function(data) {
	emitClearAll();
	renderPage( data.pageNum );
});

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
