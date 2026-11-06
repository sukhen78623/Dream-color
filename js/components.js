/* Shared site shell. Every page loads this file, so header/footer/nav are defined once. */
const NAV=[["Home","/"],["Tools","/#tools"],["Blog","/blog/"],["About","/about/"]];
const LEGAL=[["Privacy Policy","/privacy/"],["Terms &amp; Conditions","/terms/"]];
if(!document.getElementById("ycs-css")){const s=document.createElement("style");s.id="ycs-css";s.textContent=".ycs{display:inline-block;height:.7em;width:1.3em;vertical-align:-.05em;margin-left:0;overflow:visible}.ycs path{fill:none;stroke-linecap:round;stroke-linejoin:round}.ycs .g{stroke:currentColor;stroke-width:1.4}.ycs .f{stroke-width:1.7;stroke-dasharray:100;stroke-dashoffset:100;animation:ycs 3.6s ease-in-out infinite}@keyframes ycs{0%{stroke-dashoffset:100;opacity:1}35%{stroke-dashoffset:0}85%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.ycs .f{animation:none;stroke-dashoffset:0}}";document.head.appendChild(s)}
const S="M10 3.5C8.5 1 2 1 2 4.5C2 8 10 7 10 11C10 14.5 3 14.5 1.5 11.5";
const SSS='<svg class="ycs" viewBox="1.2 0 29.8 16" aria-hidden="true">'+[["#ff4d8d",0],["#ffb020",10],["#2ea8ff",20]].map(([c,x],i)=>'<g transform="translate('+x+' 0)"><path class="g" d="'+S+'" pathLength="100"/><path class="f" style="stroke:'+c+';animation-delay:'+(i*0.3)+'s" d="'+S+'" pathLength="100"/></g>').join("")+"</svg>";
const brand=()=>'<a class="brand" href="/" aria-label="yourColorsss home">your<span class="c">Color</span>'+SSS+"</a>";
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
