const modes = {
    mnToKr: "mn-kr",
    auto: "auto",
    krToMn: "kr-mn"
};

let mode = modes.mnToKr;

const buttons = {
    mnToKr: document.getElementById("mnToKr"),
    auto: document.getElementById("auto")
};

// reusable setter
function setMode(newMode) {
    mode = newMode;

    Object.values(buttons).forEach(btn => btn.classList.remove("active"));

    if (newMode === modes.mnToKr) buttons.mnToKr.classList.add("active");
    if (newMode === modes.auto) buttons.auto.classList.add("active");

    console.log("Mode switched:", mode);
}

buttons.mnToKr.onclick = () => setMode(modes.mnToKr);
buttons.auto.onclick = () => setMode(modes.auto);