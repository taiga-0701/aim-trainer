const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== FPS視点 =====
let cx = canvas.width / 2;
let cy = canvas.height / 2;

let sensitivity = 1;
const VAL_YAW = 0.07;

// ===== スコア =====
let score = 0;

// ===== 的（3Dっぽく）=====
const target = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  z: 1.0,        // 距離（小さいほど近い）
  r: 22,
  vx: 1.8       // 横移動速度（VAL歩き寄り）
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

  // --- 的の移動（ストレイフ） ---
  target.x += target.vx;
  if (target.x < 100 || target.x > canvas.width - 100) {
    target.vx *= -1;
  }

  // --- 奥行き（距離でサイズ変化） ---
  const scale = 1 / target.z;
  const drawR = target.r * scale;

  // --- 的描画 ---
  ctx.beginPath();
  ctx.arc(target.x, target.y, drawR, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // --- クロスヘア ---
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();

  // --- ヒット判定 ---
  const dx = cx - target.x;
  const dy = cy - target.y;
  if (Math.hypot(dx, dy) <= drawR) {
    score++;

    // リスポーン
    target.x = Math.random() * (canvas.width - 200) + 100;
    target.y = Math.random() * (canvas.height - 200) + 100;
    target.z = Math.random() * 0.6 + 0.6; // 距離ランダム
  }

  // --- スコア表示 ---
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(loop);
}

loop();



