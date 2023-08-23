//! Frontend Javascript - PetFindr Senior Project
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
