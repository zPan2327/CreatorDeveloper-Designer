/* ============================================
   PERSONAL BRAND WEBSITE — Main Script
   ============================================ */

// ============================================
// THREE.JS — Particle Background
// ============================================
async function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  try {
    const THREE = await import("three");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system 1: blue
    const count1 = 600;
    const geo1 = new THREE.BufferGeometry();
    const pos1 = new Float32Array(count1 * 3);
    for (let i = 0; i < count1 * 3; i += 3) {
      pos1[i] = (Math.random() - 0.5) * 55;
      pos1[i + 1] = (Math.random() - 0.5) * 35;
      pos1[i + 2] = (Math.random() - 0.5) * 25;
    }
    geo1.setAttribute("position", new THREE.BufferAttribute(pos1, 3));
    const mat1 = new THREE.PointsMaterial({
      size: 0.035,
      color: new THREE.Color("#0071E3"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points1 = new THREE.Points(geo1, mat1);
    scene.add(points1);

    // Particle system 2: purple
    const count2 = 300;
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(count2 * 3);
    for (let i = 0; i < count2 * 3; i += 3) {
      pos2[i] = (Math.random() - 0.5) * 65;
      pos2[i + 1] = (Math.random() - 0.5) * 45;
      pos2[i + 2] = (Math.random() - 0.5) * 30;
    }
    geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
    const mat2 = new THREE.PointsMaterial({
      size: 0.025,
      color: new THREE.Color("#6366F1"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points2 = new THREE.Points(geo2, mat2);
    scene.add(points2);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Animation
    function animate() {
      requestAnimationFrame(animate);

      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      points1.rotation.x += 0.0002;
      points1.rotation.y += 0.00015;
      points1.position.x += mouseX * 0.004;
      points1.position.y += mouseY * 0.004;

      points2.rotation.x -= 0.00015;
      points2.rotation.y -= 0.0002;
      points2.position.x -= mouseX * 0.003;
      points2.position.y -= mouseY * 0.003;

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  } catch (err) {
    console.warn("Three.js background skipped:", err.message);
  }
}

// ============================================
// THEME SYSTEM — Smooth Dark/Light Toggle
// ============================================
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  // Load saved preference or system preference
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;

  function applyTheme(dark) {
    html.setAttribute("data-theme", dark ? "dark" : "light");
    html.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  applyTheme(isDark);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nextDark = html.getAttribute("data-theme") !== "dark";

      // View Transition API for ultra-smooth switch
      if (document.startViewTransition) {
        document.startViewTransition(() => applyTheme(nextDark));
      } else {
        applyTheme(nextDark);
      }
    });
  }

  // Listen for system changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches);
    }
  });
}

// ============================================
// LENIS — Smooth Inertial Scrolling
// ============================================
function initLenis() {
  if (typeof Lenis === "undefined") {
    // Fallback: no smooth scroll
    return null;
  }

  const lenis = new Lenis({
    duration: 0.35,
    easing: (t) => 1 - Math.pow(1 - t, 1.5), // nearly linear deceleration — instant stop
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.3,
    touchMultiplier: 1.2,
    infinite: false,
  });

  // RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect GSAP ScrollTrigger
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Override ScrollTrigger's default scroll
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  return lenis;
}

