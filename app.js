let entries = [];
let stepMode = 15;

let pickerId = null;
let pickerField = null;

let pickerHour = 0;
let pickerMinute = 0;

function vibrate() {

    if (navigator.vibrate) {
        navigator.vibrate(10);
    }

}

function toggleMode() {

    vibrate();

    stepMode = stepMode === 15 ? 1 : 15;

    document.getElementById("modeBtn").innerText =
        stepMode === 15
            ? "15 MIN MODE"
            : "1 MIN MODE";

    render();

}

function addEntry() {

    vibrate();

    let previous =
        entries[entries.length - 1];

    entries.push({

        id: Date.now() + Math.random(),

        start: previous?.end || "",

        end: ""

    });

    save();
    render();

}

function removeEntry(id) {

    if (entries.length === 1) return;

    vibrate();

    entries =
        entries.filter(e => e.id != id);

    save();
    render();

}

function clearEntry(id) {

    vibrate();

    let e =
        entries.find(x => x.id == id);

    if (!e) return;

    e.start = "";
    e.end = "";

    save();
    render();

}

function formatRuntime(ms) {

    let h =
        Math.floor(ms / 3600000);

    let m =
        Math.floor(
            (ms % 3600000) / 60000
        );

    return `${h}h ${m}m`;

}

function getDuration(start, end) {

    if (!start || !end) return 0;

    let s =
        new Date("2025-01-01T" + start);

    let e =
        new Date("2025-01-01T" + end);

    let diff = e - s;

    if (diff < 0)
        diff += 86400000;

    if (stepMode === 15) {

        let mins =
            Math.round(
                (diff / 60000) / 15
            ) * 15;

        diff =
            mins * 60000;

    }

    return diff;

}

function calculate() {

    let total = 0;

    entries.forEach(entry => {

        total +=
            getDuration(
                entry.start,
                entry.end
            );

    });

    let hours =
        Math.floor(total / 3600000);

    let minutes =
        Math.floor(
            (total % 3600000) / 60000
        );

    let decimal =
        total / 3600000;

    let quarter =
        Math.round(decimal * 4) / 4;

    document.getElementById("total").innerText =
        `${hours}h ${minutes}m`;

    document.getElementById("decimal").innerText =
        `${decimal.toFixed(2)} Hours`;

    document.getElementById("quarter").innerText =
        `Quarter: ${quarter.toFixed(2)}`;

    document.getElementById("fill").style.width =
        Math.min(
            (decimal / 16) * 100,
            100
        ) + "%";

    let status =
        document.getElementById("status");

    if (decimal < 8) {

        status.innerText =
            "Normal Shift";

        status.className =
            "statusNormal";

    }
    else if (decimal < 12) {

        status.innerText =
            "Extended Shift";

        status.className =
            "statusExtended";

    }
    else {

        status.innerText =
            "Long Day";

        status.className =
            "statusLong";

    }

}

function currentTime() {

    let now = new Date();

    if (stepMode === 15) {

        let mins =
            Math.round(
                now.getMinutes() / 15
            ) * 15;

        if (mins === 60) {

            now.setHours(
                now.getHours() + 1
            );

            mins = 0;

        }

        now.setMinutes(
            mins,
            0,
            0
        );

    }

    return (
        String(now.getHours())
            .padStart(2, "0")
        +
        ":"
        +
        String(now.getMinutes())
            .padStart(2, "0")
    );

}

function startNow(id) {

    vibrate();

    let e =
        entries.find(x => x.id == id);

    e.start =
        currentTime();

    save();
    render();

}

function endNow(id) {

    vibrate();

    let e =
        entries.find(x => x.id == id);

    e.end =
        currentTime();

    save();
    render();

}

/* ===========================
   IOS WHEEL PICKER
=========================== */

function openTimePicker(id, field) {

    pickerId = id;
    pickerField = field;

    let entry =
        entries.find(
            x => x.id == id
        );

    let value =
        entry[field] || "08:00";

    let parts =
        value.split(":");

    pickerHour =
        parseInt(parts[0]);

    pickerMinute =
        parseInt(parts[1]);

    buildWheel();

    document
        .getElementById("pickerOverlay")
        .style.display = "flex";

    vibrate();

}

