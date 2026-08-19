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

  if (type === "concrete_thud") {
    // Zware klap van neervallend betonblok
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.12);
  }

  if (type === "chicken_hop") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(560 + param * 45, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
  }

  if (type === "car_crash") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(950, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.35);
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
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
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
function openWinnerModal(config) {
  const modal = document.getElementById("winnerModal");
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
  } else if (gameKey === "chicken") {
    dealerStatus.innerText = "DE KIP STEEKT OVER";
    dealerInfo.innerText = "Druk op 'SPRING VOORUIT' om te beginnen!";
    setTimeout(initChickenGame, 50);
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

  if (seg.type === "mult") {
    const win = wheelBet * seg.val;
    const profit = win - wheelBet;
    openWinnerModal({
      icon: seg.val >= 5 ? "🔥" : "🎉",
      heading: seg.label,
      multiplierTag: `${seg.val}X MULTIPLIER`,
      payoutText: `BETAAL ${win} FICHES UIT (+${profit} winst)`,
      isGrand: seg.val >= 5
    });
    logText = `WINST: ${seg.label} ➔ ${win}`;
  } else if (seg.type === "fixed") {
    const win = wheelBet + seg.val;
    openWinnerModal({
      icon: "🎁",
      heading: `+${seg.val} BONUS FICHES!`,
      multiplierTag: "EXTRA BONUS",
      payoutText: `BETAAL ${win} FICHES UIT`,
      isGrand: false
    });
    logText = `BONUS: +${seg.val} ➔ ${win}`;
  } else if (seg.type === "bust") {
    openWinnerModal({
      icon: "💀",
      heading: "BANKROET / HUIS WINT",
      multiplierTag: "VERLOREN",
      payoutText: `NEEM INZET VAN ${wheelBet} FICHES IN`,
      isLoss: true
    });
    logText = `BANKROET (-${wheelBet})`;
  } else if (seg.type === "task") {
    openWinnerModal({
      icon: "🎭",
      heading: "SPECIALE OPDRACHT!",
      multiplierTag: "KAMP OPDRACHT",
      payoutText: `OPDRACHT: ${seg.label}`,
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
// 🐎 GAME 2: PAARDENRACE DERBY
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

    const leaderIdx = positions.indexOf(Math.max(...positions));
    commentaryEl.innerText = `🎙️ KOPLOPER: ${horses[leaderIdx].name.toUpperCase()} LEIDT HET VELD!`;

    if (winner !== null) {
      clearInterval(raceInterval);
      isRacing = false;
      document.getElementById("startRaceBtn").disabled = false;
      document.querySelectorAll(".horse-runner").forEach(el => el.classList.remove("horse-running"));
      commentaryEl.innerText = `🏆 FINISH: ${winner.name.toUpperCase()} WINT DE DERBY!`;

      if (winner.id === selectedHorse) {
        const payout = Math.round(raceBet * winner.odds);
        const profit = payout - raceBet;
        openWinnerModal({
          icon: "🏆",
          heading: `${winner.name} WINT DE RACE!`,
          multiplierTag: `${winner.odds}X DERBY ODDS`,
          payoutText: `BETAAL ${payout} FICHES UIT (+${profit} winst)`,
          isGrand: winner.odds >= 5.0
        });
      } else {
        openWinnerModal({
          icon: "💀",
          heading: `${winner.name} HEEFT GEWONNEN`,
          multiplierTag: "VERKEERD GEGOKT",
          payoutText: `NEEM INZET VAN ${raceBet} FICHES IN`,
          isLoss: true
        });
      }
    }
  }, 38);
}

// ==========================================================
// 🎪 GAME 3: 3 GOUDEN BEKERS (HARDCORE SPEED MODE)
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
    dealerStatus.innerText = "⚡ VEGAS SPEED SHUFFLE...";
    dealerInfo.innerText = "Focus je ogen op de beker!";

    setTimeout(() => {
      let slots = [0, 1, 2];
      let shufflesLeft = 14;

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
      }, 190);

    }, 550);
  }, 1000);
}

function pickCup(clickedCupId) {
  if (!canPick) return;
  canPick = false;

  for (let i = 0; i < 3; i++) {
    document.getElementById(`cupAsset-${i}`).classList.add("lifted");
  }

  if (clickedCupId === ballSlot) {
    const win = cupsBet * 3;
    const profit = win - cupsBet;
    openWinnerModal({
      icon: "🎪",
      heading: "JUIST GERADEN!",
      multiplierTag: "3X HARDCORE WINST",
      payoutText: `BETAAL ${win} FICHES UIT (+${profit} winst)`,
      isGrand: false
    });
  } else {
    openWinnerModal({
      icon: "💀",
      heading: "VERKEERDE BEKER!",
      multiplierTag: "BAL ZAT IN BEKER " + (ballSlot + 1),
      payoutText: `NEEM INZET VAN ${cupsBet} FICHES IN`,
      isLoss: true
    });
  }

  document.getElementById("shuffleCupsBtn").disabled = false;
}

