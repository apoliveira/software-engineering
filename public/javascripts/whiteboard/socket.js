
var url = location.href.split("/");
var id = url[url.length - 1];

var socket = io.connect();

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
