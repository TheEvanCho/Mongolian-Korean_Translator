import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers";

let translator;
let deepThinking = false;

const app = document.getElementById("app");
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

let mode = "한국어 → Монгол";

const targetMap = {
  "한국어 → Монгол": "khk_Cyrl",
  "Монгол → 한국어": "kor_Hang",
};

/* =========================
   LOAD MODEL
========================= */
async function loadTranslator() {
  try {
    transcript.textContent = "Loading translator...";
    console.log("Loading model...");

    translator = await pipeline(
      "translation",
      "Xenova/nllb-200-distilled-600M",
    );

    console.log("Loaded!", translator);
    transcript.textContent = "Ready ✨";
  } catch (err) {
    console.error(err);
    transcript.textContent = "FAILED";
  }
}

loadTranslator();

/* =========================
   UI OPEN
========================= */
keyboardBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  inputPanel.classList.add("show");
  horizon.classList.add("raise");

  transcript.style.visibility = "hidden";
  inputBox.focus();
});

/* =========================
   DEEP THINKING TOGGLE
========================= */
deepBtn.addEventListener("click", () => {
  deepThinking = !deepThinking;

  deepBtn.classList.toggle("active", deepThinking);
  deepBtn.textContent = deepThinking ? "🧠 Deep ON" : "🧠 Deep OFF";
});

/* =========================
   TRANSLATE CORE
========================= */
translateBtn.addEventListener("click", async () => {
  if (!translator) {
    transcript.textContent = "Translator model not available.";
    return;
  }

  const text = inputBox.value.trim();
  if (!text) return;

  const tgt_lang = targetMap[mode];

  line.classList.add("loading");
  translated.textContent = "";
  transcript.textContent = text;

  translateBtn.disabled = true;
  keyboardBtn.disabled = true;

  try {
    await new Promise((r) => setTimeout(r, 30));

    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");
    inputBox.blur();

    await new Promise(requestAnimationFrame);
    await new Promise((r) => setTimeout(r, 300));

    let finalText = text;

    /* =========================
       🧠 DEEP THINKING MODE
    ========================= */
    if (deepThinking) {
      // Step 1: input → English
      const toEnglish = await translator(text, {
        tgt_lang: "eng_Latn",
      });

      const english = toEnglish[0].translation_text;

      // Step 2: English → target
      const finalResult = await translator(english, {
        tgt_lang,
      });

      finalText = finalResult[0].translation_text;
    } else {
      // Direct translation
      const result = await translator(text, {
        tgt_lang,
      });

      finalText = result[0].translation_text;
    }

    translated.textContent = finalText;

    inputBox.value = "";
    transcript.style.visibility = "visible";
    transcript.textContent = "";

    line.style.background = "rgba(56,189,248,.45)";
    line.style.boxShadow = "0 0 12px rgba(56,189,248,.25)";
  } catch (err) {
    console.error(err);

    transcript.textContent = "Translation failed.";
    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");

    inputBox.value = "";
    transcript.style.visibility = "visible";

    line.style.background = "#EF4444";
    line.style.boxShadow = "0 0 12px #EF4444";
  } finally {
    line.classList.remove("loading");
    translateBtn.disabled = false;
    keyboardBtn.disabled = false;
  }
});

/* =========================
   ENTER KEY
========================= */
inputBox.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter" || e.shiftKey) return;

  e.preventDefault();
  translateBtn.click();
});

/* =========================
   CLOSE PANEL ON CLICK OUTSIDE
========================= */
document.addEventListener("click", (e) => {
  if (!inputPanel.contains(e.target) && !keyboardBtn.contains(e.target)) {
    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");
    transcript.style.visibility = "visible";
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
    mode = mode === "한국어 → Монгол" ? "Монгол → 한국어" : "한국어 → Монгол";

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
