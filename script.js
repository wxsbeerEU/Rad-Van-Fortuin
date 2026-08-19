// --- CONFIGURATIE VAN DE SEGMENTEN ---
// type: 'mult' (inzet x waarde), 'fixed' (vast bedrag), 'task' (kamp-opdracht), 'bankrupt' (alles kwijt)
const segments = [
  { label: "2X WINST",      color: "#2ecc71", type: "mult", val: 2 },
  { label: "BANKROET",      color: "#e74c3c", type: "bankrupt" },
  { label: "+100 FICHES",   color: "#3498db", type: "fixed", val: 100 },
  { label: "ZING EEN LIED", color: "#9b59b6", type: "task" },
  { label: "5X MEGA WIN",   color: "#f1c40f", type: "mult", val: 5 },
  { label: "10 PUSH-UPS",   color: "#e67e22", type: "task" },
  { label: "3X WINST",      color: "#1abc9c", type: "mult", val: 3 },
  { label: "BEURT VRIJ",    color: "#34495e", type: "task" }
];

// --- STATE MANAGEMENT ---
let balance = 500;
let currentBet = 50;
let currentRotation = 0;
let isSpinning = false;
let lastSegmentIndex = -1;

// --- DOM ELEMENTEN ---
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const balanceEl = document.getElementById("balance");
const currentBetEl = document.getElementById("current-bet");
const btnBetCostEl = document.getElementById("btnBetCost");
const resultModal = document.getElementById("resultModal");
const pointer = document.querySelector(".pointer");

const numSegments = segments.length;
const arcSize = (2 * Math.PI) / numSegments;

// --- AUDIO SYNTHESIZER (Web Audio API - Geen mp3's nodig) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTickSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
  
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

function playWinSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - High C
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.1);
    osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
  });
}

// --- RAD TEKENEN ---
function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  segments.forEach((seg, i) => {
    const angle = currentRotation + (i * arcSize);

    // Taartpunt
    ctx.beginPath();
    ctx.fillStyle = seg.color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 10, angle, angle + arcSize);
    ctx.lineTo(radius, radius);
    ctx.fill();

    // Gouden rand tussen segmenten
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    ctx.stroke();

    // Tekst positioneren
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Montserrat, sans-serif";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.fillText(seg.label, radius - 35, 5);
    ctx.restore();
  });

  // Buitenste gouden ring
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#f5af19";
  ctx.stroke();
}

// --- INZET BEHEREN ---
function adjustBet(amount) {
  if (isSpinning) return;
  const newBet = currentBet + amount;
  if (newBet >= 25 && newBet <= balance) {
    currentBet = newBet;
    currentBetEl.innerText = currentBet;
    btnBetCostEl.innerText = currentBet;
  }
}

// --- SPINNEN & ANIMATIE ---
function spinWheel() {
  if (isSpinning) return;
  if (balance < currentBet) {
    resultModal.style.color = "#ff0055";
    resultModal.innerText = "Niet genoeg fiches! Verlaag je inzet.";
    return;
  }

  // Inzet afschrijven
  balance -= currentBet;
  balanceEl.innerText = balance;
  isSpinning = true;
  spinBtn.disabled = true;
  resultModal.innerText = "Draaien maar...";
  resultModal.style.color = "#fff";

  const spinAngle = Math.random() * (Math.PI * 2) + (Math.PI * 2 * 7); // Minstens 7 rondes
  const startRotation = currentRotation;
  const duration = 4500;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out Quintic voor soepele vertraging
    const easeOut = 1 - Math.pow(1 - progress, 5);
    currentRotation = startRotation + (spinAngle * easeOut);

    // Check voor audio-tick bij passeren segment
    const currentPointerSeg = getWinningIndex();
    if (currentPointerSeg !== lastSegmentIndex) {
      playTickSound();
      // Pijl animatie wigglen
      pointer.style.transform = "rotate(-20deg)";
      setTimeout(() => { pointer.style.transform = "rotate(0deg)"; }, 60);
      lastSegmentIndex = currentPointerSeg;
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
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

// --- VERWERK DE UITSLAG ---
function handleOutcome(seg) {
  if (seg.type === "mult") {
    const win = currentBet * seg.val;
    balance += win;
    resultModal.innerText = ` GEWONNEN! +${win} FICHES (${seg.label})!`;
    resultModal.style.color = "#2ecc71";
    triggerConfetti();
    playWinSound();
  } else if (seg.type === "fixed") {
    balance += seg.val;
    resultModal.innerText = ` Lekker! +${seg.val} fiches erbij!`;
    resultModal.style.color = "#3498db";
    triggerConfetti();
    playWinSound();
  } else if (seg.type === "bankrupt") {
    resultModal.innerText = ` OEI! BANKROET! Inzet verloren...`;
    resultModal.style.color = "#e74c3c";
  } else if (seg.type === "task") {
    resultModal.innerText = ` OPDRACHT: ${seg.label}!`;
    resultModal.style.color = "#f39c12";
  }

  balanceEl.innerText = balance;
  if (currentBet > balance && balance > 0) {
    currentBet = balance;
    currentBetEl.innerText = currentBet;
    btnBetCostEl.innerText = currentBet;
  }
}

// --- CONFETTI EFFECT ---
function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Eerste render
drawWheel();
