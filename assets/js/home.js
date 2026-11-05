/* Dream Color – home page preview strip.
   Shows a few harmony palettes (new one every 5 seconds, four times, then it
   rests). No animation at all when the visitor prefers reduced motion. */
(function () {
  'use strict';

  var U = window.DreamColorUtils;
  var box = document.getElementById('home-preview');
  if (!U || !box) { return; }

  var cells = [].slice.call(box.querySelectorAll('span'));
  var colors = cells.map(function () { return { hex: '#000000', locked: false }; });
  var modes = ['analogous', 'complementary', 'triadic', 'monochromatic'];
  var step = Math.floor(Math.random() * modes.length);

  function show(mode) {
    var hexes = U.generatePalette(mode, colors);
    hexes.forEach(function (hex, i) {
      colors[i].hex = hex;
      cells[i].style.backgroundColor = hex;
      cells[i].style.color = U.readableInk(hex);
      cells[i].textContent = hex;
    });
  }

  show(modes[step]);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { return; }

  var changes = 0;
  var timer = setInterval(function () {
    if (document.hidden) { return; }
    step = (step + 1) % modes.length;
    show(modes[step]);
    changes += 1;
    if (changes >= 4) { clearInterval(timer); }
  }, 5000);
})();
