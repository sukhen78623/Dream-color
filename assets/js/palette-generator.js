/**
 * Dream Color – Color Palette Generator (UI)
 * Five colors, per-color lock, harmony modes, manual picker, copy, CSS export,
 * PNG download and the Space shortcut.
 */
(function () {
  'use strict';
  var U = DreamColor.utils, E = DreamColor.engine, ui = DreamColor.ui;

  var section = document.getElementById('palette');
  var grid = document.getElementById('paletteGrid');
  if (!section || !grid) return;

  var HINTS = {
    random: 'Five unrelated colors: open-ended inspiration.',
    complementary: 'A base hue paired with the hue opposite it on the color wheel, softened with a light neutral.',
    analogous: 'Neighboring hues that sit side by side on the wheel for calm, cohesive results.',
    triadic: 'Three hues spaced evenly around the wheel, plus a light tint and a deep shade.',
    monochromatic: 'A single hue in five steps from dark to light.'
  };

  var state = { mode: 'random', colors: [] };
  var cards = [];
  var hintEl = document.getElementById('harmonyHint');
  var cssEl = document.getElementById('cssVars');

  /* ---------- Build the five swatches once ---------- */
  function swatchMarkup(i) {
    var n = i + 1;
    return '' +
      '<article class="swatch" role="listitem" data-index="' + i + '">' +
        '<div class="swatch__color">' +
          '<div class="swatch__actions">' +
            '<button type="button" class="icon-btn" data-act="lock" aria-pressed="false" aria-label="Lock color ' + n + '" title="Lock color">' + ui.icon('unlock') + '</button>' +
            '<button type="button" class="icon-btn" data-act="copy" aria-label="Copy color ' + n + ' HEX" title="Copy HEX">' + ui.icon('copy') + '</button>' +
            '<label class="icon-btn" title="Pick this color manually">' + ui.icon('edit') +
              '<input type="color" class="swatch__picker" aria-label="Pick color ' + n + ' manually">' +
            '</label>' +
          '</div>' +
          '<button type="button" class="swatch__hex" data-copy="hex"></button>' +
        '</div>' +
        '<dl class="swatch__info">' +
          '<div><dt>RGB</dt><dd><button type="button" class="code-btn" data-copy="rgb"></button></dd></div>' +
          '<div><dt>HSL</dt><dd><button type="button" class="code-btn" data-copy="hsl"></button></dd></div>' +
        '</dl>' +
      '</article>';
  }

  function build() {
    grid.innerHTML = '';
    for (var i = 0; i < 5; i++) {
      var el = ui.html(swatchMarkup(i));
      grid.appendChild(el);
      cards.push(el);
      state.colors.push({ hex: '#000000', locked: false });
      wire(el, i);
    }
  }

  function wire(el, i) {
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn || !el.contains(btn)) return;
      var c = state.colors[i];
      if (btn.dataset.act === 'lock') {
        setLocked(i, !c.locked);
      } else if (btn.dataset.act === 'copy' || btn.dataset.copy === 'hex') {
        ui.copy(c.hex, 'HEX ' + c.hex);
      } else if (btn.dataset.copy === 'rgb' || btn.dataset.copy === 'hsl') {
        var rgb = U.parseHex(c.hex);
        var text = btn.dataset.copy === 'rgb' ? U.formatRgb(rgb) : U.formatHsl(rgb);
        ui.copy(text, text);
      }
    });

    var picker = el.querySelector('.swatch__picker');
    picker.addEventListener('input', function () {
      var c = state.colors[i];
      c.hex = picker.value.toUpperCase();
      if (!c.locked) {
        setLocked(i, true);
        ui.toast('Color ' + (i + 1) + ' is locked so it stays when you generate.');
      }
      paint(i, false);
      updateExports();
    });
  }

  function setLocked(i, locked) {
    state.colors[i].locked = locked;
    var el = cards[i];
    var btn = el.querySelector('[data-act="lock"]');
    btn.setAttribute('aria-pressed', locked ? 'true' : 'false');
    btn.setAttribute('aria-label', (locked ? 'Unlock color ' : 'Lock color ') + (i + 1));
    btn.title = locked ? 'Unlock color' : 'Lock color';
    btn.innerHTML = ui.icon(locked ? 'lock' : 'unlock');
    el.classList.toggle('is-locked', locked);
  }

  /* ---------- Painting ---------- */
  function paint(i, animate) {
    var c = state.colors[i], el = cards[i];
    var rgb = U.parseHex(c.hex);
    var colorEl = el.querySelector('.swatch__color');
    colorEl.style.backgroundColor = c.hex;
    colorEl.style.setProperty('--on', U.readableOn(rgb));
    var hexBtn = el.querySelector('[data-copy="hex"]');
    hexBtn.textContent = c.hex;
    hexBtn.setAttribute('aria-label', 'Copy HEX ' + c.hex);
    el.querySelector('[data-copy="rgb"]').textContent = U.formatRgb(rgb);
    el.querySelector('[data-copy="hsl"]').textContent = U.formatHsl(rgb);
    el.querySelector('.swatch__picker').value = c.hex.toLowerCase();
    if (animate) {
      colorEl.classList.remove('is-new');
      void colorEl.offsetWidth; // restart the CSS animation
      colorEl.classList.add('is-new');
    }
  }

  function hexes() { return state.colors.map(function (c) { return c.hex; }); }

  function updateExports() {
    var lines = hexes().map(function (h, i) { return '  --palette-color-' + (i + 1) + ': ' + h + ';'; });
    cssEl.textContent = ':root {\n' + lines.join('\n') + '\n}';
  }

  /* ---------- Generate ---------- */
  function generate() {
    var locked = state.colors.filter(function (c) { return c.locked; });
    if (locked.length === state.colors.length) {
      ui.toast('All colors are locked. Unlock one to generate new colors.');
      return;
    }
    var base = null;
    if (locked.length) base = U.hexToHsl(locked[0].hex).h; // locked colors steer the harmony
    var fresh = E.harmony(state.mode, { baseHue: base });
    state.colors.forEach(function (c, i) {
      if (c.locked) return;
      c.hex = U.hslToHex(fresh[i].h, fresh[i].s, fresh[i].l);
      paint(i, true);
    });
    updateExports();
  }

  // Used by the presets section: load a ready-made palette into the editor.
  function setColors(list) {
    list.slice(0, 5).forEach(function (hex, i) {
      state.colors[i].hex = hex.toUpperCase();
      setLocked(i, false);
      paint(i, true);
    });
    updateExports();
  }

  /* ---------- PNG export ---------- */
  function downloadPng() {
    var w = 1500, h = 500, cw = w / 5;
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    state.colors.forEach(function (c, i) {
      ctx.fillStyle = c.hex;
      ctx.fillRect(i * cw, 0, cw, h);
      ctx.fillStyle = U.readableOn(c.hex);
      ctx.font = '700 36px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
      ctx.fillText(c.hex, i * cw + cw / 2, h - 56);
    });
    ui.downloadCanvas(canvas, 'dream-color-palette.png');
  }

  /* ---------- Controls ---------- */
  document.getElementById('btnGenerate').addEventListener('click', generate);

  document.getElementById('btnCopyPalette').addEventListener('click', function () {
    ui.copy(hexes().join(', '), 'palette ' + hexes().join(', '));
  });

  document.getElementById('btnDownloadPalette').addEventListener('click', downloadPng);

  document.getElementById('btnCopyCss').addEventListener('click', function () {
    ui.copy(cssEl.textContent, 'CSS variables');
  });

  Array.prototype.forEach.call(document.querySelectorAll('input[name="harmony"]'), function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      state.mode = radio.value;
      hintEl.textContent = HINTS[state.mode];
      generate();
    });
  });

  /* ---------- Space bar shortcut ---------- */
  function sectionInView() {
    var r = section.getBoundingClientRect();
    return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.3;
  }

  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    var isRadioInSection = t && t.matches && t.matches('input[type="radio"]') && section.contains(t);
    if (!isRadioInSection && t && t.closest &&
        t.closest('input, textarea, select, button, a, summary, [contenteditable="true"], [role="tab"]')) return;
    if (!sectionInView()) return;
    e.preventDefault();
    generate();
  });

  /* ---------- Init ---------- */
  build();
  hintEl.textContent = HINTS[state.mode];
  generate();

  DreamColor.paletteApi = { getColors: hexes, setColors: setColors };
})();
