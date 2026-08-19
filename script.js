// ==========================================
// 🎰 RAD CONFIGURATIE & VAKJES
// ==========================================
// type:
//  - 'mult': Inzet vermenigvuldigen (bijv. 2x, 3x, 10x JACKPOT)
//  - 'fixed': Vast bonusbedrag
//  - 'task': Kamp opdracht voor de speler
//  - 'bankrupt': Inzet verloren (Bankroet)
const segments = [
  { label: "⭐ JACKPOT 10X ⭐", color: "#f1c40f", textColor: "#000", type: "mult", val: 10, highlight: true },
  { label: "BANKROET",          color: "#c0392b", textColor: "#fff", type: "bankrupt" },
  { label: "3X WINST",          color: "#2ecc71", textColor: "#fff", type: "mult", val: 3 },
  { label: "ZING EEN CASINO LIED", color: "#8e44ad", textColor: "#fff", type: "task" },
  { label: "2X WINST",          color: "#27ae60", textColor: "#fff", type: "mult", val: 2 },
  { label: "+100 FICHES BONUS", color: "#2980b9", textColor: "#fff", type: "fixed", val: 100 },
  { label: "15 PUSH-UPS",       color: "#d35400", textColor: "#fff", type: "task" },
  { label: "5X MEGA WIN",       color: "#e67e22", textColor: "#fff", type: "mult", val: 5, highlight: true },
  { label: "BANKROET",          color: "#962d22", textColor: "#fff", type: "bankrupt" },
  { label: "TRAKTEER DE LEIDING", color: "#16a085", textColor: "#fff", type: "task" },
  { label: "2X WINST",          color: "#2ecc71", textColor: "#fff", type: "mult", val: 2 },
  { label: "DRAAI OPNIEUW GRATIS", color: "#34495e", textColor: "#fff", type: "task" }
];

// ==========================================
// ⚙️ STATE MANAGEMENT
// ==========================================
let currentBet = 50;
let currentRotation = 0;
let isSpinning = false;
let lastSegmentIndex = -1;
let historyRecords = [];

// DOM Elementen
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const betInput = document.getElementById("customBetInput");
const pointer = document.getElementById("pointer");
const ledRing = document.getElementById("ledRing");
const resultBanner = document.getElementById("resultBanner");
const resultTag = document.getElementById("resultTag");
const resultTitle = document.getElementById("resultTitle");
const resultPayout = document.getElementById("resultPayout");
const historyList = document.getElementById("historyList");

const numSegments = segments.length;
const arcSize = (2 * Math.PI) / numSegments;

// ==========================================
// 💡 LED VERLICHTING RONDOM GENEREREN
// ==========================================
const totalLeds = 24;
const ledsArray = [];

function buildLedRing() {
  const radius = 265; // Straal van de casing
  for (let i = 0; i < totalLeds; i++) {
    const led = document.createElement("div");
    led.className = "led-bulb";
    const angle = (i / totalLeds) * (2 * Math.PI);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    led.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    ledRing.appendChild(led);
    ledsArray.push(led);
  }
}

// LED Looplicht animatie
let ledStep = 0;
setInterval(() => {
  if (isSpinning) {
    // Snel flitsen tijdens draaien
    ledsArray.forEach((led, idx) => {
      led.classList.toggle("off", (idx + ledStep) % 2 === 0);
    });
    ledStep++;
  } else {
    // Rustige casino pulse
    ledsArray.forEach((led, idx) => {
      led.classList.toggle("off", (idx + Math.floor(Date.now() / 300)) % 3 === 0);
    });
  }
}, 70);

// ==========================================
// 🔊 SOUND EFFECTS (Web Audio API Synthesizer)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound(speedRatio) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "sine";
  const freq = 400 + (1 - speedRatio) * 400; // Pitch daalt naarmate het rad vertraagt
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.03);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function playWinSound(isJackpot) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = isJackpot 
    ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // Grand Arpeggio
    : [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const startTime = audioCtx.currentTime + idx * 0.09;
    
    osc.type = isJackpot ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
}

function playBustSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.35);

  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

// ==========================================
// 🎨 HET RAD TEKENEN OP HET CANVAS
// ==========================================
function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  segments.forEach((seg, i) => {
    const angle = currentRotation + (i * arcSize);

    // Taartpunt
    ctx.beginPath();
    ctx.fillStyle = seg.color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 8, angle, angle + arcSize);
    ctx.lineTo(radius, radius);
    ctx.fill();

    // Gouden scheidingslijnen
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffd700";
    ctx.stroke();

    // Tekst positioneren en roteren
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = seg.textColor || "#ffffff";
    ctx.font = seg.highlight ? "900 16px 'Montserrat'" : "800 13px 'Montserrat'";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 5;
    ctx.fillText(seg.label, radius - 35, 5);
    ctx.restore();
  });

  // Buitenste gouden metalen ring
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#f5af19";
  ctx.stroke();
}

// ==========================================
// 💰 INZET BEHEER & CHIPS
// ==========================================
function setBet(amount) {
  if (isSpinning) return;
  currentBet = amount;
  betInput.value = currentBet;
  updateChipActiveState();
}

function multiplyBet(multiplier) {
  if (isSpinning) return;
  currentBet = Math.max(5, Math.round(currentBet * multiplier));
  betInput.value = currentBet;
  updateChipActiveState();
}

function clearBet() {
  if (isSpinning) return;
  currentBet = 50;
  betInput.value = currentBet;
  updateChipActiveState();
}

