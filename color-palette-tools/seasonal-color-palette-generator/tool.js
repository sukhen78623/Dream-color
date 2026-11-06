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
const SE={"spring": {"label": "Spring", "hues": [[80, 160], [320, 350], [40, 60]], "s": [45, 80], "l": [62, 90], "d": "Fresh greens, blossom pinks and soft yellows that feel light and new.", "u": "Spring wardrobes, weddings, garden and Easter campaigns, home refresh", "cur": [["Fresh Bloom", ["#FFF1F2", "#FBCFE8", "#A7F3D0", "#86EFAC", "#FDE68A"]], ["Garden Party", ["#FFE4E6", "#FDA4AF", "#BEF264", "#6EE7B7", "#C4B5FD"]], ["Rainfall Meadow", ["#ECFCCB", "#BEF264", "#7DD3FC", "#F9A8D4", "#FEF08A"]]]}, "summer": {"label": "Summer", "hues": [[170, 210], [35, 55], [0, 20], [50, 60]], "s": [65, 95], "l": [48, 74], "d": "Sunny yellows, sea blues and warm coral that feel bright and relaxed.", "u": "Beach and travel content, summer sales, festivals, drinks and ice cream brands", "cur": [["Beach Day", ["#FEF3C7", "#FCD34D", "#38BDF8", "#0EA5E9", "#F97316"]], ["Citrus Splash", ["#FFF7ED", "#FDBA74", "#FACC15", "#34D399", "#06B6D4"]], ["Sunny Pool", ["#ECFEFF", "#67E8F9", "#22D3EE", "#FDE047", "#FB7185"]]]}, "autumn": {"label": "Autumn", "hues": [[15, 45], [60, 90], [0, 12]], "s": [40, 75], "l": [22, 62], "d": "Rust, amber, olive and deep brown that feel warm, cozy and grounded.", "u": "Autumn fashion, harvest and festive designs, cafes, home decor, cozy brands", "cur": [["Harvest", ["#FEF3C7", "#F59E0B", "#B45309", "#7C2D12", "#365314"]], ["Fallen Leaves", ["#FFEDD5", "#FB923C", "#C2410C", "#78350F", "#4D7C0F"]], ["Cozy Cabin", ["#FAF5E6", "#D6A56B", "#A0522D", "#6B3E26", "#3A2A1E"]]]}, "winter": {"label": "Winter", "hues": [[200, 250], [340, 360], [130, 160]], "s": [20, 65], "l": [14, 64], "neutral": 1, "d": "Icy blues, deep pine, berry red and crisp white that feel cool and calm.", "u": "Winter campaigns, holiday cards, knitwear, cozy interiors, year-end reports", "cur": [["Frost", ["#F8FAFC", "#E2E8F0", "#93C5FD", "#3B82F6", "#1E3A8A"]], ["Pine and Berry", ["#F1F5F9", "#166534", "#14532D", "#BE123C", "#7F1D1D"]], ["Snowy Night", ["#0F172A", "#1E293B", "#475569", "#CBD5E1", "#F8FAFC"]]]}};
let season="spring",SETS=[];
function gen(P,n){const out=[];
for(let i=0;i<n;i++){const r=P.hues[Math.floor(Math.random()*P.hues.length)];const l=P.l[0]+(P.l[1]-P.l[0])*(i/(n-1))+rnd(-4,4);out.push([rnd(r[0],r[1]),rnd(P.s[0],P.s[1]),Math.max(6,Math.min(96,l))])}
if(P.neutral){const k=Math.floor(rnd(1,n-1));out[k]=[out[k][0],rnd(5,14),rnd(92,97)]}
return out.map(c=>hex(c[0],c[1],c[2]))}
function row(name,cols,key,i){return'<article class="prow"><div class="pstrip">'+cols.map(c=>'<button type="button" style="background:'+c+';color:'+ink(c)+'" data-copy="'+c+'" aria-label="Copy '+c+'">'+c+'</button>').join("")+'</div><div class="pfoot"><small>'+name+'</small><div class="pa"><button type="button" class="btn sm" data-all="'+key+i+'">Copy all</button><button type="button" class="btn sm" data-png="'+key+i+'">PNG</button></div></div></article>'}
const get=k=>k[0]==="c"?SE[season].cur[+k.slice(1)][1]:SETS[+k.slice(1)];
function render(){const s=SE[season];$("sn").textContent=s.label;$("sd").textContent=s.d;$("su").textContent=s.u;
$("cur").innerHTML=s.cur.map((p,i)=>row(p[0],p[1],"c",i)).join("");
$("rows").innerHTML=SETS.map((p,i)=>row("Idea "+(i+1),p,"g",i)).join("");try{history.replaceState(null,"","#"+season)}catch(e){}}
function make(){SETS=[0,1,2].map(()=>gen(SE[season],5));render()}
document.addEventListener("click",e=>{const a=e.target.closest("[data-all]"),p=e.target.closest("[data-png]"),m=e.target.closest("[data-s]");
if(a)copy(get(a.dataset.all).join(", "),"Palette copied");
if(p)pngOf(get(p.dataset.png),season+"-palette.png");
if(m){season=m.dataset.s;document.querySelectorAll("[data-s]").forEach(b=>b.setAttribute("aria-pressed",b===m));make()}});
$("gen").onclick=make;
(function(){const h=location.hash.slice(1);if(SE[h]){season=h;document.querySelectorAll("[data-s]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.s===h))}make()})();
