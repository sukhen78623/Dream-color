/**
 * Dream Color – palette engine (pure functions, no DOM access)
 * Generates 5-color palettes as HSL objects {h, s, l} (h: 0-360, s/l: 0-100).
 *  - harmony(mode, opts)  : random | complementary | analogous | triadic | monochromatic
 *  - preset(id, opts)     : pastel | wedding | website | minimalist | monochromatic | vintage
 * opts: { rng: () => number in [0,1), baseHue: number|null }
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.DreamColor = root.DreamColor || {}; root.DreamColor.engine = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function wrap(h) { return ((h % 360) + 360) % 360; }
  function rand(rng, min, max) { return min + (max - min) * rng(); }
  function jitter(rng, amount) { return rand(rng, -amount, amount); }
  function color(h, s, l) { return { h: wrap(h), s: s, l: l }; }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- Color harmony modes ---------- */

  var HARMONY = {
    random: function (rng) {
      var out = [];
      for (var i = 0; i < 5; i++) out.push(color(rand(rng, 0, 360), rand(rng, 45, 90), rand(rng, 30, 78)));
      return out;
    },

    complementary: function (rng, h) {
      var c = h + 180;
      return [
        color(h, rand(rng, 62, 85), rand(rng, 36, 48)),
        color(h + jitter(rng, 8), rand(rng, 55, 80), rand(rng, 62, 74)),
        color(h, rand(rng, 10, 24), rand(rng, 92, 96)),
        color(c + jitter(rng, 8), rand(rng, 55, 80), rand(rng, 60, 72)),
        color(c, rand(rng, 62, 85), rand(rng, 38, 50))
      ];
    },

    analogous: function (rng, h) {
      var step = rand(rng, 20, 34);
      var out = [];
      for (var i = -2; i <= 2; i++) {
        out.push(color(h + i * step, rand(rng, 55, 85), rand(rng, 40, 72)));
      }
      return out;
    },

    triadic: function (rng, h) {
      return [
        color(h, rand(rng, 68, 85), rand(rng, 44, 55)),
        color(h + 120, rand(rng, 58, 80), rand(rng, 48, 60)),
        color(h + 240, rand(rng, 58, 80), rand(rng, 48, 60)),
        color(h + jitter(rng, 10), rand(rng, 30, 50), rand(rng, 85, 92)),
        color(h + 240 + jitter(rng, 10), rand(rng, 40, 60), rand(rng, 20, 30))
      ];
    },

    monochromatic: function (rng, h, satBase) {
      var s = satBase !== undefined ? satBase : rand(rng, 40, 80);
      var lights = [rand(rng, 16, 26), rand(rng, 34, 42), rand(rng, 52, 58), rand(rng, 70, 76), rand(rng, 88, 94)];
      return lights.map(function (l) {
        return color(h + jitter(rng, 3), clampN(s + jitter(rng, 8), 10, 95), l);
      });
    }
  };

  function clampN(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function harmony(mode, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var h = (opts.baseHue === null || opts.baseHue === undefined) ? rand(rng, 0, 360) : opts.baseHue;
    var fn = HARMONY[mode] || HARMONY.random;
    return fn(rng, wrap(h));
  }

  /* ---------- Purpose-built presets ---------- */

  // Each pool describes one "kind" of color as ranges; palettes mix pools.
  var WEDDING_POOLS = [
    { h: [345, 356], s: [35, 60], l: [84, 92] },  // 0 blush
    { h: [95, 140],  s: [14, 28], l: [58, 72] },  // 1 sage
    { h: [38, 48],   s: [40, 65], l: [78, 88] },  // 2 champagne
    { h: [40, 50],   s: [40, 70], l: [93, 97] },  // 3 ivory
    { h: [203, 214], s: [25, 40], l: [62, 74] },  // 4 dusty blue
    { h: [340, 352], s: [40, 55], l: [26, 36] },  // 5 burgundy
    { h: [262, 282], s: [18, 32], l: [72, 84] },  // 6 lavender
    { h: [14, 22],   s: [45, 60], l: [62, 74] },  // 7 peach
    { h: [150, 170], s: [15, 25], l: [28, 38] },  // 8 deep eucalyptus
    { h: [30, 40],   s: [8, 16],  l: [40, 52] }   // 9 taupe
  ];
  var WEDDING_LIGHT = [0, 2, 3];

  var VINTAGE_POOLS = [
    { h: [38, 46],   s: [55, 70], l: [48, 58] },  // 0 mustard
    { h: [10, 18],   s: [48, 62], l: [44, 54] },  // 1 terracotta
    { h: [36, 44],   s: [45, 65], l: [86, 92] },  // 2 cream
    { h: [172, 184], s: [28, 42], l: [32, 42] },  // 3 faded teal
    { h: [62, 78],   s: [24, 36], l: [36, 46] },  // 4 olive
    { h: [350, 358], s: [30, 42], l: [66, 76] },  // 5 dusty rose
    { h: [20, 28],   s: [30, 42], l: [20, 30] },  // 6 cocoa
    { h: [205, 218], s: [28, 40], l: [26, 36] },  // 7 faded navy
    { h: [90, 110],  s: [14, 24], l: [56, 66] },  // 8 sage grey
    { h: [30, 36],   s: [28, 40], l: [62, 72] }   // 9 sepia
  ];
  var VINTAGE_LIGHT = [2, 5];

  function fromPool(p, rng) {
    return color(rand(rng, p.h[0], p.h[1]), rand(rng, p.s[0], p.s[1]), rand(rng, p.l[0], p.l[1]));
  }

  // One guaranteed light color + four others from distinct pools, light -> dark.
  function poolPalette(pools, lightIdx, rng) {
    var first = lightIdx[Math.floor(rng() * lightIdx.length)];
    var rest = shuffle(pools.map(function (_, i) { return i; }).filter(function (i) { return i !== first; }), rng).slice(0, 4);
    return [first].concat(rest)
      .map(function (i) { return fromPool(pools[i], rng); })
      .sort(function (a, b) { return b.l - a.l; });
  }

  var PRESETS = {
    pastel: function (rng, h) {
      var step = rand(rng, 55, 80), out = [];
      for (var i = 0; i < 5; i++) {
        out.push(color(h + i * step + jitter(rng, 6), rand(rng, 55, 85), rand(rng, 80, 90)));
      }
      return out;
    },

    wedding: function (rng) { return poolPalette(WEDDING_POOLS, WEDDING_LIGHT, rng); },

    // dark text, primary, secondary, accent, light background
    website: function (rng, h) {
      var dir = rng() < 0.5 ? -1 : 1;
      return [
        color(h, rand(rng, 25, 40), rand(rng, 10, 16)),
        color(h, rand(rng, 68, 85), rand(rng, 48, 56)),
        color(h + dir * rand(rng, 25, 40), rand(rng, 55, 75), rand(rng, 38, 48)),
        color(h + rand(rng, 150, 190), rand(rng, 75, 92), rand(rng, 52, 60)),
        color(h, rand(rng, 20, 40), rand(rng, 95, 97))
      ];
    },

    // near-white, light grey, mid grey, near-black + one accent
    minimalist: function (rng, h) {
      return [
        color(h, rand(rng, 2, 6), rand(rng, 96, 98)),
        color(h, rand(rng, 3, 7), rand(rng, 88, 91)),
        color(h, rand(rng, 3, 8), rand(rng, 60, 68)),
        color(h, rand(rng, 4, 9), rand(rng, 16, 24)),
        color(h + rand(rng, 120, 240), rand(rng, 60, 80), rand(rng, 50, 58))
      ];
    },

    monochromatic: function (rng, h) { return HARMONY.monochromatic(rng, h, rand(rng, 30, 70)); },

    vintage: function (rng) { return poolPalette(VINTAGE_POOLS, VINTAGE_LIGHT, rng); }
  };

  function preset(id, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var h = (opts.baseHue === null || opts.baseHue === undefined) ? rand(rng, 0, 360) : opts.baseHue;
    var fn = PRESETS[id];
    if (!fn) throw new Error('Unknown preset: ' + id);
    return fn(rng, wrap(h));
  }

  return {
    HARMONY_MODES: Object.keys(HARMONY),
    PRESET_IDS: Object.keys(PRESETS),
    harmony: harmony,
    preset: preset
  };
});
