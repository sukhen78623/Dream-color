/* Color of the Day: one deterministic color per calendar date */
const $=id=>document.getElementById(id);
const COL=[
["Crimson","#DC143C","A deep, intense red with a touch of blue that feels bold and passionate.","Passion, courage, determination, love","Anger, aggression, danger","Sale banners, bold call-to-action buttons, fashion, food and entertainment brands"],
["Vermilion","#E34234","A vivid orange-red that radiates energy and warmth.","Energy, excitement, enthusiasm, warmth","Urgency, impatience, alarm","Promotions, food packaging, sports and event posters, attention-grabbing accents"],
["Tangerine","#F28500","A juicy, bright orange that feels friendly and lively.","Enthusiasm, creativity, optimism, appetite","Impulsiveness, restlessness","Youth brands, food and beverage, buttons that invite action, playful illustrations"],
["Amber","#E0A100","A warm golden-orange, like glowing light and caution signals.","Warmth, confidence, optimism, clarity","Caution, warning, impatience","Highlights, notice badges, autumn themes, warm accents in interfaces"],
["Saffron","#F4C430","A rich golden yellow with a festive, royal feel.","Prosperity, joy, energy, tradition","Overwhelm if overused, anxiety","Festive and cultural designs, food brands, highlights, premium accents"],
["Lemon","#F2D43D","A fresh, bright yellow that grabs attention instantly.","Cheer, happiness, freshness, curiosity","Eye strain and anxiety in large amounts","Highlighters, signage, kids' products, playful branding, small accents"],
["Lime","#8BC34A","A lively yellow-green that feels fresh and youthful.","Freshness, growth, vitality, playfulness","Immaturity, an artificial feel","Health and fitness, eco brands, tech startups, fresh accents on dark backgrounds"],
["Emerald","#2EB872","A vivid, jewel-like green that suggests growth and prosperity.","Growth, balance, renewal, wealth","Envy, greed","Finance, wellness, sustainability brands, success states in interfaces"],
["Jade","#00A86B","A calm, balanced green with a soothing, natural tone.","Harmony, health, luck, calm","Stagnation, over-caution","Wellness, spas, organic products, success and confirmation messages"],
["Forest","#228B22","A deep natural green that feels grounded and stable.","Nature, stability, security, endurance","Rigidity, dullness","Outdoor and nature brands, finance, eco packaging, premium backgrounds"],
["Teal","#008080","A blue-green balance of calm and clarity.","Clarity, calm, focus, sophistication","Coldness, distance","Healthcare, tech, spas, corporate brands, calm dashboards"],
["Turquoise","#30B5C8","A bright, refreshing aqua that evokes clear water.","Refreshment, creativity, communication, serenity","Detachment, an over-cool tone","Travel and beach brands, wellness, creative tools, summer designs"],
["Sky","#4DA8DA","A light, open blue that feels airy and friendly.","Openness, freedom, calm, optimism","Naivety, lack of depth","Backgrounds, travel, weather and cloud services, friendly interfaces"],
["Azure","#007FFF","A clear, bright blue that feels modern and dependable.","Trust, clarity, confidence, technology","Coldness, impersonality","Software and apps, links and primary buttons, banking, tech brands"],
["Cobalt","#0047AB","A deep, strong blue that signals authority.","Reliability, professionalism, depth, stability","Sadness, severity","Corporate and finance, legal, headers and navigation, serious brands"],
["Navy","#1F3A93","A dark, formal blue that feels established and serious.","Trust, authority, loyalty, intelligence","Coldness, conservatism","Corporate branding, uniforms, text on light backgrounds, premium dark themes"],
["Indigo","#4B2C9E","A deep blue-violet between calm and imagination.","Intuition, depth, wisdom, creativity","Moodiness, introspection","Night themes, creative tools, education, premium digital products"],
["Violet","#8F00FF","A vivid, electric purple full of energy and imagination.","Creativity, imagination, inspiration, uniqueness","Extravagance, unreality","Creative tools, gaming, entertainment, bold gradients"],
["Lavender","#B57EDC","A soft purple that feels gentle and relaxing.","Calm, grace, nostalgia, romance","Sentimentality, immaturity","Beauty, wellness, sleep and relaxation, soft backgrounds"],
["Orchid","#DA70D6","A playful pink-purple with a floral, expressive feel.","Creativity, charm, femininity, playfulness","Frivolity, superficiality","Fashion, beauty, party and celebration designs, creative accents"],
["Magenta","#D6249F","A bold pink-purple that looks vibrant and daring.","Boldness, creativity, compassion, energy","Overwhelming intensity","Brand accents, social media, fashion, gradients, standout buttons"],
["Rose","#FF3D81","A lively, energetic pink with romantic warmth.","Love, care, joy, playfulness","Naivety, fragility","Beauty, lifestyle, celebrations, social content, call-outs"],
["Coral","#FF7F50","A warm pink-orange that feels friendly and sunny.","Warmth, friendliness, optimism, vitality","Superficiality, over-sweetness","Lifestyle brands, summer designs, friendly buttons, hospitality"],
["Salmon","#FA8072","A soft orange-pink with a gentle, welcoming warmth.","Comfort, approachability, warmth, kindness","Blandness, over-softness","Food, interiors, wellness, soft backgrounds and cards"],
["Peach","#FFB38A","A gentle, creamy orange that feels soft and inviting.","Gentleness, friendliness, comfort, sweetness","Lack of impact, timidity","Beauty, baby and kids' products, soft interface backgrounds, cozy themes"],
["Terracotta","#E2725B","An earthy clay-orange that feels warm and handmade.","Warmth, groundedness, craft, comfort","Heaviness, dryness","Interiors, ceramics, handmade brands, earthy palettes, cafes"],
["Burgundy","#800020","A deep wine red that suggests richness and refinement.","Elegance, sophistication, ambition, luxury","Heaviness, seriousness","Luxury and wine brands, formal events, fashion, rich dark backgrounds"],
["Plum","#8E4585","A muted reddish purple that feels refined and mysterious.","Sophistication, creativity, individuality, depth","Moodiness, secrecy","Beauty, boutique brands, interiors, elegant accents"],
["Mustard","#E1AD01","An earthy, deep yellow with a retro, warm character.","Warmth, optimism, confidence, vintage charm","Caution, dullness when muddy","Retro designs, fashion, interiors, accents on neutral palettes"],
["Seafoam","#5FD3A5","A light blue-green that feels fresh and soothing.","Calm, freshness, healing, balance","Blandness, coolness","Wellness, skincare, mobile apps, calm and clean interfaces"]];
const IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("s"),1700)}
function copy(txt){const ok=()=>toast("Copied "+txt);
const fb=()=>{const a=document.createElement("textarea");a.value=txt;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Copy not supported")}a.remove()};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,fb);else fb()}
document.addEventListener("click",e=>{const c=e.target.closest("[data-copy]");if(c)copy(c.dataset.copy)});
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function hsl(h){const[r,g,b]=rgb(h).map(v=>v/255),M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m,L=(M+m)/2,S=d?d/(1-Math.abs(2*L-1)):0;let H=0;
if(d){H=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;H*=60;if(H<0)H+=360}return[Math.round(H),Math.round(S*100),Math.round(L*100)]}
function hex([h,s,l]){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return"#"+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("").toUpperCase()}
const ink=h=>{const[r,g,b]=rgb(h);return(r*299+g*587+b*114)/1000>150?"#0c0b1a":"#fff"};
(function(){
const d=new Date(),dn=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5),C=COL[(dn*7)%COL.length],cx=C[1],R=rgb(cx),Hs=hsl(cx);
const RGB="rgb("+R.join(", ")+")",HSL="hsl("+Hs[0]+", "+Hs[1]+"%, "+Hs[2]+"%)";
const big=$("codBig");big.style.background=cx;big.style.color=ink(cx);big.style.textShadow="none";$("codName").textContent=C[0];$("codHex").textContent=cx;
const cr=(l,v)=>'<div class="row"><small>'+l+"</small><code>"+v+'</code><button class="ic" type="button" aria-label="Copy '+l+' value" data-copy="'+v+'">'+IC+"</button></div>";
$("codVals").innerHTML=cr("HEX",cx)+cr("RGB",RGB)+cr("HSL",HSL);
$("codM").textContent=C[2];$("codP").textContent=C[3]+".";$("codN").textContent=C[4]+". Meanings vary by culture and context.";$("codU").textContent=C[5]+".";
$("codC").innerHTML=[["Complement",180],["Analogous",30],["Analogous",-30],["Triadic",120]].map(([n,o])=>{const x=hex([Hs[0]+o,Hs[1],Hs[2]]);return'<button type="button" style="background:'+x+';color:'+ink(x)+'" data-copy="'+x+'" aria-label="Copy '+n+' color '+x+'">'+n+"<br>"+x+"</button>"}).join("");
})();
