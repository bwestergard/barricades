define(['vec2d','PhysConst'], function (v, PhysConst) {

    function wrap(y) {
        var size = PhysConst.viewPort.height * PhysConst.world.aspectRatio;
        return ((y%size)+size)%size; // JavaScript's modulo operator is not quite what you'd expect. This does something more like what you'd expect from y%size. 
    }

    function projectScreen(perspective, vector) {
        var size = PhysConst.viewPort.height * PhysConst.world.aspectRatio;
        var halfHeight = PhysConst.viewPort.height/2;
        var upperBound = wrap(perspective.y + halfHeight);
        var lowerBound = wrap(perspective.y - halfHeight);

        var relativeY = vector.y - perspective.y;

        if ((perspective.y + halfHeight) > size)
            if (vector.y < (perspective.y + halfHeight - size))
                relativeY += size;

        if ((perspective.y - halfHeight) < 0)
            if (vector.y > (size + (perspective.y - halfHeight)))
                relativeY -= size;                

        return v(
            vector.x,
            relativeY + halfHeight
        );
    }

    return {
        "projectScreen": projectScreen,
        "wrap": wrap
    };

});
