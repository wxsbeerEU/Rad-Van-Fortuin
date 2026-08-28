// ==========================================================
// 🧪 RICK & MORTY AUDIO ENGINE & RIGGED CASINO LOGICA
// ==========================================================
let activeGame = "lobby";
let currentGlobalBet = 10; // Standaard 1 briefje van 10
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, param = 0) {
  if (audioCtx.state === "suspended") audioCtx.resume();

  if (type === "click") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    const freq = 500 + (1 - param) * 400;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.035);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.035);
  }

  if (type === "portal_shield") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  }

  if (type === "morty_hop") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(450 + param * 50, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
  }

  if (type === "disintegrate") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.4);
  }

  if (type === "peg") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600 + Math.random() * 400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.04);
  }

  if (type === "horn") {
    [300, 450, 600, 900].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 0.35);
    });
  }

  if (type === "teleport") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.12);
  }

  if (type === "win") {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 0.35);
    });
  }

  if (type === "bust") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(45, audioCtx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.35);
  }
}

function triggerConfetti(isGrand = false) {
  confetti({ 
    particleCount: isGrand ? 120 : 70, 
    spread: isGrand ? 90 : 60, 
    origin: { y: 0.6 }, 
    colors: ['#39ff14', '#00ffff', '#a6ff00', '#ffffff', '#ff2a55'] 
  });
}

// ==========================================================
// 💰 INZET BEHEER (PUUR IN BRIEFJES VAN 10, 20 OF 30)
// ==========================================================
function setCashBet(amount) {
  currentGlobalBet = amount;
  
  ['raceBetDisplay', 'cupsBetDisplay', 'chickenBetDisplay', 'plinkoBetDisplay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = currentGlobalBet;
  });

  document.querySelectorAll('.current-bet-label').forEach(el => {
    el.innerText = currentGlobalBet;
  });

  document.querySelectorAll('.bet-bills-selector').forEach(container => {
    container.querySelectorAll('.bill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.includes(`${currentGlobalBet / 10}×`));
    });
  });
}

// ==========================================================
// 🌌 PARTICLES
// ==========================================================
const bgCanvas = document.getElementById("ambientParticlesCanvas");
const bgCtx = bgCanvas.getContext("2d");
let bgParticles = [];

