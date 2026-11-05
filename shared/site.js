/* Dream Color – shared site configuration.
   Used by header.js and footer.js.

   To publish a new tool later:
   1. Build its page (for example /gradient-generator/index.html).
   2. Change its `live` flag below from false to true.
   The header and footer update on every page automatically. */
(function () {
  'use strict';

  function normalise(path) {
    path = path.replace(/index\.html$/, '');
    return path.charAt(path.length - 1) === '/' ? path : path + '/';
  }

  window.DreamColor = {
    name: 'Dream Color',
    tagline: 'Create. Explore. Convert. Perfect your colors.',
    description: 'A free, simple and creative place to generate, explore and work with colors. Everything runs in your browser.',

    tools: [
      { name: 'Color Palette Generator', href: '/color-palette-generator/', live: true },
      { name: 'Gradient Generator', href: '/gradient-generator/', live: false },
      { name: 'Color Picker', href: '/color-picker/', live: false },
      { name: 'Color Converter', href: '/color-converter/', live: false },
      { name: 'Contrast Checker', href: '/contrast-checker/', live: false }
    ],

    // Other pages: they are not shown anywhere until `live` is true.
    pages: [
      { name: 'About', href: '/about/', live: false },
      { name: 'Contact', href: '/contact/', live: false },
      { name: 'Privacy Policy', href: '/privacy-policy/', live: false },
      { name: 'Terms of Service', href: '/terms-of-service/', live: false }
    ],

    // The animated logo. Same markup in header and footer; animation is pure CSS.
    logo: function () {
      var letters = 'Color'.split('').map(function (ch) { return '<span>' + ch + '</span>'; }).join('');
      return '<span class="dc-logo" role="img" aria-label="Dream Color">' +
        '<span class="dc-logo-dream" aria-hidden="true">Dream</span>' +
        '<span class="dc-logo-color" aria-hidden="true">' + letters + '</span>' +
        '</span>';
    },

    isCurrent: function (href) {
      return normalise(window.location.pathname) === normalise(href);
    }
  };
})();
