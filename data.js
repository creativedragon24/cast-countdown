// ============================================
//   HEALING TIMES — Base days for each bone
//   Format: [simple, displaced, complex]
//   All values in DAYS
// ============================================

const healingData = {
  finger:    { name: "Finger",           days: [28,  35,  42]  },
  wrist:     { name: "Wrist",            days: [35,  49,  63]  },
  forearm:   { name: "Forearm",          days: [49,  63,  84]  },
  elbow:     { name: "Elbow",            days: [35,  49,  63]  },
  clavicle:  { name: "Collarbone",       days: [35,  49,  56]  },
  ankle:     { name: "Ankle",            days: [49,  63,  84]  },
  tibia:     { name: "Tibia (Shin)",     days: [84, 112, 140]  },
  foot:      { name: "Foot / Toes",      days: [28,  42,  56]  },
  femur:     { name: "Femur (Thigh)",    days: [112, 140, 168] }
};

// ============================================
//   FRACTURE TYPE LABELS
// ============================================
const fractureLabels = {
  simple:    "Simple Fracture",
  displaced: "Displaced Fracture",
  complex:   "Complex Fracture"
};

// ============================================
//   HEALING PHASES
//   Based on % of healing completed
// ============================================
const healingPhases = [
  {
    minPercent: 0,
    maxPercent: 33,
    icon: "🔴",
    name: "Inflammation Phase",
    desc: "Your body is building the scaffolding — blood clot forms, healing begins",
    colorClass: "phase-inflammation"
  },
  {
    minPercent: 33,
    maxPercent: 66,
    icon: "🟡",
    name: "Repair Phase",
    desc: "New bone is forming! Calcium is being deposited at the fracture site",
    colorClass: "phase-repair"
  },
  {
    minPercent: 66,
    maxPercent: 100,
    icon: "🟢",
    name: "Remodeling Phase",
    desc: "Your bone is getting stronger and reshaping every single day",
    colorClass: "phase-remodel"
  }
];