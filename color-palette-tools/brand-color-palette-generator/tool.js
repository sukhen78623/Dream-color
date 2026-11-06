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
const TR={"trustworthy": {"label": "Trustworthy", "h": [[205, 225]], "s": [55, 80], "l": [32, 46]}, "friendly": {"label": "Friendly", "h": [[25, 45]], "s": [75, 95], "l": [48, 58]}, "luxurious": {"label": "Luxurious", "h": [[262, 290], [40, 48]], "s": [30, 55], "l": [18, 34]}, "playful": {"label": "Playful", "h": [[300, 340], [170, 190]], "s": [70, 95], "l": [52, 66]}, "bold": {"label": "Bold", "h": [[350, 360], [0, 12]], "s": [75, 95], "l": [40, 50]}, "calm": {"label": "Calm", "h": [[165, 200]], "s": [35, 60], "l": [42, 56]}, "eco": {"label": "Eco-friendly", "h": [[95, 145]], "s": [40, 65], "l": [30, 42]}, "modern": {"label": "Modern", "h": [[225, 260]], "s": [65, 90], "l": [46, 58]}, "energetic": {"label": "Energetic", "h": [[10, 50]], "s": [85, 100], "l": [48, 56]}, "creative": {"label": "Creative", "h": [[265, 310]], "s": [60, 85], "l": [48, 60]}};
const ROLES=[["Primary","Logo, headers and main buttons"],["Secondary","Supporting sections, icons and badges"],["Accent","Highlights, links and calls to action"],["Light","Page backgrounds and cards"],["Dark","Text and dark backgrounds"]];
let sel=["trustworthy","modern"],C=[];
const pick=r=>{const a=r[Math.floor(Math.random()*r.length)];return rnd(a[0],a[1])};
const lum=h=>{const c=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const grade=r=>r>=7?"AAA":r>=4.5?"AA":r>=3?"AA Large":"Low";
const dist=(a,b)=>{const d=Math.abs(((a-b)%360+360)%360);return Math.min(d,360-d)};
function make(){const T=sel.map(k=>TR[k]);if(!T.length)T.push(TR.trustworthy);
let ph,ps,pl;if($("own").checked){[ph,ps,pl]=hsl($("ownc").value)}else{ph=pick(T[0].h);ps=rnd(T[0].s[0],T[0].s[1]);pl=rnd(T[0].l[0],T[0].l[1])}
let sh,ss,sl;if(T[1]){sh=pick(T[1].h);ss=rnd(T[1].s[0],T[1].s[1]);sl=rnd(T[1].l[0],T[1].l[1])}else{sh=ph+(Math.random()<.5?1:-1)*rnd(28,45);ss=Math.max(25,ps-12);sl=Math.min(72,pl+14)}
if(dist(sh,ph)<22)sh+=45;
let ah,as,al;if(T[2]){ah=pick(T[2].h);as=rnd(T[2].s[0],T[2].s[1]);al=rnd(T[2].l[0],T[2].l[1])}else{ah=ph+180+rnd(-25,25);as=Math.min(95,Math.max(70,ps+8));al=rnd(48,58)}
if(dist(ah,ph)<40)ah+=90;
C=[$("own").checked?$("ownc").value.toUpperCase():hex(ph,ps,pl),hex(sh,ss,sl),hex(ah,as,al),hex(ph,22,96),hex(ph,28,12)];render()}
function render(){const[p,s,a,l,d]=C,st=document.getElementById("bp").style;
st.setProperty("--p",p);st.setProperty("--s",s);st.setProperty("--a",a);st.setProperty("--l",l);st.setProperty("--d",d);st.setProperty("--pi",ink(p));st.setProperty("--si",ink(s));st.setProperty("--ai",ink(a));
$("bp").innerHTML='<div class="bp-nav"><b>YourBrand</b><span><i>Home</i><i>Products</i><i>About</i></span></div><div class="bp-hero"><h3>A headline that sounds like your brand</h3><p>This is how your colors look together on a page, with a button, a badge and cards.</p><span class="bp-btn">Get started</span><span class="bp-badge">New</span></div><div class="bp-cards"><div><i></i><b>Feature one</b></div><div><i></i><b>Feature two</b></div><div><i></i><b>Feature three</b></div></div>';
$("cards").innerHTML=C.map((c,i)=>{const w=ratio(c,"#FFFFFF"),k=ratio(c,"#0C0B1A"),best=w>=k?["white",w]:["dark",k];
return'<article class="bk"><button type="button" class="bs" style="background:'+c+';color:'+ink(c)+'" data-copy="'+c+'" aria-label="Copy '+c+'"><small>'+ROLES[i][0]+'</small><b>'+c+'</b></button><div class="bi"><span class="use">'+ROLES[i][1]+'</span><span class="ct">Best text: '+best[0]+' · '+best[1].toFixed(1)+':1 · '+grade(best[1])+'</span></div></article>'}).join("");out()}
function out(){const f=$("fmt").value,n=["primary","secondary","accent","light","dark"];
$("code").textContent=f==="css"?":root {\n"+C.map((c,i)=>"  --brand-"+n[i]+": "+c+";").join("\n")+"\n}":f==="hex"?C.join(", "):"{\n"+C.map((c,i)=>'  "'+n[i]+'": "'+c+'"').join(",\n")+"\n}"}
document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{const k=b.dataset.t;if(sel.includes(k))sel=sel.filter(x=>x!==k);else{sel.push(k);if(sel.length>3)sel.shift()}
document.querySelectorAll("[data-t]").forEach(x=>x.setAttribute("aria-pressed",sel.includes(x.dataset.t)));make()});
$("gen").onclick=make;$("own").onchange=make;$("ownc").oninput=()=>{$("own").checked=true;make()};$("fmt").onchange=out;
$("copy").onclick=()=>copy($("code").textContent,"Brand colors copied");
$("png").onclick=()=>pngOf(C,"brand-palette.png",ROLES.map(r=>r[0]));
make();
