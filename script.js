alert("SCRIPT IS LOADING");
 
function showDashboard() {
document.getElementById("dashboardView").classList.remove("hidden");
document.getElementById("newJobView").classList.add("hidden");
document.getElementById("jobDetailView").classList.add("hidden");
document.getElementById("calendarView").classList.add("hidden");
}
 
function showNewJob() {
document.getElementById("dashboardView").classList.add("hidden");
document.getElementById("newJobView").classList.remove("hidden");
document.getElementById("jobDetailView").classList.add("hidden");
document.getElementById("calendarView").classList.add("hidden");
}
 
function showCalendar() {
document.getElementById("dashboardView").classList.add("hidden");
document.getElementById("newJobView").classList.add("hidden");
document.getElementById("jobDetailView").classList.add("hidden");
document.getElementById("calendarView").classList.remove("hidden");
}
 
window.onload = function () {
 
document.getElementById("todayDate").textContent =
new Date().toLocaleDateString();
 
showDashboard();
};
