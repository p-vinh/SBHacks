document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const resultDiv = document.getElementById('scheduleResult');
    resultDiv.innerHTML = `Appointment scheduled for ${date} at ${time}.`;
});
