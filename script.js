const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== FPS視点設定 =====
let cx = canvas.width / 2;
let cy = canvas.height / 2;

let sensitivity = 0.25; // VAL感度
const VAL_YAW = 0.07;

// ===== スコア =====
let score = 0;

// ===== 的 =====
const target = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: 18
};

// ===== ポインターロック =====
canvas.addEventListener("mousedown", () => {
  if (document.pointerLockElement !== canvas) {
    canvas.requestPointerLock();
  }
});

// ===== 視点移動 =====
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;

  cx += e.movementX * sensitivity * VAL_YAW;
  cy += e.movementY * sensitivity * VAL_YAW;

  cx = Math.max(0, Math.min(canvas.width, cx));
  cy = Math.max(0, Math.min(canvas.height, cy));
});

// ===== メインループ =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 的描画
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // クロスヘア
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();

  // ヒット判定（クリック不要）
  const dx = cx - target.x;
  const dy = cy - target.y;
  if (Math.hypot(dx, dy) <= target.r) {
    score++;
    target.x = Math.random() * canvas.width;
    target.y = Math.random() * canvas.height;
  }

  // スコア表示
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(loop);
}

loop();


