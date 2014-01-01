var requirejs = require('requirejs'),
uuid = require('node-uuid');

requirejs.config({
    nodeRequire: require,
    paths: {
        socketio: '../node_modules/socket.io-client/dist/socket.io',
        lodash: '../node_modules/lodash/lodash',
        Tank: 'scripts/Tank',
        Shard: 'scripts/Shard',
        PhysConst: 'scripts/PhysConst',
        World: 'scripts/World',
        screenProjection: 'scripts/screenProjection',
        geometry: 'scripts/geometry',
        SAT: 'scripts/SAT'
    }
});

requirejs(['express', 'socket.io', 'http', 'lodash', 'Tank', 'Shard', 'vec2d', 'PhysConst', 'World'],
          function (express, socketio, http, _, Tank, Shard, v, PhysConst, World) {

    var app = express()
    , server = http.createServer(app).listen(80)
    , io = socketio.listen(server);
    
    app.use('/io.js', express.static(__dirname + "/node_modules/socket.io/socket.io.js"));
    app.use('/', express.static(__dirname));

    var world = new World();

    _.each(_.range(1,50), function (x) {
      world.addBody('foobar' + x, new Shard(v(Math.random() * PhysConst.viewPort.width,
                                              Math.random() * PhysConst.viewPort.height * PhysConst.world.aspectRatio), 1 + Math.random() * Math.PI));
    });

    var players = {};

    var syncClients = function (sockets, changeSet) {
        if (changeSet.upserts || changeSet.deletes) {
            sockets.emit('changeSet', changeSet);
        }
    };

    var new_tank = function () {
        return new Tank(
            v(PhysConst.viewPort.width * Math.random(),
              PhysConst.viewPort.height),
                -1*Math.PI/2);
    };

    var dt = 1000/PhysConst.animation.frameRate;

    setInterval(function () {
        var changeSet = world.update(dt);
        syncClients(io.sockets, changeSet);
    }, dt);

    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
        var tank = new_tank();
        var id = uuid.v1();
        console.log("NEWBIE " + id);
        world.addBody(id, tank);
        players[socket.id] = { bodyId: id };

        // Initial synchronization of server-client world state. Upsert every body.
        syncClients(socket, {
            upserts: world.serialize(),
            deletes: {},
            playerId: id
        });

        socket.on('vroom', function (data) {
            world.getById(id).vroom(1);
        });

        socket.on('rev', function (data) {
            world.getById(id).vroom(-1);
        });

        socket.on('port', function (data) {
            world.getById(id).turn(-1);
        });

        socket.on('star', function (data) {
            world.getById(id).turn(1);
        });

        socket.on('disconnect', function () {
            world.removeBody(players[socket.id].bodyId);

            syncClients(io.sockets, {
                upserts: {},
                deletes: [ players[socket.id].bodyId ]
            });

            delete players[socket.id];
        });
    });

});
