path = {};
paths = {};

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 5;
var color = "black";
var width = 2;
var penWidth = 2;
var eraserWidth = 2;
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
	var path = paths[data.id];
	var segs = path.segments;
	// If there's only a 'dot' draw it as a circle
	if( segs.length == 1 ) {
		var opts = data.opts[1];
		var point = new paper.Point( data.point.x, data.point.y );
		var p = new paper.Path.Circle( point, opts.strokeWidth/2 );
		p.fillColor = opts.strokeColor;
		paths[data.id] = p;
	} else if(path.smoothen) {
		path.smoothen();
	}
	paper.view.update();
}

clearAll = function() {
	paper.project.activeLayer.removeChildren();
	paper.view.update();
}

undo = function(data) {
	var segs = paths[data.id].segments;
	// remove the last few segments, just one segment isn't enough
	paths[data.id].removeSegment( segs.length - 1 );
	paths[data.id].removeSegment( segs.length - 2 );
	paths[data.id].removeSegment( segs.length - 3 );
	paper.view.update();
}

pen = function() {
	color = $("#color-picker")[0].value;
	width = penWidth;
	document.getElementById("pen").style.background = "grey";
	document.getElementById("eraser").style.background = "white";
}

erase = function() {
	color = "white";
	width = eraserWidth;
	document.getElementById("eraser").style.background = "grey";
	document.getElementById("pen").style.background = "white";
}

$("#color-picker").on("input", function() {
        color = this.value;
});

$("#pen-width-picker").on("input", function() {
        penWidth = this.value;
        pen();
});

$("#eraser-width-picker").on("input", function() {
        eraserWidth = this.value;
        erase();
});
