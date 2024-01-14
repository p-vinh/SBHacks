// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.get('/run-python', (req, res) => {
  const python = spawn('python', ['../barcodeAPI.py']);

  python.stdout.on('data', (data) => {
    res.send(data.toString());
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve template files from the current directory
app.use(express.static(__dirname));

// Handle form submission for creating an account
app.post("/create-account", (req, res) => {
  const { username, email, password } = req.body;

  // User data without goals
  const userDataWithoutGoals = {
    username,
    email,
    password,
  };

  const userFilePath = path.join(__dirname, "user-data", `${username}.json`);

  fs.writeFile(userFilePath, JSON.stringify(userDataWithoutGoals), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      res.json({ success: false, message: "Error creating account" });
    } else {
      // Send back the user data without goals in the response
      res.json(userDataWithoutGoals);
      app.get('/endpoint', (req, res) => {
        let data = {
          message: JSON.stringify(userDataWithoutGoals),
        };

        res.json(data);
        console.log(data);
      });
    }
  });
});

// Append goals to an existing user file
app.post("/add-goals", (req, res) => {
  const {
    username,
    calorieGoal = 0,
    fatGoal = 0,
    carbGoal = 0,
    proteinGoal = 0,
    sodiumGoal = 0,
    calories = 0,
    fats = 0,
    carbs = 0,
    proteins = 0,
    sodiums = 0,
  } = req.body;
  
  const userFilePath = path.join(__dirname, "user-data", `${username}.json`);

  fs.readFile(userFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.json({ success: false, message: "Error appending goals" });
    } else {
      const userData = JSON.parse(data);

      // Append goals to the existing user data
      userData.goals = {
        calorieGoal,
        fatGoal,
        carbGoal,
        proteinGoal,
        sodiumGoal,
      };

      userData.current = {
        calories,
        fats,
        carbs,
        proteins,
        sodiums,
      };

      fs.writeFile(userFilePath, JSON.stringify(userData), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          res.json({ success: false, message: "Error appending data" });
        } else {
          res.json({
            success: true,
            message: "Data appended successfully",
            goals: userData.goals,
            current: userData.current,
          });
        }
      });
    }
  });
});

// Handle form submission for login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userFilePath = path.join(__dirname, "user-data", `${username}.json`);

  // Check if the username file exists
  if (fs.existsSync(userFilePath)) {
    // Read the user data from the file
    const userData = JSON.parse(fs.readFileSync(userFilePath, "utf8"));

    app.get('/endpoint', (req, res) => {
      let data = {
        message: JSON.stringify(userData),
      };

      res.json(data);
      console.log(data);
    });

    // Check if the passwords match
    if (userData.password === password) {
      // Use path.join to handle file paths cross-platform
      const profilePath = path.join(__dirname, "profile.html");
      // Redirect to '/profile.html' on successful login
      res.sendFile(profilePath);
    } else {
      res.json({ success: false, message: "Incorrect password" });
    }
  } else {
    res.json({ success: false, message: "User not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
