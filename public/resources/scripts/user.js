// function addressAutocomplete(containerElement, callback, options) {
//     // create input element
//     var inputElement = document.createElement("input");
//     inputElement.setAttribute("type", "text");
//     inputElement.setAttribute("placeholder", options.placeholder);
//     containerElement.appendChild(inputElement);

//     // add input field clear button
//     var clearButton = document.createElement("div");
//     clearButton.classList.add("clear-button");
//     addIcon(clearButton);
//     clearButton.addEventListener("click", (e) => {
//         e.stopPropagation();
//         inputElement.value = "";
//         callback(null);
//         clearButton.classList.remove("visible");
//         closeDropDownList();
//     });
//     containerElement.appendChild(clearButton);

//     /* Current autocomplete items data (GeoJSON.Feature) */
//     var currentItems;

//     /* Active request promise reject function. To be able to cancel the promise when a new request comes */
//     var currentPromiseReject;

//     /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
//     var focusedItemIndex;

//     /* Execute a function when someone writes in the text field: */
//     inputElement.addEventListener("input", function (e) {
//         var currentValue = this.value;

//         /* Close any already open dropdown list */
//         closeDropDownList();

//         // Cancel previous request promise
//         if (currentPromiseReject) {
//             currentPromiseReject({
//                 canceled: true,
//             });
//         }

//         if (!currentValue) {
//             clearButton.classList.remove("visible");
//             return false;
//         }

//         // Show clearButton when there is a text
//         clearButton.classList.add("visible");

//         /* Create a new promise and send geocoding request */
//         var promise = new Promise((resolve, reject) => {
//             currentPromiseReject = reject;

//             var apiKey = "33c271685e3e4ca4a992aaf2c0a2f88b";
//             var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
//                 currentValue
//             )}&limit=5&apiKey=${apiKey}`;

//             if (options.type) {
//                 url += `&type=${options.type}`;
//             }

//             fetch(url).then((response) => {
//                 // check if the call was successful
//                 if (response.ok) {
//                     response.json().then((data) => resolve(data));
//                 } else {
//                     response.json().then((data) => reject(data));
//                 }
//             });
//         });

//         promise.then(
//             (data) => {
//                 currentItems = data.features;

//                 /*create a DIV element that will contain the items (values):*/
//                 var autocompleteItemsElement = document.createElement("div");
//                 autocompleteItemsElement.setAttribute("class", "autocomplete-items");
//                 containerElement.appendChild(autocompleteItemsElement);

//                 /* For each item in the results */
//                 data.features.forEach((feature, index) => {
//                     /* Create a DIV element for each element: */
//                     var itemElement = document.createElement("DIV");
//                     /* Set formatted address as item value */
//                     itemElement.innerHTML = feature.properties.formatted;

//                     /* Set the value for the autocomplete text field and notify: */
//                     itemElement.addEventListener("click", function (e) {
//                         inputElement.value = currentItems[index].properties.formatted;

//                         callback(currentItems[index]);

//                         /* Close the list of autocompleted values: */
//                         closeDropDownList();
//                     });

//                     autocompleteItemsElement.appendChild(itemElement);
//                 });
//             },
//             (err) => {
//                 if (!err.canceled) {
//                     console.log(err);
//                 }
//             }
//         );
//     });

//     /* Add support for keyboard navigation */
//     inputElement.addEventListener("keydown", function (e) {
//         var autocompleteItemsElement = containerElement.querySelector(
//             ".autocomplete-items"
//         );
//         if (autocompleteItemsElement) {
//             var itemElements = autocompleteItemsElement.getElementsByTagName("div");
//             if (e.keyCode == 40) {
//                 e.preventDefault();
//                 /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
//                 focusedItemIndex =
//                     focusedItemIndex !== itemElements.length - 1
//                         ? focusedItemIndex + 1
//                         : 0;
//                 /*and and make the current item more visible:*/
//                 setActive(itemElements, focusedItemIndex);
//             } else if (e.keyCode == 38) {
//                 e.preventDefault();

//                 /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
//                 focusedItemIndex =
//                     focusedItemIndex !== 0
//                         ? focusedItemIndex - 1
//                         : (focusedItemIndex = itemElements.length - 1);
//                 /*and and make the current item more visible:*/
//                 setActive(itemElements, focusedItemIndex);
//             } else if (e.keyCode == 13) {
//                 /* If the ENTER key is pressed and value as selected, close the list*/
//                 e.preventDefault();
//                 if (focusedItemIndex > -1) {
//                     closeDropDownList();
//                 }
//             }
//         } else {
//             if (e.keyCode == 40) {
//                 /* Open dropdown list again */
//                 var event = document.createEvent("Event");
//                 event.initEvent("input", true, true);
//                 inputElement.dispatchEvent(event);
//             }
//         }
//     });

//     function setActive(items, index) {
//         if (!items || !items.length) return false;

//         for (var i = 0; i < items.length; i++) {
//             items[i].classList.remove("autocomplete-active");
//         }

