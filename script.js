let appData = JSON.parse(
localStorage.getItem("fleetTrackerData")
) || {
jobs: [],
timeEntries: {}
};
 
let currentJobId = null;
 
/* -------------------------- */
/* VIEW CONTROLS */
/* -------------------------- */
 
function hideAllViews() {
document
.querySelectorAll(".view")
.forEach(view => {
view.classList.add("hidden");
});
}
 
function showDashboard() {
hideAllViews();
 
document
.getElementById("dashboardView")
.classList.remove("hidden");
 
renderJobList();
updateDailyTotal();
}
 
function showNewJob() {
hideAllViews();
 
document
.getElementById("newJobView")
.classList.remove("hidden");
}
 
function showCalendar() {
hideAllViews();
 
document
.getElementById("calendarView")
.classList.remove("hidden");
}
 
/* -------------------------- */
/* DATE HELPERS */
/* -------------------------- */
 
function getTodayDate() {
return new Date()
.toISOString()
.split("T")[0];
}
 
function formatToday() {
return new Date().toLocaleDateString(
undefined,
{
year: "numeric",
month: "long",
day: "numeric"
}
);
}
 
document.getElementById(
"todayDate"
).textContent = formatToday();
 
/* -------------------------- */
/* SAVE DATA */
/* -------------------------- */
 
function saveData() {
localStorage.setItem(
"fleetTrackerData",
JSON.stringify(appData)
);
}
 
/* -------------------------- */
/* JOB CREATION */
/* -------------------------- */
 
function saveJob() {
 
const jobNumber =
document.getElementById("jobNumber")
.value.trim();
 
const jobName =
document.getElementById("jobName")
.value.trim();
 
if (!jobNumber || !jobName) {
alert(
"Job Number and Job Name are required."
);
return;
}
 
const job = {
 
id: Date.now(),
 
jobNumber,
 
jobName,
 
projectManager:
document.getElementById(
"projectManager"
).value,
 
customer:
document.getElementById(
"customer"
).value,
 
location:
document.getElementById(
"location"
).value,
 
createdDate:
getTodayDate()
};
 
appData.jobs.push(job);
 
saveData();
 
document.getElementById(
"jobNumber"
).value = "";
 
document.getElementById(
"jobName"
).value = "";
 
document.getElementById(
"projectManager"
).value = "";
 
document.getElementById(
"customer"
).value = "";
 
document.getElementById(
"location"
).value = "";
 
renderJobList();
 
openJob(job.id);
}
 
/* -------------------------- */
/* JOB LIST */
/* -------------------------- */
 
function renderJobList() {
 
const container =
document.getElementById(
"jobList"
);
 
container.innerHTML = "";
 
if (appData.jobs.length === 0) {
 
container.innerHTML = `
<div class="card">
No jobs yet.
</div>
`;
 
return;
}
 
appData.jobs.forEach(job => {
 
const today =
getTodayDate();
 
const key =
`${today}_${job.id}`;
 
const entry =
appData.timeEntries[key];
 
let hours =
entry?.totalHours || 0;
 
const card =
document.createElement("div");
 
card.className =
"job-card";
 
card.innerHTML = `
<div class="job-number">
${job.jobNumber}
</div>
 
<div class="job-name">
${job.jobName}
</div>
 
<div class="job-hours">
${hours.toFixed(2)} Hours Today
</div>
`;
 
card.onclick = () =>
openJob(job.id);
 
container.appendChild(card);
 
});
}
 
/* -------------------------- */
/* OPEN JOB */
/* -------------------------- */
 
function openJob(jobId) {
 
currentJobId = jobId;
 
const job =
appData.jobs.find(
j => j.id === jobId
);
 
hideAllViews();
 
document
.getElementById(
"jobDetailView"
)
.classList.remove(
"hidden"
);
 
document.getElementById(
"detailJobNumber"
).textContent =
job.jobNumber;
 
document.getElementById(
"detailJobName"
).textContent =
job.jobName;
 
document.getElementById(
"detailDate"
).textContent =
formatToday();
 
const key =
`${getTodayDate()}_${jobId}`;
 
const entry =
appData.timeEntries[key];
 
document.getElementById(
"startTime"
).value =
entry?.startTime || "";
 
document.getElementById(
"endTime"
).value =
entry?.endTime || "";
 
calculateJobTime();
}
 
/* -------------------------- */
/* TIME CALCULATIONS */
/* -------------------------- */
 
function timeToMinutes(time) {
 
if (!time) return 0;
 
const [h, m] =
time.split(":")
.map(Number);
 
return h * 60 + m;
}
 
function calculateJobTime() {
 
if (!currentJobId) return;
 
const start =
document.getElementById(
"startTime"
).value;
 
const end =
document.getElementById(
"endTime"
).value;
 
if (!start || !end) {
 
document.getElementById(
"jobTotal"
).textContent =
"0.00";
 
return;
}
 
let minutes =
timeToMinutes(end) -
timeToMinutes(start);
 
if (minutes < 0) {
minutes += 1440;
}
 
const decimalHours =
minutes / 60;
 
document.getElementById(
"jobTotal"
).textContent =
decimalHours
.toFixed(2);
 
const key =
`${getTodayDate()}_${currentJobId}`;
 
appData.timeEntries[key] = {
 
startTime: start,
 
endTime: end,
 
totalHours:
decimalHours,
 
date:
getTodayDate(),
 
jobId:
currentJobId
};
 
saveData();
 
updateDailyTotal();
 
renderJobList();
}
 
/* -------------------------- */
/* DAILY TOTAL */
/* -------------------------- */
 
function updateDailyTotal() {
 
const today =
getTodayDate();
 
let total = 0;
 
Object.values(
appData.timeEntries
).forEach(entry => {
 
if (
entry.date === today
) {
 
total +=
entry.totalHours;
 
}
 
});
 
document.getElementById(
"dailyTotal"
).textContent =
total.toFixed(2) +
" hrs";
}
 
/* -------------------------- */
/* CALENDAR */
/* -------------------------- */
 
document
.getElementById(
"calendarDate"
)
.addEventListener(
"change",
function() {
 
const selected =
this.value;
 
const results =
document.getElementById(
"calendarResults"
);
 
let html = "";
 
appData.jobs.forEach(job => {
 
const key =
`${selected}_${job.id}`;
 
const entry =
appData.timeEntries[key];
 
if (entry) {
 
html += `
<div class="job-card">
 
<div class="job-number">
${job.jobNumber}
</div>
 
<div class="job-name">
${job.jobName}
</div>
 
<div class="job-hours">
${entry.totalHours.toFixed(2)} Hours
</div>
 
</div>
`;
}
});
 
if (!html) {
 
html =
`
<div>
No entries found.
</div>
`;
}
 
results.innerHTML =
html;
}
);
 
/* -------------------------- */
/* EVENTS */
/* -------------------------- */
 
document
.getElementById(
"startTime"
)
.addEventListener(
"input",
calculateJobTime
);
 
document
.getElementById(
"endTime"
)
.addEventListener(
"input",
calculateJobTime
);
 
/* -------------------------- */
/* STARTUP */
/* -------------------------- */
 
renderJobList();
updateDailyTotal();
showDashboard();
