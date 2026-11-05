/* Dream Color – colour maths and palette harmony rules.
   Pure functions, no DOM access: safe to reuse in every future tool
   (converter, contrast checker, gradient generator…). Runs in the browser only;
   nothing is sent anywhere. */
(function (root) {
  'use strict';

  var MODES = ['random', 'complementary', 'analogous', 'triadic', 'monochromatic'];
  var INK = [23, 21, 31]; // #17151f, the dark text colour of the site

  /* ---------- small helpers ---------- */
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function wrapHue(h) { return ((h % 360) + 360) % 360; }

  /* ---------- conversions ---------- */
  // h: 0–360, s: 0–100, l: 0–100  ->  [r, g, b] each 0–255
  function hslToRgb(h, s, l) {
    h = wrapHue(h); s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  // r, g, b: 0–255  ->  [h 0–360, s 0–100, l 0–100]
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    var h = 0, s = 0, l = (max + min) / 2;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) { h = ((g - b) / d) % 6; }
      else if (max === g) { h = (b - r) / d + 2; }
      else { h = (r - g) / d + 4; }
      h = wrapHue(h * 60);
    }
    return [h, s * 100, l * 100];
  }

  function rgbToHex(rgb) {
    return '#' + rgb.map(function (v) {
      return ('0' + clamp(Math.round(v), 0, 255).toString(16)).slice(-2);
    }).join('').toUpperCase();
  }

  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) { return null; }
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function hslToHex(h, s, l) { return rgbToHex(hslToRgb(h, s, l)); }
  function hexToHsl(hex) {
    var rgb = hexToRgb(hex);
    return rgb ? rgbToHsl(rgb[0], rgb[1], rgb[2]) : null;
  }

  function formatRgb(rgb) { return 'rgb(' + rgb.join(', ') + ')'; }
  function formatHsl(hsl) {
    return 'hsl(' + (Math.round(hsl[0]) % 360) + ', ' + Math.round(hsl[1]) + '%, ' + Math.round(hsl[2]) + '%)';
  }

  // Everything the interface needs to show for one colour.
  function describeColor(hex) {
    var rgb = hexToRgb(hex);
    var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return { hex: rgbToHex(rgb), rgb: rgb, hsl: hsl, rgbText: formatRgb(rgb), hslText: formatHsl(hsl) };
  }

  /* ---------- contrast (WCAG formulas) ---------- */
  function luminance(rgb) {
    var a = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrastRatio(a, b) {
    var l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  // White or dark text, whichever is easier to read on this colour.
  function readableInk(hex) {
    var rgb = hexToRgb(hex);
    return contrastRatio(rgb, [255, 255, 255]) >= contrastRatio(rgb, INK) ? '#ffffff' : '#17151f';
  }

  /* ---------- colour harmony ----------
     Each recipe lists five slots. `dh` is the hue offset (degrees on the colour
     wheel) from a base hue; s and l are saturation and lightness in percent.
     Values are randomised inside safe ranges so every palette is different but
     always follows the harmony rule. */
  function buildRecipe(mode) {
    var s = rand(52, 80);
    var step;
    switch (mode) {
      case 'complementary': // base hue + the hue opposite it (180°)
        return [
          { dh: 0,   s: s,            l: rand(24, 32) },
          { dh: 0,   s: s,            l: rand(46, 56) },
          { dh: 0,   s: rand(18, 30), l: rand(91, 95) },
          { dh: 180, s: s,            l: rand(60, 70) },
          { dh: 180, s: s,            l: rand(36, 44) }
        ];
      case 'analogous': // neighbouring hues, 18–28° apart
        step = rand(18, 28);
        return [
          { dh: -2 * step, s: s,        l: rand(26, 34) },
          { dh: -step,     s: s,        l: rand(40, 50) },
          { dh: 0,         s: s,        l: rand(52, 60) },
          { dh: step,      s: s * 0.95, l: rand(64, 72) },
          { dh: 2 * step,  s: s * 0.9,  l: rand(78, 88) }
        ];
      case 'triadic': // three hues spaced 120° apart
        return [
          { dh: 0,   s: s,            l: rand(46, 54) },
          { dh: 120, s: s * 0.9,      l: rand(56, 66) },
          { dh: 240, s: s,            l: rand(40, 50) },
          { dh: 0,   s: rand(22, 36), l: rand(90, 94) },
          { dh: 240, s: s * 0.8,      l: rand(20, 28) }
        ];
      case 'monochromatic': // one hue, five lightness steps
        return [
          { dh: 0, s: s,            l: rand(16, 24) },
          { dh: 0, s: s,            l: rand(32, 40) },
          { dh: 0, s: s * 0.95,     l: rand(50, 58) },
          { dh: 0, s: s * 0.85,     l: rand(70, 78) },
          { dh: 0, s: rand(30, 55), l: rand(90, 95) }
        ];
    }
    return null;
  }

  /* Returns an array of five HEX strings.
     `current` is an array of { hex, locked }. Locked colours are returned
     untouched. For the harmony modes, the first locked colour with a real hue
     becomes the anchor, so new colours are built around it. */
  function generatePalette(mode, current) {
    var recipe = buildRecipe(mode);
    var out = current.map(function (c) { return c.hex; });
    var base = rand(0, 360);
    var i;

    if (recipe) {
      for (i = 0; i < current.length; i++) {
        if (!current[i].locked) { continue; }
        var hsl = hexToHsl(current[i].hex);
        if (hsl && hsl[1] >= 8) { base = wrapHue(hsl[0] - recipe[i].dh); break; }
      }
    }

    for (i = 0; i < current.length; i++) {
      if (current[i].locked) { continue; }
      out[i] = recipe
        ? hslToHex(base + recipe[i].dh, recipe[i].s, recipe[i].l)
        : hslToHex(rand(0, 360), rand(38, 76), rand(32, 80));
    }
    return out;
  }

  var api = {
    MODES: MODES,
    clamp: clamp, wrapHue: wrapHue,
    hslToRgb: hslToRgb, rgbToHsl: rgbToHsl, rgbToHex: rgbToHex, hexToRgb: hexToRgb,
    hslToHex: hslToHex, hexToHsl: hexToHsl,
    formatRgb: formatRgb, formatHsl: formatHsl, describeColor: describeColor,
    luminance: luminance, contrastRatio: contrastRatio, readableInk: readableInk,
    generatePalette: generatePalette
  };

  if (typeof module === 'object' && module.exports) { module.exports = api; }
  if (root) { root.DreamColorUtils = api; }
})(typeof window !== 'undefined' ? window : null);
