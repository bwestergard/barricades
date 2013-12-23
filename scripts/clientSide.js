var cnvs, ctx, socket;

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        'socketio': {
            exports: 'io'
        }
    },
    paths: {
        socketio: '../node_modules/socket.io-client/dist/socket.io',
        lodash:  '../node_modules/lodash/lodash',
    }
});

require(['socketio', 'domReady', 'Tank', 'vec2d', 'lodash', 'PhysConst', 'World'],
        function (io, domReady, Tank, v, _, PhysConst, World) {

    domReady(function () {

        var world = new World();
        var myId = null;

        cnvs = document.getElementById('c');
        ctx = cnvs.getContext('2d');

        var keys = {'w': false,
                    'a': false,
                    's': false,
                    'd': false };

        var handleKeyPress = function (e) {
            var direction = (e.type == 'keydown');
            switch (e.which) {
            case 87:
                keys.w = direction;
                break;
            case 83:
                keys.s = direction;
                break;
            case 65:
                keys.a = direction;
                break;
            case 68:
                keys.d = direction;
                break;
            }
        };

        window.addEventListener( "keyup",    handleKeyPress, false );
        window.addEventListener( "keydown",  handleKeyPress, false );

        function blank() {
            ctx.fillStyle   = '#000'; // set cnvs background color
            ctx.fillRect  (0,0, cnvs.width, cnvs.height);
        }

        var dt = 1000/PhysConst.animation.frameRate; // milliseconds

        socket = io.connect('/');

        socket.on("changeSet", function (changeSet) {
            world.sync(changeSet);
            myId = changeSet.playerId || myId;

            var me = changeSet.upserts[myId];

            blank();
            world.draw(ctx, me.pos);
        });

        var commandLoop = function() {
            if (keys['w']) {
                socket.emit('vroom');
            }
            if (keys['s']) {
                socket.emit('rev');
            }
            if (keys['a']) {
                socket.emit('port');
            }
            if (keys['d']) {
                socket.emit('star');
            }
        };

        setInterval(commandLoop, dt);

    });

});
