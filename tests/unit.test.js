/* Unit tests for the pure modules. Run: node tests/unit.test.js */
'use strict';
const assert = require('assert');
const U = require('../assets/js/color-utils.js');
const E = require('../assets/js/palette-engine.js');
const G = require('../assets/js/gradient-engine.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { console.error('FAIL  ' + name + '\n      ' + e.message); process.exitCode = 1; }
}
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, a + ' != ' + b);

console.log('color-utils');
test('HEX -> RGB (6, 3, 4, 8 digits, with/without #)', () => {
  assert.deepStrictEqual(U.parseHex('#FF6347'), { r: 255, g: 99, b: 71, a: 1 });
  assert.deepStrictEqual(U.parseHex('ff6347'), { r: 255, g: 99, b: 71, a: 1 });
  assert.deepStrictEqual(U.parseHex('#f63'), { r: 255, g: 102, b: 51, a: 1 });
  assert.strictEqual(U.parseHex('#f638').a, 0x88 / 255);
  const c = U.parseHex('#FF634780');
  assert.strictEqual(U.formatRgb(c), 'rgba(255, 99, 71, 0.5)');
  assert.strictEqual(U.toHex(c), '#FF634780');
});
test('invalid HEX is rejected', () => {
  ['', '#', '#12', '#12345', '#1234567', '#GGGGGG', 'zzz', '#ff 63 47', null, undefined].forEach(v =>
    assert.strictEqual(U.parseHex(v === null || v === undefined ? '' : v), null, String(v)));
});
test('RGB -> HEX', () => {
  assert.strictEqual(U.toHex({ r: 255, g: 99, b: 71 }), '#FF6347');
  assert.strictEqual(U.toHex({ r: 0, g: 0, b: 0 }), '#000000');
  assert.strictEqual(U.toHex({ r: 1, g: 2, b: 3 }), '#010203');
});
test('HSL -> HEX known values', () => {
  assert.strictEqual(U.hslToHex(0, 100, 50), '#FF0000');
  assert.strictEqual(U.hslToHex(120, 100, 50), '#00FF00');
  assert.strictEqual(U.hslToHex(240, 100, 50), '#0000FF');
  assert.strictEqual(U.hslToHex(0, 0, 100), '#FFFFFF');
  assert.strictEqual(U.hslToHex(0, 0, 0), '#000000');
  assert.strictEqual(U.hslToHex(9, 100, 64), '#FF6347'); // g = 98.9 -> 99 = 0x63, b = 71.4 -> 71 = 0x47
  assert.strictEqual(U.hslToHex(360, 100, 50), '#FF0000');
  assert.strictEqual(U.hslToHex(-120, 100, 50), '#0000FF');
});
test('RGB -> HSL known values and formatting', () => {
  const h = U.rgbToHsl(255, 99, 71);
  near(h.h, 9.13, 0.01); near(h.s, 100); near(h.l, 63.92, 0.01);
  assert.strictEqual(U.formatHsl({ r: 255, g: 99, b: 71 }), 'hsl(9, 100%, 64%)');
  assert.strictEqual(U.formatHsl({ r: 128, g: 128, b: 128 }), 'hsl(0, 0%, 50%)');
  assert.strictEqual(U.formatHsl({ r: 255, g: 99, b: 71, a: 0.5 }), 'hsla(9, 100%, 64%, 0.5)');
});
test('HEX <-> HSL round trip within 1 channel step for 2000 random colors', () => {
  for (let i = 0; i < 2000; i++) {
    const c = { r: Math.floor(Math.random() * 256), g: Math.floor(Math.random() * 256), b: Math.floor(Math.random() * 256) };
    const hsl = U.rgbToHsl(c.r, c.g, c.b);
    const back = U.hslToRgb(hsl.h, hsl.s, hsl.l);
    assert.deepStrictEqual(back, c);
  }
});
test('parseColor accepts all supported syntaxes', () => {
  const want = { r: 255, g: 99, b: 71, a: 1 };
  ['#ff6347', 'ff6347', 'tomato', 'TOMATO', 'rgb(255, 99, 71)', 'rgb(255 99 71)', 'RGB(255,99,71)',
    '255, 99, 71', 'rgba(255, 99, 71, 1)', 'rgb(100%, 38.8%, 27.8%)'].forEach(v =>
    assert.deepStrictEqual(U.parseColor(v), want, v));
  assert.deepStrictEqual(U.parseColor('rgb(255 99 71 / 50%)'), { r: 255, g: 99, b: 71, a: 0.5 });
  assert.deepStrictEqual(U.parseColor('hsl(120, 100%, 50%)'), { r: 0, g: 255, b: 0, a: 1 });
  assert.deepStrictEqual(U.parseColor('hsl(120deg 100% 50% / 0.25)'), { r: 0, g: 255, b: 0, a: 0.25 });
  assert.deepStrictEqual(U.parseColor('rebeccapurple'), { r: 102, g: 51, b: 153, a: 1 });
});
test('parseColor rejects invalid input', () => {
  ['', '   ', 'notacolor', 'rgb(256, 0, 0)', 'rgb(-1, 0, 0)', 'rgb(1, 2)', 'rgb(1, 2, 3, 4, 5)', 'rgb(a, b, c)',
    'rgba(0,0,0,2)', 'hsl(0, 101%, 50%)', 'hsl(0, 50%, -1%)', 'hsl(x, 50%, 50%)', '#12', '1, 2', '300, 0, 0', 'constructor', '__proto__']
    .forEach(v => assert.strictEqual(U.parseColor(v), null, v));
});
test('contrast ratio: black/white = 21, same = 1, known pair', () => {
  near(U.contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }), 21);
  near(U.contrastRatio({ r: 9, g: 9, b: 9 }, { r: 9, g: 9, b: 9 }), 1);
  // #767676 on white is the well-known lowest grey that passes AA (4.54:1)
  near(U.contrastRatio({ r: 118, g: 118, b: 118 }, { r: 255, g: 255, b: 255 }), 4.54, 0.01);
  // #777777 on white fails AA normal (4.48:1)
  near(U.contrastRatio({ r: 119, g: 119, b: 119 }, { r: 255, g: 255, b: 255 }), 4.48, 0.01);
});
test('WCAG thresholds', () => {
  assert.deepStrictEqual(U.wcag(21), { aaNormal: true, aaLarge: true, aaaNormal: true, aaaLarge: true, ui: true });
  assert.deepStrictEqual(U.wcag(7), { aaNormal: true, aaLarge: true, aaaNormal: true, aaaLarge: true, ui: true });
  assert.deepStrictEqual(U.wcag(4.5), { aaNormal: true, aaLarge: true, aaaNormal: false, aaaLarge: true, ui: true });
  assert.deepStrictEqual(U.wcag(4.49), { aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false, ui: true });
  assert.deepStrictEqual(U.wcag(3), { aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false, ui: true });
  assert.deepStrictEqual(U.wcag(2.99), { aaNormal: false, aaLarge: false, aaaNormal: false, aaaLarge: false, ui: false });
  assert.strictEqual(U.displayRatio(4.499), '4.49');
  assert.strictEqual(U.displayRatio(21), '21.00');
  assert.strictEqual(U.displayRatio(4.5), '4.50');
});
test('compositeOver and readableOn', () => {
  assert.deepStrictEqual(U.compositeOver({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 255, g: 255, b: 255 }), { r: 128, g: 128, b: 128, a: 1 });
  assert.strictEqual(U.readableOn('#FFFFFF'), '#000000');
  assert.strictEqual(U.readableOn('#000000'), '#FFFFFF');
  assert.strictEqual(U.readableOn('#5A4AF0'), '#FFFFFF');
});
test('nearestName', () => {
  assert.deepStrictEqual(U.nearestName({ r: 255, g: 99, b: 71 }), { name: 'tomato', hex: '#FF6347', exact: true });
  const n = U.nearestName({ r: 254, g: 98, b: 70 });
  assert.strictEqual(n.name, 'tomato'); assert.strictEqual(n.exact, false);
  assert.strictEqual(U.nearestName({ r: 0, g: 0, b: 0 }).name, 'black');
  assert.strictEqual(U.nearestName({ r: 128, g: 128, b: 128 }).name, 'gray');
});

