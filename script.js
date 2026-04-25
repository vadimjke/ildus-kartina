/* Муртазин v9 — Интерактив */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  const fill      = preloader && preloader.querySelector('.preloader__fill');
  const countEl   = preloader && preloader.querySelector('.preloader__count');
  if (preloader) {
    let n = 0;
    const tick = setInterval(() => {
      n = Math.min(100, n + Math.ceil(Math.random() * 14));
      if (fill)   fill.style.width = n + '%';
      if (countEl) countEl.textContent = n;
      if (n >= 100) {
        clearInterval(tick);
        setTimeout(() => preloader.classList.add('is-done'), 300);
        setTimeout(() => preloader.remove(), 1200);
      }
    }, 80);
  }

  /* ── Custom cursor ── */
  const cursor = document.querySelector('.cursor');
  const dot    = document.querySelector('.cursor-dot');
  if (cursor && dot && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .filter, .catcard, .gitem').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ── Nav on scroll ── */
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    nav && (nav.classList.toggle('is-scrolled', window.scrollY > 40));
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── Fullscreen menu ── */
  const menu     = document.getElementById('fullmenu');
  const openBtn  = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');

  const openMenu = () => {
    if (!menu) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openBtn && openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openBtn && openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  openBtn  && openBtn.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) closeMenu();
  });

  /* ── Smooth scroll for [data-nav] links ── */
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const delay = menu && menu.classList.contains('is-open') ? 500 : 0;
      setTimeout(() => {
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }, delay);
    });
  });

  /* ── Intersection Observer: reveal + gallery items ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (!el.style.getPropertyValue('--delay')) {
      el.style.setProperty('--delay', `${Math.min(i * 30, 200)}ms`);
    }
    io.observe(el);
  });

  /* Gallery items fade-in on scroll */
  const gIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        gIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.gitem').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 60}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`;
    gIo.observe(el);
  });

  /* ── Gallery filter ── */
  const filters = document.querySelectorAll('.filter');
  const items   = document.querySelectorAll('.gitem');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('is-hidden', !match);
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        if (match) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'none';
            }, 50);
          });
        }
      });
    });
  });

  /* ── Hero tilt on mousemove ── */
  const heroSection = document.querySelector('.hero');
  const heroPainting = document.querySelector('.hero__painting');
  if (heroSection && heroPainting && !reduceMotion) {
    heroSection.addEventListener('mousemove', e => {
      const r  = heroSection.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width  - 0.5;
      const ry = (e.clientY - r.top)  / r.height - 0.5;
      heroPainting.style.transform = `rotateY(${rx * 5}deg) rotateX(${-ry * 4}deg) translate(${rx * 8}px, ${ry * 4}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroPainting.style.transform = '';
    });
  }

  /* ── Form state from URL params (after send.php redirect) ── */
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    const ok = document.getElementById('formSuccess');
    const form = document.getElementById('contactForm');
    if (ok)   { ok.hidden = false; ok.classList.add('is-visible'); }
    if (form) form.hidden = true;
    history.replaceState(null, '', window.location.pathname + '#contact');
  }
  if (params.get('error')) {
    const err = document.getElementById('formError');
    if (err) { err.hidden = false; err.textContent = decodeURIComponent(params.get('error')); }
    history.replaceState(null, '', window.location.pathname + '#contact');
  }

  /* ── Parallax on scroll ── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    const updateParallax = () => {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const progress = (r.top - window.innerHeight) / (r.height + window.innerHeight);
        const img = el.querySelector('img');
        if (img) img.style.transform = `scale(1.05) translateY(${progress * -40}px)`;
      });
    };
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }


})();
