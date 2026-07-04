/* ==========================================================================
   NAV.JS
   Mobile navigation menu: toggle open/closed, close on Escape, close on
   outside click, close on link selection, and reset state if the viewport
   grows past the desktop breakpoint while the menu is open.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, qsa } = window.BlogUtils || {};
  const DESKTOP_BREAKPOINT = 1024;

  let toggleBtn;
  let menu;
  let nav;

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  function openMenu() {
    menu.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.querySelector('.sr-only').textContent = 'Close menu';
  }

  function closeMenu({ returnFocus = false } = {}) {
    menu.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.querySelector('.sr-only').textContent = 'Open menu';
    if (returnFocus) toggleBtn.focus();
  }

  function handleToggleClick() {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleDocumentKeydown(event) {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu({ returnFocus: true });
    }
  }

  function handleDocumentClick(event) {
    if (!isOpen()) return;
    const clickedInsideNav = nav.contains(event.target);
    if (!clickedInsideNav) closeMenu();
  }

  function handleMenuLinkClick(event) {
    if (event.target.matches('.nav__link')) {
      closeMenu();
    }
  }

  function handleResize() {
    if (window.innerWidth >= DESKTOP_BREAKPOINT && isOpen()) {
      closeMenu();
    }
  }

  function init() {
    toggleBtn = qs('#nav-toggle');
    menu = qs('#primary-menu');
    nav = qs('.nav');

    if (!toggleBtn || !menu || !nav) return;

    toggleBtn.addEventListener('click', handleToggleClick);
    menu.addEventListener('click', handleMenuLinkClick);
    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('resize', window.BlogUtils.debounce(handleResize, 150));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
