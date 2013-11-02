var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    paths: {
        socketio: '../node_modules/socket.io-client/dist/socket.io',
        lodash: '../node_modules/lodash/lodash',
        Tank: 'scripts/Tank'
    }
});

requirejs(['express', 'socket.io', 'http', 'lodash', 'Tank', 'vec2d'], function (express, socketio, http, _, Tank, v) {

    var app = express()
    , server = http.createServer(app).listen(80)
    , io = socketio.listen(server);
 
    app.use('/io.js', express.static(__dirname + "/node_modules/socket.io/socket.io.js"));
    app.use('/', express.static(__dirname));

    var players = {};
    var dt = 1000/30;

    var new_player = function (id) {
        var tank = new Tank(v(200,200),
                            0);
        return {
            'tank': tank
        };
    };

    setInterval(function () {
        _.each(players, function (player) {
            player.tank.update(dt);
        });
        io.sockets.emit('count', players);
    }, dt);

    io.sockets.on('connection', function (socket) {        
        players[socket.id] = new_player();
        io.sockets.emit('count', players);

        socket.on('vroom', function (data) {
            players[socket.id].tank.vroom(1);
        });

       socket.on('rev', function (data) {
            players[socket.id].tank.vroom(-1);
        });

        socket.on('port', function (data) {
            players[socket.id].tank.ori -= 0.06;
        });

        socket.on('star', function (data) {
            players[socket.id].tank.ori += 0.06;
        });

        socket.on('disconnect', function () {
            delete players[socket.id];
            io.sockets.emit('count', players);
        });
    });

});
