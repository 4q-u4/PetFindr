import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fetch from "node-fetch";
import path from "path"; // path module
import mysql from "mysql2";
import { fileURLToPath } from "url";


const app = express();
app.use(express.json())

const port = process.env.PORT || 4000;

// Wait for Requests from {PORT}
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//! =================================================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



//! ======= DB CONNECTION ========================================================================== //

const pool = mysql.createPool({
  // pool of connections that can be reused //promise will allow to use promise api version of mysql instead of call back version
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DB
}).promise();

pool.getConnection()
  .then(connection => {
    console.log('MySQL Database Connected Successfully!');
    // Release the connection back to the pool
    connection.release();
  })
  .catch(error => {
    console.error('Error connecting to MySQL Database:', error.message);
  });

const [result] = await pool.query("SELECT * FROM user_table") //cause imusing modules i used await on top level await (await is out of async) // [result] to return only 1 array
console.log(result);

// Define the verify_captcha function
async function verify_captcha(token) {
  const params = new URLSearchParams({
    secret: captchaSecretKey,
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

//! ======= CAPTCHA Verification and Form Submission Route ========================================================================== //
// Initialize hCaptcha with your hCaptcha secret key
const captchaSecretKey = process.env.hCaptchaSecret;


app.post('/verify-captcha', async (req, res) => {
  console.log('Received data:', req.body);

  const { 'signup-fname': fname, 'signup-lname': lname, 'sign-up-phone': phone, 'signup-email': email, 'signup-password': password, 'h-captcha-response': captchaResponse } = req.body;

  try {
    // Verify CAPTCHA response using your async function
    const [captchaData, captchaError] = await verify_captcha(captchaResponse);

    if (captchaError) {
      return res.status(500).json({ error: 'CAPTCHA verification error' });
    }

    if (!captchaData.success) {
      return res.status(400).json({ error: 'CAPTCHA verification failed' });
    }

    // CAPTCHA verification successful, proceed with form submission
    const sql = 'INSERT INTO user_table (fname, lname, email, password, phone) VALUES (?, ?, ?, ?, ?)';
    try {
      // Check for undefined values and replace with null if necessary
      const values = [fname, lname, email, password, phone || null];

      // Perform database insertion logic here

      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error signing up' });
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    res.status(500).json({ error: 'CAPTCHA verification error' });
  }
});


//! =================================================================================


// async function verify_captcha(token) {
//   // verify captcha
//   const params = new URLSearchParams({
//     secret: process.env.hCaptchaSecret,
//     response: token,
//   });

//   try {
//     const response = await fetch("https://hcaptcha.com/siteverify", {
//       method: "POST",
//       body: params,
//     });

//     const data = await response.json();
//     return [data, null];
//   } catch (error) {
//     console.error(error);
//     return [null, error.message];
//   }
// }
// //! =================================================================================

// async function verify_form_inputs(json) {
// verify form input
//   console.log(json);
//   const [verify, error] = await verify_captcha(json["h-captcha-response"]);
//   if (error || !verify.success) {
//     return false;
//   }
//   return true;
// }
// check if email is found in db

// app.post("/signup", async (req, res) => {
//   await verify_form_inputs(req.body);
// });

// app.post("/submitPet", (req, res) => {
//   const petInfo = req.body;
//   // Process the petInfo and store it, e.g., in a database
//   return res.json({ message: "Pet submitted successfully!" });
// });

app.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, "public", "404.html")); // at the end cause it works from top to buttom
});

// =================================================================================

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

//
// <html><body> {{REPLACE_ME}} </body></html>
// string = fs.readFileSync("eco page")
// string.replace("{{REPLACE_ME}}", "<script></script>")
