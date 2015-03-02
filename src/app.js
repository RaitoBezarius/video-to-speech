var default_voice = speechSynthesis.getVoices().filter(function (voice) {
    return voice.lang === 'fr-FR';
})[0];

var socket = io.connect('http://localhost:9600/');

function readMessage(text) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = default_voice;
    msg.voiceURI = 'native';
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.text = text;
    msg.lang = 'fr-FR';

    speechSynthesis.speak(msg);
}

socket.emit('connect');
socket.on('ack', function () {
    console.log('Connected to the back-end.');
})
socket.on('result', function (message) {
    console.log('Received text message. (' + message + ')');
    readMessage(message.substr(0, 40));
});

var send_button = document.getElementById('send');
send_button.addEventListener('click', function (ev) {
    console.log('Sending file...');
    sendFile(document.getElementById('file').files[0]);
});

function sendBlob(blob) {
    console.log('Now sending blob to server.');
    socket.emit('text-image', blob);
}
