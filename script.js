const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let aimX = canvas.width / 2;
let aimY = canvas.height / 2;
let sensitivity = 0.5;

let target = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: 15
};

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === canvas) {
    aimX += e.movementX * sensitivity;
    aimY += e.movementY * sensitivity;
    aimX = Math.max(0, Math.min(canvas.width, aimX));
    aimY = Math.max(0, Math.min(canvas.height, aimY));
  }
});

canvas.addEventListener("mousedown", () => {
  const dx = aimX - target.x;
  const dy = aimY - target.y;
  if (Math.hypot(dx, dy) < target.r) {
    target.x = Math.random() * canvas.width;
    target.y = Math.random() * canvas.height;
  }
});

const sens = document.getElementById("sens");
const sensVal = document.getElementById("sensVal");
sens.addEventListener("input", () => {
  sensitivity = parseFloat(sens.value);
  sensVal.textContent = sensitivity;
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(aimX - 10, aimY);
  ctx.lineTo(aimX + 10, aimY);
  ctx.moveTo(aimX, aimY - 10);
  ctx.lineTo(aimX, aimY + 10);
  ctx.stroke();

  requestAnimationFrame(loop);
}
loop();

