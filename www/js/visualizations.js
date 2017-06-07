/////////////////////////////////
////  Korfa / Population pyramid
/////////////////////////////////

Shiny.addCustomMessageHandler("json_agegender", function(message) {

})

/////////////////////////////////
////  Choropleth map
/////////////////////////////////

const mapShinyID = "shiny_map";
var map = L.map(mapShinyID).setView([47.1567835, 19.6133071], 7);
var w = $("#" + mapShinyID)[0].clientWidth;
var h = $("#" + mapShinyID)[0].clientHeight;

$("#" + mapShinyID).attr("width", w);
$("#" + mapShinyID).attr("height", h);

Shiny.addCustomMessageHandler("json_county", function(message) {
    var data = message;
    console.log(data);

    data.forEach(function(megye) {
        hungaryGEO.features.some(function(feature) {
            if (feature.properties.name === megye.county) {
                feature.properties.density = megye.count;
                return true;
            }
            return false;
        })
    })

    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    var layer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWVjcyIsImEiOiJrY3VCVUNNIn0.7dZ0swuFiyqzhMeqwcNVgQ');
    map.addLayer(layer);

    function getColor(d) {
        return d > 10 ? '#F2B430' :
               d > 4  ? '#a9a698' :
               d > 3  ? '#9ba5a4' :
               d > 2  ? '#82a2b6' :
               d > 1   ? '#559fcd' :
              '#009ddc';
    }

    L.geoJson(hungaryGEO, {
        style: function(feature) { // Style option
            return {
                'weight': 1.5,
                'color': 'black',
                'fillColor': getColor(feature.properties.density),
                'fillOpacity': 0.7
            }
        }
    }).addTo(map);

})