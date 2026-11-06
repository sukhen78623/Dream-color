/* Shared site shell. Every page loads this file, so header/footer/nav are defined once. */
const NAV=[["Home","/"],["Tools","/#tools"],["Blog","/blog/"],["About","/about/"]];
const LEGAL=[["Privacy Policy","/privacy/"],["Terms &amp; Conditions","/terms/"]];
if(!document.getElementById("ycs-css")){const s=document.createElement("style");s.id="ycs-css";s.textContent=".brand .yb{display:inline;white-space:nowrap}.brand .yc,.brand .ys{margin:0 -.06em 0 0;padding:0 .06em 0 0;background-clip:text;-webkit-background-clip:text;color:transparent;-webkit-text-fill-color:transparent;background-image:linear-gradient(90deg,#ff3b6b,#ff9f1c,#ffd60a,#2ecc71,#1e90ff,#6c4cff,#c04cff)}.brand .yc{animation:none!important}.brand .ys{text-transform:lowercase;background-image:linear-gradient(90deg,#ff3b6b,#ff9f1c,#ffd60a,#2ecc71,#1e90ff,#6c4cff,#c04cff,#ff3b6b);background-size:200% 100%;animation:ysw 3s linear infinite!important}@keyframes ysw{to{background-position:200% 0}}@media(prefers-reduced-motion:reduce){.brand .ys{animation:none!important}}";document.head.appendChild(s)}
const brand=()=>'<a class="brand" href="/" aria-label="yourColorsss home"><span class="yb">your<span class="c yc">Color</span><span class="ys">sss</span></span></a>';
const list=a=>a.map(([t,h])=>'<a href="'+h+'">'+t+'</a>').join("");
customElements.define("dc-header",class extends HTMLElement{connectedCallback(){
const cta='<a class="btn p sm" href="/#tools">Explore Tools</a>';
this.innerHTML='<div class="w hd">'+brand()+'<nav class="nav" aria-label="Main">'+list(NAV)+cta+'</nav><button class="mb" type="button" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div><nav class="mp" aria-label="Mobile">'+list(NAV)+cta.replace(" sm","")+"</nav>";
const b=this.querySelector(".mb"),p=this.querySelector(".mp");
b.onclick=()=>{b.setAttribute("aria-expanded",p.classList.toggle("o"))};
p.onclick=e=>{if(e.target.closest("a")){p.classList.remove("o");b.setAttribute("aria-expanded","false")}};}});
customElements.define("dc-footer",class extends HTMLElement{connectedCallback(){
const f=a=>"<ul>"+a.map(([t,h])=>'<li><a href="'+h+'">'+t+"</a></li>").join("")+"</ul>";
this.innerHTML='<div class="w"><div class="ft"><div>'+brand()+'<p class="lead" style="margin-top:12px">A complete color solution platform to discover, understand, create and use colors with confidence.</p></div><div><h2>Explore</h2>'+f(NAV)+"</div><div><h2>Legal</h2>"+f(LEGAL)+'</div></div><p class="cp">© '+new Date().getFullYear()+" yourColorsss. All rights reserved.</p></div>";}});
