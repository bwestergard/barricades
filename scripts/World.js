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
                body.colliding = geometry.collide(body.verts(), other.verts());                    
            });
        });
    };


    World.prototype.draw = function (ctx, perspective) {
        _.each(this.bodies, function (body) {
            body.draw(ctx, perspective);
        });
    }

    return World;

});
