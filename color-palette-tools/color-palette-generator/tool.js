/* Color Palette Generator: runs fully in the browser, nothing is uploaded */
const $=id=>document.getElementById(id);
const STYLES={balanced:[55,80,35,75],pastel:[55,85,78,90],vivid:[80,100,45,62],dark:[30,65,14,36],muted:[15,40,35,70]};
const SCHEMES=[[0,25,50,-25,-50],[0,180,30,210,-30],[0,120,240,60,180],[0,150,210,30,-30],[0,15,30,45,60],[0,40,-40,180,220]];
const rnd=(a,b)=>a+Math.random()*(b-a);
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const hexOk=v=>/^#?[0-9a-f]{6}$/i.test(v.trim());
const norm=v=>("#"+v.trim().replace("#","")).toUpperCase();
function hex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return"#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()}
function hue(h){const[r,g,b]=rgb(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;if(!d)return Math.random()*360;let H=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;H*=60;return H<0?H+360:H}
const ink=h=>{const[r,g,b]=rgb(h);return(r*299+g*587+b*114)/1000>150?"#0c0b1a":"#fff"};
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),1700)}
function copy(txt,msg){const ok=()=>toast(msg||"Copied "+txt);
const fb=()=>{const a=document.createElement("textarea");a.value=txt;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Copy not supported")}a.remove()};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,fb);else fb()}
const IC={lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
unlock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/></svg>',
copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1 11-11-3-3L5 16z"/></svg>'};
const S={cols:[],style:"balanced"};
const MIN=3,MAX=8;
function fresh(i,n,base,off,st){const[s0,s1,l0,l1]=STYLES[st];const t=(i*.618+Math.random()*.25)%1;
return hex(base+off[i%off.length]+rnd(-8,8),rnd(s0,s1),l0+(l1-l0)*t)}
function generate(){const n=S.cols.length,locked=S.cols.find(c=>c.lock),base=locked?hue(locked.c):Math.random()*360,off=SCHEMES[Math.floor(Math.random()*SCHEMES.length)];
S.cols.forEach((c,i)=>{if(!c.lock)c.c=fresh(i,n,base,off,S.style)});paint()}
function build(){const box=$("pal");box.innerHTML="";
S.cols.forEach((c,i)=>{const d=document.createElement("div");d.className="sw2";
d.innerHTML='<button type="button" class="hx" aria-label="Copy color"></button><div class="tb"><button type="button" class="lk"></button><button type="button" class="cpy" aria-label="Copy HEX">'+IC.copy+'</button><label class="ed" title="Edit color"><input type="color" aria-label="Edit color">'+IC.edit+'</label></div>';
const [hx,tb]=d.children,lk=tb.children[0],cp=tb.children[1],pick=tb.children[2].firstChild;
hx.onclick=cp.onclick=e=>{copy(c.c);if(e.detail)e.currentTarget.blur()};
lk.onclick=e=>{c.lock=!c.lock;paint();if(e.detail)lk.blur()};
pick.oninput=()=>{c.c=pick.value.toUpperCase();paint()};
box.appendChild(d)});paint()}
function paint(){document.querySelectorAll(".sw2").forEach((d,i)=>{const c=S.cols[i];d.style.background=c.c;d.style.color=ink(c.c);
d.querySelector(".hx").textContent=c.c;d.querySelector(".hx").setAttribute("aria-label","Copy "+c.c);
const lk=d.querySelector(".lk");lk.innerHTML=c.lock?IC.lock:IC.unlock;lk.setAttribute("aria-pressed",c.lock);lk.setAttribute("aria-label",(c.lock?"Unlock":"Lock")+" color "+(i+1));lk.classList.toggle("on",c.lock);
d.querySelector("input[type=color]").value=c.c});
$("count").value=S.cols.length;out();try{history.replaceState(null,"","#"+S.cols.map(c=>c.c.slice(1)).join("-"))}catch(e){}}
function out(){const v=S.cols.map(c=>c.c),f=$("fmt").value;
$("code").textContent=f==="hex"?v.join(", "):f==="css"?":root {\n"+v.map((c,i)=>"  --color-"+(i+1)+": "+c+";").join("\n")+"\n}":'["'+v.join('", "')+'"]'}
$("gen").onclick=generate;
document.addEventListener("keydown",e=>{if(e.code==="Space"&&!/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY)$/.test(document.activeElement.tagName)){e.preventDefault();generate()}});
$("count").onchange=e=>{const n=+e.target.value;if(n>S.cols.length){const base=hue(S.cols[0].c),off=SCHEMES[0];while(S.cols.length<n)S.cols.push({c:fresh(S.cols.length,n,base,off,S.style),lock:false})}else S.cols.length=n;build()};
$("style").onchange=e=>{S.style=e.target.value;generate()};
$("fmt").onchange=out;
$("copy").onclick=()=>copy($("code").textContent,"Palette copied");
$("png").onclick=()=>{const n=S.cols.length,w=1600,h=500,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),cw=w/n;
S.cols.forEach((k,i)=>{x.fillStyle=k.c;x.fillRect(Math.floor(i*cw),0,Math.ceil(cw),h);x.fillStyle=ink(k.c);x.font="700 34px ui-monospace,Menlo,monospace";x.textAlign="center";x.fillText(k.c,i*cw+cw/2,h-48)});
c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="palette.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("PNG downloaded")})};
(function init(){const m=location.hash.slice(1).split("-");
if(m.length>=MIN&&m.length<=MAX&&m.every(v=>hexOk(v)))S.cols=m.map(v=>({c:norm(v),lock:false}));
else{S.cols=Array.from({length:5},()=>({c:"#000000",lock:false}));build();generate();return}
build()})();
