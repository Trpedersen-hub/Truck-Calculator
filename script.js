alert("SCRIPT IS LOADING");
 
// Hide all screens
function hideAllViews() {
document.getElementById("dashboardView").classList.add("hidden");
document.getElementById("newJobView").classList.add("hidden");
document.getElementById("jobDetailView").classList.add("hidden");
document.getElementById("calendarView").classList.add("hidden");
}
 
// Dashboard
function showDashboard() {
hideAllViews();
 
document
.getElementById("dashboardView")
.classList.remove("hidden");
}
 
// New Job
function showNewJob() {
hideAllViews();
 
document
.getElementById("newJobView")
.classList.remove("hidden");
}
 
// Calendar
function showCalendar() {
hideAllViews();
 
document
.getElementById("calendarView")
.classList.remove("hidden");
}
 
// Startup
window.onload = function () {
 
const todayDate =
document.getElementById("todayDate");
 
if (todayDate) {
todayDate.textContent =
new Date().toLocaleDateString();
}
 
showDashboard();
};
