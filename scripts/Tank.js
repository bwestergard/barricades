define(['vec2d','PhysConst'], function (v, PhysConst) {

    function Tank(position, orientation) {
        this.pos = position; // vector (pixels, pixels)
        this.ori = orientation; // radians
        this.vel = v(0,0); // pixels per second
        this.acc = 0; // pixels per second^2
    }

    Tank.prototype.update = function (dt) {
        var thrust_vec = v(this.acc / dt,0).rotated(v.unit(this.ori));
        this.vel.add(thrust_vec);
        this.vel.scale(1 - (PhysConst.tank.dragloss / dt));

        this.pos.add(this.vel);

        this.vel = (this.vel.length() <= PhysConst.freezevel) ? v(0,0) : this.vel;
        this.acc = 0; // Accelleration isn't carried over from update cycle to update cycle.
    };

    Tank.prototype.vroom = function (x) {
        this.acc = PhysConst.tank.pickup * x; // pixels per second
    };

    Tank.prototype.draw = function (ctx) {
        ctx.fillStyle   = "rgba(240, 30, 40, 0.2)";
        ctx.strokeStyle = "rgba(240, 30, 40, 1)";
        ctx.lineWidth = 0.8;

        ctx.save();
        
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.ori-(Math.PI/2));

        var gap = 0.8;
        var length = PhysConst.tank.scale;
        var beam   = PhysConst.tank.scale * PhysConst.tank.lbratio;
        var pivot  = PhysConst.tank.pivot;

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
