
const CALCULATORS = {
  isup: {
    title:"ISUP / Gleason deep-dive — prostate",
    desc:"Oracle-grade interpretation, including tertiary pattern logic. This is intentionally separate from treatment calculation.",
    html:()=>`
      <div class="grid md:grid-cols-2 gap-2">
        <select id="igPrimary" class="border rounded-xl p-3 text-sm"><option value="">Primary pattern</option><option>3</option><option>4</option><option>5</option></select>
        <select id="igSecondary" class="border rounded-xl p-3 text-sm"><option value="">Secondary pattern</option><option>3</option><option>4</option><option>5</option></select>
        <select id="igTertiary" class="border rounded-xl p-3 text-sm"><option value="">Tertiary pattern (if RP)</option><option>None</option><option>5</option></select>
        <input id="igP4" type="number" min="0" max="100" class="border rounded-xl p-3 text-sm" placeholder="% pattern 4">
      </div>
      <label class="flex items-center gap-2 text-xs mt-3"><input id="igIDC" type="checkbox"> Cribriform / intraductal carcinoma reported</label>
      <button onclick="calcISUPDeep()" class="mt-3 w-full rounded-xl py-3 bg-sky-700 text-white text-sm font-black">Interpret</button>
      <div id="isupOut" class="mt-3"></div>`
  },
  psad:{title:"PSA density",desc:"PSA (ng/mL) ÷ prostate volume (cc).",html:()=>`
      <div class="grid grid-cols-2 gap-2"><input id="psa" type="number" step="0.01" class="border rounded-xl p-3 text-sm" placeholder="PSA"><input id="vol" type="number" step="0.1" class="border rounded-xl p-3 text-sm" placeholder="Volume (cc)"></div>
      <button onclick="calcPSAD()" class="mt-3 w-full rounded-xl py-3 bg-sky-700 text-white text-sm font-black">Calculate</button><div id="psadOut" class="mt-3"></div>`},
  eortc:{title:"EORTC 2006 NMIBC risk",desc:"Historic model for recurrence/progression; use WHO 1973 grade and do not confuse it with the current EAU 4-group risk classification.",html:()=>`
    <div class="grid md:grid-cols-2 gap-2">
      <select id="erTumors" class="border rounded-xl p-3 text-sm"><option value="0">1 tumor</option><option value="3">2–7 tumors</option><option value="6">≥8 tumors</option></select>
      <select id="erSize" class="border rounded-xl p-3 text-sm"><option value="0">&lt;3 cm</option><option value="3">≥3 cm</option></select>
      <select id="erRec" class="border rounded-xl p-3 text-sm"><option value="0">Primary</option><option value="2">&lt;1 recurrence/year</option><option value="4">≥1 recurrence/year</option></select>
      <select id="erT" class="border rounded-xl p-3 text-sm"><option value="0">Ta</option><option value="1">T1</option></select>
      <select id="erCIS" class="border rounded-xl p-3 text-sm"><option value="0">No CIS</option><option value="1">CIS present</option></select>
      <select id="erG" class="border rounded-xl p-3 text-sm"><option value="0">G1</option><option value="1">G2</option><option value="2">G3</option></select>
    </div>
    <button onclick="calcEORTC()" class="mt-3 w-full rounded-xl py-3 bg-indigo-700 text-white text-sm font-black">Calculate recurrence + progression score</button><div id="eortcOut" class="mt-3"></div>`},
  eaurisk:{title:"EAU NMIBC four-group risk calculator (2021 model, retained in EAU 2026)",desc:"Implements the published EAU four-group clinical risk rules.",html:()=>`
    <div class="grid md:grid-cols-2 gap-2">
      <select id="erxStage" class="border rounded-xl p-3 text-sm"><option value="Ta">Ta</option><option value="T1">T1</option></select>
      <select id="erxGrade" class="border rounded-xl p-3 text-sm"><option value="LG1">LG/G1</option><option value="LG2">LG/G2</option><option value="HG3">HG/G3</option></select>
      <select id="erxStatus" class="border rounded-xl p-3 text-sm"><option value="primary">Primary</option><option value="recurrent">Recurrent</option></select>
      <select id="erxAge" class="border rounded-xl p-3 text-sm"><option value="le70">≤70</option><option value="gt70">&gt;70</option></select>
      <select id="erxMult" class="border rounded-xl p-3 text-sm"><option value="single">Single</option><option value="multi">Multiple</option></select>
      <select id="erxSize" class="border rounded-xl p-3 text-sm"><option value="lt3">&lt;3 cm</option><option value="ge3">≥3 cm</option></select>
    </div>
    <label class="flex items-center gap-2 text-xs mt-3"><input id="erxCIS" type="checkbox"> CIS present</label>
    <label class="flex items-center gap-2 text-xs mt-2"><input id="erxVHI" type="checkbox"> Variant histology / LVI / prostatic urethral CIS</label>
    <button onclick="calcEAURisk()" class="mt-3 w-full rounded-xl py-3 bg-indigo-700 text-white text-sm font-black">Assign EAU risk group</button><div id="eauriskOut" class="mt-3"></div>`},
  imdc:{title:"IMDC RCC metastatic risk",desc:"Six-factor Heng/IMDC model.",html:()=>`
    <div class="grid md:grid-cols-2 gap-2">
      <label class="text-xs"><input id="imdcKPS" type="checkbox"> KPS &lt;80%</label>
      <label class="text-xs"><input id="imdcHb" type="checkbox"> Hb below LLN</label>
      <label class="text-xs"><input id="imdcCa" type="checkbox"> Corrected Ca above ULN</label>
      <label class="text-xs"><input id="imdcNeut" type="checkbox"> Neutrophils above ULN</label>
      <label class="text-xs"><input id="imdcPlate" type="checkbox"> Platelets above ULN</label>
      <label class="text-xs"><input id="imdcTime" type="checkbox"> Diagnosis → systemic therapy &lt;1 year</label>
    </div>
    <button onclick="calcIMDC()" class="mt-3 w-full rounded-xl py-3 bg-emerald-700 text-white text-sm font-black">Calculate</button><div id="imdcOut" class="mt-3"></div>`},
  renal:{title:"RENAL nephrometry score",desc:"Anatomic complexity; A/P/X is a descriptor, not a numeric component.",html:()=>`
    <div class="grid md:grid-cols-2 gap-2">
      <select id="rr" class="border rounded-xl p-3 text-sm"><option value="1">R: ≤4 cm</option><option value="2">R: 4–7 cm</option><option value="3">R: ≥7 cm</option></select>
      <select id="re" class="border rounded-xl p-3 text-sm"><option value="1">E: ≥50% exophytic</option><option value="2">E: &lt;50% exophytic</option><option value="3">E: entirely endophytic</option></select>
      <select id="rn" class="border rounded-xl p-3 text-sm"><option value="1">N: ≥7 mm</option><option value="2">N: 4–7 mm</option><option value="3">N: ≤4 mm</option></select>
      <select id="rl" class="border rounded-xl p-3 text-sm"><option value="1">L: entirely above/below polar line</option><option value="2">L: crosses polar line</option><option value="3">L: >50% crosses / hilar</option></select>
    </div>
    <button onclick="calcRENAL()" class="mt-3 w-full rounded-xl py-3 bg-emerald-700 text-white text-sm font-black">Calculate</button><div id="renalOut" class="mt-3"></div>`},
  gss:{title:"Guy's Stone Score",desc:"PCNL complexity classifier retained as a non-oncology urology tool.",html:()=>`
    <select id="gss" class="border rounded-xl p-3 w-full text-sm"><option value="1">Grade I: solitary mid/lower pole/pelvis, normal anatomy</option><option value="2">Grade II: solitary upper-pole / multiple normal anatomy / solitary abnormal anatomy</option><option value="3">Grade III: multiple abnormal anatomy / diverticulum / partial staghorn</option><option value="4">Grade IV: complete staghorn or spina bifida/SCI</option></select>
    <button onclick="calcGSS()" class="mt-3 w-full rounded-xl py-3 bg-slate-800 text-white text-sm font-black">Interpret</button><div id="gssOut" class="mt-3"></div>`},
  clavien:{title:"Clavien–Dindo",desc:"Postoperative complication grading.",html:()=>`
    <select id="cd" class="border rounded-xl p-3 w-full text-sm">
      <option value="1">I — deviation treated with bedside/pharmacologic measures</option>
      <option value="2">II — pharmacologic treatment beyond permitted grade I</option>
      <option value="3a">IIIa — endoscopic/radiologic/surgical intervention without GA</option>
      <option value="3b">IIIb — intervention under GA</option>
      <option value="4a">IVa — life-threatening, single-organ dysfunction / ICU</option>
      <option value="4b">IVb — multiorgan dysfunction</option>
      <option value="5">V — death</option>
    </select><button onclick="calcClavien()" class="mt-3 w-full rounded-xl py-3 bg-slate-800 text-white text-sm font-black">Classify</button><div id="cdOut" class="mt-3"></div>`}
};

