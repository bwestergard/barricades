require(['domReady', 'Tank', 'vec2d'], function (domReady, Tank, v) {

    var canvas, ctx;

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
        function blank() {
            ctx.fillStyle   = '#000'; // set cnvs background color
            ctx.fillRect  (0,0, cnvs.width, cnvs.height);
        }

        var dt = 30; // milliseconds

        var bjorn = new Tank(v(cnvs.width/2,cnvs.height/2),
                             0.4);

        var animate = function() {
            blank();
            bjorn.update(dt);
            bjorn.draw(ctx);
        };

        var intervalID = window.setInterval(animate, dt);

/*
        for (i = 0; i < 20; i++) {
            drawTank(Math.random()*cnvs.width,
                     Math.random()*cnvs.width,
                     Math.random()*Math.PI,
                     ctx);
        }

        for (i = 0; i < 30; i++) {
            drawShell(Math.random()*(cnvs.width),Math.random()*(cnvs.width));
        }
*/

    });

});
