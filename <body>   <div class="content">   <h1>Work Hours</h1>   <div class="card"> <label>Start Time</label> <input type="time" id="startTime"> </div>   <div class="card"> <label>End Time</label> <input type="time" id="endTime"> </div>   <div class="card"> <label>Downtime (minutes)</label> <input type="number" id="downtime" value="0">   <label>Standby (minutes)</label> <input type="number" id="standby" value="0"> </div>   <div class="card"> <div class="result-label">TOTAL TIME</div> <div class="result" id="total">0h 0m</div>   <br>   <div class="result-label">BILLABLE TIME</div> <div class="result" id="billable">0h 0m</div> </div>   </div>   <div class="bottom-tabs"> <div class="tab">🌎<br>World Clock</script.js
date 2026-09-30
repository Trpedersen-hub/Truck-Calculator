const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const downtime = document.getElementById("downtime");
const standby = document.getElementById("standby");
 
const totalDisplay = document.getElementById("total");
const billableDisplay = document.getElementById("billable");
 
function convertToMinutes(time) {
if (!time) return 0;
 
const [hours, minutes] = time.split(":").map(Number);
return (hours * 60) + minutes;
}
 
function formatMinutes(totalMinutes) {
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;
 
return `${hours}h ${minutes}m`;
}
 
function calculateTime() {
const start = convertToMinutes(startTime.value);
const end = convertToMinutes(endTime.value);
 
let totalMinutes = end - start;
 
// Handle overnight shifts
if (totalMinutes < 0) {
totalMinutes += 1440;
}
 
const downtimeMinutes =
parseInt(downtime.value) || 0;
 
const standbyMinutes =
parseInt(standby.value) || 0;
 
const billableMinutes = Math.max(
0,
totalMinutes -
downtimeMinutes -
standbyMinutes
);
 
totalDisplay.textContent =
formatMinutes(totalMinutes);
 
billableDisplay.textContent =
formatMinutes(billableMinutes);
}
 
// Set defaults
startTime.value = "06:00";
endTime.value = "16:30";
 
// Listen for changes
startTime.addEventListener("input", calculateTime);
endTime.addEventListener("input", calculateTime);
downtime.addEventListener("input", calculateTime);
standby.addEventListener("input", calculateTime);
 
// Initial calculation
calculateTime();
