const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== 視点（角度）=====
let yaw = 0;
let pitch = 0;

// ===== VAL感度設定 =====
const DPI = 800;
const VAL_SENS = 0.25;
const VAL_YAW = 0.07; // VAL固定値

// ===== スコア =====
let score = 0;

// ===== 的（3D空間）=====
const target = {
  x: (Math.random() - 0.5) * 6,
  y: (Math.random() - 0.5) * 4,
  z: 6,
  r: 0.4,
  vx: 0.03 // ストレイフ速度（VAL歩き寄り）
};

// ===== ポインターロック =====
canvas.addEventListener("mousedown", () => {
  canvas.requestPointerLock();
});

// ===== 視点操作（VAL式）=====
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;

  const scale = VAL_SENS * VAL_YAW * (DPI / 800);

  yaw   += e.movementX * scale;
  pitch -= e.movementY * scale;

  pitch = Math.max(-1.3, Math.min(1.3, pitch));
});

// ===== メインループ =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- 的ストレイフ ---
  target.x += target.vx;
  if (Math.abs(target.x) > 3) target.vx *= -1;

  // --- 視点変換 ---
  const dx = target.x - yaw;
  const dy = target.y - pitch;
  const dz = target.z;

  if (dz > 0) {
    const scale = 600 / dz;

    const sx = canvas.width / 2 + dx * scale;
    const sy = canvas.height / 2 + dy * scale;
    const sr = target.r * scale;

    // --- 的描画 ---
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    // --- ヒット判定（中央固定） ---
    if (Math.hypot(sx - canvas.width / 2, sy - canvas.height / 2) < sr) {
      score++;
      target.x = (Math.random() - 0.5) * 6;
      target.y = (Math.random() - 0.5) * 4;
      target.z = Math.random() * 3 + 4;
    }
  }

  // --- クロスヘア（固定） ---
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 8, canvas.height / 2);
  ctx.lineTo(canvas.width / 2 + 8, canvas.height / 2);
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - 8);
  ctx.lineTo(canvas.width / 2, canvas.height / 2 + 8);
  ctx.stroke();

  // --- スコア ---
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(loop);
}

loop();
