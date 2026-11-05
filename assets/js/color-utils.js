/**
 * Dream Color – color utilities (pure functions, no DOM access)
 * Parsing, conversion, formatting, contrast and nearest-name lookup.
 * Loads as a plain browser script (window.DreamColor.utils) or in Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.DreamColor = root.DreamColor || {}; root.DreamColor.utils = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* CSS Color Module named colors (148) */
  var NAMES_SRC = 'aliceblue:f0f8ff,antiquewhite:faebd7,aqua:00ffff,aquamarine:7fffd4,azure:f0ffff,beige:f5f5dc,bisque:ffe4c4,black:000000,blanchedalmond:ffebcd,blue:0000ff,blueviolet:8a2be2,brown:a52a2a,burlywood:deb887,cadetblue:5f9ea0,chartreuse:7fff00,chocolate:d2691e,coral:ff7f50,cornflowerblue:6495ed,cornsilk:fff8dc,crimson:dc143c,cyan:00ffff,darkblue:00008b,darkcyan:008b8b,darkgoldenrod:b8860b,darkgray:a9a9a9,darkgreen:006400,darkgrey:a9a9a9,darkkhaki:bdb76b,darkmagenta:8b008b,darkolivegreen:556b2f,darkorange:ff8c00,darkorchid:9932cc,darkred:8b0000,darksalmon:e9967a,darkseagreen:8fbc8f,darkslateblue:483d8b,darkslategray:2f4f4f,darkslategrey:2f4f4f,darkturquoise:00ced1,darkviolet:9400d3,deeppink:ff1493,deepskyblue:00bfff,dimgray:696969,dimgrey:696969,dodgerblue:1e90ff,firebrick:b22222,floralwhite:fffaf0,forestgreen:228b22,fuchsia:ff00ff,gainsboro:dcdcdc,ghostwhite:f8f8ff,gold:ffd700,goldenrod:daa520,gray:808080,green:008000,greenyellow:adff2f,grey:808080,honeydew:f0fff0,hotpink:ff69b4,indianred:cd5c5c,indigo:4b0082,ivory:fffff0,khaki:f0e68c,lavender:e6e6fa,lavenderblush:fff0f5,lawngreen:7cfc00,lemonchiffon:fffacd,lightblue:add8e6,lightcoral:f08080,lightcyan:e0ffff,lightgoldenrodyellow:fafad2,lightgray:d3d3d3,lightgreen:90ee90,lightgrey:d3d3d3,lightpink:ffb6c1,lightsalmon:ffa07a,lightseagreen:20b2aa,lightskyblue:87cefa,lightslategray:778899,lightslategrey:778899,lightsteelblue:b0c4de,lightyellow:ffffe0,lime:00ff00,limegreen:32cd32,linen:faf0e6,magenta:ff00ff,maroon:800000,mediumaquamarine:66cdaa,mediumblue:0000cd,mediumorchid:ba55d3,mediumpurple:9370db,mediumseagreen:3cb371,mediumslateblue:7b68ee,mediumspringgreen:00fa9a,mediumturquoise:48d1cc,mediumvioletred:c71585,midnightblue:191970,mintcream:f5fffa,mistyrose:ffe4e1,moccasin:ffe4b5,navajowhite:ffdead,navy:000080,oldlace:fdf5e6,olive:808000,olivedrab:6b8e23,orange:ffa500,orangered:ff4500,orchid:da70d6,palegoldenrod:eee8aa,palegreen:98fb98,paleturquoise:afeeee,palevioletred:db7093,papayawhip:ffefd5,peachpuff:ffdab9,peru:cd853f,pink:ffc0cb,plum:dda0dd,powderblue:b0e0e6,purple:800080,rebeccapurple:663399,red:ff0000,rosybrown:bc8f8f,royalblue:4169e1,saddlebrown:8b4513,salmon:fa8072,sandybrown:f4a460,seagreen:2e8b57,seashell:fff5ee,sienna:a0522d,silver:c0c0c0,skyblue:87ceeb,slateblue:6a5acd,slategray:708090,slategrey:708090,snow:fffafa,springgreen:00ff7f,steelblue:4682b4,tan:d2b48c,teal:008080,thistle:d8bfd8,tomato:ff6347,turquoise:40e0d0,violet:ee82ee,wheat:f5deb3,white:ffffff,whitesmoke:f5f5f5,yellow:ffff00,yellowgreen:9acd32';

  var NAMES = {};
  var NAME_LIST = [];

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function wrapHue(h) { return ((h % 360) + 360) % 360; }

  /* ---------- Parsing ---------- */

  // Strict HEX parser: 3, 4, 6 or 8 digits, "#" optional.
  function parseHex(str) {
    var s = String(str).trim();
    if (s.charAt(0) === '#') s = s.slice(1);
    if (!/^[0-9a-fA-F]+$/.test(s)) return null;
    if (s.length === 3 || s.length === 4) {
      s = s.split('').map(function (c) { return c + c; }).join('');
    }
    if (s.length !== 6 && s.length !== 8) return null;
    return {
      r: parseInt(s.substr(0, 2), 16),
      g: parseInt(s.substr(2, 2), 16),
      b: parseInt(s.substr(4, 2), 16),
      a: s.length === 8 ? parseInt(s.substr(6, 2), 16) / 255 : 1
    };
  }

  var NUM = /^[+-]?(\d+\.?\d*|\.\d+)%?$/;

  function tokens(inner) {
    return inner.trim().split(/[\s,\/]+/).filter(Boolean);
  }

  function parseAlpha(tok) {
    if (tok === undefined) return 1;
    if (!NUM.test(tok)) return null;
    var v = parseFloat(tok);
    if (tok.slice(-1) === '%') v /= 100;
    if (v < 0 || v > 1) return null;
    return v;
  }

  function parseRgbFunc(str) {
    var m = /^rgba?\(\s*([^)]*)\)$/i.exec(str.trim());
    if (!m) return null;
    var t = tokens(m[1]);
    if (t.length !== 3 && t.length !== 4) return null;
    var out = [];
    for (var i = 0; i < 3; i++) {
      if (!NUM.test(t[i])) return null;
      var v = parseFloat(t[i]);
      if (t[i].slice(-1) === '%') { if (v < 0 || v > 100) return null; v = v * 2.55; }
      else if (v < 0 || v > 255) return null;
      out.push(Math.round(v));
    }
    var a = parseAlpha(t[3]);
    if (a === null) return null;
    return { r: out[0], g: out[1], b: out[2], a: a };
  }

  function parseHslFunc(str) {
    var m = /^hsla?\(\s*([^)]*)\)$/i.exec(str.trim());
    if (!m) return null;
    var t = tokens(m[1]);
    if (t.length !== 3 && t.length !== 4) return null;
    if (!/^[+-]?(\d+\.?\d*|\.\d+)(deg)?$/i.test(t[0])) return null;
    var h = parseFloat(t[0]);
    if (!NUM.test(t[1]) || !NUM.test(t[2])) return null;
    var s = parseFloat(t[1]), l = parseFloat(t[2]);
    if (s < 0 || s > 100 || l < 0 || l > 100) return null;
    var a = parseAlpha(t[3]);
    if (a === null) return null;
    var rgb = hslToRgb(h, s, l);
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: a };
  }

  // Accepts HEX (with/without #), rgb()/rgba(), hsl()/hsla(), "r, g, b" and CSS color names.
  function parseColor(input) {
    if (input === null || input === undefined) return null;
    var s = String(input).trim();
    if (!s) return null;
    var lower = s.toLowerCase();
    if (/^rgba?\(/.test(lower)) return parseRgbFunc(lower);
    if (/^hsla?\(/.test(lower)) return parseHslFunc(lower);
    if (Object.prototype.hasOwnProperty.call(NAMES, lower)) return parseHex(NAMES[lower]);
    if (/^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(s)) return parseRgbFunc('rgb(' + s + ')');
    return parseHex(s);
  }

  /* ---------- Conversion ---------- */

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2, h = 0, s = 0, d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }

  function hslToRgb(h, s, l) {
    h = wrapHue(h);
    s = clamp(s, 0, 100) / 100;
    l = clamp(l, 0, 100) / 100;
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
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  function byteHex(n) {
    var s = clamp(Math.round(n), 0, 255).toString(16).toUpperCase();
    return s.length === 1 ? '0' + s : s;
  }

  // "#RRGGBB", or "#RRGGBBAA" when the color has alpha < 1.
  function toHex(c) {
    var out = '#' + byteHex(c.r) + byteHex(c.g) + byteHex(c.b);
    if (c.a !== undefined && c.a < 1) out += byteHex(c.a * 255);
    return out;
  }

  function hslToHex(h, s, l) { return toHex(hslToRgb(h, s, l)); }
  function hexToHsl(hex) {
    var c = parseHex(hex);
    return c ? rgbToHsl(c.r, c.g, c.b) : null;
  }

  /* ---------- Formatting ---------- */

  function fmtAlpha(a) { return String(Math.round(a * 100) / 100); }

  function formatRgb(c) {
    return (c.a !== undefined && c.a < 1)
      ? 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + fmtAlpha(c.a) + ')'
      : 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
  }

  function formatHsl(c) {
    var hsl = rgbToHsl(c.r, c.g, c.b);
    var h = Math.round(hsl.h) % 360, s = Math.round(hsl.s), l = Math.round(hsl.l);
    return (c.a !== undefined && c.a < 1)
      ? 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + fmtAlpha(c.a) + ')'
      : 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  /* ---------- Contrast (WCAG 2.x) ---------- */

  function luminance(c) {
    function ch(v) {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
  }

  function contrastRatio(c1, c2) {
    var a = luminance(c1), b = luminance(c2);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  // Flatten a translucent color over an opaque one.
  function compositeOver(fg, bg) {
    var a = fg.a === undefined ? 1 : fg.a;
    return {
      r: Math.round(fg.r * a + bg.r * (1 - a)),
      g: Math.round(fg.g * a + bg.g * (1 - a)),
      b: Math.round(fg.b * a + bg.b * (1 - a)),
      a: 1
    };
  }

  function wcag(ratio) {
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
      ui: ratio >= 3
    };
  }

  // Truncate (never round up) so 4.499 is not shown as a passing "4.50".
  function displayRatio(ratio) { return (Math.floor(ratio * 100 + 1e-9) / 100).toFixed(2); }

  // Black or white, whichever reads better on the given color.
  function readableOn(c) {
    if (typeof c === 'string') c = parseHex(c);
    var onBlack = contrastRatio(c, { r: 0, g: 0, b: 0 });
    var onWhite = contrastRatio(c, { r: 255, g: 255, b: 255 });
    return onBlack >= onWhite ? '#000000' : '#FFFFFF';
  }

  /* ---------- Nearest CSS color name (CIE Lab distance) ---------- */

  function toLab(c) {
    function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var r = lin(c.r), g = lin(c.g), b = lin(c.b);
    var x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
    var y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750);
    var z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883;
    function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
    return { L: 116 * f(y) - 16, a: 500 * (f(x) - f(y)), b: 200 * (f(y) - f(z)) };
  }

  function nearestName(c) {
    var lab = toLab(c), best = null, bestD = Infinity;
    for (var i = 0; i < NAME_LIST.length; i++) {
      var n = NAME_LIST[i];
      var d = Math.pow(lab.L - n.lab.L, 2) + Math.pow(lab.a - n.lab.a, 2) + Math.pow(lab.b - n.lab.b, 2);
      if (d < bestD) { bestD = d; best = n; }
    }
    return {
      name: best.name,
      hex: toHex(best),
      exact: best.r === c.r && best.g === c.g && best.b === c.b
    };
  }

  /* ---------- Build the name table ---------- */
  NAMES_SRC.split(',').forEach(function (pair) {
    var p = pair.split(':');
    NAMES[p[0]] = p[1];
    var c = parseHex(p[1]);
    c.name = p[0];
    c.lab = toLab(c);
    NAME_LIST.push(c);
  });

  return {
    clamp: clamp, wrapHue: wrapHue,
    parseHex: parseHex, parseColor: parseColor,
    rgbToHsl: rgbToHsl, hslToRgb: hslToRgb,
    toHex: toHex, hslToHex: hslToHex, hexToHsl: hexToHsl,
    formatRgb: formatRgb, formatHsl: formatHsl,
    luminance: luminance, contrastRatio: contrastRatio, compositeOver: compositeOver,
    wcag: wcag, displayRatio: displayRatio, readableOn: readableOn,
    nearestName: nearestName
  };
});
