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
const MOODS={"calm": {"label": "Calm", "hues": [[170, 230]], "s": [25, 55], "l": [40, 90], "d": "Soft blues and greens with gentle contrast that slow things down.", "u": "Wellness, meditation, sleep apps, spas, healthcare"}, "energetic": {"label": "Energetic", "hues": [[0, 50]], "s": [75, 100], "l": [40, 65], "d": "Hot reds, oranges and yellows that feel fast and full of life.", "u": "Fitness, sports, events, food delivery, promotions"}, "playful": {"label": "Playful", "wheel": 1, "s": [70, 95], "l": [52, 76], "d": "A bright mix of hues spread around the color wheel for a fun, lively feel.", "u": "Kids, games, snacks, creative tools, party invites"}, "elegant": {"label": "Elegant", "hues": [[250, 290], [30, 45]], "s": [10, 35], "l": [12, 40], "neutral": 1, "d": "Deep, muted tones with a soft neutral, calm and refined.", "u": "Luxury brands, fashion, weddings, jewellery, interiors"}, "bold": {"label": "Bold", "hues": [[345, 360], [0, 15], [205, 230]], "s": [80, 100], "l": [32, 56], "d": "High-contrast, saturated colors that make a strong statement.", "u": "Startups, sports, posters, call-to-action sections"}, "romantic": {"label": "Romantic", "hues": [[320, 360], [0, 15]], "s": [35, 75], "l": [58, 92], "d": "Soft pinks, roses and blush tones with a warm, gentle feel.", "u": "Weddings, beauty, gifts, valentine campaigns, cafes"}, "natural": {"label": "Natural", "hues": [[70, 150], [25, 45]], "s": [25, 55], "l": [24, 72], "d": "Leafy greens and earthy browns inspired by plants, soil and sun.", "u": "Organic products, eco brands, gardening, outdoor travel"}, "mysterious": {"label": "Mysterious", "hues": [[250, 300]], "s": [30, 70], "l": [10, 46], "d": "Deep purples and midnight blues that feel dark, rich and secretive.", "u": "Gaming, nightlife, books, music, astrology"}, "cheerful": {"label": "Cheerful", "hues": [[35, 70], [150, 190]], "s": [70, 100], "l": [52, 78], "d": "Sunny yellows with fresh teal and green for a happy, open mood.", "u": "Education, children's brands, travel, summer sales"}, "professional": {"label": "Professional", "hues": [[205, 235]], "s": [30, 65], "l": [20, 92], "neutral": 1, "d": "Trustworthy blues and greys with a clean neutral for clear, serious design.", "u": "Finance, consulting, law, software, corporate reports"}};
let mood="calm";
function gen(P,n){const out=[];const base=rnd(0,360);
for(let i=0;i<n;i++){let h;if(P.wheel)h=base+i*(360/n)+rnd(-14,14);else{const r=P.hues[Math.floor(Math.random()*P.hues.length)];h=rnd(r[0],r[1])}
const l=P.l[0]+(P.l[1]-P.l[0])*(i/(n-1))+rnd(-4,4);out.push([h,rnd(P.s[0],P.s[1]),Math.max(6,Math.min(96,l))])}
if(P.neutral){const k=Math.floor(rnd(1,n-1));out[k]=[out[k][0],rnd(5,14),rnd(90,96)]}
return out.map(c=>hex(c[0],c[1],c[2]))}
let SETS=[];
function render(){const m=MOODS[mood];$("mn").textContent=m.label;$("md").textContent=m.d;$("mu").textContent=m.u;
$("rows").innerHTML=SETS.map((s,i)=>'<article class="prow"><div class="pstrip">'+s.map(c=>'<button type="button" style="background:'+c+';color:'+ink(c)+'" data-copy="'+c+'" aria-label="Copy '+c+'">'+c+'</button>').join("")+'</div><div class="pfoot"><small>Idea '+(i+1)+'</small><div class="pa"><button type="button" class="btn sm" data-all="'+i+'">Copy all</button><button type="button" class="btn sm" data-png="'+i+'">PNG</button></div></div></article>').join("");
try{history.replaceState(null,"","#"+mood)}catch(e){}}
function make(){SETS=[0,1,2,3].map(()=>gen(MOODS[mood],5));render()}
document.addEventListener("click",e=>{const a=e.target.closest("[data-all]"),p=e.target.closest("[data-png]"),m=e.target.closest("[data-m]");
if(a)copy(SETS[a.dataset.all].join(", "),"Palette copied");
if(p)pngOf(SETS[p.dataset.png],mood+"-palette.png");
if(m){mood=m.dataset.m;document.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b===m));make()}});
$("gen").onclick=make;
(function(){const h=location.hash.slice(1);if(MOODS[h]){mood=h;document.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===h))}make()})();
