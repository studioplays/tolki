const langFromSelect = document.getElementById('langFrom');
const langToSelect = document.getElementById('langTo');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const startRec = document.getElementById('startRec');
const stopRec = document.getElementById('stopRec');
const translateBtn = document.getElementById('translateBtn');
const speakBtn = document.getElementById('speakBtn');

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition();
} else {
  alert("Il tuo browser non supporta il riconoscimento vocale.");
}

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    inputText.value = event.results[0][0].transcript;
  };

  recognition.onerror = (event) => {
    console.error("Errore nel riconoscimento vocale:", event.error);
  };
}

startRec.onclick = () => {
  if (recognition) {
    recognition.lang = langFromSelect.value;
    recognition.start();
    startRec.disabled = true;
    stopRec.disabled = false;
  }
};

stopRec.onclick = () => {
  if (recognition) {
    recognition.stop();
    startRec.disabled = false;
    stopRec.disabled = true;
  }
};

translateBtn.onclick = () => {
  const text = inputText.value.trim();
  if (!text) {
    alert("Inserisci del testo da tradurre.");
    return;
  }

  const from = langFromSelect.value;
  const to = langToSelect.value;

  fetch('https://libretranslate.de/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: "text"
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    outputText.value = data.translatedText;
  })
  .catch(err => {
    console.error("Errore nella traduzione:", err);
    alert("Si è verificato un errore durante la traduzione.");
  });
};

speakBtn.onclick = () => {
  const text = outputText.value.trim();
  if (!text) {
    alert("Non c'è testo da leggere.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langToSelect.value;
  speechSynthesis.speak(utterance);
};
