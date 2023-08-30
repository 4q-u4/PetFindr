document.addEventListener('DOMContentLoaded', () => {
    //show loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');


    if (petId) {
        fetchPetDetails(petId);
    } else {
        console.error('No pet ID found in URL');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 3000); // Adjust the delay time in milliseconds   
    }
});

async function fetchPetDetails(id) {
    try {
        const response = await fetch(`/api/getPetDetails?id=${id}`);
        const petData = await response.json();

        // Now populate the pet details using the provided HTML structure
        populatePetDetails(petData);
    } catch (error) {
        console.error('Error fetching pet details:', error);
    } finally {
        // Hide the loader when done, regardless of success or error
        const loader = document.getElementById('loader');
        loader.style.display = 'none';
    }
}
//! Make Date show time ago...

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const timeDifference = now - date;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}

async function populatePetDetails(petData) {
    const petDetailsContainer = document.getElementById('petDetailsContainer');
    const ownerAddress = await fetchOwnerAddress(petData.lat, petData.lon); // Fetch owner's address
    console.log('petData:', petData);

    petDetailsContainer.innerHTML =
        `
    <div class="col-md-6">
        <img class="card-img-top mb-5 mb-md-0" src="${petData.photo_url}" alt="${petData.name}" />
    </div>
    <div class="col-md-6">
        <div class="small mb-1">Pet ID: ${petData.id}</div>
        <h1 class="display-5 fw-bolder">${petData.name}</h1>
        <div class="fs-5 mb-5">
            <p><strong>Breed:</strong> ${petData.breed || 'N/A'}</p>
            <p><strong>Color:</strong> ${petData.color || 'N/A'}</p>
            <p><strong>Age Range:</strong> ${petData.age_range || 'N/A'}</p>
            <p><strong>Size:</strong> ${petData.size || 'N/A'}</p>
            <p><strong>Sex:</strong> ${petData.sex || 'N/A'}</p>
            <p><strong>Vaccinated:</strong> ${petData.vaccinated ? 'Yes' : 'No'}</p>
            <p><strong>Medical Condition:</strong> ${petData.medical_condition || 'N/A'}</p>
        <p><strong>Date Posted:</strong> ${formatRelativeTime(petData.submission_timestamp) || 'N/A'}</p>
        </div>
        <div class="d-flex">
            <button class="btn btn-outline-dark flex-shrink-0" type="button">
                Contact Owner
            </button>
        </div>
    </div>
    `;

    // Function to fetch owner's address using reverse geocoding
    async function fetchOwnerAddress(lat, lon) {
        try {
            const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=3b1a78a94f3142a0b5785bd428e4a91d`);
            const data = await response.json();
            console.log(typeof lat); // Should output "number"

            console.log('Geoapify API Response:', data); // Log the response

            if (response.ok) {
                // Extract and return the formatted address
                return data.features[0].properties.formatted;
            } else {
                console.error('Error fetching owner address');
                return 'N/A';
            }
        } catch (error) {
            console.error('Error fetching owner address:', error);
            return 'N/A';
        }
    }

    // Add event listener to the "Contact Owner" button
    const contactOwnerButton = petDetailsContainer.querySelector('.btn.btn-outline-dark');
    contactOwnerButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/getOwnerInfo?userId=${petData.user_id}`);
            const ownerInfo = await response.json();

            if (response.ok) {
                // Get lat and lon from ownerInfo
                const ownerLat = parseFloat(ownerInfo.lat);
                const ownerLon = parseFloat(ownerInfo.lon);

                // Fetch owner's address using reverse geocoding
                const ownerAddress = await fetchOwnerAddress(ownerLat, ownerLon);
                // Check if owner info paragraph already exists, and remove it if it does
                const existingOwnerInfoParagraph = petDetailsContainer.querySelector('.owner-info-paragraph');
                if (existingOwnerInfoParagraph) {
                    petDetailsContainer.removeChild(existingOwnerInfoParagraph);
                }

                // Create and display owner information and address paragraph
                const ownerInfoParagraph = document.createElement('p');
                ownerInfoParagraph.classList.add('owner-info-paragraph'); // Add a class for easy identification
                ownerInfoParagraph.innerHTML = `<strong>First Name:</strong> ${ownerInfo.fname}<br>`;
                ownerInfoParagraph.innerHTML += `<strong>Last Name:</strong> ${ownerInfo.lname}<br>`;
                ownerInfoParagraph.innerHTML += `<strong>Owner Phone:</strong> <a href="tel:${ownerInfo.phone}">${ownerInfo.phone}</a><br>`;
                // Create a link to open map location
                ownerInfoParagraph.innerHTML += `<strong>Owner Address:</strong> <a href="geo:${ownerLat},${ownerLon}">${ownerAddress}</a>`;

                petDetailsContainer.appendChild(ownerInfoParagraph);
            } else {
                console.error('Error retrieving owner information');
            }
        } catch (error) {
            console.error('Error contacting owner:', error);
        }
    });
}


//!-- loader

