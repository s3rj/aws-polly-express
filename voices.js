const AWS = require('aws-sdk');

const stream = require('stream');
const translations = require('./data/translations');


//// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-west-2'
});


Polly.describeVoices({}, (err, data) => {
  if (err) console.log(err, err.stack);
  console.log(data.Voices);
  voices = data.Voices.filter(voice => Object.keys(translations).indexOf(voice.LanguageCode) > -1);
});