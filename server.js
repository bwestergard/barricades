var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    paths: {
        socketio: '../node_modules/socket.io-client/dist/socket.io',
        lodash: '../node_modules/lodash/lodash',
        Tank: 'scripts/Tank',
        PhysConst: 'scripts/PhysConst',
        World: 'scripts/World'
    }
});

requirejs(['express', 'socket.io', 'http', 'lodash', 'Tank', 'vec2d', 'PhysConst', 'World'], function (express, socketio, http, _, Tank, v, PhysConst, World) {

    var app = express()
    , server = http.createServer(app).listen(80)
    , io = socketio.listen(server);
 
    app.use('/io.js', express.static(__dirname + "/node_modules/socket.io/socket.io.js"));
    app.use('/', express.static(__dirname));

    var world = new World();
    var players = {};

    var new_player = function (id) {
        var tank = new Tank(v(PhysConst.viewPort.width/2,
                              0),
                            -1*Math.PI/2);
        return {
            'tank': tank
        };
    };

    
    var dt = 1000/PhysConst.animation.frameRate;

    setInterval(function () {
        world.update(dt);
        io.sockets.emit('count', players);
    }, dt);

    io.sockets.on('connection', function (socket) {        
        players[socket.id] = new_player();
        world.addBody(players[socket.id].tank);

        io.sockets.emit('count', players);

        socket.on('vroom', function (data) {
            players[socket.id].tank.vroom(1);
        });

       socket.on('rev', function (data) {
            players[socket.id].tank.vroom(-1);
        });

        socket.on('port', function (data) {
            players[socket.id].tank.turn(-1);
        });

        socket.on('star', function (data) {
            players[socket.id].tank.turn(1);
        });

        socket.on('disconnect', function () {
            delete players[socket.id];
            io.sockets.emit('count', players);
        });
    });

});
