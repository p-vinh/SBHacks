// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } =  require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

//configure multer for file uploading 
const upload = multer({ dest: 'uploads/'})

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

app.post('/upload', upload.single('file'), (req, res) => {
  //checking if file is recieved
  if(req.file) {
    const pythonScriptPath = path.join(__dirname, '..', 'server.py'); // Adjust the path as necessary
    const filePath = path.join(__dirname, req.file.path);

    exec(`python "${pythonScriptPath}" "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return res.status(500).json({ success: false, message: 'Error processing image'});
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }
      res.json(JSON.parse(stdout));
    });
  } else {
    res.status(400).json({ success: false, message: 'No file upload' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
