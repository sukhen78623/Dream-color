/* ===== HELPERS ===== */
const $=s=>document.querySelector(s);
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1600)};
const copy=(txt,msg)=>{const done=()=>toast(msg||"Copied "+txt);try{navigator.clipboard.writeText(txt).then(done,fb)}catch(e){fb()}
 function fb(){const a=document.createElement("textarea");a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();done()}};
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function hsl(h){let[r,g,b]=rgb(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let s=0,H=0;
 if(d){s=d/(1-Math.abs(2*l-1));H=mx==r?((g-b)/d+6)%6:mx==g?(b-r)/d+2:(r-g)/d+4;H*=60}return[Math.round(H),Math.round(s*100),Math.round(l*100)]}
const hs=(h,s,l)=>`hsl(${(h+360)%360} ${s}% ${l}%)`;
const bar=c=>`<div class="bar">${c.map(x=>`<i style="background:${x}"></i>`).join("")}</div>`;
function palCard(p){const e=document.createElement("article");e.className="card pal";
 e.innerHTML=`${bar(p.cols)}<div class="in"><span class="cat">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="hex">${p.cols.map(c=>`<button data-h="${c}" aria-label="Copy ${c}">${c.toUpperCase()}</button>`).join("")}</div><button class="cp">Copy palette</button></div>`;
 e.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>copy(b.dataset.h.toUpperCase()));
 e.querySelector(".cp").onclick=()=>copy(p.cols.join(", ").toUpperCase(),"Palette copied");return e}

/* ===== THEME ===== */
const root=document.documentElement,mq=matchMedia("(prefers-color-scheme: dark)");
let saved=null;try{saved=localStorage.getItem("dc-theme")}catch(e){}
const setTheme=t=>root.dataset.theme=t;
setTheme(saved||(mq.matches?"dark":"light"));
mq.addEventListener("change",e=>{let s=null;try{s=localStorage.getItem("dc-theme")}catch(x){}if(!s)setTheme(e.matches?"dark":"light")});
$("#thBtn").onclick=()=>{const t=root.dataset.theme=="dark"?"light":"dark";setTheme(t);try{localStorage.setItem("dc-theme",t)}catch(e){}};
$("#menuBtn").onclick=e=>{const o=$("#mnav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
$("#mnav").onclick=()=>$("#mnav").classList.remove("open");

