console.log(process.env.DB_STRING);

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path"; // Import the path module

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const hCaptchaSecret = "0xEa6b026Cd4e6E82e845E1dF354f00CD1e264b6Dc";

app.post("/verify-captcha", async (req, res) => {
  const token = req.body["h-captcha-response"];

  const params = new URLSearchParams({
    secret: hCaptchaSecret,
    response: token,
  });

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      body: params,
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      res.send("Captcha verification successful!");
    } else {
      res.send("Captcha verification failed.");
    }
  } catch (error) {
    console.error("Error verifying captcha:", error);
    res.status(500).send("An error occurred while verifying captcha.");
  }
});

app.post("/submitPet", (req, res) => {
  const petInfo = req.body;
  // Process the petInfo and store it, e.g., in a database
  res.json({ message: "Pet submitted successfully!" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
