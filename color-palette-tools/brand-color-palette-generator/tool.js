/* runs fully in your browser, nothing is uploaded */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function hsl(h){const[r,g,b]=rgb(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m,L=(M+m)/2,S=d?d/(1-Math.abs(2*L-1)):0;let H=0;
if(d){H=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;H*=60;if(H<0)H+=360}return[H,S*100,L*100]}
function hex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return"#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()}
const ink=h=>{const[r,g,b]=rgb(h);return(r*299+g*587+b*114)/1000>150?"#0c0b1a":"#fff"};
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),1700)}
function copy(txt,msg){const ok=()=>toast(msg||"Copied "+txt);
const fb=()=>{const a=document.createElement("textarea");a.value=txt;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Copy not supported")}a.remove()};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,fb);else fb()}
function pngOf(cols,file,labels,weights){const n=cols.length,w=1600,h=500,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),tw=weights?weights.reduce((a,b)=>a+b,0):n;let px=0;
cols.forEach((k,i)=>{const cw=weights?w*weights[i]/tw:w/n;x.fillStyle=k;x.fillRect(Math.floor(px),0,Math.ceil(cw),h);x.fillStyle=ink(k);x.textAlign="center";
if(labels&&labels[i]){x.font="600 26px system-ui,sans-serif";x.fillText(labels[i],px+cw/2,h-92)}x.font="700 "+(cw<140?22:34)+"px ui-monospace,Menlo,monospace";x.fillText(k,px+cw/2,h-48);px+=cw});
c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=file;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("PNG downloaded")})}
document.addEventListener("click",e=>{const c=e.target.closest("[data-copy]");if(c)copy(c.dataset.copy)});

const ROLES=[["Primary","Logo, headers and main buttons"],["Secondary","Supporting sections, icons and badges"],["Accent","Highlights, links and calls to action"],["Background","Page backgrounds and cards"],["Text","Text and dark backgrounds"]];
let base="#4F46E5",style="balanced",C=[];
const hexOk=v=>/^#?[0-9a-f]{6}$/i.test(v.trim()),norm=v=>("#"+v.trim().replace("#","")).toUpperCase();
const lum=h=>{const c=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const grade=r=>r>=7?"AAA":r>=4.5?"AA":r>=3?"AA Large":"Low";
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function make(){const[h,s,l]=hsl(base);let sec,acc;
if(style==="bold"){sec=hex(h+120,cl(s,55,95),cl(l,38,58));acc=hex(h+240,cl(s+10,70,95),52)}
else if(style==="soft"){sec=hex(h-30,cl(s*.7,25,70),cl(l+14,40,76));acc=hex(h+150,cl(s*.8,40,80),cl(l+10,48,66))}
else{sec=hex(h+30,cl(s*.9,30,90),cl(l+8,30,68));acc=hex(h+180,cl(s,65,95),52)}
C=[base,sec,acc,hex(h,22,96),hex(h,28,12)];render()}
function render(){const[p,s,a,l,d]=C,st=$("bp").style;
st.setProperty("--p",p);st.setProperty("--s",s);st.setProperty("--a",a);st.setProperty("--l",l);st.setProperty("--d",d);st.setProperty("--pi",ink(p));st.setProperty("--si",ink(s));st.setProperty("--ai",ink(a));
$("bp").innerHTML='<div class="bp-nav"><b>YourBrand</b><span><i>Home</i><i>Products</i><i>About</i></span></div><div class="bp-hero"><h3>A headline that sounds like your brand</h3><p>This is how your colors look together on a page, with a button, a badge and cards.</p><span class="bp-btn">Get started</span><span class="bp-badge">New</span></div><div class="bp-cards"><div><i></i><b>Feature one</b></div><div><i></i><b>Feature two</b></div><div><i></i><b>Feature three</b></div></div>';
$("cards").innerHTML=C.map((c,i)=>{const w=ratio(c,"#FFFFFF"),k=ratio(c,"#0C0B1A"),best=w>=k?["white",w]:["dark",k];
return'<article class="bk"><button type="button" class="bs" style="background:'+c+';color:'+ink(c)+'" data-copy="'+c+'" aria-label="Copy '+c+'"><small>'+ROLES[i][0]+'</small><b>'+c+'</b></button><div class="bi"><span class="use">'+ROLES[i][1]+'</span><span class="ct">Best text: '+best[0]+' · '+best[1].toFixed(1)+':1 · '+grade(best[1])+'</span></div></article>'}).join("");
$("pick").value=base;if(document.activeElement!==$("hx"))$("hx").value=base;
document.querySelectorAll("[data-st]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.st===style));out();
try{history.replaceState(null,"","#"+base.slice(1)+"-"+style)}catch(e){}}
function out(){const f=$("fmt").value,n=["primary","secondary","accent","background","text"];
$("code").textContent=f==="css"?":root {\n"+C.map((c,i)=>"  --brand-"+n[i]+": "+c+";").join("\n")+"\n}":f==="hex"?C.join(", "):"{\n"+C.map((c,i)=>'  "'+n[i]+'": "'+c+'"').join(",\n")+"\n}"}
document.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{style=b.dataset.st;make()});
$("pick").oninput=e=>{base=e.target.value.toUpperCase();make()};
$("hx").oninput=e=>{if(hexOk(e.target.value)){base=norm(e.target.value);make()}};$("hx").onblur=()=>{$("hx").value=base};
$("rnd").onclick=()=>{base=hex(Math.random()*360,rnd(55,85),rnd(38,56));make()};
$("fmt").onchange=out;$("copy").onclick=()=>copy($("code").textContent,"Brand colors copied");
$("png").onclick=()=>pngOf(C,"brand-palette.png",ROLES.map(r=>r[0]));
(function(){const m=location.hash.slice(1).split("-");if(m.length===2&&hexOk(m[0])&&["balanced","bold","soft"].includes(m[1])){base=norm(m[0]);style=m[1]}make()})();
