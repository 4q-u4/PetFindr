const locationInfo = { lat: null, lon: null, label: null };

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

//! === Submit Button === //lat

document.getElementById('submitLostPet').addEventListener('click', async function (event) {
  event.preventDefault();

  //EXP: Check if any dropdown has the "Select" option selected
  const petType = document.getElementById('petType');
  const ageRange = document.getElementById('ageRange');
  const petSize = document.getElementById('petSize');
  const petSex = document.getElementById('petSex');

  if (petType.value === 'none' || ageRange.value === 'none' || petSize.value === 'none' || petSex.value === 'none') {
    const optionsToSelect = [];

    if (petType.value === 'none') optionsToSelect.push('Pet Type');
    if (ageRange.value === 'none') optionsToSelect.push('Approximate Age');
    if (petSize.value === 'none') optionsToSelect.push('Pet Size');
    if (petSex.value === 'none') optionsToSelect.push('Pet Sex');
    alert(`Please select an option for the following: ${optionsToSelect.join(', ')}`);
    return;
  }

  const userId = localStorage.getItem('userId');  // Get user ID from localStorage

  //! === Check If Image === ///

  const lostPetPhotoInput = document.getElementById('lostPetPhoto'); // Get the selected image file
  const lostPetPhotoFile = lostPetPhotoInput.files[0];
  if (!lostPetPhotoFile) {   // Check if an image file is selected
    alert('Please select an image.');
    return;
  }

  //! === Upload Image + Construct lostPetInfo === ///
  // try {
  const imageUrl = await uploadImage(lostPetPhotoFile);    // Upload the image file and get the URL
  const lostPetInfo = {
    petType: petType.value, // Use the value property directly
    petBreed: document.getElementById('petBreedSelect').value,
    petColor: document.getElementById('petColor').value,
    ageRange: document.getElementById('ageRange').value,
    petSize: document.getElementById('petSize').value,
    petSex: document.getElementById('petSex').value,
  };

  //! === Get the combined latitude and longitude value from the input field === //
  // let latitude = null;
  // let longitude = null;

  // locationInput.addEventListener('keydown', function (event) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault(); // Prevent the default form submission behavior
  //   }
  // });

  // // No Location
  // function updateLocationDisplay() {
  //   const locationInput = document.getElementById('locationInput');
  //   if (locationInfo.lat === null && locationInfo.lon === null) {
  //     locationInput.value = `Latitude: ${latitude}, Longitude: ${longitude}`;

  //   } else {
  //     locationInput.value = ''; // Clear the input if no location is available
  //   }

  // Check if the user entered a location manually
  // if (locationValue) {
  // Extract latitude and longitude from the input value
  // const matches = locationValue.match(/Latitude: (.+), Longitude: (.+)/);
  // if (matches) {
  // latitude = matches[1];
  // longitude = matches[2];
  // }
  // } else if (navigator.geolocation) {
  // try {
  // navigator.geolocation.getCurrentPosition(async position => {
  // latitude = position.coords.latitude;
  // longitude = position.coords.longitude;

  //! === Send Data To The Server Submit ENDPOINT === //
  const response = await fetch('/submitLostPet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, lostPetInfo, photoUrl: imageUrl, latitude: locationInfo.lat, longitude: locationInfo.lon })
  });
  if (response.ok) {
    alert('Pet information submitted successfully.');// Handle success
    window.location.href = '/';// Redirect to the home URL
  } else {
    alert('Failed to submit lost pet information.');// Handle error
  }
  // });
  // } catch (error) {
  // console.error('Error:', error);
  // }
  // }
  // } catch (error) {
  // console.error('Error:', error);
  // }
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
// function getCurrentLocation() {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
//   });
// }

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lon: longitude });
      },
      (error) => reject(error.message),
      {
        enableHighAccuracy: true
      }
    );
  });
}

const locationInput = document.getElementById('locationInput');
if (locationInput === null) {
  throw new Error("locationInput not found.");
}
locationInput.disabled = true;

function updateLocationOutput() {
  let text = `${locationInfo.lat}, ${locationInfo.lon}`;
  if (locationInfo.label) {
    text += ` (${locationInfo.label})`
  }
  locationInput.value = text;
}

//! === Use Current Location Fucntion === //
// async function useCurrentLocation() {
//   // Hide location input and autocomplete
//   document.getElementById('locationInputContainer').style.display = 'none';
//   document.getElementById('autocomplete-container').style.display = 'none';

//   // Show location status
//   const locationStatus = document.getElementById('locationStatus');
//   locationStatus.style.display = 'block';

//   try {
//     const position = await getCurrentLocation();
//     showPosition(position);
//   } catch (error) {
//     if (error.code === 1) {
//       // User denied geolocation access
//       locationStatus.textContent = 'Location Access Denied';
//     } else {
//       // Handle other geolocation errors
//       handleGeolocationError(error);
//     }
//   }
// }
async function useCurrentLocation() {
  try {
    const location = await getCurrentLocation();
    locationInfo.lat = location.lat;
    locationInfo.lon = location.lon;
    locationInfo.label = null;
  } catch (error) {
    locationInfo.lat = null;
    locationInfo.lon = null;
    locationInfo.label = null;
    console.error(error);
    alert(error.message);
  }
  updateLocationOutput();
}

//! === Open Manual Function === //
function openManualInput() {
  //EXP Hide location status and clear text
  const locationStatus = document.getElementById('locationStatus');
  locationStatus.style.display = 'none';
  locationStatus.textContent = '';

  //EXP Show location input and autocomplete
  document.getElementById('locationInputContainer').style.display = 'block';
  document.getElementById('autocomplete-container').style.display = 'block';
}

//! Search autocomplete location

function addressAutocomplete(containerElement, callback, errorCallback, options) {
  //EXP create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  //EXP add input field clear button
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
          // console.log(err);
          errorCallback(err);
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
    locationInfo.lat = data.properties.lat;
    locationInfo.lon = data.properties.lon;
    locationInfo.label = data.properties.formatted;
    updateLocationOutput();
  },
  (error) => {
    locationInfo.lat = null;
    locationInfo.lon = null;
    locationInfo.label = null;
    console.error(error);
    alert(error.message);
    updateLocationOutput();
  },
  {
    placeholder: "Enter A Location Here",
  }
);
