
const submitButton = document.getElementById('submit-button');

document.getElementById("submit-button").addEventListener("click", async () => {
    console.log("Submit button clicked"); // Add this line

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const formData = {
        fname: fname,
        lname: lname,
        email: email,
        message: message,
    };
    console.log("Before fetch request"); // Add this line
    try {
        const response = await fetch("/submit-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log("Form data submitted successfully");

            // Clear the form fields after successful submission
            document.getElementById("contact-form").reset();

            // Reload the page after form submission
            location.reload();
        } else {
            console.error("Error submitting form data");
        }

        console.log("After fetch request"); // Add this line

    } catch (error) {
        console.error("Fetch error:", error);
    }
});