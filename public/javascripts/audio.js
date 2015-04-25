var recordRTC = null;

$(document).ready(function() {
  var session = {
    audio: true,
    video: false
  };

  $('#audio-checkbox').click(function() {
    if($('#audio-checkbox').is(':checked')) {
      navigator.getUserMedia(session, initializeRecorder, onError);
    } else {
      recordRTC.stopRecording(function(audioURL) {
        // If we want to save the end product audio, we do so here
      });
    }
  });
});

var onError = function(err) {
  if(err)
    console.log(err);
}

var initializeRecorder = function(stream) {
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var audioInput = context.createMediaStreamSource(stream);
  var bufferSize = 2048;

  // create a javascript node
  var recorder = context.createScriptProcessor(bufferSize, 1, 1);

  // specify the processing function
  recorder.onaudioprocess = recorderProcess;

  // connect stream to our recorder
  audioInput.connect(recorder);

  // connect our recorder to the previous destination
  recorder.connect(context.destination);
};

var recorderProcess = function(e) {
  // Recording in mono so get the channel data from the first channel
  var audio = e.inputBuffer.getChannelData(0);
  socket.emit("audio data", audio);
};

