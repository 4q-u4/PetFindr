function updateBreeds() {
  var selectedOption = document.getElementById("petType").value;
  var breedSelect = document.getElementById("petBreedSelect");

  // Reset the breed options
  breedSelect.innerHTML = "";

  if (selectedOption === "dog") {
    var dogBreeds = [
      "",
      "Labrador Retriever",
      "Poodle",
      "Bulldog",
      "German Shepherd",
      "Golden Retriever",
      "Beagle",
      "Rottweiler",
      "Husky",
      "Doberman",
      "Pointer",
    ];
    for (var i = 0; i < dogBreeds.length; i++) {
      var option = document.createElement("option");
      option.text = dogBreeds[i];
      breedSelect.add(option);
    }
  } else if (selectedOption === "cat") {
    var catBreeds = [
      "",
      "Siamese",
      "Persian",
      "Maine Coon",
      "Bengal",
      "Birman",
      "Bombay",
      "British Shorthair",
      "Devon Rex",
      "Scottish Fold",
    ];
    for (var i = 0; i < catBreeds.length; i++) {
      var option = document.createElement("option");
      option.text = catBreeds[i];
      breedSelect.add(option);
    }
  }
}

//medical conditons

document
  .getElementById("medicalConditionsOption")
  .addEventListener("change", function () {
    var textareaContainer = document.getElementById(
      "medicalConditionsTextareaContainer"
    );
    if (this.value === "yes") {
      textareaContainer.style.display = "block";
      document
        .getElementById("medicalConditionsTextarea")
        .setAttribute("required", "");
    } else {
      textareaContainer.style.display = "none";
      document
        .getElementById("medicalConditionsTextarea")
        .removeAttribute("required");
    }
  });

//submit for both forma

document
  .getElementById("submitBothForms")
  .addEventListener("click", function () {
    document.getElementById("reportForm").submit(); // Submit the first form
    document.getElementById("secondForm").submit(); // Submit the second form
  });
