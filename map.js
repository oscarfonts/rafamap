// initialize the map
var map = L.map('map').setView([20, 0], 2);

// load GeoJSON polygon data from an external file
$.getJSON("RNbasemap.geojson", function(basemap) {
    L.geoJson(basemap).addTo(map);
});

// load GeoJSON point data from an external file
$.getJSON("twitterdata.geojson", function (data) {
    // add GeoJSON layer to the map once the file is loaded
    var mapIcon = L.icon({
        iconUrl: 'map-marker-icon-small.png',
        shadowUrl: 'shadow50.png',
        iconSize: [27, 40],
        popupAnchor: [0, -15],
        shadowSize: [50, 64],
        shadowAnchor: [12, 42]
    });

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            var marker = L.marker(latlng, {icon: mapIcon});
            var html = '<div class="twitter"><img class="placeholder" src="http://placehold.it/14"/>' + feature.properties.Name + '</div>';
            html += '<div class="addr"><img class="placeholder" src="http://placehold.it/14"/>' + feature.properties.Match_addr + '</div>';
            marker.bindPopup(html);
            return marker;
        }
    }).addTo(map);
});
