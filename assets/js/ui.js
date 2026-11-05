/**
 * Dream Color – shared UI helpers for the tools page
 * toast(), copy(), downloadCanvas(), scrollToId(), icon()
 * Everything happens in the browser; nothing is sent anywhere.
 */
(function (root) {
  'use strict';
  root.DreamColor = root.DreamColor || {};

  var toastEl = null;
  var toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function toast(message) {
    var el = ensureToast();
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2200);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  // Copies text and shows a toast. `what` describes it, e.g. "HEX #FF6347".
  function copy(text, what) {
    function done(ok) {
      toast(ok ? 'Copied ' + (what || text) : 'Copy failed. Select the text and copy it manually.');
      return ok;
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return done(true); },
        function () { return done(legacyCopy(text)); }
      );
    }
    return Promise.resolve(done(legacyCopy(text)));
  }

  function trigger(url, filename) {
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadCanvas(canvas, filename) {
    if (canvas.toBlob) {
      canvas.toBlob(function (blob) {
        if (!blob) { toast('Could not create the PNG in this browser.'); return; }
        var url = URL.createObjectURL(blob);
        trigger(url, filename);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        toast('Downloading ' + filename);
      }, 'image/png');
    } else {
      trigger(canvas.toDataURL('image/png'), filename);
      toast('Downloading ' + filename);
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  // SVG icon from the sprite defined in index.html
  function icon(name) {
    return '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }

  // Create an element from an HTML string.
  function html(str) {
    var t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.firstChild;
  }

  root.DreamColor.ui = {
    toast: toast, copy: copy, downloadCanvas: downloadCanvas,
    scrollToId: scrollToId, icon: icon, html: html, prefersReducedMotion: prefersReducedMotion
  };
})(window);
