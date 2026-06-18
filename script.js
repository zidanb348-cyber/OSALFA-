/* ============================================
   OSALFA — OSIS SMPI Al-Fakhir
   script.js
   ============================================ */

'use strict';

/* ---- LOADER ---- */
const loader   = document.getElementById('loader');
const fillEl   = document.getElementById('loaderFill');
const textEl   = document.getElementById('loaderText');
const messages = ['Memuat sistem…', 'Menginisialisasi…', 'Mempersiapkan konten…', 'Hampir selesai…', 'Selamat datang!'];
let prog = 0;
let msgIdx = 0;

const loaderInterval = setInterval(() => {
  prog += Math.random() * 18 + 5;
  if (prog >= 100) { prog = 100; clearInterval(loaderInterval); }
  fillEl.style.width = prog + '%';
  if (msgIdx < messages.length - 1 && prog > (msgIdx + 1) * 20) {
    msgIdx++;
    textEl.textContent = messages[msgIdx];
  }
}, 120);

window.addEventListener('load', () => {
  setTimeout(() => {
    prog = 100;
    fillEl.style.width = '100%';
    textEl.textContent = 'Selamat datang!';
    setTimeout(() => loader.classList.add('hidden'), 500);
  }, 1200);
});

/* ---- CUSTOM CURSOR ---- */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Trail with lerp
function animateTrail() {
  tx += (mx - tx) * 0.14;
  ty += (my - ty) * 0.14;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .photo-item, .org-card, .about-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursorTrail.style.opacity = '0.8';
    cursorTrail.style.borderColor = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.opacity = '0.5';
    cursorTrail.style.borderColor = 'var(--accent2)';
  });
});

/* ---- PARTICLE SYSTEM ---- */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function isDark() { return document.body.classList.contains('dark-mode'); }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 2.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() < 0.5 ? '#00B4D8' : '#FF6B9D';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles(n = 80) {
  particles = Array.from({ length: n }, () => new Particle());
}

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00B4D8';
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

/* ---- TAB NAVIGATION ---- */
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const link = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (link) link.classList.add('active');
  navLinks.classList.remove('open');
  document.querySelectorAll('.hamburger span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  // Re-trigger fade-in
  setTimeout(observeFadeIns, 100);
};

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.tab);
  });
});

/* ---- THEME TOGGLE ---- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const body        = document.getElementById('body');

let darkMode = false;

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  body.classList.toggle('dark-mode', darkMode);
  themeIcon.textContent = darkMode ? '☀️' : '🌙';
  // Refresh particle colors
  particles.forEach(p => {
    p.color = Math.random() < 0.5 ? '#00B4D8' : '#FF6B9D';
  });
});

/* ---- PROGRAM TABS ---- */
document.querySelectorAll('.prog-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.prog-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prog-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.prog);
    if (target) target.classList.add('active');
  });
});

/* ---- GALLERY FILTER ---- */
document.querySelectorAll('.gal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.photo-item').forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ---- LIGHTBOX ---- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.photo-item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ---- FADE-IN ON SCROLL ---- */
function observeFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}
observeFadeIns();

/* ---- HERO PARALLAX ---- */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero && document.getElementById('home').classList.contains('active')) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.25}px)`;
  }
});

/* ---- MOUSE REPEL PARTICLES ---- */
document.addEventListener('mousemove', e => {
  particles.forEach(p => {
    const dx   = e.clientX - p.x;
    const dy   = e.clientY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      const force = (80 - dist) / 80;
      p.vx -= (dx / dist) * force * 0.8;
      p.vy -= (dy / dist) * force * 0.8;
      // Dampen
      p.vx *= 0.96;
      p.vy *= 0.96;
    }
  });
});

/* ---- REDUCED MOTION ---- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  cancelAnimationFrame(animFrame);
  canvas.style.display = 'none';
}

/* ---- SMOOTH CARD TILT ---- */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
addTilt('.about-card, .org-card, .tujuan-card, .contact-card');

/* ---- TYPEWRITER FOR HERO EYEBROW ---- */
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const original = 'OSIS SMPI Al-Fakhir';
  eyebrow.textContent = '';
  let i = 0;
  const typeInterval = setInterval(() => {
    eyebrow.textContent += original[i];
    i++;
    if (i >= original.length) clearInterval(typeInterval);
  }, 80);
}

/* ---- DYNAMIC YEAR ---- */
const yearEls = document.querySelectorAll('[data-year]');
yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });
