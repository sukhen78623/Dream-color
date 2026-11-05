/* Dream Color – Color Palette Generator (interface).
   Colour maths and harmony rules are in color-utils.js.
   Everything runs in the browser. Nothing is stored or sent anywhere. */
(function () {
  'use strict';

  var U = window.DreamColorUtils;
  var root = document.getElementById('palette');
  if (!U || !root) { return; }

  var COUNT = 5;
  var HINTS = {
    random: 'Five freely chosen colors. Lock the ones you like and keep generating.',
    complementary: 'A base hue and the hue opposite it on the color wheel (180° apart), with a soft tint.',
    analogous: 'Neighboring hues on the color wheel, for calm and cohesive combinations.',
    triadic: 'Three hues spaced evenly (120° apart): balanced and lively.',
    monochromatic: 'One hue in five steps of lightness, from deep to soft.'
  };

  var ICON_LOCK =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<rect x="4.5" y="11" width="15" height="10" rx="2.5"/>' +
    '<path class="shackle-closed" d="M8 11V8a4 4 0 0 1 8 0v3"/>' +
    '<path class="shackle-open" d="M8 11V8a4 4 0 0 1 7.5-1.9"/></svg>';
  var ICON_DROP =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M12 3.5c3.5 4.2 5.5 7 5.5 9.7a5.5 5.5 0 1 1-11 0c0-2.7 2-5.5 5.5-9.7z"/></svg>';

  var generateBtn = document.getElementById('generate');
  var modeGroup = document.querySelector('.modes');
  var hintEl = document.getElementById('mode-hint');
  var statusEl = document.getElementById('palette-status');
  var toastEl = document.getElementById('toast');
  var toastText = toastEl.querySelector('.toast-text');
  var toastChip = toastEl.querySelector('.toast-chip');

  var state = { mode: 'random', colors: [] };
  var cells = [];
  var toastTimer = null;

  /* ---------- build the five swatches once ---------- */
  function build() {
    for (var i = 0; i < COUNT; i++) {
      var li = document.createElement('li');
      li.className = 'swatch';
      li.setAttribute('data-index', i);
      li.style.setProperty('--i', i);
      li.innerHTML =
        '<div class="swatch-info">' +
          '<button type="button" class="hex" data-copy="hex"></button>' +
          '<div class="values">' +
            '<button type="button" class="val" data-copy="rgb"></button>' +
            '<button type="button" class="val" data-copy="hsl"></button>' +
          '</div>' +
        '</div>' +
        '<div class="swatch-actions">' +
          '<button type="button" class="act lock" data-act="lock" aria-pressed="false" aria-label="Lock color ' + (i + 1) + '">' +
            ICON_LOCK + '<span class="lock-text">Lock</span></button>' +
          '<label class="act edit">' + ICON_DROP + '<span>Edit</span>' +
            '<input type="color" class="picker" aria-label="Choose a custom color for color ' + (i + 1) + '"></label>' +
        '</div>';
      root.appendChild(li);
      cells.push({
        li: li,
        hex: li.querySelector('[data-copy="hex"]'),
        rgb: li.querySelector('[data-copy="rgb"]'),
        hsl: li.querySelector('[data-copy="hsl"]'),
        lock: li.querySelector('.lock'),
        lockText: li.querySelector('.lock-text'),
        picker: li.querySelector('.picker')
      });
      state.colors.push({ hex: '#CCCCCC', locked: false });
    }
  }

  /* ---------- painting ---------- */
  function paint(i) {
    var c = state.colors[i], cell = cells[i], info = U.describeColor(c.hex);
    cell.li.style.setProperty('--c', info.hex);
    cell.li.style.setProperty('--ink', U.readableInk(info.hex));
    cell.hex.textContent = info.hex;
    cell.hex.setAttribute('aria-label', 'Copy HEX code ' + info.hex);
    cell.rgb.textContent = info.rgbText;
    cell.rgb.setAttribute('aria-label', 'Copy ' + info.rgbText);
    cell.hsl.textContent = info.hslText;
    cell.hsl.setAttribute('aria-label', 'Copy ' + info.hslText);
    cell.lock.setAttribute('aria-pressed', c.locked ? 'true' : 'false');
    cell.lockText.textContent = c.locked ? 'Locked' : 'Lock';
    var lower = info.hex.toLowerCase();
    if (cell.picker.value !== lower) { cell.picker.value = lower; }
  }

  function replay(li) {
    li.classList.remove('regen');
    void li.offsetWidth; // restart the CSS animation
    li.classList.add('regen');
  }

  function paintAll(animate) {
    for (var i = 0; i < COUNT; i++) {
      paint(i);
      if (animate && !state.colors[i].locked) { replay(cells[i].li); }
    }
    statusEl.textContent = 'Palette: ' + state.colors.map(function (c) { return c.hex; }).join(', ');
  }

  /* ---------- generating ---------- */
  function generate() {
    var allLocked = state.colors.every(function (c) { return c.locked; });
    if (allLocked) { toast('All colors are locked. Unlock one to generate.'); return; }
    var next = U.generatePalette(state.mode, state.colors);
    next.forEach(function (hex, i) { state.colors[i].hex = hex; });
    paintAll(true);
  }

  /* ---------- toast + clipboard ---------- */
  function toast(message, chipColor) {
    toastText.textContent = message;
    if (chipColor) { toastChip.style.backgroundColor = chipColor; toastChip.hidden = false; }
    else { toastChip.hidden = true; }
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function copyAndTell(text, message, chipColor) {
    copyText(text).then(function (ok) {
      toast(ok ? message : 'Copy failed. Please select the text and copy it manually.', ok ? chipColor : null);
    });
  }

  function pop(el) {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  /* ---------- exports ---------- */
  function hexList() { return state.colors.map(function (c) { return U.describeColor(c.hex).hex; }); }

  function cssVariables() {
    return ':root {\n' + hexList().map(function (hex, i) {
      return '  --color-' + (i + 1) + ': ' + hex + ';';
    }).join('\n') + '\n}';
  }

  function downloadPng() {
    var W = 1600, H = 900, BAR = 90, n = COUNT, w = W / n;
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var font = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

    hexList().forEach(function (hex, i) {
      ctx.fillStyle = hex;
      ctx.fillRect(Math.round(i * w), 0, Math.ceil(w), H - BAR);
      ctx.fillStyle = U.readableInk(hex);
      ctx.font = '700 46px ' + font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(hex, i * w + w / 2, H - BAR - 60);
    });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, H - BAR, W, BAR);
    ctx.fillStyle = '#17151f';
    ctx.font = '700 34px ' + font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Dream Color', 40, H - BAR / 2);
    ctx.fillStyle = '#5b586a';
    ctx.font = '500 26px ' + font;
    ctx.textAlign = 'right';
    ctx.fillText('Color palette', W - 40, H - BAR / 2);

    canvas.toBlob(function (blob) {
      if (!blob) { toast('Could not create the image.'); return; }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'dream-color-palette.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      toast('PNG downloaded');
    }, 'image/png');
  }

  /* ---------- events ---------- */
  root.addEventListener('click', function (e) {
    var li = e.target.closest('.swatch');
    if (!li) { return; }
    var i = parseInt(li.getAttribute('data-index'), 10);

    var copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      var info = U.describeColor(state.colors[i].hex);
      var kind = copyBtn.getAttribute('data-copy');
      var value = kind === 'hex' ? info.hex : (kind === 'rgb' ? info.rgbText : info.hslText);
      copyAndTell(value, 'Copied ' + value, info.hex);
      pop(copyBtn);
      if (e.detail > 0) { copyBtn.blur(); } // mouse/touch: keep Space free for generating
      return;
    }

    var lockBtn = e.target.closest('[data-act="lock"]');
    if (lockBtn) {
      state.colors[i].locked = !state.colors[i].locked;
      paint(i);
      if (e.detail > 0) { lockBtn.blur(); }
    }
  });

  // Native colour picker: update instantly while the user moves around.
  root.addEventListener('input', function (e) {
    if (!e.target.classList || !e.target.classList.contains('picker')) { return; }
    var i = parseInt(e.target.closest('.swatch').getAttribute('data-index'), 10);
    state.colors[i].hex = U.describeColor(e.target.value).hex;
    state.colors[i].locked = true; // so new palettes build around the chosen color
    paint(i);
  });
  root.addEventListener('change', function (e) {
    if (e.target.classList && e.target.classList.contains('picker')) {
      toast('Color locked. New palettes will build around it.');
    }
  });

  modeGroup.addEventListener('change', function (e) {
    if (e.target.name !== 'harmony') { return; }
    state.mode = e.target.value;
    hintEl.textContent = HINTS[state.mode];
    generate();
  });

  generateBtn.addEventListener('click', function (e) {
    generate();
    if (e.detail > 0) { generateBtn.blur(); }
  });

  document.querySelector('.export').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-export]');
    if (!btn) { return; }
    var kind = btn.getAttribute('data-export');
    pop(btn);
    if (kind === 'hex') { copyAndTell(hexList().join(', '), 'Copied all 5 HEX codes'); }
    else if (kind === 'css') { copyAndTell(cssVariables(), 'Copied CSS variables'); }
    else if (kind === 'png') { downloadPng(); }
    if (e.detail > 0) { btn.blur(); }
  });

  // Spacebar = new palette, except while the user is typing or using a control
  // that needs the Space key itself.
  function spaceBelongsToControl(t) {
    if (!t || t.nodeType !== 1) { return false; }
    if (t.isContentEditable) { return true; }
    if (t.matches('input[type="radio"]')) { return false; }
    return !!t.closest('input, textarea, select, button, a[href], summary, [contenteditable=""], [contenteditable="true"], [role="textbox"]');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== ' ' && e.code !== 'Space') { return; }
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) { return; }
    if (spaceBelongsToControl(e.target)) { return; }
    e.preventDefault();
    generate();
  });

  /* ---------- start ---------- */
  build();
  hintEl.textContent = HINTS[state.mode];
  var first = U.generatePalette(state.mode, state.colors);
  first.forEach(function (hex, i) { state.colors[i].hex = hex; });
  paintAll(true);
})();
