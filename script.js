const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const nameInput = document.getElementById('playerName');
const saveNameBtn = document.getElementById('saveName');
const rankingEl = document.getElementById('ranking');

const modeSel = document.getElementById('mode');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let running = false;
let score = 0;
let startTime = 0;
let target = null;

const mouse = { x: 0, y: 0 };

canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});

canvas.addEventListener('mousedown', () => {
  if (!running || !target) return;
  const dx = mouse.x - target.x;
  const dy = mouse.y - target.y;
  if (Math.sqrt(dx*dx + dy*dy) <= target.r) {
    score += 100;
    spawnTarget();
  }
});

function spawnTarget() {
  target = {
    x: Math.random() * (W - 40) + 20,
    y: Math.random() * (H - 40) + 20,
    r: 14,
    vx: modeSel.value === 'flickMove' ? (Math.random()<0.5?-1:1)*200 : 0
  };
}

function update(dt) {
  if (modeSel.value === 'flickMove' && target) {
    target.x += target.vx * dt;
    if (target.x < target.r || target.x > W - target.r) target.vx *= -1;
  }
}

function draw() {
  ctx.clearRect(0,0,W,H);
  if (!target) return;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI*2);
  ctx.fillStyle = '#ff4d5a';
  ctx.fill();
}

function loop(now) {
  const t = (now - startTime) / 1000;
  timeEl.textContent = 'Time: ' + t.toFixed(1) + 's';
  update(1/60);
  draw();
  if (running) requestAnimationFrame(loop);
}

function saveScore() {
  const name = localStorage.getItem('playerName') || 'no-name';
  const data = JSON.parse(localStorage.getItem('ranking') || '[]');
  data.push({ name, score });
  data.sort((a,b)=>b.score-a.score);
  localStorage.setItem('ranking', JSON.stringify(data.slice(0,10)));
  renderRanking();
}

function renderRanking() {
  rankingEl.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('ranking') || '[]');
  data.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r.name + ' - ' + r.score;
    rankingEl.appendChild(li);
  });
}

saveNameBtn.onclick = () => {
  if (nameInput.value) {
    localStorage.setItem('playerName', nameInput.value);
    alert('saved');
  }
};

startBtn.onclick = () => {
  score = 0;
  startTime = performance.now();
  running = true;
  spawnTarget();
  requestAnimationFrame(loop);
};

stopBtn.onclick = () => {
  running = false;
  saveScore();
};

nameInput.value = localStorage.getItem('playerName') || '';
renderRanking();
