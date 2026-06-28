
    import {pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';
    let translator;

        /* =========================
           STATE
        ========================= */
        //let isRecording = false;
        //let stopRequested = false;

        //let mediaStream;
        //let recorder;
        //let chunks = [];

        //const RECORD_CHUNK_MS = 250;
        //const BUFFER_SECONDS = 8;
        //const TRANSCRIBE_EVERY_MS = 1000;

        //const rollingChunks = [];

        //const audioContext = new AudioContext({sampleRate: 16000 });
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


    //let fullTranscriptWords = [];   //only show MAX_WORDS number of words in the transcript to make it look cleaner
    //const MAX_WORDS = 10;

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

        // for testing: array of words
        //const fakeWords = [
        //    "hello", "testing", "audio", "microphone", "translation",
        //    "banana", "airplane", "sky", "cloud", "signal",
        //    "neural", "speech", "whisper", "chunk", "stream",
        //    "korean", "mongolian", "latency", "pipeline", "flutter",
        //    "I am", "lorem ipsum", "openai", "mongolian", "korean", "translate"
            //];

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

        //let whisperTimer;
        //let whisperBusy = false;

        /*
        function startWhisperLoop() {

        whisperTimer = setInterval(async () => {
            if (whisperBusy) return;
            if (rollingChunks.length === 0) return;

            whisperBusy = true;

            try {

                const blob = new Blob(
                    [...rollingChunks],
                    { type: "audio/webm" }
                );

                const text = await runWhisper(blob);

                console.log("rolling whisper:", text);

                transcript.textContent = text;

            } finally {
                whisperBusy = false;
            }

        }, TRANSCRIBE_EVERY_MS);
            }

    */
        /* =========================
           MIC ENGINE
        ========================= */
        /*async function startMicLoop() {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

    recorder = new MediaRecorder(mediaStream);

                recorder.ondataavailable = (e) => {

                if (!e.data.size) return;

    console.log(
    "chunk",
    e.data.size,
    "bytes"
    );

    rollingChunks.push(e.data);

    const maxChunks =
    BUFFER_SECONDS * (1000 / RECORD_CHUNK_MS);

                while (rollingChunks.length > maxChunks) {
        rollingChunks.shift();
                }

    console.log(
    "rolling chunks:",
    rollingChunks.length
    );
            };

    recorder.start(RECORD_CHUNK_MS);

    startWhisperLoop();
            }

    */

        /* function playAndRepeat(blob) {  //blobbbbbb
                const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

                audio.onended = () => {
        URL.revokeObjectURL(url);

    if (isRecording) {
        runCycle();
                    }
                };

                audio.play().catch(err => {
        console.log("Playback interrupted:", err);
                });
            } */

            /*
            function stopMicLoop() {

        isRecording = false;

    clearInterval(whisperTimer);

    recorder?.stop();

    mediaStream?.getTracks()
                    .forEach(t => t.stop());

    rollingChunks.length = 0;
            }

    */

            /*
        async function runWhisper(blob) {

            const arrayBuffer = await blob.arrayBuffer();

    let audioBuffer;
    try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            } catch (e) {
        console.log("decode failed", e);
    return "";
            }

    const samples = audioBuffer.getChannelData(0);

    let energy = 0;

    for (let i = 0; i < samples.length; i++) {
        energy += Math.abs(samples[i]);
            }

    energy /= samples.length;

    console.log(
    "seconds:",
    (samples.length / 16000).toFixed(1),
    "energy:",
    energy
    );

    if (energy < 0.003) {
        console.log("silence skipped");
    return "";
            }

    if (!samples || samples.length === 0) {
                return "";
            }

    const language =
    mode === "한국어 → Монгол"
    ? "ko"
    : "mn";

    const result = await whisper(samples, {
        language,
        task: "transcribe"
            });

    console.log(result);

    return result.text;
        }
    */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registered!"));

        }