/**
 * Dream Color – Developer Color Utilities (UI)
 * HEX to RGB, RGB to HEX, HSL to HEX, HEX to CSS, Color Code Finder and
 * Color Contrast Checker. All conversion happens live, in the browser.
 */
(function () {
  'use strict';
  var U = DreamColor.utils, ui = DreamColor.ui;

  var section = document.getElementById('developer');
  if (!section) return;

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Shared helpers ---------- */

  // Rows of "label  value  [Copy]". set() takes strings, {text, copy} objects or null.
  function createOutputs(container, labels) {
    var rows = labels.map(function (label) {
      var row = document.createElement('div');
      row.className = 'out-row';
      var name = document.createElement('span');
      name.className = 'out-label';
      name.textContent = label;
      var out = document.createElement('output');
      out.className = 'out-value';
      out.textContent = '—';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--sm';
      btn.textContent = 'Copy';
      btn.disabled = true;
      btn.setAttribute('aria-label', 'Copy ' + label);
      btn.addEventListener('click', function () {
        if (out.dataset.copy) ui.copy(out.dataset.copy, label + ' ' + out.dataset.copy);
      });
      row.appendChild(name); row.appendChild(out); row.appendChild(btn);
      container.appendChild(row);
      return { out: out, btn: btn };
    });
    return {
      set: function (values) {
        rows.forEach(function (r, i) {
          var v = values ? values[i] : null;
          var text = v ? (typeof v === 'string' ? v : v.text) : '';
          var copy = v ? (typeof v === 'string' ? v : v.copy) : '';
          r.out.textContent = text || '—';
          r.out.dataset.copy = copy || '';
          r.btn.disabled = !copy;
        });
      }
    };
  }

  // Multi-line code block with its own Copy button.
  function createCodeOutput(container, label) {
    var wrap = document.createElement('div');
    wrap.className = 'code-card code-card--inline';
    wrap.innerHTML =
      '<div class="code-card__head"><span class="out-label">' + label + '</span>' +
      '<button type="button" class="btn btn--sm" disabled>Copy CSS</button></div>' +
      '<pre class="code-block"><code>—</code></pre>';
    container.appendChild(wrap);
    var code = wrap.querySelector('code'), btn = wrap.querySelector('button');
    btn.addEventListener('click', function () { if (code.dataset.copy) ui.copy(code.dataset.copy, 'CSS'); });
    return {
      set: function (text) {
        code.textContent = text || '—';
        code.dataset.copy = text || '';
        btn.disabled = !text;
      }
    };
  }

  function setError(errEl, inputs, message) {
    if (message) {
      errEl.textContent = message;
      errEl.hidden = false;
    } else {
      errEl.textContent = '';
      errEl.hidden = true;
    }
    inputs.forEach(function (i) {
      if (message) i.setAttribute('aria-invalid', 'true'); else i.removeAttribute('aria-invalid');
    });
  }

  function paintDot(dot, c) {
    dot.style.backgroundColor = c ? U.toHex(c) : 'transparent';
  }

  /* ---------- 1. HEX to RGB ---------- */
  (function () {
    var input = $('hexRgbIn'), err = $('hexRgbErr'), dot = $('hexRgbDot');
    var out = createOutputs($('hexRgbOut'), ['RGB', 'HSL', 'HEX']);

    function update() {
      var v = input.value.trim();
      if (!v) { setError(err, [input], ''); out.set(null); paintDot(dot, null); return; }
      var c = U.parseHex(v);
      if (!c) {
        setError(err, [input], 'Not a valid HEX code. Use 3, 4, 6 or 8 digits (0-9 and A-F), for example #FF6347.');
        out.set(null); paintDot(dot, null); return;
      }
      setError(err, [input], '');
      paintDot(dot, c);
      out.set([U.formatRgb(c), U.formatHsl(c), U.toHex(c)]);
    }
    input.addEventListener('input', update);
    update();
  })();

  /* ---------- 2. RGB to HEX ---------- */
  (function () {
    var fields = [
      { el: $('rgbHexR'), name: 'Red' },
      { el: $('rgbHexG'), name: 'Green' },
      { el: $('rgbHexB'), name: 'Blue' }
    ];
    var err = $('rgbHexErr'), dot = $('rgbHexDot');
    var out = createOutputs($('rgbHexOut'), ['HEX', 'RGB', 'HSL']);

    function update() {
      var vals = [], message = '', bad = [], missing = false;
      fields.forEach(function (f) {
        var v = f.el.value.trim();
        if (v === '') { missing = true; vals.push(null); return; }
        if (!/^\d{1,3}$/.test(v) || parseInt(v, 10) > 255) {
          bad.push(f.el);
          if (!message) message = f.name + ' must be a whole number from 0 to 255.';
          vals.push(null); return;
        }
        vals.push(parseInt(v, 10));
      });
      fields.forEach(function (f) { f.el.removeAttribute('aria-invalid'); });
      if (message) {
        setError(err, bad, message);
        out.set(null); paintDot(dot, null); return;
      }
      setError(err, [], '');
      if (missing) { out.set(null); paintDot(dot, null); return; }
      var c = { r: vals[0], g: vals[1], b: vals[2], a: 1 };
      paintDot(dot, c);
      out.set([U.toHex(c), U.formatRgb(c), U.formatHsl(c)]);
    }
    fields.forEach(function (f) { f.el.addEventListener('input', update); });
    update();
  })();

  /* ---------- 3. HSL to HEX ---------- */
  (function () {
    var fields = [
      { el: $('hslHexH'), name: 'Hue', min: 0, max: 360, unit: ' (degrees)' },
      { el: $('hslHexS'), name: 'Saturation', min: 0, max: 100, unit: ' (percent)' },
      { el: $('hslHexL'), name: 'Lightness', min: 0, max: 100, unit: ' (percent)' }
    ];
    var err = $('hslHexErr'), dot = $('hslHexDot');
    var out = createOutputs($('hslHexOut'), ['HEX', 'RGB', 'HSL']);

    function update() {
      var vals = [], message = '', bad = [], missing = false;
      fields.forEach(function (f) {
        var v = f.el.value.trim();
        if (v === '') { missing = true; vals.push(null); return; }
        var n = parseFloat(v);
        if (!/^\d+(\.\d+)?$/.test(v) || n < f.min || n > f.max) {
          bad.push(f.el);
          if (!message) message = f.name + ' must be a number from ' + f.min + ' to ' + f.max + f.unit + '.';
          vals.push(null); return;
        }
        vals.push(n);
      });
      fields.forEach(function (f) { f.el.removeAttribute('aria-invalid'); });
      if (message) {
        setError(err, bad, message);
        out.set(null); paintDot(dot, null); return;
      }
      setError(err, [], '');
      if (missing) { out.set(null); paintDot(dot, null); return; }
      var c = U.hslToRgb(vals[0], vals[1], vals[2]);
      c.a = 1;
      paintDot(dot, c);
      out.set([U.toHex(c), U.formatRgb(c), U.formatHsl(c)]);
    }
    fields.forEach(function (f) { f.el.addEventListener('input', update); });
    update();
  })();

  /* ---------- 4. HEX to CSS ---------- */
  (function () {
    var input = $('hexCssIn'), err = $('hexCssErr'), dot = $('hexCssDot');
    var out = createCodeOutput($('hexCssOut'), 'CSS');

    function update() {
      var v = input.value.trim();
      if (!v) { setError(err, [input], ''); out.set(null); paintDot(dot, null); return; }
      var c = U.parseHex(v);
      if (!c) {
        setError(err, [input], 'Not a valid HEX code. Use 3, 4, 6 or 8 digits (0-9 and A-F), for example #FF6347.');
        out.set(null); paintDot(dot, null); return;
      }
      setError(err, [input], '');
      paintDot(dot, c);
      var hex = U.toHex(c);
      out.set(
        ':root {\n' +
        '  --brand-color: ' + hex + ';\n' +
        '}\n\n' +
        '.element {\n' +
        '  color: ' + hex + ';\n' +
        '  background-color: ' + U.formatRgb(c) + ';\n' +
        '  border-color: ' + U.formatHsl(c) + ';\n' +
        '}'
      );
    }
    input.addEventListener('input', update);
    update();
  })();

  /* ---------- 5. Color Code Finder ---------- */
  (function () {
    var input = $('finderIn'), picker = $('finderPicker'), err = $('finderErr'), dot = $('finderDot');
    var eye = $('finderEye');
    var out = createOutputs($('finderOut'), ['HEX', 'RGB', 'HSL', 'Closest CSS name']);

    function show(c) {
      setError(err, [input], '');
      paintDot(dot, c);
      var n = U.nearestName(c);
      out.set([
        U.toHex(c), U.formatRgb(c), U.formatHsl(c),
        { text: n.exact ? n.name + ' (exact match)' : n.name + ' (closest, ' + n.hex + ')', copy: n.name }
      ]);
    }

    function update() {
      var v = input.value.trim();
      if (!v) { setError(err, [input], ''); out.set(null); paintDot(dot, null); return; }
      var c = U.parseColor(v);
      if (!c) {
        setError(err, [input], 'Not a recognised color. Try a HEX code (#FF6347), rgb(255, 99, 71), hsl(9, 100%, 64%) or a name such as tomato.');
        out.set(null); paintDot(dot, null); return;
      }
      picker.value = U.toHex({ r: c.r, g: c.g, b: c.b, a: 1 }).toLowerCase();
      show(c);
    }

    input.addEventListener('input', update);
    picker.addEventListener('input', function () {
      input.value = picker.value.toUpperCase();
      update();
    });

    // Pick any color on screen (only in browsers that support the EyeDropper API).
    if (window.EyeDropper) {
      eye.hidden = false;
      eye.addEventListener('click', function () {
        new window.EyeDropper().open().then(function (res) {
          input.value = res.sRGBHex.toUpperCase();
          update();
        }).catch(function () { /* cancelled */ });
      });
    }
    update();
  })();

  /* ---------- 6. Color Contrast Checker ---------- */
  (function () {
    var fgIn = $('cFg'), bgIn = $('cBg'), fgPick = $('cFgPick'), bgPick = $('cBgPick');
    var err = $('cErr'), note = $('cNote'), ratioEl = $('cRatio'), list = $('cResults'), prev = $('cPreview');
    var CRITERIA = [
      { key: 'aaNormal',  name: 'AA, normal text',          need: '4.5:1' },
      { key: 'aaLarge',   name: 'AA, large text',           need: '3:1' },
      { key: 'aaaNormal', name: 'AAA, normal text',         need: '7:1' },
      { key: 'aaaLarge',  name: 'AAA, large text',          need: '4.5:1' },
      { key: 'ui',        name: 'UI components & graphics', need: '3:1' }
    ];
    var items = CRITERIA.map(function (c) {
      var li = document.createElement('li');
      li.className = 'wcag-item';
      li.innerHTML = '<span class="wcag-name">' + c.name + '<small>needs ' + c.need + '</small></span>' +
        '<span class="badge"></span>';
      list.appendChild(li);
      return li;
    });

    function clearResults() {
      ratioEl.textContent = '—';
      items.forEach(function (li) {
        li.className = 'wcag-item';
        li.querySelector('.badge').textContent = '—';
      });
      prev.style.color = ''; prev.style.backgroundColor = '';
    }

    function update() {
      note.hidden = true;
      var fv = fgIn.value.trim(), bv = bgIn.value.trim();
      if (!fv || !bv) { setError(err, [fgIn, bgIn], ''); clearResults(); return; }
      var fg = U.parseColor(fv), bg = U.parseColor(bv);
      var message = '', bad = [];
      if (!fg) { bad.push(fgIn); message = 'The text color is not valid. Use HEX, rgb(), hsl() or a CSS color name.'; }
      if (!bg) { bad.push(bgIn); message = message ? 'Neither color is valid. Use HEX, rgb(), hsl() or a CSS color name.' : 'The background color is not valid. Use HEX, rgb(), hsl() or a CSS color name.'; }
      if (message) { setError(err, bad, message); clearResults(); return; }
      setError(err, [fgIn, bgIn], '');

      if (fg.a < 1 || bg.a < 1) {
        bg = U.compositeOver(bg, { r: 255, g: 255, b: 255 });
        fg = U.compositeOver(fg, bg);
        note.hidden = false;
      }
      var ratio = U.contrastRatio(fg, bg);
      var res = U.wcag(ratio);
      ratioEl.textContent = U.displayRatio(ratio) + ':1';
      CRITERIA.forEach(function (c, i) {
        var pass = res[c.key];
        items[i].className = 'wcag-item ' + (pass ? 'is-pass' : 'is-fail');
        items[i].querySelector('.badge').textContent = pass ? '✓ Pass' : '✗ Fail';
      });
      prev.style.color = U.toHex(fg);
      prev.style.backgroundColor = U.toHex(bg);
    }

    function link(textEl, pickEl) {
      textEl.addEventListener('input', function () {
        var c = U.parseColor(textEl.value);
        if (c) pickEl.value = U.toHex({ r: c.r, g: c.g, b: c.b, a: 1 }).toLowerCase();
        update();
      });
      pickEl.addEventListener('input', function () {
        textEl.value = pickEl.value.toUpperCase();
        update();
      });
    }
    link(fgIn, fgPick);
    link(bgIn, bgPick);

    $('cSwap').addEventListener('click', function () {
      var t = fgIn.value; fgIn.value = bgIn.value; bgIn.value = t;
      var p = fgPick.value; fgPick.value = bgPick.value; bgPick.value = p;
      update();
    });

    update();
  })();
})();
