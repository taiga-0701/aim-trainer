const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let cx = canvas.width / 2;
let cy = canvas.height / 2;

let sensitivity = 0.5;
let score = 0;

const target = {
  x: rand(50, canvas.width - 50),
  y: rand(50, canvas.height - 50),
  r: 18
};

// ===== FPS Pointer Lock =====
canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;

  cx += e.movementX * sensitivity;
  cy += e.movementY * sensitivity;

  cx = clamp(cx, 0, canvas.width);
  cy = clamp(cy, 0, canvas.height);
});

// ===== Shooting =====
canvas.addEventListener("mousedown", () => {
  const dx = cx - target.x;
  const dy = cy - target.y;
  if (Math.hypot(dx, dy) <= target.r) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    respawn();
  }
});

// ===== Sens UI =====
const sensInput = document.getElementById("sens");
const sensVal = document.getElementById("sensVal");

sensInput.addEventListener("input", () => {
  sensitivity = parseFloat(sensInput.value);
  sensVal.textContent = sensitivity.toFixed(2);
});

// ===== Draw Loop =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // target
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = "#e53935";
  ctx.fill();

  // crosshair
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();

  requestAnimationFrame(loop);
}

loop();

// ===== Utils =====
function respawn() {
  target.x = rand(50, canvas.width - 50);
  target.y = rand(50, canvas.height - 50);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}