function buildWheel() {

    const hourWheel =
        document.getElementById("hourWheel");

    const minuteWheel =
        document.getElementById("minuteWheel");

    hourWheel.innerHTML = "";
    minuteWheel.innerHTML = "";

    for (let h = 0; h < 24; h++) {

        hourWheel.innerHTML +=
            `<div class="wheelItem">${String(h).padStart(2, "0")}</div>`;

    }

    if (stepMode === 15) {

        [0, 15, 30, 45]
            .forEach(m => {

                minuteWheel.innerHTML +=
                    `<div class="wheelItem">${String(m).padStart(2, "0")}</div>`;

            });

    }
    else {

        for (let m = 0; m < 60; m++) {

            minuteWheel.innerHTML +=
                `<div class="wheelItem">${String(m).padStart(2, "0")}</div>`;

        }

    }

    setTimeout(() => {

        hourWheel.scrollTop =
            pickerHour * 60;

        minuteWheel.scrollTop =
            (
                stepMode === 15
                    ? [0, 15, 30, 45].indexOf(pickerMinute)
                    : pickerMinute
            ) * 60;

        highlightActive();

    }, 60);

    hourWheel.onscroll =
        updateWheelSelection;

    minuteWheel.onscroll =
        updateWheelSelection;

}

function updateWheelSelection() {

    const hourWheel =
        document.getElementById("hourWheel");

    const minuteWheel =
        document.getElementById("minuteWheel");

    pickerHour =
        Math.max(
            0,
            Math.min(
                23,
                Math.round(
                    hourWheel.scrollTop / 60
                )
            )
        );

    if (stepMode === 15) {

        let vals =
            [0, 15, 30, 45];

        pickerMinute =
            vals[
            Math.max(
                0,
                Math.min(
                    3,
                    Math.round(
                        minuteWheel.scrollTop / 60
                    )
                )
            )
            ];

    }
    else {

        pickerMinute =
            Math.max(
                0,
                Math.min(
                    59,
                    Math.round(
                        minuteWheel.scrollTop / 60
                    )
                )
            );

    }

    highlightActive();

}

function highlightActive() {

    document
        .querySelectorAll(
            "#hourWheel .wheelItem"
        )
        .forEach((el, index) => {

            el.classList.toggle(
                "active",
                index === pickerHour
            );

        });

    document
        .querySelectorAll(
            "#minuteWheel .wheelItem"
        )
        .forEach((el, index) => {

            if (stepMode === 15) {

                el.classList.toggle(
                    "active",
                    index ===
                    [0, 15, 30, 45]
                        .indexOf(
                            pickerMinute
                        )
                );

            }
            else {

                el.classList.toggle(
                    "active",
                    index === pickerMinute
                );

            }

        });

}

function closePicker() {

    document
        .getElementById("pickerOverlay")
        .style.display =
        "none";

}

function applyPicker() {

    let value =

        String(pickerHour)
            .padStart(2, "0")

        +

        ":"

        +

        String(pickerMinute)
            .padStart(2, "0");

    let entry =
        entries.find(
            x => x.id == pickerId
        );

    entry[pickerField] =
        value;

    save();

    render();

    closePicker();

    vibrate();

}

/* ===========================
   RENDER
=========================== */

function render() {

    const container =
        document.getElementById("entries");

    container.innerHTML = "";

    entries.forEach(entry => {

        let runtime =
            getDuration(
                entry.start,
                entry.end
            );

        let disableDelete =
            entries.length === 1;

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
${disableDelete ? "disabled" : ""}
onclick="removeEntry('${entry.id}')">

Delete

</button>

</div>

</div>

`;

    });

    calculate();

}

function save() {

    localStorage.setItem(
        "runtime",
        JSON.stringify(entries)
    );

}

function load() {

    const saved =
        localStorage.getItem("runtime");

    if (saved) {

        entries =
            JSON.parse(saved);

    }

    if (entries.length === 0) {

        entries.push({

            id: Date.now(),

            start: "",
            end: ""

        });

    }

    render();

}

load();
