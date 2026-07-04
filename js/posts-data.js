/* ==========================================================================
   POSTS-DATA.JS
   Sample content for the blog. Each post is a plain object — this file is
   intentionally the only place that "knows" about the data shape, so it
   can later be replaced by a fetch() call to a real API/CMS without any
   other module needing to change, as long as the shape is preserved.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * @typedef {Object} Post
   * @property {string} id           - unique slug, used in URLs (?post=id)
   * @property {string} title
   * @property {string} excerpt      - short summary shown on cards
   * @property {string} content      - full body text (plain text, used for read-time estimate)
   * @property {string} category     - one of: technology, design, culture, writing
   * @property {string[]} tags
   * @property {string} authorName
   * @property {string} authorInitials
   * @property {string} date         - ISO date string (YYYY-MM-DD)
   * @property {boolean} featured
   */

  /** @type {Post[]} */
  const posts = [
    {
      id: 'quiet-cost-of-defaults',
      title: 'The quiet cost of a thousand small defaults',
      excerpt:
        'On the invisible choices baked into the tools we use every day, and why revisiting them is one of the most underrated forms of craftsmanship.',
      content:
        'Every default you never questioned is a decision someone else made for you, usually in a hurry. This essay walks through a handful of defaults in modern software, from form validation to onboarding flows, and asks what changes when we treat them as choices rather than facts. We look at case studies from three products and propose a lightweight audit process any small team can run in an afternoon. The goal is not to reject every default outright, but to know which ones you are actually endorsing.',
      category: 'design',
      tags: ['design', 'technology'],
      authorName: 'Jordan Ellis',
      authorInitials: 'JE',
      date: '2026-06-24',
      featured: true,
    },
    {
      id: 'writing-for-machines',
      title: 'Writing for an audience that never sleeps',
      excerpt:
        'Search engines, assistants, and now language models all read what we publish. What does it mean to write for readers who are never quite human?',
      content:
        'A short reflection on how the presence of automated readers changes editorial decisions, from headline structure to how explicitly a piece states its own conclusions. Includes three practical habits for writers who want their work to stay legible to people first.',
      category: 'writing',
      tags: ['writing', 'technology'],
      authorName: 'Priya Nataraj',
      authorInitials: 'PN',
      date: '2026-06-18',
      featured: false,
    },
    {
      id: 'slow-interfaces',
      title: 'In defense of the slow interface',
      excerpt:
        'Not every interaction needs to be instant. A look at where friction, deliberately placed, makes software more trustworthy.',
      content:
        'This piece argues that some of the best interfaces are the ones that make you wait, just a little, at exactly the right moment. We examine confirmation dialogs, undo windows, and deliberately paced onboarding as examples of friction used well, and contrast them with interfaces that remove friction indiscriminately in the name of speed.',
      category: 'design',
      tags: ['design'],
      authorName: 'Marcus Webb',
      authorInitials: 'MW',
      date: '2026-06-10',
      featured: false,
    },
    {
      id: 'archive-fever',
      title: 'Archive fever: why we keep everything now',
      excerpt:
        'Storage got cheap and deletion got hard. A cultural history of the full inbox, the endless camera roll, and the folder we never clean out.',
      content:
        'An essay on the psychology and economics of digital hoarding, tracing how falling storage costs changed our relationship to memory, mess, and letting go. Draws on interviews with archivists and everyday users about what they keep and why.',
      category: 'culture',
      tags: ['culture', 'technology'],
      authorName: 'Jordan Ellis',
      authorInitials: 'JE',
      date: '2026-06-02',
      featured: false,
    },
    {
      id: 'notes-on-naming',
      title: 'Notes on naming things',
      excerpt:
        'Variable names, product names, chapter titles — the same small discipline applies everywhere. A working list of rules I keep breaking.',
      content:
        'A practical, slightly self-deprecating list of naming heuristics gathered from years of writing code and copy side by side. Covers specificity, consistency, and knowing when a boring name is the right name.',
      category: 'writing',
      tags: ['writing', 'design'],
      authorName: 'Priya Nataraj',
      authorInitials: 'PN',
      date: '2026-05-27',
      featured: false,
    },
    {
      id: 'the-office-that-learned-to-listen',
      title: 'The office that learned to listen',
      excerpt:
        'A small case study on redesigning a workplace around actual behavior instead of assumed behavior.',
      content:
        'This case study follows a mid-sized company through a year of observing how people actually used their office, and the surprisingly modest changes that followed. A useful counterpoint to grand workplace-of-the-future narratives.',
      category: 'culture',
      tags: ['culture', 'design'],
      authorName: 'Marcus Webb',
      authorInitials: 'MW',
      date: '2026-05-19',
      featured: false,
    },
    {
      id: 'version-control-for-thought',
      title: 'Version control for thought',
      excerpt:
        'What note-taking software could learn from Git — and what it definitely should not.',
      content:
        'An exploration of branching, merging, and history as metaphors for how ideas evolve, with a healthy skepticism about forcing every creative process into an engineering metaphor.',
      category: 'technology',
      tags: ['technology', 'writing'],
      authorName: 'Jordan Ellis',
      authorInitials: 'JE',
      date: '2026-05-11',
      featured: false,
    },
    {
      id: 'the-grid-and-the-garden',
      title: 'The grid and the garden',
      excerpt:
        'Two metaphors for organizing information, and why most systems secretly want to be both at once.',
      content:
        'A design essay comparing rigid grid-based information systems with looser, garden-like ones that grow and prune over time, and what a hybrid approach looks like in practice for teams building internal tools.',
      category: 'design',
      tags: ['design', 'technology'],
      authorName: 'Priya Nataraj',
      authorInitials: 'PN',
      date: '2026-05-04',
      featured: false,
    },
    {
      id: 'reading-in-public',
      title: 'Reading in public again',
      excerpt:
        'A short note on the quiet return of the physical book on the train, and what it says about attention.',
      content:
        'An observational piece on shifting reading habits in public spaces, paired with a light survey of commuters about why they chose paper over a screen for this particular trip.',
      category: 'culture',
      tags: ['culture', 'writing'],
      authorName: 'Marcus Webb',
      authorInitials: 'MW',
      date: '2026-04-28',
      featured: false,
    },
  ];

  // Expose as a namespaced global, consumed by render-posts.js and search.js.
  window.BlogPosts = posts;
})();
