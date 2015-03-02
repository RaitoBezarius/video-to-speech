var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var app = fs.readFileSync('app.js');
var libs = fs.readFileSync('libs.js');

var server = http.createServer(function (req, res) {
    if (req.url === '/app.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(app);
    }
    else if (req.url === '/libs.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(libs);
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(index);
    }
});

var io = require('socket.io').listen(server);
var ss = require('socket.io-stream');
var path = require('path');
var tesseract = require('node-tesseract');

io.sockets.on('connection', function (socket) {
    console.log('Someone is connected!');
    socket.emit('ack');
    socket.on('text-image', function (data) {
        console.log('Saving image...');
        var filename = Math.random().toString(36).substring(7) + '.jpg';
        console.log('Filename is ' + filename);
        fs.writeFileSync(filename, data);
        console.log('Parsing with OCR...');
        tesseract.process(__dirname + '/' + filename, function (err, text) {
            if (err) {
                console.log('Failed to parse. (' + err + ')');
                socket.emit('result', 'Je ne sais pas.');
            }
            else {
                console.log('Succeed to parse. (' + text + ')');
                socket.emit('result', text);
            }
        });
    });
});

server.listen(9600);
console.log('Server running on localhost:9600.');
