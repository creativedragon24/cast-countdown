// ============================================
//   SHARE CARD GENERATOR
//   Draws a beautiful image on HTML Canvas
//   then shares it via Web Share API
// ============================================

function shareCountdown() {
  const saved = localStorage.getItem('castData');
  if (!saved) return;
  const data  = JSON.parse(saved);
  generateAndShare(data, false);
}

function generateAndShare(data, isCelebration) {

  const canvas  = document.getElementById('share-canvas');
  const ctx     = canvas.getContext('2d');

  // Canvas size
  canvas.width  = 600;
  canvas.height = 400;

  // --- Background Gradient ---
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  if (isCelebration) {
    gradient.addColorStop(0, '#f7971e');
    gradient.addColorStop(1, '#ffd200');
  } else {
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // --- White Card in Middle ---
  ctx.fillStyle    = 'rgba(255,255,255,0.95)';
  roundRect(ctx, 40, 40, 520, 320, 20);

  // --- Calculate values ---
  const castDateObj   = new Date(data.castDate);
  const today         = new Date();
  const daysSinceCast = Math.floor(
    (today - castDateObj) / (1000 * 60 * 60 * 24)
  );
  const daysLeft      = Math.max(data.totalDays - daysSinceCast, 0);
  const percentHealed = Math.min(
    Math.round((daysSinceCast / data.totalDays) * 100),
    100
  );

  // --- App Name ---
  ctx.fillStyle  = '#667eea';
  ctx.font       = 'bold 22px Segoe UI';
  ctx.textAlign  = 'center';
  ctx.fillText('🦴 CastCountdown', 300, 90);

  // --- Bone & Fracture ---
  ctx.fillStyle  = '#718096';
  ctx.font       = '16px Segoe UI';
  ctx.fillText(`${data.boneName} · ${data.fractureName}`, 300, 120);

  if (isCelebration) {
    // --- CELEBRATION CARD ---
    ctx.fillStyle = '#f7971e';
    ctx.font      = 'bold 60px Segoe UI';
    ctx.fillText('🎉', 300, 200);

    ctx.fillStyle = '#2d3748';
    ctx.font      = 'bold 28px Segoe UI';
    ctx.fillText("I'M CAST FREE!", 300, 240);

    ctx.fillStyle = '#4a5568';
    ctx.font      = '18px Segoe UI';
    ctx.fillText(`${data.totalDays} days of healing complete!`, 300, 272);

  } else {
    // --- COUNTDOWN CARD ---

    // Big days left number
    ctx.fillStyle = '#667eea';
    ctx.font      = 'bold 80px Segoe UI';
    ctx.fillText(daysLeft, 300, 220);

    ctx.fillStyle = '#a0aec0';
    ctx.font      = 'bold 14px Segoe UI';
    ctx.letterSpacing = '4px';
    ctx.fillText('DAYS LEFT', 300, 248);

    // Progress bar background
    ctx.fillStyle    = '#edf2f7';
    roundRect(ctx, 80, 266, 440, 16, 8);

    // Progress bar fill
    const fillWidth  = Math.round(440 * (percentHealed / 100));
    ctx.fillStyle    = '#667eea';
    if (fillWidth > 0) {
      roundRect(ctx, 80, 266, fillWidth, 16, 8);
    }

    // Percent label
    ctx.fillStyle = '#4a5568';
    ctx.font      = 'bold 13px Segoe UI';
    ctx.fillText(`${percentHealed}% healed`, 300, 302);
  }

  // --- Website URL ---
  ctx.fillStyle = '#a0aec0';
  ctx.font      = '13px Segoe UI';
  ctx.fillText('castcountdown.me', 300, 340);

  // --- Share the image ---
  canvas.toBlob(async (blob) => {
    const file = new File(
      [blob],
      'my-cast-countdown.png',
      { type: 'image/png' }
    );

    // Try native share first (mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title:  '🦴 My Cast Countdown!',
          text:   isCelebration
            ? `I'm finally CAST FREE after ${data.totalDays} days! 🎉 Track your cast at castcountdown.me`
            : `Only ${daysLeft} days until my cast comes off! I'm ${percentHealed}% healed! Track yours at castcountdown.me`,
          files:  [file]
        });
      } catch (err) {
        // User cancelled — that's fine
        downloadImage(canvas);
      }
    } else {
      // Desktop fallback — just download the image
      downloadImage(canvas);
    }
  }, 'image/png');
}

// ============================================
//   DOWNLOAD AS IMAGE (Desktop Fallback)
// ============================================
function downloadImage(canvas) {
  const link    = document.createElement('a');
  link.download = 'my-cast-countdown.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

// ============================================
//   HELPER: Draw Rounded Rectangle
// ============================================
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}