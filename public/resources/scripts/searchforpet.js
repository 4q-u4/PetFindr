//! Leaflet Map Initialization

//EXP: The Leaflet map Object
const map = L.map('map').setView([33.8937913, 35.5017767], 10); // Beirut's coordinates

//EXP: API Keys
const mapTilesAPIKey = "1344fe4eba7342e2adb566a2f4a01b82";
const markerIconAPIKey = "831cc74eb4ec4bb18e58f2df103247b8";

//EXP: Retina display settings
const isRetina = L.Browser.retina; // Retina displays require different map tiles quality

//EXP: Map Tiles URLs
const mapTilesBaseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapTilesAPIKey}`;
const mapTilesRetinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${mapTilesAPIKey}`;

//EXP: Add map tiles layer
L.tileLayer(isRetina ? mapTilesRetinaUrl : mapTilesBaseUrl, {
  attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
  maxZoom: 20,
  id: 'osm-bright',
}).addTo(map);




//! Fetch and Display Markers

fetch('/getMarkersData') //EXP: Fetch data from the server
  .then(response => response.json())
  .then(data => {

    data.forEach(markersData => {     //EXP: Create markers for each data point (loop)
      const markerIconUrl = `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${markerIconAPIKey}`;
      const markerIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [31, 46],
        iconAnchor: [15.5, 42],
        popupAnchor: [0, -45]
      });

      //! Calculate the time difference in milliseconds
      const currentTime = new Date();
      const foundTime = new Date(markersData.time_found);
      const timeDifference = currentTime - foundTime;

      // Calculate the time difference in days, hours, minutes
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      // Create a string to display the time difference
      let timeAgo = '';
      if (days > 0) {
        timeAgo = `Found: ${days} days ago`;
      } else if (hours > 0) {
        timeAgo = `Found: ${hours} hours ago`;
      } else {
        timeAgo = `Found: ${minutes} minutes ago`;
      }
      const markerPopupContent = `
        <img src="${markersData.lost_pet_photo_url}" alt="Marker Image" width="100"><br>
        Type: ${markersData.lost_pet_type}<br>
        ${timeAgo}<br>
        Contact: <a href="tel:${markersData.phone}">${markersData.phone}</a><br>

      `;
      console.log('Latitude:', markersData.latitude);
      console.log('Longitude:', markersData.longitude);
      const latitude = markersData.latitude; // Replace with the appropriate field from your data
      const longitude = markersData.longitude;

      //EXP: Contact: <a href="tel:${markerData.contactNumber}">${markerData.contactNumber}</a><br>


      const marker = L.marker([latitude, longitude], {
        icon: markerIcon
      }).bindPopup(markerPopupContent).addTo(map);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
