define(['vec2d'], function (v) {

    var pickup = 15; // How fast ya reckon this thing'll go?
    var drag = -30; // pixels per second^2 (drag)

    function Tank(position, orientation) {
        this.pos = position; // vector (pixels, pixels)
        this.ori = orientation; // radians
        this.vel = 0; // pixels per second
        this.acc = 0; // pixels per second^2
    }

    Tank.prototype.update = function (dt) {
        this.acc += (drag/dt) * this.vel;
        this.vel += this.acc / dt;

        this.pos.add(v(this.vel * Math.cos(this.ori),
                       this.vel * Math.sin(this.ori)));

        this.acc = 0; // Accelleration isn't carried over from update cycle to update cycle.
    };

    Tank.prototype.vroom = function (x) {
        this.acc = pickup * x; // pixels per second
    };

    Tank.prototype.draw = function (ctx) {
        ctx.fillStyle = "rgba(240, 30, 40, 0.2)";
        ctx.strokeStyle="rgba(240, 30, 40, 1)";
        ctx.lineWidth = 0.8;

        ctx.save();
        
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.ori-(Math.PI/2));

        var gap = 0.8;
        var length = 30;
        var beam = 40;
        var pivot = 0.5;

        ctx.beginPath();
        ctx.moveTo(gap,length/2);
        ctx.lineTo(beam/2,-1 * length/2);
        ctx.lineTo(gap,-1 * length/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-1 * gap,length/2);
        ctx.lineTo(-1*beam/2,-1 * length/2);
        ctx.lineTo(-1 * gap,-1 * length/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    return Tank;
});
