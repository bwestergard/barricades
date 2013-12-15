var requirejs = require('requirejs'),
uuid = require('node-uuid');

requirejs.config({
    nodeRequire: require,
    paths: {
        socketio: '../node_modules/socket.io-client/dist/socket.io',
        lodash: '../node_modules/lodash/lodash',
        Tank: 'scripts/Tank',
        PhysConst: 'scripts/PhysConst',
        World: 'scripts/World',
        screenProjection: 'scripts/screenProjection',
        geometry: 'scripts/geometry',
        SAT: 'scripts/SAT'
    }
});

requirejs(['express', 'socket.io', 'http', 'lodash', 'Tank', 'vec2d', 'PhysConst', 'World'],
          function (express, socketio, http, _, Tank, v, PhysConst, World) {

    var app = express()
    , server = http.createServer(app).listen(80)
    , io = socketio.listen(server);
    
    app.use('/io.js', express.static(__dirname + "/node_modules/socket.io/socket.io.js"));
    app.use('/', express.static(__dirname));

    var world = new World();
    var players = {};

    var new_tank = function () {
        return new Tank(
            v(PhysConst.viewPort.width * Math.random(),
              PhysConst.viewPort.height),
                -1*Math.PI/2);
    };

    var dt = 1000/PhysConst.animation.frameRate;

    setInterval(function () {
        world.update(dt);
        io.sockets.emit('update', players);
    }, dt);

    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
        var tank = new_tank();
        var id = uuid.v1();
        world.addBody(id, tank);
        players[socket.id] = { bodyId: id, tank: tank };

        io.sockets.emit('update', players);

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
            world.removeBody(players[socket.id].bodyId);
            delete players[socket.id];
            
            io.sockets.emit('update', players);
        });
    });

});
