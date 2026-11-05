/* Dream Color – shared header.
   Each page contains <header class="site-header" id="site-header"></header>
   followed by site.js and this file. The markup is inserted instantly (no
   network request), so it works on Cloudflare Pages and offline. */
(function () {
  'use strict';

  var dc = window.DreamColor;
  var header = document.getElementById('site-header');
  if (!dc || !header) { return; }

  var items = [{ name: 'Home', href: '/' }].concat(dc.tools.filter(function (t) { return t.live; }));

  var links = items.map(function (item) {
    var current = dc.isCurrent(item.href) ? ' aria-current="page"' : '';
    return '<li><a href="' + item.href + '"' + current + '>' + item.name + '</a></li>';
  }).join('');

  header.innerHTML =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="accent-line" aria-hidden="true"></div>' +
    '<div class="wrap header-inner">' +
      '<a class="brand" href="/" aria-label="Dream Color – home">' + dc.logo() + '</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + '</ul></nav>' +
    '</div>';

  var toggle = header.querySelector('.nav-toggle');

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('is-open'));
  });

  header.querySelectorAll('.site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) { setOpen(false); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  var wide = window.matchMedia('(min-width: 760px)');
  var onChange = function () { if (wide.matches) { setOpen(false); } };
  if (wide.addEventListener) { wide.addEventListener('change', onChange); } else { wide.addListener(onChange); }
})();
