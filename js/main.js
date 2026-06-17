/* ═══════════════════════════════════════════════
   ISAS — Instituto Social Assistência à Saúde
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Elementos ──────────────────────────────────
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navMenu    = document.getElementById('navMenu');
  const navLinks   = document.querySelectorAll('.nav__link');
  const form       = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formReset  = document.getElementById('formReset');
  const counters   = document.querySelectorAll('.counter');
  const stats      = document.querySelectorAll('.stat');

  // ── Navbar: sombra ao rolar ───────────────────
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveSection();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Menu mobile ──────────────────────────────
  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
    // Foca no primeiro link do menu para leitores de tela
    const firstLink = navMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Fechar ao clicar num link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // ── Link ativo conforme seção visível ────────
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveSection() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  // ── Contador animado ─────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('pt-BR');
      }
    }, step);
  }

  // ── IntersectionObserver: counters + fade-in stats ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter').forEach(animateCounter);
        entry.target.querySelectorAll('.stat').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 120);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) counterObserver.observe(statsSection);

  // ── Formulário de contato ────────────────────
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const original  = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      // Simula envio (substitua por fetch real para seu backend)
      setTimeout(() => {
        form.hidden = true;
        formSuccess.hidden = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      }, 1400);
    });
  }

  if (formReset) {
    formReset.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      formSuccess.hidden = true;
    });
  }

  // ── Máscara de telefone ───────────────────────
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else {
        v = v.replace(/^(\d*)$/, '$1');
      }
      telInput.value = v;
    });
  }

  // ── Scroll suave para links âncora ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Ícones decorativos: ocultar de leitores de tela ──
  document.querySelectorAll('i[class*="fa-"]').forEach(icon => {
    if (!icon.hasAttribute('aria-label')) {
      icon.setAttribute('aria-hidden', 'true');
    }
  });

  // ── Init ─────────────────────────────────────
  onScroll();
})();
