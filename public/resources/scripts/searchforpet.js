// Initialize the Leaflet map
// The Leaflet map Object
const map = L.map('map').setView([33.8937913, 35.5017767], 10); // Beirut's coordinates

// Your Map Tiles API Key
const mapTilesAPIKey = "1344fe4eba7342e2adb566a2f4a01b82";

// Your Marker Icon API Key
const markerIconAPIKey = "831cc74eb4ec4bb18e58f2df103247b8";

// Retina displays require different map tiles quality
const isRetina = L.Browser.retina;

const mapTilesBaseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapTilesAPIKey}`;
const mapTilesRetinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${mapTilesAPIKey}`;

// Add map tiles layer
L.tileLayer(isRetina ? mapTilesRetinaUrl : mapTilesBaseUrl, {
  attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
  maxZoom: 20,
  id: 'osm-bright',
}).addTo(map);

//! ================================================================================

// Fetch data from the server
fetch('/getMarkersData') // Replace with your actual API endpoint
  .then(response => response.json())
  .then(data => {
    // Create markers for each data point

    data.forEach(markerData => {
      const markerIconUrl = `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${markerIconAPIKey}`;
      const markerIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
      });

      const markerPopupContent = `
        <img src="${markerData.lost_pet_photo_url}" alt="Marker Image" width="100"><br>
        Type: ${markerData.lost_pet_type}<br>
        Date: ${markerData.time_found}<br>
      `;

      //Contact: <a href="tel:${markerData.contactNumber}">${markerData.contactNumber}</a><br>

      const marker = L.marker([markerData.latitude, markerData.longitude], {
        icon: markerIcon
      }).bindPopup(markerPopupContent).addTo(map);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
