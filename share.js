// ============================================
//   SHARE.JS — SHARE CARD GENERATOR
// ============================================

function shareCountdown() {
  const saved = localStorage.getItem('castData');
  if (!saved) return;
  generateAndShare(JSON.parse(saved), false);
}

function generateAndShare(data, isCelebration) {
  const canvas = document.getElementById('share-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = 600;
  canvas.height = 400;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 600, 400);
  if (isCelebration) {
    bg.addColorStop(0, '#f7971e');
    bg.addColorStop(1, '#ffd200');
  } else {
    bg.addColorStop(0, '#0a0a1a');
    bg.addColorStop(0.5, '#1a0a2e');
    bg.addColorStop(1, '#0a0a1a');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 400);

  // Decorative circles
  ctx.beginPath();
  ctx.arc(500, 80, 120, 0, Math.PI * 2);
  ctx.fillStyle = isCelebration
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(108,99,255,0.15)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(100, 350, 80, 0, Math.PI * 2);
  ctx.fillStyle = isCelebration
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(236,72,153,0.1)';
  ctx.fill();

  // White card
  ctx.fillStyle = isCelebration
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(255,255,255,0.06)';
  roundRect(ctx, 40, 40, 520, 320, 24);

  // Calculate values
  const castDateObj   = new Date(data.castDate);
  const today         = new Date();
  const daysSinceCast = Math.floor((today - castDateObj) / 86400000);
  const daysLeft      = Math.max(data.totalDays - daysSinceCast, 0);
  const percent       = Math.min(Math.round((daysSinceCast / data.totalDays) * 100), 100);

  ctx.textAlign = 'center';

  // App name
  ctx.fillStyle = isCelebration ? '#1a1a2e' : '#6c63ff';
  ctx.font      = 'bold 20px Nunito, sans-serif';
  ctx.fillText('🦴 CastCountdown', 300, 85);

  // Bone info
  ctx.fillStyle = isCelebration ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.4)';
  ctx.font      = '14px Nunito, sans-serif';
  ctx.fillText(`${data.boneName} · ${data.fractureName}`, 300, 112);

  if (isCelebration) {
    ctx.font      = '60px sans-serif';
    ctx.fillText('🎉', 300, 195);

    ctx.fillStyle = '#1a1a2e';
    ctx.font      = 'bold 32px Nunito, sans-serif';
    ctx.fillText("I'M CAST FREE!", 300, 240);

    ctx.fillStyle = 'rgba(26,26,46,0.6)';
    ctx.font      = '18px Nunito, sans-serif';
    ctx.fillText(`${data.totalDays} days of healing — DONE! 🏆`, 300, 272);

  } else {
    // Big days number
    ctx.font      = 'bold 90px Nunito, sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(daysLeft, 300, 230);

    ctx.font      = 'bold 13px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('D A Y S  L E F T', 300, 255);

    // Progress bar bg
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, 80, 272, 440, 14, 7);

    // Progress bar fill
    const fillW = Math.round(440 * (percent / 100));
    if (fillW > 0) {
      const grad = ctx.createLinearGradient(80, 0, 80 + fillW, 0);
      grad.addColorStop(0, '#6c63ff');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      roundRect(ctx, 80, 272, fillW, 14, 7);
    }

    // Percent
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font      = 'bold 12px Nunito, sans-serif';
    ctx.fillText(`${percent}% healed`, 300, 306);
  }

  // Website URL
  ctx.fillStyle = isCelebration ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.25)';
  ctx.font      = '12px Nunito, sans-serif';
  ctx.fillText('castcountdown.me', 300, 340);

  // Share!
  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'castcountdown.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: '🦴 CastCountdown',
          text:  isCelebration
            ? `🎉 I'm finally CAST FREE after ${data.totalDays} days! Track yours → castcountdown.me`
            : `🦴 Only ${daysLeft} days until my cast comes off! I'm ${percent}% healed! → castcountdown.me`,
          files: [file]
        });
      } catch (e) {
        downloadCanvas(canvas);
      }
    } else {
      downloadCanvas(canvas);
    }
  }, 'image/png');
}

function downloadCanvas(canvas) {
  const a  = document.createElement('a');
  a.href   = canvas.toDataURL('image/png');
  a.download = 'my-cast-countdown.png';
  a.click();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
  ctx.fill();
}
