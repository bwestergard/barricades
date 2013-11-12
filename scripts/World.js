define(['vec2d', 'lodash', 'PhysConst', 'screenProjection'], function (v, _, PhysConst, screenProjection) {

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
        _.each(this.bodies, function (body) {
            body.update(dt);

            body.pos.y = screenProjection.wrap(body.pos.y);

            // TODO: Modulo-clamp vectors' y-value to (PhysConst.viewport.height * PhysConst.world.aspectRatio)
        });

        // TODO: Detect collisions, react
    };


    World.prototype.draw = function (ctx, perspective) {
        _.each(this.bodies, function (body) {
            body.draw(ctx, perspective);
        });
    }

    return World;

});
