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

})();
