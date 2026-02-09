const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== クロスヘア位置 =====
let cx = canvas.width / 2;
let cy = canvas.height / 2;

// ===== 感度（VAL 800dpi / 0.25 体感寄せ）=====
let sensitivity = 0.18;

// ===== スコア =====
let score = 0;

// ===== 的（固定）=====
const target = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 28
};

// ===== ポインターロック =====
canvas.addEventListener("mousedown", () => {
  canvas.requestPointerLock();
});

// ===== マウスでクロスヘア移動 =====
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;

  cx += e.movementX * sensitivity;
  cy += e.movementY * sensitivity;

  cx = Math.max(0, Math.min(canvas.width, cx));
  cy = Math.max(0, Math.min(canvas.height, cy));
});

// ===== メインループ =====
function loop() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 的
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = "#ff4655";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.stroke();

  // クロスヘア
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy);
  ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx, cy + 12);
  ctx.stroke();

  // ヒット判定（重なったら即）
  const dx = cx - target.x;
  const dy = cy - target.y;
  if (Math.hypot(dx, dy) < target.r) {
    score++;
    target.x = Math.random() * (canvas.width - 200) + 100;
    target.y = Math.random() * (canvas.height - 200) + 100;
  }

  // スコア
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(loop);
}

loop();