betInput.addEventListener("input", (e) => {
  currentBet = Math.max(1, parseInt(e.target.value) || 0);
  updateChipActiveState();
});

function updateChipActiveState() {
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.remove("active");
    if (parseInt(chip.innerText) === currentBet || (chip.innerText === "1K" && currentBet === 1000)) {
      chip.classList.add("active");
    }
  });
}

// ==========================================
// 🎡 HET RAD LATEN DRAAIEN
// ==========================================
function spinWheel() {
  if (isSpinning) return;
  if (!currentBet || currentBet <= 0) {
    alert("Geef eerst een geldige inzet op!");
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  resultBanner.style.transform = "scale(0.98)";
  resultTag.innerText = "RAD IS IN BEWEGING...";
  resultTitle.innerText = "WAAR STOPT HIJ?";
  resultPayout.innerText = `Inzet: ${currentBet} fiches op tafel`;

  // 8 tot 11 volledige omwentelingen + willekeurig segment
  const spinRounds = Math.PI * 2 * (8 + Math.random() * 3);
  const startRotation = currentRotation;
  const targetRotation = startRotation + spinRounds;
  const duration = 5200; // 5.2 seconden
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Super smooth Ease-Out Quintic
    const easeOut = 1 - Math.pow(1 - progress, 5);
    currentRotation = startRotation + (spinRounds * easeOut);

    // Geluidseffect en flipper-animatie per segment
    const currentPointerSeg = getWinningIndex();
    if (currentPointerSeg !== lastSegmentIndex) {
      playClickSound(progress);
      pointer.style.transform = "rotate(-25deg)";
      setTimeout(() => { pointer.style.transform = "rotate(0deg)"; }, 50);
      lastSegmentIndex = currentPointerSeg;
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      resultBanner.style.transform = "scale(1)";
      handleOutcome(segments[getWinningIndex()]);
    }
  }

  requestAnimationFrame(animate);
}

function getWinningIndex() {
  const normalized = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const pointerAngle = (1.5 * Math.PI - normalized + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(pointerAngle / arcSize);
}

// ==========================================
// 🏆 UITSLAG VERWERKEN & DEALER BEREKENING
// ==========================================
function handleOutcome(seg) {
  let logText = "";
  let logClass = "";

  if (seg.type === "mult") {
    const totalPayout = currentBet * seg.val;
    const profit = totalPayout - currentBet;
    const isJackpot = seg.val >= 5;

    resultTag.innerText = isJackpot ? "🔥 MEGA JACKPOT WINNAAR! 🔥" : "🎉 GEFELICITEERD! WINNAAR!";
    resultTag.style.color = "#00ff88";
    resultTitle.innerText = `${seg.label}`;
    resultPayout.innerHTML = `BETAAL UIT: <strong style="color:#00ff88; font-size:1.4rem;">${totalPayout} FICHES</strong> (+${profit} winst)`;
    
    playWinSound(isJackpot);
    triggerConfetti(isJackpot ? 150 : 80);

    logText = `WINST: ${seg.label} ➔ ${totalPayout} fiches`;
    logClass = "color: #00ff88;";

  } else if (seg.type === "fixed") {
    const totalPayout = currentBet + seg.val;
    resultTag.innerText = "🎁 BONUS VAKJE!";
    resultTag.style.color = "#2980b9";
    resultTitle.innerText = `+${seg.val} BONUS FICHES`;
    resultPayout.innerHTML = `BETAAL UIT: <strong>${totalPayout} FICHES</strong> (inzet + ${seg.val} gratis)`;

    playWinSound(false);
    triggerConfetti(60);

    logText = `BONUS: +${seg.val} ➔ ${totalPayout} fiches`;
    logClass = "color: #3498db;";

  } else if (seg.type === "bankrupt") {
    resultTag.innerText = "💀 HUIS WINT ALLES!";
    resultTag.style.color = "#ff1e56";
    resultTitle.innerText = "BANKROET / VERLOREN";
    resultPayout.innerText = `De bank neemt de inzet van ${currentBet} fiches in beslag.`;

    playBustSound();

    logText = `BANKROET (-${currentBet} fiches)`;
    logClass = "color: #ff1e56;";

  } else if (seg.type === "task") {
    resultTag.innerText = "🎭 SPECIALE OPDRACHT!";
    resultTag.style.color = "#f39c12";
    resultTitle.innerText = seg.label;
    resultPayout.innerText = `Inzet blijft staan tot de opdracht succesvol is voldaan!`;

    playWinSound(false);

    logText = `OPDRACHT: ${seg.label}`;
    logClass = "color: #f39c12;";
  }

  // Toevoegen aan geschiedenis
  addToHistory(logText, logClass);
}

// ==========================================
// 📜 GESCHIEDENIS LOGBOEK
// ==========================================
function addToHistory(text, style) {
  if (historyRecords.length === 0) {
    historyList.innerHTML = "";
  }

  historyRecords.unshift({ text, style });
  if (historyRecords.length > 5) historyRecords.pop();

  historyList.innerHTML = historyRecords
    .map(item => `<li class="history-item" style="${item.style}"><span>${item.text}</span></li>`)
    .join("");
}

// ==========================================
// 🎊 CONFETTI EXPLOSIE
// ==========================================
function triggerConfetti(particleCount) {
  confetti({
    particleCount: particleCount,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ffd700', '#ffffff', '#ff1e56', '#00ff88', '#00d4ff']
  });
}

// Eerste initialisatie
buildLedRing();
drawWheel();
