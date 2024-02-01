let data = null;
let loggedInUser = "";

window.onload = function () {
  fetch("/endpoint")
    .then((response) => response.json())
    .then((responseData) => {
      data = responseData.message;
      console.log(data);
      loggedInUser = data.username;
      updateProfile(data);
    })
    .catch((error) => console.error("Error:", error));
  document.getElementById("profileLink").onclick = updateProfile(data);
};

fetch("/endpoint")
  .then((response) => response.json())
  .then((responseData) => {
    console.log(responseData.message);
    data = responseData.message;
    console.log(data);
    loggedInUser = data.username;
  })
  .catch((error) => console.error("Error:", error));

function importFromDB() {
  console.log("Retrieving data from database...");
  updateProfile(data);
  return data;
}

function setProgress(percent, goal) {
  let circle = document.querySelector(goal);
  let radius = circle.r.baseVal.value;
  let circumference = radius * 2 * Math.PI;
  let offset;
  if (percent > 100) {
    offset = 0;
  } else {
    offset = circumference - ((percent % 100) / 100) * circumference;
  }
  circle.style.strokeDashoffset = offset;
}

function updateProfile(data = null) {
  let profile = JSON.parse(data);
  console.log(profile);
  if (profile == null) {
    return;
  }

  document.getElementById("name").innerHTML = "Welcome " + profile.username;
  let total = profile.current.calories;
  let goal = profile.goals.calorieGoal;
  let percent = Math.round((total / goal) * 100);
  document.getElementById("calories-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-calories");

  total = profile.current.carbs;
  goal = profile.goals.carbGoal;
  percent = Math.round((total / goal) * 100);
  document.getElementById("carbs-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-carbs");

  total = profile.current.fats;
  goal = profile.goals.fatGoal;
  percent = Math.round((total / goal) * 100);
  document.getElementById("fat-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-fat");

  total = profile.current.proteins;
  goal = profile.goals.proteinGoal;
  percent = Math.round((total / goal) * 100);
  document.getElementById("protein-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-protein");

  total = profile.current.sodiums;
  goal = profile.goals.sodiumGoal;
  percent = Math.round((total / goal) * 100);
  document.getElementById("sodium-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-sodium");
}

var acc = document.getElementsByClassName("accordion-button");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

var popup = document.getElementById("popup-window");
var btn = document.querySelector(".change-button");
var span = document.querySelector(".close");

btn.onclick = function () {
  popup.style.display = "block";
};

span.onclick = function () {
  popup.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

function changeGoals() {
  let calories = document.getElementById("target-calories").value
    ? document.getElementById("target-calories").value
    : 0;
  let carbs = document.getElementById("target-carbs").value
    ? document.getElementById("target-carbs").value
    : 0;
  let fat = document.getElementById("target-fat").value
    ? document.getElementById("target-fat").value
    : 0;
  let protein = document.getElementById("target-protein").value
    ? document.getElementById("target-protein").value
    : 0;
  let sodium = document.getElementById("target-sodium").value
    ? document.getElementById("target-sodium").value
    : 0;
  let old_data = JSON.parse(importFromDB());
  console.log(old_data);
  let data = JSON.stringify({
    username: old_data.username,
    current: {
      carbs: old_data.current.carbs,
      proteins: old_data.current.proteins,
      fats: old_data.current.fats,
      calories: old_data.current.calories,
      sodiums: old_data.current.sodiums,
    },
    goals: {
      carbGoal: carbs,
      proteinGoal: protein,
      fatGoal: fat,
      calorieGoal: calories,
      sodiumGoal: sodium,
    },
  });
  console.log(data);
  // Send data to API here
  popup.style.display = "none";
  updateProfile(data);
}
