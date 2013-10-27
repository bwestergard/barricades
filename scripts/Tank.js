define(['vec2d'], function (v) {
    function Tank(position, orientation) {
        this.pos = position;
        this.ori = orientation;
        this.vel = 0;
        this.acc = 0;
    }

    Tank.prototype.update = function (dt) {
        this.ori += (Math.PI/3000) * dt;
    };

    Tank.prototype.draw = function (ctx) {
        ctx.fillStyle = "rgba(240, 30, 40, 0.2)";
        ctx.strokeStyle="rgba(240, 30, 40, 1)";
        ctx.lineWidth = 0.8;

        ctx.save();
        
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.ori);

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
