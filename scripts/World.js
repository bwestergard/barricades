define(['vec2d', 'lodash', 'PhysConst'], function (v, _, PhysConst) {

    function World() {
        this.bodies = [];
    }

    World.prototype.addBody = function (body) {
        this.bodies.push(body);
    };

    World.prototype.removeBody = function (body) {
        _.pull(this.bodies, body);
    };

    World.prototype._wrapVector = function (vector) {
        var size = PhysConst.viewPort.height; // * PhyConst.world.aspectRatio;
        return v(vector.x, ((vector.y%size)+size)%size); // JavaScript's modulo operator is not quite what you'd expect. This does something more like what you'd expect from y%size. 
    };

    World.prototype.update = function (dt) {
        var world = this;
        _.each(this.bodies, function (body) {
            body.update(dt);

            body.pos = world._wrapVector(body.pos);

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
