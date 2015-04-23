path = {};
paths = {};

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 5;
var color = "black";
var width = 2;
var cap = "round";
var join = "round";

emitUndo = function() {
	socket.emit("undo");
}

emitClearAll = function() {
	socket.emit("clearAll");
}

function onMouseDown(event) {
	path = new Path();
	path.strokeColor = color;
	path.strokeWidth = width;
	path.strokeCap = cap;
	path.strokeJoin = join;
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
	paths[data.id] = new Path();
	console.log("start");
	opts = data.opts[1];
	paths[data.id].strokeColor = opts.strokeColor;
	paths[data.id].strokeWidth = opts.strokeWidth;
	paths[data.id].strokeCap = opts.strokeCap;
	paths[data.id].strokeJoin = opts.strokeJoin;
	paths[data.id].selected = opts.selected;
	paths[data.id].add(data.point);
};

drag = function(data) {
	paths[data.id].add(data.point);
	paper.view.update();
};

done = function(data) {
	var segs = paths[data.id].segments;
	// If there's only a 'dot' draw it as a circle
	console.log(segs);
	if( segs.length == 1 ) {
		var opts = data.opts[1];
		var point = new paper.Point( data.point.x, data.point.y );
		var p = new paper.Path.Circle( point, opts.strokeWidth/2 );
		p.fillColor = opts.strokeColor;
		paths[data.id] = p;
	} else {
		paths[data.id].smoothen();
	}
	paper.view.update();
}

clearAll = function() {
	paper.project.activeLayer.removeChildren();
	paper.view.update();
}

undo = function(data) {
	console.log("undo");
	var segs = paths[data.id].segments;
	paths[data.id].removeSegment( segs.length - 1 );
	paper.view.update();
}
