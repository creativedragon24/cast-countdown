// ============================================
//   EFFECTS.JS
//   3D Three.js bone + GSAP + Vanta + Typed.js
//   All using famous GitHub libraries
// ============================================

// ============================================
//  1. VANTA.JS — 3D NETWORK BACKGROUND
//  github.com/tengbao/vanta ⭐ 8k stars
// ============================================
let vantaEffect = null;

function initVanta() {
  if (typeof VANTA !== 'undefined') {
    vantaEffect = VANTA.NET({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x6c63ff,        // Purple network color
      backgroundColor: 0x0a0a1a, // Dark background
      points: 12.00,
      maxDistance: 22.00,
      spacing: 18.00
    });
  }
}

// ============================================
//  2. THREE.JS — SPINNING 3D BONE IN HEADER
//  github.com/mrdoob/three.js ⭐ 99k stars
// ============================================
function init3DBone() {
  const canvas   = document.getElementById('bone-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,       // Transparent background
    antialias: true
  });
  renderer.setSize(80, 80);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 2.5;

  // Create bone-like shape using capsule + spheres
  const material = new THREE.MeshPhongMaterial({
    color: 0x6c63ff,
    shininess: 100,
    specular: 0xffffff,
    emissive: 0x2a2060
  });

  // Main shaft (cylinder)
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16),
    material
  );

  // End balls
  const ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), material);
  ball1.position.y = 0.55;

  const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), material);
  ball2.position.y = -0.55;

  // Group them together
  const bone = new THREE.Group();
  bone.add(shaft, ball1, ball2);
  bone.rotation.z = 0.4; // slight tilt like 🦴
  scene.add(bone);

  // Lighting
  const light1 = new THREE.DirectionalLight(0x6c63ff, 2);
  light1.position.set(1, 2, 3);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xec4899, 1, 10);
  light2.position.set(-2, -1, 2);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  // Animate
  function animate3D() {
    requestAnimationFrame(animate3D);
    bone.rotation.y += 0.025;  // Spin!
    bone.rotation.x += 0.005;  // Slight wobble
    renderer.render(scene, camera);
  }
  animate3D();
}

// ============================================
//  3. TYPED.JS — ANIMATED TAGLINE
//  github.com/mattboldt/typed.js ⭐ 14k stars
// ============================================
function initTyped() {
  if (typeof Typed === 'undefined') return;

  new Typed('#typed-tagline', {
    strings: [
      'Track your healing journey. 🦴',
      'Share your countdown. 📤',
      'Know your healing phase. 🔬',
      'Count down to freedom. 🎉',
      'Powered by orthopedic science. 🏥'
    ],
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 2000,
    loop: true,
    smartBackspace: true
  });
}

// ============================================
//  4. GSAP — PAGE LOAD ANIMATIONS
//  github.com/greensock/GSAP ⭐ 19k stars
// ============================================
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animate header elements in sequence
  const headerTimeline = gsap.timeline({ delay: 0.2 });

  headerTimeline
    .from('.logo-3d', {
      scale: 0,
      rotation: 360,
      duration: 1,
      ease: 'back.out(1.7)'
    })
    .from('.logo', {
      y: -40,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.5')
    .from('.stat-pill', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.5)'
    }, '-=0.3');

  // Animate form card sliding up
  gsap.from('.glass-card', {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'back.out(1.3)',
    delay: 0.8
  });

  // Animate bone options with stagger
  gsap.from('.bone-option', {
    scale: 0,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease: 'back.out(2)',
    delay: 1.0
  });

  // Animate fracture options
  gsap.from('.fracture-option', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'back.out(1.5)',
    delay: 1.2
  });
}

// ============================================
//  5. GSAP — ANIMATE THE RESULT SECTION
//  Called when countdown is displayed
// ============================================
function animateResultIn() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline();

  tl.from('#result-section', {
    scale: 0.8,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(1.7)'
  })
  .from('.days-glow-ring', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(2)'
  }, '-=0.4')
  .from('#days-left', {
    scale: 0,
    opacity: 0,
    rotation: -180,
    duration: 0.8,
    ease: 'back.out(1.7)'
  }, '-=0.3')
  .from('#progress-bar-bg, .progress-container', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3')
  .from('#phase-box', {
    x: -30,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.5)'
  }, '-=0.2')
  .from('.dates-row', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')
  .from('#share-btn', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(2)'
  }, '-=0.1');
}

// ============================================
//  6. GSAP — CELEBRATE ANIMATION
// ============================================
function animateCelebration() {
  if (typeof gsap === 'undefined') return;

  gsap.from('#celebrate-section', {
    scale: 0.5,
    opacity: 0,
    rotation: -10,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  });

  gsap.from('.celebrate-emoji', {
    scale: 0,
    duration: 0.8,
    ease: 'back.out(2)',
    delay: 0.3
  });

  gsap.from('.stat-number', {
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2,
    delay: 0.5
  });
}

// ============================================
//  7. GSAP — BUTTON HOVER MAGNETIC EFFECT
// ============================================
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.main-btn, .share-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

// ============================================
//  8. GSAP SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Disclaimer fades in on scroll
  gsap.from('.disclaimer', {
    scrollTrigger: {
      trigger: '.disclaimer',
      start: 'top 90%'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  });
}

// ============================================
//  DARK MODE UPDATE (update Vanta colors)
// ============================================
function updateVantaDarkMode(isDark) {
  if (!vantaEffect) return;

  vantaEffect.setOptions({
    backgroundColor: isDark ? 0x0a0a1a : 0x0a0a1a,
    color: isDark ? 0x8b80ff : 0x6c63ff
  });
}

// ============================================
//  INIT ALL EFFECTS ON PAGE LOAD
// ============================================
window.addEventListener('load', () => {
  // Small delay so page renders first
  setTimeout(() => {
    initVanta();    // 3D Network background
    init3DBone();   // Spinning 3D bone in header
    initTyped();    // Typing animation
    initGSAP();     // GSAP entrance animations
    initMagneticButtons();   // Magnetic button hover
    initScrollAnimations();  // Scroll-triggered animations
  }, 100);
});

// ============================================
//  EXPOSE FUNCTIONS FOR app.js TO CALL
// ============================================
window.animateResultIn   = animateResultIn;
window.animateCelebration = animateCelebration;
window.updateVantaDarkMode = updateVantaDarkMode;
