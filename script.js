// ==========================================================================
// NAVBAR — scrolled state, mobile toggle, active link (page + scrollspy)
// ==========================================================================
const siteNav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");

function onScrollNav() {
  if (!siteNav) return;
  siteNav.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();

if (navToggle && navPanel) {
  navToggle.addEventListener("click", () => {
    const open = navPanel.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navPanel.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navPanel.classList.remove("open");
      navToggle.classList.remove("open");
    }),
  );
}

// Active nav link: scrollspy on the homepage (multiple sections in one
// document), or a static match on data-page for the dedicated about/service
// pages where there's nothing to spy on.
const navAnchors = document.querySelectorAll(
  ".nav-links a[data-nav], .nav-panel a[data-nav]",
);
const spySections = document.querySelectorAll("[data-spy]");

function setActiveNav(id) {
  navAnchors.forEach((a) => a.classList.toggle("active", a.dataset.nav === id));
}

if (spySections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.getAttribute("id"));
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );
  spySections.forEach((s) => spyObserver.observe(s));
} else if (document.body.dataset.page) {
  setActiveNav(document.body.dataset.page);
}

// ==========================================================================
// HERO SLIDER — 3-image crossfade, fixed overlay text stays put
// ==========================================================================
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-dots button");
let slideIndex = 0;
let slideTimer;

function showSlide(i) {
  slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  slideIndex = i;
}
function nextSlide() {
  showSlide((slideIndex + 1) % slides.length);
}
if (slides.length) {
  showSlide(0);
  slideTimer = setInterval(nextSlide, 5500);
  dots.forEach((d, idx) =>
    d.addEventListener("click", () => {
      showSlide(idx);
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 5500);
    }),
  );
}

// ==========================================================================
// SCROLL-TRIGGERED REVEALS
// ==========================================================================
const revealEls = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger",
);
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ==========================================================================
// COUNT-UP STATS — animate numbers when they enter view
// ==========================================================================
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.5 },
);
counters.forEach((el) => counterObserver.observe(el));

// ==========================================================================
// CIRCULAR PROCESS DIAGRAM — place nodes evenly around the loop
// ==========================================================================
document.querySelectorAll(".loop").forEach((loop) => {
  const nodes = loop.querySelectorAll(".loop-node");
  const count = nodes.length;
  const radius = 48; // percent of loop box
  nodes.forEach((node, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    node.style.left = x + "%";
    node.style.top = y + "%";
  });
});

// ==========================================================================
// FOOTER YEAR
// ==========================================================================
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
