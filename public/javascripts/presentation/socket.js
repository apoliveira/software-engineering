
// url is of the form:
// url:port/presentation/id/present
// we want to get the second to last portion
var url = location.href.split("/");
var socketId = url[url.length - 2];

var socket = io.connect(":3000/presentation");

socket.on("change page", function(data) {
	console.log("change page", data);
	renderPage( data.pageNum );
});
