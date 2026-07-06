// Shared behaviour for all LeapStrike pages. Every block guards for the elements
// it needs, so pages that lack a feature (e.g. the billing toggle) don't error.

// Nav scrolled state
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Mobile menu
(function () {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('.mobile-link').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
  );
})();

// Billing toggle (membership pricing)
(function () {
  const billing = document.getElementById('billing');
  const toggle = document.getElementById('billingToggle');
  const wrap = document.getElementById('pricing') || document.getElementById('membership');
  if (!billing || !toggle || !wrap) return;
  let annual = false;
  function setBilling(isAnnual) {
    annual = isAnnual;
    toggle.setAttribute('aria-checked', String(isAnnual));
    billing.classList.toggle('billing-annual', isAnnual);
    document.querySelectorAll('[data-bill="monthly"]').forEach(e => e.classList.toggle('text-ink/50', isAnnual));
    document.querySelectorAll('[data-bill="monthly"]').forEach(e => e.classList.toggle('text-ink', !isAnnual));
    document.querySelectorAll('[data-bill="annual"]').forEach(e => e.classList.toggle('text-ink', isAnnual));
    document.querySelectorAll('[data-bill="annual"]').forEach(e => e.classList.toggle('text-ink/50', !isAnnual));
    wrap.querySelectorAll('.price, .price-period, .price-note, .price-feat').forEach(el => {
      el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
  }
  toggle.addEventListener('click', () => setBilling(!annual));
})();

// FAQ accordion
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// Scroll reveal
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
