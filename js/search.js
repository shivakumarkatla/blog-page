/* ==========================================================================
   SEARCH.JS
   Client-side search. Filters the same post grid that render-posts.js
   manages, by mutating window.BlogRender.state.query and re-rendering.
   Falls back to a real page navigation (via the form's GET action) when
   no post grid is present on the current page.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, debounce } = window.BlogUtils || {};
  const DEBOUNCE_MS = 250;

  /**
   * Reads the "q" query parameter from the current URL, if any.
   * @returns {string}
   */
  function getQueryParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  /**
   * Applies a search term to the grid via BlogRender, if a grid exists
   * on this page.
   * @param {string} term
   */
  function applySearch(term) {
    if (!window.BlogRender) return;
    window.BlogRender.state.query = term;
    window.BlogRender.state.page = 1;
    window.BlogRender.renderGrid();
  }

  function init() {
    const form = qs('.nav__search');
    const input = qs('#nav-search-input');
    if (!form || !input) return;

    const hasGrid = Boolean(qs('#postGrid'));

    // Pre-fill from URL (?q=...) so a shared/bookmarked search link works,
    // and immediately filter the grid if one is present on this page.
    const initialQuery = getQueryParam();
    if (initialQuery) {
      input.value = initialQuery;
      if (hasGrid) applySearch(initialQuery);
    }

    if (hasGrid) {
      // Progressive enhancement: with a grid present, filter live and
      // prevent the default full-page navigation to archive.html.
      const debouncedSearch = debounce((value) => applySearch(value), DEBOUNCE_MS);

      input.addEventListener('input', (event) => {
        debouncedSearch(event.target.value);
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        applySearch(input.value);
        input.focus();
      });
    }
    // If no grid is present on this page (e.g. about.html, contact.html),
    // the form's native GET submission to archive.html?q=... is left
    // untouched, so search still works without any JS at all.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