function initAmbientParticles() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgParticles = [];
  for (let i = 0; i < 45; i++) {
    bgParticles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 2.5 + 1,
      vy: -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#39ff14' : '#00ffff'
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
    bgCtx.fillStyle = p.color;
    bgCtx.globalAlpha = p.alpha;
    bgCtx.fill();
    bgCtx.globalAlpha = 1;
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
  document.getElementById("modalIcon").innerText = config.icon || "🧪";
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
// 🧭 ROUTING
// ==========================================================
const backBtn = document.getElementById("backToLobbyBtn");
const dealerStatus = document.getElementById("dealerStatus");
const dealerInfo = document.getElementById("dealerInfo");

function showLobby() {
  activeGame = "lobby";
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-lobby").classList.add("active");
  backBtn.classList.add("hidden");
  dealerStatus.innerText = "INTERDIMENSIONALE LOBBY";
  dealerInfo.innerText = "Kies een spel";
}

function lockedWheelAlert() {
  playSound("bust");
  openWinnerModal({
    icon: "🚫",
    heading: "RAD IS GESLOTEN!",
    multiplierTag: "VERHUISD NAAR RADT",
    payoutText: "DIT RAD IS IN BESLAG GENOMEN DOOR DE CITADEL POLITIE. GA NAAR HET POSTJE 'RADT'!",
    isLoss: true
  });
}

function openGame(gameKey) {
  if (gameKey === "wheel") {
    lockedWheelAlert();
    return;
  }

  activeGame = gameKey;
  document.querySelectorAll(".game-view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${gameKey}`).classList.add("active");
  backBtn.classList.remove("hidden");
  setCashBet(currentGlobalBet);

  if (gameKey === "race") {
    dealerStatus.innerText = "SPACE DERBY";
    dealerInfo.innerText = "Zet in op een racer";
    renderRaceHorses();
  } else if (gameKey === "cups") {
    dealerStatus.innerText = "3 PORTAL FLASKS";
    dealerInfo.innerText = "Volg de buis met de Mega Seed";
    initCupsView();
  } else if (gameKey === "chicken") {
    dealerStatus.innerText = "MORTY ROAD";
    dealerInfo.innerText = "Druk op 'SPRING VOORUIT'!";
    setTimeout(initChickenGame, 50);
  } else if (gameKey === "plinko") {
    dealerStatus.innerText = "CITADEL PLINKO";
    dealerInfo.innerText = "Drop de Mega Seed";
    setTimeout(initPlinkoGame, 50);
  }
}

// ==========================================================
// 🚀 GAME 1: SPACE DERBY (RIGGED: 85% KANS OP VERLIES)
// ==========================================================
const aliens = [
  { id: 0, name: "Pickle Rick", avatar: "🥒", color: "#39ff14" },
  { id: 1, name: "Mr. Meeseeks", avatar: "🔵", color: "#00ffff" },
  { id: 2, name: "Birdperson", avatar: "🦅", color: "#f39c12" },
  { id: 3, name: "Butter Robot", avatar: "🤖", color: "#ffd700" },
  { id: 4, name: "Snowball Mech", avatar: "🐕", color: "#e74c3c" }
];

let selectedHorse = 0;
let isRacing = false;

function renderRaceHorses() {
  const list = document.getElementById("horseBetList");
  const trackLanes = document.getElementById("trackLanes");

  list.innerHTML = aliens.map(h => `
    <div class="horse-bet-card ${h.id === selectedHorse ? 'selected' : ''}" onclick="selectHorse(${h.id})">
      <div class="h-info">
        <span class="h-avatar">${h.avatar}</span>
        <span class="h-name">${h.name}</span>
      </div>
      <span class="h-odds">WINST / VERLIES</span>
    </div>
  `).join("");

  trackLanes.innerHTML = aliens.map(h => `
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

function startHorseRace() {
  if (isRacing) return;
  isRacing = true;
  document.getElementById("startRaceBtn").disabled = true;

  dealerStatus.innerText = "🚀 DE DERBY IS GESTART!";
  dealerInfo.innerText = `Jouw racer: ${aliens[selectedHorse].name}`;
  playSound("horn");

  const trackWidth = document.getElementById("raceTrack").clientWidth - 110;
  const positions = aliens.map(() => 0);
  const commentaryEl = document.getElementById("raceCommentary");
  document.querySelectorAll(".horse-runner").forEach(el => el.classList.add("horse-running"));

  // RIGGED: 85% kans dat speler verliest
  const isRiggedLoss = Math.random() < 0.85;
  let forcedWinnerId = selectedHorse;
  if (isRiggedLoss) {
    const otherAliens = aliens.filter(a => a.id !== selectedHorse);
    forcedWinnerId = otherAliens[Math.floor(Math.random() * otherAliens.length)].id;
  }

  const raceInterval = setInterval(() => {
    let winner = null;

    aliens.forEach((h, i) => {
      let speed = (Math.random() * 3.5) + 1.2;
      if (h.id === forcedWinnerId) speed += 1.8;
      if (isRiggedLoss && h.id === selectedHorse) speed *= 0.75;

      positions[i] += speed;

      const runner = document.getElementById(`runner-${h.id}`);
      if (runner) runner.style.transform = `translateX(${positions[i]}px)`;

      if (positions[i] >= trackWidth && winner === null) {
        winner = h;
      }
    });

    const leaderIdx = positions.indexOf(Math.max(...positions));
    commentaryEl.innerText = `🎙️ KOPLOPER: ${aliens[leaderIdx].name.toUpperCase()} GAAT VOOROP!`;

    if (winner !== null) {
      clearInterval(raceInterval);
      isRacing = false;
      document.getElementById("startRaceBtn").disabled = false;
      document.querySelectorAll(".horse-runner").forEach(el => el.classList.remove("horse-running"));
      commentaryEl.innerText = `🏆 FINISH: ${winner.name.toUpperCase()} WINT!`;

      const numBills = currentGlobalBet / 10;
      if (winner.id === selectedHorse) {
        openWinnerModal({
          icon: "🚀",
          heading: `${winner.name} WINT DE RACE!`,
          multiplierTag: "WINST",
          payoutText: `BETAAL ${numBills} BRIEFJE(S) VAN €10 UIT (INZET VERDUBBELD)`,
          isGrand: true
        });
      } else {
        openWinnerModal({
          icon: "💀",
          heading: `${winner.name} HEEFT GEWONNEN`,
          multiplierTag: "VERLOREN",
          payoutText: `NEEM HET BRIEFJE / DE BRIEFJES VAN €10 IN`,
          isLoss: true
        });
      }
    }
  }, 38);
}

// ==========================================================
// 🧪 GAME 2: 3 PORTAL FLASKS & MEGA SEED (RIGGED: 85% VERLIES)
// ==========================================================
let ballSlot = 1;
let isShuffling = false;
let canPick = false;
const cupSlotPositions = [5, 38, 72];

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

  dealerStatus.innerText = "KIJK GOED WAAR DE MEGA SEED ZIT...";
  dealerInfo.innerText = `Buis ${ballSlot + 1} bevat de Mega Seed!`;
  playSound("win");

  setTimeout(() => {
    document.getElementById(`cupAsset-${ballSlot}`).classList.remove("lifted");
    dealerStatus.innerText = "🧪 REAGEERBUIZEN TELEPORTEREN...";
    dealerInfo.innerText = "Focus op de juiste buis!";

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

        playSound("teleport");
        shufflesLeft--;

        if (shufflesLeft <= 0) {
          clearInterval(shuffleTimer);
          isShuffling = false;
          canPick = true;
          dealerStatus.innerText = "WAAR ZIT DE MEGA SEED?";
          dealerInfo.innerText = "Klik op één van de 3 buizen om te raden!";
        }
      }, 190);

    }, 550);
  }, 1000);
}

function pickCup(clickedCupId) {
  if (!canPick) return;
  canPick = false;

  // RIGGED: 85% kans dat de bal stiekem verplaatst wordt
  if (Math.random() < 0.85 && clickedCupId === ballSlot) {
    const otherSlots = [0, 1, 2].filter(s => s !== clickedCupId);
    ballSlot = otherSlots[Math.floor(Math.random() * otherSlots.length)];
  }

  for (let i = 0; i < 3; i++) {
    const b = document.getElementById(`ball-${i}`);
    if (i === ballSlot) {
      b.classList.add("active-ball");
    } else {
      b.classList.remove("active-ball");
    }
    document.getElementById(`cupAsset-${i}`).classList.add("lifted");
  }

  const numBills = currentGlobalBet / 10;
  if (clickedCupId === ballSlot) {
    openWinnerModal({
      icon: "🌰",
      heading: "MEGA SEED GEVONDEN!",
      multiplierTag: "WINST",
      payoutText: `BETAAL ${numBills} BRIEFJE(S) VAN €10 UIT (INZET VERDUBBELD)`,
      isGrand: false
    });
  } else {
    openWinnerModal({
      icon: "💀",
      heading: "LEGE BUIS GERADEN!",
      multiplierTag: "VERLOREN",
      payoutText: `NEEM HET BRIEFJE / DE BRIEFJES VAN €10 IN`,
      isLoss: true
    });
  }

  document.getElementById("shuffleCupsBtn").disabled = false;
}

// ==========================================================
// 👦 GAME 3: MORTY ROAD (RIGGED: CRASH BINNEN 1 TOT 2 STAPPEN)
// ==========================================================
let chickenLane = 0;
let isChickenGameActive = false;
let isChickenAlive = true;
let isChickenHopping = false;
let deadlyLane = 2;
let safeConcreteLanes = [];

const chickenCanvas = document.getElementById("chickenCanvas");
const chickenCtx = chickenCanvas.getContext("2d");

let chickenAnimationId = null;
let chickenVehicles = [];
let targetChickenY = 0;
let hopProgress = 1;

function initChickenGame() {
  isChickenGameActive = false;
  isChickenAlive = true;
  isChickenHopping = false;
  chickenLane = 0;
  safeConcreteLanes = [];

  document.getElementById("hopChickenBtn").classList.remove("hidden");
  document.getElementById("cashoutChickenBtn").classList.add("hidden");

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
  const laneHeight = (h - 80) / 8;

  const spaceCrafts = ["🛸", "🚀", "🛰️", "🛸", "👾", "🛸", "🌌", "🛸"];

  for (let l = 1; l <= 8; l++) {
    const laneY = (h - 40) - (l * laneHeight) + (laneHeight / 2);
    const dir = (l % 2 === 0) ? 1 : -1;
    const speed = (2.2 + (l * 0.35) + Math.random() * 0.7) * dir;

    chickenVehicles.push({
      lane: l,
      x: Math.random() * w,
      y: laneY,
      speed: speed,
      baseSpeed: speed,
      icon: spaceCrafts[l - 1]
    });

    chickenVehicles.push({
      lane: l,
      x: (Math.random() * w + w / 2) % w,
      y: laneY,
      speed: speed,
      baseSpeed: speed,
      icon: spaceCrafts[(l + 2) % spaceCrafts.length]
    });
  }
}

function hopChickenForward() {
  if (isChickenHopping) return;

  if (!isChickenGameActive) {
    isChickenGameActive = true;
    isChickenAlive = true;
    chickenLane = 0;
    safeConcreteLanes = [];
    // RIGGED: 85% kans dat hij binnen stap 1 of 2 crasht
    deadlyLane = Math.random() < 0.85 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;
  }

  isChickenHopping = true;
  const nextLane = chickenLane + 1;
  const rect = chickenCanvas.getBoundingClientRect();
  const h = rect.height;
  const laneHeight = (h - 80) / 8;

  targetChickenY = (h - 40) - (nextLane * laneHeight) + (laneHeight / 2);
  hopProgress = 0;

  const isDoomed = (nextLane >= deadlyLane);

  playSound("morty_hop", nextLane);

  const hopInterval = setInterval(() => {
    hopProgress += 0.12;
    if (hopProgress >= 1) {
      hopProgress = 1;
      clearInterval(hopInterval);
      isChickenHopping = false;
      chickenLane = nextLane;

      if (isDoomed) {
        isChickenAlive = false;
        isChickenGameActive = false;
        playSound("disintegrate");

        document.getElementById("cashoutChickenBtn").classList.add("hidden");

        setTimeout(() => {
          openWinnerModal({
            icon: "🧬",
            heading: "AW GEEZ! CRONENBERG MORTY!",
            multiplierTag: "VERLOREN",
            payoutText: `NEEM HET BRIEFJE / DE BRIEFJES VAN €10 IN`,
            isLoss: true
          });
          initChickenGame();
        }, 600);

      } else {
        safeConcreteLanes.push(chickenLane);
        playSound("portal_shield");

        document.getElementById("cashoutChickenBtn").classList.remove("hidden");

        if (chickenLane === 8) {
          isChickenGameActive = false;
          document.getElementById("cashoutChickenBtn").classList.add("hidden");

          const numBills = currentGlobalBet / 10;
          setTimeout(() => {
            openWinnerModal({
              icon: "🥫",
              heading: "SZECHUAN SAUCE DESTINATION!",
              multiplierTag: "WINST",
              payoutText: `BETAAL ${numBills} BRIEFJE(S) VAN €10 UIT (INZET VERDUBBELD)`,
              isGrand: true
            });
            initChickenGame();
          }, 500);

        } else {
          dealerStatus.innerText = `🛡️ PORTAL SHIELD ACTIEF OP STRAAT ${chickenLane}!`;
          dealerInfo.innerText = `Druk op 'SPRING VOORUIT' of 'CASH OUT' om je winst te pakken!`;
        }
      }
    }
  }, 20);
}

function cashoutChicken() {
  if (!isChickenGameActive || chickenLane === 0) return;

  isChickenGameActive = false;
  document.getElementById("cashoutChickenBtn").classList.add("hidden");

  const numBills = currentGlobalBet / 10;
  openWinnerModal({
    icon: "🧪",
    heading: "MORTY VEILIG GECASHT!",
    multiplierTag: "WINST",
    payoutText: `BETAAL ${numBills} BRIEFJE(S) VAN €10 UIT (INZET VERDUBBELD)`,
    isGrand: false
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

  const laneHeight = (h - 80) / 8;
  const centerX = w / 2;

  // 1. FINISH ZONE (WINST)
  const finishGrad = chickenCtx.createLinearGradient(0, 0, w, 0);
  finishGrad.addColorStop(0, "#39ff14");
  finishGrad.addColorStop(0.5, "#a6ff00");
  finishGrad.addColorStop(1, "#39ff14");
  chickenCtx.fillStyle = finishGrad;
  chickenCtx.fillRect(0, 0, w, 40);

  chickenCtx.fillStyle = "#000";
  chickenCtx.font = "900 12px 'Orbitron', sans-serif";
  chickenCtx.textAlign = "center";
  chickenCtx.textBaseline = "middle";
  chickenCtx.fillText("🥫 SZECHUAN SAUCE FINISH (WINST!)", w / 2, 20);

  // 2. START ZONE
  chickenCtx.fillStyle = "#1b2838";
  chickenCtx.fillRect(0, h - 40, w, 40);
  chickenCtx.fillStyle = "#00ffff";
  chickenCtx.font = "900 11px 'Orbitron', sans-serif";
  chickenCtx.textAlign = "center";
  chickenCtx.textBaseline = "middle";
  chickenCtx.fillText("🧪 RICK'S GARAGE (START)", w / 2, h - 20);

  // 3. 8 HIGHWAY BANEN
  for (let l = 1; l <= 8; l++) {
    const laneY = (h - 40) - (l * laneHeight);
    const isSafe = safeConcreteLanes.includes(l);

    chickenCtx.fillStyle = isSafe ? "#10281b" : (l % 2 === 0 ? "#0c1524" : "#080e18");
    chickenCtx.fillRect(0, laneY, w, laneHeight);

    chickenCtx.strokeStyle = isSafe ? "rgba(57, 255, 20, 0.5)" : "rgba(0, 255, 255, 0.25)";
    chickenCtx.lineWidth = 2;
    chickenCtx.setLineDash([16, 12]);
    chickenCtx.beginPath();
    chickenCtx.moveTo(0, laneY);
    chickenCtx.lineTo(w, laneY);
    chickenCtx.stroke();
    chickenCtx.setLineDash([]);
  }

  // 4. UFO'S
  chickenVehicles.forEach(v => {
    const isProtectedLane = safeConcreteLanes.includes(v.lane);

    if (isProtectedLane) {
      const barrierLeft = centerX - 38;
      const barrierRight = centerX + 38;

      if (v.speed > 0 && v.x > barrierLeft - 25 && v.x < centerX) {
        v.speed = -Math.abs(v.baseSpeed);
      } else if (v.speed < 0 && v.x < barrierRight + 25 && v.x > centerX) {
        v.speed = Math.abs(v.baseSpeed);
      }
    } else {
      v.speed = v.baseSpeed;
    }

    v.x += v.speed;
    if (v.speed > 0 && v.x > w + 45) v.x = -45;
    if (v.speed < 0 && v.x < -45) v.x = w + 45;

    if (v.speed > 0) {
      const beamGrad = chickenCtx.createLinearGradient(v.x, v.y, v.x + 75, v.y);
      beamGrad.addColorStop(0, "rgba(57, 255, 20, 0.4)");
      beamGrad.addColorStop(1, "rgba(57, 255, 20, 0)");
      chickenCtx.fillStyle = beamGrad;
      chickenCtx.beginPath();
      chickenCtx.moveTo(v.x + 15, v.y);
      chickenCtx.lineTo(v.x + 75, v.y - 10);
      chickenCtx.lineTo(v.x + 75, v.y + 10);
      chickenCtx.fill();
    } else {
      const beamGrad = chickenCtx.createLinearGradient(v.x, v.y, v.x - 75, v.y);
      beamGrad.addColorStop(0, "rgba(0, 255, 255, 0.4)");
      beamGrad.addColorStop(1, "rgba(0, 255, 255, 0)");
      chickenCtx.fillStyle = beamGrad;
      chickenCtx.beginPath();
      chickenCtx.moveTo(v.x - 15, v.y);
      chickenCtx.lineTo(v.x - 75, v.y - 10);
      chickenCtx.lineTo(v.x - 75, v.y + 10);
      chickenCtx.fill();
    }

    chickenCtx.font = "26px sans-serif";
    chickenCtx.textAlign = "center";
    chickenCtx.textBaseline = "middle";
    chickenCtx.fillText(v.icon, v.x, v.y);
  });

  // 5. RICK'S PORTAL SHIELDS
  safeConcreteLanes.forEach(laneNum => {
    const laneY = (h - 40) - (laneNum * laneHeight) + (laneHeight / 2);

    [centerX - 35, centerX + 35].forEach(bx => {
      chickenCtx.fillStyle = "#39ff14";
      chickenCtx.shadowColor = "#39ff14";
      chickenCtx.shadowBlur = 10;
      chickenCtx.beginPath();
      chickenCtx.arc(bx, laneY, 12, 0, Math.PI * 2);
      chickenCtx.fill();
      chickenCtx.shadowBlur = 0;

      chickenCtx.font = "16px sans-serif";
      chickenCtx.textAlign = "center";
      chickenCtx.textBaseline = "middle";
      chickenCtx.fillText("🛡️", bx, laneY);
    });
  });

  // 6. RENDER MORTY
  let curY = targetChickenY;
  if (isChickenHopping) {
    const prevY = (h - 40) - ((chickenLane) * laneHeight) + (laneHeight / 2);
    const hopArc = Math.sin(hopProgress * Math.PI) * 20;
    curY = prevY + (targetChickenY - prevY) * hopProgress - hopArc;
  } else {
    curY = (h - 40) - (chickenLane * laneHeight) + (laneHeight / 2);
  }

  if (isChickenAlive) {
    const auraGrad = chickenCtx.createRadialGradient(centerX, curY, 5, centerX, curY, 26);
    auraGrad.addColorStop(0, "rgba(57, 255, 20, 0.45)");
    auraGrad.addColorStop(1, "rgba(57, 255, 20, 0)");
    chickenCtx.fillStyle = auraGrad;
    chickenCtx.beginPath();
    chickenCtx.arc(centerX, curY, 26, 0, Math.PI * 2);
    chickenCtx.fill();

    chickenCtx.font = "32px sans-serif";
    chickenCtx.textAlign = "center";
    chickenCtx.textBaseline = "middle";
    chickenCtx.fillText("👦", centerX, curY);
  } else {
    chickenCtx.font = "34px sans-serif";
    chickenCtx.textAlign = "center";
    chickenCtx.textBaseline = "middle";
    chickenCtx.fillText("🧬💥", centerX, curY);
  }
}

// ==========================================================
// ⚡ GAME 4: CITADEL PLINKO (RIGGED: 90% NAAR VERLIES ZONE)
// ==========================================================
const plinkoSlots = ["WINST", "VERLIES", "VERLIES", "VERLIES", "VERLIES", "VERLIES", "VERLIES", "VERLIES", "WINST"];
const plinkoCanvas = document.getElementById("plinkoCanvas");
const plinkoCtx = plinkoCanvas.getContext("2d");
let isPlinkoRunning = false;
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

  plinkoPegs.forEach(peg => {
    plinkoCtx.beginPath();
    plinkoCtx.arc(peg.x, peg.y, 4, 0, 2 * Math.PI);
    plinkoCtx.fillStyle = "#39ff14";
    plinkoCtx.shadowColor = "rgba(57, 255, 20, 0.8)";
    plinkoCtx.shadowBlur = 8;
    plinkoCtx.fill();
    plinkoCtx.shadowBlur = 0;
  });

  const slotWidth = width / plinkoSlots.length;
  plinkoSlots.forEach((slotType, i) => {
    const x = i * slotWidth;
    const y = height - 40;

    plinkoCtx.fillStyle = (slotType === "WINST") ? "#39ff14" : "#ff2a55";
    plinkoCtx.fillRect(x + 2, y, slotWidth - 4, 35);
    plinkoCtx.fillStyle = "#000";
    plinkoCtx.font = "900 10px 'Orbitron', sans-serif";
    plinkoCtx.textAlign = "center";
    plinkoCtx.fillText(slotType, x + slotWidth / 2, y + 22);
  });

  if (ball) {
    plinkoCtx.font = "20px sans-serif";
    plinkoCtx.textAlign = "center";
    plinkoCtx.textBaseline = "middle";
    plinkoCtx.fillText("🌰", ball.x, ball.y);
  }
}

function dropPlinkoBall() {
  if (isPlinkoRunning) return;
  isPlinkoRunning = true;
  document.getElementById("dropPlinkoBtn").disabled = true;

  const width = plinkoCanvas.getBoundingClientRect().width;
  const height = plinkoCanvas.getBoundingClientRect().height;

  let ball = {
    x: width / 2 + (Math.random() * 8 - 4),
    y: 20,
    vx: (Math.random() - 0.5) * 0.8,
    vy: 2
  };

  const anim = () => {
    ball.vy += 0.22;
    // RIGGED: Zuigt 90% naar het rode midden
    ball.vx += (width / 2 - ball.x) * 0.003;
    ball.x += ball.vx;
    ball.y += ball.vy;

    plinkoPegs.forEach(peg => {
      const dx = ball.x - peg.x;
      const dy = ball.y - peg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 14) {
        playSound("peg");
        const angle = Math.atan2(dy, dx);
        ball.vx = Math.cos(angle) * (1.8 + Math.random() * 0.8);
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
        plinkoSlots.length - 1,
        Math.max(0, Math.floor(ball.x / (width / plinkoSlots.length)))
      );
      const outcome = plinkoSlots[slotIndex];
      handlePlinkoResult(outcome);
    }
  };

  requestAnimationFrame(anim);
}

function handlePlinkoResult(outcome) {
  const numBills = currentGlobalBet / 10;
  if (outcome === "WINST") {
    openWinnerModal({
      icon: "🌰",
      heading: "WINST ZONE GERAAKT!",
      multiplierTag: "WINST",
      payoutText: `BETAAL ${numBills} BRIEFJE(S) VAN €10 UIT (INZET VERDUBBELD)`,
      isGrand: true
    });
  } else {
    openWinnerModal({
      icon: "💀",
      heading: "VERLIES ZONE GERAAKT",
      multiplierTag: "VERLOREN",
      payoutText: `NEEM HET BRIEFJE / DE BRIEFJES VAN €10 IN`,
      isLoss: true
    });
  }
}
