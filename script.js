alert("SCRIPT IS LOADING");
 
function hideAllViews() {
 
document.getElementById("dashboardView").style.display = "none";
document.getElementById("newJobView").style.display = "none";
document.getElementById("jobDetailView").style.display = "none";
document.getElementById("calendarView").style.display = "none";
 
}
 
function showDashboard() {
 
hideAllViews();
 
document.getElementById("dashboardView").style.display = "block";
 
}
 
function showNewJob() {
 
hideAllViews();
 
document.getElementById("newJobView").style.display = "block";
 
}
 
function showCalendar() {
 
hideAllViews();
 
document.getElementById("calendarView").style.display = "block";
 
}
 
window.onload = function() {
 
document.getElementById("todayDate").innerText =
new Date().toLocaleDateString();
 
showDashboard();
 
};
