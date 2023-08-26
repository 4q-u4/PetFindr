import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DB_STRING);

import express from "express";
import fetch from "node-fetch";
import path from "path"; // Import the path module
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function verify_captcha(token) {
  // verify captcha
  const params = new URLSearchParams({
    secret: process.env.hCaptchaSecret,
    response: token,
  });

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      body: params,
    });

    const data = await response.json();
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error.message];
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
async function verify_form_inputs(json) {
  // verify form input
  console.log(json);
  const [verify, error] = await verify_captcha(json["h-captcha-response"]);
  if (error || !verify.success) {
    return false;
  }
  return true;
}
// check if email is found in db

app.post("/signup", async (req, res) => {
  await verify_form_inputs(req.body);
});

app.post("/submitPet", (req, res) => {
  const petInfo = req.body;
  // Process the petInfo and store it, e.g., in a database
  return res.json({ message: "Pet submitted successfully!" });
});

app.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//? Connection to DB
//? Put signupform info into db table
//? Make some buttons on website, redirect to login page wehn pressed
//? When user presses on My account , he can update delete his info or account
//? Info entred in post a pet for adoption, needs to posted in pet adoption page (like ecom page)
//? If user presses on more info about a dog for example, this specfic dog will open in single item page
//?search bar functionality

//= mysql2 {address: database: user: pass: }
//= mysql2.nonquery("INSERT VALUES (a, b, c, d) INTO (``)") [Search for  Add Parameter Prevent SQL Injection]
//= return res.redirect("/page/")
//= "UPDATE"
//= "INSERT" in db bas | ecom page -> GET request from db all adoptions
//=
