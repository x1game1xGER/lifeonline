(function() {
    var b = .5859375 / 15.36,
        c = L.latLng([0, 0]);
    L.CRS.ChernarusPlusSatellite = L.Util.extend({}, L.CRS, {
        latLngToPoint: function(e, d) {
            var a = L.latLng([e.lat - c.lat, e.lng - c.lng]),
                a = this.projection.project(a),
                b = this.scale(d);
            return a = this.transformation._transform(a, b)
        },
        pointToLatLng: function(b, d) {
            var a = this.scale(d),
                a = this.transformation.untransform(b, a),
                a = this.projection.unproject(a);
            a.lat += c.lat;
            a.lng += c.lng;
            return a
        },
        projection: L.Projection.LonLat,
        transformation: new L.Transformation(b, 0, b, 0)
    })
})();
var dayzMapTypes = [{
        center: [13.1, 13.1],
        zoom: 2,
        minZoom: 0,
        maxZoom: 3,
        grid: {
            0: 0,
            strokeStyle: "rgba(60,90,120,0.85)",
            limit: [0, 26.2]
        },
        layers: [L.tileLayer.limited("Map/tile_{z}_{x}-{y}.png", {
            noWrap: !0,
            tileLimits: {
                0: {
                    x: 1,
                    y: 1
                },
                1: {
                    x: 2,
                    y: 2
                },
                2: {
                    x: 4,
                    y: 4
                },
                3: {
                    x: 8,
                    y: 8
                },
				4: {
                    x: 16,
                    y: 16
                },
				5: {
                    x: 32,
                    y: 32
                }
            }
        })],
        markerZoomAnimation: !1,
        attributionControl: !1,
        crs: L.CRS.ChernarusPlusSatellite
    }],
    dayzMapNames = ["Chernarus+ (Satellite)"],
    dayzProjections = [L.CRS.ChernarusPlusSatellite],
    dayzProjection =
    dayzProjections[0];
$(document).ready(function() {
    dzMap.init(1)
});