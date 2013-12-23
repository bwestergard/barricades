define(['vec2d', 'lodash', 'PhysConst', 'screenProjection', 'geometry'], function (v, _, PhysConst, screenProjection, geometry) {

    function World() {
        this.bodies = {};
    }

    World.prototype.addBody = function (id, body) {        
        this.bodies[id] = body;
    };

    World.prototype.removeBody = function (id) {
        delete this.bodies[id];
    };

    World.prototype.removeBodies = function (ids) {
        var world = this;
        _.each(ids, function (id) {
            world.removeBody(id);
        });
    };

    World.prototype.serialize = function () {
        return _.object(_.map(this.bodies, function (body, key) {
            return [key, body.serialize()];
        }));
    };

    World.prototype.sync = function (changeSet) {
        this.upsert(changeSet.upserts);
        this.removeBodies(changeSet.deletes);
    };

    World.prototype.upsert = function (bodyStates) {

        var inserts = _.difference(_.keys(bodyStates), _.keys(this.bodies));
        var updates = _.union(_.keys(bodyStates), _.keys(this.bodies));

        _.each(_.pick(bodyStates, inserts), function (bodyState, key) {
            switch(bodyState.type)
            {
            case 'tank':
                world.addBody(key, new Tank());
                break;
            default:
                throw "Unknown body type";
            }
        });

        _.each(_.pick(bodyStates, _.union(updates, inserts)), function (body, key) {
            _.extend(this.bodies[key], body);
        });        
    };

    World.prototype.update = function (dt) {
        var world = this;

        var bodies = _.values(this.bodies);
        var keys = _.keys(this.bodies);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
          
            for (var j = i+1; j < bodies.length; j++) {
                var other = bodies[j];

                var results = geometry.collide(body.verts(), other.verts());                    
                body.colliding = other.colliding = results[0];
                if (results[0]) {                    
                    other.vel.add(v(results[1].overlapV.x, results[1].overlapV.y));
                    body.vel.add(v(results[1].overlapV.x, results[1].overlapV.y).scale(-1)); 
                }
            }

            body.update(dt);

            body.pos.y = screenProjection.wrap(body.pos.y);
          
        }
        
        return { // TODO: Only return moving bodies.
            upserts: this.serialize(),
            deletes: {}
        };        
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
