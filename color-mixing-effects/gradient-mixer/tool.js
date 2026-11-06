/* Gradient Mixer: runs fully in the browser, nothing is uploaded */
const $=id=>document.getElementById(id);
const PRESETS=[["Sunset","linear",135,[["#F59E0B",0],["#EF4444",50],["#7C3AED",100]]],
["Ocean","linear",120,[["#06B6D4",0],["#3B82F6",55],["#6366F1",100]]],
["Aurora","linear",160,[["#10B981",0],["#06B6D4",50],["#8B5CF6",100]]],
["Candy","linear",90,[["#F472B6",0],["#FB923C",100]]],
["Mint","linear",135,[["#34D399",0],["#3B82F6",100]]],
["Fire","linear",180,[["#FACC15",0],["#F97316",50],["#DC2626",100]]],
["Dream","linear",135,[["#4F2FE0",0],["#C026D3",35],["#F43F5E",70],["#F59E0B",100]]],
["Midnight","radial",0,[["#4F46E5",0],["#1E1B4B",70],["#0F172A",100]]]];
const S={type:"linear",angle:135,stops:[]};
const hexOk=v=>/^#?[0-9a-f]{6}$/i.test(v.trim());
const norm=v=>("#"+v.trim().replace("#","")).toUpperCase();
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),1700)}
function copy(txt,msg){const ok=()=>toast(msg||"Copied");
const fb=()=>{const a=document.createElement("textarea");a.value=txt;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Copy not supported")}a.remove()};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,fb);else fb()}
const sorted=()=>S.stops.slice().sort((a,b)=>a.p-b.p);
function grad(){const st=sorted().map(s=>s.c+" "+s.p+"%").join(", ");
return S.type==="linear"?"linear-gradient("+S.angle+"deg, "+st+")":S.type==="radial"?"radial-gradient(circle at center, "+st+")":"conic-gradient(from "+S.angle+"deg at 50% 50%, "+st+")"}
function update(){const g=grad();$("prev").style.background=g;
$("code").textContent="background: "+sorted()[0].c+";\nbackground: "+g+";";
$("angleRow").hidden=S.type==="radial";$("angleVal").textContent=S.angle+"°";$("angle").value=S.angle;
document.querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===S.type));
$("add").disabled=S.stops.length>=6}
function rows(){const box=$("stops");box.innerHTML="";
S.stops.forEach((s,i)=>{const r=document.createElement("div");r.className="stop";
r.innerHTML='<input type="color" aria-label="Color '+(i+1)+'" value="'+s.c+'"><input class="hx" type="text" aria-label="HEX value of color '+(i+1)+'" value="'+s.c+'" maxlength="7" spellcheck="false"><input type="range" aria-label="Position of color '+(i+1)+'" min="0" max="100" value="'+s.p+'"><output>'+s.p+'%</output><button type="button" class="ic" aria-label="Remove color '+(i+1)+'" '+(S.stops.length<=2?"disabled":"")+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
const [pick,hx,pos,out,del]=r.children;
pick.oninput=()=>{s.c=pick.value.toUpperCase();hx.value=s.c;update()};
hx.onchange=()=>{if(hexOk(hx.value)){s.c=norm(hx.value);pick.value=s.c;hx.value=s.c;update()}else hx.value=s.c};
pos.oninput=()=>{s.p=+pos.value;out.textContent=s.p+"%";update()};
del.onclick=()=>{S.stops.splice(i,1);rows();update()};
box.appendChild(r)})}
const hex=(h,s,l)=>{h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return"#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()};
function load(type,angle,list){S.type=type;S.angle=angle;S.stops=list.map(([c,p])=>({c,p}));rows();update()}
$("add").onclick=()=>{if(S.stops.length>=6)return;const a=sorted();const last=a[a.length-1];const prev=a[a.length-2]||last;
S.stops.push({c:last.c,p:Math.min(100,Math.round((last.p+prev.p)/2)||50)});rows();update()};
$("rev").onclick=()=>{S.stops.forEach(s=>s.p=100-s.p);rows();update()};
$("rnd").onclick=()=>{const n=2+Math.floor(Math.random()*3),h=Math.floor(Math.random()*360),st=[];
for(let i=0;i<n;i++)st.push([hex(h+i*(40+Math.random()*50),70+Math.random()*20,48+Math.random()*14),Math.round(i*100/(n-1))]);
load(S.type,Math.floor(Math.random()*12)*30,st)};
document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.type=b.dataset.t;update()});
$("angle").oninput=e=>{S.angle=+e.target.value;update()};
$("copy").onclick=()=>copy($("code").textContent,"CSS copied");
$("png").onclick=()=>{const w=1600,h=900,c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),cx=w/2,cy=h/2;let g;
if(S.type==="radial")g=x.createRadialGradient(cx,cy,0,cx,cy,Math.hypot(cx,cy));
else if(S.type==="conic"&&x.createConicGradient)g=x.createConicGradient((S.angle-90)*Math.PI/180,cx,cy);
else{const a=S.angle*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),len=Math.abs(w*dx)+Math.abs(h*dy);g=x.createLinearGradient(cx-dx*len/2,cy-dy*len/2,cx+dx*len/2,cy+dy*len/2)}
sorted().forEach(s=>g.addColorStop(s.p/100,s.c));x.fillStyle=g;x.fillRect(0,0,w,h);
c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="gradient.png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("PNG downloaded")})};
$("presets").innerHTML=PRESETS.map((p,i)=>'<button type="button" data-p="'+i+'" aria-label="Use '+p[0]+' preset" title="'+p[0]+'" style="background:linear-gradient(135deg,'+p[3].map(s=>s[0]+" "+s[1]+"%").join(",")+')"></button>').join("");
$("presets").onclick=e=>{const b=e.target.closest("[data-p]");if(b){const p=PRESETS[b.dataset.p];load(p[1],p[2],p[3])}};
load("linear",135,[["#7C3AED",0],["#EC4899",55],["#F59E0B",100]]);
