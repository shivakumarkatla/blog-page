/* ==========================================================================
   THEME.JS
   Dark/light theme toggle. Preference is persisted in localStorage; if the
   user has never chosen, falls back to the OS-level color scheme and stays
   in sync with it until the user makes an explicit choice.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, getStorage, setStorage } = window.BlogUtils || {};
  const STORAGE_KEY = 'marginalia-theme';

  let toggleBtn;
  let systemPrefersDark;

  /**
   * Applies a theme to the document and syncs the toggle button's
   * accessible state (aria-pressed, aria-label).
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (!toggleBtn) return;
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', String(isDark));
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  /**
   * Determines the theme to use on first load: an explicit saved
   * preference takes priority over the OS-level scheme.
   * @returns {'light'|'dark'}
   */
  function getInitialTheme() {
    const saved = getStorage(STORAGE_KEY, null);
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersDark.matches ? 'dark' : 'light';
  }

  function handleToggleClick() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStorage(STORAGE_KEY, next);
  }

  /**
   * If the user hasn't made an explicit choice yet, keep following the OS
   * setting live (e.g. system switches to dark mode at sunset).
   */
  function handleSystemChange(event) {
    const saved = getStorage(STORAGE_KEY, null);
    if (saved === 'light' || saved === 'dark') return; // explicit choice wins
    applyTheme(event.matches ? 'dark' : 'light');
  }

  function init() {
    toggleBtn = qs('#theme-toggle');
    systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    applyTheme(getInitialTheme());

    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleToggleClick);
    }

    // Support both the modern and legacy MediaQueryList listener APIs.
    if (typeof systemPrefersDark.addEventListener === 'function') {
      systemPrefersDark.addEventListener('change', handleSystemChange);
    } else if (typeof systemPrefersDark.addListener === 'function') {
      systemPrefersDark.addListener(handleSystemChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