//         /* Add class "autocomplete-active" to the active element*/
//         items[index].classList.add("autocomplete-active");

//         // Change input value and notify
//         inputElement.value = currentItems[index].properties.formatted;
//         callback(currentItems[index]);
//     }

//     function closeDropDownList() {
//         var autocompleteItemsElement = containerElement.querySelector(
//             ".autocomplete-items"
//         );
//         if (autocompleteItemsElement) {
//             containerElement.removeChild(autocompleteItemsElement);
//         }

//         focusedItemIndex = -1;
//     }

//     function addIcon(buttonElement) {
//         var svgElement = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "svg"
//         );
//         svgElement.setAttribute("viewBox", "0 0 24 24");
//         svgElement.setAttribute("height", "24");

//         var iconElement = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "path"
//         );
//         iconElement.setAttribute(
//             "d",
//             "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
//         );
//         iconElement.setAttribute("fill", "currentColor");
//         svgElement.appendChild(iconElement);
//         buttonElement.appendChild(svgElement);
//     }

//     /* Close the autocomplete dropdown when the document is clicked. 
//           Skip, when a user clicks on the input field */
//     document.addEventListener("click", function (e) {
//         if (e.target !== inputElement) {
//             closeDropDownList();
//         } else if (!containerElement.querySelector(".autocomplete-items")) {
//             // open dropdown list again
//             var event = document.createEvent("Event");
//             event.initEvent("input", true, true);
//             inputElement.dispatchEvent(event);
//         }
//     });
// }

// addressAutocomplete(
//     document.getElementById("autocomplete-container"),
//     (data) => {
//         console.log("Selected option: ");
//         console.log(data);
//     },
//     {
//         placeholder: "Enter an address here",
//     }
// );

//logout btn logic 

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (isLoggedIn) {
                // Display a notification that user is logged out
                alert("You are logged out.");

                // Clear the user's login status
                localStorage.removeItem('isLoggedIn');

                // Redirect to the desired page after logout
                window.location.href = "/"; // Replace with your desired URL
            } else {
                // Display a message to login before logging out
                alert("Please login first.");

                // Wait 3000ms (3 seconds) and then redirect to login page
                setTimeout(function () {
                    window.location.href = "/pages/login.html"; // Redirect to login page after 3000ms
                }, 3000);
            }
        });
    }

    // Other event listeners and logic
});


// Display user info & Update 

document.addEventListener('DOMContentLoaded', async () => {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');

    // Fetch user info from the server
    try {
        const response = await fetch(`/user-info?id=${userId}`);
        if (response.ok) {
            const userInfo = await response.json();
            // Pre-fill input fields with user data as placeholders
            firstNameInput.placeholder = userInfo.fname;
            lastNameInput.placeholder = userInfo.lname;
            phoneInput.placeholder = userInfo.phone;
            emailInput.placeholder = userInfo.email;
        } else {
            console.error('Failed to fetch user info');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

    // Update profile form submission logic
    const updateButton = document.getElementById('update-button');
    updateButton.addEventListener('click', async () => {
        // Retrieve updated values from input fields
        const updatedFirstName = firstNameInput.value;
        const updatedLastName = lastNameInput.value;
        const updatedPhone = phoneInput.value;
        const updatedEmail = emailInput.value;

        // Construct the JSON payload with updated data
        const payload = {
            id: userId,
            fname: updatedFirstName,
            lname: updatedLastName,
            phone: updatedPhone,
            email: updatedEmail,
        };

        try {
            const response = await fetch('/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Profile update successful, show a success message
                console.log('Profile updated successfully');
                // You can also show a success message to the user on the page
            } else {
                // Handle profile update failure
                console.error('Profile update failed');
                // You can also show an error message to the user on the page
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});

// Delete btn Account

document.addEventListener("DOMContentLoaded", function () {
    const deleteAccountButton = document.getElementById("delete-account-button");

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener("click", async () => {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                console.error("User ID not available");
                return;
            }

            const confirmation = confirm("Are you sure you want to delete your account?");
            if (!confirmation) {
                return;
            }

            try {
                const response = await fetch(`/delete-account?id=${userId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    // Clear user data from LocalStorage
                    localStorage.removeItem('userId');

                    // Redirect to a different page or show a success message
                    // For example:
                    window.location.href = "/"; // Redirect to home page
                } else {
                    console.error("Account deletion failed");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        });
    }

    // Other event listeners and logic
});


// password chnage

document.addEventListener('DOMContentLoaded', async () => {
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const updatePasswordButton = document.getElementById('update-password-button');

    updatePasswordButton.addEventListener('click', async () => {
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        if (newPassword !== confirmNewPassword) {
            console.error('New passwords do not match');
            return;
        }

        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');

        const payload = {
            userId,
            oldPassword,
            newPassword,
        };

        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Password changed successfully');
                // Display a success message to the user
                alert('Password updated successfully.');
                // Reload the page after a short delay (e.g., 2 seconds)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                const errorMessage = await response.json();
                console.error(errorMessage);
                // Display an error message to the user
                alert('Password update failed. Please try again.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
});
