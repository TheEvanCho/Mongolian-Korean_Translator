import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

let translator;
let deepThinking = false;

const keyboardBtn = document.getElementById("keyboardBtn");
const transcript = document.getElementById("transcript");
const translated = document.getElementById("translated");
const swap = document.getElementById("swap");
const swapText = document.getElementById("swapText");
const line = document.getElementById("line");
const horizon = document.getElementById("horizon");

const inputPanel = document.getElementById("inputPanel");
const inputBox = document.getElementById("inputBox");
const translateBtn = document.getElementById("translateBtn");
const deepBtn = document.getElementById("deepBtn");

let mode = "AUTO → Монгол";

const targetMap = {
  "AUTO → Монгол": "khk_Cyrl",
  "AUTO → 한국어": "kor_Hang",
};

/* =========================
   TRANSCRIPT ENGINE
   (NO ANIMATION BLOCKING)
========================= */

function setTranscript(state, text = "") {
  switch (state) {
    case "idle":
      transcript.textContent = "";
      break;

    case "typing":
      transcript.textContent = text;
      break;

    case "waiting":
      transcript.textContent = `${text}\nwait...`;
      break;

    case "done":
      transcript.textContent = text;
      break;

    case "error":
      transcript.textContent = "translation failed.";
      break;
  }
}

/* =========================
   LOAD MODEL
========================= */

async function loadTranslator() {
  try {
    setTranscript("typing", "loading translator...");

    translator = await pipeline(
      "translation",
      "Xenova/nllb-200-distilled-600M",
    );

    setTranscript("typing", "ready ✨");
  } catch (err) {
    console.error(err);
    setTranscript("error");
  }
}

loadTranslator();

/* =========================
   OPEN INPUT
========================= */

keyboardBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  inputPanel.classList.add("show");
  horizon.classList.add("raise");

  setTranscript("idle"); // clean reset

  inputBox.focus();
});

/* =========================
   DEEP THINK TOGGLE
========================= */

deepBtn.addEventListener("click", () => {
  deepThinking = !deepThinking;
  deepBtn.classList.toggle("active", deepThinking);
});

/* =========================
   TRANSLATE CORE
   (IMPORTANT: NO ANIMATION STALL)
========================= */

translateBtn.addEventListener("click", async () => {
  if (!translator) return;

  const text = inputBox.value.trim();
  if (!text) return;

  const tgt_lang = targetMap[mode];

  // UI update ONLY (no blocking animation logic here)
  setTranscript("waiting", text);

  translated.textContent = "";
  translateBtn.disabled = true;
  keyboardBtn.disabled = true;

  try {
    // close UI quickly (no animation dependency)
    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");
    inputBox.blur();

    // let UI paint BEFORE model runs
    await new Promise(requestAnimationFrame);

    let finalText = text;

    /* =========================
       🧠 DEEP THINK MODE
    ========================= */
    if (deepThinking) {
      const toEnglish = await translator(text, {
        tgt_lang: "eng_Latn",
      });

      const english = toEnglish[0].translation_text;

      const finalResult = await translator(english, {
        tgt_lang,
      });

      finalText = finalResult[0].translation_text;
    } else {
      const result = await translator(text, {
        tgt_lang,
      });

      finalText = result[0].translation_text;
    }

    translated.textContent = finalText;

    inputBox.value = "";
    setTranscript("done", finalText);
  } catch (err) {
    console.error(err);
    setTranscript("error");
  } finally {
    translateBtn.disabled = false;
    keyboardBtn.disabled = false;
  }
});

/* =========================
   ENTER KEY
========================= */

inputBox.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.shiftKey) return;

  e.preventDefault();
  translateBtn.click();
});

/* =========================
   CLOSE ON OUTSIDE CLICK
========================= */

document.addEventListener("click", (e) => {
  if (!inputPanel.contains(e.target) && !keyboardBtn.contains(e.target)) {
    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");

    setTranscript("idle");
  }
});

/* =========================
   MODE SWAP
========================= */

swap.addEventListener("click", (e) => {
  e.stopPropagation();

  swapText.style.transform = "scaleX(0)";
  swapText.style.opacity = "0";

  setTimeout(() => {
    mode = mode === "AUTO → Монгол" ? "AUTO → 한국어" : "AUTO → Монгол";

    swapText.textContent = mode;

    swapText.style.transform = "scaleX(1)";
    swapText.style.opacity = "1";
  }, 180);
});

/* =========================
   SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered!"));
}
