// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');  // Import path module to handle file paths
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve template files from the current directory
app.use(express.static(__dirname));

// Handle form submission
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Handle form submission for creating an account
app.post('/create-account', (req, res) => {
  const { username, email, password } = req.body;
  const userData = {
    username,
    email,
    password
  };

  const userFilePath = path.join(__dirname, 'user-data', `${username}.json`);

  fs.writeFile(userFilePath, JSON.stringify(userData), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.json({ success: false, message: 'Error creating account' });
    } else {
      res.json({ success: true, message: 'Account created successfully' });
    }
  });
});

// Handle form submission for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userFilePath = `./user-data/${username}.json`;

  // Check if the username file exists
  if (fs.existsSync(userFilePath)) {
    // Read the user data from the file
    const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

    // Check if the passwords match
    if (userData.password === password) {
      // Use path.join to handle file paths cross-platform
      const profilePath = path.join(__dirname, 'profile.html');
      // Redirect to '/profile.html' on successful login
      res.sendFile(profilePath);
    } else {
      res.json({ success: false, message: 'Incorrect password' });
    }
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
