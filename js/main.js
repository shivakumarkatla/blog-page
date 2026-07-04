/* ==========================================================================
   MAIN.JS
   Entry point. Wires up small, page-agnostic behaviors that don't belong
   to a dedicated module: footer year, back-to-top button, and the reading
   progress bar (used on post.html once that page exists).
   This file should load last, after all other modules.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, debounce } = window.BlogUtils || {};
  const BACK_TO_TOP_THRESHOLD = 400; // px scrolled before the button appears

  /**
   * Fills in the footer's copyright year automatically, so it never goes
   * stale across year boundaries.
   */
  function setFooterYear() {
    const yearEl = qs('#current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /**
   * Shows/hides the back-to-top button based on scroll position, and
   * scrolls to top on click — instantly if the user prefers reduced
   * motion, smoothly otherwise.
   */
  function initBackToTop() {
    const btn = qs('#back-to-top');
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function toggleVisibility() {
      btn.classList.toggle('is-visible', window.scrollY > BACK_TO_TOP_THRESHOLD);
    }

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });

    window.addEventListener('scroll', debounce(toggleVisibility, 100));
    toggleVisibility(); // set correct initial state on load (e.g. after a reload mid-page)
  }

  /**
   * Updates the reading progress bar's width to match how far the reader
   * has scrolled through the page. No-ops safely on pages without the
   * .reading-progress__bar element (i.e. every page except post.html).
   */
  function initReadingProgress() {
    const bar = qs('.reading-progress__bar');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener('scroll', debounce(updateProgress, 50));
    updateProgress();
  }

  function init() {
    setFooterYear();
    initBackToTop();
    initReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
