'use strict';

var pageNum = 1;
var numberOfPages = 0;
var pdfDoc = null;

//
// Fetch the PDF document from the URL using promises
//
var present = function(id) {
  PDFJS.getDocument('/presentation/' + id + '/pdf').then(function(pdf) {
    // Using promise to fetch the page
    pdfDoc = pdf;
    numberOfPages = pdfDoc.numPages;
    renderPage(pageNum);
    socket.emit("join", socketId );
  });
};

var renderPage = function(num) {
  pdfDoc.getPage(num).then(function(page) {
    var scale = 1.5;
    var viewport = page.getViewport(scale);

    //
    // Prepare canvas using PDF page dimensions
    //
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //
    // Render PDF page into canvas context
    //
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    page.render(renderContext);
  });
};

// pdf to next page
var nextPage = function() {
  if(pageNum < numberOfPages) {
    pageNum++;
    socket.emit("change page", { pageNum : pageNum, presentationId : socketId });
  }
}

// pdf to previous page
var prevPage = function() {
  if(1 < pageNum) {
    pageNum--;
    socket.emit("change page", { pageNum : pageNum, presentationId : socketId });
  }
}

var fullscreen = function() {
  var theCanvas = document.getElementById('the-canvas');

  if(theCanvas.webkitRequestFullScreen)
    theCanvas.webkitRequestFullScreen();
  else
    theCanvas.mozRequestFullScreen();
};

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if(key == 39)
    nextPage();
  else if(key == 37)
    prevPage();
};

$("document").ready(function() {
  $("#next_page").click(nextPage);
  $("#prev_page").on('click', prevPage);
  $("#full_screen").on('click', fullscreen);
});
