(function() {
    var streaming = false;
    var video = document.querySelector('#video');
    var canvas = document.querySelector('#canvas');
    var height = 0;
    var width = 320;
    var tts_audio = document.querySelector('#audio');

    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia({
            video: true,
            audio: false
        },
        function(stream) {
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            } else {
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL.createObjectURL(stream);
            }

            video.play();
        },
        function(err) {
            console.log("Une erreur est survenue!");
        }
    );

    video.addEventListener('canplay', function(ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    function takePicture() {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        pushImage(width, height, canvas.toDataURL());
    }

    var socket = io.connect('http://localhost:9600/');

    socket.emit('connect');
    socket.on('ack', function() {
        console.log('Connected to the back-end.');
    })
    socket.on('result', function(audioUrl) {
        console.log('Received audio message url.');
        tts_audio.src = audioUrl;
        tts_audio.load();
        tts_audio.play();
        console.log("Playing the audio...");
    });

    var send_button = document.getElementById('send');
    send_button.addEventListener('click', function(ev) {
        takePicture();
    });

    function pushImage(width, height, imgdata) {
        console.log('Now sending blob to server.');
        socket.emit('text-image', width, height, imgdata);
    }
})();
