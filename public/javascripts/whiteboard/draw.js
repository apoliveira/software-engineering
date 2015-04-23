path = {};
paths = {};

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 0;
color = "black";
width = 5;
cap = "round";

function onMouseDown(event) {
	path = new Path();
	path.strokeColor = color;
	path.strokeWidth = width;
	path.strokeCap = cap;
	path.selected = false;

	socket.emit("start", { point : { x: event.point.x, y: event.point.y} , opts : path });
}

function onMouseDrag(event) {
	socket.emit("drag", { point : { x: event.point.x, y: event.point.y} , opts : path });
}

function onMouseUp(event) {
	socket.emit("done", { point : { x: event.point.x, y: event.point.y} , opts : path });
}

start = function(data) {
	console.log(data);
	paths[data.id] = new Path();
	opts = data.opts[1];
	paths[data.id].strokeColor = opts.strokeColor;
	paths[data.id].strokeWidth = opts.strokeWidth;
	paths[data.id].strokeCap = opts.strokeCap;
	paths[data.id].selected = opts.selected;
	paths[data.id].add(data.point);
};

drag = function(data) {
	console.log("drag", data.point);
	paths[data.id].add(data.point);
};

done = function(data) {
	paths[data.id].smooth();
}
