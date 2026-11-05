/**
 * Dream Color – shared layout loader
 * ------------------------------------------------------------------
 * Renders the shared header and footer on every page, so page files never
 * contain (or duplicate) that markup, CSS or JavaScript.
 *
 * A page opts in by including, in this order:
 *   <link rel="stylesheet" href="…/assets/css/base.css">
 *   <script src="…/assets/js/site-config.js" defer></script>
 *   <script src="…/assets/js/layout.js" defer></script>
 * plus these mount points in <body>:
 *   <div data-site-header></div>
 *   <main id="main"> … </main>
 *   <div data-site-footer></div>
 *
 * Nested pages: the site root is derived from this script's own URL, not
 * from the page URL, so links and assets resolve correctly from any depth
 * and on any host path (root domain, sub-folder or local file).
 *
 * Page scripts can wait for `document` event "dreamcolor:layout-ready".
 */
(function () {
  'use strict';

  var cfg = window.DreamColorConfig;
  if (!cfg) {
    if (window.console) console.error('Dream Color: site-config.js must load before layout.js');
    return;
  }

  /* ---------- Site root, derived from this script's URL ---------- */
  var script = document.currentScript;
  if (!script) {
    var found = document.querySelectorAll('script[src*="layout.js"]');
    script = found[found.length - 1];
  }
  var rootUrl = new URL('../../', script.src); // assets/js/layout.js -> site root

  var isHttp = /^https?:$/.test(location.protocol);

  function resolve(path) {
    var url = new URL(path, rootUrl);
    // On a web host, link to the clean folder URL ("/" or "/blog/") instead of
    // ".../index.html", which Cloudflare Pages would redirect anyway. Local
    // file previews keep "index.html" because file:// cannot open folders.
    if (isHttp && /\/index\.html$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/index\.html$/i, '');
    }
    return url;
  }

  // Normalise a pathname so "/", "/index.html" and "/about", "/about.html" compare equal.
  function normPath(p) {
    return p.replace(/(\/index)?\.html$/i, '').replace(/\/+$/, '') || '/';
  }
  var herePath = normPath(location.pathname);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Shared <head> assets (added only if the page lacks them) ---------- */
  function ensureHead() {
    var head = document.head;

    var css = resolve(cfg.baseStylesheet).href;
    var hasCss = Array.prototype.some.call(
      document.querySelectorAll('link[rel="stylesheet"]'),
      function (l) { return l.href === css; }
    );
    if (!hasCss) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = css;
      head.insertBefore(l, head.firstChild);
    }

    if (cfg.favicon && !document.querySelector('link[rel~="icon"]')) {
      var f = document.createElement('link');
      f.rel = 'icon';
      f.type = 'image/svg+xml';
      f.href = resolve(cfg.favicon).href;
      head.appendChild(f);
    }

    if (cfg.themeColor && !document.querySelector('meta[name="theme-color"]')) {
      var m = document.createElement('meta');
      m.name = 'theme-color';
      m.content = cfg.themeColor;
      head.appendChild(m);
    }
  }

  /* ---------- Link factory ---------- */
  var spyLinks = []; // links that point at a section on this very page

  function makeLink(item, className) {
    var url = resolve(item.href);
    var a = document.createElement('a');
    a.textContent = item.label;
    if (className) a.className = className;

    var sameSite = url.origin === location.origin;

    if (!sameSite && /^https?:$/.test(url.protocol)) {
      a.href = url.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      return a;
    }

    var samePage = sameSite && normPath(url.pathname) === herePath;
    if (samePage && url.hash) {
      // Pure hash link: the browser scrolls smoothly (CSS) without reloading.
      a.href = url.hash;
      a.setAttribute('data-spy', url.hash.slice(1));
      spyLinks.push(a);
    } else {
      a.href = url.href;
      if (samePage) a.setAttribute('aria-current', 'page');
    }
    return a;
  }

  /* ---------- Logo (shared by header and footer) ---------- */
  function makeLogo(extraClass) {
    var a = makeLink({ label: '', href: cfg.homeHref || '' }, 'logo' + (extraClass ? ' ' + extraClass : ''));
    a.setAttribute('aria-label', cfg.siteName + ' home');
    a.removeAttribute('data-spy');
    a.innerHTML = '<span class="logo__dream">Dream</span><span class="logo__color">Color</span>';
    return a;
  }

  /* ---------- Header ---------- */
  function buildHeader() {
    var header = document.createElement('header');
    header.className = 'site-header';
    header.id = 'site-header';

    var inner = document.createElement('div');
    inner.className = 'site-header__inner container';

    inner.appendChild(makeLogo());

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'site-nav');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' +
      '<path class="nav-toggle__open" d="M4 7h16M4 12h16M4 17h16"/>' +
      '<path class="nav-toggle__close" d="M6 6l12 12M18 6L6 18"/></svg>';
    inner.appendChild(toggle);

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.id = 'site-nav';
    nav.setAttribute('aria-label', 'Main');
    var ul = document.createElement('ul');
    ul.className = 'site-nav__list';
    (cfg.nav || []).forEach(function (item) {
      var li = document.createElement('li');
      li.appendChild(makeLink(item, 'site-nav__link'));
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    inner.appendChild(nav);

    header.appendChild(inner);

    var bar = document.createElement('div');
    bar.className = 'site-header__bar';
    bar.setAttribute('aria-hidden', 'true');
    header.appendChild(bar);

    wireMenu(header, toggle, nav);
    return header;
  }

  function wireMenu(header, toggle, nav) {
    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    var mq = window.matchMedia('(min-width: 860px)');
    var onChange = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    var f = cfg.footer || {};
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.id = 'site-footer';

    var grid = document.createElement('div');
    grid.className = 'site-footer__grid container';

    var brand = document.createElement('div');
    brand.className = 'site-footer__brand';
    brand.appendChild(makeLogo('logo--footer'));
    var p = document.createElement('p');
    p.textContent = cfg.tagline || '';
    brand.appendChild(p);
    grid.appendChild(brand);

    (f.groups || []).forEach(function (g) {
      var nav = document.createElement('nav');
      nav.className = 'site-footer__group';
      nav.setAttribute('aria-label', g.title);
      var h = document.createElement('p');
      h.className = 'site-footer__title';
      h.textContent = g.title;
      nav.appendChild(h);
      var ul = document.createElement('ul');
      g.links.forEach(function (item) {
        var li = document.createElement('li');
        li.appendChild(makeLink(item));
        ul.appendChild(li);
      });
      nav.appendChild(ul);
      grid.appendChild(nav);
    });
    footer.appendChild(grid);

    var bottom = document.createElement('div');
    bottom.className = 'site-footer__bottom container';
    bottom.innerHTML = '<p>' + esc((f.note || '').replace('{year}', new Date().getFullYear())) + '</p>';
    footer.appendChild(bottom);

    return footer;
  }

  /* ---------- Active-section highlighting for same-page links ---------- */
  function startSpy(header) {
    if (!spyLinks.length) return;
    var items = spyLinks.map(function (a) {
      return { link: a, el: document.getElementById(a.getAttribute('data-spy')) };
    }).filter(function (i) { return i.el; });
    if (!items.length) return;

    var ticking = false;
    function update() {
      ticking = false;
      var line = header.offsetHeight + 120;
      var active = null;
      items.forEach(function (i) {
        if (i.el.getBoundingClientRect().top <= line) active = i.el.id;
      });
      // Reached the bottom of the page: highlight the last section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = items[items.length - 1].el.id;
      }
      items.forEach(function (i) {
        if (i.link.getAttribute('data-spy') === active) i.link.setAttribute('aria-current', 'true');
        else i.link.removeAttribute('aria-current');
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Mount ---------- */
  function mount() {
    ensureHead();

    // Skip link (first focusable element on every page).
    if (!document.querySelector('.skip-link')) {
      var skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main';
      skip.textContent = 'Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    var header = buildHeader();
    var hSlot = document.querySelector('[data-site-header]');
    if (hSlot) hSlot.replaceWith(header);
    else document.body.insertBefore(header, document.body.children[1] || null);

    var footer = buildFooter();
    var fSlot = document.querySelector('[data-site-footer]');
    if (fSlot) fSlot.replaceWith(footer);
    else document.body.appendChild(footer);

    startSpy(header);

    window.DreamColorLayout = { root: rootUrl.href, url: function (p) { return resolve(p).href; } };
    document.documentElement.setAttribute('data-layout', 'ready');
    document.dispatchEvent(new CustomEvent('dreamcolor:layout-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
