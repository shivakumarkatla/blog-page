/* ==========================================================================
   UTILS.JS
   Small, dependency-free helper functions shared by other modules.
   Exposed on a single global namespace (window.BlogUtils) to avoid
   polluting the global scope with many separate names.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Debounce: delays invoking `fn` until `wait` ms have passed since the
   * last call. Used for search-as-you-type and scroll/resize listeners.
   * @param {Function} fn
   * @param {number} wait
   * @returns {Function}
   */
  function debounce(fn, wait) {
    let timeoutId;
    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /**
   * Formats an ISO date string ("2026-06-24") into a human-readable form
   * ("Jun 24, 2026"). Falls back gracefully if parsing fails.
   * @param {string} isoDate
   * @returns {string}
   */
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Estimates reading time from a body of text, assuming ~200 words/min.
   * @param {string} text
   * @returns {string} e.g. "6 min read"
   */
  function estimateReadTime(text) {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  /**
   * Shorthand for document.querySelector.
   * @param {string} selector
   * @param {ParentNode} [scope]
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Shorthand for document.querySelectorAll, returned as a real array.
   * @param {string} selector
   * @param {ParentNode} [scope]
   */
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /**
   * Safely reads a value from localStorage, returning `fallback` if
   * localStorage is unavailable (e.g. private browsing) or the key is unset.
   * @param {string} key
   * @param {*} fallback
   */
  function getStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (err) {
      return fallback;
    }
  }

  /**
   * Safely writes a value to localStorage; no-ops silently on failure.
   * @param {string} key
   * @param {string} value
   */
  function setStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      /* localStorage unavailable — fail silently, not a critical feature */
    }
  }

  /**
   * Basic slugify for generating heading IDs (used by table of contents).
   * @param {string} text
   */
  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // Expose a single namespaced global for other modules to consume.
  window.BlogUtils = {
    debounce,
    formatDate,
    estimateReadTime,
    qs,
    qsa,
    getStorage,
    setStorage,
    slugify,
  };
})();
