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
            marker.bindPopup(feature.properties.Name + '<br/>' + feature.properties.Match_addr);
            return marker;
        }
    }).addTo(map);
});
