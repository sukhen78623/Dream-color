/**
 * Dream Color – specific-purpose palette presets (UI)
 * Cards are written in index.html (so headings are real HTML); this script
 * fills each card with a generated palette and wires its buttons.
 */
(function () {
  'use strict';
  var U = DreamColor.utils, E = DreamColor.engine, ui = DreamColor.ui;

  var cards = document.querySelectorAll('.preset-card[data-preset]');
  if (!cards.length) return;

  Array.prototype.forEach.call(cards, function (card) {
    var id = card.getAttribute('data-preset');
    var strip = card.querySelector('.preset-strip');
    var label = card.querySelector('h3').textContent;
    var current = [];

    function render(animate) {
      current = E.preset(id).map(function (c) { return U.hslToHex(c.h, c.s, c.l); });
      strip.innerHTML = '';
      current.forEach(function (hex) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip-swatch' + (animate ? ' is-new' : '');
        b.style.backgroundColor = hex;
        b.style.color = U.readableOn(hex);
        b.textContent = hex;
        b.setAttribute('aria-label', 'Copy ' + hex);
        b.addEventListener('click', function () { ui.copy(hex, 'HEX ' + hex); });
        strip.appendChild(b);
      });
    }

    card.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'generate') {
        render(true);
      } else if (action === 'copy') {
        ui.copy(current.join(', '), 'palette ' + current.join(', '));
      } else if (action === 'edit') {
        if (DreamColor.paletteApi) DreamColor.paletteApi.setColors(current);
        ui.scrollToId('palette');
        ui.toast('Loaded into the generator: ' + label.replace(' Generator', ''));
      }
    });

    render(false);
  });
})();
