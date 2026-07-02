let entries = [];

let stepMode = 15;

function vibrate(){

if(navigator.vibrate){

navigator.vibrate(10);

}

}

function toggleMode(){

vibrate();

stepMode =
stepMode === 15 ? 1 : 15;

document.getElementById("modeBtn").innerText =
stepMode === 15
? "15 MIN MODE"
: "1 MIN MODE";

render();

}

function addEntry(){

vibrate();

const previous =
entries[entries.length-1];

entries.push({

id:Date.now()+Math.random(),

start:previous?.end || "",

end:""

});

save();

render();

}

function removeEntry(id){

if(entries.length===1)
return;

vibrate();

entries =
entries.filter(e=>e.id!==id);

save();

render();

}

function clearEntry(id){

const e =
entries.find(x=>x.id===id);

e.start="";
e.end="";

save();

render();

}

function formatRuntime(ms){

const h =
Math.floor(ms/3600000);

const m =
Math.floor(
(ms%3600000)/60000
);

return `${h}h ${m}m`;

}

function getDuration(start,end){

if(!start || !end)
return 0;

let s =
new Date("2025-01-01T"+start);

let e =
new Date("2025-01-01T"+end);

let diff = e - s;

if(diff < 0)
diff += 86400000;

if(stepMode===15){

let mins =
Math.round(
(diff/60000)/15
)*15;

diff =
mins*60000;

}

return diff;

}

function calculate(){

let total=0;

entries.forEach(entry=>{

total +=
getDuration(
entry.start,
entry.end
);

});

const hours =
Math.floor(total/3600000);

const minutes =
Math.floor(
(total%3600000)/60000
);

const decimal =
total/3600000;

const quarter =
Math.round(decimal*4)/4;

document.getElementById("total").innerText =
`${hours}h ${minutes}m`;

document.getElementById("decimal").innerText =
`${decimal.toFixed(2)} Hours`;

document.getElementById("quarter").innerText =
`Quarter: ${quarter.toFixed(2)}`;

document.getElementById("fill").style.width =
Math.min(
(decimal/16)*100,
100
)+"%";

}

function render(){

const container =
document.getElementById("entries");

container.innerHTML="";

entries.forEach(entry=>{

let runtime =
getDuration(
entry.start,
entry.end
);

container.innerHTML += `

<div class="card">

<div class="fieldLabel">
START
</div>

<button
class="timeButton"
onclick="openTimePicker('${entry.id}','start')">

${entry.start || "Set Start"}

</button>

<div class="fieldLabel">
END
</div>

<button
class="timeButton"
onclick="openTimePicker('${entry.id}','end')">

${entry.end || "Set End"}

</button>

<div class="runtime">

${runtime ? formatRuntime(runtime) : "--"}

</div>

<div class="row">

<button
class="primary"
onclick="startNow('${entry.id}')">

Start Now

</button>

<button
class="primary"
onclick="endNow('${entry.id}')">

End Now

</button>

</div>

<div class="row">

<button
class="secondary"
onclick="clearEntry('${entry.id}')">

Clear

</button>

<button
class="danger"
onclick="removeEntry('${entry.id}')">

Delete

</button>

</div>

</div>

`;

});

calculate();

save();

}

function startNow(id){

const e =
entries.find(x=>x.id==id);

e.start =
currentTime();

save();

render();

}

function endNow(id){

const e =
entries.find(x=>x.id==id);

e.end =
currentTime();

save();

render();

}

function currentTime(){

let now =
new Date();

if(stepMode===15){

let mins =
Math.round(
now.getMinutes()/15
)*15;

if(mins===60){

now.setHours(
now.getHours()+1
);

mins=0;

}

now.setMinutes(
mins,
0,
0
);

}

return
String(now.getHours()).padStart(2,'0')
+
":"
+
String(now.getMinutes()).padStart(2,'0');

}

function openTimePicker(id,field){

alert(
"Custom iOS wheel picker coming in Phase 2."
);

}

function save(){

localStorage.setItem(
"runtime",
JSON.stringify(entries)
);

}

function load(){

const saved =
localStorage.getItem("runtime");

if(saved){

entries =
JSON.parse(saved);

}

if(entries.length===0){

entries.push({

id:Date.now(),

start:"",
end:""

});

}

render();

}

load();
