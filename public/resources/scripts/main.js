//! Frontend Javascript - PetFindr Senior Project

// SCROLL TO 4 ACTION BUTTONS (GO)
document.addEventListener("DOMContentLoaded", function () {
  const scrollButton = document.querySelector(".scroll-button");

  if (scrollButton) {
    scrollButton.addEventListener("click", function () {
      const buttonContainer = document.querySelector(".section-title");

      if (buttonContainer) {
        window.scrollTo({
          top: buttonContainer.offsetTop,
          behavior: "smooth",
        });
      }
    });
  }
});

// SCROLL TO INFO CARDS (LEARN MORE)
document.addEventListener("DOMContentLoaded", function () {
  const scrollButton = document.querySelector(".scroll-button-one");

  if (scrollButton) {
    scrollButton.addEventListener("click", function () {
      const buttonContainer = document.querySelector(".card-container");

      if (buttonContainer) {
        window.scrollTo({
          top: buttonContainer.offsetTop,
          behavior: "smooth",
        });
      }
    });
  }
});

//Open Signup/Login Menu In Header
document.addEventListener("DOMContentLoaded", function () {
  const authIcon = document.querySelector(".auth-icon");

  authIcon.addEventListener("click", function () {
    const authMenu = authIcon.querySelector(".auth-menu");
    authMenu.classList.toggle("show");
  });

  const loginButton = document.querySelector(".auth-link");
  const signupButton = document.querySelector(".auth-link-one");

  loginButton.addEventListener("click", function () {
    window.location.href = "pages/login.html";
  });

  signupButton.addEventListener("click", function () {
    window.location.href = "pages/user.html";
  });
});
