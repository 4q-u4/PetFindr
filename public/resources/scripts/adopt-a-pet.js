// Attach click event handlers to product buttons
const viewProductButtons = document.querySelectorAll(".view-product-btn");
viewProductButtons.forEach((button) => {
  button.addEventListener("click", handleViewProductClick);
});

function handleViewProductClick(event) {
  // Prevent default link behavior
  event.preventDefault();

  // Get the href attribute of the clicked link
  const productDetailsPage = this.getAttribute("href");

  // Redirect to the single product page
  window.location.href = productDetailsPage;
}




//! ===
// Fetch pet data from the server
document.addEventListener('DOMContentLoaded', () => {
  generatePetCards();
});

async function generatePetCards() {
  try {
    const petDataArray = await fetchPetData();
    console.log('Fetched pet data:', petDataArray);

    const productList = document.getElementById('productList');
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row', 'gx-4', 'gx-lg-5', 'row-cols-2', 'row-cols-md-3', 'row-cols-xl-4', 'justify-content-center');
    productList.appendChild(rowDiv);


    petDataArray.forEach(petData => {
      const { photo_url, name, type, otherInfo } = petData;

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('col', 'mb-4');
      cardDiv.innerHTML = `
      <!-- Product card HTML structure with standard image size -->
      <div class="card h-100">
        <img class="card-img-top" src="${photo_url}" alt="Pet Image" style="width: 100%; height: 200px; object-fit: cover;">
        <div class="card-body p-2">
          <div class="text-center">
            <h5 class="fw-bolder">${name}</h5>
            <p>${type}</p>
            <!-- Display otherInfo here -->
          </div>
        </div>
        <div class="card-footer p-2 pt-0 border-top-0 bg-transparent">
          <div class="text-center">
            <a class="btn btn-outline-dark btn-sm mt-auto" href="single-item.html">More</a>
          </div>
        </div>
      </div>
    `;
      rowDiv.appendChild(cardDiv);
    });
  } catch (error) {
    console.error('Error fetching or generating pet cards:', error);
  }
}

async function fetchPetData() {
  try {
    const response = await fetch('/api/getPetData');
    const petData = await response.json();
    return petData;
  } catch (error) {
    throw new Error('Failed to fetch pet data');
  }
}





