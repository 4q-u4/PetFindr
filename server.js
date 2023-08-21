//console.log("Test test tescft");
require("dotenv").config();

console.log(process.env.DB_STRING);

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000; // You can change the port if needed

app.use(express.static("public")); // Serve static files from the 'public' directory

// Define a route to handle pet submissions
app.post("/submitPet", (req, res) => {
  const petInfo = req.body; // Assuming you're sending JSON data
  // Process the petInfo and store it, e.g., in a database

  // Respond with a success message or any other relevant response
  res.json({ message: "Pet submitted successfully!" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
