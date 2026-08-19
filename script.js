// ==========================================================
// 🎰 RAD VAKJES CONFIGURATIE (Pas hier eenvoudig teksten aan)
// ==========================================================
const segments = [
  { label: "⭐ JACKPOT 10X ⭐", color1: "#ffd700", color2: "#b8860b", text: "#000", type: "mult", val: 10, special: true },
  { label: "BANKROET",          color1: "#990000", color2: "#550000", text: "#fff", type: "bust" },
  { label: "3X WINST",          color1: "#27ae60", color2: "#196f3d", text: "#fff", type: "mult", val: 3 },
  { label: "ZING EEN CASINO LIED", color1: "#8e44ad", color2: "#5b2c6f", text: "#fff", type: "task" },
  { label: "2X WINST",          color1: "#2ecc71", color2: "#229954", text: "#fff", type: "mult", val: 2 },
  { label: "+100 BONUS",        color1: "#2980b9", color2: "#1f618d", text: "#fff", type: "fixed", val: 100 },
  { label: "15 PUSH-UPS",       color1: "#e67e22", color2: "#a04000", text: "#fff", type: "task" },
  { label: "5X MEGA WIN",       color1: "#e74c3c", color2: "#922b21", text: "#fff", type: "mult", val: 5, special: true },
  { label: "BANKROET",          color1: "#990000", color2: "#550000", text: "#fff", type: "bust" },
  { label: "TRAKTEER LEIDING",  color1: "#16a085", color2: "#117864", text: "#fff", type: "task" },
  { label: "2X WINST",          color1: "#2ecc71", color2: "#229954", text: "#fff", type: "mult", val: 2 },
  { label: "DRAAI OPNIEUW",     color1: "#34495e", color2: "#1a252f", text: "#fff", type: "task" }
];

// ==========================================================
// ⚙️ STATE MANAGEMENT
// ==========================================================
let currentBet = 50;
let currentRotation = 0;
let isSpinning = false;
let lastPassedIndex = -1;
let historyLog = [];

// DOM Elementen
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const betInput = document.getElementById("betAmountInput");
const btnBetLabel = document.getElementById("btnBetLabel");
const bannerStatus = document.getElementById("bannerStatus");
const bannerAmount = document.getElementById("bannerAmount");
const flipper = document.getElementById("flipper");
const spinsLog = document.getElementById("spinsLog");

const totalSegments = segments.length;
const arcAngle = (2 * Math.PI) / totalSegments;

// ==========================================================
// 🔊 SOUND SYNTHESIZER ENGINE (Web Audio API)
// ==========================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound(speedRatio) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Klank wordt lager en droger naarmate het rad vertraagt
  osc.type = "sine";
  const freq = 450 + (1 - speedRatio) * 350;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.035);

  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.035);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.035);
}

function playFanfare(isJackpot) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const melody = isJackpot 
    ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] 
    : [523.25, 659.25, 783.99, 1046.50];

  melody.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const start = audioCtx.currentTime + idx * 0.08;

    osc.type = isJackpot ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.25, start);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

function playBustSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(140, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

// ==========================================================
// 🎨 HIGH-RES RAD TEKENEN OP HET CANVAS
// ==========================================================
function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 18;

  ctx.clearRect(0, 0, size, size);

  // 1. Gouden Buitenring & Verlichting
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius + 12, 0, 2 * Math.PI);
  ctx.fillStyle = "#151003";
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#cca000";
  ctx.stroke();
  ctx.restore();

  // 2. Segmenten Tekenen
  segments.forEach((seg, i) => {
    const angle = currentRotation + (i * arcAngle);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + arcAngle);
    ctx.closePath();

    // Verloop per taartpunt
    const grad = ctx.createRadialGradient(center, center, 40, center, center, radius);
    grad.addColorStop(0, seg.color1);
    grad.addColorStop(1, seg.color2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Scheidingslijnen
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#ffd700";
    ctx.stroke();

    // Tekst positioneren
    ctx.translate(center, center);
    ctx.rotate(angle + arcAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = seg.text;
    ctx.font = seg.special ? "900 19px 'Montserrat'" : "800 15px 'Montserrat'";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 6;
    ctx.fillText(seg.label, radius - 35, 6);
    ctx.restore();
  });

  // 3. Pennen / Spijkers (Pegs) op de rand
  for (let i = 0; i < totalSegments * 2; i++) {
    const pegAngle = currentRotation + (i * (Math.PI / totalSegments));
    const pegX = center + Math.cos(pegAngle) * (radius - 4);
    const pegY = center + Math.sin(pegAngle) * (radius - 4);

    ctx.beginPath();
    ctx.arc(pegX, pegY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#cca000";
    ctx.stroke();
  }
}

// ==========================================================
// 💰 INZET & CHIPS LOGICA
// ==========================================================
function selectChip(amount) {
  if (isSpinning) return;
  setBet(amount);
}

function setBet(amount) {
  currentBet = Math.max(5, amount);
  betInput.value = currentBet;
  btnBetLabel.innerText = currentBet;
  updateActiveChip();
}

function multiplyBet(factor) {
  if (isSpinning) return;
  setBet(Math.round(currentBet * factor));
}

betInput.addEventListener("input", (e) => {
  currentBet = Math.max(1, parseInt(e.target.value) || 0);
  btnBetLabel.innerText = currentBet;
  updateActiveChip();
});

function updateActiveChip() {
  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.innerText) === currentBet) {
      btn.classList.add("active");
    }
  });
}

