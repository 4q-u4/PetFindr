//! Frontend Javascript - PetFindr Senior Project
  document.addEventListener("DOMContentLoaded", function () {
    const scrollButton = document.querySelector(".scroll-button");
    const targetContainer = document.querySelector(".section-description");

    scrollButton.addEventListener("click", function () {
      window.scrollTo({
        top: targetContainer.offsetTop,
        behavior: "smooth",
      });
    });
  });

