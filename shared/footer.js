/* Dream Color – shared footer.
   Each page contains <footer class="site-footer" id="site-footer"></footer>
   followed by this file (site.js must already be loaded). */
(function () {
  'use strict';

  var dc = window.DreamColor;
  var footer = document.getElementById('site-footer');
  if (!dc || !footer) { return; }

  // Tools that are not built yet are shown as plain text, never as links.
  var tools = dc.tools.map(function (t) {
    return t.live
      ? '<li><a href="' + t.href + '">' + t.name + '</a></li>'
      : '<li><span class="soon">' + t.name + '<em>Soon</em></span></li>';
  }).join('');

  // Company links appear only once their pages exist (live: true in site.js).
  var pages = dc.pages.filter(function (p) { return p.live; }).map(function (p) {
    return '<li><a href="' + p.href + '">' + p.name + '</a></li>';
  }).join('');

  var pagesColumn = pages
    ? '<nav class="footer-col" aria-label="Company"><p class="footer-title">Dream Color</p><ul>' + pages + '</ul></nav>'
    : '';

  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<a class="brand" href="/" aria-label="Dream Color – home">' + dc.logo() + '</a>' +
          '<p>' + dc.description + '</p>' +
        '</div>' +
        '<nav class="footer-col" aria-label="Tools"><p class="footer-title">Tools</p><ul>' + tools + '</ul></nav>' +
        pagesColumn +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; ' + new Date().getFullYear() + ' Dream Color. ' + dc.tagline + '</p>' +
        '<p>Your colors never leave your browser.</p>' +
      '</div>' +
    '</div>';
})();
