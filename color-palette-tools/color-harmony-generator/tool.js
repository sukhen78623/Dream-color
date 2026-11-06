/* Color Harmony Generator: runs fully in the browser, nothing is uploaded */
const $=id=>document.getElementById(id);
const TYPES={
complementary:{label:"Complementary",off:()=>[0,180],roles:["Base","Complement"]},
analogous:{label:"Analogous",off:s=>[-2*s,-s,0,s,2*s],roles:["Analogous","Analogous","Base","Analogous","Analogous"],spread:1},
triadic:{label:"Triadic",off:()=>[0,120,240],roles:["Base","Triad","Triad"]},
split:{label:"Split-complementary",off:s=>[0,180-s,180+s],roles:["Base","Split","Split"],spread:1},
tetradic:{label:"Tetradic",off:()=>[0,60,180,240],roles:["Base","Accent","Complement","Accent"]},
square:{label:"Square",off:()=>[0,90,180,270],roles:["Base","Square","Square","Square"]},
mono:{label:"Monochromatic",roles:["Darkest","Darker","Base","Lighter","Lightest"]}};
const S={hex:"#7C3AED",type:"triadic",spread:25};
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const hexOk=v=>/^#?[0-9a-f]{6}$/i.test(v.trim());
const norm=v=>("#"+v.trim().replace("#","")).toUpperCase();
function hsl(h){const[r,g,b]=rgb(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m,L=(M+m)/2,Sa=d?d/(1-Math.abs(2*L-1)):0;let H=0;
if(d){H=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;H*=60;if(H<0)H+=360}return[H,Sa*100,L*100]}
function hex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return"#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()}
const ink=h=>{const[r,g,b]=rgb(h);return(r*299+g*587+b*114)/1000>150?"#0c0b1a":"#fff"};
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),1700)}
function copy(txt,msg){const ok=()=>toast(msg||"Copied "+txt);
const fb=()=>{const a=document.createElement("textarea");a.value=txt;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Copy not supported")}a.remove()};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,fb);else fb()}
function palette(){const[h,s,l]=hsl(S.hex),T=TYPES[S.type];
if(S.type==="mono"){const d=[-30,-15,0,15,30];return d.map((x,i)=>({hex:x===0?S.hex:hex(h,s,Math.max(8,Math.min(94,l+x))),role:T.roles[i],h}))}
return T.off(S.spread).map((o,i)=>({hex:o===0?S.hex:hex(h+o,s,l),role:T.roles[i],h:((h+o)%360+360)%360}))}
let P=[];
function render(){P=palette();const[h]=hsl(S.hex);
document.querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===S.type));
$("spreadRow").hidden=!TYPES[S.type].spread;$("spreadVal").textContent=S.spread+"°";$("spread").value=S.spread;
$("pick").value=S.hex;if(document.activeElement!==$("hx"))$("hx").value=S.hex;$("hue").value=Math.round(h);$("hueVal").textContent=Math.round(h)+"°";
$("wcSw").style.background=S.hex;$("wcHex").textContent=S.hex;
/* wheel */
const R=39.5,pt=c=>[50+R*Math.sin(c.h*Math.PI/180),50-R*Math.cos(c.h*Math.PI/180)];
let svg="";
if(S.type!=="mono"){const pts=P.slice().sort((a,b)=>a.h-b.h).map(pt);svg+='<polygon points="'+pts.map(p=>p[0].toFixed(2)+","+p[1].toFixed(2)).join(" ")+'" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width=".7" stroke-dasharray="2 1.4" stroke-linejoin="round"/>'}
const marks=S.type==="mono"?[P[2]]:P;
marks.forEach(c=>{const p=pt(c),b=c.role==="Base";svg+='<circle cx="'+p[0].toFixed(2)+'" cy="'+p[1].toFixed(2)+'" r="'+(b?5.4:4.2)+'" fill="'+c.hex+'" stroke="#fff" stroke-width="1.5"/><circle cx="'+p[0].toFixed(2)+'" cy="'+p[1].toFixed(2)+'" r="'+((b?5.4:4.2)+.9)+'" fill="none" stroke="rgba(0,0,0,.3)" stroke-width=".6"/>'});
$("wsvg").innerHTML=svg;
/* cards */
$("cards").innerHTML=P.map(c=>{const r=rgb(c.hex),[hh,ss,ll]=hsl(c.hex);
return'<article class="hc"><button type="button" class="hs" style="background:'+c.hex+';color:'+ink(c.hex)+'" data-copy="'+c.hex+'" aria-label="Copy '+c.hex+'"><small>'+c.role+'</small><b>'+c.hex+'</b></button><div class="hv"><span>rgb('+r.join(", ")+')</span><span>hsl('+Math.round(hh)+", "+Math.round(ss)+"%, "+Math.round(ll)+'%)</span></div></article>'}).join("");
out();try{history.replaceState(null,"","#"+S.hex.slice(1)+"-"+S.type+"-"+S.spread)}catch(e){}}
function out(){const v=P.map(c=>c.hex),f=$("fmt").value;
$("code").textContent=f==="hex"?v.join(", "):f==="css"?":root {\n"+v.map((c,i)=>"  --color-"+(i+1)+": "+c+";").join("\n")+"\n}":'["'+v.join('", "')+'"]'}
document.addEventListener("click",e=>{const c=e.target.closest("[data-copy]");if(c)copy(c.dataset.copy)});
document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.type=b.dataset.t;render()});
$("pick").oninput=e=>{S.hex=e.target.value.toUpperCase();render()};
$("hx").oninput=e=>{if(hexOk(e.target.value)){S.hex=norm(e.target.value);render()}};
$("hx").onblur=()=>{$("hx").value=S.hex};
$("hue").oninput=e=>{const[,s,l]=hsl(S.hex);S.hex=hex(+e.target.value,s,l);render()};
$("spread").oninput=e=>{S.spread=+e.target.value;render()};
$("rnd").onclick=()=>{S.hex=hex(Math.random()*360,60+Math.random()*25,45+Math.random()*15);render()};
$("fmt").onchange=out;
$("copy").onclick=()=>copy($("code").textContent,"Palette copied");
/* drag on the wheel */
const wheel=$("wheel");let drag=false;
function setHue(e){const r=wheel.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
let a=Math.atan2(dx,-dy)*180/Math.PI;if(a<0)a+=360;const[,s,l]=hsl(S.hex);S.hex=hex(a,s,l);render()}
wheel.addEventListener("pointerdown",e=>{const r=wheel.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))/(r.width/2);if(d<.5)return;drag=true;wheel.setPointerCapture(e.pointerId);setHue(e)});
wheel.addEventListener("pointermove",e=>{if(drag)setHue(e)});
["pointerup","pointercancel"].forEach(t=>wheel.addEventListener(t,()=>drag=false));
$("png").onclick=()=>{const n=P.length,w=1600,h=500,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),cw=w/n;
P.forEach((k,i)=>{x.fillStyle=k.hex;x.fillRect(Math.floor(i*cw),0,Math.ceil(cw),h);x.fillStyle=ink(k.hex);x.textAlign="center";x.font="600 26px system-ui,sans-serif";x.fillText(k.role,i*cw+cw/2,h-92);x.font="700 34px ui-monospace,Menlo,monospace";x.fillText(k.hex,i*cw+cw/2,h-48)});
c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="color-harmony.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("PNG downloaded")})};
(function(){const m=location.hash.slice(1).split("-");if(m.length===3&&hexOk(m[0])&&TYPES[m[1]]&&+m[2]>=10&&+m[2]<=45){S.hex=norm(m[0]);S.type=m[1];S.spread=+m[2]}render()})();
