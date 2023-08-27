document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;

        // Construct the JSON payload
        const payload = {
            'login-email': email,
            'login-password': password,
        };

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Redirect to the desired page after successful login
                window.location.href = "/"; // Change to your desired URL
            } else {
                // Handle login failure
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    })
});