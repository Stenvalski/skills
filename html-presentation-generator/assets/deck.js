/*
 * deck.js — minimal presentation engine
 *
 * Usage:
 *   <div class="deck">
 *     <section> ...slide 1... </section>
 *     <section> ...slide 2... </section>
 *   </div>
 *   <script src="deck.js"></script>
 *
 * Elements with class="fragment" inside a slide are revealed one
 * step at a time before advancing to the next slide.
 *
 * Keys: → ↓ Space PgDn  next   |  ← ↑ PgUp  prev
 *       Home / End  first / last  |  F fullscreen  |  ? help
 */
(function () {
  'use strict';

  const deck = document.querySelector('.deck');
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll(':scope > section'));
  if (slides.length === 0) return;

  let current = -1;

  /* ---------- chrome (progress bar, counter, nav buttons, help) ---------- */

  deck.insertAdjacentHTML('beforeend',
    '<div class="deck-progress" aria-hidden="true"><div class="deck-progress-bar"></div></div>' +
    '<div class="deck-hud">' +
      '<button class="deck-btn deck-btn-prev" aria-label="Previous slide">&#8249;</button>' +
      '<span class="deck-counter" aria-live="polite"></span>' +
      '<button class="deck-btn deck-btn-next" aria-label="Next slide">&#8250;</button>' +
    '</div>' +
    '<div class="deck-help" hidden>' +
      '<div class="deck-help-panel">' +
        '<h2>Keyboard shortcuts</h2>' +
        '<table>' +
          '<tr><td><kbd>&rarr;</kbd> <kbd>&darr;</kbd> <kbd>Space</kbd></td><td>Next step / slide</td></tr>' +
          '<tr><td><kbd>&larr;</kbd> <kbd>&uarr;</kbd></td><td>Previous step / slide</td></tr>' +
          '<tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>First / last slide</td></tr>' +
          '<tr><td><kbd>F</kbd></td><td>Fullscreen</td></tr>' +
          '<tr><td><kbd>?</kbd></td><td>Toggle this help</td></tr>' +
        '</table>' +
        '<p>Tip: each slide has its own URL &mdash; copy the address bar to link to it.</p>' +
      '</div>' +
    '</div>');

  const progressBar = deck.querySelector('.deck-progress-bar');
  const counter = deck.querySelector('.deck-counter');
  const helpOverlay = deck.querySelector('.deck-help');

  deck.querySelector('.deck-btn-prev').addEventListener('click', prev);
  deck.querySelector('.deck-btn-next').addEventListener('click', next);
  helpOverlay.addEventListener('click', toggleHelp);

  /* ---------- fragments ---------- */

  function fragmentsOf(slide) {
    return Array.from(slide.querySelectorAll('.fragment'));
  }

  function visibleFragments(slide) {
    return fragmentsOf(slide).filter(function (f) {
      return f.classList.contains('visible');
    });
  }

  /* ---------- navigation ---------- */

  function goTo(index, revealAll) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current) return;
    current = index;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
      slide.classList.toggle('is-past', i < current);
      slide.classList.toggle('is-future', i > current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      // entering forward: fragments start hidden; stepping back: show them all
      if (i === current) {
        fragmentsOf(slide).forEach(function (f) {
          f.classList.toggle('visible', !!revealAll);
        });
      }
    });

    progressBar.style.width = (slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100) + '%';
    counter.textContent = (current + 1) + ' / ' + slides.length;
    if (String(current + 1) !== location.hash.slice(1)) {
      history.replaceState(null, '', '#' + (current + 1));
    }
  }

  function next() {
    const pending = fragmentsOf(slides[current]).find(function (f) {
      return !f.classList.contains('visible');
    });
    if (pending) {
      pending.classList.add('visible');
    } else {
      goTo(current + 1, false);
    }
  }

  function prev() {
    const shown = visibleFragments(slides[current]);
    if (shown.length > 0) {
      shown[shown.length - 1].classList.remove('visible');
    } else {
      goTo(current - 1, true);
    }
  }

  /* ---------- keyboard ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); goTo(0, false); break;
      case 'End':
        e.preventDefault(); goTo(slides.length - 1, false); break;
      case 'f':
      case 'F':
        toggleFullscreen(); break;
      case '?':
        toggleHelp(); break;
      case 'Escape':
        if (!helpOverlay.hidden) toggleHelp(); break;
    }
  });

  /* ---------- touch (swipe) ---------- */

  let touchX = null;
  deck.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  /* ---------- helpers ---------- */

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  function toggleHelp() {
    helpOverlay.hidden = !helpOverlay.hidden;
  }

  /* ---------- deep links (#3 = slide 3) ---------- */

  function slideFromHash() {
    const n = parseInt(location.hash.slice(1), 10);
    return isNaN(n) ? 0 : n - 1;
  }

  window.addEventListener('hashchange', function () {
    goTo(slideFromHash(), false);
  });

  goTo(slideFromHash(), false);

  // small public API, in case a page wants to hook in
  window.Deck = { next: next, prev: prev, goTo: goTo, get current() { return current; }, slides: slides };
})();
