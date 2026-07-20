// ============================================
//   APP.JS — COMPLETE UPDATED VERSION
// ============================================

window.addEventListener('load', () => {
  const saved = localStorage.getItem('castData');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      displayCountdown(data);
    } catch(e) {
      localStorage.removeItem('castData');
    }
  }

  // Set today as default date
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('castDate');
  if (dateInput) dateInput.value = today;
});

// ============================================
//   CALCULATE
// ============================================
function calculate() {
  const bone     = document.getElementById('bone').value;
  const fracture = document.getElementById('fracture').value;
  const age      = parseInt(document.getElementById('age').value);
  const castDate = document.getElementById('castDate').value;
  const smoking  = document.querySelector('input[name="smoking"]:checked').value;
  const diabetes = document.querySelector('input[name="diabetes"]:checked').value;

  const errorMsg = document.getElementById('error-msg');

  if (!bone || !fracture || !age || !castDate) {
    errorMsg.classList.remove('hidden');
    if (window.gsap) {
      gsap.fromTo('#error-msg',
        { x: -12 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
    }
    return;
  }
  errorMsg.classList.add('hidden');

  const boneData  = healingData[bone];
  const fracIndex = { simple: 0, displaced: 1, complex: 2 }[fracture];
  let   baseDays  = boneData.days[fracIndex];
  const modifiers = [];

  // Age
  if (age < 10) {
    baseDays = Math.round(baseDays * 0.55);
    modifiers.push('👶 Child (under 10): healing ~45% faster');
  } else if (age <= 17) {
    baseDays = Math.round(baseDays * 0.75);
    modifiers.push('🧒 Teenager: healing ~25% faster');
  } else if (age >= 65) {
    baseDays = Math.round(baseDays * 1.35);
    modifiers.push('👴 Age 65+: healing ~35% slower');
  }

  // Smoking
  if (smoking === 'yes') {
    baseDays = Math.round(baseDays * 1.30);
    modifiers.push('🚬 Smoking: healing ~30% slower');
  }

  // Diabetes
  if (diabetes === 'yes') {
    baseDays = Math.round(baseDays * 1.25);
    modifiers.push('🩸 Diabetes: healing ~25% slower');
  }

  const data = {
    bone,
    boneName:     boneData.name,
    fracture,
    fractureName: fractureLabels[fracture],
    age,
    castDate,
    totalDays:    baseDays,
    smoking,
    diabetes,
    modifiers
  };

  localStorage.setItem('castData', JSON.stringify(data));
  displayCountdown(data);
}

// ============================================
//   DISPLAY COUNTDOWN
// ============================================
function displayCountdown(data) {
  const castDateObj   = new Date(data.castDate);
  const today         = new Date();
  const daysSinceCast = Math.floor((today - castDateObj) / 86400000);
  const daysLeft      = Math.max(data.totalDays - daysSinceCast, 0);

  const offDateObj = new Date(castDateObj);
  offDateObj.setDate(offDateObj.getDate() + data.totalDays);

  const percentHealed = Math.min(
    Math.round((daysSinceCast / data.totalDays) * 100),
    100
  );

  if (daysLeft === 0) {
    showCelebration(data);
    return;
  }

  // Fill labels
  const el = (id) => document.getElementById(id);
  if (el('result-bone-label'))     el('result-bone-label').textContent     = data.boneName;
  if (el('result-fracture-label')) el('result-fracture-label').textContent = data.fractureName;
  if (el('progress-label'))        el('progress-label').textContent        = `${percentHealed}% healed`;

  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  if (el('cast-date-display')) el('cast-date-display').textContent =
    castDateObj.toLocaleDateString('en-US', opts);
  if (el('off-date-display'))  el('off-date-display').textContent  =
    offDateObj.toLocaleDateString('en-US', opts);

  // Animate number
  animateNumber('days-left', daysLeft);

  // Progress bar
  const bar = el('progress-bar');
  if (bar) {
    setTimeout(() => { bar.style.width = `${percentHealed}%`; }, 400);

    // Phase class
    const phase = healingPhases.find(
      p => percentHealed >= p.minPercent && percentHealed < p.maxPercent
    ) || healingPhases[2];

    bar.className = `h-full rounded-full relative overflow-hidden
                     transition-all duration-[2000ms] ease-out
                     ${phase.colorClass}`;

    // Re-add shimmer
    const shimmer = document.createElement('div');
    shimmer.className = 'absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer w-full';
    bar.innerHTML = '';
    bar.appendChild(shimmer);

    // Phase box
    const phaseBox = el('phase-box');
    if (phaseBox) {
      if (el('phase-icon')) el('phase-icon').textContent = phase.icon;
      if (el('phase-name')) el('phase-name').textContent = phase.name;
      if (el('phase-desc')) el('phase-desc').textContent = phase.desc;
      phaseBox.className = `flex items-center gap-4 rounded-2xl p-4 mb-5
                            border transition-all duration-500
                            ${phase.boxClass}`;
    }
  }

  // Modifiers
  if (data.modifiers && data.modifiers.length > 0) {
    const box  = el('modifiers-box');
    const list = el('modifiers-list');
    if (box && list) {
      list.innerHTML = data.modifiers.map(m => `<li>⚡ ${m}</li>`).join('');
      box.classList.remove('hidden');
    }
  }

  updateStepDots(2);

  el('form-section').classList.add('hidden');
  el('result-section').classList.remove('hidden');
  el('celebrate-section').classList.add('hidden');

  if (window.animateResultIn) animateResultIn();
}

// ============================================
//   CELEBRATION
// ============================================
function showCelebration(data) {
  const el = (id) => document.getElementById(id);
  if (el('total-days-stat')) el('total-days-stat').textContent = data.totalDays;
  if (el('bone-stat'))       el('bone-stat').textContent       = data.boneName;

  updateStepDots(3);

  el('form-section').classList.add('hidden');
  el('result-section').classList.add('hidden');
  el('celebrate-section').classList.remove('hidden');

  launchConfetti();
  if (window.animateCelebration) animateCelebration();
}

// ============================================
//   RESET
// ============================================
function resetForm() {
  localStorage.removeItem('castData');

  document.querySelectorAll('.bone-option')
    .forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.fracture-option')
    .forEach(el => el.classList.remove(
      'selected-simple', 'selected-displaced', 'selected-complex'
    ));

  document.getElementById('bone').value     = '';
  document.getElementById('fracture').value = '';
  document.getElementById('age').value      = '';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('castDate').value = today;

  ['card-smoke-no','card-diab-no'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('selected-no');
  });
  ['card-smoke-yes','card-diab-yes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('selected-yes');
  });

  document.querySelector('input[name="smoking"][value="no"]').checked  = true;
  document.querySelector('input[name="diabetes"][value="no"]').checked = true;

  updateStepDots(1);

  document.getElementById('form-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('celebrate-section').classList.add('hidden');
  document.getElementById('error-msg').classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.gsap) {
    gsap.fromTo('#form-section',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
    );
  }
}

function shareCelebration() {
  const saved = localStorage.getItem('castData');
  if (!saved) return;
  generateAndShare(JSON.parse(saved), true);
}
