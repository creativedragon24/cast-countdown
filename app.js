// ============================================
//   MAIN APP LOGIC
// ============================================

// Run on page load — check if data is saved
window.addEventListener('load', () => {
  const saved = localStorage.getItem('castData');
  if (saved) {
    const data = JSON.parse(saved);
    displayCountdown(data);
  }

  // Set today as default cast date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('castDate').value = today;
});

// ============================================
//   CALCULATE — called when button clicked
// ============================================
function calculate() {

  // --- Get all values from form ---
  const bone         = document.getElementById('bone').value;
  const fracture     = document.getElementById('fracture').value;
  const age          = parseInt(document.getElementById('age').value);
  const castDate     = document.getElementById('castDate').value;
  const smoking      = document.querySelector('input[name="smoking"]:checked').value;
  const diabetes     = document.querySelector('input[name="diabetes"]:checked').value;

  // --- Validate ---
  if (!bone || !fracture || !age || !castDate) {
    document.getElementById('error-msg').classList.remove('hidden');
    return;
  }
  document.getElementById('error-msg').classList.add('hidden');

  // --- Get base healing days ---
  const boneData  = healingData[bone];
  const fracIndex = { simple: 0, displaced: 1, complex: 2 }[fracture];
  let baseDays    = boneData.days[fracIndex];

  // --- Apply modifiers ---
  const modifiers = [];

  // Age modifier
  if (age < 10) {
    baseDays = Math.round(baseDays * 0.55);
    modifiers.push("👶 Child (under 10): healing is ~45% faster");
  } else if (age <= 17) {
    baseDays = Math.round(baseDays * 0.75);
    modifiers.push("🧒 Teenager: healing is ~25% faster");
  } else if (age >= 65) {
    baseDays = Math.round(baseDays * 1.35);
    modifiers.push("👴 Age 65+: healing is ~35% slower");
  }

  // Smoking modifier
  if (smoking === 'yes') {
    baseDays = Math.round(baseDays * 1.30);
    modifiers.push("🚬 Smoking: healing is ~30% slower");
  }

  // Diabetes modifier
  if (diabetes === 'yes') {
    baseDays = Math.round(baseDays * 1.25);
    modifiers.push("🩸 Diabetes: healing is ~25% slower");
  }

  // --- Build data object ---
  const data = {
    bone,
    boneName:      boneData.name,
    fracture,
    fractureName:  fractureLabels[fracture],
    age,
    castDate,
    totalDays:     baseDays,
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
// ============================================
function displayCountdown(data) {

  // Calculate dates
  const castDateObj  = new Date(data.castDate);
  const today        = new Date();

  // Days since cast was put on
  const daysSinceCast = Math.floor(
    (today - castDateObj) / (1000 * 60 * 60 * 24)
  );

  // Days remaining
  const daysLeft = Math.max(data.totalDays - daysSinceCast, 0);

  // Estimated removal date
  const offDateObj   = new Date(castDateObj);
  offDateObj.setDate(offDateObj.getDate() + data.totalDays);

  // Percentage healed
  const percentHealed = Math.min(
    Math.round((daysSinceCast / data.totalDays) * 100),
    100
  );

  // --- Check if cast-off day! ---
  if (daysLeft === 0) {
    showCelebration(data);
    return;
  }

  // --- Fill in all the display elements ---
  document.getElementById('result-bone-label').textContent     = data.boneName;
  document.getElementById('result-fracture-label').textContent = data.fractureName;
  document.getElementById('days-left').textContent             = daysLeft;
  document.getElementById('progress-label').textContent        = `${percentHealed}% healed`;

  // Format dates nicely
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  document.getElementById('cast-date-display').textContent =
    castDateObj.toLocaleDateString('en-US', options);
  document.getElementById('off-date-display').textContent  =
    offDateObj.toLocaleDateString('en-US', options);

  // --- Progress bar ---
  const bar = document.getElementById('progress-bar');
  bar.style.width = `${percentHealed}%`;

  // --- Healing phase ---
  const phase = healingPhases.find(
    p => percentHealed >= p.minPercent && percentHealed < p.maxPercent
  ) || healingPhases[2];

  document.getElementById('phase-icon').textContent   = phase.icon;
  document.getElementById('phase-name').textContent   = phase.name;
  document.getElementById('phase-desc').textContent   = phase.desc;

  // Apply phase color to progress bar
  bar.className = 'progress-bar-fill ' + phase.colorClass;

  // --- Modifiers box ---
  if (data.modifiers && data.modifiers.length > 0) {
    const box  = document.getElementById('modifiers-box');
    const list = document.getElementById('modifiers-list');
    list.innerHTML = data.modifiers
      .map(m => `<li>${m}</li>`)
      .join('');
    box.classList.remove('hidden');
  }

  // --- Show result, hide form ---
  document.getElementById('form-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');
  document.getElementById('celebrate-section').classList.add('hidden');
}

// ============================================
//   CELEBRATION SCREEN
// ============================================
function showCelebration(data) {
  document.getElementById('total-days-stat').textContent = data.totalDays;
  document.getElementById('bone-stat').textContent       = data.boneName;

  document.getElementById('form-section').classList.add('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('celebrate-section').classList.remove('hidden');
}

// ============================================
//   RESET FORM
// ============================================
function resetForm() {
  localStorage.removeItem('castData');

  document.getElementById('bone').value     = '';
  document.getElementById('fracture').value = '';
  document.getElementById('age').value      = '';

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('castDate').value = today;

  document.querySelector('input[name="smoking"][value="no"]').checked  = true;
  document.querySelector('input[name="diabetes"][value="no"]').checked = true;

  document.getElementById('form-section').classList.remove('hidden');
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('celebrate-section').classList.add('hidden');
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