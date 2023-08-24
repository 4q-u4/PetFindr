var map = L.map("map").fitWorld();
map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("You are within " + radius + " meters from this point")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on("locationerror", onLocationError);
map.on("locationfound", onLocationFound);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);
