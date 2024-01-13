const circle = document.querySelector('.progress-ring__circle');


function setProgress(percent) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}
