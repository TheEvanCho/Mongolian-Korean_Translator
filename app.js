import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

env.allowLocalModels = false;
env.allowRemoteModels = true;

let translator;
let deepThinking = true;

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
const flipBtn = document.getElementById("flipBtn");
let flipped = false;
let mode = "AUTO → Монгол";

const targetMap = {
  "AUTO → Монгол": "khk_Cyrl",
  "AUTO → 한국어": "kor_Hang",
};

const BRAIN_ICON = `<svg
class="deepIcon"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 463 463"
fill="currentColor">
<g transform="translate(231.5 231.5) scale(1.00) translate(-231.5 -231.5)">
<path
  d="M151.245,222.446C148.054,237.039,135.036,248,119.5,248c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5
c23.774,0,43.522-17.557,46.966-40.386c14.556-1.574,27.993-8.06,38.395-18.677c2.899-2.959,2.85-7.708-0.109-10.606
c-2.958-2.897-7.707-2.851-10.606,0.108C184.947,202.829,172.643,208,159.5,208c-26.743,0-48.5-21.757-48.5-48.5
c0-4.143-3.358-7.5-7.5-7.5s-7.5,3.357-7.5,7.5C96,191.715,120.119,218.384,151.245,222.446z"
/>
<path
  d="M183,287.5c0-4.143-3.358-7.5-7.5-7.5c-35.014,0-63.5,28.486-63.5,63.5c0,0.362,0.013,0.725,0.019,1.088
C109.23,344.212,106.39,344,103.5,344c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5c26.743,0,48.5,21.757,48.5,48.5
c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5c0-26.611-16.462-49.437-39.731-58.867c-0.178-1.699-0.269-3.418-0.269-5.133
c0-26.743,21.757-48.5,48.5-48.5C179.642,295,183,291.643,183,287.5z"
/>
<path
  d="M439,223.5c0-17.075-6.82-33.256-18.875-45.156c1.909-6.108,2.875-12.426,2.875-18.844
c0-30.874-22.152-56.659-51.394-62.329C373.841,91.6,375,85.628,375,79.5c0-19.557-11.883-36.387-28.806-43.661
C317.999,13.383,287.162,0,263.5,0c-13.153,0-24.817,6.468-32,16.384C224.317,6.468,212.653,0,199.5,0
c-23.662,0-54.499,13.383-82.694,35.839C99.883,43.113,88,59.943,88,79.5c0,6.128,1.159,12.1,3.394,17.671
C62.152,102.841,40,128.626,40,159.5c0,6.418,0.965,12.735,2.875,18.844C30.82,190.244,24,206.425,24,223.5
c0,13.348,4.149,25.741,11.213,35.975C27.872,270.087,24,282.466,24,295.5c0,23.088,12.587,44.242,32.516,55.396
C56.173,353.748,56,356.626,56,359.5c0,31.144,20.315,58.679,49.79,68.063C118.611,449.505,141.965,463,167.5,463
c27.995,0,52.269-16.181,64-39.674c11.731,23.493,36.005,39.674,64,39.674c25.535,0,48.889-13.495,61.71-35.437
c29.475-9.385,49.79-36.92,49.79-68.063c0-2.874-0.173-5.752-0.516-8.604C426.413,339.742,439,318.588,439,295.5
c0-13.034-3.872-25.413-11.213-36.025C434.851,249.241,439,236.848,439,223.5z M167.5,448c-21.029,0-40.191-11.594-50.009-30.256
c-0.973-1.849-2.671-3.208-4.688-3.751C88.19,407.369,71,384.961,71,359.5c0-3.81,0.384-7.626,1.141-11.344
c0.702-3.447-1.087-6.92-4.302-8.35C50.32,332.018,39,314.626,39,295.5c0-8.699,2.256-17.014,6.561-24.379
C56.757,280.992,71.436,287,87.5,287c4.142,0,7.5-3.357,7.5-7.5s-3.358-7.5-7.5-7.5C60.757,272,39,250.243,39,223.5
c0-14.396,6.352-27.964,17.428-37.221c2.5-2.09,3.365-5.555,2.14-8.574C56.2,171.869,55,165.744,55,159.5
c0-26.743,21.757-48.5,48.5-48.5s48.5,21.757,48.5,48.5c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5
c0-33.642-26.302-61.243-59.421-63.355C104.577,91.127,103,85.421,103,79.5c0-13.369,8.116-24.875,19.678-29.859
c0.447-0.133,0.885-0.307,1.308-0.527C127.568,47.752,131.447,47,135.5,47c12.557,0,23.767,7.021,29.256,18.325
c1.81,3.727,6.298,5.281,10.023,3.47c3.726-1.809,5.28-6.296,3.47-10.022c-6.266-12.903-18.125-22.177-31.782-25.462
C165.609,21.631,184.454,15,199.5,15c13.509,0,24.5,10.99,24.5,24.5v97.051c-6.739-5.346-15.25-8.551-24.5-8.551
c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5c13.509,0,24.5,10.99,24.5,24.5v180.279c-9.325-12.031-22.471-21.111-37.935-25.266
c-3.999-1.071-8.114,1.297-9.189,5.297c-1.075,4.001,1.297,8.115,5.297,9.189C206.8,343.616,224,366.027,224,391.5
C224,422.654,198.654,448,167.5,448z M395.161,339.807c-3.215,1.43-5.004,4.902-4.302,8.35c0.757,3.718,1.141,7.534,1.141,11.344
c0,25.461-17.19,47.869-41.803,54.493c-2.017,0.543-3.716,1.902-4.688,3.751C335.691,436.406,316.529,448,295.5,448
c-31.154,0-56.5-25.346-56.5-56.5c0-2.109-0.098-4.2-0.281-6.271c0.178-0.641,0.281-1.314,0.281-2.012V135.5
c0-13.51,10.991-24.5,24.5-24.5c4.142,0,7.5-3.357,7.5-7.5s-3.358-7.5-7.5-7.5c-9.25,0-17.761,3.205-24.5,8.551V39.5
c0-13.51,10.991-24.5,24.5-24.5c15.046,0,33.891,6.631,53.033,18.311c-13.657,3.284-25.516,12.559-31.782,25.462
c-1.81,3.727-0.256,8.214,3.47,10.022c3.726,1.81,8.213,0.257,10.023-3.47C303.733,54.021,314.943,47,327.5,47
c4.053,0,7.933,0.752,11.514,2.114c0.422,0.22,0.86,0.393,1.305,0.526C351.883,54.624,360,66.13,360,79.5
c0,5.921-1.577,11.627-4.579,16.645C322.302,98.257,296,125.858,296,159.5c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5
c0-26.743,21.757-48.5,48.5-48.5s48.5,21.757,48.5,48.5c0,6.244-1.2,12.369-3.567,18.205c-1.225,3.02-0.36,6.484,2.14,8.574
C417.648,195.536,424,209.104,424,223.5c0,26.743-21.757,48.5-48.5,48.5c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5
c16.064,0,30.743-6.008,41.939-15.879c4.306,7.365,6.561,15.68,6.561,24.379C424,314.626,412.68,332.018,395.161,339.807z"
/>
<path
  d="M359.5,240c-15.536,0-28.554-10.961-31.745-25.554C358.881,210.384,383,183.715,383,151.5c0-4.143-3.358-7.5-7.5-7.5
s-7.5,3.357-7.5,7.5c0,26.743-21.757,48.5-48.5,48.5c-13.143,0-25.447-5.171-34.646-14.561c-2.898-2.958-7.647-3.007-10.606-0.108
s-3.008,7.647-0.109,10.606c10.402,10.617,23.839,17.103,38.395,18.677C315.978,237.443,335.726,255,359.5,255
c4.142,0,7.5-3.357,7.5-7.5S363.642,240,359.5,240z"
/>
<path
  d="M335.5,328c-2.89,0-5.73,0.212-8.519,0.588c0.006-0.363,0.019-0.726,0.019-1.088c0-35.014-28.486-63.5-63.5-63.5
c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5c26.743,0,48.5,21.757,48.5,48.5c0,1.714-0.091,3.434-0.269,5.133
C288.462,342.063,272,364.889,272,391.5c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5c0-26.743,21.757-48.5,48.5-48.5
c4.142,0,7.5-3.357,7.5-7.5S339.642,328,335.5,328z"
/>
</g>
</svg>`;

