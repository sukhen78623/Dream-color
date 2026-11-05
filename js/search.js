/* ===== SEARCH ===== */
const STOP=new Set("palette palettes color colors colour colours combination combinations scheme schemes for the a an and of in ideas".split(" "));
const stem=w=>w.replace(/s$/,"");
function find(q){const t=q.toLowerCase().split(/[^a-z0-9-]+/).filter(w=>w&&!STOP.has(w)).map(stem);if(!t.length)return P;
 return P.map(p=>{const hay=(p.cat+" "+p.name+" "+p.tags+" "+p.desc).toLowerCase().replace(/s\b/g,"");
  const sc=t.reduce((n,w)=>n+(hay.includes(w)?1:0),0);return{p,sc}}).filter(x=>x.sc).sort((a,b)=>b.sc-a.sc).map(x=>x.p)}
function doSearch(){const q=$("#q").value.trim(),box=$("#sRes");box.innerHTML="";if(!q)return;
 const r=find(q);if(!r.length){box.innerHTML=`<div class="empty"><div style="font-size:2rem">🎨</div><h3>No palettes found for “${q.replace(/[<>&]/g,"")}”</h3><p>Try a style or purpose like “pastel”, “wedding” or “website”.</p></div>`;return}
 r.slice(0,8).forEach(p=>box.appendChild(palCard(p)))}
const openS=()=>{$("#srch").hidden=false;$("#q").focus();document.body.style.overflow="hidden"};
const closeS=()=>{$("#srch").hidden=true;document.body.style.overflow=""};
$("#sBtn").onclick=openS;$("#sx").onclick=closeS;$("#q").oninput=doSearch;
document.addEventListener("keydown",e=>{if(e.key=="Escape")closeS();if((e.metaKey||e.ctrlKey)&&e.key=="k"){e.preventDefault();openS()}});
const setQ=q=>{$("#q").value=q;doSearch()};
$("#sChips").innerHTML=EX.map(x=>`<button class="chip">${x}</button>`).join("");
$("#sChips").onclick=e=>{if(e.target.classList.contains("chip"))setQ(e.target.textContent)};
