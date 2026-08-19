// ==========================================================
// 👑 GLOBAL STATE & AUDIO SYNTHESIS ENGINE (Web Audio API)
// ==========================================================
let activeGame = "lobby";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, param = 0) {
  if (audioCtx.state === "suspended") audioCtx.resume();

  if (type === "click") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    const freq = 450 + (1 - param) * 350;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.035);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.035);
  }

  if (type === "peg") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520 + Math.random() * 400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.04);
  }

  if (type === "keypad") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800 + param * 90, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  }

  if (type === "horn") {
    [220, 277.18, 329.63, 440].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.4);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.1);
      osc.stop(audioCtx.currentTime + i * 0.1 + 0.4);
    });
  }

  if (type === "whoosh") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.14);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.14);
  }

  if (type === "win") {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.35);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 0.35);
    });
  }

  if (type === "bust") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  }
}

function triggerConfetti(isGrand = false) {
  confetti({ 
    particleCount: isGrand ? 160 : 90, 
    spread: isGrand ? 100 : 75, 
    origin: { y: 0.6 }, 
    colors: ['#ffd700', '#ffffff', '#00ff88', '#ff2a55', '#ffbb00'] 
  });
}

// ==========================================================
// 🌌 PARTICLES BACKGROUND ENGINE
// ==========================================================
const bgCanvas = document.getElementById("ambientParticlesCanvas");
const bgCtx = bgCanvas.getContext("2d");
let bgParticles = [];

function initAmbientParticles() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgParticles = [];
  for (let i = 0; i < 40; i++) {
    bgParticles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.5 + 0.2
    });
  }
}

function renderAmbientParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgParticles.forEach(p => {
    p.y += p.vy;
    if (p.y < 0) p.y = bgCanvas.height;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
    bgCtx.fill();
  });
  requestAnimationFrame(renderAmbientParticles);
}