const SPEED_ICON = `<svg
class="deepIcon"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 329.922 329.922"
fill="currentColor">
 <path d="M281.672,70.216C217.34,5.883,112.662,5.884,48.328,70.217C17.162,101.381,0,142.817,0,186.89
c0,44.072,17.162,85.508,48.328,116.672c5.857,5.857,15.356,5.857,21.213,0c5.857-5.859,5.857-15.356,0-21.214
c-21.928-21.927-35.375-50.072-38.713-80.458H45c8.283,0,15-6.715,15-15c0-8.284-6.717-14.999-15-14.999H30.828
c2.793-25.433,12.674-49.291,28.68-69.252l9.984,9.983c2.928,2.929,6.768,4.394,10.605,4.394c3.84,0,7.678-1.464,10.607-4.394
c5.857-5.857,5.857-15.355,0-21.213l-9.98-9.98c20.422-16.344,44.523-25.889,69.248-28.635V66.86c0,8.284,6.715,15,15,15
c8.283,0,15-6.716,15-15V52.787c24.73,2.736,48.842,12.275,69.273,28.616L239.24,91.409c-5.859,5.858-5.859,15.355,0,21.214
c2.928,2.929,6.768,4.393,10.605,4.393c3.84,0,7.678-1.464,10.607-4.393l10.008-10.009c16.35,20.43,25.896,44.542,28.637,69.276
h-14.096c-8.285,0-15,6.716-15,14.999c0,8.285,6.715,15,15,15h14.096c-3.26,29.414-16.135,57.953-38.639,80.458
c-5.857,5.858-5.857,15.355,0,21.214c2.93,2.928,6.768,4.393,10.607,4.393c3.838,0,7.678-1.465,10.605-4.393
C346.006,239.229,346.006,134.55,281.672,70.216z"/>
<path d="M211.066,277.954h-92.133c-8.283,0-15,6.717-15,15c0,8.286,6.717,15.001,15,15.001h92.133c8.283,0,15-6.715,15-15.001
C226.066,284.671,219.35,277.954,211.066,277.954z"/>
<path d="M165,216.89c10.613,0,19.273-8.274,19.935-18.722l33.098-33.099c5.859-5.858,5.859-15.355,0-21.214
c-5.857-5.857-15.355-5.857-21.213,0l-33.098,33.098c-10.447,0.662-18.723,9.32-18.723,19.934
c-0.002,11.045,8.951,20,19.998,20.002l0,0C164.998,216.89,164.998,216.89,165,216.89z"/> 
</svg>`;
/* =========================
   LOAD MODEL
========================= */
let translatorState = "loading"; // "loading" | "ready" | "failed"

