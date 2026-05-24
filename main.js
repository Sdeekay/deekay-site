// Deekay Consulting — main.js
// Sticky nav, hamburger, smooth-scroll, scroll reveal, pain-point particles

(() => {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelectorAll('.nav__links a');

  // Sticky nav glassmorphism + auto-hide on scroll
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const delta = y - lastScrollY;

    if (y > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');

    if (y < 80) {
      nav.classList.remove('nav--hidden');
    } else if (Math.abs(delta) > 8) {
      if (delta > 0) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
    }

    lastScrollY = y;
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

// Pain-points floating particles
(() => {
  const canvas = document.querySelector('.pain-particles');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  const COUNT = 50;
  let W = 0, H = 0;
  const pts = [];

  function mkPt(startY) {
    return {
      x: Math.random() * W,
      y: startY !== undefined ? startY : Math.random() * H,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.32 + 0.08),
      a: Math.random() * 0.22 + 0.04,
    };
  }

  function resize() {
    W = canvas.width = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
  }

  resize();
  for (let i = 0; i < COUNT; i++) pts.push(mkPt());

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y + p.r < 0) Object.assign(p, mkPt(H + p.r));
      if (p.x + p.r < 0) p.x = W + p.r;
      if (p.x - p.r > W) p.x = -p.r;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,197,218,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  tick();
})();
