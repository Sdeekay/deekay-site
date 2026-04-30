// Deekay Consulting — main.js
// Sticky nav, hamburger, smooth-scroll, scroll reveal

(() => {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelectorAll('.nav__links a');

  // Sticky nav glassmorphism on scroll
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  if (burger) {
    burger.addEventListener('click', () => nav.classList.toggle('is-open'));
  }
  links.forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));

  // Smooth-scroll for hash links (browsers handle most via CSS, but offset for fixed nav)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // Scroll reveal
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  // Subtle parallax on the orb
  const orb = document.querySelector('.orb');
  if (orb && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let raf = 0;
    window.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        orb.style.setProperty('--orb-x', `${x}px`);
        orb.style.setProperty('--orb-y', `${y}px`);
      });
    });
  }

  // Orb scroll-driven state (chaos → clarity) + mini-orb visibility
  const heroOrb = document.getElementById('heroOrb');
  const miniOrb = document.getElementById('miniOrb');
  const hero = document.getElementById('accueil');
  if (hero) {
    let rafScroll = 0;
    const updateOrb = () => {
      const heroH = hero.offsetHeight || window.innerHeight;
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / heroH));
      if (heroOrb) {
        heroOrb.style.setProperty('--orb-progress', progress.toFixed(3));
        heroOrb.style.setProperty('--orb-rot', `${(y * 0.08).toFixed(2)}deg`);
      }
      if (miniOrb) {
        if (y > heroH * 0.85) miniOrb.classList.add('is-visible');
        else miniOrb.classList.remove('is-visible');
      }
    };
    updateOrb();
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafScroll);
      rafScroll = requestAnimationFrame(updateOrb);
    }, { passive: true });
    window.addEventListener('resize', updateOrb);
  }
})();
