define(['vec2d','PhysConst'], function (v, PhysConst) {

    function projectScreen(perspective, vector) {
        return v(
            vector.x,
            vector.y-perspective.y + (PhysConst.viewPort.height/2)
        );
    }

    return {
        "projectScreen": projectScreen
    };

});
