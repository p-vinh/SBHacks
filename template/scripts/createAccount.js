document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("createAccount")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission
      const username = document.getElementById("signupUsername").value;
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
  document
    .getElementById("continueButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "profile.html";
    });
});
