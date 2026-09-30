const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const downtime = document.getElementById("downtime");
const standby = document.getElementById("standby");
const totalDisplay = document.getElementById("total");
 
function convertToMinutes(time) {
if (!time) return 0;
 
const [hours, minutes] = time.split(":").map(Number);
return (hours * 60) + minutes;
}
 
function formatMinutes(minutes) {
const hours = Math.floor(minutes / 60);
const mins = minutes % 60;
 
return `${hours}h ${mins}m`;
}
 
function calculateTime() {
const start = convertToMinutes(startTime.value);
const end = convertToMinutes(endTime.value);
 
let total = end - start;
 
// Supports overnight shifts
if (total < 0) {
total += 1440;
}
 
total -= Number(downtime.value || 0);
total -= Number(standby.value || 0);
 
if (total < 0) {
total = 0;
}
 
totalDisplay.textContent = formatMinutes(total);
}
 
startTime.value = "06:00";
endTime.value = "16:30";
 
startTime.addEventListener("input", calculateTime);
endTime.addEventListener("input", calculateTime);
downtime.addEventListener("input", calculateTime);
standby.addEventListener("input", calculateTime);
 
calculateTime();
