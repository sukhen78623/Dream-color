/**
 * Dream Color – central site configuration
 * ------------------------------------------------------------------
 * This is the ONE place where the shared header navigation and footer
 * links are managed. Every page that loads layout.js renders the same
 * header and footer from this file, so editing it updates the whole site.
 *
 * Link rules
 *  - `href` is written relative to the SITE ROOT (the folder that holds
 *    the `assets/` folder), never relative to the current page.
 *    layout.js resolves it, so the same link works from /, /blog/post/
 *    or any other nested URL.
 *  - Full URLs (https://…) are allowed and open in a new tab.
 *
 * Adding future pages (examples, do not uncomment until the pages exist):
 *
 *   nav: [
 *     { label: 'Home',  href: 'home.html' },
 *     { label: 'Tools', href: TOOLS + '#palette' },
 *     { label: 'Blog',  href: 'blog/' },
 *     { label: 'About', href: 'about.html' }
 *   ]
 *
 * If the color tools page ever moves (for example to /color-tools/),
 * change the single TOOLS constant below and every link follows.
 */
(function (global) {
  'use strict';

  // Path of the Color Tools page, relative to the site root.
  var TOOLS = 'index.html';

  global.DreamColorConfig = {
    siteName: 'Dream Color',
    tagline: 'Free color palettes, gradients and developer color utilities. Everything runs in your browser.',

    // Where the logo links to.
    homeHref: TOOLS,

    // Shared head assets (paths relative to the site root).
    favicon: 'assets/img/favicon.svg',
    baseStylesheet: 'assets/css/base.css',
    themeColor: '#5a4af0',

    // Header navigation.
    nav: [
      { label: 'Palette',      href: TOOLS + '#palette' },
      { label: 'Presets',      href: TOOLS + '#presets' },
      { label: 'Gradients',    href: TOOLS + '#gradient' },
      { label: 'Developer',    href: TOOLS + '#developer' },
      { label: 'Guide',        href: TOOLS + '#guide' },
      { label: 'FAQ',          href: TOOLS + '#faq' }
    ],

    // Footer content.
    footer: {
      groups: [
        {
          title: 'Palette tools',
          links: [
            { label: 'Color Palette Generator', href: TOOLS + '#palette' },
            { label: 'Palette Presets',         href: TOOLS + '#presets' }
          ]
        },
        {
          title: 'Gradient tools',
          links: [
            { label: 'Gradient Studio', href: TOOLS + '#gradient' }
          ]
        },
        {
          title: 'Developer tools',
          links: [
            { label: 'HEX, RGB & HSL Converters', href: TOOLS + '#developer' },
            { label: 'Color Contrast Checker',    href: TOOLS + '#tool-contrast' }
          ]
        },
        {
          title: 'Learn',
          links: [
            { label: 'Color Guide', href: TOOLS + '#guide' },
            { label: 'FAQ',         href: TOOLS + '#faq' }
          ]
        }
      ],
      // {year} is replaced automatically.
      note: '© {year} Dream Color. No sign-up, no tracking of your colors: everything is processed in your browser.'
    }
  };
})(window);