// ==========================================================
// 🐔 GAME 4: DE KIP STEEKT OVER (BETONBLOK HIGHWAY ENGINE)
// ==========================================================
let chickenBet = 50;
let chickenLane = 0; // 0 = startgras onderaan, 1..8 = banen
let isChickenGameActive = false;
let isChickenAlive = true;
let isChickenHopping = false;
let deadlyLane = 5; // De straat waar de kip overreden wordt
let safeConcreteLanes = []; // Banen waar een beschermend betonblok staat

const chickenMultipliers = [1.4, 2.0, 3.2, 5.0, 8.5, 15.0, 30.0, 100.0];
const chickenCanvas = document.getElementById("chickenCanvas");
const chickenCtx = chickenCanvas.getContext("2d");

let chickenAnimationId = null;
let chickenVehicles = [];
let targetChickenY = 0;
let hopProgress = 1;

function setChickenBet(amt) {
  if (isChickenGameActive) return;
  chickenBet = Math.max(5, amt);
  document.getElementById("chickenBetInput").value = chickenBet;
}

document.getElementById("chickenBetInput").addEventListener("input", (e) => {
  chickenBet = Math.max(1, parseInt(e.target.value) || 0);
});

function initChickenGame() {
  isChickenGameActive = false;
  isChickenAlive = true;
  isChickenHopping = false;
  chickenLane = 0;
  safeConcreteLanes = [];

  document.getElementById("hopChickenBtn").classList.remove("hidden");
  document.getElementById("cashoutChickenBtn").classList.add("hidden");
  document.getElementById("chickenCurrentCashout").innerText = "0 FICHES";

  resizeChickenCanvas();
  spawnHighwayVehicles();
  startChickenAnimationLoop();
}

function resizeChickenCanvas() {
  if (activeGame !== "chicken") return;
  const rect = chickenCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  chickenCanvas.width = rect.width * dpr;
  chickenCanvas.height = rect.height * dpr;
  chickenCtx.scale(dpr, dpr);
}

window.addEventListener("resize", () => {
  if (activeGame === "chicken") resizeChickenCanvas();
});

function spawnHighwayVehicles() {
  chickenVehicles = [];
  const rect = chickenCanvas.getBoundingClientRect();
  const w = rect.width || 480;
  const h = rect.height || 480;
  const laneHeight = (h - 70) / 8;

  const carIcons = ["🏎️", "🚗", "🚕", "🚙", "🚌", "🚛", "🚓", "🚜"];

  for (let l = 1; l <= 8; l++) {
    const laneY = (h - 35) - (l * laneHeight) + (laneHeight / 2);
    const dir = (l % 2 === 0) ? 1 : -1;
    const speed = (2.0 + (l * 0.35) + Math.random() * 0.8) * dir;

    // 2 auto's per baan
    chickenVehicles.push({
      lane: l,
      x: Math.random() * w,
      y: laneY,
      speed: speed,
      baseSpeed: speed,
      icon: carIcons[l - 1],
      isBlocked: false
    });

    chickenVehicles.push({
      lane: l,
      x: (Math.random() * w + w / 2) % w,
      y: laneY,
      speed: speed,
      baseSpeed: speed,
      icon: carIcons[(l + 2) % carIcons.length],
      isBlocked: false
    });
  }
}

