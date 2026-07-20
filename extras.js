// ============================================
//   EXTRAS.JS — UI INTERACTIONS
// ============================================

// Dark mode toggle
function toggleDark() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  const btn = document.querySelector('.dark-toggle button') ||
              document.querySelector('button[onclick="toggleDark()"]');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('lightMode', isLight);
  if (window.updateVantaDarkMode) updateVantaDarkMode(isLight);
}

function loadDarkMode() {
  const isLight = localStorage.getItem('lightMode') === 'true';
  if (isLight) {
    document.body.classList.add('light-mode');
    const btn = document.querySelector('button[onclick="toggleDark()"]');
    if (btn) btn.textContent = '🌙';
  }
}

// Bone selection
function selectBone(value, name) {
  document.querySelectorAll('.bone-option')
    .forEach(el => el.classList.remove('selected'));

  const selected = document.querySelector(`[data-bone="${value}"]`);
  if (selected) {
    selected.classList.add('selected');
    if (window.gsap) {
      gsap.fromTo(selected,
        { scale: 1.3 },
        { scale: 1.05, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }
  document.getElementById('bone').value = value;
}

// Fracture selection
function selectFracture(value) {
  document.querySelectorAll('.fracture-option')
    .forEach(el => el.classList.remove(
      'selected-simple', 'selected-displaced', 'selected-complex'
    ));

  const options = document.querySelectorAll('.fracture-option');
  const idx     = { simple: 0, displaced: 1, complex: 2 }[value];
  if (options[idx]) {
    options[idx].classList.add(`selected-${value}`);
    if (window.gsap) {
      gsap.fromTo(options[idx],
        { scale: 1.2 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }
  document.getElementById('fracture').value = value;
}

// Radio YES/NO
function selectRadio(name, value) {
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;

  if (name === 'smoking') {
    const no  = document.getElementById('card-smoke-no');
    const yes = document.getElementById('card-smoke-yes');
    if (no)  no.classList.remove('selected-no', 'selected-yes');
    if (yes) yes.classList.remove('selected-no', 'selected-yes');
    if (value === 'no'  && no)  no.classList.add('selected-no');
    if (value === 'yes' && yes) yes.classList.add('selected-yes');
  }

  if (name === 'diabetes') {
    const no  = document.getElementById('card-diab-no');
    const yes = document.getElementById('card-diab-yes');
    if (no)  no.classList.remove('selected-no', 'selected-yes');
    if (yes) yes.classList.remove('selected-no', 'selected-yes');
    if (value === 'no'  && no)  no.classList.add('selected-no');
    if (value === 'yes' && yes) yes.classList.add('selected-yes');
  }
}

// Confetti
function launchConfetti() {
  const canvas  = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#6c63ff','#a855f7','#ec4899',
                  '#f7971e','#ffd200','#43e97b',
                  '#38f9d7','#fc5c7d'];
  const pieces = [];

  for (let i = 0; i < 200; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      w:     Math.random() * 14 + 4,
      h:     Math.random() * 7  + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 5  + 2,
      angle: Math.random() * 360,
      spin:  Math.random() * 8  - 4,
    });
  }

  let frame = 0;
  const max = 220;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    pieces.forEach(c => {
      ctx.save();
      ctx.globalAlpha  = Math.max(0, 1 - frame / max);
      ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
      ctx.rotate((c.angle * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
      c.y     += c.speed;
      c.angle += c.spin;
      c.x     += Math.sin(c.angle * 0.1) * 2;
    });
    if (frame < max) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// Step dots
function updateStepDots(step) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    dot.classList.remove(
      'bg-brand', 'bg-white/20', 'done',
      'shadow-[0_0_12px_#6c63ff]', 'scale-125'
    );
    if (i < step) {
      dot.classList.add('done', 'bg-green', 'shadow-[0_0_12px_#43e97b]');
    } else if (i === step) {
      dot.classList.add('bg-brand', 'shadow-[0_0_12px_#6c63ff]', 'scale-125');
    } else {
      dot.classList.add('bg-white/20');
    }
  }
}

// Animate number count-up
function animateNumber(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (window.gsap) {
    const obj = { val: 0 };
    gsap.to(obj, {
      val:      target,
      duration: 1.8,
      ease:     'power3.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); }
    });
  } else {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1500, 1);
      el.textContent = Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

window.addEventListener('load', () => {
  loadDarkMode();
});
