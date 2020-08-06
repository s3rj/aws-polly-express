const AWS = require('aws-sdk');
const stream = require('stream');
const fs = require('fs');
const bodyParser = require('body-parser');

const translations = require('./data/translations');

// server.js
const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));



// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  //console.log('flag'+request.queryStringParameters.name);

  response.json(dreams);

  //response.send(textToSpeechConverter(params));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



//// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-west-2'
});

// Define param﻿ object﻿﻿﻿﻿ for more details around additional param attributes see https://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html
let params = {
  'Text': 'Hi! This is lorem ipsum text.',
  'OutputFormat': 'mp3',
  'VoiceId': 'Joanna'
};

///////////////////

textToSpeechConverter = async (params, configs) => {
  Polly.synthesizeSpeech(params, (err, data) => {
    //console.log(data);
    if (err) {
      throw err;
    }
    else if (data) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(data.AudioStream);
      return bufferStream;
    }
  });
};

app.post("/audio", (request, response) => {
  // express helps us take JS objects and send them as JSON
  //console.log('flag'+request.queryStringParameters.name);
  //console.log(request);
  //response.json(dreams);
  //audio/mp3
  //response.set('Content-Type', 'application/octet-stream');
  //response.set('Content-Type', 'audio/mpeg');
  //var textToSpeechAudio = textToSpeechConverter(params);
  //response.send(textToSpeechAudio);
  //response.send(textToSpeechAudio);
  //textToSpeechAudio.pipe(response);
  //params.text = request.body.text;
  console.log (request.body.text);
  params.Text = request.body.text;
  params.VoiceId = request.body.voiceId;
  //console.log(updateParams('Text',params));
  console.log(params);
  //say(updateParams('text', params), response);

  say(params, response)


});


//  
const say = (msg, res) => {
  const synthCallback = (err, data) => {
    if (err) console.log(err.stack); // an error occurred
    const bufferStream = new stream.PassThrough();
    // Write your buffer
    bufferStream.end(new Buffer(data.AudioStream));
    res.set({
      'Content-Type': 'audio/mpeg',
    });
    bufferStream.on('error', bufferError => {
      debug(bufferError);
      res.status(400).end();
    });
    // Pipe it to something else  (i.e. stdout)
    bufferStream.pipe(res);
  };
  Polly.synthesizeSpeech(msg, synthCallback);
};



function updateParams (tex, params){
  params.Text = tex;
  return params
}

//
let voices;
app.get('/voices', (req, res, next) => {
  res.status(200).send(voices);
});


Polly.describeVoices({}, (err, data) => {
  if (err) console.log(err, err.stack);
  //debug(data.Voices);
  voices = data.Voices.filter(voice => Object.keys(translations).indexOf(voice.LanguageCode) > -1);
});

//
app.get('/download', (req, res) => {
  console.log('doing something else')
});