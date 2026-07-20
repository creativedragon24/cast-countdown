// ============================================
//   EFFECTS.JS — 3D + GSAP + VANTA + TYPED
// ============================================

// 1. VANTA.JS NET BACKGROUND
let vantaEffect = null;

function initVanta() {
  if (typeof VANTA === 'undefined') return;
  vantaEffect = VANTA.NET({
    el:             '#vanta-bg',
    mouseControls:  true,
    touchControls:  true,
    gyroControls:   false,
    color:          0x6c63ff,
    backgroundColor:0x060612,
    points:         10.00,
    maxDistance:    22.00,
    spacing:        20.00,
    showDots:       true,
  });
}

function updateVantaDarkMode(isLight) {
  if (!vantaEffect) return;
  vantaEffect.setOptions({
    backgroundColor: isLight ? 0xf0f4ff : 0x060612,
    color:           isLight ? 0x6c63ff : 0x8b80ff,
  });
}

// 2. THREE.JS SPINNING 3D BONE
function init3DBone() {
  const canvas = document.getElementById('bone-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(90, 90);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 3;

  const mat = new THREE.MeshPhongMaterial({
    color:     0x8b80ff,
    shininess: 120,
    specular:  0xffffff,
    emissive:  0x3a2080,
  });

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 16), mat);
  const top   = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), mat);
  const bot   = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), mat);
  top.position.y =  0.6;
  bot.position.y = -0.6;

  const bone = new THREE.Group();
  bone.add(shaft, top, bot);
  bone.rotation.z = 0.4;
  scene.add(bone);

  const light1 = new THREE.DirectionalLight(0x6c63ff, 2.5);
  light1.position.set(2, 3, 3);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xec4899, 1.5, 15);
  light2.position.set(-2, -1, 2);
  scene.add(light2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  function animateBone() {
    requestAnimationFrame(animateBone);
    bone.rotation.y += 0.022;
    bone.rotation.x  = Math.sin(Date.now() * 0.001) * 0.1;
    renderer.render(scene, camera);
  }
  animateBone();
}

// 3. TYPED.JS TAGLINE
function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('#typed-tagline', {
    strings: [
      'Track your healing journey. 🦴',
      'Share your countdown. 📤',
      'Know your healing phase. 🔬',
      'Count down to freedom. 🎉',
      'Backed by orthopedic science. 🏥',
      'Used by patients worldwide. 🌍',
    ],
    typeSpeed:  45,
    backSpeed:  28,
    backDelay:  2200,
    loop:       true,
    smartBackspace: true,
  });
}

// 4. GSAP PAGE ENTRANCE
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ delay: 0.1 });

  tl.from('#bone-canvas', {
    scale:    0,
    rotation: 360,
    duration: 1.2,
    ease:     'back.out(1.7)',
  })
  .from('#main-logo', {
    y:        -50,
    opacity:  0,
    duration: 0.9,
    ease:     'back.out(1.5)',
  }, '-=0.6')
  .from('.stat-pill, [class*="stat-pill"]', {
    y:        20,
    opacity:  0,
    stagger:  0.1,
    duration: 0.5,
    ease:     'back.out(1.5)',
  }, '-=0.4')
  .from('#form-section', {
    y:        60,
    opacity:  0,
    duration: 0.8,
    ease:     'back.out(1.3)',
  }, '-=0.3')
  .from('.bone-option', {
    scale:    0,
    opacity:  0,
    stagger:  0.04,
    duration: 0.35,
    ease:     'back.out(2)',
  }, '-=0.4')
  .from('.fracture-option', {
    y:        20,
    opacity:  0,
    stagger:  0.08,
    duration: 0.4,
    ease:     'back.out(1.5)',
  }, '-=0.2');

  // Scroll-triggered disclaimer
  gsap.from('.disclaimer, [class*="disclaimer"]', {
    scrollTrigger: { trigger: '.disclaimer', start: 'top 90%' },
    y:       30,
    opacity: 0,
    duration:0.6,
  });
}

// 5. RESULT ANIMATION
function animateResultIn() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline();
  tl.from('#result-section', {
    scale:   0.85,
    opacity: 0,
    duration:0.7,
    ease:    'back.out(1.7)',
  })
  .from('#days-left', {
    scale:    0.3,
    opacity:  0,
    rotation: -90,
    duration: 0.8,
    ease:     'back.out(1.7)',
  }, '-=0.3')
  .from('#phase-box', {
    x:       -30,
    opacity: 0,
    duration:0.5,
    ease:    'back.out(1.5)',
  }, '-=0.2')
  .from('#share-btn', {
    scale:   0,
    opacity: 0,
    duration:0.5,
    ease:    'back.out(2)',
  }, '-=0.1');
}

// 6. CELEBRATION ANIMATION
function animateCelebration() {
  if (typeof gsap === 'undefined') return;

  gsap.from('#celebrate-section', {
    scale:    0.5,
    opacity:  0,
    rotation: -8,
    duration: 1,
    ease:     'elastic.out(1, 0.5)',
  });

  gsap.from('#total-days-stat, #bone-stat', {
    textContent: 0,
    duration:    2,
    ease:        'power2.out',
    snap:        { textContent: 1 },
    stagger:     0.3,
    delay:       0.5,
  });
}

// 7. MAGNETIC BUTTONS
function initMagneticBtns() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.main-btn, .share-btn, .celebrate-btn')
    .forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        gsap.to(btn, { x: x * 0.12, y: y * 0.12, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
}

// INIT ALL ON LOAD
window.addEventListener('load', () => {
  setTimeout(() => {
    initVanta();
    init3DBone();
    initTyped();
    initGSAP();
    initMagneticBtns();
  }, 100);
});

// EXPOSE GLOBALLY
window.animateResultIn    = animateResultIn;
window.animateCelebration = animateCelebration;
window.updateVantaDarkMode = updateVantaDarkMode;
