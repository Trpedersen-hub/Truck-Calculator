alert("1 - Script Loaded");
 
window.onload = function () {
 
alert("2 - Window Loaded");
 
const dashboard =
document.getElementById("dashboardView");
 
alert(
"3 - Dashboard Found? " +
(dashboard !== null)
);
 
if (dashboard) {
dashboard.style.display = "block";
}
 
alert("4 - Done");
 
};
