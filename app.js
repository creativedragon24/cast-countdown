// ============================================
//   APP.JS — MAIN CALCULATOR LOGIC
//   ✅ UPDATED WITH GSAP ANIMATION CALLS
// ============================================

// ============================================
//   RUN ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
  // Check if saved countdown exists
  const saved = localStorage.getItem('castData');
  if (saved) {
    const data = JSON.parse(saved);
    displayCountdown(data);
  }

  // Set today as default cast date
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('castDate');
  if (dateInput) dateInput.value = today;
});

// ============================================
//   CALCULATE — Called when button clicked
// ============================================
function calculate() {

  // Get all values from form
  const bone     = document.getElementById('bone').value;
  const fracture = document.getElementById('fracture').value;
  const age      = parseInt(document.getElementById('age').value);
  const castDate = document.getElementById('castDate').value;
  const smoking  = document.querySelector(
    'input[name="smoking"]:checked'
  ).value;
  const diabetes = document.querySelector(
    'input[name="diabetes"]:checked'
  ).value;

  // --- Validate all fields ---
  const errorMsg = document.getElementById('error-msg');
  if (!bone || !fracture || !age || !castDate) {
    errorMsg.classList.remove('hidden');

    // Shake animation with GSAP
    if (window.gsap) {
      gsap.fromTo('#error-msg',
        { x: -10 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
      );
    }
    return;
  }
  errorMsg.classList.add('hidden');

  // --- Get base healing days ---
  const boneData  = healingData[bone];
  const fracIndex = { simple: 0, displaced: 1, complex: 2 }[fracture];
  let   baseDays  = boneData.days[fracIndex];

  // --- Apply healing modifiers ---
  const modifiers = [];

  // Age modifier
  if (age < 10) {
    baseDays = Math.round(baseDays * 0.55);
    modifiers.push('👶 Child (under 10): healing is ~45% faster');
  } else if (age <= 17) {
    baseDays = Math.round(baseDays * 0.75);
    modifiers.push('🧒 Teenager: healing is ~25% faster');
  } else if (age >= 65) {
    baseDays = Math.round(baseDays * 1.35);
    modifiers.push('👴 Age 65+: healing is ~35% slower');
  }

  // Smoking modifier
  if (smoking === 'yes') {
    baseDays = Math.round(baseDays * 1.30);
    modifiers.push('🚬 Smoking: healing is ~30% slower');
  }

  // Diabetes modifier
  if (diabetes === 'yes') {
    baseDays = Math.round(baseDays * 1.25);
    modifiers.push('🩸 Diabetes: healing is ~25% slower');
  }

  // --- Build data object ---
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

  // --- Save to localStorage ---
  localStorage.setItem('castData', JSON.stringify(data));

  // --- Show result ---
  displayCountdown(data);
}

// ============================================
//   DISPLAY COUNTDOWN
//   ✅ UPDATED WITH GSAP ANIMATION CALL
// ============================================
function displayCountdown(data) {

  // --- Calculate dates ---
  const castDateObj   = new Date(data.castDate);
  const today         = new Date();

  const daysSinceCast = Math.floor(
    (today - castDateObj) / (1000 * 60 * 60 * 24)
  );

  const daysLeft = Math.max(data.totalDays - daysSinceCast, 0);

  const offDateObj = new Date(castDateObj);
  offDateObj.setDate(offDateObj.getDate() + data.totalDays);

  const percentHealed = Math.min(
    Math.round((daysSinceCast / data.totalDays) * 100),
    100
  );

  // --- Check if cast-off day! ---
  if (daysLeft === 0) {
    showCelebration(data);
    return;
  }

  // --- Fill in display elements ---
  const resultBone     = document.getElementById('result-bone-label');
  const resultFracture = document.getElementById('result-fracture-label');
  const progressLabel  = document.getElementById('progress-label');
  const castDateDisp   = document.getElementById('cast-date-display');
  const offDateDisp    = document.getElementById('off-date-display');

  if (resultBone)     resultBone.textContent     = data.boneName;
  if (resultFracture) resultFracture.textContent  = data.fractureName;
  if (progressLabel)  progressLabel.textContent   = `${percentHealed}% healed`;

  // Format dates nicely
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  if (castDateDisp) castDateDisp.textContent =
    castDateObj.toLocaleDateString('en-US', options);
  if (offDateDisp)  offDateDisp.textContent  =
    offDateObj.toLocaleDateString('en-US', options);

  // --- Animate days left number ---
  animateNumber('days-left', daysLeft);

  // --- Progress bar ---
  const bar = document.getElementById('progress-bar');
  if (bar) {
    // Small delay so animation is visible
    setTimeout(() => {
      bar.style.width = `${percentHealed}%`;
    }, 300);
  }

  // --- Get healing phase ---
  const phase = healingPhases.find(
    p => percentHealed >= p.minPercent && percentHealed < p.maxPercent
  ) || healingPhases[2];

  // Update phase display
  const phaseIcon = document.getElementById('phase-icon');
  const phaseName = document.getElementById('phase-name');
  const phaseDesc = document.getElementById('phase-desc');
  const phaseBox  = document.getElementById('phase-box');

  if (phaseIcon) phaseIcon.textContent = phase.icon;
  if (phaseName) phaseName.textContent = phase.name;
  if (phaseDesc) phaseDesc.textContent = phase.desc;

  // Apply phase class to progress bar & box
  if (bar) {
    bar.className = 'progress-bar-fill ' + phase.colorClass;

    // Re-add shimmer element
    if (!bar.querySelector('.progress-shimmer')) {
      const shimmer = document.createElement('div');
      shimmer.className = 'progress-shimmer';
      bar.appendChild(shimmer);
    }
  }

  if (phaseBox) {
    phaseBox.className = 'phase-box ' + phase.colorClass.replace('phase-', '');
  }

  // --- Modifiers box ---
  if (data.modifiers && data.modifiers.length > 0) {
    const box  = document.getElementById('modifiers-box');
    const list = document.getElementById('modifiers-list');
    if (box && list) {
      list.innerHTML = data.modifiers
        .map(m => `<li>${m}</li>`)
        .join('');
      box.classList.remove('hidden');
    }
  }

  // --- Update step dots ---
  updateStepDots(2);

  // --- Show result section, hide others ---
  document.getElementById('form-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');
  document.getElementById('celebrate-section').classList.add('hidden');

  // ✅ NEW: Trigger GSAP result animation
  if (window.animateResultIn) {
    animateResultIn();
  }
}

// ============================================
//   CELEBRATION SCREEN
//   ✅ UPDATED WITH GSAP + CONFETTI CALLS
// ============================================
function showCelebration(data) {

  // Fill in stats
  const totalDaysStat = document.getElementById('total-days-stat');
  const boneStat      = document.getElementById('bone-stat');

  if (totalDaysStat) totalDaysStat.textContent = data.totalDays;
  if (boneStat)      boneStat.textContent      = data.boneName;

  // Update step dots
  updateStepDots(3);

  // Show celebration, hide others
  document.getElementById('form-section').classList.add('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('celebrate-section').classList.remove('hidden');

  // 🎉 Launch confetti!
  launchConfetti();

  // ✅ NEW: Trigger GSAP celebration animation
  if (window.animateCelebration) {
    animateCelebration();
  }
}

// ============================================
//   RESET FORM
// ============================================
function resetForm() {
  // Clear saved data
  localStorage.removeItem('castData');

  // Reset bone & fracture selections
  document.querySelectorAll('.bone-option')
    .forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.fracture-option')
    .forEach(el => el.classList.remove(
      'selected-simple',
      'selected-displaced',
      'selected-complex'
    ));

  // Reset hidden inputs
  document.getElementById('bone').value     = '';
  document.getElementById('fracture').value = '';
  document.getElementById('age').value      = '';

  // Reset date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('castDate').value = today;

  // Reset radio cards
  const smokeNo = document.getElementById('card-smoke-no');
  const smokeYes = document.getElementById('card-smoke-yes');
  const diabNo   = document.getElementById('card-diab-no');
  const diabYes  = document.getElementById('card-diab-yes');

  if (smokeNo)  { smokeNo.className  = 'radio-card selected-no'; }
  if (smokeYes) { smokeYes.className = 'radio-card'; }
  if (diabNo)   { diabNo.className   = 'radio-card selected-no'; }
  if (diabYes)  { diabYes.className  = 'radio-card'; }

  // Reset radio inputs
  const smokeNoInput = document.querySelector('input[name="smoking"][value="no"]');
  const diabNoInput  = document.querySelector('input[name="diabetes"][value="no"]');
  if (smokeNoInput) smokeNoInput.checked = true;
  if (diabNoInput)  diabNoInput.checked  = true;

  // Reset step dots
  updateStepDots(1);

  // Show form, hide others
  document.getElementById('form-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('celebrate-section').classList.add('hidden');

  // Hide error
  document.getElementById('error-msg').classList.add('hidden');

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-animate form with GSAP
  if (window.gsap) {
    gsap.fromTo('#form-section',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
    );
  }
}

// ============================================
//   SHARE CELEBRATION (from celebrate screen)
// ============================================
function shareCelebration() {
  const saved = localStorage.getItem('castData');
  if (!saved) return;
  const data  = JSON.parse(saved);
  generateAndShare(data, true);
}
