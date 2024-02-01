// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { Storage } = require("@google-cloud/storage"); // Added line
const app = express();
const port = 3000;

app.use(cors());
const upload = multer({ dest: "uploads/" });
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve template files from the current directory
app.use(express.static(__dirname));

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, "ServiceKey_GoogleCloud.json"),
});
const bucketName = "nutribot_data_bucket";

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
      app.get("/endpoint", (req, res) => {
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
app.post("/add-goals", async (req, res) => {
  const {
    username,
    calorieGoal,
    fatGoal,
    carbGoal,
    proteinGoal,
    sodiumGoal,
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

      fs.writeFile(userFilePath, JSON.stringify(userData), async (err) => {
        if (err) {
          console.error("Error writing file:", err);
          res.json({ success: false, message: "Error appending data" });
        } else {
          // Upload file to Google Cloud Storage
          try {
            const gcs = storage.bucket(bucketName);
            const storagePath = `user-data/${username}.json`;

            await gcs.upload(userFilePath, {
              destination: storagePath,
              public: true,
              metadata: {
                contentType: "application/json",
              },
            });

            res.json({
              success: true,
              message: "Goals and file uploaded successfully",
              goals: userData.goals,
            });
          } catch (error) {
            console.error("Error uploading file to GCS:", error);
            res
              .status(500)
              .json({ success: false, message: "Error uploading file to GCS" });
          }
        }
      });
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  //checking if file is recieved
  if (req.file) {
    const pythonScriptPath = path.join(__dirname, "..", "server.py"); // Adjust the path as necessary
    const filePath = path.join(__dirname, req.file.path);

    exec(
      `python "${pythonScriptPath}" "${filePath}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return res
            .status(500)
            .json({ success: false, message: "Error processing image" });
        }
        if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
        }
        res.json(JSON.parse(stdout));
      }
    );
  } else {
    res.status(400).json({ success: false, message: "No file upload" });
  }
});

// Handle form submission for login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userFilePath = path.join(__dirname, "user-data", `${username}.json`);

  // Check if the username file exists
  if (fs.existsSync(userFilePath)) {
    // Read the user data from the file
    const userData = JSON.parse(fs.readFileSync(userFilePath, "utf8"));

    app.get("/endpoint", (req, res) => {
      let data = {
        message: JSON.stringify(userData),
      };

      res.json(data);
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

app.post("/update-profile", (req, res) => {
  const { username, calories, fats, carbs, proteins, sodiums } = req.body;
  const userFilePath = path.join(__dirname, "user-data", `${username}.json`);

  fs.readFile(userFilePath, "utf8", (err, data) => {
    if (err) {
      res.json({ success: false, message: "Error updating profile" });
      return;
    }
    
    let userData = JSON.parse(data);
    console.log(userData);
    userData.current.calories += calories;
    userData.current.fats += fats;
    userData.current.carbs += carbs;
    userData.current.proteins += proteins;
    userData.current.sodiums += sodiums;

    const updatedData = JSON.stringify(userData);
    

    fs.writeFile(userFilePath, updatedData, "utf-8", (err) => {
      if (err) {
        res.json({ success: false, message: "Error updating profile" });
      } else {
        res.json({ success: true, message: "Profile updated successfully" });
      }
    });
  });
});
// Modified /upload endpoint to upload to Google Cloud Storage
// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (req.file) {
//     const filePath = req.file.path;
//     const fileName = `${username}.json`; // Replace with your dynamic filename

//     try {
//       const gcs = storage.bucket(bucketName);
//       const storagePath = `user-data/${fileName}`;

//       // Upload file to Google Cloud Storage
//       await gcs.upload(filePath, {
//         destination: storagePath,
//         public: true,
//         metadata: {
//           contentType: 'application/json',
//         },
//       });

//       // Optionally, you can delete the local file after uploading to GCS
//       fs.unlinkSync(filePath);

//       res.json({ success: true, message: 'File uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading file to GCS:', error);
//       res.status(500).json({ success: false, message: 'Error uploading file to GCS' });
//     }
//   } else {
//     res.status(400).json({ success: false, message: 'No file upload' });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
