/* ===== HEROIKZRE — motion: partikel hero, scroll reveal, glow kursor ===== */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------- 1. Partikel jaringan di hero (canvas, ringan) ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.5;pointer-events:none;z-index:0;';
    hero.appendChild(canvas);
    // ngepin konten di atas kanvas
    hero.querySelectorAll(':scope > *').forEach(el => { el.style.position = 'relative'; el.style.zIndex = 1; });

    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    const N = Math.min(60, Math.floor(window.innerWidth / 24));

    function resize() {
      W = canvas.width = hero.clientWidth;
      H = canvas.height = hero.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * 1400,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }

    const mouse = { x: -9999, y: -9999 };
    hero.addEventListener('mousemove', e => {
      const b = hero.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

    let glow = document.createElement('div');
    glow.style.cssText = 'position:absolute;width:420px;height:420px;border-radius:50%;pointer-events:none;z-index:0;opacity:.35;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(230,36,41,.30) 0%,transparent 65%);left:50%;top:40%;transition:opacity .4s;';
    hero.appendChild(glow);
    hero.addEventListener('mousemove', e => {
      const b = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - b.left) + 'px';
      glow.style.top = (e.clientY - b.top) + 'px';
      glow.style.opacity = '0.5';
    });
    hero.addEventListener('mouseleave', () => { glow.style.opacity = '0.25'; glow.style.left = '50%'; glow.style.top = '40%'; });

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,94,101,0.6)';
        ctx.fill();
      }
      // garis antar partikel dekat
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < 110 * 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255,94,101,' + (0.14 * (1 - d / (110 * 110))) + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      // partikel terhubung ke kursor
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(80,130,255,' + (0.35 * (1 - d / 150)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(tick);
    }
    tick();

    /* ---------- 2. Fade-in teks hero, staggered ---------- */
    ['h1', '.subtitle', '.cta-buttons'].forEach(sel => {
      const el = hero.querySelector(sel);
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 150);
    });
  }

  /* ---------- 3. Scroll reveal: kartu & judul munculin pas di-scroll ---------- */
  const revealEls = document.querySelectorAll('.card, .section-title, .profile-card, .contact-box, .section-desc');
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease, border-color .25s, box-shadow .25s';
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach((en, idx) => {
      if (en.isIntersecting) {
        const el = en.target;
        // stagger berurutan antar kartu
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, (idx % 3) * 90);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
})();
