window.onload = function () {
  document.getElementById("profileLink").onclick = updateProfile();
};

function debugAPICall() {
  console.log("API call");
  return JSON.stringify({
    name: "John Doe",
    email: "yourexample@gmail.com",
    "total-carbs": 1205,
    "total-protein": 10,
    "total-fat": 30,
    "total-calories": 100,
    "total-sodium": 1,
    "goal-carbs": 2000,
    "goal-protein": 50,
    "goal-fat": 50,
    "goal-calories": 2000,
    "goal-sodium": 20,
  });
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
  let profile; // Get API call here
  if (data == null) {
    // Get API call here
    profile = JSON.parse(debugAPICall());
  } else {
    profile = JSON.parse(data);
  }
  console.log(profile);
  if (profile == null) {
    return;
  }

  document.getElementById("name").innerHTML = "Welcome " + profile.name;
  let total = profile["total-calories"];
  let goal = profile["goal-calories"];
  let percent = Math.round((total / goal) * 100);
  document.getElementById("calories-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-calories");

  total = profile["total-carbs"];
  goal = profile["goal-carbs"];
  percent = Math.round((total / goal) * 100);
  document.getElementById("carbs-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-carbs");

  total = profile["total-fat"];
  goal = profile["goal-fat"];
  percent = Math.round((total / goal) * 100);
  document.getElementById("fat-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-fat");

  total = profile["total-protein"];
  goal = profile["goal-protein"];
  percent = Math.round((total / goal) * 100);
  document.getElementById("protein-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-protein");

  total = profile["total-sodium"];
  goal = profile["goal-sodium"];
  percent = Math.round((total / goal) * 100);
  document.getElementById("sodium-counter").innerHTML = total + "/" + goal;
  setProgress(percent, ".progress-ring_circle-sodium");
}

var acc = document.getElementsByClassName("accordion-button");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

document.addEventListener('click', function(event) {
  var isClickInside = document.querySelector('.accordion-container').contains(event.target);

  if (!isClickInside) {
    var accordionContent = document.querySelector('.accordion-content');
    accordionContent.style.maxHeight = "0px";
  }
});

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
  let old_data = JSON.parse(debugAPICall());
  let data = JSON.stringify({
    name: old_data["name"],
    "total-carbs": old_data["total-carbs"],
    "total-protein": old_data["total-protein"],
    "total-fat": old_data["total-fat"],
    "total-calories": old_data["total-calories"],
    "total-sodium": old_data["total-sodium"],
    "goal-carbs": carbs,
    "goal-protein": protein,
    "goal-fat": fat,
    "goal-calories": calories,
    "goal-sodium": sodium,
  });
  console.log(data);
  // Send data to API here
  popup.style.display = "none";
  updateProfile(data);
}
