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

let COLORS=[],PTS=[],imgUrl=null;
const prev=$("prev"),drop=$("drop"),cv=$("cv");
function kmeans(P,k){if(!P.length)return[];k=Math.min(k,P.length);let seed=7;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
let C=[P[Math.floor(rand()*P.length)].slice()];
while(C.length<k){const D=P.map(p=>Math.min(...C.map(c=>d2(p,c))));const sum=D.reduce((a,b)=>a+b,0);if(!sum)break;let r=rand()*sum,i=0;for(;i<P.length-1;i++){r-=D[i];if(r<=0)break}C.push(P[i].slice())}
const asg=new Array(P.length).fill(0);
for(let it=0;it<14;it++){let ch=false;P.forEach((p,i)=>{let b=0,bd=1e9;C.forEach((c,j)=>{const d=d2(p,c);if(d<bd){bd=d;b=j}});if(asg[i]!==b){asg[i]=b;ch=true}});
const S=C.map(()=>[0,0,0,0]);P.forEach((p,i)=>{const s=S[asg[i]];s[0]+=p[0];s[1]+=p[1];s[2]+=p[2];s[3]++});
C=C.map((c,j)=>S[j][3]?[S[j][0]/S[j][3],S[j][1]/S[j][3],S[j][2]/S[j][3]]:c);if(!ch)break}
const cnt=C.map(()=>0);asg.forEach(a=>cnt[a]++);
return C.map((c,j)=>({hex:"#"+c.map(v=>Math.round(v).toString(16).padStart(2,"0")).join("").toUpperCase(),share:cnt[j]/P.length})).filter(x=>x.share>0).sort((a,b)=>b.share-a.share)}
function analyse(im){const max=110,sc=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.max(1,Math.round(im.naturalWidth*sc)),h=Math.max(1,Math.round(im.naturalHeight*sc));
cv.width=w;cv.height=h;const x=cv.getContext("2d",{willReadFrequently:true});x.drawImage(im,0,0,w,h);const d=x.getImageData(0,0,w,h).data;PTS=[];
for(let i=0;i<d.length;i+=4)if(d[i+3]>125)PTS.push([d[i],d[i+1],d[i+2]]);run()}
function run(){COLORS=kmeans(PTS,+$("count").value);if(!COLORS.length){toast("No visible colors found in that image");return}render()}
function render(){$("res").hidden=false;
$("strip").innerHTML=COLORS.map(c=>'<i style="width:'+(c.share*100).toFixed(2)+'%;background:'+c.hex+'" title="'+c.hex+'"></i>').join("");
$("cards").innerHTML=COLORS.map(c=>{const r=rgb(c.hex);return'<article class="xc"><button type="button" class="xs" style="background:'+c.hex+';color:'+ink(c.hex)+'" data-copy="'+c.hex+'" aria-label="Copy '+c.hex+'"><small>'+(c.share<.005?"<1":Math.round(c.share*100))+'%</small><b>'+c.hex+'</b></button><div class="xv">rgb('+r.join(", ")+')</div></article>'}).join("");out()}
function out(){const v=COLORS.map(c=>c.hex),f=$("fmt").value;$("code").textContent=f==="hex"?v.join(", "):f==="css"?":root {\n"+v.map((c,i)=>"  --color-"+(i+1)+": "+c+";").join("\n")+"\n}":'["'+v.join('", "')+'"]'}
function load(src){const im=new Image();im.onload=()=>{prev.src=src;prev.hidden=false;$("dzt").hidden=true;drop.classList.add("has");analyse(im)};im.onerror=()=>toast("Could not read that image");im.src=src}
function loadFile(f){if(!f||!/^image\//.test(f.type)){toast("Please choose an image file");return}if(imgUrl)URL.revokeObjectURL(imgUrl);imgUrl=URL.createObjectURL(f);load(imgUrl)}
$("file").onchange=e=>{loadFile(e.target.files[0]);e.target.value=""};
["dragenter","dragover"].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add("over")}));
["dragleave","drop"].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove("over")}));
drop.addEventListener("drop",e=>loadFile(e.dataTransfer.files[0]));
document.addEventListener("paste",e=>{const it=[...(e.clipboardData?e.clipboardData.items:[])].find(i=>i.type.startsWith("image/"));if(it)loadFile(it.getAsFile())});
$("count").onchange=()=>{if(PTS.length)run()};
$("fmt").onchange=out;
$("copy").onclick=()=>copy($("code").textContent,"Palette copied");
$("png").onclick=()=>pngOf(COLORS.map(c=>c.hex),"image-palette.png",COLORS.map(c=>Math.round(c.share*100)+"%"),COLORS.map(c=>Math.max(c.share,.08)));
$("sample").onclick=()=>{const c=document.createElement("canvas");c.width=640;c.height=420;const x=c.getContext("2d");
let g=x.createLinearGradient(0,0,0,420);g.addColorStop(0,"#1e3a8a");g.addColorStop(.45,"#f97316");g.addColorStop(.7,"#fde68a");g.addColorStop(1,"#fde68a");x.fillStyle=g;x.fillRect(0,0,640,420);
x.fillStyle="#fff7ed";x.beginPath();x.arc(450,210,58,0,7);x.fill();
x.fillStyle="#7c2d12";x.beginPath();x.moveTo(0,420);x.lineTo(0,300);x.lineTo(150,210);x.lineTo(300,320);x.lineTo(430,250);x.lineTo(640,340);x.lineTo(640,420);x.fill();
x.fillStyle="#1f2937";x.beginPath();x.moveTo(0,420);x.lineTo(0,360);x.lineTo(180,310);x.lineTo(360,370);x.lineTo(520,330);x.lineTo(640,380);x.lineTo(640,420);x.fill();
x.fillStyle="#10b981";x.fillRect(0,395,640,25);
c.toBlob(b=>loadFile(new File([b],"sample.png",{type:"image/png"})))};
