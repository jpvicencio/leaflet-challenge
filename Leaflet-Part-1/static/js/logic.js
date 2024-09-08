console.log('JavaScript file loaded'); // This should appear in the console if the file is loaded

// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to get color based on depth
// Function to get color based on depth
function getColor(depth) {
    return depth > 1000 ? '#004529' :  // Darkest green for deepest depths
           depth > 500  ? '#006837' :
           depth > 200  ? '#8c2d04' :
           depth > 100  ? '#f03b20' :
           depth > 50   ? '#fd8d3c' :
           depth > 20   ? '#feb24c' :
           depth > 10   ? '#fed976' :
                          '#ffeda0';  // Lightest color for shallow depths
  }

// Function to style markers
function style(feature) {
  return {
    radius: Math.sqrt(feature.properties.mag) * 5,
    fillColor: getColor(feature.geometry.coordinates[2]),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Function to fetch and render the data
function renderData() {
  console.log('Fetching data...');
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(data => {
    console.log('Data fetched successfully'); // Log if data is fetched
    // Add markers to the map
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, style(feature));
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km<br><a href="${feature.properties.url}" target="_blank">More Info</a>`);
      }
    }).addTo(map);

    // Create a legend

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        var grades = [0, 10, 20, 50, 100, 200, 500, 1000];
        var labels = [];

        div.innerHTML += '<strong>Depth (km)</strong><br>';

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

  }).catch(error => {
    console.error('Error fetching the GeoJSON data:', error);
  });
}

// Call the function to render data
renderData();
