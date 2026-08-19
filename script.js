const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let currentBet = 50;
let isSpinning = false;
let rotation = 0;

const segments = ["+50", "BANK", "+100", "ZING", "+200", "BANK", "JACKPOT", "PUSHUP"];

function draw() {
    const r = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    segments.forEach((s, i) => {
        const a = rotation + (i * (Math.PI*2/8));
        ctx.beginPath(); ctx.moveTo(r,r); ctx.arc(r,r,r,a, a+(Math.PI*2/8));
        ctx.fillStyle = i%2 ? "#222" : "#444"; ctx.fill();
        ctx.stroke();
    });
}

function spinWheel() {
    if(isSpinning) return;
    isSpinning = true;
    let target = rotation + 20 + Math.random() * 10;
    let start = performance.now();
    
    function anim(now) {
        let p = Math.min((now - start) / 4000, 1);
        rotation = rotation + (target - rotation) * (1 - Math.pow(1 - p, 3));
        draw();
        if(p < 1) requestAnimationFrame(anim);
        else { isSpinning = false; document.getElementById("result-overlay").innerText = "UITSLAG: " + segments[Math.floor(rotation % (Math.PI*2) / (Math.PI*2/8))]; }
    }
    requestAnimationFrame(anim);
}

function setBet(b) { 
    currentBet = b; 
    document.querySelectorAll('#bet-rack button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

canvas.width = canvas.height = 600;
draw();
