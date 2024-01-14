// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve template files from the current directory
app.use(express.static(__dirname));

// Handle form submission for creating an account
app.post('/create-account', (req, res) => {
  const { username, email, password } = req.body;

  // User data without goals
  const userDataWithoutGoals = {
    username,
    email,
    password,
  };

  const userFilePath = path.join(__dirname, 'user-data', `${username}.json`);

  fs.writeFile(userFilePath, JSON.stringify(userDataWithoutGoals), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.json({ success: false, message: 'Error creating account' });
    } else {
      // Send back the user data without goals in the response
      res.json(userDataWithoutGoals);
    }
  });
});

// Append goals to an existing user file
app.post('/add-goals', (req, res) => {
  const { username, calorieGoal, fatGoal, carbGoal, proteinGoal } = req.body;

  const userFilePath = path.join(__dirname, 'user-data', `${username}.json`);

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.json({ success: false, message: 'Error appending goals' });
    } else {
      const userData = JSON.parse(data);
      
      // Append goals to the existing user data
      userData.goals = {
        calorieGoal,
        fatGoal,
        carbGoal,
        proteinGoal,
      };

      fs.writeFile(userFilePath, JSON.stringify(userData), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          res.json({ success: false, message: 'Error appending goals' });
        } else {
          res.json({ success: true, message: 'Goals appended successfully', goals: userData.goals });
        }
      });
    }
  });
});

// Handle form submission for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userFilePath = path.join(__dirname, 'user-data', `${username}.json`);

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
