//! === Dynamic Type-Breed Function === /

function updateBreeds() {
  var selectedOption = document.getElementById("petType").value;
  var breedSelect = document.getElementById("petBreedSelect");

  // Reset the breed options
  breedSelect.innerHTML = "";

  if (selectedOption === "dog") {
    var dogBreeds = [
      "",
      "Labrador Retriever",
      "Poodle",
      "Bulldog",
      "German Shepherd",
      "Golden Retriever",
      "Beagle",
      "Rottweiler",
      "Husky",
      "Doberman",
      "Pointer",
    ];
    for (var i = 0; i < dogBreeds.length; i++) {
      var option = document.createElement("option");
      option.text = dogBreeds[i];
      breedSelect.add(option);
    }
  } else if (selectedOption === "cat") {
    var catBreeds = [
      "",
      "Siamese",
      "Persian",
      "Maine Coon",
      "Bengal",
      "Birman",
      "Bombay",
      "British Shorthair",
      "Devon Rex",
      "Scottish Fold",
    ];
    for (var i = 0; i < catBreeds.length; i++) {
      var option = document.createElement("option");
      option.text = catBreeds[i];
      breedSelect.add(option);
    }
  }
}

document.getElementById('submitLostPet').addEventListener('click', async function (event) {
  event.preventDefault();

  const petType = document.getElementById('petType');
  const ageRange = document.getElementById('ageRange');
  const petSize = document.getElementById('petSize');
  const petSex = document.getElementById('petSex');

  // Check if any dropdown has the "Select" option selected
  if (petType.value === 'none' || ageRange.value === 'none' || petSize.value === 'none' || petSex.value === 'none') {
    const optionsToSelect = [];

    if (petType.value === 'none') optionsToSelect.push('Pet Type');
    if (ageRange.value === 'none') optionsToSelect.push('Approximate Age');
    if (petSize.value === 'none') optionsToSelect.push('Pet Size');
    if (petSex.value === 'none') optionsToSelect.push('Pet Sex');
    alert(`Please select an option for the following: ${optionsToSelect.join(', ')}`);
    return;
  }

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Get the selected image file
  const lostPetPhotoInput = document.getElementById('lostPetPhoto');
  const lostPetPhotoFile = lostPetPhotoInput.files[0];

  // Check if an image file is selected
  if (!lostPetPhotoFile) {
    alert('Please select an image.');
    return;
  }

  try {
    // Upload the image file and get the URL
    const imageUrl = await uploadImage(lostPetPhotoFile);

    // Construct the lostPetInfo object
    const lostPetInfo = {
      petType: document.getElementById('petType').value,
      petBreed: document.getElementById('petBreedSelect').value,
      petColor: document.getElementById('petColor').value,
      ageRange: document.getElementById('ageRange').value,
      petSize: document.getElementById('petSize').value,
      petSex: document.getElementById('petSex').value,
    };

    let latitude = null;
    let longitude = null;

    // Get the combined latitude and longitude value from the input field
    const locationInput = document.getElementById('locationInput');
    const locationValue = locationInput.value; // Assuming the value is in the format "Latitude: xxx, Longitude: yyy"

    // If user entered a location manually
    if (locationValue) {
      // Extract latitude and longitude from the input value
      const matches = locationValue.match(/Latitude: (.+), Longitude: (.+)/);
      if (matches) {
        latitude = matches[1];
        longitude = matches[2];
      }
    } else if (navigator.geolocation) {
      // If user selected to use current location
      try {
        navigator.geolocation.getCurrentPosition(async position => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;

          // Send the data to the server
          const response = await fetch('/submitLostPet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' // Indicate that you're sending JSON
            },
            body: JSON.stringify({ userId, lostPetInfo, photoUrl: imageUrl, latitude, longitude })
          });

          if (response.ok) {
            // Handle success
            alert('Pet information submitted successfully.');

            // Redirect to the home URL
            window.location.href = '/'; // Replace with the actual home page URL
          } else {
            // Handle error
            alert('Failed to submit lost pet information.');
          }

        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
});


//! === Image ENDPOINT === //
async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('lostPetPhoto', imageFile);

  const response = await fetch('/uploadLostPetImage', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.imageUrl; // Assuming the server responds with the image URL
}

//! === Location 2 Way ===// 
function openManualInput() {
  document.getElementById("locationInputContainer").style.display = "block";
  document.getElementById("locationInput").style.display = "none";

  const autocompleteContainer = document.getElementById("autocomplete-container");
  autocompleteContainer.style.display = "block";

  // Initialize your autocomplete functionality here
  // For example, you can call a function to set up the autocomplete behavior:
  initializeAutocomplete();
}

function useCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const locationInputContainer = document.getElementById("locationInputContainer");
  const locationInput = document.getElementById("locationInput");

  locationInputContainer.style.display = "block";
  locationInput.style.display = "block";
  locationInput.value = `Latitude: ${latitude}, Longitude: ${longitude}`;
  document.getElementById("autocomplete-container").style.display = "none";
  locationInput.focus();
}
// function openManualInput() {
//   var locationInputContainer = document.getElementById("locationInputContainer");
//   locationInputContainer.style.display = "block";
// }

// function useCurrentLocation() {
//   // Check if geolocation is available in the browser
//   if ("geolocation" in navigator) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//       var latitude = position.coords.latitude;
//       var longitude = position.coords.longitude;

//       // Now you can use the latitude and longitude to perform actions
//       console.log("Latitude:", latitude);
//       console.log("Longitude:", longitude);
//     }, function (error) {
//       // Handle geolocation error
//       console.error("Error getting location:", error.message);
//     });
//   } else {
//     console.error("Geolocation is not available in this browser.");
//   }
// }

// //! locaiton

// document.addEventListener("DOMContentLoaded", function () {
//   const reportForm = document.getElementById("reportForm");
//   const getLocationBtn = document.getElementById("getLocationBtn");
//   const locationInput = document.getElementById("location");

//   getLocationBtn.addEventListener("click", function () {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         function (position) {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           locationInput.value = `${latitude}, ${longitude}`;
//         },
//         function (error) {
//           console.error("Error getting location:", error);
//           alert("An error occurred while getting the location.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   });

//   reportForm.addEventListener("submit", async function (event) {
//     // Rest of your form submission code...
//   });
// });


//! Search autocomplete location
/* 
  The addressAutocomplete takes as parameters:
  - a container element (div)
  - callback to notify about address selection
  - geocoder options:
     - placeholder - placeholder text for an input element
     - type - location type
*/
function addressAutocomplete(containerElement, callback, options) {
  // create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  // add input field clear button
  var clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = "";
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  containerElement.appendChild(clearButton);

  /* Current autocomplete items data (GeoJSON.Feature) */
  var currentItems;

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  var currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  var focusedItemIndex;

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function (e) {
    var currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true,
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
      return false;
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "33c271685e3e4ca4a992aaf2c0a2f88b";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        currentValue
      )}&limit=5&apiKey=${apiKey}`;

      if (options.type) {
        url += `&type=${options.type}`;
      }

      fetch(url).then((response) => {
        // check if the call was successful
        if (response.ok) {
          response.json().then((data) => resolve(data));
        } else {
          response.json().then((data) => reject(data));
        }
      });
    });

    promise.then(
      (data) => {
        console.log(data);
        currentItems = data.features;

        /*create a DIV element that will contain the items (values):*/
        var autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        containerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.features.forEach((feature, index) => {
          /* Create a DIV element for each element: */
          var itemElement = document.createElement("DIV");
          /* Set formatted address as item value */
          itemElement.innerHTML = feature.properties.formatted;

          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function (e) {
            inputElement.value = currentItems[index].properties.formatted;

            callback(currentItems[index]);

            /* Close the list of autocompleted values: */
            closeDropDownList();
          });

          autocompleteItemsElement.appendChild(itemElement);
        });
      },
      (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      }
    );
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function (e) {
    var autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== itemElements.length - 1
            ? focusedItemIndex + 1
            : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== 0
            ? focusedItemIndex - 1
            : (focusedItemIndex = itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent("Event");
        event.initEvent("input", true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].properties.formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    var autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      containerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    var svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("height", "24");

    var iconElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    iconElement.setAttribute(
      "d",
      "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    );
    iconElement.setAttribute("fill", "currentColor");
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }

  /* Close the autocomplete dropdown when the document is clicked. 
    Skip, when a user clicks on the input field */
  document.addEventListener("click", function (e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent("Event");
      event.initEvent("input", true, true);
      inputElement.dispatchEvent(event);
    }
  });
}

addressAutocomplete(
  document.getElementById("autocomplete-container"),
  (data) => {
    console.log("Selected option: ");
    console.log(data);
  },
  {
    placeholder: "Enter an address here",
  }
);
