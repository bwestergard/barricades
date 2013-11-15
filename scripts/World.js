define(['vec2d', 'lodash', 'PhysConst', 'screenProjection', 'geometry'], function (v, _, PhysConst, screenProjection, geometry) {

    function World() {
        this.bodies = [];
    }

    World.prototype.addBody = function (body) {
        this.bodies.push(body);
    };

    World.prototype.removeBody = function (body) {
        _.pull(this.bodies, body);
    };

    World.prototype.update = function (dt) {
        var world = this;
        _.each(world.bodies, function (body) {
            body.update(dt);

            body.pos.y = screenProjection.wrap(body.pos.y);

            _.each(_.without(world.bodies, body), function (other) {
                var results = geometry.collide(body.verts(), other.verts());                    
                body.colliding = results[0];
//              other.pos.add(v(results[1].overlapV.x, results[1].overlapV.y));
                other.vel.add(v(results[1].overlapV.x, results[1].overlapV.y).scale(0.5));;
                body.vel.add(v(results[1].overlapV.x, results[1].overlapV.y).scale(-0.5));;
            });
        });
    };


    World.prototype._drawReticules = function (ctx, perspective) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        var reticules = 8;
        var retSep = PhysConst.viewPort.height / reticules;

        for (var i = 0; i < reticules; i++) {
            var pos = retSep*i + screenProjection.mod(0 - perspective.y, retSep);
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(PhysConst.viewPort.width, pos);
            ctx.closePath();
            ctx.stroke();
        }

        for (var i = 0; i < (PhysConst.viewPort.width / retSep); i++) {
            var pos = retSep*i;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, PhysConst.viewPort.height);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    World.prototype.draw = function (ctx, perspective) {
        this._drawReticules(ctx, perspective);

        _.each(this.bodies, function (body) {
            body.draw(ctx, perspective);
        });
    }

    return World;

});