function cardHTML(disease,section,item){
  const [q,a]=item;
  return `<article class="card p-4 searchable" data-search="${esc(disease+' '+section+' '+q+' '+a)}">
    <div class="flex gap-2 items-center mb-2"><span class="badge badge-blue">${esc(disease)}</span><span class="text-[10px] font-bold text-slate-400 uppercase">${esc(section)}</span></div>
    <h3 class="font-black text-sm mb-2">${esc(q)}</h3>
    <div class="text-sm text-slate-700 leading-6">${formatText(a)}</div>
  </article>`;
}
function formatText(t){return t.replace(/\n/g,'<br>');}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function showHome(){
  ["homeView","diseaseView","oracleView","calcView","drugView","trialView","searchView","procedureView"].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add("hidden")});
  document.getElementById("homeView").classList.remove("hidden");
  const gs=document.getElementById("globalSearch"); if(gs)gs.value="";
}
function fmtDate(iso){const d=new Date(iso+'T00:00:00');return isNaN(d)?iso:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
/* V16: every section shows where its content comes from and when it was last reviewed. */
function sourceLine(s){
  if(!s||!s.src||typeof SOURCES==='undefined')return '';
  const links=s.src.map(k=>SOURCES[k]?`<a class="source-link" href="${SOURCES[k].url}" target="_blank" rel="noopener">${esc(SOURCES[k].name)}</a>`:'').filter(Boolean).join(' · ');
  return `<div class="src-line text-[11px] text-slate-500 mt-2"><b>Source:</b> ${links}${s.verified?` — <b>reviewed ${esc(fmtDate(s.verified))}</b>`:''}</div>`;
}
function openDisease(name){
  ["homeView","oracleView","calcView","drugView","trialView","searchView","procedureView"].forEach(id=>document.getElementById(id).classList.add("hidden"));
  document.getElementById("diseaseView").classList.remove("hidden");
  renderDiseaseNav();
  const d=DISEASES[name];
  document.getElementById("diseaseHeader").innerHTML=`<div class="card p-5 mb-4"><div class="flex flex-wrap gap-2 items-center"><span class="text-2xl">${d.emoji}</span><span class="badge badge-green">EAU ${name==='Ca Bladder'?'NMIBC/MIBC 2026':META.guidelineBaseline.EAU[name==='Ca Prostate'?'prostate':name==='Ca Kidney'?'RCC':name==='Ca Penis'?'penis':name==='Ca Testis'?'testis':'UTUC']||'2026'}</span><span class="badge badge-slate">${name.includes('Prostate')?'NCCN '+META.guidelineBaseline.NCCN.prostate:name==='Ca Bladder'?'NCCN '+META.guidelineBaseline.NCCN.bladder:name==='Ca Kidney'?'NCCN '+META.guidelineBaseline.NCCN.kidney:name==='Ca Penis'?'NCCN '+META.guidelineBaseline.NCCN.penile:name==='Ca Testis'?'NCCN '+META.guidelineBaseline.NCCN.testicular:'EAU 2026 baseline'}</span></div><h2 class="text-2xl font-black mt-2">${esc(name)}</h2><div class="text-sm text-slate-500 mt-1">${esc(d.tagline)}</div><div class="flex flex-wrap gap-2 mt-4 no-print"><button type="button" class="px-3 py-2 rounded-lg border bg-white text-xs font-black" onclick="openDiseaseTNM('${name.replace(/'/g,"\'")}')">TNM / classification</button><button type="button" class="px-3 py-2 rounded-lg bg-slate-950 text-white text-xs font-black" onclick="openOracleForDisease('${name.replace(/'/g,"\'")}')">Show treatment plan</button><button type="button" class="px-3 py-2 rounded-lg border bg-white text-xs font-black" onclick="openOnlineAI('${name.replace(/'/g,"\'")}')">Online AI investigation</button></div></div>`;
  const nav=document.getElementById("sectionNav");
  nav.innerHTML=d.sections.map((s,i)=>`<button onclick="document.getElementById('sec-${i}').scrollIntoView({behavior:'smooth',block:'start'})" class="w-full text-left p-2 rounded-lg text-xs font-bold hover:bg-sky-50">${i+1}. ${esc(s.title.replace(/^\d+\.\s*/,''))}</button>`).join("");
  document.getElementById("diseaseContent").innerHTML=d.sections.map((s,i)=>`<section id="sec-${i}" class="mb-4"><div class="text-base font-black mb-2">${esc(s.title)}</div><div class="space-y-3">${s.items.map(it=>cardHTML(name,s.title,it)).join("")}</div>${sourceLine(s)}</section>`).join("");
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderDiseaseNav(){
  const el=document.getElementById("diseaseNav");
  el.innerHTML=Object.keys(DISEASES).map(n=>`<button onclick="openDisease('${n.replace(/'/g,"\\'")}')" class="px-3 py-2 rounded-full border bg-white text-xs font-black hover:bg-sky-50">${DISEASES[n].emoji} ${esc(n)}</button>`).join("");
}
function renderHome(){
  const tools=[
    `<button onclick="openOracle()" class="card p-4 text-left bg-slate-950 text-white"><div class="text-2xl">🧭</div><div class="font-black text-sm mt-2">Clinical Oracle</div><div class="text-xs text-slate-300 mt-1">Enter clinical criteria → treatment pathway</div></button>`,
    `<button onclick="openOnlineAI()" class="card p-4 text-left bg-sky-950 text-white"><div class="text-2xl">🤖</div><div class="font-black text-sm mt-2">Investigation AI</div><div class="text-xs text-slate-300 mt-1">Image + clinical data → interpretation → Oracle</div></button>`,
    `<button onclick="openCalculators()" class="card p-4 text-left"><div class="text-2xl">🧮</div><div class="font-black text-sm mt-2">Scores & calculators</div><div class="text-xs text-slate-500 mt-1">ISUP, EORTC, IMDC, RENAL and more</div></button>`,
    `<button onclick="openDrugs()" class="card p-4 text-left"><div class="text-2xl">💊</div><div class="font-black text-sm mt-2">Drug references</div><div class="text-xs text-slate-500 mt-1">Common doses and schedules with safety checks</div></button>`,
    `<button onclick="openProcedureAtlas()" class="card p-4 text-left"><div class="text-2xl">🛠️</div><div class="font-black text-sm mt-2">Operative Atlas</div><div class="text-xs text-slate-500 mt-1">Steps, anatomy, checkpoints and pitfalls</div></button>`,
    `<button onclick="openTrials()" class="card p-4 text-left"><div class="text-2xl">📚</div><div class="font-black text-sm mt-2">Trials</div><div class="text-xs text-slate-500 mt-1">Landmark trials linked to disease and stage</div></button>`
  ];
  const diseases=Object.keys(DISEASES).map(n=>`<button onclick="openDisease('${n.replace(/'/g,"\\'")}')" class="card p-4 text-left hover:-translate-y-0.5 transition"><div class="text-2xl">${DISEASES[n].emoji}</div><div class="font-black text-sm mt-2">${esc(n)}</div><div class="text-xs text-slate-500 mt-1">${esc(DISEASES[n].tagline)}</div></button>`);
  document.getElementById("diseaseGrid").innerHTML=tools.concat(diseases).join("");
}
function openCalculators(){
  ["homeView","diseaseView","oracleView","drugView","trialView","searchView","procedureView"].forEach(id=>document.getElementById(id).classList.add("hidden"));document.getElementById("calcView").classList.remove("hidden");
  document.getElementById("calcGrid").innerHTML=Object.entries(CALCULATORS).map(([k,v])=>`<article class="card p-4"><h3 class="font-black text-sm">${esc(v.title)}</h3><p class="text-xs text-slate-500 mt-1 mb-3">${esc(v.desc)}</p>${v.html()}</article>`).join("");
}
function openDrugs(){
  ["homeView","diseaseView","oracleView","calcView","trialView","searchView","procedureView"].forEach(id=>document.getElementById(id).classList.add("hidden"));document.getElementById("drugView").classList.remove("hidden");
  document.getElementById("drugGrid").innerHTML=DRUGS.map(d=>`<article class="card p-4"><span class="badge badge-blue">${esc(d[0])}</span><h3 class="font-black text-sm mt-2">${esc(d[1])}</h3><div class="text-xs text-slate-600 leading-5 mt-1">${esc(d[2])}</div></article>`).join("");
}
function openTrials(){
  ["homeView","diseaseView","oracleView","calcView","drugView","searchView","procedureView"].forEach(id=>document.getElementById(id).classList.add("hidden"));document.getElementById("trialView").classList.remove("hidden");
  renderTrialMap();
}
/* V15.13 interactive trial map: filter, search, and tap a trial to see where the app cites it. */
const trialState={area:"All",q:"",open:""};
function trialKeys(name){return String(name).split("/").map(x=>x.toLowerCase().replace(/[\s\-–_]/g,"")).filter(x=>x.length>2);}
function trialCitations(name){
  const keys=trialKeys(name),hits=[],norm=t=>String(t).toLowerCase().replace(/[\s\-–_]/g,"");
  const scan=(disease,sections)=>(sections||[]).forEach(sec=>(/trial/i.test(sec.title)?[]:(sec.items||[])).forEach(([h,txt])=>{const n=norm(h+" "+txt);if(keys.some(k=>n.includes(k)))hits.push({disease,section:sec.title,head:h,text:txt});}));
  Object.entries(DISEASES).forEach(([d,v])=>scan(d,v.sections));
  /* addenda are already merged into DISEASES[d].sections at load, so they are not scanned twice */
  DRUGS.forEach(r=>{if(keys.some(k=>norm(r.join(" ")).includes(k)))hits.push({disease:"Drug library",section:"Protocol / dose library",head:r[0],text:r[1]+" — "+r[2]});});
  return hits;
}
function trialJump(disease,section){
  if(disease==="Drug library"){openDrugs();return;}
  openDisease(disease);
  setTimeout(()=>{const el=[...document.querySelectorAll("#diseaseView h2,#diseaseView h3,#diseaseView .section-title,#diseaseView div")].find(x=>x.childElementCount===0&&(x.innerText||"").trim()===section);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},350);
}
/* Trial detail sheet: used from disease-page "Trials" sections (every listed name is tappable). */
function trialLookup(name){const k=trialKeys(name);return TRIALS.find(t=>trialKeys(t[1]).some(x=>k.includes(x)))||null;}
function showTrialDetail(name){
  document.getElementById("trialSheet")?.remove();
  const t=trialLookup(name),label=t?t[1]:name,cites=trialCitations(label);
  const term=encodeURIComponent(label.split("/")[0]+" trial");
  const back=document.createElement("div");back.id="trialSheet";back.className="no-print";
  back.style.cssText="position:fixed;inset:0;background:rgba(2,6,23,.55);z-index:100003;display:flex;align-items:flex-end;justify-content:center";
  back.innerHTML=`<div class="card p-4" style="width:min(760px,100%);max-height:85vh;overflow:auto;border-radius:18px 18px 0 0;background:#fff;color:#172033">
    <div class="flex items-center gap-2"><h3 class="font-black text-lg">${esc(label)}</h3><button id="trialSheetClose" class="ml-auto px-3 py-1 rounded-lg border border-slate-300 text-sm font-bold">Close</button></div>
    ${t?`<div class="flex gap-2 mt-1"><span class="badge badge-slate">${esc(t[0])}</span><span class="badge badge-blue">${esc(t[3])}</span></div><div class="text-sm mt-3 leading-6"><b>What it tested / result:</b> ${esc(t[2])}</div>`:`<div class="text-sm mt-2 text-slate-600">Not in the trial map yet: shown with every place this app cites it and literature links.</div>`}
    <div class="mt-4 font-bold text-sm">Where this app uses it (${cites.length})</div>
    ${cites.length?cites.slice(0,10).map(c=>`<div class="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-5"><div class="font-bold">${esc(c.disease)} → ${esc(c.section)} · ${esc(c.head)}</div><div class="mt-1">${esc(String(c.text).slice(0,360))}${String(c.text).length>360?"…":""}</div><button class="mt-2 px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold" data-trial-jump="${esc(c.disease)}" data-trial-sec="${esc(c.section)}">Open this section</button></div>`).join(""):`<div class="text-xs text-slate-600 mt-1">Listed for recognition only.</div>`}
    <div class="mt-4 flex flex-wrap gap-2 text-sm"><a class="px-3 py-1 rounded-lg border border-slate-300 font-bold" target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/?term=${term}">PubMed ↗</a><a class="px-3 py-1 rounded-lg border border-slate-300 font-bold" target="_blank" rel="noopener" href="https://clinicaltrials.gov/search?term=${encodeURIComponent(label.split("/")[0])}">ClinicalTrials.gov ↗</a><button class="px-3 py-1 rounded-lg border border-slate-300 font-bold" id="trialSheetMap">Open trial map</button></div></div>`;
  document.body.appendChild(back);
  back.onclick=e=>{if(e.target===back)back.remove();};
  back.querySelector("#trialSheetClose").onclick=()=>back.remove();
  back.querySelector("#trialSheetMap").onclick=()=>{back.remove();trialState.q=label.split("/")[0];trialState.open=t?t[1]:"";openTrials();};
  back.querySelectorAll("[data-trial-jump]").forEach(b=>b.onclick=()=>{back.remove();trialJump(b.dataset.trialJump,b.dataset.trialSec);});
}
function linkifyTrialSections(){
  const root=document.getElementById("diseaseContent");if(!root)return;
  root.querySelectorAll("section[id^=sec-]").forEach(sec=>{
    const title=(sec.firstElementChild?.innerText||"");if(!/trial/i.test(title)||sec.dataset.trialLinked)return;
    sec.dataset.trialLinked="1";
    // One-trial-per-card sections (e.g. UTUC "POUT", Testis): make the card heading tappable when it names a trial.
    const CATEGORY=/^(nmibc|mibc|metastatic|adjuvant|papillary|diagnostics|localized|mhspc|bcr|eau|systemic|guideline|risk-adapted|advanced|de-escalation)/i;
    sec.querySelectorAll("article h3").forEach(h=>{
      const txt=(h.textContent||"").trim();
      if(!txt||CATEGORY.test(txt))return;
      const named=txt.split(/\s*\/\s*/).some(x=>trialLookup(x))||/\d/.test(txt)||/^[A-Z][A-Z0-9-]{2,}\b/.test(txt);
      if(!named)return;
      h.innerHTML=`<button type="button" class="trial-link" data-trial-name="${esc(txt.split(/\s*\/\s*/)[0])}" style="padding:2px 10px;border-radius:999px;border:1px solid #94a3b8;background:#f1f5f9;color:#0f3554;font-weight:800">${esc(txt)} ›</button>`;
    });
    sec.querySelectorAll("*").forEach(el=>{
      if(el.childElementCount||el.closest("button,a,h3,h4,.badge")||el===sec.firstElementChild)return;
      const txt=(el.textContent||"").trim();if(txt.length<12||!/,/.test(txt))return;
      const parts=txt.replace(/\.$/,"").split(/,\s*|;\s*/).map(x=>x.trim()).filter(Boolean);
      if(parts.length<2)return;
      el.innerHTML=parts.map(p=>{const nm=p.replace(/\s*\(.*\)\s*$/,"").replace(/^and\s+/i,"").trim();return `<button type="button" class="trial-link" data-trial-name="${esc(nm)}" style="display:inline;margin:2px 4px 2px 0;padding:2px 8px;border-radius:999px;border:1px solid #94a3b8;background:#f1f5f9;color:#0f3554;font-weight:700;font-size:.92em">${esc(p)}</button>`;}).join("");
    });
  });
}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".trial-link");if(b){e.preventDefault();e.stopPropagation();showTrialDetail(b.dataset.trialName);}},true);
setTimeout(()=>{const root=document.getElementById("diseaseContent");if(root)new MutationObserver(()=>linkifyTrialSections()).observe(root,{childList:true});},0);
function renderTrialMap(){
  const areas=["All",...new Set(TRIALS.map(t=>t[0]))];
  const qn=trialState.q.toLowerCase().trim();
  const list=TRIALS.filter(t=>(trialState.area==="All"||t[0]===trialState.area)&&(!qn||t.join(" ").toLowerCase().includes(qn)));
  const chips=areas.map(a=>`<button class="px-3 py-1 rounded-full text-xs font-bold border ${a===trialState.area?"bg-slate-800 text-white border-slate-800":"bg-white text-slate-700 border-slate-300"}" data-trial-area="${esc(a)}">${esc(a)} (${a==="All"?TRIALS.length:TRIALS.filter(t=>t[0]===a).length})</button>`).join(" ");
  const cards=list.map(t=>{
    const isOpen=trialState.open===t[1];
    let body="";
    if(isOpen){
      const cites=trialCitations(t[1]);
      const term=encodeURIComponent(t[1].split("/")[0]+" trial");
      body=`<div class="mt-3 pt-3 border-t border-slate-200 text-xs leading-5">
        <div><b>What it tested / result:</b> ${esc(t[2])}</div>
        <div class="mt-1"><b>Disease setting:</b> ${esc(t[3])}</div>
        <div class="mt-3 font-bold">Where this app uses it (${cites.length})</div>
        ${cites.length?cites.slice(0,8).map(c=>`<div class="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200"><div class="font-bold">${esc(c.disease)} → ${esc(c.section)} · ${esc(c.head)}</div><div class="mt-1">${esc(String(c.text).slice(0,320))}${String(c.text).length>320?"…":""}</div><button class="mt-2 px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold" data-trial-jump="${esc(c.disease)}" data-trial-sec="${esc(c.section)}">Open this section</button></div>`).join(""):`<div class="mt-1 text-slate-600">Not yet cited in a pathway section; listed for recognition.</div>`}
        <div class="mt-3 flex flex-wrap gap-2">
          <a class="px-3 py-1 rounded-lg border border-slate-300 font-bold" target="_blank" rel="noopener" href="https://pubmed.ncbi.nlm.nih.gov/?term=${term}">PubMed ↗</a>
          <a class="px-3 py-1 rounded-lg border border-slate-300 font-bold" target="_blank" rel="noopener" href="https://clinicaltrials.gov/search?term=${encodeURIComponent(t[1].split("/")[0])}">ClinicalTrials.gov ↗</a>
        </div></div>`;
    }
    return `<article class="card p-4" data-trial="${esc(t[1])}" style="cursor:pointer"><div class="flex gap-2 mb-2"><span class="badge badge-slate">${esc(t[0])}</span><span class="badge badge-blue">${esc(t[3])}</span><span class="ml-auto text-xs text-slate-500">${isOpen?"▲ Close":"▼ Details"}</span></div><h3 class="font-black text-sm">${esc(t[1])}</h3>${isOpen?"":`<div class="text-xs text-slate-600 mt-1 leading-5">${esc(t[2])}</div>`}${body}</article>`;
  }).join("")||`<div class="card p-4 text-sm">No trial matches “${esc(trialState.q)}”.</div>`;
  const grid=document.getElementById("trialGrid");
  grid.innerHTML=`<div class="card p-3" style="grid-column:1/-1"><input id="trialSearch" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Search trials (name, drug, setting)…" value="${esc(trialState.q)}"><div class="mt-2 flex flex-wrap gap-2">${chips}</div><div class="mt-2 text-xs text-slate-500">${list.length} of ${TRIALS.length} trials · tap a trial for details and where the app cites it</div></div>`+cards;
  grid.querySelectorAll("[data-trial-area]").forEach(b=>b.onclick=e=>{e.stopPropagation();trialState.area=b.dataset.trialArea;trialState.open="";renderTrialMap();});
  grid.querySelectorAll("article[data-trial]").forEach(a=>a.onclick=e=>{if(e.target.closest("a,button"))return;trialState.open=trialState.open===a.dataset.trial?"":a.dataset.trial;renderTrialMap();const el=document.querySelector(`article[data-trial="${CSS.escape(a.dataset.trial)}"]`);if(el)el.scrollIntoView({block:"nearest"});});
  grid.querySelectorAll("[data-trial-jump]").forEach(b=>b.onclick=e=>{e.stopPropagation();trialJump(b.dataset.trialJump,b.dataset.trialSec);});
  const si=document.getElementById("trialSearch");
  si.oninput=()=>{trialState.q=si.value;const pos=si.selectionStart;renderTrialMap();const n=document.getElementById("trialSearch");n.focus();n.setSelectionRange(pos,pos);};
}

