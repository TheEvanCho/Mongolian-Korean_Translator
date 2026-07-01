
    import {pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';
    let translator;

    const app = document.getElementById("app");
    const keyboardBtn = document.getElementById("keyboardBtn");
    const transcript = document.getElementById("transcript");
    const translated = document.getElementById("translated");
    const swap = document.getElementById("swap");
    const swapText = document.getElementById("swapText");
    const line = document.getElementById("line");

    const inputPanel = document.getElementById("inputPanel");
    const inputBox = document.getElementById("inputBox");
    const translateBtn = document.getElementById("translateBtn");


    let mode = "한국어 → Монгол";

    async function loadTranslator() {

                try {

        transcript.textContent = "Loading translator...";
    console.log("Loading model...");

    translator = await pipeline(
    "translation",
    "Xenova/nllb-200-distilled-600M"
    );

    console.log("Loaded!", translator);

    transcript.textContent = "Ready ✨";

                } catch (err) {

        console.error(err);

    transcript.textContent = "FAILED";

                }
            }

    async function init() {
        await loadTranslator();
            }

    init();
        /* =========================
           CLICK CONTROL
        ========================= */
        keyboardBtn.addEventListener("click", (e) => {

        e.stopPropagation();

    inputPanel.classList.add("show");

    transcript.style.visibility = "hidden";

    inputBox.focus();
            });
 
            translateBtn.addEventListener("click", async () => {

                    if (!translator) return;

    const text = inputBox.value.trim();

    if (!text) return;

    line.classList.add("loading");

    translated.textContent = "";

    transcript.textContent = text;

    translateBtn.disabled = true;
    keyboardBtn.disabled = true;
    try {
        line.classList.add("loading");

                    await new Promise(resolve => setTimeout(resolve, 30));

    // close keyboard FIRST
    inputPanel.classList.remove("show");
    inputBox.blur();

    // allow the CSS animation to start
    await new Promise(requestAnimationFrame);
                    await new Promise(resolve => setTimeout(resolve, 350));

    // now start translating
    const result = await translator(text, {
        src_lang: mode === "한국어 → Монгол"
    ? "kor_Hang"
    : "khk_Cyrl",

    tgt_lang: mode === "한국어 → Монгол"
    ? "khk_Cyrl"
    : "kor_Hang"
                    });

    translated.textContent = result[0].translation_text;

    inputBox.value = "";

    transcript.style.visibility = "visible";
    transcript.textContent = "";

    line.style.background = "rgba(56,189,248,.45)";
    line.style.boxShadow = "0 0 12px rgba(56,189,248,.25)";

                }
    catch (err) {

        console.error(err);

    transcript.textContent = "Translation failed.";
    inputPanel.classList.remove("show");
    inputBox.value = "";
    transcript.style.visibility = "visible";
    line.style.background = "#EF4444";
    line.style.boxShadow = "0 0 12px #EF4444";

                }
    finally {

        line.classList.remove("loading");
    translateBtn.disabled = false;
    keyboardBtn.disabled = false;

                }


                });

                inputBox.addEventListener("keydown", async (e) => {

                        if (e.key !== "Enter" || e.shiftKey) return;

    e.preventDefault();

    translateBtn.click();
                    });

                document.addEventListener("click", (e) => {

                        if (!inputPanel.contains(e.target) &&
    !keyboardBtn.contains(e.target)) {

        inputPanel.classList.remove("show");
    transcript.style.visibility = "visible";
                        }
                    });
        /* =========================
           MODE SWAP (UNCHANGED UI)
        ========================= */
        swap.addEventListener("click", (e) => {
        e.stopPropagation();

    swapText.style.transform = "scaleX(0)";
    swapText.style.opacity = "0";

            setTimeout(() => {
        mode = (mode === "한국어 → Монгол")
            ? "Монгол → 한국어"
            : "한국어 → Монгол";

    swapText.textContent = mode;

    swapText.style.transform = "scaleX(1)";
    swapText.style.opacity = "1";
            }, 180);
        });

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registered!"));

        }