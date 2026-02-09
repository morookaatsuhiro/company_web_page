/**
 * 株式会社 衛宝 | EIHO - 主脚本
 * 依赖: Bootstrap 5 (需在页面中先引入)
 */

(function () {
  'use strict';

  // ===== Navbar background on scroll =====
  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // ===== Close mobile menu after click (nav-link, btn, brand logo) =====
  const navLinks = document.querySelectorAll('.navbar .nav-link, .navbar .btn, .navbar-brand');
  const navCollapse = document.getElementById('navMenu');
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // ===== Footer year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Fake form submit =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      if (msg) msg.textContent = '送信しました（デモ）。担当より折り返しご連絡します。';
      e.target.reset();
      setTimeout(() => { if (msg) msg.textContent = ''; }, 4500);
    });
  }

  // ===== ScrollSpy: refresh when page loads with hash =====
  if (window.location.hash) {
    const scrollSpyEl = document.querySelector('[data-bs-spy="scroll"]');
    if (scrollSpyEl && typeof bootstrap !== 'undefined' && bootstrap.ScrollSpy) {
      requestAnimationFrame(() => {
        const instance = bootstrap.ScrollSpy.getInstance(scrollSpyEl);
        if (instance) instance.refresh();
      });
    }
  }

  // ===== CountUp (simple) =====
  const counters = document.querySelectorAll('.countup');
  const animateCount = (el) => {
    const to = parseInt(el.dataset.to, 10) || 0;
    const duration = 900;
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const val = Math.floor(from + (to - from) * (0.2 + 0.8 * p) * p);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to;
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
})();
