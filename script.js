// ==========================================================
// 👑 GLOBAL STATE & AUDIO ENGINE (Web Audio API)
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

  if (type === "horn") {
    // Race toeter
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
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
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

function triggerConfetti() {
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: ['#ffd700', '#ffffff', '#00ff88', '#ff2a55'] });
}

// ==========================================================
// 🧭 ROUTING / VIEW SWITCHER
// ==========================================================
const backBtn = document.getElementById("backToLobbyBtn");
const dealerStatus = document.getElementById("dealerStatus");
const dealerInfo = document.getElementById("dealerInfo");

function showLobby() {
  activeGame = "lobby";
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-lobby").classList.add("active");
  backBtn.classList.add("hidden");
  dealerStatus.innerText = "WELKOM IN HET CASINO";
  dealerInfo.innerText = "Kies een spel om te beginnen";
}

function openGame(gameKey) {
  activeGame = gameKey;
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${gameKey}`).classList.add("active");
  backBtn.classList.remove("hidden");

  if (gameKey === "wheel") {
    dealerStatus.innerText = "RAD VAN FORTUIN";
    dealerInfo.innerText = "Plaats je inzet & draai!";
    setTimeout(resizeWheelCanvas, 50);
  } else if (gameKey === "race") {
    dealerStatus.innerText = "PAARDENRACE DERBY";
    dealerInfo.innerText = "Kies je winnende paard";
    renderRaceHorses();
  } else if (gameKey === "cups") {
    dealerStatus.innerText = "3 BEKERS & BALLETJE";
    dealerInfo.innerText = "Zet in & druk op schudden";
    resetCupsView();
  }
}

// ==========================================================
// 🎡 GAME 1: RAD VAN FORTUIN
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

const wheelCanvas = document.getElementById("wheelCanvas");
const wheelCtx = wheelCanvas.getContext("2d");
const wheelSpinBtn = document.getElementById("wheelSpinBtn");
const wheelBetInput = document.getElementById("wheelBetInput");
const wheelNeedle = document.getElementById("wheelNeedle");
const wheelHistoryEl = document.getElementById("wheelHistory");

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
  const radius = center - 10;
  const arc = (2 * Math.PI) / wheelSegments.length;

  wheelCtx.clearRect(0, 0, size, size);

  // Rand
  wheelCtx.save();
  wheelCtx.beginPath();
  wheelCtx.arc(center, center, radius + 6, 0, 2 * Math.PI);
  wheelCtx.fillStyle = "#161104"; wheelCtx.fill();
  wheelCtx.lineWidth = 8; wheelCtx.strokeStyle = "#cca000"; wheelCtx.stroke();
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

  // Pennen
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
    dealerStatus.innerText = "🎉 GEWONNEN!";
    dealerInfo.innerHTML = `BETAAL UIT: <span style="color:#00ff88;">${win} FICHES</span>`;
    playSound("win"); triggerConfetti();
    logText = `WINST: ${seg.label} ➔ ${win}`;
  } else if (seg.type === "fixed") {
    const win = wheelBet + seg.val;
    dealerStatus.innerText = "🎁 BONUS VAKJE!";
    dealerInfo.innerHTML = `BETAAL UIT: <span style="color:#2980b9;">${win} FICHES</span>`;
    playSound("win"); triggerConfetti();
    logText = `BONUS: +${seg.val} ➔ ${win}`;
  } else if (seg.type === "bust") {
    dealerStatus.innerText = "💀 HUIS WINT ALLES!";
    dealerInfo.innerText = `Bankroet! Neem ${wheelBet} fiches in.`;
    playSound("bust");
    logText = `BANKROET (-${wheelBet})`;
  } else if (seg.type === "task") {
    dealerStatus.innerText = "🎭 OPDRACHT!";
    dealerInfo.innerText = seg.label;
    playSound("win");
    logText = `OPDRACHT: ${seg.label}`;
  }

  if (wheelHistory.length === 0) wheelHistoryEl.innerHTML = "";
  wheelHistory.unshift(logText);
  if (wheelHistory.length > 3) wheelHistory.pop();
  wheelHistoryEl.innerHTML = wheelHistory.map(t => `<li class="hw-item">${t}</li>`).join("");
}

// ==========================================================
// 🐎 GAME 2: PAARDENRACE ROYALE
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

  dealerStatus.innerText = "🏁 DE RACE IS BEGONNEN!";
  dealerInfo.innerText = `Jouw paard: ${horses[selectedHorse].name} (${horses[selectedHorse].odds}x)`;
  playSound("horn");

  const trackWidth = document.getElementById("raceTrack").clientWidth - 110;
  const positions = horses.map(() => 0);
  document.querySelectorAll(".horse-runner").forEach(el => el.classList.add("horse-running"));

  const raceInterval = setInterval(() => {
    let winner = null;

    horses.forEach((h, i) => {
      // Snelheid met lichte random variatie
      const speed = (Math.random() * 4) + (Math.random() > 0.85 ? 4 : 1);
      positions[i] += speed;

      const runner = document.getElementById(`runner-${h.id}`);
      if (runner) runner.style.transform = `translateX(${positions[i]}px)`;

      if (positions[i] >= trackWidth && winner === null) {
        winner = h;
      }
    });

    if (winner !== null) {
      clearInterval(raceInterval);
      isRacing = false;
      document.getElementById("startRaceBtn").disabled = false;
      document.querySelectorAll(".horse-runner").forEach(el => el.classList.remove("horse-running"));

      if (winner.id === selectedHorse) {
        const payout = Math.round(raceBet * winner.odds);
        dealerStatus.innerText = `🎉 JOUW PAARD HEEFT GEWONNEN!`;
        dealerInfo.innerHTML = `BETAAL UIT: <span style="color:#00ff88;">${payout} FICHES</span> (${winner.name})`;
        playSound("win");
        triggerConfetti();
      } else {
        dealerStatus.innerText = `💀 ${winner.name} WINT DE RACE!`;
        dealerInfo.innerText = `Helaas verloren! Neem ${raceBet} fiches in.`;
        playSound("bust");
      }
    }
  }, 40);
}

// ==========================================================
// 🎪 GAME 3: 3 BEKERS & BALLETJE
// ==========================================================
let cupsBet = 50;
let ballPosition = 1; // 0, 1 of 2
let isShuffling = false;
let canPick = false;
let cupOrder = [0, 1, 2]; // Huidige visuele slots

function setCupsBet(amt) {
  if (isShuffling) return;
  cupsBet = Math.max(5, amt);
  document.getElementById("cupsBetInput").value = cupsBet;
}

document.getElementById("cupsBetInput").addEventListener("input", (e) => {
  cupsBet = Math.max(1, parseInt(e.target.value) || 0);
});

function resetCupsView() {
  isShuffling = false;
  canPick = false;
  cupOrder = [0, 1, 2];
  document.getElementById("shuffleCupsBtn").disabled = false;
  document.querySelectorAll(".cup-wrapper").forEach(c => c.classList.remove("lifted"));
  document.querySelectorAll(".ball").forEach(b => b.classList.remove("visible"));
  updateCupSlotPositions();
}

function updateCupSlotPositions() {
  const slotWidths = [5, 38, 72];
  cupOrder.forEach((cupId, slotIdx) => {
    const slotEl = document.getElementById(`slot-${cupId}`);
    if (slotEl) slotEl.style.left = `${slotWidths[slotIdx]}%`;
  });
}

function startCupShuffle() {
  if (isShuffling) return;
  isShuffling = true;
  canPick = false;
  document.getElementById("shuffleCupsBtn").disabled = true;

  // 1. Toon eerst waar de bal zit
  ballPosition = Math.floor(Math.random() * 3);
  document.querySelectorAll(".ball").forEach(b => b.classList.remove("visible"));
  document.getElementById(`ball-${ballPosition}`).classList.add("visible");
  document.getElementById(`cup-${ballPosition}`).classList.add("lifted");
  dealerStatus.innerText = "KIJK GOED WAAR DE BAL ZIT...";
  dealerInfo.innerText = `Beker ${ballPosition + 1} heeft de bal!`;
  playSound("win");

  setTimeout(() => {
    // 2. Doe de beker omlaag
    document.querySelectorAll(".cup-wrapper").forEach(c => c.classList.remove("lifted"));
    dealerStatus.innerText = "BEKERS WORDEN GESCHUD...";
    dealerInfo.innerText = "Volg de juiste beker!";

    setTimeout(() => {
      // 3. Start shuffling animaties
      let shufflesLeft = 8;
      const shuffleTimer = setInterval(() => {
        // Swap 2 random slots
        const i1 = Math.floor(Math.random() * 3);
        let i2 = Math.floor(Math.random() * 3);
        while (i1 === i2) i2 = Math.floor(Math.random() * 3);

        const temp = cupOrder[i1];
        cupOrder[i1] = cupOrder[i2];
        cupOrder[i2] = temp;

        updateCupSlotPositions();
        playSound("whoosh");
        shufflesLeft--;

        if (shufflesLeft <= 0) {
          clearInterval(shuffleTimer);
          isShuffling = false;
          canPick = true;
          dealerStatus.innerText = "WAAR ZIT DE BAL?";
          dealerInfo.innerText = "Klik op één van de 3 bekers om te raden!";
        }
      }, 380);

    }, 800);
  }, 1200);
}

function pickCup(cupId) {
  if (!canPick) return;
  canPick = false;

  // Til alle bekers op
  document.querySelectorAll(".cup-wrapper").forEach(c => c.classList.add("lifted"));

  if (cupId === ballPosition) {
    const win = cupsBet * 3;
    dealerStatus.innerText = "🎉 JUIST GERADEN!";
    dealerInfo.innerHTML = `BETAAL UIT: <span style="color:#00ff88;">${win} FICHES</span> (3x Winst!)`;
    playSound("win");
    triggerConfetti();
  } else {
    dealerStatus.innerText = "💀 HELAAS, VERKEERDE BEKER!";
    dealerInfo.innerText = `De bal zat in beker ${ballPosition + 1}. Neem ${cupsBet} fiches in.`;
    playSound("bust");
  }

  document.getElementById("shuffleCupsBtn").disabled = false;
}
