var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app).listen(80)
  , io = require('socket.io').listen(server);

io.on('connection', function (socket) {

    socket.on('vroom', function (data) {
        console.log("vroom!");
        socket.emit('vroom', {'acc': 1});
    });
});

app.use('/io.js', express.static(__dirname + "/node_modules/socket.io/socket.io.js"));
app.use('/', express.static(__dirname));