console.log('palette-engine');
function seeded(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const validHsl = c => c.h >= 0 && c.h < 360 && c.s >= 0 && c.s <= 100 && c.l >= 0 && c.l <= 100;
test('every harmony mode returns 5 valid colors (1000 runs each)', () => {
  E.HARMONY_MODES.forEach(mode => {
    for (let i = 0; i < 1000; i++) {
      const p = E.harmony(mode, { rng: seeded(i + 1) });
      assert.strictEqual(p.length, 5, mode);
      p.forEach(c => assert.ok(validHsl(c), mode + ' ' + JSON.stringify(c)));
    }
  });
  assert.deepStrictEqual(E.HARMONY_MODES.sort(), ['analogous', 'complementary', 'monochromatic', 'random', 'triadic']);
});
test('complementary has colors ~180deg apart; triadic ~120; mono shares a hue', () => {
  const hd = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  const comp = E.harmony('complementary', { rng: seeded(7), baseHue: 200 });
  assert.ok(hd(comp[0].h, comp[4].h) > 170 && hd(comp[0].h, comp[4].h) < 190);
  const tri = E.harmony('triadic', { rng: seeded(7), baseHue: 10 });
  near(hd(tri[0].h, tri[1].h), 120, 1e-6); near(hd(tri[1].h, tri[2].h), 120, 1e-6);
  const mono = E.harmony('monochromatic', { rng: seeded(3), baseHue: 100 });
  mono.forEach(c => assert.ok(hd(c.h, 100) <= 3.0001));
  for (let i = 1; i < 5; i++) assert.ok(mono[i].l > mono[i - 1].l, 'mono goes dark -> light');
});
test('baseHue is honoured by hue-based modes', () => {
  const a = E.harmony('analogous', { rng: seeded(11), baseHue: 300 });
  near(a[2].h, 300, 1e-6);
});
test('every preset returns 5 valid colors (1000 runs each)', () => {
  E.PRESET_IDS.forEach(id => {
    for (let i = 0; i < 1000; i++) {
      const p = E.preset(id, { rng: seeded(i + 5) });
      assert.strictEqual(p.length, 5, id);
      p.forEach(c => assert.ok(validHsl(c), id + ' ' + JSON.stringify(c)));
    }
  });
  assert.deepStrictEqual(E.PRESET_IDS.sort(), ['minimalist', 'monochromatic', 'pastel', 'vintage', 'website', 'wedding']);
  assert.throws(() => E.preset('nope'));
});
test('presets have their intended character', () => {
  for (let i = 0; i < 300; i++) {
    E.preset('pastel', { rng: seeded(i + 1) }).forEach(c => assert.ok(c.l >= 80 && c.s >= 55));
    const m = E.preset('minimalist', { rng: seeded(i + 1) });
    m.slice(0, 4).forEach(c => assert.ok(c.s <= 9.01, 'neutrals are low saturation'));
    const v = E.preset('vintage', { rng: seeded(i + 1) });
    v.forEach(c => assert.ok(c.s <= 70.01, 'vintage is muted'));
    const w = E.preset('wedding', { rng: seeded(i + 1) });
    assert.ok(w[0].l >= 78, 'wedding includes a light color');
    for (let k = 1; k < 5; k++) assert.ok(w[k].l <= w[k - 1].l, 'sorted light -> dark');
    const web = E.preset('website', { rng: seeded(i + 1) });
    assert.ok(web[0].l <= 16 && web[4].l >= 95, 'website: dark text + light background');
  }
});

console.log('gradient-engine');
const S = (hex, pos, alpha = 1) => ({ hex, pos, alpha });
test('linear CSS', () => {
  assert.strictEqual(
    G.gradientCss({ kind: 'linear', angle: 135, stops: [S('#4F46E5', 0), S('#EC4899', 100)] }),
    'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)');
});
test('radial CSS', () => {
  assert.strictEqual(
    G.gradientCss({ kind: 'radial', shape: 'ellipse', position: 'top left', stops: [S('#FDE68A', 0), S('#F472B6', 100)] }),
    'radial-gradient(ellipse at top left, #FDE68A 0%, #F472B6 100%)');
});
test('three-color + stops are sorted by position', () => {
  assert.strictEqual(
    G.gradientCss({ kind: 'linear', angle: 90, stops: [S('#FF0000', 100), S('#00FF00', 0), S('#0000FF', 50)] }),
    'linear-gradient(90deg, #00FF00 0%, #0000FF 50%, #FF0000 100%)');
});
test('transparent stops use rgba()', () => {
  assert.strictEqual(
    G.gradientCss({ kind: 'linear', angle: 180, stops: [S('#8B5CF6', 0, 1), S('#8B5CF6', 100, 0)] }),
    'linear-gradient(180deg, #8B5CF6 0%, rgba(139, 92, 246, 0) 100%)');
  assert.strictEqual(G.stopColor(S('#000000', 0, 0.456)), 'rgba(0, 0, 0, 0.46)');
});
test('background CSS block', () => {
  const css = G.fullCss('background', { kind: 'linear', angle: 160, stops: [S('#0F172A', 0), S('#7C3AED', 100)] });
  assert.strictEqual(css, [
    'background-color: #0F172A;',
    'background-image: linear-gradient(160deg, #0F172A 0%, #7C3AED 100%);',
    'background-repeat: no-repeat;', 'background-size: cover;', 'min-height: 100vh;'].join('\n'));
  assert.strictEqual(G.fullCss('linear', { kind: 'linear', angle: 0, stops: [S('#000000', 0), S('#FFFFFF', 100)] }),
    'background: linear-gradient(0deg, #000000 0%, #FFFFFF 100%);');
});
test('linear canvas geometry matches CSS (corners hit 0% / 100%)', () => {
  // 90deg on 200x100: horizontal line from left edge to right edge
  let e = G.linearEndpoints(200, 100, 90);
  near(e.x0, 0); near(e.x1, 200); near(e.y0, 50); near(e.y1, 50);
  // 180deg: top to bottom
  e = G.linearEndpoints(200, 100, 180);
  near(e.y0, 0); near(e.y1, 100); near(e.x0, 100);
  // 135deg on a square: corner to corner
  e = G.linearEndpoints(100, 100, 135);
  near(e.x0, 0); near(e.y0, 0); near(e.x1, 100); near(e.y1, 100);
});
test('radial canvas geometry (farthest-corner)', () => {
  let g = G.radialGeometry(200, 100, 'circle', 'center');
  near(g.cx, 100); near(g.cy, 50); near(g.rx, Math.hypot(100, 50)); near(g.ry, g.rx);
  g = G.radialGeometry(200, 100, 'ellipse', 'center');
  near(g.rx, Math.SQRT2 * 100); near(g.ry, Math.SQRT2 * 50);
  g = G.radialGeometry(200, 100, 'circle', 'top left');
  near(g.cx, 0); near(g.cy, 0); near(g.rx, Math.hypot(200, 100));
  g = G.radialGeometry(200, 100, 'circle', 'bottom right');
  near(g.cx, 200); near(g.cy, 100); near(g.rx, Math.hypot(200, 100));
  g = G.radialGeometry(200, 100, 'circle', 'bogus');
  near(g.cx, 100);
});

console.log('\n' + passed + ' tests passed' + (process.exitCode ? ' (with FAILURES)' : ''));
