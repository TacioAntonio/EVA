const ELECTRONTHIS = window.electron
const SYNTH = window.speechSynthesis;
const $ = (el) => document.querySelector(el);
const INPUT_MESSAGE = $('.input__message');
const BTN_SEND      = $('.btn__send');
const RESULT        = $('.result');
const HISTORIC      = $('.historic');
const BTN_CANCEL_SPEAK = $('.btn__cancel__speak');

function linkEvent(object, event, action) {
  object.addEventListener(event, action);
}

function cancelSpeak() {
  SYNTH.cancel(); 
}

function generateImage() {
  if (INPUT_MESSAGE.value.includes('/image')) {
    const REGEX_IMAGE = /\/image\s(.*?)\//;
    const MATCHES = INPUT_MESSAGE.value.match(REGEX_IMAGE);
    let IMAGE;

    if (MATCHES && MATCHES.length > 1) {
      IMAGE = MATCHES[1];
    }

    if (IMAGE) {
      HISTORIC.innerHTML += `<p class="response">
        <img class="img" src="https://source.unsplash.com/400x500/?${IMAGE}" alt="" class="src">
      </p>`;
    }

    return true;
  }
}

function generateResponse() {
  ELECTRONTHIS.receive(INPUT_MESSAGE.value)
            .then(data => {
              const UTTER_THIS = new SpeechSynthesisUtterance(data);
              UTTER_THIS.voice = SYNTH.getVoices()[1];
              SYNTH.speak(UTTER_THIS);

              HISTORIC.innerHTML += `<p class="response">${data}</p>`;
            });
}

linkEvent(BTN_SEND, 'click', _ => {
  HISTORIC.innerHTML += `<p class="question">${INPUT_MESSAGE.value}</p>`;
  const response = generateImage();
  if (!response) {
   generateResponse();
  }
});
linkEvent(BTN_CANCEL_SPEAK, 'click', cancelSpeak);