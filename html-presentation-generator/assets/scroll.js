/*
 * scroll.js — scrollytelling engine (companion to deck.js)
 *
 * For vertical story pages with a central timeline: milestones fly in
 * as they enter the viewport, a progress bar tracks scroll, and the
 * keyboard jumps milestone by milestone.
 *
 * Usage:
 *   <body class="scrolldeck">
 *     <header class="sd-hero"> ... </header>
 *     <div class="sd-timeline">
 *       <article class="milestone" id="first"> ... </article>
 *       ...
 *     </div>
 *     <footer class="sd-end"> ... </footer>
 *   <script src="scroll.js"></script>
 *
 * Keys: ↓ J  next milestone | ↑ K  previous | Home / End
 */
(function () {
  'use strict';

  const milestones = Array.from(document.querySelectorAll('.milestone'));
  if (milestones.length === 0) return;

  document.body.insertAdjacentHTML('beforeend',
    '<div class="sd-progress" aria-hidden="true"><div class="sd-progress-bar"></div></div>');
  const progressBar = document.querySelector('.sd-progress-bar');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveals + progress + current milestone ---------- */

  let current = -1;

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

    const mid = window.innerHeight / 2;
    let best = -1, bestDist = Infinity;
    milestones.forEach(function (m, i) {
      const r = m.getBoundingClientRect();

      // fly in once its top passes 85% of the viewport (or it's above it)
      if (r.top < window.innerHeight * 0.85) m.classList.add('in-view');

      // current = milestone whose center is nearest the viewport center
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    if (best !== current) {
      current = best;
      milestones.forEach(function (m, i) {
        m.classList.toggle('is-current', i === current);
      });
    }
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- keyboard: jump milestone by milestone ---------- */

  function jumpTo(i) {
    i = Math.max(0, Math.min(milestones.length - 1, i));
    milestones[i].scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center'
    });
    if (milestones[i].id) history.replaceState(null, '', '#' + milestones[i].id);
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'j':
      case 'J':
        e.preventDefault(); jumpTo(current + 1); break;
      case 'ArrowUp':
      case 'k':
      case 'K':
        e.preventDefault(); jumpTo(current - 1); break;
      case 'Home':
        e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); break;
      case 'End':
        e.preventDefault(); window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' }); break;
    }
  });
})();
