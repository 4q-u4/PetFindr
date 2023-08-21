
document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById("reportForm");

    reportForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(reportForm);

        try {
            const response = await fetch("/submitPet", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Pet report submitted successfully!");
                reportForm.reset();
            } else {
                alert("An error occurred while submitting the pet report.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting the pet report.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById("reportForm");
    const getLocationBtn = document.getElementById("getLocationBtn");
    const locationInput = document.getElementById("location");

    getLocationBtn.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                locationInput.value = `${latitude}, ${longitude}`;
            }, function (error) {
                console.error("Error getting location:", error);
                alert("An error occurred while getting the location.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    reportForm.addEventListener("submit", async function (event) {
        // Rest of your form submission code...
    });
});