window.addEventListener("resize", () => {
  if (bgCanvas) {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
});

initAmbientParticles();
renderAmbientParticles();

// ==========================================================
// 🏆 SHOWCASE WINNER MODAL
// ==========================================================
function getPlayerName() {
  return document.getElementById("globalPlayerName").value.trim() || "Speler";
}

function openWinnerModal(config) {
  const modal = document.getElementById("winnerModal");
  const pName = getPlayerName();

  document.getElementById("modalPlayerTitle").innerText = `SPELER / TAFEL: ${pName}`;
  document.getElementById("modalIcon").innerText = config.icon || "👑";
  document.getElementById("modalHeading").innerText = config.heading;
  document.getElementById("modalMultiplier").innerText = config.multiplierTag;

  const payoutBox = document.getElementById("modalPayoutBox");
  const payoutVal = document.getElementById("modalPayoutVal");

  if (config.isLoss) {
    payoutBox.classList.add("loss");
    payoutVal.innerText = config.payoutText;
    playSound("bust");
  } else {
    payoutBox.classList.remove("loss");
    payoutVal.innerText = config.payoutText;
    playSound("win");
    triggerConfetti(config.isGrand);
  }

  modal.classList.remove("hidden");
}

function closeWinnerModal() {
  document.getElementById("winnerModal").classList.add("hidden");
}

// ==========================================================
// 🧭 ROUTING & MENU CONTROLLER
// ==========================================================
const backBtn = document.getElementById("backToLobbyBtn");
const dealerStatus = document.getElementById("dealerStatus");
const dealerInfo = document.getElementById("dealerInfo");

function showLobby() {
  activeGame = "lobby";
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-lobby").classList.add("active");
  backBtn.classList.add("hidden");
  dealerStatus.innerText = "CASINO LOBBY";
  dealerInfo.innerText = "Kies een spel om te openen";
}

function openGame(gameKey) {
  activeGame = gameKey;
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${gameKey}`).classList.add("active");
  backBtn.classList.remove("hidden");

  if (gameKey === "wheel") {
    dealerStatus.innerText = "RAD VAN FORTUIN";
    dealerInfo.innerText = "Plaats je inzet & draai!";
    buildWheelLedRing();
    setTimeout(resizeWheelCanvas, 50);
  } else if (gameKey === "race") {
    dealerStatus.innerText = "PAARDENRACE DERBY";
    dealerInfo.innerText = "Kies je winnende paard";
    renderRaceHorses();
  } else if (gameKey === "cups") {
    dealerStatus.innerText = "3 GOUDEN BEKERS";
    dealerInfo.innerText = "Zet in & klik op schudden";
    initCupsView();
  } else if (gameKey === "vault") {
    dealerStatus.innerText = "KRAAK DE KLUIS";
    dealerInfo.innerText = "Toets een 3-cijferige code in";
    initVaultGame();
  } else if (gameKey === "plinko") {
    dealerStatus.innerText = "PLINKO ROYALE";
    dealerInfo.innerText = "Drop de bal voor multipliers";
    setTimeout(initPlinkoGame, 50);
  }
}

// ==========================================================
// 🎡 GAME 1: RAD VAN FORTUIN DELUXE
// ==========================================================
const wheelSegments = [
  { label: "⭐ JACKPOT 10X ⭐", color1: "#ffd700", color2: "#b8860b", text: "#000", type: "mult", val: 10, special: true },
  { label: "BANKROET",          color1: "#990000", color2: "#550000", text: "#fff", type: "bust" },
  { label: "3X WINST",          color1: "#27ae60", color2: "#196f3d", text: "#fff", type: "mult", val: 3 },
  { label: "ZING EEN LIEDJE",   color1: "#8e44ad", color2: "#5b2c6f", text: "#fff", type: "task" },
  { label: "2X WINST",          color1: "#2ecc71", color2: "#229954", text: "#fff", type: "mult", val: 2 },
  { label: "+100 BONUS",        color1: "#2980b9", color2: "#1f618d", text: "#fff", type: "fixed", val: 100 },
  { label: "15 PUSH-UPS",       color1: "#e67e22", color2: "#a04000", text: "#fff", type: "task" },
  { label: "5X MEGA WIN",       color1: "#e74c3c", color2: "#922b21", text: "#fff", type: "mult", val: 5, special: true },
  { label: "BANKROET",          color1: "#990000", color2: "#550000", text: "#fff", type: "bust" },
  { label: "TRAKTEER LEIDING",  color1: "#16a085", color2: "#117864", text: "#fff", type: "task" },
  { label: "2X WINST",          color1: "#2ecc71", color2: "#229954", text: "#fff", type: "mult", val: 2 },
  { label: "DRAAI OPNIEUW",     color1: "#34495e", color2: "#1a252f", text: "#fff", type: "task" }
];

let wheelBet = 50;
let wheelRotation = 0;
let isWheelSpinning = false;
let lastWheelIndex = -1;
let wheelHistory = [];
let wheelLeds = [];

const wheelCanvas = document.getElementById("wheelCanvas");
const wheelCtx = wheelCanvas.getContext("2d");
const wheelSpinBtn = document.getElementById("wheelSpinBtn");
const wheelBetInput = document.getElementById("wheelBetInput");
const wheelNeedle = document.getElementById("wheelNeedle");
const wheelHistoryEl = document.getElementById("wheelHistory");

function buildWheelLedRing() {
  const container = document.getElementById("wheelLedRing");
  if (!container || wheelLeds.length > 0) return;
  container.innerHTML = "";
  wheelLeds = [];
  const totalLeds = 24;
  const radius = 230;

  for (let i = 0; i < totalLeds; i++) {
    const led = document.createElement("div");
    led.className = "led-node";
    const angle = (i / totalLeds) * (2 * Math.PI);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    led.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    container.appendChild(led);
    wheelLeds.push(led);
  }
}

// LED Looplicht
let ledTick = 0;
setInterval(() => {
  if (wheelLeds.length === 0) return;
  ledTick++;
  wheelLeds.forEach((led, idx) => {
    if (isWheelSpinning) {
      led.classList.toggle("off", (idx + ledTick) % 2 === 0);
    } else {
      led.classList.toggle("off", (idx + Math.floor(Date.now() / 400)) % 3 === 0);
    }
  });
}, 70);

function resizeWheelCanvas() {
  if (activeGame !== "wheel") return;
  const rect = wheelCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  wheelCanvas.width = rect.width * dpr;
  wheelCanvas.height = rect.height * dpr;
  wheelCtx.scale(dpr, dpr);
  drawWheel();
}

window.addEventListener("resize", resizeWheelCanvas);

function drawWheel() {
  const rect = wheelCanvas.getBoundingClientRect();
  const size = rect.width;
  if (!size) return;
  const center = size / 2;
  const radius = center - 8;
  const arc = (2 * Math.PI) / wheelSegments.length;

  wheelCtx.clearRect(0, 0, size, size);

  // Rand
  wheelCtx.save();
  wheelCtx.beginPath();
  wheelCtx.arc(center, center, radius + 5, 0, 2 * Math.PI);
  wheelCtx.fillStyle = "#161104"; wheelCtx.fill();
  wheelCtx.lineWidth = 6; wheelCtx.strokeStyle = "#cca000"; wheelCtx.stroke();
  wheelCtx.restore();

  // Segmenten
  wheelSegments.forEach((seg, i) => {
    const angle = wheelRotation + (i * arc);
    wheelCtx.save();
    wheelCtx.beginPath();
    wheelCtx.moveTo(center, center);
    wheelCtx.arc(center, center, radius, angle, angle + arc);
    wheelCtx.closePath();

    const grad = wheelCtx.createRadialGradient(center, center, 20, center, center, radius);
    grad.addColorStop(0, seg.color1); grad.addColorStop(1, seg.color2);
    wheelCtx.fillStyle = grad; wheelCtx.fill();
    wheelCtx.lineWidth = 2; wheelCtx.strokeStyle = "#ffd700"; wheelCtx.stroke();

    wheelCtx.translate(center, center);
    wheelCtx.rotate(angle + arc / 2);
    wheelCtx.textAlign = "right";
    wheelCtx.fillStyle = seg.text;
    const fontSize = Math.max(10, Math.floor(size * (seg.special ? 0.038 : 0.031)));
    wheelCtx.font = `${seg.special ? '900' : '800'} ${fontSize}px 'Montserrat'`;
    wheelCtx.fillText(seg.label, radius - (size * 0.06), fontSize * 0.35);
    wheelCtx.restore();
  });

  for (let i = 0; i < wheelSegments.length * 2; i++) {
    const pegAngle = wheelRotation + (i * (Math.PI / wheelSegments.length));
    const pegX = center + Math.cos(pegAngle) * (radius - 3);
    const pegY = center + Math.sin(pegAngle) * (radius - 3);
    wheelCtx.beginPath();
    wheelCtx.arc(pegX, pegY, Math.max(3, size * 0.009), 0, 2 * Math.PI);
    wheelCtx.fillStyle = "#fff"; wheelCtx.fill();
    wheelCtx.strokeStyle = "#cca000"; wheelCtx.stroke();
  }
}

function setWheelBet(amt) {
  if (isWheelSpinning) return;
  wheelBet = Math.max(5, amt);
  wheelBetInput.value = wheelBet;
}

function multiplyWheelBet(f) {
  if (isWheelSpinning) return;
  setWheelBet(Math.round(wheelBet * f));
}

wheelBetInput.addEventListener("input", (e) => {
  wheelBet = Math.max(1, parseInt(e.target.value) || 0);
});

function spinWheel() {
  if (isWheelSpinning) return;
  isWheelSpinning = true;
  wheelSpinBtn.disabled = true;
  dealerStatus.innerText = "RAD IS IN BEWEGING...";
  dealerInfo.innerText = `Inzet: ${wheelBet} fiches`;

  const arc = (2 * Math.PI) / wheelSegments.length;
  const spinRounds = Math.PI * 2 * (8 + Math.random() * 3);
  const startRotation = wheelRotation;
  const duration = 4800;
  const startTime = performance.now();

  function anim(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 5);
    wheelRotation = startRotation + (spinRounds * easeOut);

    const norm = (wheelRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const pointerAngle = (1.5 * Math.PI - norm + 2 * Math.PI) % (2 * Math.PI);
    const curIdx = Math.floor(pointerAngle / arc);

    if (curIdx !== lastWheelIndex) {
      playSound("click", progress);
      wheelNeedle.style.transform = "rotate(-24deg)";
      setTimeout(() => { wheelNeedle.style.transform = "rotate(0deg)"; }, 45);
      lastWheelIndex = curIdx;
    }

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(anim);
    } else {
      isWheelSpinning = false;
      wheelSpinBtn.disabled = false;
      handleWheelResult(wheelSegments[curIdx]);
    }
  }
  requestAnimationFrame(anim);
}

function handleWheelResult(seg) {
  let logText = "";
  const pName = getPlayerName();

  if (seg.type === "mult") {
    const win = wheelBet * seg.val;
    const profit = win - wheelBet;
    openWinnerModal({
      icon: seg.val >= 5 ? "🔥" : "🎉",
      heading: seg.label,
      multiplierTag: `${seg.val}X MULTIPLIER`,
      payoutText: `BETAAL ${win} FICHES AAN ${pName} (+${profit} winst)`,
      isGrand: seg.val >= 5
    });
    logText = `WINST: ${seg.label} ➔ ${win}`;
  } else if (seg.type === "fixed") {
    const win = wheelBet + seg.val;
    openWinnerModal({
      icon: "🎁",
      heading: `+${seg.val} BONUS FICHES!`,
      multiplierTag: "EXTRA BONUS",
      payoutText: `BETAAL ${win} FICHES AAN ${pName}`,
      isGrand: false
    });
    logText = `BONUS: +${seg.val} ➔ ${win}`;
  } else if (seg.type === "bust") {
    openWinnerModal({
      icon: "💀",
      heading: "BANKROET / HUIS WINT",
      multiplierTag: "VERLOREN",
      payoutText: `NEEM ${wheelBet} FICHES IN VAN ${pName}`,
      isLoss: true
    });
    logText = `BANKROET (-${wheelBet})`;
  } else if (seg.type === "task") {
    openWinnerModal({
      icon: "🎭",
      heading: "SPECIALE OPDRACHT!",
      multiplierTag: "KAMP OPDRACHT",
      payoutText: `${pName} MOET: ${seg.label}`,
      isGrand: false
    });
    logText = `OPDRACHT: ${seg.label}`;
  }

  if (wheelHistory.length === 0) wheelHistoryEl.innerHTML = "";
  wheelHistory.unshift(logText);
  if (wheelHistory.length > 3) wheelHistory.pop();
  wheelHistoryEl.innerHTML = wheelHistory.map(t => `<li class="hw-item">${t}</li>`).join("");
}

// ==========================================================
// 🐎 GAME 2: PAARDENRACE DERBY EXTRAVAGANZA
// ==========================================================
const horses = [
  { id: 0, name: "Bliksem Bob", avatar: "⚡🐎", color: "#e74c3c", odds: 2.2 },
  { id: 1, name: "Tornado Tom", avatar: "🌪️🐎", color: "#3498db", odds: 3.5 },
  { id: 2, name: "Kookstaf Raket", avatar: "🚀🐎", color: "#f39c12", odds: 5.0 },
  { id: 3, name: "Lucky Lady", avatar: "🍀🐎", color: "#2ecc71", odds: 8.0 },
  { id: 4, name: "Kamp Mascot", avatar: "👑🐎", color: "#9b59b6", odds: 12.0 }
];

let selectedHorse = 0;
let raceBet = 50;
let isRacing = false;

function renderRaceHorses() {
  const list = document.getElementById("horseBetList");
  const trackLanes = document.getElementById("trackLanes");

  list.innerHTML = horses.map(h => `
    <div class="horse-bet-card ${h.id === selectedHorse ? 'selected' : ''}" onclick="selectHorse(${h.id})">
      <div class="h-info">
        <span class="h-avatar">${h.avatar}</span>
        <span class="h-name">${h.name}</span>
      </div>
      <span class="h-odds">${h.odds.toFixed(1)}x</span>
    </div>
  `).join("");

  trackLanes.innerHTML = horses.map(h => `
    <div class="lane" id="lane-${h.id}">
      <div class="horse-runner" id="runner-${h.id}">
        <span class="runner-sprite">${h.avatar}</span>
        <span class="runner-tag" style="border-color:${h.color}">${h.name}</span>
      </div>
    </div>
  `).join("");
}

function selectHorse(id) {
  if (isRacing) return;
  selectedHorse = id;
  renderRaceHorses();
}

function setRaceBet(amt) {
  if (isRacing) return;
  raceBet = Math.max(5, amt);
  document.getElementById("raceBetInput").value = raceBet;
}

document.getElementById("raceBetInput").addEventListener("input", (e) => {
  raceBet = Math.max(1, parseInt(e.target.value) || 0);
});

function startHorseRace() {
  if (isRacing) return;
  isRacing = true;
  document.getElementById("startRaceBtn").disabled = true;

  dealerStatus.innerText = "🏁 DE DERBY IS GESTART!";
  dealerInfo.innerText = `Paard: ${horses[selectedHorse].name} (${horses[selectedHorse].odds}x)`;
  playSound("horn");

  const trackWidth = document.getElementById("raceTrack").clientWidth - 110;
  const positions = horses.map(() => 0);
  const commentaryEl = document.getElementById("raceCommentary");
  document.querySelectorAll(".horse-runner").forEach(el => el.classList.add("horse-running"));

  const raceInterval = setInterval(() => {
    let winner = null;

    horses.forEach((h, i) => {
      const speed = (Math.random() * 4.2) + (Math.random() > 0.82 ? 4.5 : 1);
      positions[i] += speed;

      const runner = document.getElementById(`runner-${h.id}`);
      if (runner) runner.style.transform = `translateX(${positions[i]}px)`;

      if (positions[i] >= trackWidth && winner === null) {
        winner = h;
      }
    });

    // Dynamic Live Commentary
    const leaderIdx = positions.indexOf(Math.max(...positions));
    commentaryEl.innerText = `🎙️ KOPLOPER: ${horses[leaderIdx].name.toUpperCase()} LEIDT HET VELD!`;

    if (winner !== null) {
      clearInterval(raceInterval);
      isRacing = false;
      document.getElementById("startRaceBtn").disabled = false;
      document.querySelectorAll(".horse-runner").forEach(el => el.classList.remove("horse-running"));
      commentaryEl.innerText = `🏆 FINISH: ${winner.name.toUpperCase()} WINT DE DERBY!`;

      const pName = getPlayerName();
      if (winner.id === selectedHorse) {
        const payout = Math.round(raceBet * winner.odds);
        const profit = payout - raceBet;
        openWinnerModal({
          icon: "🏆",
          heading: `${winner.name} WINT DE RACE!`,
          multiplierTag: `${winner.odds}X DERBY ODDS`,
          payoutText: `BETAAL ${payout} FICHES AAN ${pName} (+${profit} winst)`,
          isGrand: winner.odds >= 5.0
        });
      } else {
        openWinnerModal({
          icon: "💀",
          heading: `${winner.name} HEEFT GEWONNEN`,
          multiplierTag: "VERKEERD GEGOKT",
          payoutText: `NEEM ${raceBet} FICHES IN VAN ${pName}`,
          isLoss: true
        });
      }
    }
  }, 38);
}

// ==========================================================
// 🎪 GAME 3: 3 GOUDEN BEKERS & BALLETJE
// ==========================================================
let cupsBet = 50;
let ballSlot = 1;
let isShuffling = false;
let canPick = false;
const cupSlotPositions = [5, 38, 72];

function setCupsBet(amt) {
  if (isShuffling) return;
  cupsBet = Math.max(5, amt);
  document.getElementById("cupsBetInput").value = cupsBet;
}

document.getElementById("cupsBetInput").addEventListener("input", (e) => {
  cupsBet = Math.max(1, parseInt(e.target.value) || 0);
});

function initCupsView() {
  isShuffling = false;
  canPick = false;
  document.getElementById("shuffleCupsBtn").disabled = false;
  
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById(`cupSlot-${i}`);
    const cup = document.getElementById(`cupAsset-${i}`);
    const ball = document.getElementById(`ball-${i}`);
    
    if (slot) slot.style.left = `${cupSlotPositions[i]}%`;
    if (cup) cup.classList.remove("lifted");
    if (ball) ball.classList.remove("active-ball");
  }
}

function startCupShuffle() {
  if (isShuffling) return;
  isShuffling = true;
  canPick = false;
  document.getElementById("shuffleCupsBtn").disabled = true;

  ballSlot = Math.floor(Math.random() * 3);

  for (let i = 0; i < 3; i++) {
    const b = document.getElementById(`ball-${i}`);
    const c = document.getElementById(`cupAsset-${i}`);
    if (i === ballSlot) {
      b.classList.add("active-ball");
      c.classList.add("lifted");
    } else {
      b.classList.remove("active-ball");
      c.classList.remove("lifted");
    }
  }

  dealerStatus.innerText = "KIJK GOED WAAR DE BAL ZIT...";
  dealerInfo.innerText = `Beker ${ballSlot + 1} heeft de bal!`;
  playSound("win");

  setTimeout(() => {
    document.getElementById(`cupAsset-${ballSlot}`).classList.remove("lifted");
    dealerStatus.innerText = "BEKERS WORDEN GESCHUD...";
    dealerInfo.innerText = "Volg de juiste beker!";

    setTimeout(() => {
      let slots = [0, 1, 2];
      let shufflesLeft = 8;

      const shuffleTimer = setInterval(() => {
        const i1 = Math.floor(Math.random() * 3);
        let i2 = Math.floor(Math.random() * 3);
        while (i1 === i2) i2 = Math.floor(Math.random() * 3);

        const temp = slots[i1];
        slots[i1] = slots[i2];
        slots[i2] = temp;

        slots.forEach((slotId, visualIndex) => {
          document.getElementById(`cupSlot-${slotId}`).style.left = `${cupSlotPositions[visualIndex]}%`;
        });

        playSound("whoosh");
        shufflesLeft--;

        if (shufflesLeft <= 0) {
          clearInterval(shuffleTimer);
          isShuffling = false;
          canPick = true;
          dealerStatus.innerText = "WAAR ZIT DE BAL?";
          dealerInfo.innerText = "Klik op één van de 3 bekers om te raden!";
        }
      }, 340);

    }, 700);
  }, 1300);
}

function pickCup(clickedCupId) {
  if (!canPick) return;
  canPick = false;

  for (let i = 0; i < 3; i++) {
    document.getElementById(`cupAsset-${i}`).classList.add("lifted");
  }

  const pName = getPlayerName();
  if (clickedCupId === ballSlot) {
    const win = cupsBet * 3;
    const profit = win - cupsBet;
    openWinnerModal({
      icon: "🎪",
      heading: "JUIST GERADEN!",
      multiplierTag: "3X TRIPLE WINST",
      payoutText: `BETAAL ${win} FICHES AAN ${pName} (+${profit} winst)`,
      isGrand: false
    });
  } else {
    openWinnerModal({
      icon: "💀",
      heading: "VERKEERDE BEKER!",
      multiplierTag: "BAL ZAT IN BEKER " + (ballSlot + 1),
      payoutText: `NEEM ${cupsBet} FICHES IN VAN ${pName}`,
      isLoss: true
    });
  }

  document.getElementById("shuffleCupsBtn").disabled = false;
}

// ==========================================================
// 🗄️ GAME 4: KRAAK DE KLUIS (VAULT ROYALE)
// ==========================================================
let vaultBet = 50;
let secretCode = "742";
let currentCodeInput = "";
let vaultJackpot = 1500;

function setVaultBet(amt) {
  vaultBet = Math.max(5, amt);
  document.getElementById("vaultBetInput").value = vaultBet;
}

document.getElementById("vaultBetInput").addEventListener("input", (e) => {
  vaultBet = Math.max(1, parseInt(e.target.value) || 0);
});

function initVaultGame() {
  const digits = [0,1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
  secretCode = `${digits[0]}${digits[1]}${digits[2]}`;
  clearKeypad();
  document.getElementById("vaultJackpotAmount").innerText = `${vaultJackpot} FICHES`;
}

function pressKey(num) {
  if (currentCodeInput.length < 3) {
    currentCodeInput += num;
    playSound("keypad", num);
    updatePinDisplay();
  }
}

function clearKeypad() {
  currentCodeInput = "";
  updatePinDisplay();
  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`hdot-${i}`);
    dot.className = `hint-dot dot-${i+1}`;
  }
}

function updatePinDisplay() {
  const padded = (currentCodeInput + "___").slice(0, 3).split("").join(" ");
  document.getElementById("vaultPinDisplay").innerText = padded;
}

function submitVaultGuess() {
  if (currentCodeInput.length !== 3) {
    alert("Toets eerst een 3-cijferige code in!");
    return;
  }

  vaultJackpot += vaultBet;
  document.getElementById("vaultJackpotAmount").innerText = `${vaultJackpot} FICHES`;

  const pName = getPlayerName();
  let exactCount = 0;

  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`hdot-${i}`);
    dot.className = `hint-dot dot-${i+1}`;

    if (currentCodeInput[i] === secretCode[i]) {
      dot.classList.add("exact");
      exactCount++;
    } else if (secretCode.includes(currentCodeInput[i])) {
      dot.classList.add("near");
    } else {
      dot.classList.add("miss");
    }
  }

  if (exactCount === 3) {
    openWinnerModal({
      icon: "🔓",
      heading: "KLUIS GEKRAAKT!",
      multiplierTag: "GRAND JACKPOT POOL",
      payoutText: `BETAAL DE VOLLEDIGE KLUIS VAN ${vaultJackpot} FICHES AAN ${pName}!`,
      isGrand: true
    });
    vaultJackpot = 1000;
    initVaultGame();
  } else {
    playSound("click");
    dealerStatus.innerText = "CODE WAS ONJUIST";
    dealerInfo.innerText = "Check de groene/gele lampjes & probeer opnieuw!";
  }
}

// ==========================================================
// ⚡ GAME 5: PLINKO ROYALE DELUXE
// ==========================================================
let plinkoBet = 50;
let isPlinkoRunning = false;
const plinkoMultipliers = [25, 5, 2, 0.5, 0.2, 0.5, 2, 5, 25];

function setPlinkoBet(amt) {
  if (isPlinkoRunning) return;
  plinkoBet = Math.max(5, amt);
  document.getElementById("plinkoBetInput").value = plinkoBet;
}

document.getElementById("plinkoBetInput").addEventListener("input", (e) => {
  plinkoBet = Math.max(1, parseInt(e.target.value) || 0);
});

const plinkoCanvas = document.getElementById("plinkoCanvas");
const plinkoCtx = plinkoCanvas.getContext("2d");
let plinkoRows = 7;
let plinkoPegs = [];

function initPlinkoGame() {
  if (activeGame !== "plinko") return;
  const rect = plinkoCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  plinkoCanvas.width = rect.width * dpr;
  plinkoCanvas.height = rect.height * dpr;
  plinkoCtx.scale(dpr, dpr);

  buildPlinkoPegs();
  drawPlinkoBoard();
}

function buildPlinkoPegs() {
  plinkoPegs = [];
  const width = plinkoCanvas.getBoundingClientRect().width;
  const height = plinkoCanvas.getBoundingClientRect().height;
  const rowSpacing = (height - 90) / (plinkoRows + 1);

  for (let r = 0; r < plinkoRows; r++) {
    const numPegs = r + 3;
    const y = 50 + r * rowSpacing;
    const rowWidth = (numPegs - 1) * (width / 11);
    const startX = (width - rowWidth) / 2;

    for (let c = 0; c < numPegs; c++) {
      const x = startX + c * (width / 11);
      plinkoPegs.push({ x, y });
    }
  }
}

function drawPlinkoBoard(ball = null) {
  const width = plinkoCanvas.getBoundingClientRect().width;
  const height = plinkoCanvas.getBoundingClientRect().height;

  plinkoCtx.clearRect(0, 0, width, height);

  // 1. Pinnen
  plinkoPegs.forEach(peg => {
    plinkoCtx.beginPath();
    plinkoCtx.arc(peg.x, peg.y, 4, 0, 2 * Math.PI);
    plinkoCtx.fillStyle = "#ffd700";
    plinkoCtx.shadowColor = "rgba(255, 215, 0, 0.8)";
    plinkoCtx.shadowBlur = 6;
    plinkoCtx.fill();
    plinkoCtx.shadowBlur = 0;
  });

  // 2. Multiplier slots
  const slotWidth = width / plinkoMultipliers.length;
  plinkoMultipliers.forEach((mult, i) => {
    const x = i * slotWidth;
    const y = height - 40;

    plinkoCtx.fillStyle = mult >= 10 ? "#e74c3c" : mult >= 2 ? "#2ecc71" : mult >= 1 ? "#3498db" : "#34495e";
    plinkoCtx.fillRect(x + 2, y, slotWidth - 4, 35);
    plinkoCtx.fillStyle = "#fff";
    plinkoCtx.font = "900 11px Montserrat";
    plinkoCtx.textAlign = "center";
    plinkoCtx.fillText(`${mult}x`, x + slotWidth / 2, y + 22);
  });

  // 3. Bal
  if (ball) {
    plinkoCtx.beginPath();
    plinkoCtx.arc(ball.x, ball.y, 9, 0, 2 * Math.PI);
    plinkoCtx.fillStyle = "#ffffff";
    plinkoCtx.shadowColor = "#00ff88";
    plinkoCtx.shadowBlur = 12;
    plinkoCtx.fill();
    plinkoCtx.shadowBlur = 0;
  }
}

function dropPlinkoBall() {
  if (isPlinkoRunning) return;
  isPlinkoRunning = true;
  document.getElementById("dropPlinkoBtn").disabled = true;

  const width = plinkoCanvas.getBoundingClientRect().width;
  const height = plinkoCanvas.getBoundingClientRect().height;

  let ball = {
    x: width / 2 + (Math.random() * 20 - 10),
    y: 20,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 2
  };

  const anim = () => {
    ball.vy += 0.22;
    ball.x += ball.vx;
    ball.y += ball.vy;

    plinkoPegs.forEach(peg => {
      const dx = ball.x - peg.x;
      const dy = ball.y - peg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 13) {
        playSound("peg");
        const angle = Math.atan2(dy, dx);
        ball.vx = Math.cos(angle) * (2.2 + Math.random() * 1.2);
        ball.vy = Math.sin(angle) * 1.8 + 0.8;
      }
    });

    if (ball.x < 15) { ball.x = 15; ball.vx *= -0.7; }
    if (ball.x > width - 15) { ball.x = width - 15; ball.vx *= -0.7; }

    drawPlinkoBoard(ball);

    if (ball.y < height - 50) {
      requestAnimationFrame(anim);
    } else {
      isPlinkoRunning = false;
      document.getElementById("dropPlinkoBtn").disabled = false;

      const slotIndex = Math.min(
        plinkoMultipliers.length - 1,
        Math.max(0, Math.floor(ball.x / (width / plinkoMultipliers.length)))
      );
      const mult = plinkoMultipliers[slotIndex];
      handlePlinkoResult(mult);
    }
  };

  requestAnimationFrame(anim);
}

function handlePlinkoResult(mult) {
  const pName = getPlayerName();
  const payout = Math.round(plinkoBet * mult);
  const profit = payout - plinkoBet;

  if (mult >= 1) {
    openWinnerModal({
      icon: mult >= 10 ? "⚡" : "🎯",
      heading: `${mult}X PLINKO MULTIPLIER!`,
      multiplierTag: `${mult}X SLOT HIT`,
      payoutText: `BETAAL ${payout} FICHES AAN ${pName} (+${profit} winst)`,
      isGrand: mult >= 10
    });
  } else {
    openWinnerModal({
      icon: "💀",
      heading: `${mult}X SLOT GERAAKT`,
      multiplierTag: "LAGERE UITBETALING",
      payoutText: `NEEM ${plinkoBet - payout} FICHES IN (speler houdt ${payout})`,
      isLoss: true
    });
  }
}
