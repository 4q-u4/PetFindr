document.getElementById("submit-button").addEventListener("click", async () => {
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
    } catch (error) {
        console.error("Fetch error:", error);
    }
});