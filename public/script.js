


// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.getElementById("dream-form");

const textForm = document.getElementById("text-form")




//



function process(Data) {
  console.log('process');
  if(!context){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
  }
  const source = context.createBufferSource(); // Create Sound Source
  context.decodeAudioData(Data, (buffer) => {
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime);
  });
}

function doSomethingElse() { // eslint-disable-line
  console.log('doing something else')
}

function doSomething() { // eslint-disable-line
  const nameField = document.querySelector('[name=yourName]');
  const voiceField = document.getElementById('voiceSelect');
  const voiceId = voiceField.options[voiceField.selectedIndex].value;
  console.log(nameField.value);

  sayMyName(nameField.value, voiceId, 'hello');
}

function sayMyName(text, voiceId, greeting) {
  const request = new XMLHttpRequest();
  request.open('POST', '/audio', true);
  request.responseType = 'arraybuffer';

  request.onload = function onLoad() {
    const Data = request.response;
    process(Data);
  };
  console.log(text);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.send(JSON.stringify({
    text,
    voiceId,
    greeting,
  }));
}


const sortByName = (a, b) => {
  const nameA = a.Name.toLowerCase();
  const nameB = b.Name.toLowerCase();
  if (nameA < nameB) // sort string ascending
  {
    return 1;
  }
  if (nameA > nameB) {
    return -1;
  }
  return 0; // default return value (no sorting)
};

function loadVoices() {
  const request = new XMLHttpRequest();
  const voiceSelect = document.getElementById('voiceSelect');
  console.log(voiceSelect);
  request.open('GET', '/voices');
  request.onload = function onVoicesLoad() {
    const Data = JSON.parse(request.response);
    Data.sort(sortByName).forEach(voice => {
      voiceSelect.options[voiceSelect.options.length] = new Option(`${voice.Name} (${voice.LanguageName})`, voice
        .Id);
    });
  };
  request.send();
}

loadVoices();
