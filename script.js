const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let cx = canvas.width / 2;
let cy = canvas.height / 2;

let sensitivity = 0.25;
let score = 0;

const target = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: Math.random() * (canvas.height - 100) + 50,
  r: 18
};

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;
  cx += e.movementX * sensitivity;
  cy += e.movementY * sensitivity;
  cx = Math.max(0, Math.min(canvas.width, cx));
  cy = Math.max(0, Math.min(canvas.height, cy));
});

canvas.addEventListener("mousedown", () => {
  const dx = cx - target.x;
  const dy = cy - target.y;
  if (Math.hypot(dx, dy) <= target.r) {
    score++;
    target.x = Math.random() * (canvas.width - 100) + 50;
    target.y = Math.random() * (canvas.height - 100) + 50;
  }
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();

  requestAnimationFrame(loop);
}
loop();