function hopChickenForward() {
  if (isChickenHopping) return;

  // Start het spel automatisch als het nog niet actief is
  if (!isChickenGameActive) {
    isChickenGameActive = true;
    isChickenAlive = true;
    chickenLane = 0;
    safeConcreteLanes = [];
    deadlyLane = Math.floor(Math.random() * 7) + 2; // Dodelijke baan tussen 2 en 8
  }

  isChickenHopping = true;
  const nextLane = chickenLane + 1;
  const rect = chickenCanvas.getBoundingClientRect();
  const h = rect.height;
  const laneHeight = (h - 70) / 8;

  targetChickenY = (h - 35) - (nextLane * laneHeight) + (laneHeight / 2);
  hopProgress = 0;

  const isDoomed = (nextLane >= deadlyLane);

  playSound("chicken_hop", nextLane);

  const hopInterval = setInterval(() => {
    hopProgress += 0.12;
    if (hopProgress >= 1) {
      hopProgress = 1;
      clearInterval(hopInterval);
      isChickenHopping = false;
      chickenLane = nextLane;

      if (isDoomed) {
        // 💥 GECRASHT DOOR VERKEER! GEEN BETONBLOK
        isChickenAlive = false;
        isChickenGameActive = false;
        playSound("car_crash");

        document.getElementById("cashoutChickenBtn").classList.add("hidden");
        document.getElementById("chickenCurrentCashout").innerText = "0 FICHES";

        setTimeout(() => {
          openWinnerModal({
            icon: "🍗",
            heading: "AANGEREDEN DOOR VERKEER!",
            multiplierTag: `GEROOSTERD OP STRAAT ${nextLane}`,
            payoutText: `NEEM INZET VAN ${chickenBet} FICHES IN`,
            isLoss: true
          });
          initChickenGame();
        }, 600);

      } else {
        // ✅ VEILIG GELAND: BETONBLOK VALT EN BESCHERMT DE KIP!
        safeConcreteLanes.push(chickenLane);
        playSound("concrete_thud");

        const currentMult = chickenMultipliers[chickenLane - 1];
        const currentVal = Math.round(chickenBet * currentMult);
        document.getElementById("chickenCurrentCashout").innerText = `${currentVal} FICHES (${currentMult}x)`;
        document.getElementById("cashoutChickenBtn").classList.remove("hidden");

        if (chickenLane === 8) {
          // 🏆 GOUDEN EI BEREIKT! 100X MULTIPLIER!
          isChickenGameActive = false;
          document.getElementById("cashoutChickenBtn").classList.add("hidden");

          setTimeout(() => {
            openWinnerModal({
              icon: "👑",
              heading: "GOUDEN EI BEREIKT! 100X WINST!",
              multiplierTag: "100X GRAND JACKPOT!",
              payoutText: `BETAAL DE HOOFDPRIJS VAN ${currentVal} FICHES UIT!`,
              isGrand: true
            });
            initChickenGame();
          }, 500);

        } else {
          dealerStatus.innerText = `🧱 BETONBLOK BESCHERMT KIP OP STRAAT ${chickenLane}!`;
          dealerInfo.innerText = `Waarde nu: ${currentVal} fiches. Druk op 'SPRING VOORUIT' of 'CASH OUT'!`;
        }
      }
    }
  }, 20);
}

function cashoutChicken() {
  if (!isChickenGameActive || chickenLane === 0) return;

  const currentMult = chickenMultipliers[chickenLane - 1];
  const payout = Math.round(chickenBet * currentMult);
  const profit = payout - chickenBet;

  isChickenGameActive = false;
  document.getElementById("cashoutChickenBtn").classList.add("hidden");
  document.getElementById("chickenCurrentCashout").innerText = "0 FICHES";

  openWinnerModal({
    icon: "💰",
    heading: "KIP VEILIG GECASHT!",
    multiplierTag: `${currentMult}X OVERSTEEK WINST`,
    payoutText: `BETAAL ${payout} FICHES UIT (+${profit} winst)`,
    isGrand: currentMult >= 8.0
  });

  initChickenGame();
}

function startChickenAnimationLoop() {
  if (chickenAnimationId) cancelAnimationFrame(chickenAnimationId);

  function renderLoop() {
    if (activeGame === "chicken") {
      drawChickenHighwayFrame();
    }
    chickenAnimationId = requestAnimationFrame(renderLoop);
  }
  chickenAnimationId = requestAnimationFrame(renderLoop);
}

