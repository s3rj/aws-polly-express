const AudioContext = require('web-audio-api').AudioContext;
const audioCtx = new AudioContext;



var theArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);  

function whiteNoise(){  
  var myArrayBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 3, audioCtx.sampleRate);
  // Fill the buffer with white noise;
  // just random values between -1.0 and 1.0
  for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual array that contains the data
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < myArrayBuffer.length; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      nowBuffering[i] = Math.random() * 2 - 1;
    }
  }
  return myArrayBuffer;
}

var theArrayBuffer = whiteNoise();
var anotherArray = new Float32Array();
theArrayBuffer.copyFromChannel(anotherArray,1,0);
console.log(anotherArray)

