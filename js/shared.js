/* ===== SHARED COMPONENTS (header + footer) =====
   Loaded on every page: /js/shared.js */
const NAV=[["Tools","#tools"],["Palettes","#palettes"],["Color of the Day","#cotd"],["FAQ","#faq"]];
const H="/";
document.getElementById("site-header").innerHTML=`<header class="site"><div class="wrap">
<a class="logo" href="${H||"#top"}" aria-label="Dream Color home">Dream <span class="cyc">Color</span></a>
<nav class="main" aria-label="Main">${NAV.map(n=>`<a href="${H+n[1]}">${n[0]}</a>`).join("")}</nav>
<button class="ib" id="sBtn" aria-label="Search palettes">🔍</button>
<button class="ib" id="thBtn" aria-label="Toggle theme">◐</button>
<button class="ib" id="menuBtn" aria-label="Open menu" aria-expanded="false">☰</button></div>
<nav id="mnav" aria-label="Mobile">${NAV.map(n=>`<a href="${H+n[1]}">${n[0]}</a>`).join("")}</nav></header>`;
const FC=["Wedding","Website","Minimalist","Monochromatic","Vintage","Modern House","Pastel","Luxury","Nature-Inspired","Aesthetic"];
document.getElementById("site-footer").innerHTML=`<footer class="site"><div class="wrap"><div class="fg">
<div><a class="logo" href="${H||"#top"}">Dream <span class="cyc">Color</span></a><p class="note" style="margin-top:10px;max-width:300px">Dream Color is a playground for people who love color: palettes, image color picking, gradients, converters and more.</p></div>
<div><h4>Quick Links</h4><ul>${NAV.map(n=>`<li><a href="${H+n[1]}">${n[0]}</a></li>`).join("")}<li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Blog</a></li></ul></div>
<div><h4>Explore Color Palettes</h4><ul>${FC.slice(0,6).map(c=>`<li><a href="${H}#palettes" data-cat="${c}">${c} Palettes</a></li>`).join("")}</ul></div>
<div><h4>Color Tools</h4><ul><li><a href="${H}#tools">Palette Generator</a></li><li><a href="${H}#tools">Palette Presets</a></li><li><a href="${H}#tools">Image Picker</a></li><li><a href="${H}#tools">Gradient Mixer</a></li><li><a href="${H}#tools">HEX, RGB &amp; HSL Converter</a></li></ul></div>
</div><div class="fb"><span>© ${new Date().getFullYear()} Dream Color. All rights reserved.</span><span><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></span></div></div></footer>`;


document.body.insertAdjacentHTML("beforeend",`<div id="srch" role="dialog" aria-modal="true" aria-label="Search color palettes" hidden><div class="sbox"><div class="srow"><input id="q" type="search" placeholder="Try “luxury wedding colors”" autocomplete="off" aria-label="Search palettes"><button class="ib" id="sx" aria-label="Close search">✕</button></div><div class="chips" id="sChips" style="justify-content:flex-start"></div><div class="grid" id="sRes" style="grid-template-columns:1fr"></div></div></div><div id="toast" role="status" aria-live="polite"></div>`);