function drawChickenHighwayFrame() {
  const rect = chickenCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (!w || !h) return;

  chickenCtx.clearRect(0, 0, w, h);

  const laneHeight = (h - 70) / 8;
  const centerX = w / 2;

  // 1. Finish Grass Zone (Top)
  chickenCtx.fillStyle = "#1e7e34";
  chickenCtx.fillRect(0, 0, w, 35);
  chickenCtx.fillStyle = "#ffd700";
  chickenCtx.font = "900 13px 'Cinzel', serif";
  chickenCtx.textAlign = "center";
  chickenCtx.fillText("🏆 GOUDEN EI FINISH (100X)", w / 2, 22);

  // 2. Start Grass Zone (Bottom)
  chickenCtx.fillStyle = "#28a745";
  chickenCtx.fillRect(0, h - 35, w, 35);
  chickenCtx.fillStyle = "#ffffff";
  chickenCtx.font = "800 11px Montserrat";
  chickenCtx.textAlign = "center";
  chickenCtx.fillText("STARTZONE (VEILIG)", w / 2, h - 12);

  // 3. 8 Asfalt Rijbanen
  for (let l = 1; l <= 8; l++) {
    const laneY = (h - 35) - (l * laneHeight);
    chickenCtx.fillStyle = (l % 2 === 0) ? "#222631" : "#1a1e27";
    chickenCtx.fillRect(0, laneY, w, laneHeight);

    // Witte wegstrepen
    chickenCtx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    chickenCtx.lineWidth = 2;
    chickenCtx.setLineDash([12, 12]);
    chickenCtx.beginPath();
    chickenCtx.moveTo(0, laneY);
    chickenCtx.lineTo(w, laneY);
    chickenCtx.stroke();
    chickenCtx.setLineDash([]);

    // Multiplier label aan de rechterrand
    chickenCtx.fillStyle = "rgba(255, 215, 0, 0.75)";
    chickenCtx.font = "900 11px Montserrat";
    chickenCtx.textAlign = "right";
    chickenCtx.fillText(`${chickenMultipliers[l - 1]}x`, w - 8, laneY + laneHeight / 2 + 4);
  }

  // 4. Update & Render Auto's met Betonblok Botsing Detectie
  chickenVehicles.forEach(v => {
    const isProtectedLane = safeConcreteLanes.includes(v.lane);

    if (isProtectedLane) {
      // Auto botst tegen betonblok links of rechts van de kip en keert om
      const barrierLeft = centerX - 36;
      const barrierRight = centerX + 36;

      if (v.speed > 0 && v.x > barrierLeft - 25 && v.x < centerX) {
        v.speed = -Math.abs(v.baseSpeed); // Kaatst terug
      } else if (v.speed < 0 && v.x < barrierRight + 25 && v.x > centerX) {
        v.speed = Math.abs(v.baseSpeed); // Kaatst terug
      }
    } else {
      v.speed = v.baseSpeed;
    }

    v.x += v.speed;
    if (v.speed > 0 && v.x > w + 40) v.x = -40;
    if (v.speed < 0 && v.x < -40) v.x = w + 40;

    chickenCtx.font = "24px sans-serif";
    chickenCtx.textAlign = "center";
    chickenCtx.textBaseline = "middle";

    // Auto koplampen
    if (v.speed > 0) {
      chickenCtx.fillStyle = "rgba(255, 255, 200, 0.15)";
      chickenCtx.beginPath();
      chickenCtx.moveTo(v.x + 15, v.y);
      chickenCtx.lineTo(v.x + 65, v.y - 12);
      chickenCtx.lineTo(v.x + 65, v.y + 12);
      chickenCtx.fill();
    } else {
      chickenCtx.fillStyle = "rgba(255, 255, 200, 0.15)";
      chickenCtx.beginPath();
      chickenCtx.moveTo(v.x - 15, v.y);
      chickenCtx.lineTo(v.x - 65, v.y - 12);
      chickenCtx.lineTo(v.x - 65, v.y + 12);
      chickenCtx.fill();
    }

    chickenCtx.fillText(v.icon, v.x, v.y);
  });

  // 5. Render de Betonblokken op veilige banen
  safeConcreteLanes.forEach(laneNum => {
    const laneY = (h - 35) - (laneNum * laneHeight) + (laneHeight / 2);
    chickenCtx.font = "22px sans-serif";
    chickenCtx.textAlign = "center";
    chickenCtx.textBaseline = "middle";
    chickenCtx.fillText("🧱", centerX - 32, laneY);
    chickenCtx.fillText("🧱", centerX + 32, laneY);
  });

  // 6. Render de Kip
  let curY = targetChickenY;
  if (isChickenHopping) {
    const prevY = (h - 35) - ((chickenLane) * laneHeight) + (laneHeight / 2);
    const hopArc = Math.sin(hopProgress * Math.PI) * 18; // Soepele boog
    curY = prevY + (targetChickenY - prevY) * hopProgress - hopArc;
  } else {
    curY = (h - 35) - (chickenLane * laneHeight) + (laneHeight / 2);
  }

  chickenCtx.font = isChickenAlive ? "28px sans-serif" : "32px sans-serif";
  chickenCtx.textAlign = "center";
  chickenCtx.textBaseline = "middle";

  if (isChickenAlive) {
    // Schaduw
    chickenCtx.fillStyle = "rgba(0,0,0,0.4)";
    chickenCtx.beginPath();
    chickenCtx.ellipse(centerX, curY + 12, 10, 4, 0, 0, Math.PI * 2);
    chickenCtx.fill();

    chickenCtx.fillText("🐔", centerX, curY);
  } else {
    chickenCtx.fillText("🍗💥", centerX, curY);
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
  const payout = Math.round(plinkoBet * mult);
  const profit = payout - plinkoBet;

  if (mult >= 1) {
    openWinnerModal({
      icon: mult >= 10 ? "⚡" : "🎯",
      heading: `${mult}X PLINKO MULTIPLIER!`,
      multiplierTag: `${mult}X SLOT HIT`,
      payoutText: `BETAAL ${payout} FICHES UIT (+${profit} winst)`,
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
