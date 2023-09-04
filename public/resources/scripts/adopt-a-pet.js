// //EXP: Attach click event handlers to product buttons
// const viewProductButtons = document.querySelectorAll(".view-product-btn");

// // Loop through each "View Product" button and add a click event listener
// viewProductButtons.forEach((button) => {
//   // When the button is clicked, call the handleViewProductClick function
//   button.addEventListener("click", handleViewProductClick);
// });

// Function that handles the "View Product" button click event
// function handleViewProductClick(event) {
//   // Prevent the default behavior of the link (navigating to a new page)
//   event.preventDefault();

// Get the value of the 'href' attribute of the clicked button
// const productDetailsPage = this.getAttribute("href");

// Redirect the user to the product details page
// window.location.href = productDetailsPage;
// }


//! === ADOPTAPET.HTML Functionality === //

document.addEventListener('DOMContentLoaded', () => { // When the DOM is fully loaded...
  generatePetCards(); // Call the generatePetCards function to populate the page with pet cards
});

// EXP: generatePetCards Function
async function generatePetCards() {
  try {
    const petDataArray = await fetchPetData(); // Fetch Data
    console.log('Fetched pet data:', petDataArray); // Console To Check If Data Received

    const petCards = document.getElementById('petCards'); // Element That will contain the Cards

    petDataArray.forEach(petData => { // Loop through each pet data and generate a card for it
      const { id, photo_url, name, type, breed, sex } = petData;
      console.log('Generating card for pet:', petData); // Console Test

      const cardDiv = document.createElement('div'); // Create a card element and populate it with pet data
      cardDiv.classList.add('col', 'mb-4'); // HTML FOR DIV
      cardDiv.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top" src="${photo_url}" alt="Pet Image" style="width: 100%; height: 200px; object-fit: cover;">
          <div class="card-body p-2">
            <div class="text-center">
              <h5 class="fw-bolder">${name}</h5>
              <hr>
              <p id="type"><b>Animal Type:</b> ${type}</p>
              <p id="breed"><b>Breed:</b>       ${breed}</p>
              <p id="sex"><b>Sex:</b>         ${sex}</p>
            </div>
          </div>
          <div class="card-footer p-2 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
              <!-- "More" button that links to the single-item.html page with pet's id -->
              <a class="btn btn-dark btn-sm mt-auto" href="single-item.html?id=${id}">More</a>
            </div>
          </div>
        </div>
      `;
      petCards.appendChild(cardDiv); // Append the card to the container
    });

  } catch (error) {
    console.error('Error fetching or generating pet cards:', error);
  }
}

async function fetchPetData() { // Function to fetch pet data from the server
  try {
    const response = await fetch('/api/getPetData'); // Send a request to the server to fetch pet data
    const petData = await response.json(); // Parse the JSON response and return the pet data
    return petData;
  } catch (error) { // If there's an error, throw an exception with an error message
    throw new Error('Failed to fetch pet data');
  }
}


//! SEARCH BAR FUNCTIONAILTY


//Call the generatePetCards function to populate the page with pet cards

// const searchButton = document.getElementById('searchButton'); // Get the search button element

// if (searchButton) { // If the search button exists...
//   searchButton.addEventListener('click', (event) => { // Add a click event listener to it
//     myFunction(); // Call your search function
//   });
// }

function myFunction() {
  // Declare variables
  var input, filter, petCards, cardDivs, i, type, breed, sex;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  petCards = document.getElementById('petCards');
  cardDivs = petCards.getElementsByClassName('col'); // Get all card divs

  // Get the selected filter option
  var filterSelect = document.getElementById('filterSelect');
  var selectedFilter = filterSelect.value;

  // Loop through all card divs and hide those that don't match the search query and selected filter
  for (i = 0; i < cardDivs.length; i++) {
    var cardDiv = cardDivs[i];
    var typeElement = cardDiv.querySelector('p:nth-child(2)'); // Assuming type is the second <p> element
    var breedElement = cardDiv.querySelector('p:nth-child(3)'); // Assuming breed is the third <p> element
    var sexElement = cardDiv.querySelector('p:nth-child(4)'); // Assuming sex is the fourth <p> element

    var type = typeElement ? typeElement.textContent.trim() : '';
    var breed = breedElement ? breedElement.textContent.trim() : '';
    var sex = sexElement ? sexElement.textContent.trim() : '';

    // Check if the selected filter matches the card's property
    if (
      selectedFilter === 'all' ||
      (selectedFilter === 'type' && type.toUpperCase().indexOf(filter) > -1) ||
      (selectedFilter === 'breed' && breed.toUpperCase().indexOf(filter) > -1) ||
      (selectedFilter === 'sex' && sex.toUpperCase().indexOf(filter) > -1)
    ) {
      cardDiv.style.display = '';
    } else {
      cardDiv.style.display = 'none';
    }
  }
}