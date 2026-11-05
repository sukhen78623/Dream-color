/* ===== COLOR OF THE DAY ===== */
(()=>{const d=new Date(),n=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
 const[nm,hex,desc,pos,neg,sci]=CD[n%CD.length],[r,g,b]=rgb(hex),[h,s,l]=hsl(hex);
 const dark=(r*299+g*587+b*114)/1000<150,vals=[hex,`rgb(${r}, ${g}, ${b})`,`hsl(${h}, ${s}%, ${l}%)`];
 $("#cotdBox").innerHTML=`<div class="sw" style="background:${hex};color:${dark?"#fff":"#111"}"><b style="font-size:.85rem;letter-spacing:.1em">${d.toLocaleDateString(undefined,{month:"long",day:"numeric"}).toUpperCase()}</b></div>
 <div class="body"><h3>${nm}</h3><p>${desc}</p>
 <div class="codes">${vals.map(v=>`<button class="code" data-c="${v}" aria-label="Copy ${v}">${v.toUpperCase().replace("RGB","rgb").replace("HSL","hsl")} ⧉</button>`).join("")}</div>
 <div class="cols"><div><b>Positive associations</b>${pos}</div><div><b>Possible negatives</b>${neg}</div>
 <div class="full"><b>Science &amp; psychology</b>${sci}</div></div>
 <p class="note">Color science (wavelengths, how eyes see) is well established. Emotional associations are tendencies that vary by culture and person.</p></div>`;
 document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>copy(b.dataset.c));})();

/* ===== TOOLS ===== */
(()=>{const B="#6D4AFF",[h,s,l]=hsl(B),[r,g,b]=rgb(B);
 const sw=a=>a.map(c=>`<i style="background:${c}"></i>`).join("");
 const T=[
 ["Color Palette Generator","Generate beautiful color combinations from a selected base color.",`<div class="pv">${sw([hs(h,s,92),hs(h-30,s,70),B,hs(h+30,s,55),hs(h+180,s-20,45)])}</div>`],
 ["Palette Presets","Explore ready-made color combinations for different purposes and styles.",`<div class="pv col">${[0,6,14].map(i=>`<div class="bar" style="height:22px;border-radius:6px;overflow:hidden">${sw(P[i].cols)}</div>`).join("")}</div>`],
 ["Image Picker","Upload or select an image and extract its dominant colors to create a palette.",`<div class="pv" style="border:2px dashed var(--bd);flex-direction:column;gap:6px"><span style="font-size:1.3rem">🖼️</span><span style="display:flex;gap:6px">${["#E26D8C","#FFD8A8","#5E7F4A","#2A8C9A"].map(c=>`<i style="flex:none;width:18px;height:18px;border-radius:50%;background:${c}"></i>`).join("")}</span></div>`],
 ["Gradient Mixer","Create and customize beautiful gradients using multiple colors.",`<div class="pv"><i style="background:linear-gradient(90deg,#FF8FAB,#7AA2FF,#5EEAD4)"></i></div>`],
 ["HEX, RGB & HSL Converter","Convert colors between HEX, RGB, and HSL formats.",`<div class="pv col" style="font:600 .78rem ui-monospace,monospace;justify-content:center"><span>HEX ${B}</span><span>RGB ${r}, ${g}, ${b}</span><span>HSL ${h}°, ${s}%, ${l}%</span></div>`]];
 $("#toolGrid").innerHTML=T.map((t,i)=>`<article class="card tool"><span class="tag">Tool 0${i+1}</span>${t[2]}<h3>${t[0].replace("&","&amp;")}</h3><p>${t[1]}</p></article>`).join("")+`<article class="card tool" style="border-style:dashed;box-shadow:none"><span class="tag">Coming soon</span><div class="pv" style="font-size:2rem">✨</div><h3>More tools on the way</h3><p>Dream Color keeps growing. New color tools will appear here.</p></article>`;})();

/* ===== PRESETS ===== */
let cat="All";
function renderPal(){const g=$("#palGrid");g.innerHTML="";P.filter(p=>cat=="All"||p.cat==cat).forEach(p=>g.appendChild(palCard(p)))}
function renderCats(){$("#catChips").innerHTML=["All",...FC].map(c=>`<button class="chip" aria-pressed="${c==cat}" data-k="${c}">${c=="All"?"All":c+" Palettes"}</button>`).join("");
 document.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{cat=b.dataset.k;renderCats();renderPal()})}
renderCats();renderPal();
document.addEventListener("click",e=>{const a=e.target.closest("[data-cat]");if(a){cat=a.dataset.cat;renderCats();renderPal()}});

/* ===== FAQ + structured data ===== */
$("#faqList").innerHTML=FQ.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");
const ld=document.createElement("script");ld.type="application/ld+json";
ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:FQ.map(f=>({"@type":"Question",name:f[0],acceptedAnswer:{"@type":"Answer",text:f[1]}}))});
document.head.appendChild(ld);


/* ===== HERO CHIPS ===== */
$("#heroChips").innerHTML=EX.slice(0,4).map(x=>`<button class="chip">${x}</button>`).join("");
$("#heroChips").onclick=e=>{if(e.target.classList.contains("chip")){openS();setQ(e.target.textContent)}};
