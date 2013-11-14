define(['lodash', 'vec2d', 'SAT'], function (_, v, SAT) {

    function convertPolygon(poly) {
        var V = SAT.Vector;
        var P = SAT.Polygon;

        var satVerts = _.map(poly, function (vert) {
            return new V(vert.x,vert.y);
        });

        var satPoly = new P(_.first(satVerts),
                            _.rest(satVerts));
        return satPoly;
    }

    function collide(A, B) {
        A = convertPolygon(A);
        B = convertPolygon(B);

        var response = new SAT.Response();
        return SAT.testPolygonPolygon(A, B, response); 
    }

    return {
        "collide": collide
    };
});
