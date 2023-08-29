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

//! ================

document.getElementById('submitForm').addEventListener('click', async function (event) {
  event.preventDefault();

  const petType = document.getElementById('petType');
  const ageRange = document.getElementById('ageRange');
  const petSize = document.getElementById('petSize');
  const petSex = document.getElementById('petSex');
  const vaccinated = document.getElementById('vaccinated');

  // Check if any dropdown has the "Select" option selected
  if (petType.value === 'none' || ageRange.value === 'none' || petSize.value === 'none' || petSex.value === 'none' || vaccinated.value === 'none') {
    const optionsToSelect = [];

    if (petType.value === 'none') optionsToSelect.push('Pet Type');
    if (ageRange.value === 'none') optionsToSelect.push('Approximate Age');
    if (petSize.value === 'none') optionsToSelect.push('Pet Size');
    if (petSex.value === 'none') optionsToSelect.push('Pet Sex');
    if (vaccinated.value === 'none') optionsToSelect.push('Vaccinated');

    alert(`Please select an option for the following: ${optionsToSelect.join(', ')}`);
    return;
  }

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Get the selected image file
  const petPhotoInput = document.getElementById('petPhoto');
  const petPhotoFile = petPhotoInput.files[0];

  // Check if an image file is selected
  if (!petPhotoFile) {
    alert('Please select an image.');
    return;
  }

  try {
    // Upload the image file and get the URL
    const imageUrl = await uploadImage(petPhotoFile);

    // Construct the petInfo object
    const petInfo = {
      petName: document.getElementById('petName').value,
      petType: document.getElementById('petType').value,
      petBreed: document.getElementById('petBreedSelect').value,
      petColor: document.getElementById('petColor').value,
      ageRange: document.getElementById('ageRange').value,
      petSize: document.getElementById('petSize').value,
      petSex: document.getElementById('petSex').value,
      vaccinated: document.getElementById('vaccinated').value,
      medicalcondition: document.getElementById('medicalcondition').value
    };

    // Send the data to the server
    const response = await fetch('/submitPet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate that you're sending JSON
      },
      body: JSON.stringify({ userId, petInfo, photoUrl: imageUrl })
    });

    if (response.ok) {
      // Handle success
      alert('Pet information submitted successfully.');
      window.location.href = '/'; // Redirect to the home URL

    } else {
      // Handle error
      alert('Failed to submit pet information.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('petPhoto', imageFile);

  const response = await fetch('/uploadImage', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.imageUrl; // Assuming the server responds with the image URL
}

//! === Image ENDPOINT === //
async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('petPhoto', imageFile);

  const response = await fetch('/uploadImage', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.imageUrl; // Assuming the server responds with the image URL
}
