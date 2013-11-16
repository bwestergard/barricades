define(['lodash', 'vec2d', 'SAT'], function (_, v, SAT) {

    function convertPolygon(poly) {
        var V = SAT.Vector;
        var P = SAT.Polygon;

        var satVerts = _.map(poly, function (vert) {
            return new V(vert.x,vert.y);
        });

        var satPoly = new P(_.first(satVerts),
                            _.rest(satVerts).reverse());
        return satPoly;
    }

    function collide(A, B) {
        A = convertPolygon(A);
        B = convertPolygon(B);

        var response = new SAT.Response();
        var collision = SAT.testPolygonPolygon(A, B, response); 
        return [collision, response];
    }

    return {
        "collide": collide
    };
});