// ============================================
// GSAP SCROLLTRIGGER — Animations
// ============================================
function initScrollAnimations(lenis) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    // Fallback: simple Intersection Observer reveals
    initFallbackReveals();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4"
  );

  revealEls.forEach((el) => {
    let delay = 0;
    if (el.classList.contains("reveal-delay-1")) delay = 0.1;
    if (el.classList.contains("reveal-delay-2")) delay = 0.2;
    if (el.classList.contains("reveal-delay-3")) delay = 0.35;
    if (el.classList.contains("reveal-delay-4")) delay = 0.5;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Skill bars fill on scroll
  const skillFills = document.querySelectorAll(".skill-fill");
  skillFills.forEach((fill) => {
    const width = fill.dataset.width || "0";
    gsap.fromTo(
      fill,
      { width: "0%" },
      {
        width: width + "%",
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: fill,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Stats counter animation
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Parallax on hero orbs
  gsap.to(".hero-orb-1", {
    y: -40,
    x: 20,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  gsap.to(".hero-orb-2", {
    y: 30,
    x: -20,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}

// Fallback reveals without GSAP
function initFallbackReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translate3d(0, 0, 0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4")
    .forEach((el) => {
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      observer.observe(el);
    });

  // Skill bars
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.width + "%";
          fill.style.transition = "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".skill-fill").forEach((fill) => skillObserver.observe(fill));
}

// ============================================
// NAVIGATION — Scroll detection & mobile
// ============================================
function initNavigation(lenis) {
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const navMobile = document.getElementById("navMobile");
  const navLinks = document.querySelectorAll(".nav-link");

  // Active link on scroll
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    const offset = 120;

    let currentId = "hero";
    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      if (scrollY >= top) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  // Nav glass progressive fade-in on scroll
  const navBlur = nav.querySelector(".nav-blur");
  const navNoise = nav.querySelector(".nav-noise");
  const navHighlight = nav.querySelector(".nav-highlight");

  function updateNavAppearance(scrollY) {
    // Progressively fade in glass between 0–120px scroll
    const t = Math.min(Math.max(scrollY / 120, 0), 1);
    nav.classList.toggle("scrolled", scrollY > 20);

    // Progressive opacity for an even smoother ramp
    if (navBlur) navBlur.style.opacity = t;
    if (navNoise) navNoise.style.opacity = t * 0.03;
    if (navHighlight) navHighlight.style.opacity = t;

    // Progressive background tint
    nav.style.setProperty("--nav-bg-opacity", t);
    updateActiveLink();
  }

  if (lenis) {
    lenis.on("scroll", ({ scroll }) => updateNavAppearance(scroll));
  } else {
    window.addEventListener("scroll", () => updateNavAppearance(window.scrollY), { passive: true });
  }

  // Mobile menu toggle
  if (menuBtn && navMobile) {
    menuBtn.addEventListener("click", () => {
      navMobile.classList.toggle("open");
    });

    // Close on link click
    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMobile.classList.remove("open");
      });
    });
  }

  // Smooth scroll for nav links (when Lenis is active)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -60, duration: 0.6 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// ============================================
// PORTFOLIO — Filtering
// ============================================
function initPortfolio() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      // Animate cards
      cards.forEach((card, i) => {
        const cat = card.dataset.category;
        const shouldShow = filter === "all" || cat === filter;

        card.style.transition = `opacity 0.4s ${i * 0.04}s ease, transform 0.4s ${i * 0.04}s cubic-bezier(0.22, 1, 0.36, 1)`;

        if (shouldShow) {
          card.style.opacity = "1";
          card.style.transform = "translate3d(0, 0, 0) scale(1)";
          card.style.pointerEvents = "auto";
          card.style.position = "";
          card.style.width = "";
        } else {
          card.style.opacity = "0";
          card.style.transform = "translate3d(0, 8px, 0) scale(0.96)";
          card.style.pointerEvents = "none";
          card.style.position = "absolute";
        }
      });
    });
  });
}

// ============================================
// HERO — Role text cycling
// ============================================
function initRoleCycler() {
  const roles = document.querySelectorAll(".hero-role");
  if (roles.length === 0) return;

  let index = 0;

  function cycle() {
    roles.forEach((r) => r.classList.remove("active"));
    roles[index].classList.add("active");

    // Animate the active one
    const el = roles[index];
    el.style.animation = "none";
    el.offsetHeight; // trigger reflow
    el.style.animation = "roleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards";

    index = (index + 1) % roles.length;
  }

  // Inject keyframe if not in CSS
  if (!document.getElementById("role-keyframes")) {
    const style = document.createElement("style");
    style.id = "role-keyframes";
    style.textContent = `
      @keyframes roleIn {
        from { opacity: 0; transform: translate3d(0, 30px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }
    `;
    document.head.appendChild(style);
  }

  cycle();
  setInterval(cycle, 3000);
}

// ============================================
// MOUSE GLOW — Smooth follow
// ============================================
function initMouseGlow() {
  const glow = document.querySelector(".mouse-glow");
  if (!glow || window.innerWidth < 768) return;

  let mouseX = -500, mouseY = -500;
  let curX = -500, curY = -500;
  let firstMove = true;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Snap to position on first move — no trail-in from offscreen
    if (firstMove) {
      curX = mouseX;
      curY = mouseY;
      firstMove = false;
    }
    // Show instantly at full opacity
    glow.style.opacity = "0.5";
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
    firstMove = true;
  });

  function animate() {
    curX += (mouseX - curX) * 0.28;
    curY += (mouseY - curY) * 0.28;
    glow.style.left = curX + "px";
    glow.style.top = curY + "px";
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ============================================
// PROGRESS BAR
// ============================================
function initProgressBar(lenis) {
  const bar = document.querySelector(".progress-bar-fill");
  if (!bar) return;

  function update() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  }

  if (lenis) {
    lenis.on("scroll", update);
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }
}

// ============================================
// CTA BUTTON — Smooth scroll to section
// ============================================
function initAIFloatButton() {
  const btn = document.getElementById('aiFloatBtn');
  if (!btn) return;

  let visible = false;

  function updateVisibility() {
    const scrollY = window.scrollY;
    const shouldShow = scrollY > 300;

    if (shouldShow !== visible) {
      visible = shouldShow;
      btn.style.opacity = shouldShow ? '1' : '0';
      btn.style.pointerEvents = shouldShow ? 'auto' : 'none';
      btn.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
    }
  }

  // Initial state
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
  btn.style.transform = 'translateY(20px)';
  btn.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';

  window.addEventListener('scroll', updateVisibility, { passive: true });
}

// ============================================
// CTA BUTTON — Smooth scroll to section (original)
// ============================================
function initCTAScroll(lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    // Skip if already handled by nav
    if (link.closest(".nav-links") || link.closest(".nav-mobile")) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -60, duration: 0.6 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  // Start particle background (non-blocking)
  initParticles();

  // Theme system
  initTheme();

  // Lenis smooth scroll
  const lenis = initLenis();

  // GSAP ScrollTrigger animations (pass lenis for coordination)
  initScrollAnimations(lenis);

  // Navigation
  initNavigation(lenis);

  // Portfolio filtering
  initPortfolio();

  // Role text cycling
  initRoleCycler();

  // Mouse glow
  initMouseGlow();

  // Progress bar
  initProgressBar(lenis);

  // CTA scroll links
  initCTAScroll(lenis);

  // AI floating button
  initAIFloatButton();

  // Initial active link
  if (!lenis) {
    // Trigger once on load
    document.querySelector(".nav-link[href='#hero']")?.classList.add("active");
  }

  console.log("%c✦ ZIHENG Portfolio Ready %c| %cDesign · Code · Create",
    "color:#0071E3;font-weight:bold;", "", "color:#6366F1;");
});
