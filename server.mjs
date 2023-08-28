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

//! TEST 
// async function insertData() {
//   try {
//     const [result] = await pool.query(
//       "INSERT INTO user_table (fname, lname, email, password, phone) VALUES (?, ?, ?, ?, ?)",
//       ['John', 'Doe', 'john@example.com', 'hashed_password', '1234567890']
//     );

//     console.log('Data inserted successfully:', result);
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   }
// }

// insertData();

// const [result] = await pool.query("SELECT * FROM user_table") //cause imusing modules i used await on top level await (await is out of async) // [result] to return only 1 array
// console.log(result);

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

    // Check if email already exists in the database
    const emailExistsQuery = 'SELECT COUNT(*) AS count FROM user_table WHERE email = ?';
    const [emailExistsResult] = await pool.query(emailExistsQuery, [email]);

    if (emailExistsResult[0].count > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // CAPTCHA verification successful, proceed with form submission


    const sql = "INSERT INTO user_table (fname, lname, email, password, phone) VALUES (?, ?, ?, ?, ?)";
    try {
      // Check for undefined values and replace with null if necessary
      const values = [fname, lname, email, password, phone || null];

      // Perform database insertion logic here
      const [result] = await pool.query(sql, values);
      console.log('Data inserted successfully');

      // Send a success JSON response
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
//    verify captcha
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
//   const petInfo = req.body;const userData = {
//   first_name: 'test',
//   last_name: 'test',
//   email: 'ssal@gmaill.com',
//   password: 'ionklk'
// };

// const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
// const values = [userData.first_name, userData.last_name, userData.email, userData.password];

//   // Process the petInfo and store it, e.g., in a database
//   return res.json({ message: "Pet submitted successfully!" });
// });
// //! =======LOGIN ==========================================================================

app.post('/login', async (req, res) => {
  const { 'login-email': email, 'login-password': password } = req.body;

  // Check email and password against the database
  const loginQuery = 'SELECT id FROM user_table WHERE email = ? AND password = ?';
  const [loginResult] = await pool.query(loginQuery, [email, password]);

  if (loginResult.length > 0) {
    const userId = loginResult[0].id; // Get user ID from the query result

    // Successful login
    res.status(200).json({ message: 'Login successful', userId: userId }); // Include userId in the response
  } else {
    // Failed login
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

//! =================================================================================

// Fetch user info based on user ID
app.get('/user-info', async (req, res) => {
  const userId = req.query.id;
  console.log('Received User ID:', userId);

  if (!userId) {
    return res.status(400).json({ error: 'User ID not provided' });
  }

  try {

    const [rows] = await pool.query('SELECT * FROM user_table WHERE id = ?', [userId]);

    if (rows.length > 0) {
      const userInfo = rows[0];
      res.status(200).json(userInfo);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/update-profile', async (req, res) => {
  const userId = req.body.id; // Use userId instead of id
  const firstName = req.body.fname; // Use fname instead of firstName
  const lastName = req.body.lname; // Use lname instead of lastName
  const phone = req.body.phone;
  const email = req.body.email;

  try {
    // Construct the SQL query dynamically based on the provided data
    let query = 'UPDATE user_table SET';
    const values = [];
    if (firstName !== '') {
      query += ' fname=?,';
      values.push(firstName);
    }
    if (lastName !== '') {
      query += ' lname=?,';
      values.push(lastName);
    }
    if (phone !== '') {
      query += ' phone=?,';
      values.push(phone);
    }
    if (email !== '') {
      query += ' email=?,';
      values.push(email);
    }
    // Remove the trailing comma and add the WHERE clause
    query = query.slice(0, -1) + ' WHERE id=?';
    values.push(userId);

    const [result] = await pool.query(query, values);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(500).json({ error: 'Profile update failed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//! ============delete acc=====================================================================

app.delete('/delete-account', async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not provided' });
  }

  try {
    // Delete the user's account from the database based on the provided user ID
    const deleteQuery = 'DELETE FROM user_table WHERE id = ?';
    const [result] = await pool.query(deleteQuery, [userId]);

    if (result.affectedRows > 0) {
      // Account deletion successful
      res.status(200).json({ message: 'Account deleted successfully' });
    } else {
      // No rows were affected, likely due to non-existent user ID
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// //! ======= chnage password ==========================================================================


app.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Check if the provided old password matches the stored password for the user
    const checkPasswordQuery = 'SELECT COUNT(*) AS count FROM user_table WHERE id = ? AND password = ?';
    const [passwordCheckResult] = await pool.query(checkPasswordQuery, [userId, oldPassword]);

    if (passwordCheckResult[0].count === 0) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Update the user's password with the new one
    const updatePasswordQuery = 'UPDATE user_table SET password = ? WHERE id = ?';
    await pool.query(updatePasswordQuery, [newPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// //! ========= send location long lat (user.html)========================================================================
app.post('/save-location', async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // Insert the location data into the user's row in the database
    const insertQuery = 'UPDATE user_table SET lat = ?, lon = ? WHERE id = ?';
    await pool.execute(insertQuery, [latitude, longitude, userId]);

    res.status(200).json({ message: 'Location data saved successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save location data' });
  }
});

// //! ===== contact us form ============================================================================

app.post("/submit-form", (req, res) => {
  const { fname, lname, email, message } = req.body;

  // Insert the form data into the "contact_us" table
  const insertQuery = 'INSERT INTO contact_us (first_name, last_name, email, message) VALUES (?, ?, ?, ?)';
  pool.execute(insertQuery, [fname, lname, email, message], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to submit form data' });
    } else {
      res.status(200).json({ message: 'Form data submitted successfully' });
    }
  });
});

// //! =================================================================================

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
