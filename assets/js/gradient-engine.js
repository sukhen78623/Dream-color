/**
 * Dream Color – gradient engine (pure functions, no DOM access)
 *
 * Gradient state shape:
 *   { kind: 'linear' | 'radial',
 *     angle: 0-360,                       (linear)
 *     shape: 'circle' | 'ellipse',        (radial)
 *     position: 'center' | 'top left' …,  (radial)
 *     stops: [{ hex: '#RRGGBB', alpha: 0-1, pos: 0-100 }] }
 *
 * Provides CSS generation and the geometry needed to paint the same
 * gradient on a <canvas> for PNG export.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./color-utils.js'));
  else { root.DreamColor = root.DreamColor || {}; root.DreamColor.gradient = factory(root.DreamColor.utils); }
})(typeof self !== 'undefined' ? self : this, function (U) {
  'use strict';

  var POSITIONS = {
    'center': [0.5, 0.5],
    'top': [0.5, 0],
    'bottom': [0.5, 1],
    'left': [0, 0.5],
    'right': [1, 0.5],
    'top left': [0, 0],
    'top right': [1, 0],
    'bottom left': [0, 1],
    'bottom right': [1, 1]
  };

  function round(n, places) { var p = Math.pow(10, places); return Math.round(n * p) / p; }

  function sortedStops(stops) {
    return stops
      .map(function (s, i) { return { s: s, i: i }; })
      .sort(function (a, b) { return a.s.pos - b.s.pos || a.i - b.i; })
      .map(function (o) { return o.s; });
  }

  // CSS color for a stop: HEX when opaque, rgba() when translucent.
  function stopColor(stop) {
    var c = U.parseHex(stop.hex) || { r: 0, g: 0, b: 0 };
    var a = stop.alpha === undefined ? 1 : stop.alpha;
    if (a >= 1) return U.toHex({ r: c.r, g: c.g, b: c.b, a: 1 });
    return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + round(a, 2) + ')';
  }

  function stopsCss(stops) {
    return sortedStops(stops).map(function (s) {
      return stopColor(s) + ' ' + round(s.pos, 1) + '%';
    }).join(', ');
  }

  // The CSS gradient function, e.g. "linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)"
  function gradientCss(state) {
    if (state.kind === 'radial') {
      return 'radial-gradient(' + state.shape + ' at ' + state.position + ', ' + stopsCss(state.stops) + ')';
    }
    return 'linear-gradient(' + round(state.angle, 1) + 'deg, ' + stopsCss(state.stops) + ')';
  }

  // Copy-ready CSS block. mode 'background' also adds a fallback color and sizing.
  function fullCss(mode, state) {
    var g = gradientCss(state);
    if (mode === 'background') {
      var first = sortedStops(state.stops)[0];
      var c = U.parseHex(first.hex);
      return [
        'background-color: ' + U.toHex({ r: c.r, g: c.g, b: c.b, a: 1 }) + ';',
        'background-image: ' + g + ';',
        'background-repeat: no-repeat;',
        'background-size: cover;',
        'min-height: 100vh;'
      ].join('\n');
    }
    return 'background: ' + g + ';';
  }

  /* ---------- Canvas geometry (mirrors CSS behaviour) ---------- */

  // CSS linear-gradient: the gradient line passes through the center and is
  // long enough that the corners get the 0% and 100% colors exactly.
  function linearEndpoints(w, h, angleDeg) {
    var a = angleDeg * Math.PI / 180;
    var dx = Math.sin(a), dy = -Math.cos(a);
    var len = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a));
    var cx = w / 2, cy = h / 2;
    return { x0: cx - dx * len / 2, y0: cy - dy * len / 2, x1: cx + dx * len / 2, y1: cy + dy * len / 2 };
  }

  // CSS radial-gradient with the default "farthest-corner" sizing.
  function radialGeometry(w, h, shape, position) {
    var p = POSITIONS[position] || POSITIONS.center;
    var cx = p[0] * w, cy = p[1] * h;
    var fx = Math.max(cx, w - cx), fy = Math.max(cy, h - cy);
    if (shape === 'ellipse') return { cx: cx, cy: cy, rx: Math.SQRT2 * fx, ry: Math.SQRT2 * fy };
    var r = Math.sqrt(fx * fx + fy * fy);
    return { cx: cx, cy: cy, rx: r, ry: r };
  }

  function draw(ctx, w, h, state) {
    ctx.clearRect(0, 0, w, h);
    var stops = sortedStops(state.stops);
    var g;
    if (state.kind === 'radial') {
      var geo = radialGeometry(w, h, state.shape, state.position);
      ctx.save();
      ctx.translate(geo.cx, geo.cy);
      ctx.scale(geo.rx, geo.ry);
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      stops.forEach(function (s) { g.addColorStop(U.clamp(s.pos / 100, 0, 1), stopColor(s)); });
      ctx.fillStyle = g;
      ctx.fillRect(-geo.cx / geo.rx, -geo.cy / geo.ry, w / geo.rx, h / geo.ry);
      ctx.restore();
    } else {
      var e = linearEndpoints(w, h, state.angle);
      g = ctx.createLinearGradient(e.x0, e.y0, e.x1, e.y1);
      stops.forEach(function (s) { g.addColorStop(U.clamp(s.pos / 100, 0, 1), stopColor(s)); });
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }

  return {
    POSITIONS: Object.keys(POSITIONS),
    sortedStops: sortedStops, stopColor: stopColor,
    gradientCss: gradientCss, fullCss: fullCss,
    linearEndpoints: linearEndpoints, radialGeometry: radialGeometry,
    draw: draw
  };
});
