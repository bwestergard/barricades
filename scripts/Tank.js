define(['vec2d','PhysConst', 'screenProjection'], function (v, PhysConst, screenProjection) {

    function Tank(position, orientation) {
        this.pos = position; // vector (pixels, pixels)
        this.ori = orientation; // radians
        this.vel = v(0,0); // pixels per second
        this.acc = 0; // pixels per second^2
    }

    Tank.prototype.verts = function () {
        var length = PhysConst.tank.scale;
        var beam   = PhysConst.tank.scale * PhysConst.tank.lbRatio;
        var pivot  = PhysConst.tank.pivot;

        var rotation = v.unit(this.ori+Math.PI/2);
        var nose = v(0, -1 * length/2).rotate(rotation);
        var port = v(-1 * beam/2, length/2).rotate(rotation);
        var star = v(beam/2,length/2).rotate(rotation);

        return [this.pos,
                nose,
                port,
                star];
    };

    Tank.prototype.update = function (dt) {
        var nose = v.unit(this.ori);
        var ortho_nose = v.unit(this.ori+Math.PI/2);

        var thrust_vec = v(this.acc / dt,0).rotated(nose);
        this.vel.add(thrust_vec);
        this.vel.scale(1 - (PhysConst.tank.dragLoss / dt));

        var against = ortho_nose.scale(this.vel.dot(ortho_nose));
        this.vel.add(against.scale(-1).scale(PhysConst.tank.skateFactor / dt));

        this.pos.add(this.vel);

        this.acc = 0; // Accelleration isn't carried over from update cycle to update cycle.
    };

    Tank.prototype.vroom = function (x) {
        this.acc = PhysConst.tank.pickup * x; // pixels per second
    };

    Tank.prototype.turn = function (x) {
        var dt = 1000 / PhysConst.animation.frameRate;
        this.ori += dt * PhysConst.tank.turnSpeed * x;
    };

    Tank.prototype.draw = function (ctx, perspective) {
        var nose = v.unit(this.ori);
        var ortho_nose = v.unit(this.ori+Math.PI/2);

        ctx.save();
        
        var screenPosition = screenProjection.projectScreen(perspective, this.pos);
        ctx.translate(screenPosition.x, screenPosition.y);

        if (this.colliding) {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(0,0,15,15);
        }

        if (window.debug || true) {
            var indicator = this.vel.scaled(10);
            var along = nose.scale(this.vel.dot(nose)).scale(1);
            var against = ortho_nose.scale(this.vel.dot(ortho_nose)).scale(10);

            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            ctx.fillStyle = "rgba(255, 255, 255, 1)";

            ctx.fillText("(" + Math.floor(this.pos.x) + ", " + Math.floor(this.pos.y) + ")", 10, 50);

            var verts = this.verts();
            _.each(_.rest(verts), function (vert) {
                ctx.fillRect(vert.x,vert.y,5,5);
            });

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(indicator.x, 0);
            ctx.moveTo(0,0);
            ctx.lineTo(0,indicator.y);
            ctx.closePath();


            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(along.x, along.y);
            ctx.closePath();

            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(against.x, against.y);
            ctx.closePath();

            ctx.stroke();

            ctx.restore();
        }

        ctx.fillStyle   = "rgba(240, 30, 40, 0.2)";
        ctx.strokeStyle = "rgba(240, 30, 40, 1)";
        ctx.lineWidth = 0.8;

        ctx.rotate(this.ori-(Math.PI/2));

        var gap = 0.8;
        var length = PhysConst.tank.scale;
        var beam   = PhysConst.tank.scale * PhysConst.tank.lbRatio;
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
