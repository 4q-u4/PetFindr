// Attach click event handlers to product buttons
const viewProductButtons = document.querySelectorAll(".view-product-btn");
viewProductButtons.forEach((button) => {
  button.addEventListener("click", handleViewProductClick);
});

function handleViewProductClick(event) {
  // Prevent default link behavior
  event.preventDefault();

  // Get the href attribute of the clicked link
  const productDetailsPage = this.getAttribute("href");

  // Redirect to the single product page
  window.location.href = productDetailsPage;
}
