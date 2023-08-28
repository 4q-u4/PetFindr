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
                // Get user ID from the server response (assuming the server sends it)
                const responseData = await response.json();
                const userId = responseData.userId;
                console.log('Received user ID:', userId)
                // Set isLoggedIn flag and user ID in LocalStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', userId);

                // Display a console message with user ID
                console.log(`Logged in as user ID: ${userId}`);
                // Redirect to the desired page after a short delay
                setTimeout(() => {
                    window.location.href = "/"; // Change to your desired URL
                }, 3000); // 3-second delay
            } else {
                // Handle login failure
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
});