function flashLine(color) {
  line.style.background = color;
  line.style.boxShadow = `0 0 12px ${color}`;

  setTimeout(() => {
    line.style.background = "";
    line.style.boxShadow = "";
  }, 400);
}

async function loadTranslator() {
  try {
    translatorState = "loading";
    keyboardBtn.classList.add("disabled");
    transcript.textContent = "Loading translator...";
    console.log("Loading model...");

    translator = await pipeline(
      "translation",
      "Xenova/nllb-200-distilled-600M",
    );

    console.log("Loaded!", translator);
    translatorState = "ready";
    keyboardBtn.classList.remove("disabled");
    transcript.textContent = "Ready ✨";
  } catch (err) {
    console.error(err);
    translatorState = "failed";
    keyboardBtn.classList.add("disabled");
    transcript.textContent = "FAILED";
  }
}

loadTranslator();

/* =========================
   UI OPEN
========================= */
keyboardBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (translatorState !== "ready") {
    flashLine(translatorState === "failed" ? "#EF4444" : "#FACC15");
    return;
  }

  inputPanel.classList.add("show");
  horizon.classList.add("raise");

  transcript.style.visibility = "hidden";
  transcript.textContent = "";
  inputBox.focus();
});

/* =========================
   DEEP THINKING TOGGLE
========================= */

deepBtn.innerHTML = BRAIN_ICON; // initial icon since deepThinking = true

deepBtn.addEventListener("click", () => {
  deepThinking = !deepThinking;

  deepBtn.innerHTML = deepThinking ? BRAIN_ICON : SPEED_ICON;
});

flipBtn.addEventListener("click", () => {
  flipped = !flipped;
  translated.classList.toggle("flipped", flipped);
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

  // Update the UI first, since the model call below blocks the main thread
  translated.textContent = "";
  transcript.textContent = `Translate: ${text}`;
  keyboardBtn.classList.add("translating");

  translateBtn.disabled = true;
  keyboardBtn.disabled = true;

  try {
    inputPanel.classList.remove("show");
    horizon.classList.remove("raise");
    inputBox.blur();

    // Give the browser a couple frames to actually paint the changes above
    // before the synchronous/blocking translation work starts
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
    transcript.textContent = text;

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
    keyboardBtn.classList.remove("translating");
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
