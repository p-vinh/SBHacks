document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("createAccount")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission
      const userName = document.getElementById("signupUsername").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupPasswordConfirm"
      ).value;

      document.getElementById("step1").style.display = "none";

      document.getElementById("step2").style.display = "block";

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

    });

    fetch("/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            window.location.href = "/profile.html"; // Redirect to profile page on successful account creation
          } else {
            alert(data.message); // Show error message
          }

        })
        .catch((error) => console.error("Error:", error));
    
  document
    .getElementById("continueButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "profile.html";
    });
});
