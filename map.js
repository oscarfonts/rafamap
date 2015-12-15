// initialize the map
var map = L.map('map', {maxZoom: 18}).setView([20, 0], 2);

map.attributionControl.addAttribution('Data &copy; <a href="http://demap.com.au/" target="_blank">Demap</a>');

// load GeoJSON polygon data from an external file
$.getJSON("RNbasemap.geojson", function(basemap) {
    L.geoJson(basemap).addTo(map);
});

function getIcon(image, number) {
    return new L.NumberedDivIcon({
        iconUrl: image,
        shadowUrl: 'shadow50.png',
        iconSize: [27, 40],
        popupAnchor: [0, -15],
        shadowSize: [50, 64],
        shadowAnchor: [12, 42],
        number: number
    });
}

function setImg(layer, image) {
    layer._icon.getElementsByTagName("img")[0].setAttribute("src", image);
}

// load GeoJSON point data from an external file
$.getJSON("twitterdata.geojson", function (data) {
    // add GeoJSON layer to the map once the file is loaded
    var markerIcon = getIcon('map-marker.png');

    var clustered = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            return getIcon('map-cluster.png', cluster.getChildCount());
        },
        showCoverageOnHover: false
    });

    clustered.on('clustermouseover', function(e) {
        setImg(e.layer, 'map-cluster-hover.png');
    });

    clustered.on('clustermouseout', function(e) {
        setImg(e.layer, 'map-cluster.png');
    });

    clustered.on('mouseover', function(e) {
        setImg(e.layer, 'map-marker-hover.png');
    });

    clustered.on('mouseout', function(e) {
        setImg(e.layer, 'map-marker.png');
    });

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            var marker = L.marker(latlng, {icon: markerIcon});
            var html = '<div class="twitter"><img class="placeholder" src="http://placehold.it/14" width="14"/>' + feature.properties.Name + '</div>';
            html += '<div class="addr"><img class="placeholder" src="http://placehold.it/14" width="14"/>' + feature.properties.Match_addr + '</div>';
            marker.bindPopup(html);
            clustered.addLayer(marker);
            return marker;
        }
    });

    map.addLayer(clustered);
});