// ==========================================================
// 🎡 RAD DRAAIEN & ANIMATIE-PHYSICS
// ==========================================================
function triggerSpin() {
  if (isSpinning) return;
  if (!currentBet || currentBet <= 0) {
    alert("Voer een geldige inzet in!");
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  bannerStatus.innerText = "RAD IS IN BEWEGING...";
  bannerStatus.style.color = "#ffd700";
  bannerAmount.innerText = `Inzet: ${currentBet} fiches op tafel`;

  // 8 tot 11 volledige rondes + random offset
  const spinRounds = Math.PI * 2 * (8 + Math.random() * 3);
  const startRotation = currentRotation;
  const duration = 5000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing Quintic voor realistische vertraging
    const easeOut = 1 - Math.pow(1 - progress, 5);
    currentRotation = startRotation + (spinRounds * easeOut);

    // Flipper tik & animatie bij passeren pin/segment
    const currentPointerIndex = getWinningIndex();
    if (currentPointerIndex !== lastPassedIndex) {
      playClickSound(progress);
      flipper.style.transform = "rotate(-24deg)";
      setTimeout(() => { flipper.style.transform = "rotate(0deg)"; }, 45);
      lastPassedIndex = currentPointerIndex;
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      handleSpinResult(segments[getWinningIndex()]);
    }
  }

  requestAnimationFrame(animate);
}

function getWinningIndex() {
  const normalized = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const pointerAngle = (1.5 * Math.PI - normalized + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(pointerAngle / arcAngle);
}

// ==========================================================
// 🏆 UITSLAG VERWERKEN & DEALER INSTRUCTIES
// ==========================================================
function handleSpinResult(seg) {
  let logText = "";
  let logColor = "";

  if (seg.type === "mult") {
    const totalPayout = currentBet * seg.val;
    const profit = totalPayout - currentBet;
    const isJackpot = seg.val >= 5;

    bannerStatus.innerText = isJackpot ? "🔥 MEGA JACKPOT WINNAAR! 🔥" : "🎉 GEFELICITEERD!";
    bannerStatus.style.color = "#00ff88";
    bannerAmount.innerHTML = `BETAAL UIT: <span style="color:#00ff88;">${totalPayout} FICHES</span> (+${profit} winst)`;

    playFanfare(isJackpot);
    triggerConfetti(isJackpot ? 120 : 60);

    logText = `WINST: ${seg.label} ➔ ${totalPayout} fiches`;
    logColor = "#00ff88";

  } else if (seg.type === "fixed") {
    const totalPayout = currentBet + seg.val;
    bannerStatus.innerText = "🎁 BONUS VAKJE!";
    bannerStatus.style.color = "#2980b9";
    bannerAmount.innerHTML = `BETAAL UIT: <span style="color:#2980b9;">${totalPayout} FICHES</span>`;

    playFanfare(false);
    triggerConfetti(50);

    logText = `BONUS: +${seg.val} ➔ ${totalPayout} fiches`;
    logColor = "#3498db";

  } else if (seg.type === "bust") {
    bannerStatus.innerText = "💀 HUIS WINT!";
    bannerStatus.style.color = "#ff2a55";
    bannerAmount.innerText = `Bankroet! Neem ${currentBet} fiches in.`;

    playBustSound();

    logText = `BANKROET (-${currentBet} fiches)`;
    logColor = "#ff2a55";

  } else if (seg.type === "task") {
    bannerStatus.innerText = "🎭 OPDRACHT VOOR DE SPELER!";
    bannerStatus.style.color = "#f39c12";
    bannerAmount.innerText = seg.label;

    playFanfare(false);

    logText = `OPDRACHT: ${seg.label}`;
    logColor = "#f39c12";
  }

  addSpinToHistory(logText, logColor);
}

// ==========================================================
// 📜 LAATSTE SPINS GESCHIEDENIS
// ==========================================================
function addSpinToHistory(text, color) {
  if (historyLog.length === 0) spinsLog.innerHTML = "";

  historyLog.unshift({ text, color });
  if (historyLog.length > 5) historyLog.pop();

  spinsLog.innerHTML = historyLog
    .map(item => `<li class="spin-record" style="color:${item.color}"><span>${item.text}</span></li>`)
    .join("");
}

// ==========================================================
// 🎊 CONFETTI FX
// ==========================================================
function triggerConfetti(count) {
  confetti({
    particleCount: count,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ffd700', '#ffffff', '#00ff88', '#ff2a55']
  });
}

// Initialisatie render
drawWheel();
