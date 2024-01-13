// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle form submission
app.post("/create-account", (req, res) => {
  const { username, email, password } = req.body;

  // Check if username file already exists
  if (fs.existsSync(`../user-data/${username}.json`)) {
    return res.json({ success: false, message: "Username already exists" });
  }

  // Create a user data object
  const userData = { username, email, password, profile: { } };

  // Save user data to a file
  fs.writeFileSync(`../user-data/${username}.json`, JSON.stringify(userData));

  // Respond with success
  res.json({ success: true, message: "Account created successfully" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
