let activeButton = null;

function translateContainer() {
  const container = document.querySelector(".container");
  const dataContainer = document.querySelector(".data-container");
  const nutrientButtonsContainer = document.getElementById("nutrientButtons");
  const nutrientsList = document.getElementById("nutrientsList");

  container.classList.add("translated");
  dataContainer.classList.add("active");

  // Clear existing buttons and list items
  nutrientButtonsContainer.innerHTML = "";
  nutrientsList.innerHTML = "";

  // Get the data from the nutrients array (replace this with your actual data)
  const nutrients = [
    [
      "Vitamin A",
      "10 grams",
      "14% Daily Intake",
      "Saturated Fats: Saturated fats are characterized by their solid state at room temperature and are considered an unhealthy form of dietary fat. Predominantly sourced from animal products such as meat and dairy, common examples include beef, lamb, pork, and butter.Scientific evidence supports the association of saturated fat consumption with arterial clogging, thereby amplifying the risk of heart attacks and heart disease. It is advisable to limit saturated fat intake to approximately 5 percent of ones daily calorie allowance as a precautionary measure for maintaining cardiovascular health.",
    ],
    ["Vitamin B", "20 grams", "13% Daily Intake", "Information B"],
    ["Protein", "12 grams", "12% Daily Intake", "Information C"],
    ["Sugars", "37 grams", "10% Daily Intake", "Information D"],
    ["Zinc", "42 grams", "15% Daily Intake", "Information E"],
    ["Vitamin D", "12 grams", "25% Daily Intake", "Information A"],
    ["Potassium", "10 grams", "50% Daily Intake", "Information A"],
    // Add more nutrients as needed
  ];

  // Create containers for each button and its corresponding data
  nutrients.forEach((nutrient, index) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("nutrient-button-container");

    const button = document.createElement("button");
    button.classList.add("nutrient-button");
    button.textContent = nutrient[0]; // Displaying the nutrient name on the button

    // Create a div for the second column data
    const secondColumnDiv = document.createElement("div");
    secondColumnDiv.classList.add("data-column");
    secondColumnDiv.textContent = nutrient[1];

    // Create a div for the third column data
    const thirdColumnDiv = document.createElement("div");
    thirdColumnDiv.classList.add("data-column");
    thirdColumnDiv.textContent = nutrient[2];

    // Append both button and data columns to the container
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(secondColumnDiv);
    buttonContainer.appendChild(thirdColumnDiv);

    // Attach click event to show data for the respective nutrient
    button.addEventListener("click", () => {
      setActiveButton(button);
      displayNutrientData(nutrient, index);
    });

    nutrientButtonsContainer.appendChild(buttonContainer);
  });
}

function setActiveButton(button) {
  if (activeButton) {
    activeButton.classList.remove("active");
  }
  activeButton = button;
  activeButton.classList.add("active");

  // Reset margins for all buttons
  const nutrientButtons = document.querySelectorAll(
    ".nutrient-button-container"
  );
  nutrientButtons.forEach((buttonContainer) => {
    buttonContainer.style.marginTop = "10px"; // Reset margin to default
    buttonContainer.style.transform = "translateY(0)"; // Reset transform to default
  });
}

// Calculate the position based on the active button

function displayNutrientData(nutrient, index) {
  const nutrientsList = document.getElementById("nutrientsList");
  nutrientsList.innerHTML = ""; // Clear existing list items

  const listItem = document.createElement("li");
  listItem.classList.add("data-list-item");

  // Display only the fourth index of the selected nutrient
  const columnDiv = document.createElement("div");
  columnDiv.classList.add("data-column");
  columnDiv.textContent = nutrient[3];
  listItem.appendChild(columnDiv);

  nutrientsList.appendChild(listItem);

  // Get the active button element
  const activeButton = document.querySelector(".nutrient-button.active");

  // Check if the active button exists
  if (activeButton) {
    // Get the fourth column value of the current nutrient
    const nutrientValue = nutrient[3];

    // Wait for a duration (e.g., 1000 milliseconds) before setting the position
    setTimeout(() => {
      // Set the position based on the active button
      const barRect = document
        .querySelector(".data-container")
        .getBoundingClientRect();
      const activeButtonRect = activeButton.getBoundingClientRect();

      // Create or get the textAboveBar element
      let textAboveBar = document.querySelector(".text-above-bar");
      if (!textAboveBar) {
        textAboveBar = document.createElement("div");
        textAboveBar.classList.add("data-column", "text-above-bar");
        textAboveBar.style.pointerEvents = "none"; // Make the text non-interactive
        document.querySelector(".data-container").appendChild(textAboveBar);
      }

      // Set the position and z-index relative to the active button
      textAboveBar.style.position = "absolute";
      textAboveBar.style.top = `${activeButtonRect.top - barRect.top}px`;
      textAboveBar.style.left = `${activeButtonRect.right - barRect.left}px`;
      textAboveBar.style.zIndex = "1"; // Set z-index to bring it to the foreground
      textAboveBar.textContent = nutrientValue; // Update the content with the fourth column of the nutrient button
    }, 1500); // Adjust the duration as needed
  }

  // Shift every button below the active button down by 30 pixels
  const nutrientButtons = document.querySelectorAll(
    ".nutrient-button-container"
  );
  nutrientButtons.forEach((buttonContainer, i) => {
    if (i > index) {
      buttonContainer.style.transform = "translateY(70px)";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      // Make sure the file is an image
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(img.src); // Free memory
      };

      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.onclick = function () {
        img.remove();
        btn.remove();
      };

      const uploadedImages = document.getElementById("uploaded-images");
      uploadedImages.appendChild(img);
      uploadedImages.appendChild(btn);
    }
  });

  document
    .getElementById("barcodeInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        translateContainer();
        console.log("Enter key pressed!");
      }
    });
});
