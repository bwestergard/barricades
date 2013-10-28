require(['domReady', 'Tank', 'vec2d'], function (domReady, Tank, v) {

    var cnvs, ctx;

    function drawShell(x, y) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle="rgba(240, 30, 40, 1)";
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    function drawTank(x, y, t, ctx) {
        ctx.fillStyle = "rgba(240, 30, 40, 0.5)";
        ctx.strokeStyle="rgba(240, 30, 40, 1)";
        ctx.lineWidth = 1;

        ctx.save();
        
        ctx.translate(x,y);
        ctx.rotate(t);
        //ctx.scale(0.25,0.25);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 30);
        ctx.lineTo(0, 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(-20, 30);
        ctx.lineTo(-2, 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();    
        ctx.restore();
    }

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

        var animate = function() {
            blank();

            if (keys['w']) {
                bjorn.vroom(1);
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
