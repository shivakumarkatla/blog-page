/* ==========================================================================
   FORM-VALIDATION.JS
   Generic, reusable validation helpers built on the HTML5 Constraint
   Validation API, plus concrete handlers for each form on the site.
   Forms with no backend yet (this is a static front-end) simulate a
   successful submission after validation passes.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, qsa } = window.BlogUtils || {};

  /**
   * Produces a human-readable error message for an invalid field, based
   * on the browser's ValidityState. Falls back to the browser's default
   * validationMessage if no specific case matches.
   * @param {HTMLInputElement|HTMLTextAreaElement} field
   * @returns {string}
   */
  function getFieldErrorMessage(field) {
    const validity = field.validity;
    const label = field.dataset.label || field.name || 'This field';

    if (validity.valueMissing) return `${label} is required.`;
    if (validity.typeMismatch && field.type === 'email') {
      return 'Please enter a valid email address.';
    }
    if (validity.tooShort) {
      return `${label} must be at least ${field.minLength} characters.`;
    }
    return field.validationMessage || `${label} is invalid.`;
  }

  /**
   * Marks a field as invalid: adds the visual state class, sets
   * aria-invalid, and fills in a per-field error element if one exists
   * (an element with id="{field.id}-error").
   * @param {HTMLElement} field
   */
  function setFieldInvalid(field) {
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    const errorEl = qs(`#${field.id}-error`);
    if (errorEl) errorEl.textContent = getFieldErrorMessage(field);
  }

  /**
   * Clears the invalid state from a field.
   * @param {HTMLElement} field
   */
  function setFieldValid(field) {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');

    const errorEl = qs(`#${field.id}-error`);
    if (errorEl) errorEl.textContent = '';
  }

  /**
   * Validates every required/typed field inside a form. Returns true if
   * the whole form is valid; false otherwise. Invalid fields get visual
   * + accessible error state as a side effect.
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  function validateForm(form) {
    const fields = qsa('input, textarea', form).filter((el) => !el.disabled);
    let isFormValid = true;

    fields.forEach((field) => {
      if (field.checkValidity()) {
        setFieldValid(field);
      } else {
        setFieldInvalid(field);
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /**
   * Writes a message into a form's status region (role="status",
   * aria-live="polite" in the markup), so screen readers announce it
   * automatically without moving focus.
   * @param {HTMLElement} statusEl
   * @param {string} message
   * @param {'success'|'error'} type
   */
  function showFormStatus(statusEl, message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    statusEl.classList.add(type === 'success' ? 'is-success' : 'is-error');
  }

  /**
   * Wires the newsletter signup form: validates the email field, shows
   * inline feedback, and simulates a successful subscribe on success
   * (no backend exists yet — this is a static front-end).
   */
  function bindNewsletterForm() {
    const form = qs('#newsletter-form');
    if (!form) return;

    const statusEl = qs('#newsletter-status');
    const emailField = qs('#newsletter-email');
    if (emailField) emailField.dataset.label = 'Email address';

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateForm(form)) {
        showFormStatus(statusEl, getFieldErrorMessage(emailField), 'error');
        emailField.focus();
        return;
      }

      // No backend to send this to yet — simulate success locally.
      showFormStatus(statusEl, `Thanks! We'll send updates to ${emailField.value}.`, 'success');
      form.reset();
      setFieldValid(emailField);
    });

    // Re-validate on blur so errors clear as soon as the user fixes them,
    // rather than only on the next submit attempt.
    emailField?.addEventListener('blur', () => {
      if (emailField.value.trim() === '') return; // don't scold an untouched field
      if (emailField.checkValidity()) {
        setFieldValid(emailField);
      } else {
        setFieldInvalid(emailField);
      }
    });
  }

  /**
   * Wires the contact form, if present on the current page. Safe no-op
   * on pages that don't have one yet (contact.html is built in a later
   * step) — written now so this file doesn't need to change later.
   */
  function bindContactForm() {
    const form = qs('#contact-form');
    if (!form) return;

    const statusEl = qs('#contact-form-status');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateForm(form)) {
        showFormStatus(statusEl, 'Please fix the highlighted fields and try again.', 'error');
        const firstInvalid = qs('.is-invalid', form);
        firstInvalid?.focus();
        return;
      }

      showFormStatus(statusEl, "Thanks for reaching out — we'll reply soon.", 'success');
      form.reset();
      qsa('input, textarea', form).forEach(setFieldValid);
    });
  }

  function init() {
    bindNewsletterForm();
    bindContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
