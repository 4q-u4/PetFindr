// Open Menu In Header
document.addEventListener("DOMContentLoaded", function () {
  const authIcon = document.querySelector(".auth-icon");

  authIcon.addEventListener("click", function () {
    const authMenu = authIcon.querySelector(".auth-menu");
    authMenu.classList.toggle("show");
  });
});

// Function to toggle popups
function togglePopup(openPopup, closePopup) {
  openPopup.style.display = "block";
  closePopup.style.display = "none";
  popupOverlay.style.display = "block";
}

authLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target");
    if (target === "signup") {
      signupPopup.style.display = "block";
      loginPopup.style.display = "none"; // Close the login popup
    } else if (target === "login") {
      loginPopup.style.display = "block";
      signupPopup.style.display = "none"; // Close the signup popup
    } else if (target === "otp-verification") {
      afterRegistrationSuccess(); // Open OTP verification popup
    }
    popupOverlay.style.display = "block";
  });
});

closePopupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    signupPopup.style.display = "none";
    loginPopup.style.display = "none";
    otpVerificationPopup.style.display = "none"; // Close the OTP verification popup
    popupOverlay.style.display = "none";
  });
});

const otpVerificationPopup = document.getElementById("otp-verification-popup");

// Function to open OTP verification popup
function openOTPVerificationPopup() {
  otpVerificationPopup.style.display = "block";
  popupOverlay.style.display = "block";
}

// Function to close OTP verification popup
function closeOTPVerificationPopup() {
  otpVerificationPopup.style.display = "none";
  popupOverlay.style.display = "none";
}

// Call this function after successful registration to open OTP verification popup
function afterRegistrationSuccess() {
  // Open the OTP verification popup
  openOTPVerificationPopup();
}

// Call the closeOTPVerificationPopup function when the close button in the OTP verification popup is clicked
const otpVerificationCloseButton =
  otpVerificationPopup.querySelector(".action");
otpVerificationCloseButton.addEventListener("click", closeOTPVerificationPopup);
