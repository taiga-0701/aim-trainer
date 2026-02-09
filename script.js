const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== 視点角度 =====
let yaw = 0;
let pitch = 0;

// ===== VAL設定 =====
const VAL_SENS = 0.25; // 800dpi想定
const VAL_YAW = 0.07;

// ===== スコア =====
let score = 0;

// ===== 的（ワールド座標）=====
const target = {
  x: 0,
  y: 0,
  z: 6,
  r: 0.4,
  vx: 0.03
};

// ===== ポインターロック =====
canvas.addEventListener("mousedown", () => {
  canvas.requestPointerLock();
});

// ===== マウス = 視点回転 =====
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement !== canvas) return;

  const rot = VAL_SENS * VAL_YAW;

  yaw   += e.movementX * rot;
  pitch -= e.movementY * rot;

  pitch = Math.max(-1.3, Math.min(1.3, pitch));
});

// ===== メインループ =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- 的ストレイフ（世界内で移動） ---
  target.x += target.vx;
  if (Math.abs(target.x) > 3) target.vx *= -1;

  // --- カメラ座標変換 ---
  const rx = target.x - yaw;
  const ry = target.y - pitch;
  const rz = target.z;

  if (rz > 0) {
    const scale = 600 / rz;

    const sx = canvas.width / 2 + rx * scale;
    const sy = canvas.height / 2 + ry * scale;
    const sr = target.r * scale;

    // 的描画
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    // ヒット判定（中央固定）
    if (Math.hypot(sx - canvas.width / 2, sy - canvas.height / 2) < sr) {
      score++;
      target.x = (Math.random() - 0.5) * 6;
      target.y = (Math.random() - 0.5) * 4;
      target.z = Math.random() * 3 + 4;
    }
  }

  // --- クロスヘア（完全固定） ---
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 8, canvas.height / 2);
  ctx.lineTo(canvas.width / 2 + 8, canvas.height / 2);
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - 8);
  ctx.lineTo(canvas.width / 2, canvas.height / 2 + 8);
  ctx.stroke();

  // スコア
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(loop);
}

loop();
