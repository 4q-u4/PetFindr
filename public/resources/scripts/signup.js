const form = document.querySelector("form");

const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["lb"],
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const info = document.querySelector(".alert-info");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const phoneNumber = phoneInput.getNumber();

    if (phoneNumber) {
        // Construct the JSON payload
        const payload = {
            'signup-fname': form['signup-fname'].value,
            'signup-lname': form['signup-lname'].value,
            'signup-email': form['signup-email'].value,
            'signup-password': form['signup-password'].value,
            'h-captcha-response': form['h-captcha-response'].value,
            'sign-up-phone': phoneNumber,
        };

        console.log(payload); // Before sending the fetch request

        try {
            const response = await fetch("/verify-captcha", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                },
                body: JSON.stringify(payload), // Convert payload to JSON string
            });

            if (response.ok) {
                // Handle success, e.g., show a success message
                const successMessage = await response.json(); // Assuming server responds with a JSON object
                console.log(successMessage); // Log the success message
            } else {
                // Handle error, e.g., show an error message
                const errorMessage = await response.json(); // Assuming server responds with a JSON object
                console.error(errorMessage); // Log the error message
            }
        } catch (error) {
            // Handle fetch error
            console.error("Fetch error:", error);
        }
    } else {
        // Handle case where phoneNumber is not provided
        console.log("Phone number is not provided");
    }
});
