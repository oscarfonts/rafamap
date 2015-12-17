// initialize the map
var map = L.map('map', {
    maxZoom: 18,
    zoomControl: false
}).setView([20, 0], 2);

L.Control.zoomHome().addTo(map);


var cityMarkerStyle = {
    radius: 4,
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.7,
    className: "citymarker"
};

var cityLabelOptions = {
    noHide: true,
    className: "citylabel"
};

// load GeoJSON polygon data from an external file
$.getJSON("RNbasemap.geojson", function(basemap) {
    L.geoJson(basemap).addTo(map);
    // Load GeoJSON point layer with city names
    $.getJSON("cities.geojson", function(cities) {
        L.geoJson(cities, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, cityMarkerStyle).bindLabel(feature.properties.name, cityLabelOptions).addTo(map);
            }
        }).addTo(map);
    });
});

// hide/show cities depending on zoom level
map.on('zoomend', function() {
    // Zoom range for city markers (circles)
    if (map.getZoom() >= 3) {
        $(".citymarker").show();
    } else {
        $(".citymarker").hide();
    }

    // Zoom range for city labels (text)
    if (map.getZoom() >= 5) {
        $(".citylabel").show();
    } else {
        $(".citylabel").hide();
    }
});


map.attributionControl.addAttribution('Data &copy; <a href="http://demap.com.au/" target="_blank">Demap</a>');

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
            var html = '<div class="twitter"><img class="placeholder" src="popup-usericon.png" width="12" align="top" vspace="1"/>' + feature.properties.Name + '</div>';
            html += '<div class="addr"><img class="placeholder" src="popup-mapicon.png" width="12" align="top" vspace="1"/>' + feature.properties.MapText + '</div>';
            marker.bindPopup(html);
            clustered.addLayer(marker);
            return marker;
        }
    });

    map.addLayer(clustered);
});

