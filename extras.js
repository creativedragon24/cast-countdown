// ============================================
//   EXTRAS.JS — Animations & Fun Features
//   UPDATED WITH GSAP + VANTA SUPPORT
// ============================================

// ============================================
//   1. FLOATING BONES BACKGROUND
// ============================================
function createFloatingBones() {
  const bg     = document.getElementById('bones-bg');
  if (!bg) return;
  const emojis = ['🦴','💊','🩺','🏥','❤️‍🩹','⚕️'];

  for (let i = 0; i < 15; i++) {
    const bone   = document.createElement('div');
    bone.classList.add('bone-float');
    bone.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    bone.style.left              = `${Math.random() * 100}%`;
    bone.style.animationDuration = `${8 + Math.random() * 12}s`;
    bone.style.animationDelay   = `${Math.random() * 10}s`;
    bone.style.fontSize          = `${1 + Math.random() * 2}rem`;

    bg.appendChild(bone);
  }
}

// ============================================
//   2. DARK MODE TOGGLE
//   ✅ UPDATED WITH VANTA SUPPORT
// ============================================
function toggleDark() {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  const btn    = document.querySelector('.dark-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';

  // Remember preference
  localStorage.setItem('darkMode', isDark);

  // Update Vanta 3D background colors ← NEW!
  if (window.updateVantaDarkMode) {
    window.updateVantaDarkMode(isDark);
  }
}

// Load dark mode preference on page load
function loadDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    const btn = document.querySelector('.dark-toggle');
    if (btn) btn.textContent = '☀️';
  }
}

// ============================================
//   3. BONE PICKER SELECTION
// ============================================
function selectBone(value, name) {
  // Unselect all
  document.querySelectorAll('.bone-option')
    .forEach(el => el.classList.remove('selected'));

  // Select clicked one
  const selected = document.querySelector(`[data-bone="${value}"]`);
  if (selected) selected.classList.add('selected');

  // Set hidden input
  document.getElementById('bone').value = value;

  // Bounce animation using GSAP if available
  if (window.gsap && selected) {
    gsap.fromTo(selected,
      { scale: 1.3 },
      { scale: 1.05, duration: 0.4, ease: 'back.out(2)' }
    );
  } else if (selected) {
    // Fallback without GSAP
    selected.style.transform = 'scale(1.2)';
    setTimeout(() => {
      selected.style.transform = 'translateY(-3px)';
    }, 150);
  }
}

// ============================================
//   4. FRACTURE TYPE SELECTION
// ============================================
function selectFracture(value) {
  // Unselect all
  document.querySelectorAll('.fracture-option')
    .forEach(el => {
      el.classList.remove(
        'selected-simple',
        'selected-displaced',
        'selected-complex'
      );
    });

  // Find and select clicked one
  const options  = document.querySelectorAll('.fracture-option');
  const indexMap = { simple: 0, displaced: 1, complex: 2 };
  const index    = indexMap[value];
  const selected = options[index];

  if (selected) {
    selected.classList.add(`selected-${value}`);

    // Bounce animation
    if (window.gsap) {
      gsap.fromTo(selected,
        { scale: 1.2 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    } else {
      selected.style.transform = 'scale(1.15)';
      setTimeout(() => {
        selected.style.transform = 'translateY(-3px)';
      }, 150);
    }
  }

  document.getElementById('fracture').value = value;
}

// ============================================
//   5. RADIO CARD SELECTION (YES/NO)
// ============================================
function selectRadio(name, value) {
  // Update hidden radio input
  const radioInput = document.querySelector(
    `input[name="${name}"][value="${value}"]`
  );
  if (radioInput) radioInput.checked = true;

  // Update smoking cards
  if (name === 'smoking') {
    const smokeNo  = document.getElementById('card-smoke-no');
    const smokeYes = document.getElementById('card-smoke-yes');
    if (smokeNo)  smokeNo.classList.remove('selected-no', 'selected-yes');
    if (smokeYes) smokeYes.classList.remove('selected-no', 'selected-yes');
    if (value === 'no'  && smokeNo)  smokeNo.classList.add('selected-no');
    if (value === 'yes' && smokeYes) smokeYes.classList.add('selected-yes');
  }

  // Update diabetes cards
  if (name === 'diabetes') {
    const diabNo  = document.getElementById('card-diab-no');
    const diabYes = document.getElementById('card-diab-yes');
    if (diabNo)  diabNo.classList.remove('selected-no', 'selected-yes');
    if (diabYes) diabYes.classList.remove('selected-no', 'selected-yes');
    if (value === 'no'  && diabNo)  diabNo.classList.add('selected-no');
    if (value === 'yes' && diabYes) diabYes.classList.add('selected-yes');
  }
}

// ============================================
//   6. CONFETTI ANIMATION 🎉
// ============================================
function launchConfetti() {
  const canvas  = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors   = [
    '#6c63ff','#a855f7','#ec4899',
    '#f7971e','#ffd200','#43e97b',
    '#38f9d7','#fc5c7d','#ff6584'
  ];

  // Create 150 confetti pieces
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height - canvas.height,
      w:       Math.random() * 12 + 4,
      h:       Math.random() * 6  + 4,
      color:   colors[Math.floor(Math.random() * colors.length)],
      speed:   Math.random() * 4  + 2,
      angle:   Math.random() * 360,
      spin:    Math.random() * 6  - 3,
      opacity: 1
    });
  }

  let frame     = 0;
  const maxFrames = 200;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    confetti.forEach((c) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
      ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
      ctx.rotate((c.angle * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();

      c.y     += c.speed;
      c.angle += c.spin;
      c.x     += Math.sin(c.angle * 0.1) * 2;
    });

    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

// ============================================
//   7. STEP INDICATOR UPDATE
// ============================================
function updateStepDots(step) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (i < step)   dot.classList.add('done');
    if (i === step) dot.classList.add('active');
  }
}

// ============================================
//   8. ANIMATE THE DAYS-LEFT NUMBER
// ============================================
function animateNumber(elementId, targetNumber) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Use GSAP if available for smoother animation
  if (window.gsap) {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetNumber,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      }
    });
  } else {
    // Fallback without GSAP
    const duration = 1000;
    const start    = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * targetNumber);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
}

// ============================================
//   RUN ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
  createFloatingBones();
  loadDarkMode();
});
