alert("SCRIPT LOADED");
 
function showDashboard() {
document.getElementById("dashboardView").style.display = "block";
document.getElementById("newJobView").style.display = "none";
}
 
function showNewJob() {
document.getElementById("dashboardView").style.display = "none";
document.getElementById("newJobView").style.display = "block";
}
 
window.onload = function () {
alert("WINDOW LOADED");
showDashboard();
};
`
