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
    }
});

require(['socketio', 'domReady', 'Tank', 'vec2d'], function (io, domReady, Tank, v) {

    domReady(function () {

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

        var dt = 1000/40; // milliseconds

        var bjorn = new Tank(v(cnvs.width/2,cnvs.height/2),
                             0);

        socket = io.connect('http://localhost');
        socket.on('vroom', function (data) {
            bjorn.vroom(1);
        });

        var animate = function() {
            blank();

            if (keys['w']) {
                socket.emit('vroom');
            }
            if (keys['s']) {
                bjorn.vroom(-0.5);
            }
            if (keys['a']) {
                bjorn.ori -= 0.06;
            }
            if (keys['d']) {
                bjorn.ori += 0.06;
            }

            bjorn.update(dt);
            bjorn.draw(ctx);
        };

        window.setInterval(animate, dt);

    });

});