/* ========================= FINAL CLINICAL ORACLE V9 ========================= */
const ORACLE_FIELDS={
  "Ca Prostate":[
    {id:"state",label:"Disease state",options:["Localized","BCR after RP","BCR after RT","mHSPC","nmCRPC","mCRPC"],req:1},
    {id:"gg",label:"ISUP Grade Group",options:["1","2","3","4","5"]},
    {id:"psa",label:"PSA (ng/mL)",type:"number"},
    {id:"ct",label:"cT category",options:["T1","T2a","T2b","T2c","T3a","T3b","T4"]},
    {id:"cn",label:"cN",options:["N0","N1"]},
    {id:"cm",label:"cM",options:["M0","M1a","M1b","M1c"]},
    {id:"volume",label:"M1 volume",options:["Not M1","Low-volume","High-volume"],show:v=>String(v.cm||'').startsWith('M1')},
    {id:"priorARPI",label:"Prior ARPI exposure",options:["No","Yes"],show:v=>["mCRPC","nmCRPC"].includes(v.state)},
    {id:"priorDoc",label:"Prior docetaxel",options:["No","Yes"],show:v=>v.state==="mCRPC"},
    {id:"hrr",label:"HRR alteration",options:["Not tested/negative","BRCA1/2","Other actionable HRR"],show:v=>v.state==="mCRPC"},
    {id:"psadt",label:"PSA doubling time (months)",type:"number",show:v=>v.state==="nmCRPC"}
  ],
  "Ca Bladder":[
    {id:"t",label:"Bladder tumour T category",options:["Tx","Ta","Tis","T1","T2","T3","T4a","T4b"],req:1},
    {id:"m",label:"M category",options:["Mx","M0","M1"],req:1},
    {id:"grade",label:"Grade",options:["LG","HG"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"cis",label:"CIS",options:["No","Yes"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"muscle",label:"Detrusor muscle in TURBT specimen",options:["Present","Absent","Not applicable"],show:v=>["T1"].includes(v.t)},
    {id:"resect",label:"Adequate/maximal TURBT",options:["Yes","No","Not yet"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"num",label:"Tumour number",options:["Single","Multiple"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"size",label:"Largest tumour size",options:["<3 cm","≥3 cm"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"rec",label:"Recurrence context",options:["Primary","Late recurrence","Early recurrence <1 yr","Frequent recurrence"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"variant",label:"Variant histology / LVI",options:["No","Yes"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"bcg",label:"Adequate BCG delivered",options:["No","Yes","Not applicable"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"bcgtime",label:"Post-BCG phenotype",options:["Not applicable","Within 12 months of adequate BCG","Later recurrence after adequate BCG","BCG-naive/high-risk"],show:v=>["Ta","T1","Tis"].includes(v.t)},
    {id:"nodes",label:"Clinical nodes",options:["cN0","cN+"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"rct",label:"Fit for radical cystectomy",options:["Yes","No","Declines"],show:v=>["T1","T2","T3","T4a","T4b"].includes(v.t)},
    {id:"tmt",label:"Trimodality bladder-preservation candidate",options:["Yes","No","Uncertain"],show:v=>["T2","T3"].includes(v.t)&&v.m==="M0"},
    {id:"immuno",label:"Immunotherapy medically suitable",options:["Yes","No","Uncertain"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"g_crcl",label:"Creatinine clearance (mL/min; use actual eligibility calculation)",type:"number",show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"g_ecog",label:"ECOG performance status",options:["0–1","2",">2"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"g_hearing",label:"Audiometric hearing loss",options:["Grade 0–1","Grade ≥2"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"g_neuro",label:"Peripheral neuropathy",options:["Grade 0–1","Grade ≥2"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"g_nyha",label:"Heart failure",options:["NYHA I–II","NYHA III–IV"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"evfit",label:"Enfortumab vedotin suitability",options:["Yes","No","Uncertain"],show:v=>["T2","T3","T4a","T4b"].includes(v.t)||v.m==="M1"},
    {id:"diabetes",label:"Uncontrolled diabetes",options:["No","Yes"],show:v=>v.evfit!==undefined&&v.evfit!==""},
    {id:"skin",label:"Significant pre-existing skin disorder",options:["No","Yes"],show:v=>v.evfit!==undefined&&v.evfit!==""},
    {id:"fgfr",label:"FGFR3 alteration",options:["Not tested/negative","Susceptible alteration"],show:v=>v.m==="M1"},
    {id:"her2",label:"HER2 IHC",options:["Not tested","0/1+","2+","3+"],show:v=>v.m==="M1"},
    {id:"priorIO",label:"Prior checkpoint inhibitor",options:["No","Yes"],show:v=>v.m==="M1"},
    {id:"priorEV",label:"Prior enfortumab vedotin",options:["No","Yes"],show:v=>v.m==="M1"},
    {id:"priorPlatinum",label:"Prior platinum chemotherapy",options:["No","Yes"],show:v=>v.m==="M1"}
  ],
  "UTUC":[
    {id:"risk",label:"Risk class",options:["Low-risk phenotype","High-risk phenotype","Indeterminate"],req:1},
    {id:"location",label:"Location",options:["Renal pelvis","Proximal/mid ureter","Distal ureter"]},
    {id:"t",label:"T category",options:["Ta/Tis","T1","T2","T3","T4"]},
    {id:"grade",label:"Grade",options:["Low","High"]},
    {id:"hydro",label:"Hydronephrosis",options:["No","Yes"]},
    {id:"cyto",label:"Cytology",options:["Negative/low-grade","High-grade positive","Indeterminate"]},
    {id:"size",label:"Tumour size",options:["<2 cm","≥2 cm"]},
    {id:"multifocal",label:"Multifocality",options:["No","Yes"]},
    {id:"met",label:"Metastatic",options:["M0","M1"]},
    {id:"cisplatin",label:"Perioperative cisplatin assessment",options:["Not assessed","Suitable","Unsuitable"],show:v=>v.met==="M0"&&["High-risk phenotype"].includes(v.risk)},
    {id:"fgfr",label:"FGFR3 alteration",options:["Not tested/negative","Susceptible alteration"],show:v=>v.met==="M1"}
  ],
  "Ca Penis":[
    {id:"primary",label:"Primary tumour T stage",options:["PeIN/Tis","Ta","T1a","T1b","T2","T3","T4"],req:1},
    {id:"grade",label:"Grade",options:["G1","G2","G3"]},
    {id:"lvi",label:"LVI",options:["No","Yes"]},
    {id:"cngroin",label:"Groin status",options:["cN0","cN1","cN2","cN3"],req:1},
    {id:"bulky",label:"Bulky inguinal node ≥4 cm",options:["No","Yes"],show:v=>["cN1","cN2","cN3"].includes(v.cngroin)},
    {id:"bilateral",label:"Bilateral/mobile nodal disease",options:["No","Yes"],show:v=>["cN2","cN3"].includes(v.cngroin)},
    {id:"fna",label:"Node cytology/FNA",options:["Negative/not done","Positive"],show:v=>["cN1","cN2"].includes(v.cngroin)},
    {id:"cisfit",label:"Cisplatin/taxane chemotherapy fit",options:["Yes","No"],show:v=>["cN2","cN3"].includes(v.cngroin)},
    {id:"pnl",label:"Post-ILND positive inguinal nodes",options:["0","1–2","≥3"],show:v=>["cN1","cN2","cN3"].includes(v.cngroin)},
    {id:"ene",label:"Extranodal extension",options:["No","Yes"],show:v=>["cN1","cN2","cN3"].includes(v.cngroin)}
  ],
  "Ca Testis":[
    {id:"hist",label:"Histology",options:["Seminoma","NSGCT"],req:1},
    {id:"stage",label:"Clinical stage",options:["I","IIA/IIB","IIC/III"],req:1},
    {id:"lvi",label:"LVI (NSGCT)",options:["No","Yes"],show:v=>v.hist==="NSGCT"&&v.stage==="I"},
    {id:"markers",label:"Post-orchiectomy markers",options:["Normal","Elevated"]},
    {id:"igcccg",label:"IGCCCG",options:["Good","Intermediate","Poor","Not metastatic"],show:v=>v.stage==="IIC/III"},
    {id:"residual",label:"Post-chemotherapy residual mass",options:["None","<1 cm","≥1 cm","Seminoma ≥3 cm"],show:v=>v.stage==="IIC/III"}
  ],
  "Ca Kidney":[
    {id:"hist",label:"Histology",options:["Clear-cell RCC","Papillary RCC","Chromophobe/other RCC"],req:1},
    {id:"t",label:"T category",options:["T1a","T1b","T2","T3","T4"]},
    {id:"nodes",label:"Nodes",options:["N0","N1"]},
    {id:"met",label:"Metastatic",options:["M0","M1"],req:1},
    {id:"imdc",label:"IMDC",options:["Favorable","Intermediate","Poor","Not applicable"],show:v=>v.met==="M1"},
    {id:"recur",label:"KEYNOTE-564-defined adjuvant risk",options:["No/unknown","Yes"],show:v=>v.met==="M0"&&v.hist==="Clear-cell RCC"},
    {id:"frail",label:"Frailty/comorbidity",options:["Fit","Frail/comorbid"],show:v=>v.met==="M0"}
  ],
  "Urethral Cancer":[
    {id:"site",label:"Anatomic site",options:["Distal/anterior male","Bulbar male","Prostatic/posterior male","Female urethra"],req:1},
    {id:"hist",label:"Histology",options:["SCC","Urothelial","Adenocarcinoma","Other/rare"],req:1},
    {id:"t",label:"T stage",options:["Tis/Ta","T1","T2","T3","T4"]},
    {id:"nodes",label:"Nodes",options:["N0","N1/N2"]},
    {id:"met",label:"Metastatic",options:["M0","M1"]},
    {id:"resect",label:"Resectable",options:["Yes","No"]}
  ],
  "Adrenal / Neuroendocrine":[
    {id:"lesion",label:"Clinical context",options:["Adrenal incidentaloma","Functioning adrenal mass","Suspected ACC","Pheochromocytoma/PPGL"],req:1},
    {id:"pheo",label:"Pheochromocytoma excluded before biopsy/surgery",options:["Yes","No","Not assessed"]},
    {id:"hormone",label:"Hormonal work-up",options:["Negative","Positive","Incomplete"]},
    {id:"imaging",label:"Imaging phenotype",options:["Benign-appearing","Indeterminate","Suspicious/invasive"]}
  ],
  "Urethral Stricture":[
    {id:"sex",label:"Patient",options:["Male","Female"],req:1},
    {id:"site",label:"Stricture location",options:["Bulbar","Penile","Meatus/fossa navicularis","Posterior/VUAS/BMS","Bladder neck stenosis"],req:1},
    {id:"length",label:"Stricture length",options:["<1 cm","1–2 cm",">2 cm","Unknown"],req:1},
    {id:"obliterative",label:"Lumen",options:["Non-obliterative","Near-obliterative/obliterative"]},
    {id:"primary",label:"Prior treatment",options:["Primary untreated","Prior DVIU/dilatation","Prior urethroplasty","Radiation-related"]},
    {id:"ls",label:"Lichen sclerosus",options:["No","Yes","Uncertain"]},
    {id:"recurrent",label:"Recurrence phenotype",options:["None","Short veil-like recurrence after urethroplasty","Complex recurrence"],show:v=>v.primary!=="Primary untreated"},
    {id:"bns",label:"Context",options:["None","Post-BPH surgery bladder neck stenosis","Post-prostatectomy VUAS","Radiation-induced bulbomembranous stenosis"],show:v=>v.site==="Posterior/VUAS/BMS"||v.site==="Bladder neck stenosis"}
  ],
  "BPH / Male LUTS":[
    {id:"bother",label:"Symptom burden",options:["Mild/not troublesome","Moderate/severe/bothersome"],req:1},
    {id:"complication",label:"Complication/absolute surgical driver",options:["None","Recurrent/refractory retention","Recurrent UTI","Bladder stones","Recurrent gross haematuria attributed to BPO","Upper tract dilatation/renal impairment" ]},
    {id:"size",label:"Prostate volume",options:["<30 mL","30–80 mL",">80 mL"]},
    {id:"storage",label:"Predominant storage symptoms",options:["No","Yes"]},
    {id:"ed",label:"Desire to preserve ejaculation",options:["No priority","Yes"]}
  ],
  "Stone Disease":[
    {id:"site",label:"Stone location",options:["Kidney","Proximal ureter","Distal ureter","Bladder"],req:1},
    {id:"size",label:"Largest stone",options:["<10 mm","10–20 mm",">20 mm"],req:1},
    {id:"infection",label:"Sepsis/obstructed infected system",options:["No","Yes"],req:1},
    {id:"renal",label:"Renal anatomy",options:["Normal","Complex/anomalous"]},
    {id:"staghorn",label:"Staghorn/complex branching stone",options:["No","Yes"]},
    {id:"antithrombotic",label:"Relevant antithrombotic therapy",options:["No","Yes"]}
  ]
};

let oracleState={};
const ACTIVE_ORACLE={};
function oracleValue(id){return oracleState[id]==null?'':oracleState[id];}
function oracleVisible(f,v){return typeof f.show==='function' ? !!f.show(v) : true;}
function oracleFieldHTML(f,v){
  const val=oracleValue(f.id), required=f.req?' <span class="text-red-600 font-black">●</span>':'';
  let control='';
  if(f.type==='number') control=`<input id="of-${esc(f.id)}" type="number" step="0.1" value="${esc(val)}" class="w-full border rounded-xl p-3 text-sm" placeholder="${esc(f.label)}">`;
  else control=`<select id="of-${esc(f.id)}" class="w-full border rounded-xl p-3 text-sm"><option value="">Select...</option>${(f.options||[]).map(o=>`<option ${String(o)===String(val)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  return `<label class="block text-xs font-bold text-slate-500"><span class="block mb-1">${required}${esc(f.label)}</span>${control}</label>`;
}
function deriveBladder(v){
  if(v.m==='M1') return 'METASTATIC';
  if(v.t==='T4b') return 'LOCALLY ADVANCED / UNRESECTABLE';
  if(['T2','T3','T4a'].includes(v.t)) return 'MIBC';
  if(['Ta','Tis','T1'].includes(v.t)) return 'NMIBC';
  return 'INCOMPLETE';
}
function deriveGalsky(v){
  const checks=[
    ['ECOG PS 2',v.g_ecog==='2'],
    ['Creatinine clearance <60 mL/min',v.g_crcl!==''&&v.g_crcl!=null&&Number.isFinite(+v.g_crcl)&&+v.g_crcl<60],
    ['Grade ≥2 hearing loss',v.g_hearing==='Grade ≥2'],
    ['Grade ≥2 peripheral neuropathy',v.g_neuro==='Grade ≥2'],
    ['NYHA class III–IV heart failure',v.g_nyha==='NYHA III–IV']
  ];
  if(!['MIBC','METASTATIC','LOCALLY ADVANCED / UNRESECTABLE'].includes(deriveBladder(v))) return {known:false,positive:[],text:'Not applicable at this stage'};
  const incomplete=checks.some(([,hit])=>hit===false && (v.g_ecog===''||v.g_crcl===''||v.g_hearing===''||v.g_neuro===''||v.g_nyha===''));
  // Any explicit positive criterion is enough; the presence of blank criteria does not erase a positive screen.
  const positive=checks.filter(([,hit])=>hit===true).map(([label])=>label);
  const missing=[['ECOG PS',v.g_ecog],['CrCl',v.g_crcl],['Hearing',v.g_hearing],['Neuropathy',v.g_neuro],['NYHA',v.g_nyha]].filter(([,x])=>x===''||x==null).map(([label])=>label);
  return {known:missing.length===0,positive,missing,incomplete:missing.length>0,text:positive.length?'Galsky screen positive — at least one cisplatin-unfit criterion is present':missing.length?'Incomplete Galsky screen':'No Galsky cisplatin-unfit criterion identified'};
}
function deriveBph(v){
  if(v.complication&&v.complication!=='None') return 'Surgical indication likely: complication/refractory disease';
  if(v.bother==='Mild/not troublesome') return 'Watchful waiting / conservative care';
  if(v.size==='<30 mL') return v.storage==='Yes'?'Treat symptom phenotype; storage-directed therapy after appropriate assessment':'Medical therapy pathway';
  if(v.size==='30–80 mL') return v.ed==='Yes'?'Surgical options with ejaculation-preservation discussion':'Medical therapy or TURP/enucleation according to symptoms and preference';
  if(v.size==='>80 mL') return v.ed==='Yes'?'Large-gland surgery with ejaculation-preservation counselling':'Enucleation/large-gland surgery pathway';
  return 'Complete prostate size and symptom burden';
}
function deriveStone(v){
  if(v.infection==='Yes') return 'URGENT DRAINAGE PATHWAY';
  if(v.staghorn==='Yes' || v.size==='>20 mm') return 'PCNL-centred large/complex stone pathway';
  if(v.site==='Distal ureter' && v.size!=='>20 mm') return 'Distal ureter stone pathway';
  if(v.site==='Proximal ureter' && v.size!=='>20 mm') return 'Proximal ureter stone pathway';
  if(v.site==='Kidney') return 'Renal stone pathway';
  return 'Bladder stone pathway';
}
function renderOracleRisk(name,v){
  const panel=document.getElementById('riskPanelContent'); if(!panel)return;
  let title='Clinical completeness',body='Enter the key staging and decision variables. The engine will not fabricate missing data.';
  if(name==='Ca Bladder'){
    const s=deriveBladder(v),g=deriveGalsky(v);
    title=s; body = s==='NMIBC'?'NMIBC is derived from Ta/Tis/T1. Risk and BCG failure need stage, grade, CIS, resection adequacy, multiplicity/size and recurrence context.':s==='MIBC'?'T2–T4a M0 is MIBC. Cisplatin fitness is screened from explicit clinical criteria rather than a single yes/no judgement.':s==='METASTATIC'?'M1 drives the advanced urothelial pathway; prior EV/ICI/platinum exposure and biomarkers become material.':s==='LOCALLY ADVANCED / UNRESECTABLE'?'T4b should not be placed into the routine resectable T2–T4a perioperative pathway.':'Select T and M.';
    panel.innerHTML=`<div class="badge ${s==='NMIBC'?'badge-blue':s==='MIBC'?'badge-amber':s==='METASTATIC'||s.includes('UNRESECTABLE')?'badge-red':'badge-slate'}">${esc(title)}</div><div class="text-sm leading-6 mt-3">${esc(body)}</div><div class="mt-3 step"><b>Galsky screen</b><br>${esc(g.text)}${g.positive?.length?`<br><span class="text-red-700">Positive criteria: ${esc(g.positive.join(', '))}</span>`:''}${g.missing?.length?`<br><span class="text-amber-700">Still required: ${esc(g.missing.join(', '))}</span>`:''}</div><div class="mt-3 step"><b>Safety gate</b><br>Missing fields remain visible; treatment is not inferred from unknown inputs.</div>`;
    return;
  }
  if(name==='Urethral Stricture'){title='Stricture treatment gate';body='Length, location, obliteration, prior treatment and aetiology determine whether endoluminal treatment is reasonable or reconstruction should be planned.';}
  if(name==='BPH / Male LUTS'){title=deriveBph(v);body='Management is symptom-, complication- and prostate-size driven; treatment should not be selected from prostate volume alone.';}
  if(name==='Stone Disease'){title=deriveStone(v);body='A septic obstructed system is an emergency drainage pathway; stone size/location and anatomy then determine definitive treatment.';}
  panel.innerHTML=`<div class="badge badge-blue">${esc(title)}</div><div class="text-sm leading-6 mt-3">${esc(body)}</div><div class="mt-4 step"><b>Decision status</b><br>${esc(Object.entries(v).filter(([,x])=>x!=='').length)} entered variables.</div>`;
}
function oracleRequired(name,v){
  if(name==='Ca Bladder'){
    const req=['t','m'];
    const s=deriveBladder(v);
    if(s==='NMIBC') req.push('grade','cis','resect');
    if(s==='MIBC'||s==='METASTATIC'||s==='LOCALLY ADVANCED / UNRESECTABLE') req.push('rct','immuno','g_crcl','g_ecog','g_hearing','g_neuro','g_nyha','evfit');
    if(s==='MIBC' && v.m==='M0' && v.nodes==='') req.push('nodes');
    return req;
  }
  if(name==='Urethral Stricture') return ['sex','site','length'];
  if(name==='BPH / Male LUTS') return ['bother','size'];
  if(name==='Stone Disease') return ['site','size','infection'];
  return (ORACLE_FIELDS[name]||[]).filter(f=>f.req).map(f=>f.id);
}
function oracleIncomplete(name,v){
  return oracleRequired(name,v).filter(k=>v[k]==null||v[k]==='');
}
const ENGINE_HANDOFF={
  'Stone Disease':{fn:'oracleOpenStone',label:'stone decision engine',why:'It covers emergency drainage, size, location, CT attenuation, lower-pole anatomy, BMI, anticoagulation, pregnancy and PCNL planning (EAU Urolithiasis 2026).'},
  'BPH / Male LUTS':{fn:'oracleOpenBPH',label:'BPH / male LUTS engine',why:'It works through phenotype, objective assessment, medication, the urodynamics gate and procedure selection (EAU Non-neurogenic male LUTS 2026).'},
  'Urethral Stricture':{fn:'oracleOpenStricture',label:'urethral stricture engine',why:'It weighs site, length, calibre, aetiology, spongiofibrosis and previous treatment before choosing between endoscopic treatment and reconstruction (EAU Urethral strictures 2026).'}
};
function renderOracleForm(){
  const name=document.getElementById('oracleDisease')?.value||'';
  if(!name)return;
  const form=document.getElementById('oracleForm'); if(!form)return;
  /* V16: stone, BPH and stricture each have one dedicated decision engine. The Oracle hands off to it
     instead of running a second, older rule set that could disagree with the engine. */
  const handoff=ENGINE_HANDOFF[name];
  if(handoff){
    form.innerHTML=`<div class="decision text-sm leading-6"><b>${esc(name)} has a dedicated decision engine.</b><br>${esc(handoff.why)}</div><button type="button" id="oracleEngineBtn" class="mt-3 px-4 py-3 rounded-lg bg-slate-950 text-white text-sm font-black w-full">Open the ${esc(handoff.label)}</button>`;
    document.getElementById('oracleEngineBtn').onclick=()=>{const f=window[handoff.fn];if(typeof f==='function')f();};
    const pr=document.getElementById('oracleProgress'); if(pr)pr.innerHTML='';
    const out=document.getElementById('oracleOutput'); if(out)out.innerHTML='<div class="text-sm font-black">Management output</div><div class="text-xs text-slate-500 mt-1">Shown in the dedicated engine.</div>';
    return;
  }
  const v=oracleState;
  const fields=(ORACLE_FIELDS[name]||[]).filter(f=>oracleVisible(f,v));
  const req=new Set(oracleRequired(name,v));
  const stateLabel=name==='Ca Bladder'?deriveBladder(v):name==='BPH / Male LUTS'?deriveBph(v):name==='Stone Disease'?deriveStone(v):'';
  const header=name==='Ca Bladder'?`<div class="context-note mb-3"><b>Derived bladder layer:</b> ${esc(stateLabel)}. NMIBC/MIBC is derived from the entered T and M categories.</div>`:
    name==='Urethral Stricture'?`<div class="context-note mb-3"><b>Core rule:</b> do not choose DVIU in isolation; the engine explicitly checks location + length + recurrence + obliteration.</div>`:'';
  form.innerHTML=`<div class="oracle-panel-head"><div class="flex flex-wrap gap-2 items-center"><div class="font-black text-sm">${esc(name)} — structured clinical interview</div><span class="badge badge-blue">Current guideline pathway</span></div><div class="text-xs text-slate-500 mt-1">Required decision inputs are marked ●. Unknowns are not silently converted into treatment recommendations.</div></div>${header}<div class="v4-kicker mb-2">Clinical inputs</div><div class="grid md:grid-cols-2 gap-3">${fields.map(f=>oracleFieldHTML({...f,req:req.has(f.id)},v)).join('')}</div><div class="v4-toolbar mt-4"><button id="oracleRunBtn" class="v4-btn dark flex-1">Generate treatment plan</button><button id="oracleResetBtn" class="v4-btn">Reset</button><button id="oracleMDTBtn" class="v4-btn">MDT summary</button><button id="oracleTeachBtn" class="v4-btn blue">Teach me</button><button id="oracleProcBtn" class="v4-btn amber">Procedure Atlas</button></div><div id="oracleProgress" class="v4-muted mt-2"></div>`;
  fields.forEach(f=>{const e=document.getElementById('of-'+f.id);if(e)e.addEventListener('change',()=>{oracleState[f.id]=e.type==='number'?(e.value===''?'':Number(e.value)):e.value;renderOracleForm();renderOracleRisk(name,oracleState);});});
  document.getElementById('oracleRunBtn').onclick=()=>runOracle(name);
  document.getElementById('oracleResetBtn').onclick=()=>{oracleState={};renderOracleForm();renderOracleRisk(name,oracleState);document.getElementById('oracleOutput').innerHTML='<div class="text-sm font-black">Management output</div><div class="text-xs text-slate-500 mt-1">Enter explicit clinical criteria to generate a pathway.</div>';};
  document.getElementById('oracleMDTBtn').onclick=()=>showOracleMDT(name);
  document.getElementById('oracleTeachBtn').onclick=()=>teachOracle(name);
  document.getElementById('oracleProcBtn').onclick=()=>openProcedureAtlas(procedureForCurrent(name,oracleState));
  const missing=[...new Set([...req].filter(k=>!oracleState[k]&&oracleState[k]!==0))];
  document.getElementById('oracleProgress').innerHTML=`Core decision inputs: <b>${req.size-missing.length}/${req.size}</b> • ${missing.length?`still required: <b>${esc(missing.join(', '))}</b>`:'ready for pathway generation'} <span style="color:#64748b">• Review disease-specific modifiers before finalising the pathway.</span>`;
  renderOracleRisk(name,oracleState);
}
function planBlock(title,tag,plan,why,alternatives=[],checks=[],sources=[]){
  const links=sources.map(k=>ORACLE_SOURCES[k]?`<a class="source-link" target="_blank" rel="noopener noreferrer" href="${esc(ORACLE_SOURCES[k])}">${esc(k)} ↗</a>`:'').filter(Boolean).join(' • ');
  return `<div class="flex flex-wrap gap-2 items-center"><span class="badge badge-green">${esc(tag)}</span></div><h3 class="text-lg font-black mt-2">${esc(title)}</h3><div class="rule mt-3 text-sm leading-6"><b>Recommended pathway:</b><br>${plan}</div>${why?`<div class="decision mt-3 text-sm leading-6"><b>Why this branch:</b><br>${why}</div>`:''}${alternatives.length?`<div class="alt mt-3 text-sm leading-6"><b>Alternatives / shared decision:</b><br>${alternatives.map(x=>'• '+x).join('<br>')}</div>`:''}${checks.length?`<div class="warn mt-3 text-xs leading-5"><b>Do not miss:</b><br>${checks.map(x=>'• '+x).join('<br>')}</div>`:''}<div class="mt-4 text-[11px] text-slate-500">Source layer: ${links||'Guideline/source link not configured.'}</div>`;
}
function runOracle(name){
  const v={...oracleState};
  const missing=oracleIncomplete(name,v);
  if(missing.length){document.getElementById('oracleOutput').innerHTML=`<div class="warn text-sm"><b>Decision incomplete.</b><br>Complete: ${esc(missing.join(', '))}. The Oracle will not guess missing clinical inputs.</div>`;return;}
  let html='';
  if(name==='Ca Bladder') html=bladderOracle(v);
  else if(name==='Urethral Stricture') html=strictureOracle(v);
  else if(name==='BPH / Male LUTS') html=bphOracle(v);
  else if(name==='Stone Disease') html=stoneOracle(v);
  else if(name==='Ca Prostate') html=prostateOracle(v);
  else if(name==='UTUC') html=utucOracle(v);
  else if(name==='Ca Penis') html=penisOracle(v);
  else if(name==='Ca Testis') html=testisOracle(v);
  else if(name==='Ca Kidney') html=kidneyOracle(v);
  else if(name==='Urethral Cancer') html=urethralCancerOracle(v);
  else if(name==='Adrenal / Neuroendocrine') html=adrenalOracle(v);
  else html=`<div class="warn">No engine configured for ${esc(name)}.</div>`;
  document.getElementById('oracleOutput').innerHTML=html;
}
function bladderOracle(v){
  const stage=deriveBladder(v),g=deriveGalsky(v),out=[];
  if(stage==='NMIBC'){
    if(v.resect!=='Yes') return planBlock('Second TURBT indicated','NMIBC — TURBT quality gate','Repeat TURBT is indicated after an incomplete initial resection or when completeness is in doubt. The second resection should include the primary tumour site and should generally be performed within 2–6 weeks.', 'A complete, well-documented TURBT is required before final risk-based treatment selection.', ['Document tumour number, size, site, architecture, CIS suspicion, completeness, detrusor muscle and complications.'], ['Do not proceed to definitive risk-based therapy as though staging were secure when the initial resection was incomplete.'], ['EAU NMIBC 2026']);
    if(v.t==='T1') return planBlock('Second TURBT indicated for T1 disease','NMIBC — T1 re-staging','Perform second TURBT including the primary tumour site, generally within 2–6 weeks, before definitive adjuvant treatment selection.', 'EAU 2026 recommends a second TURBT after macroscopically complete initial TURBT in T1 disease.', ['Reassess residual tumour and pathological stage; treatment then follows the updated pathology/risk group.'], ['If prostatic urethral sampling is indicated and was not performed initially, address it at the second resection.'], ['EAU NMIBC 2026']);
    if(v.muscle==='Absent' && !(v.t==='Ta'&&v.grade==='LG') && v.t!=='Tis') return planBlock('Second TURBT indicated — detrusor muscle absent','NMIBC — staging quality gate','Repeat TURBT to obtain adequate staging when detrusor muscle is absent, except for Ta low-grade/G1 tumours and primary CIS.', 'Absence of muscle increases the risk of residual disease and under-staging.', ['After re-staging, re-enter the updated stage/grade into the Oracle.'], ['Do not infer muscle invasion or non-invasion from an inadequate specimen.'], ['EAU NMIBC 2026']);
    const veryHigh=(v.t==='T1'&&v.grade==='HG')||v.cis==='Yes'||v.variant==='Yes';
    const low=(v.t==='Ta'&&v.grade==='LG'&&v.cis==='No'&&v.num==='Single'&&v.size==='<3 cm'&&v.rec==='Primary'&&v.variant==='No');
    if(veryHigh) return planBlock('High / adverse-risk NMIBC pathway','NMIBC — high/adverse-risk phenotype','Use the complete EAU risk-group assessment to determine whether BCG-based bladder preservation, early radical cystectomy, or another risk-adapted strategy is appropriate. T1 high-grade disease, CIS and adverse histology/LVI are not low-risk features.', 'These findings materially increase recurrence/progression concern, but a single field should not be used to label every patient “very high risk”.', ['Discuss early radical cystectomy in selected high/very-high-risk disease; if bladder preservation is chosen, use guideline-defined BCG and surveillance pathways.'], ['Confirm stage, grade, CIS, multiplicity, size, recurrence timing and adverse histology/LVI before assigning the final EAU risk group.','For BCG-unresponsive disease, do not recycle BCG as if it were BCG-naïve.'], ['EAU NMIBC 2026']);
    if(low) return planBlock('Low-risk NMIBC pathway','NMIBC — low-risk phenotype','After complete TURBT, deliver immediate single postoperative intravesical chemotherapy when safe and not contraindicated by perforation/extensive resection/bleeding concerns, followed by risk-adapted cystoscopic surveillance.', 'The low-risk phenotype is driven by a solitary small primary low-grade Ta pattern without CIS or adverse pathology.', ['Avoid unnecessary repeated intensive intravesical therapy when the tumour remains genuinely low risk.'], ['Reassess risk at recurrence; “low risk once” does not guarantee low risk forever.'], ['EAU NMIBC 2026']);
    if(v.bcg==='Yes' && (v.bcgtime==='Within 12 months of adequate BCG'||v.bcgtime==='Later recurrence after adequate BCG')) return planBlock('BCG-exposure / failure pathway','NMIBC — post-BCG','Classify the recurrence precisely (BCG-unresponsive vs relapse vs exposed) before selecting therapy; BCG-unresponsive high-grade disease requires discussion of radical cystectomy and evidence-based bladder-preserving alternatives / trials.', 'Timing and adequacy of prior BCG alter the treatment branch materially.', ['Current 2026 EAU tables include multiple bladder-preserving options; eligibility varies by exact phenotype, regulatory jurisdiction and local access.'], ['Do not label a recurrence BCG-unresponsive without documenting adequate BCG exposure and timing.'], ['EAU NMIBC 2026']);
    return planBlock('Intermediate / mixed-risk NMIBC pathway','NMIBC — risk adapted','Use full EAU risk-group assessment to choose intravesical chemotherapy versus BCG intensity and surveillance. The operative record and pathology should determine the risk group; do not reduce intermediate/high risk to a single tumour-size rule.', 'Multiplicity, size, recurrence timing and pathology modify treatment intensity.', [], ['Record grade, CIS, stage, recurrence pattern, size, multiplicity and adverse histology/LVI.'], ['EAU NMIBC 2026']);
  }
  if(stage==='MIBC'){
    if(v.nodes==='cN+' ) return planBlock('cN+ non-metastatic MIBC — systemic + MDT pathway','MIBC — node-positive','Treat as locally advanced MIBC: multidisciplinary systemic therapy first/around definitive local therapy, followed by reassessment for radical local treatment in responding/resectable patients. Do not run the standard node-negative surgical algorithm unchanged.', 'Clinical nodal disease materially changes the sequence and prognosis.', ['Use trial/MDT pathways when cN burden is bulky or unresectable.'], ['Confirm staging with cross-sectional imaging and ensure pathology proves muscle invasion.'], ['EAU MIBC 2026']);
    if(!g.known) return planBlock('Complete cisplatin fitness assessment before selecting the perioperative branch','MIBC — eligibility gate','Enter the five Galsky clinical criteria explicitly. One positive criterion is enough to label the classic Galsky screen cisplatin-unfit; unanswered criteria must remain “unknown”.', 'Cisplatin eligibility is not a safe binary self-report; it is a structured assessment.', ['EAU 2026 also recognises modern split-dose/perioperative regimens in selected renal-function ranges; this should be reconciled with the exact institutional order set.'], ['Do not substitute age alone for a Galsky criterion.'], ['Galsky cisplatin-unfitness definition','EAU MIBC 2026']);
    const cisp= g.positive.length===0;
    if(cisp){
      const us=`As of 10 July 2026, the FDA also lists perioperative enfortumab vedotin + pembrolizumab as an approved neoadjuvant/adjuvant option for cystectomy candidates with MIBC, including patients eligible for cisplatin-based chemotherapy.`;
      return planBlock('Resectable MIBC — perioperative systemic therapy + definitive local therapy','MIBC — cT2–T4a cN0 M0',`Discuss a cisplatin-based perioperative pathway. The 2026 EAU guideline gives a strong recommendation for perioperative gemcitabine/cisplatin + durvalumab in cisplatin-eligible, immunotherapy-suitable patients. ${us} Proceed to radical cystectomy + pelvic lymph-node dissection when chosen as definitive local treatment.`, 'The decision is now a genuine evidence/label-aware choice rather than “cisplatin = yes → chemotherapy only”.', ['Bladder-preserving trimodality treatment is an alternative in carefully selected patients with appropriate anatomy, tumour characteristics, complete TURBT capability and willingness for intensive surveillance.'], ['Document cT/cN/M0, fitness for surgery, renal function, hearing, neuropathy, heart failure and immunotherapy suitability.'], ['EAU MIBC 2026','FDA MIBC EV + pembrolizumab, 10 Jul 2026']);
    }
    return planBlock('Resectable MIBC — cisplatin-unfit pathway','MIBC — cisplatin-unfit',`If the patient is cystectomy-eligible and immunotherapy/EV-suitable, the 2026 EAU guideline supports perioperative enfortumab vedotin + pembrolizumab. In the US, FDA labeling as of 10 July 2026 extends perioperative EV + pembrolizumab to all cystectomy-candidates with MIBC, not only cisplatin-ineligible patients.`, 'A positive Galsky screen does not automatically mean “carboplatin instead”. Neoadjuvant carboplatin is not the preferred substitute for cisplatin in resectable MIBC.', ['Trimodality bladder preservation remains an option for selected candidates when a bladder-sparing strategy is appropriate.'], ['Check uncontrolled diabetes, significant neuropathy and significant skin disease before EV; confirm immunotherapy suitability.'], ['EAU MIBC 2026','FDA MIBC EV + pembrolizumab, 10 Jul 2026']);
  }
  if(stage==='LOCALLY ADVANCED / UNRESECTABLE') return planBlock('T4b / locally advanced bladder cancer','MIBC — T4b','Do not force T4b into the routine resectable T2–T4a branch. Use multidisciplinary systemic therapy with re-imaging and selective local control; surgery is reserved for selected circumstances after expert review.', 'T4b invades pelvic/abdominal wall and is biologically/anatomically different from straightforward resectable MIBC.', [], ['Clarify M1 status and symptom-directed local control needs.'], ['EAU MIBC 2026']);
  if(stage==='METASTATIC'){
    if(v.priorEV==='No'&&v.priorIO==='No') return planBlock('Untreated advanced/metastatic urothelial carcinoma','Metastatic UC','EV + pembrolizumab is a central first-line standard. If EV is unsuitable, select platinum-based chemotherapy according to cisplatin/carboplatin fitness; after non-progressive platinum chemotherapy, avelumab maintenance is an established pathway.', 'Current 2026 EAU guidance places EV + pembrolizumab at the centre of first-line advanced disease while retaining platinum-based routes for patients unsuitable for EV.', ['Platinum-unfit patients require an alternative systemic/goal-of-care pathway rather than automatic carboplatin substitution.'], ['Determine FGFR status before later-line choice; assess HER2 and prior exposure.'], ['EAU MIBC 2026']);
    if(v.priorEV==='Yes' && v.priorPlatinum==='No') return planBlock('After prior EV + checkpoint inhibitor','Metastatic UC — subsequent line','Use platinum-based combination chemotherapy when appropriate; if actionable FGFR3 alteration is present, erdafitinib is a guideline-supported option. Clinical trials should be considered.', 'Prior EV + checkpoint inhibitor exposure changes the sequence.', ['Later-line HER2-directed therapy may be considered according to expression, approval and prior therapies.'], [], ['EAU MIBC 2026']);
    if(v.fgfr==='Susceptible alteration') return planBlock('FGFR-altered metastatic urothelial carcinoma','Metastatic UC — biomarker branch','Use an FGFR-directed pathway such as erdafitinib in the appropriate treatment line after confirming the alteration and label/eligibility requirements.', 'Biomarker-selected therapy can be clinically important after prior systemic exposure.', [], [], ['EAU MIBC 2026']);
    if(v.her2==='3+'||v.her2==='2+') return planBlock('HER2-expressing advanced urothelial carcinoma','Metastatic UC — biomarker branch','Review HER2-directed antibody-drug conjugate options in the appropriate later-line setting, with particular attention to IHC 3+ versus IHC 2+ evidence/approval and prior therapy.', 'HER2 status may create an additional treatment branch after EV/ICI/platinum sequencing.', [], [], ['EAU MIBC 2026']);
    return planBlock('Previously treated metastatic urothelial carcinoma','Metastatic UC — sequencing','Map the exact prior exposure sequence (platinum, checkpoint inhibitor, EV, avelumab) and then select an unused active class, biomarker-directed therapy or clinical trial. Do not repeat a failed class by reflex.', 'Treatment sequence is exposure-dependent.', [], ['Document best response and reason for discontinuation of each prior drug.'], ['EAU MIBC 2026']);
  }
  return planBlock('Complete bladder staging','Input gate','Select T and M to derive the disease layer.','The Oracle intentionally blocks treatment when stage is incomplete.',[],[],['EAU NMIBC 2026','EAU MIBC 2026']);
}
function strictureOracle(v){
  if(v.site==='Penile') return planBlock('Penile urethral stricture — reconstruction pathway','Urethral stricture','Do not use DVIU/dilatation as solitary treatment for penile strictures. Plan urethroplasty according to length, tissue quality, lichen sclerosus and prior procedures.', 'Current EAU guidance strongly advises against DVIU for penile strictures.', ['Single-stage or staged graft reconstruction depends on the stricture phenotype; staged reconstruction is particularly useful for complex disease not suitable for a reliable single-stage repair.'], ['Allow urethral rest after recent instrumentation before definitive urethroplasty.'], ['EAU Urethral Strictures 2026']);
  if(v.length==='>2 cm') return planBlock('Long anterior urethral stricture — urethroplasty','Urethral stricture','Do not use DVIU/dilatation as solitary treatment for a long (>2 cm) stricture. Choose reconstruction (single-stage graft where suitable, staged reconstruction for selected complex disease, or other appropriate reconstructive strategy).', 'Stricture length strongly predicts failure of endoluminal treatment.', ['If tissue quality is good and the disease is suitable, single-stage buccal mucosa graft urethroplasty may be appropriate.'], ['Map length/location accurately with RUG/VCUG and cystoscopy; assess LS.'], ['EAU Urethral Strictures 2026']);
  if(v.site==='Bulbar' && ['<1 cm','1–2 cm'].includes(v.length) && v.obliterative==='Non-obliterative' && v.primary==='Primary untreated') return planBlock('Short primary non-obliterative bulbar stricture','Urethral stricture — endoluminal option','Dilatation or DVIU may be offered for a primary, single, short (<2 cm), non-obliterative bulbar stricture. Counsel that recurrence remains possible and repeated instrumentation should not delay definitive reconstruction when recurrence becomes problematic.', 'This is the specific phenotype for which endoluminal treatment remains a guideline-supported option.', ['Urethroplasty is a reasonable definitive option when the patient prefers durable reconstruction or the stricture recurs.'], ['Do not transfer this rule to penile or long-segment strictures.'], ['EAU Urethral Strictures 2026']);
  if(v.recurrent==='Short veil-like recurrence after urethroplasty') return planBlock('Short veil-like recurrence after prior urethroplasty','Urethral stricture — salvage endoluminal option','A selected short (<1 cm), veil-like recurrent stricture after urethroplasty may be treated with DVIU/dilatation as a salvage option.', 'The recurrent phenotype is materially different from a long recurrent scar.', ['Persistent/complex recurrence should trigger reconstructive reassessment rather than serial endoluminal treatment.'], ['Document the exact recurrent length and morphology.'], ['EAU Urethral Strictures 2026']);
  if(v.site==='Posterior/VUAS/BMS'||v.site==='Bladder neck stenosis') return planBlock('Posterior/VUAS/BMS/BNS pathway','Posterior urethral obstruction','For non-obliterative VUAS or radiation-related bulbomembranous stenosis, visually controlled dilatation/DVIU is a guideline-supported initial endoluminal pathway. For post-BPH bladder-neck stenosis, TUR or hot-knife incision is a standard endoluminal option. Complete obliteration requires open reconstruction planning.', 'Posterior strictures have different anatomy and different endoluminal hazards.', ['Avoid deep incisions at the 6 and 12 o’clock positions during DVIU for VUAS/radiation BMS.'], ['Explicitly counsel about de novo/worsened incontinence after posterior endoluminal treatment.'], ['EAU Urethral Strictures 2026']);
  if(v.ls==='Yes') return planBlock('Lichen sclerosus-associated stricture','Urethral stricture — tissue-specific pathway','Treat as a chronic tissue-disease problem: assess meatus/penile involvement, avoid repeated traumatic instrumentation and plan reconstruction based on the actual diseased segment and tissue quality. Single-stage graft reconstruction may be feasible in selected bulbar disease; complex penile disease may require staged reconstruction.', 'Lichen sclerosus changes tissue quality and recurrence behaviour.', ['Staged bulbar urethroplasty is not preferred when a reliable single-stage option is feasible.'], ['Examine the entire glans/meatus/penile skin and address active LS management.'], ['EAU Urethral Strictures 2026']);
  return planBlock('Anterior urethral stricture — reconstructive assessment','Urethral stricture','Define length, exact location and tissue quality. For recurrent/complex disease, move toward urethroplasty rather than serial DVIU/dilatation. Select EPA versus graft reconstruction based on anatomy and stricture characteristics.', 'Treatment should be phenotype-specific rather than driven by a generic “stricture = DVIU” rule.', [], ['Obtain RUG/VCUG and cystoscopy when needed; allow urethral rest before definitive reconstruction after recent instrumentation.'], ['EAU Urethral Strictures 2026']);
}
function bphOracle(v){
  if(v.bother==='Mild/not troublesome'&&v.complication==='None') return planBlock('Watchful waiting / conservative management','Male LUTS','Use watchful waiting with lifestyle and symptom-directed measures; formally assess before assigning drug or surgery.', 'Many men with mild/non-bothersome LUTS remain stable without immediate intervention.', ['Escalate when bother increases or complications develop.'], ['Differentiate storage-predominant, voiding-predominant and underactive-bladder phenotypes.'], ['EAU Male LUTS 2026']);
  if(v.complication!=='None') return planBlock('Surgical pathway for complicated/refractory BPO','Male LUTS — surgery','A complication such as recurrent/refractory retention, bladder stones, recurrent UTI, refractory haematuria attributable to BPO or upper-tract/renal impact is a strong surgical driver once the diagnosis is secure.', 'Complications move management beyond routine symptom-only medical therapy.', ['Procedure selection depends on prostate size, anatomy, anticoagulation, surgeon expertise and patient goals.'], ['Do not treat recurrent retention as “just LUTS” without clarifying bladder function and obstruction.'], ['EAU Male LUTS 2026']);
  if(v.size==='30–80 mL') return planBlock('Moderate/severe bothersome LUTS — 30–80 mL prostate','Male LUTS','Start evidence-based medical therapy when appropriate; offer bipolar or monopolar TURP for surgical treatment of moderate-to-severe BPO in the 30–80 mL range, with endoscopic enucleation as an important alternative.', 'The 2026 EAU guideline retains TURP as a standard operation for this size range while reinforcing enucleation options.', ['Patient preference, bleeding risk and ejaculation priorities should influence the procedure choice.'], ['If storage symptoms dominate, evaluate the storage phenotype rather than assuming obstruction is the only mechanism.'], ['EAU Male LUTS 2026']);
  if(v.size==='>80 mL') return planBlock('Large-gland BPO — enucleation/large-gland surgery','Male LUTS','Prefer an anatomic enucleation strategy (e.g. HoLEP or appropriate laser enucleation) or another large-gland procedure according to expertise and local resources. Open/simple prostatectomy remains a selected option where endoscopic enucleation is unavailable or unsuitable.', 'Large glands are increasingly managed with enucleation rather than simple TURP because of durable debulking and retreatment advantages.', ['Aquablation and other newer techniques may be considered in selected settings; evidence and local access should be checked.'], ['Do not use gland volume alone to mandate surgery.'], ['EAU Male LUTS 2026']);
  return planBlock(deriveBph(v),'Male LUTS — phenotype driven','Select medical or surgical therapy after completing symptom severity, bother, prostate size, PVR/flow where indicated and complication assessment.', 'The new EAU framework emphasises symptom-based diagnosis and treatment.', [], [], ['EAU Male LUTS 2026']);
}
function stoneOracle(v){
  if(v.infection==='Yes') return planBlock('Obstructed infected system — emergency drainage','Stone emergency','Urgently decompress the collecting system with ureteral stent or percutaneous nephrostomy and obtain cultures; postpone definitive stone clearance until sepsis is controlled and the patient is appropriately stabilized.', 'An infected obstructed system is an emergency; definitive lithotripsy is not the first step.', ['Choose the drainage method based on anatomy, expertise, sepsis severity and access.'], ['Send urine/blood cultures as indicated; reassess antibiotics and source control.'], ['EAU Urolithiasis 2026']);
  if(v.staghorn==='Yes'||v.size==='>20 mm') return planBlock('Large / branching renal stone — PCNL-centred pathway','Stone surgery','PCNL is the core treatment route for >20 mm renal stone burden and complex branching/staghorn stones, with staged or adjunctive procedures according to burden and anatomy.', 'Stone size and complexity determine the likely efficiency of percutaneous clearance.', ['Flexible ureteroscopy or combined approaches may be used in selected anatomy/patient factors.'], ['Obtain pre-op urine culture; collect renal pelvic/stone culture during PCNL when possible.'], ['EAU Urolithiasis 2026']);
  if(v.site==='Distal ureter') return planBlock('Distal ureter stone pathway','Urolithiasis','For a non-infected distal ureter stone, choose observation/medical expulsive management when passage is plausible and the patient is stable; perform ureteroscopy or SWL when intervention is indicated.', 'Location and size determine spontaneous passage probability and procedure choice.', ['Use symptom burden, obstruction, renal function and infection risk to decide intervention timing.'], [], ['EAU Urolithiasis 2026']);
  if(v.site==='Proximal ureter') return planBlock('Proximal ureter stone pathway','Urolithiasis','Select SWL or ureteroscopy according to stone size, anatomy, obstruction, prior treatment and patient preference; use ureteroscopy more readily when rapid definitive clearance is required.', 'Both modalities are established options, but stone and patient factors shift the balance.', [], ['Do not use medical expulsive therapy to delay urgent treatment when infection or threatened renal function is present.'], ['EAU Urolithiasis 2026']);
  return planBlock('Renal stone pathway','Urolithiasis','Match treatment to stone size, location, anatomy and patient factors: SWL, flexible ureteroscopy/RIRS and PCNL occupy complementary roles.', 'Intervention modality should be individualised according to stone burden, location, calyceal anatomy, radiologic attenuation and patient-specific factors.', [], ['Pre-op urine culture and bleeding/antithrombotic planning matter.'], ['EAU Urolithiasis 2026']);
}
function prostateOracle(v){
  if(v.state==='Localized'){
    if(['T3a','T3b','T4'].includes(v.ct)||v.cn==='N1') return planBlock('Locally advanced prostate cancer','Prostate — high-risk/local advanced','Use multimodal management: definitive radiotherapy + long-course ADT and/or surgery in selected patients according to stage, life expectancy, functional goals and nodal risk.','Extraprostatic or node-positive disease is not a simple low/intermediate-risk RP-only pathway.',['Assess MRI/biopsy details and nodal risk before choosing local therapy.'],[],['EAU Prostate Cancer 2026']);
    if((+v.psa||0)>20||["4","5"].includes(v.gg)) return planBlock('High-risk localized prostate cancer','Prostate — high risk','Discuss radical local therapy in appropriate candidates, usually surgery or definitive radiotherapy-based multimodal treatment; use stage, grade and PSA to refine the pathway.','High PSA and high grade materially change recurrence risk and adjuvant/salvage planning.',['Consider pelvic nodal assessment according to risk.'],[],['EAU Prostate Cancer 2026']);
    return planBlock('Localized prostate cancer — risk-stratified local management','Prostate','Choose active surveillance versus definitive local treatment using Grade Group, PSA, clinical stage, MRI/biopsy extent, life expectancy and patient preference.','No single variable should dominate the entire localized pathway.',['Active surveillance is central for appropriately selected low-risk disease.'],['Cribriform/intraductal carcinoma and adverse biopsy features can alter the apparent simple risk category.'],['EAU Prostate Cancer 2026']);
  }
  if(v.state==='BCR after RP'||v.state==='BCR after RT') return planBlock('Biochemical recurrence — local salvage vs systemic branch','Prostate BCR','Confirm the recurrence pattern, use PSA kinetics and advanced imaging selectively, and distinguish potentially curable local salvage candidates from systemic-risk disease.','Treatment after RP differs from treatment after primary RT; salvage decisions are not interchangeable.',['PSMA-PET can change the anatomical target set but should not replace clinical judgement.'],['Record PSA nadir, PSA doubling time and prior local treatment.'],['EAU Prostate Cancer 2026']);
  if(v.state==='mHSPC') return planBlock('Metastatic hormone-sensitive prostate cancer','Prostate mHSPC','ADT plus intensification with an androgen-receptor pathway inhibitor and/or docetaxel is the evidence-based backbone; triplet therapy is considered in selected fit patients with de novo/high-burden disease.','Modern standards have moved away from ADT monotherapy for most fit men with metastatic disease.',['Use tumour volume, symptoms, comorbidity and prior exposure to choose the regimen.'],['Document prior prostate radiotherapy and metastatic distribution.'],['EAU Prostate Cancer 2026']);
  if(v.state==='nmCRPC') return planBlock('Non-metastatic castration-resistant prostate cancer','Prostate nmCRPC','In high-risk nmCRPC, treatment options include a next-generation AR pathway inhibitor (e.g. apalutamide, darolutamide or enzalutamide) while continuing ADT, particularly with a short PSA doubling time.','PSA kinetics identify higher-risk nmCRPC.',['Continue testosterone suppression during ARPI treatment.'],['Confirm castrate testosterone and rule out imaging-defined metastatic disease.'],['EAU Prostate Cancer 2026']);
  if(v.state==='mCRPC'){
    if(v.hrr==='BRCA1/2') return planBlock('mCRPC with actionable HRR alteration','Prostate mCRPC — biomarker branch','Use a PARP-inhibitor pathway when the patient meets the relevant line-of-therapy and regulatory criteria; treatment selection depends on prior ARPI/chemotherapy exposure and the specific molecular alteration.','BRCA1/2 is the clearest HRR subgroup with clinically actionable PARP sensitivity.',['Use molecular testing early enough to preserve treatment options.'],['Avoid treating “HRR positive” as equivalent to BRCA1/2 in every indication.'],['EAU Prostate Cancer 2026']);
    if(v.priorARPI==='Yes'&&v.priorDoc==='Yes') return planBlock('Post-ARPI + post-docetaxel mCRPC','Prostate mCRPC — later line','Sequence an unused active mechanism based on prior exposure, disease pattern and biomarker status; options include cabazitaxel, PARP-directed therapy when eligible, radioligand therapy in PSMA-positive disease and other approved agents.','Prior exposure is the key branch point in mCRPC.',['Do not simply switch from one ARPI to another after unequivocal progression when a more active class is appropriate.'],['Review bone-targeted treatment, anaemia, pain and visceral disease.'],['EAU Prostate Cancer 2026']);
    return planBlock('mCRPC — exposure-directed sequencing','Prostate mCRPC','Continue ADT and select the next active therapy from the patient’s prior ARPI/docetaxel/HRR/PSMA exposure profile.','There is no single universally correct mCRPC sequence.',['Consider radioligand or PARP pathways when molecular/imaging criteria are met.'],['Recheck testosterone and review molecular testing.'],['EAU Prostate Cancer 2026']);
  }
  return planBlock('Prostate pathway incomplete','Prostate','Complete disease state and staging inputs.','The Oracle avoids extrapolating between localized, BCR, mHSPC, nmCRPC and mCRPC states.',[],[],['EAU Prostate Cancer 2026']);
}
function utucOracle(v){
  if(v.met==='M1') return planBlock('Metastatic UTUC','UTUC — systemic','Use an advanced urothelial carcinoma pathway with platinum/EV/ICI/biomarker sequencing according to prior exposure and renal function; FGFR-directed therapy may be relevant when altered.','Metastatic UTUC is treated within the broader urothelial systemic framework.',['Clinical trials and multidisciplinary review are particularly valuable.'],[],['EAU UTUC 2026']);
  if(v.risk==='Low-risk phenotype') return planBlock('Low-risk UTUC — kidney-sparing pathway','UTUC — low risk','Offer kidney-sparing endoscopic ablation/resection or selected segmental/distal ureterectomy with rigorous second-look and surveillance when feasible.','Low-risk phenotype supports organ preservation when oncologically safe.',['Radical nephroureterectomy remains available if endoscopic control is not feasible.'],['Document tumour size, focality, grade/cytology and imaging risk factors.'],['EAU UTUC 2026']);
  if(v.risk==='High-risk phenotype') return planBlock('High-risk UTUC — radical local therapy + perioperative systemic assessment','UTUC — high risk','Radical nephroureterectomy with complete bladder cuff is the standard local operation for suitable high-risk disease; perioperative platinum chemotherapy should be assessed in the appropriate patient window, with adjuvant chemotherapy remaining relevant when indicated.','High-risk UTUC has a higher probability of occult invasive/nodal disease.',['Imperative kidney-sparing surgery may be considered in selected solitary-kidney/CKD situations.'],['Ensure accurate distal ureter/bladder cuff planning and postoperative surveillance.'],['EAU UTUC 2026']);
  return planBlock('UTUC risk clarification needed','UTUC','Complete the risk assessment from imaging, tumour size, cytology, biopsy grade, focality, hydronephrosis and invasion suspicion.', 'The treatment split is risk based.', [], [], ['EAU UTUC 2026']);
}
function penisOracle(v){
  if(v.cngroin==='cN3') return planBlock('cN3 penile SCC — multimodal nodal pathway','Penile cancer — advanced nodal','For chemotherapy-fit patients, use neoadjuvant cisplatin/taxane-based chemotherapy (TIP is a well-established regimen) followed by restaging and radical inguinal/pelvic nodal surgery in responders/resectable disease.', 'Bulky/bilateral/advanced nodal disease benefits from multimodal management.', ['Progressive/unresectable disease moves to systemic/palliative treatment and trial pathways.'], ['Document pelvic node involvement and chemotherapy fitness.'], ['EAU Penile Cancer 2026']);
  if(v.cngroin==='cN2') return planBlock('cN2 penile SCC — nodal treatment','Penile cancer — cN2','Use open radical inguinal lymph-node dissection for appropriate operable disease; in selected chemotherapy-fit patients with bulky/bilateral cN2 disease, discuss neoadjuvant TIP before nodal surgery.', 'cN2 disease carries substantial occult pelvic/distant risk.', ['Pelvic-node management is driven by positive inguinal-node burden and ENE after ILND.'], ['Avoid treating cN2 as a simple cN1 pathway.'], ['EAU Penile Cancer 2026']);
  if(v.cngroin==='cN1') return planBlock('cN1 penile SCC — invasive nodal staging/treatment','Penile cancer — cN1','Confirm nodal metastasis and perform appropriate inguinal node surgery (fascial-sparing or radical ILND according to disease and expertise).', 'Clinically positive groin nodes require definitive staging/treatment.', [], ['Plan the primary and groin operation together.'], ['EAU Penile Cancer 2026']);
  if(v.primary==='PeIN/Tis'||v.primary==='Ta'||v.primary==='T1a') return planBlock('Penile-preserving primary treatment','Penile cancer — superficial primary','Choose organ-sparing local treatment when oncologically safe (e.g. topical therapy for selected PeIN, laser/excision/glansectomy for appropriate invasive lesions) with margin and groin-risk assessment.', 'Superficial disease can often be controlled without immediate total penectomy.', ['Groin management depends on T stage, grade and LVI rather than primary tumour appearance alone.'], ['Document exact depth, grade and LVI.'], ['EAU Penile Cancer 2026']);
  return planBlock('Invasive penile primary — local + groin pathway','Penile cancer','Choose partial/total penectomy or organ-sparing surgery according to depth, extent and functional anatomy, while simultaneously defining the appropriate groin staging strategy.', 'Primary control and nodal control are separate but linked decisions.', [], ['Do not forget bilateral groin assessment when indicated.'], ['EAU Penile Cancer 2026']);
}
function testisOracle(v){
  if(v.stage==='I'&&v.hist==='Seminoma') return planBlock('Stage I seminoma','Testicular cancer — stage I','Active surveillance is appropriate for many compliant patients; selected alternatives include single-dose carboplatin. Routine adjuvant radiotherapy is generally avoided.', 'Most stage I seminoma patients can be cured with surveillance or limited adjuvant therapy.', [], ['Adherence to follow-up is essential.'], ['EAU Testicular Cancer 2026']);
  if(v.stage==='I'&&v.hist==='NSGCT') return planBlock('Stage I NSGCT','Testicular cancer — stage I',v.lvi==='Yes'?'Discuss surveillance, one cycle BEP or nerve-sparing RPLND according to relapse risk and patient factors.':'Surveillance is an appropriate pathway for many patients.', 'LVI meaningfully shifts relapse risk in stage I NSGCT.', [], ['Record post-orchiectomy markers and pathology carefully.'], ['EAU Testicular Cancer 2026']);
  if(v.stage==='IIA/IIB'&&v.hist==='NSGCT'&&v.markers==='Normal') return planBlock('Marker-negative stage IIA/IIB NSGCT','Testicular cancer — stage II','Use expert-centre RPLND for appropriate marker-negative disease or systemic chemotherapy where indicated; very small equivocal nodes may require repeat imaging/staging before committing to therapy.', 'Marker-negative stage II NSGCT is a special surgical oncology phenotype.', [], ['Use a high-volume germ-cell centre when RPLND is selected.'], ['EAU Testicular Cancer 2026']);
  if(v.stage==='IIC/III') return planBlock('Metastatic germ-cell tumour','Testicular cancer — IGCCCG','Use IGCCCG risk to select cisplatin-based chemotherapy (typical good-risk: BEP ×3 or EP ×4; intermediate/poor: BEP ×4, with VIP ×4 as a bleomycin-free option in appropriate cases).', 'Chemotherapy intensity is risk adapted.', ['Post-chemotherapy residual masses require histology-specific management.'], ['Do not base treatment solely on radiographic mass size without markers and histology.'], ['EAU Testicular Cancer 2026']);
  return planBlock('Testicular pathway incomplete','Testicular cancer','Complete histology and stage.', 'The stage determines whether the pathway is surveillance, RPLND or chemotherapy.', [], [], ['EAU Testicular Cancer 2026']);
}
function kidneyOracle(v){
  if(v.met==='M0'){
    if(v.hist==='Clear-cell RCC'&&v.recur==='Yes') return planBlock('Localized ccRCC — adjuvant risk branch','RCC — adjuvant','Discuss adjuvant pembrolizumab after nephrectomy in KEYNOTE-564-defined risk groups (pT2 grade 4/sarcomatoid, pT3, pT4, pN+, or selected M1 NED after resection of oligometastases within one year), after restaging and shared decision-making.', 'The benefit is risk- and histology-defined, not an automatic add-on for all RCC.', ['Weigh overtreatment and immune-related toxicity against recurrence risk.'], [], ['EAU RCC 2026']);
    if(v.t==='T1a') return planBlock('T1a RCC — nephron-sparing / surveillance branch','RCC — localized','Partial nephrectomy is preferred when feasible; active surveillance and thermal ablation are options for selected small renal masses, particularly in frail/comorbid patients.', 'Small renal masses often allow more than one safe management strategy.', ['Use nephrometry to plan complexity, not as a standalone indication for radical surgery.'], ['Consider hereditary risk and renal function.'], ['EAU RCC 2026']);
    return planBlock('Localized RCC — surgical pathway','RCC — localized','Use partial nephrectomy for suitable T1 disease; radical nephrectomy is appropriate for selected larger/complex tumours when nephron-sparing surgery is not reasonable.', 'The key operative question is whether nephron-sparing surgery is technically and oncologically safe.', ['Do not perform routine adrenalectomy or lymph-node dissection solely because the tumour is T2/T3.'], [], ['EAU RCC 2026']);
  }
  if(v.hist==='Clear-cell RCC') return planBlock('Metastatic clear-cell RCC','RCC — metastatic','Select an IO-containing combination or another guideline-supported first-line regimen according to IMDC risk, comorbidity and contraindications; cytoreductive nephrectomy is a selective/deferred decision rather than an automatic first step.', 'Modern metastatic RCC management is systemic-therapy led for most patients.', ['After progression, use an unused VEGF-TKI class and consider belzutifan in later-line settings as appropriate.'], [], ['EAU RCC 2026']);
  return planBlock('Metastatic non-clear-cell RCC','RCC — non-clear-cell','Use histology-specific systemic therapy and expert pathology/MDT review; papillary RCC has the strongest prospective evidence base for cabozantinib among non-clear-cell subtypes.', 'Histology materially affects the evidence base.', ['Clinical-trial participation is especially valuable.'], [], ['EAU RCC 2026']);
}
function urethralCancerOracle(v){
  if(v.met==='M1') return planBlock('Metastatic primary urethral carcinoma','Urethral cancer — metastatic','Use histology-directed systemic therapy: urothelial histology follows advanced urothelial pathways; SCC/adenocarcinoma require site/histology-specific multimodality treatment.','Primary urethral carcinoma is rare and site/histology strongly affect therapy.', ['Expert-centre multidisciplinary care and clinical trials are particularly important.'], [], ['EAU Primary Urethral Cancer 2026']);
  if(v.resect==='Yes') return planBlock('Localized resectable urethral carcinoma','Urethral cancer — localized','Choose urethra-preserving excision, urethrectomy/penectomy, or larger pelvic surgery according to site, T stage, histology and margins; add nodal treatment and/or chemoradiation when appropriate.', 'Anterior, posterior/prostatic and female urethral tumours have different surgical anatomy and lymphatic drainage.', [], ['TNM 9/site-specific staging and margin planning are essential.'], ['EAU Primary Urethral Cancer 2026']);
  return planBlock('Unresectable localized urethral carcinoma','Urethral cancer — unresectable','Use expert-centre multimodal chemoradiation/systemic downstaging, then re-image and reassess resectability.', 'Unresectable disease should not be subjected to an improvised local-only operation.', [], [], ['EAU Primary Urethral Cancer 2026']);
}
function adrenalOracle(v){
  if(v.lesion==='Pheochromocytoma/PPGL') return planBlock('Pheochromocytoma / PPGL pathway','Adrenal','Complete biochemical confirmation, genetic assessment and pre-operative alpha blockade/volume preparation before adrenalectomy when indicated.', 'Secretory adrenal tumours require physiologic preparation before surgery.', ['Do not biopsy before pheochromocytoma is excluded.'], ['If hormonally active, coordinate endocrine/anaesthesia planning.'], []);
  if(v.pheo!=='Yes') return planBlock('Biochemical safety gate before adrenal biopsy/surgery','Adrenal','Exclude pheochromocytoma before biopsy or adrenal intervention when clinically indicated; complete hormonal assessment and review imaging phenotype first.', 'A functional adrenal lesion changes procedural safety.', ['Never biopsy a potentially functional adrenal mass before pheochromocytoma is excluded.'], [], []);
  if(v.lesion==='Suspected ACC'||v.imaging==='Suspicious/invasive') return planBlock('Suspected adrenocortical carcinoma','Adrenal oncology','Refer to an expert adrenal MDT; open en-bloc oncologic resection is the core curative operation when resectable, with mitotane/platinum-based systemic options for advanced disease as appropriate.', 'Aggressive local biology and adjacent-organ/vascular anatomy often require specialist management.', [], ['Avoid tumour violation and unplanned biopsy.'], []);
  return planBlock('Adrenal incidentaloma — endocrine + imaging triage','Adrenal','Classify function and imaging phenotype; most benign-appearing, non-functional lesions can be managed without immediate surgery, while indeterminate/suspicious or functional lesions require risk-adapted endocrine/surgical review.', 'Management depends on both function and malignant potential.', [], ['Use an adrenal-protocol imaging interpretation rather than a single HU threshold in isolation.'], []);
}
function showOracleMDT(name){
  const v={...oracleState}; const missing=oracleIncomplete(name,v); const stage=name==='Ca Bladder'?deriveBladder(v):name==='BPH / Male LUTS'?deriveBph(v):name==='Stone Disease'?deriveStone(v):'';
  const txt=`<div class="text-sm leading-6"><b>${esc(name)}</b><br>Decision layer: <b>${esc(stage||'phenotype-based')}</b><br>Missing: ${missing.length?esc(missing.join(', ')):'none'}<br><br><b>Inputs</b><br>${Object.entries(v).filter(([,x])=>x!==''&&x!=null).map(([k,x])=>`${esc(k)} = ${esc(x)}`).join('<br>')||'No inputs entered.'}</div>`;
  modal('MDT snapshot',txt);
}
function teachOracle(name){
  const v={...oracleState};
  let text='';
  if(name==='Urethral Stricture') text='<div class="text-sm leading-6"><b>Why the stricture engine is strict:</b><br>• Length matters: long strictures should not be treated with DVIU/dilatation alone.<br>• Location matters: penile strictures are not a routine DVIU problem.<br>• Recurrence matters: repeated instrumentation can increase complexity and delay urethroplasty.<br>• Posterior/VUAS/BNS disease follows a different anatomy-specific algorithm.</div>';
  else if(name==='Ca Bladder') text='<div class="text-sm leading-6"><b>Why the bladder engine is different:</b><br>• T and M derive the disease layer; there is no parallel “NMIBC/MIBC” dropdown.<br>• Cisplatin status is constructed from explicit Galsky criteria.<br>• 2026 bladder decisions must also recognise modern EV + pembrolizumab perioperative evidence/label changes.<br>• BCG failure is classified by adequacy and timing, not by the word “recurrence” alone.</div>';
  else text=`<div class="text-sm leading-6"><b>${esc(name)} — learning mode</b><br>The engine deliberately asks for the clinical variables that change the branch and exposes the rationale/alternatives alongside the plan. Use the Disease Encyclopaedia for the detailed background section.</div>`;
  modal('Teach me',text);
}
function procedureForCurrent(name,v){
  if(name==='Urethral Stricture') return 'DVIU';
  if(name==='Stone Disease') return v.site==='Kidney'?(v.staghorn==='Yes'||v.size==='>20 mm'?'PCNL':'RIRS'):'URSL';
  if(name==='BPH / Male LUTS') return v.size==='>80 mL'?'HoLEP':'TURP';
  if(name==='Ca Bladder') return ['T2','T3','T4a'].includes(v.t)?'Radical cystectomy + PLND':'TURBT';
  if(name==='Ca Kidney') return v.t==='T1a'?'Partial nephrectomy':'Radical nephrectomy';
  if(name==='UTUC') return 'Radical nephroureterectomy';
  if(name==='Ca Prostate') return 'Radical prostatectomy';
  if(name==='Ca Penis') return 'Inguinal lymph-node dissection';
  if(name==='Ca Testis') return 'RPLND';
  return 'RIRS';
}
function openOracle(){
  ["homeView","diseaseView","calcView","drugView","trialView","searchView","procedureView"].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add("hidden")});
  document.getElementById('oracleView').classList.remove('hidden');
  const sel=document.getElementById('oracleDisease');
  const names=Object.keys(ORACLE_FIELDS);
  sel.innerHTML='<option value="">Select clinical condition...</option>'+names.map(n=>`<option>${esc(n)}</option>`).join('');
  sel.onchange=()=>{oracleState={};renderOracleForm();};
  if(!sel.value) sel.value='Ca Bladder';
  oracleState={};
  renderOracleForm();
  const out=document.getElementById('oracleOutput'); if(out)out.innerHTML='<div class="text-sm font-black">Management output</div><div class="text-xs text-slate-500 mt-1">Complete explicit decision inputs to generate an evidence-linked pathway.</div>';
}

function openProcedureAtlas(preselect){
  ["homeView","diseaseView","oracleView","calcView","drugView","trialView","searchView"].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('hidden')});
  document.getElementById('procedureView').classList.remove('hidden');
  const sel=document.getElementById('procedureSelect');
  sel.innerHTML=Object.keys(PROCEDURES).map(k=>`<option>${esc(k)}</option>`).join('');
  if(preselect&&PROCEDURES[preselect])sel.value=preselect;
  renderProcedure();
}
function renderProcedure(){
  const k=document.getElementById('procedureSelect').value,d=PROCEDURES[k];if(!d)return;
  const steps=(d.steps||[]).map((x,i)=>`<div class="step mb-2"><b>${i+1}. ${esc(x)}</b></div>`).join('');
  document.getElementById('procedureContent').innerHTML=`<div class="grid lg:grid-cols-3 gap-4"><div class="card p-4"><div class="section-title">Indication</div><p class="text-sm leading-6 mt-2">${esc(d.indications)}</p><div class="section-title mt-4">Setup / pre-op</div>${d.setup.map(x=>`<div class="step mt-2 text-sm">${esc(x)}</div>`).join('')}</div><div class="card p-4 lg:col-span-2"><div class="section-title">Operative sequence</div><div class="mt-3">${steps}</div></div><div class="card p-4"><div class="section-title">Critical checkpoints / pitfalls</div>${d.checkpoints.map(x=>`<div class="warn mt-2 text-sm">${esc(x)}</div>`).join('')}</div><div class="card p-4 lg:col-span-2"><div class="section-title">Finish / documentation</div>${d.finish.map(x=>`<div class="ok mt-2 text-sm">${esc(x)}</div>`).join('')}</div></div>`;
}

/* ======================= END FINAL CLINICAL ORACLE V9 ======================= */
function calcISUPDeep(){
 const p=+document.getElementById("igPrimary").value,s=+document.getElementById("igSecondary").value,t=document.getElementById("igTertiary").value,p4=+document.getElementById("igP4").value||0,idc=document.getElementById("igIDC").checked;
 if(!p||!s){document.getElementById("isupOut").innerHTML=`<div class="warn text-xs">Select both primary and secondary patterns.</div>`;return}
 const sum=p+s; let gg=sum<=6?1:sum===7?(p===3?2:3):sum===8?4:5;
 let note=`Gleason ${p}+${s}=${sum} → ISUP Grade Group ${gg}.`;
 if(t==="5" && gg<5) note+=` Tertiary pattern 5 is present: report it explicitly in the radical-prostatectomy specimen; do not simply discard it.`;
 if(idc) note+=` Cribriform/intraductal carcinoma is an adverse pathologic feature and should be explicitly recorded; it can influence risk beyond the numeric GG.`;
 if(p4) note+=` Pattern-4 percentage = ${p4}%; percentage pattern 4 is a prognostic descriptor, not a separate ISUP Grade Group.`;
 document.getElementById("isupOut").innerHTML=`<div class="ok text-sm leading-6">${esc(note)}</div>`;
}
function calcPSAD(){const p=+document.getElementById("psa").value,v=+document.getElementById("vol").value;if(p>0&&v>0){const x=p/v;document.getElementById("psadOut").innerHTML=`<div class="ok text-sm">PSA density = <b>${x.toFixed(3)} ng/mL/cc</b><br>Use the value with PI-RADS and clinical suspicion; do not use 0.15 as an automatic biopsy switch for every patient.</div>`}}
function calcEORTC(){
 const rec=+erTumors.value + +erSize.value + +erRec.value + +erT.value + +erCIS.value + +erG.value;
 const prog=+erTumors.value + +erRec.value + +erSize.value + +erT.value + +erCIS.value + +erG.value;
 const recRisk=rec===0?"1-y 15%, 5-y 31%":rec<=4?"1-y 24%, 5-y 46%":rec<=9?"1-y 38%, 5-y 62%":"1-y 61%, 5-y 78%";
 const progRisk=prog===0?"1-y 0.2%, 5-y 0.8%":prog<=6?"1-y 1.0%, 5-y 6%":prog<=13?"1-y 5%, 5-y 17%":"1-y 17%, 5-y 45%";
 eortcOut.innerHTML=`<div class="rule text-sm">Recurrence score <b>${rec}/17</b> — ${recRisk}<br>Progression score <b>${prog}/23</b> — ${progRisk}</div><div class="text-[11px] text-slate-500 mt-2">Historic EORTC 2006 tables. Current EAU 2026 uses the 4-group EAU model for progression and continues to reference EORTC/CUETO for selected prognostic use.</div>`;
}
function calcEAURisk(){
 const stage=erxStage.value, grade=erxGrade.value, cis=erxCIS.checked, adv=erxVHI.checked, age=erxAge.value==="gt70", mult=erxMult.value==="multi", size=erxSize.value==="ge3", recurrent=erxStatus.value==="recurrent";
 const rf=[age,mult,size].filter(Boolean).length;
 let risk="Intermediate", reason="Residual group after applying the published EAU 2021 four-group rules.";
 // Published EAU 2021 core composition. Recurrent tumours cannot be placed in the low-risk group.
 if(adv){risk="Very High"; reason="Prostatic-urethral CIS, LVI or defined aggressive variant histology is assigned to the very-high-risk pathway.";}
 else if(cis && ((stage==="Ta"&&grade==="HG3"&&rf===3)||(stage==="T1"&&grade==="LG2"&&rf>=2)||(stage==="T1"&&grade==="HG3"&&rf>=1))){risk="Very High";reason="CIS + stage/grade + required number of additional clinical risk factors.";}
 else if(stage==="T1"&&grade==="HG3"&&!cis&&rf===3){risk="Very High";reason="T1 HG/G3 without CIS plus all three additional clinical risk factors.";}
 else if(cis){risk="High";reason="CIS without the published very-high-risk combination.";}
 else if(stage==="T1"&&grade==="HG3"){risk="High";reason="T1 HG/G3 is high risk unless the very-high-risk criteria are met.";}
 else if((stage==="Ta"&&grade==="LG2"||stage==="T1"&&grade==="LG1")&&!cis&&rf===3){risk="High";reason="Ta LG/G2 or T1 G1 with all three additional risk factors.";}
 else if((stage==="Ta"&&grade==="HG3"||stage==="T1"&&grade==="LG1")&&!cis&&rf>=2){risk="High";reason="Ta HG/G3 or T1 LG without CIS plus at least two additional risk factors.";}
 else if(stage==="T1"&&grade==="LG2"&&!cis&&rf>=1){risk="High";reason="T1 G2 without CIS plus at least one additional risk factor.";}
 else if(!recurrent && stage==="T1"&&grade==="LG1"&&!cis&&rf===0){risk="Low";reason="Primary, single, T1 LG/G1 tumour <3 cm without CIS in a patient ≤70 years (EAU low-risk definition).";}
 else if(!recurrent && stage==="Ta"&&grade==="LG1"&&!cis&&rf<=1){risk="Low";reason="Primary low-grade Ta/T1 profile without CIS and with ≤1 additional risk factor, or primary single small low-risk tumour.";}
 else if(recurrent) {risk="Intermediate";reason="Recurrent tumours are excluded from low-risk by the EAU model and are assigned to intermediate/high/very-high according to their other prognostic factors.";}
 eauriskOut.innerHTML=`<div class="${risk==='Very High'?'warn':risk==='High'?'rule':risk==='Intermediate'?'alt':'ok'} text-sm"><b>EAU 2021 four-group risk: ${risk}</b><br>${esc(reason)}</div><div class="text-[11px] text-slate-500 mt-2">Three additional clinical risk factors: age &gt;70, multiple papillary tumours, tumour diameter &gt;3 cm. The published model is based on WHO 1973 or WHO 2004/2016 grading. Current EAU 2026 NMIBC guidance retains/updates the risk framework and adds phenotype-specific BCG-unresponsive tables.</div>`;
}
function calcIMDC(){let n=0;["imdcKPS","imdcHb","imdcCa","imdcNeut","imdcPlate","imdcTime"].forEach(id=>{if(document.getElementById(id).checked)n++});let r=n===0?"Favorable":n<=2?"Intermediate":"Poor";imdcOut.innerHTML=`<div class="ok text-sm">IMDC = <b>${n}</b> → <b>${r} risk</b></div>`}
function calcRENAL(){const n=+rr.value + +re.value + +rn.value + +rl.value;renalOut.innerHTML=`<div class="ok text-sm">Core RENAL score = <b>${n}</b> (A/P/X is a descriptor; add suffix h when the lesion abuts the main hilar vessels). Higher score = greater anatomic complexity.</div>`}
function calcGSS(){gssOut.innerHTML=`<div class="ok text-sm">Guy's Stone Score <b>Grade ${gss.value}</b>. Use as a surgical complexity descriptor, not a stone-free guarantee.</div>`}
function calcClavien(){cdOut.innerHTML=`<div class="ok text-sm"><b>Clavien–Dindo ${cd.value}</b></div>`}

function searchAll(){
 const q=document.getElementById("globalSearch").value.trim().toLowerCase(); if(q.length<2){if(!document.getElementById("homeView").classList.contains("hidden"))return;showHome();return}
 ["homeView","diseaseView","oracleView","calcView","drugView","trialView"].forEach(id=>document.getElementById(id).classList.add("hidden"));document.getElementById("searchView").classList.remove("hidden");
 let rows=[];
 Object.entries(DISEASES).forEach(([d,dat])=>dat.sections.forEach(s=>s.items.forEach(it=>{const hay=(d+" "+s.title+" "+it[0]+" "+it[1]).toLowerCase();if(hay.includes(q))rows.push({d,s:s.title,q:it[0],a:it[1]})})));
 DRUGS.forEach(x=>{if(x.join(" ").toLowerCase().includes(q))rows.push({d:"Drug library",s:x[0],q:x[1],a:x[2]})});
 TRIALS.forEach(x=>{if(x.join(" ").toLowerCase().includes(q))rows.push({d:x[0],s:x[3],q:x[1],a:x[2]})});
 document.getElementById("searchMeta").textContent=`${rows.length} match(es) for "${q}"`;
 document.getElementById("searchResults").innerHTML=rows.length?rows.map(r=>cardHTML(r.d,r.s,[r.q,r.a])).join(""):`<div class="card p-6 text-sm text-slate-500">No matching protocol found.</div>`;
}

renderHome();


/* ===== 2026 COMPREHENSIVE ADDENDUM / DECISION ENGINE =====
 * The app is intentionally a structured paraphrase/decision-support layer, not a reproduction of NCCN/EAU copyrighted text.
 */
