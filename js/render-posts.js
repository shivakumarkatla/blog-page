/* ==========================================================================
   RENDER-POSTS.JS
   Renders post cards into #postGrid, with category filtering and
   pagination. Depends on BlogUtils (utils.js) and BlogPosts (posts-data.js),
   both of which must load before this file.
   ========================================================================== */

(function () {
  'use strict';

  const { qs, qsa, formatDate, estimateReadTime } = window.BlogUtils || {};
  const POSTS_PER_PAGE = 6;

  // Module-level state for the current filter/page. Kept private to this
  // IIFE; other modules interact through the exposed BlogRender API only.
  const state = {
    category: 'all',
    page: 1,
    query: '',
  };

  let gridEl;
  let paginationEl;
  let filterButtons;

  /**
   * Returns posts eligible for the grid (excludes the post already shown
   * in the hero "featured" section on the homepage).
   */
  function getGridPosts() {
    if (!window.BlogPosts) return [];
    return window.BlogPosts.filter((post) => !post.featured);
  }

  /**
   * Applies the current category filter (and, if present, the current
   * search query) to a post list.
   * @param {Array} posts
   */
  function applyFilter(posts) {
    let result = posts;

    if (state.category !== 'all') {
      result = result.filter((post) => post.category === state.category);
    }

    const query = (state.query || '').trim().toLowerCase();
    if (query) {
      result = result.filter((post) => {
        const haystack = `${post.title} ${post.excerpt}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    return result;
  }

  /**
   * Builds a single post card DOM element from a post object.
   * Uses textContent for all user-facing text (safe by default) and only
   * uses innerHTML for the static, developer-authored decorative SVG.
   * @param {Object} post
   */
  function buildCardElement(post) {
    const article = document.createElement('article');
    article.className = 'post-card';

    // Decorative illustration (purely visual, hidden from assistive tech)
    const figureLink = document.createElement('a');
    figureLink.href = `post.html?id=${encodeURIComponent(post.id)}`;
    figureLink.className = 'post-card__figure';
    figureLink.setAttribute('aria-hidden', 'true');
    figureLink.setAttribute('tabindex', '-1');
    figureLink.innerHTML =
      '<svg viewBox="0 0 400 250" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
      '<rect width="400" height="250" class="illo-bg"/>' +
      '<circle cx="90" cy="80" r="34" class="illo-accent"/>' +
      '<path d="M40 190C90 160 130 210 180 180C230 150 270 200 360 170" stroke="currentColor" stroke-width="2" fill="none" class="illo-line"/>' +
      '</svg>';

    const body = document.createElement('div');
    body.className = 'post-card__body';

    // Tags
    const tagList = document.createElement('ul');
    tagList.className = 'tag-list';
    tagList.setAttribute('aria-label', 'Post tags');
    (post.tags || []).slice(0, 2).forEach((tag) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `archive.html?tag=${encodeURIComponent(tag)}`;
      a.className = 'tag-pill';
      a.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
      li.appendChild(a);
      tagList.appendChild(li);
    });

    // Title (the primary link — carries the stretched-link click target)
    const title = document.createElement('h3');
    title.className = 'post-card__title';
    const titleLink = document.createElement('a');
    titleLink.href = `post.html?id=${encodeURIComponent(post.id)}`;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);

    // Excerpt
    const excerpt = document.createElement('p');
    excerpt.className = 'post-card__excerpt';
    excerpt.textContent = post.excerpt;

    // Meta: avatar, author, date, read time
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML =
      `<span class="post-meta__avatar" role="img" aria-label="Author: ${post.authorName}">${post.authorInitials}</span>` +
      '<div class="post-meta__details">' +
      `<span class="post-meta__name"></span>` +
      '<span class="post-meta__sep" aria-hidden="true">·</span>' +
      `<time class="post-meta__date"></time>` +
      '<span class="post-meta__sep" aria-hidden="true">·</span>' +
      `<span class="post-meta__read-time"></span>` +
      '</div>';
    // Fill in text nodes safely rather than interpolating raw strings above
    meta.querySelector('.post-meta__name').textContent = post.authorName;
    const timeEl = meta.querySelector('.post-meta__date');
    timeEl.setAttribute('datetime', post.date);
    timeEl.textContent = formatDate(post.date);
    meta.querySelector('.post-meta__read-time').textContent = estimateReadTime(post.content);

    body.append(tagList, title, excerpt, meta);
    article.append(figureLink, body);
    return article;
  }

  /**
   * Renders the current page of (filtered) posts into #postGrid,
   * and rebuilds pagination controls to match.
   */
  function renderGrid() {
    if (!gridEl) return;

    const filtered = applyFilter(getGridPosts());
    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * POSTS_PER_PAGE;
    const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);

    gridEl.innerHTML = '';

    if (pagePosts.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'posts__empty';
      empty.textContent = state.query
        ? `No posts match "${state.query}". Try a different search term.`
        : 'No posts match this category yet. Try a different filter.';
      gridEl.appendChild(empty);
    } else {
      const fragment = document.createDocumentFragment();
      pagePosts.forEach((post) => fragment.appendChild(buildCardElement(post)));
      gridEl.appendChild(fragment);
    }

    renderPagination(totalPages);
  }

  /**
   * Rebuilds the pagination nav based on the current page/total pages.
   * @param {number} totalPages
   */
  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';

    if (totalPages <= 1) return; // no pagination needed for a single page

    const fragment = document.createDocumentFragment();

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'pagination__btn';
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = state.page === 1;
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.addEventListener('click', () => {
      state.page = Math.max(1, state.page - 1);
      renderGrid();
      gridEl.focus();
    });
    fragment.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i += 1) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = 'pagination__btn';
      pageBtn.textContent = String(i);
      if (i === state.page) {
        pageBtn.classList.add('is-active');
        pageBtn.setAttribute('aria-current', 'page');
      }
      pageBtn.setAttribute('aria-label', `Page ${i}`);
      pageBtn.addEventListener('click', () => {
        state.page = i;
        renderGrid();
        gridEl.focus();
      });
      fragment.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'pagination__btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = state.page === totalPages;
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.addEventListener('click', () => {
      state.page = Math.min(totalPages, state.page + 1);
      renderGrid();
      gridEl.focus();
    });
    fragment.appendChild(nextBtn);

    paginationEl.appendChild(fragment);
  }

  /**
   * Wires up the category filter pill buttons.
   */
  function bindFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        state.category = btn.dataset.category;
        state.page = 1;
        renderGrid();
      });
    });
  }

  /**
   * Entry point, called once the DOM is ready.
   */
  function init() {
    gridEl = qs('#postGrid');
    paginationEl = qs('#pagination');
    filterButtons = qsa('.pill--filter');

    if (!gridEl) return; // this page doesn't have a post grid (e.g. contact.html)

    // Grid needs to be programmatically focusable so pagination clicks can
    // move keyboard/screen-reader focus back to the top of the results.
    gridEl.setAttribute('tabindex', '-1');

    bindFilters();
    renderGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose a small API so search.js can trigger re-renders with a text query.
  window.BlogRender = {
    getGridPosts,
    renderGrid,
    state,
  };
})();
