var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('src/index.html');
var app = fs.readFileSync('src/app.js');

var Base64Binary = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));

        var bytes = (input.length / 4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

var server = http.createServer(function(req, res) {
    if (req.url === '/app.js') {
        res.writeHead(200, {
            'Content-Type': 'text/javascript'
        });
        res.end(app);
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(index);
    }
});

var io = require('socket.io').listen(server);
var path = require('path');
var tesseract = require('node-tesseract');
var tts = require('node-tts-api');

io.sockets.on('connection', function(socket) {
    console.log('Someone is connected!');
    socket.emit('ack');
    socket.on('text-image', function(width, height, imgdata) {
        var fields = imgdata.split(';');
        var type = fields[0].split('/')[1];
        var base64encoded = fields[1].split(',')[1];
        var decoded = toBuffer(Base64Binary.decodeArrayBuffer(base64encoded));
        console.log('Saving image...');
        var filename = Math.random().toString(36).substring(7) + '.' + type;
        console.log('Filename is ' + filename);
        fs.writeFileSync(__dirname + '/img/' + filename, decoded);
        console.log('Parsing with OCR...');
        tesseract.process(__dirname + '/img/' + filename, function(err, text) {
            if (err) {
                console.log('Failed to parse. (' + err + ')');

                text = "I don't know.";
            } else {
                console.log('Succeed to parse. (' + text + ')');

            }
            tts.getSpeech(text, function(err, link) {
                console.log('Link is ' + link);
                socket.emit('result', link);
            });
        });
    });
});

server.listen(9600);
console.log('Server running on localhost:9600.');
