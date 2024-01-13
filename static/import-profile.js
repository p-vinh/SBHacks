window.onload = function () {
    document.getElementById("profileLink").onclick = updateProfile();
};


function debugAPICall() {
    console.log("API call");
    return JSON.stringify({
        "name": "John Doe",
        "email": "yourexample@gmail.com",
        "total-carbs": 1205,
        "total-protein": 10,
        "total-fat": 30,
        "total-calories": 100,
        "goal-carbs": 200,
        "goal-protein": 50,
        "goal-fat": 50,
        "goal-calories": 2000
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
        offset = circumference - (percent % 100) / 100 * circumference;
    }
    circle.style.strokeDashoffset = offset;
}


function updateProfile() {
    const profile = JSON.parse(debugAPICall()); // Get API call here
    
    if (profile == null) {
        return;
    }

    document.getElementById("name").innerHTML = "Welcome " + profile.name;
    let total = profile["total-calories"];
    let goal = profile["goal-calories"];
    let percent = Math.round(total / goal * 100);
    document.getElementById("calories-counter").innerHTML = total + "/" + goal;
    setProgress(percent, ".progress-ring_circle-calories");

    total = profile["total-carbs"];
    goal = profile["goal-carbs"];
    percent = Math.round(total / goal * 100);
    document.getElementById("carbs-counter").innerHTML = total + "/" + goal;
    setProgress(percent, ".progress-ring_circle-carbs");

    total = profile["total-fat"];
    goal = profile["goal-fat"];
    percent = Math.round(total / goal * 100);
    document.getElementById("fat-counter").innerHTML = total + "/" + goal;
    setProgress(percent, ".progress-ring_circle-fat");

    total = profile["total-protein"];
    goal = profile["goal-protein"];
    percent = Math.round(total / goal * 100);
    document.getElementById("protein-counter").innerHTML = total + "/" + goal;
    setProgress(percent, ".progress-ring_circle-protein");
}