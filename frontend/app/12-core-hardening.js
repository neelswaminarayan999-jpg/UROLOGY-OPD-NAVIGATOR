/* Urology Oracle V14.1 — core UX/clinical hardening layer.
   Additive only: fixes action buttons, reset state, print layout, mobile menu
   layering, stone-selection modifiers, emergency stone guard, decision completeness,
   and high-use scoring references without replacing the existing Oracle corpus.
*/
(function(){
'use strict';

const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

function getState(){
  if(!window.oracleState || typeof window.oracleState!=='object') window.oracleState={};
  return window.oracleState;
}
function modal(title,subtitle,body){
  const old=document.getElementById('v141CoreModal'); if(old) old.remove();
  const back=document.createElement('div'); back.id='v141CoreModal'; back.className='no-print';
  back.style.cssText='position:fixed;inset:0;background:rgba(2,6,23,.66);z-index:100001;display:flex;align-items:flex-start;justify-content:center;padding:22px 12px;overflow:auto';
  const panel=document.createElement('div'); panel.style.cssText='width:min(1100px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(2,6,23,.38);padding:20px';
  const head=document.createElement('div'); head.style.cssText='display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px';
  const t=document.createElement('div'); t.innerHTML='<h2 style="margin:0;color:#0f172a;font-size:21px">'+esc(title)+'</h2><div style="color:#64748b;font-size:11px;line-height:1.5;margin-top:5px">'+esc(subtitle)+'</div>';
  const close=document.createElement('button'); close.textContent='Close'; close.style.cssText='border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer;background:#0f172a;color:#fff'; close.onclick=()=>back.remove();
  head.append(t,close); panel.append(head);
  const content=document.createElement('div'); content.innerHTML=body; panel.append(content); back.append(panel); document.body.append(back);
  back.addEventListener('click',e=>{if(e.target===back)back.remove();});
}

function styleCore(){
  if(document.getElementById('v141CoreStyle')) return;
  const s=document.createElement('style'); s.id='v141CoreStyle';
  s.textContent=`
    /* print-safe operative output */
    @media print{
      body{background:#fff!important;color:#000!important}
      nav,header,footer,.sidebar,.topbar,.ui-controls,.no-print,button,input,select,textarea,
      [role="navigation"],[role="tablist"],.v141-tool,#v141QuickTools{display:none!important}
      #oracleView,#operativeAtlasView,#followupView,#doseView,#scoresView{display:block!important;position:static!important}
      #oracleView *,#operativeAtlasView *{box-shadow:none!important;text-shadow:none!important}
      #oracleView .card,#operativeAtlasView .card{border:0!important;background:#fff!important}
      a{color:#000!important;text-decoration:none!important}
    }
    #oracleView .dropdown,#oracleView .select-wrap{position:relative;z-index:3}
    #oracleView .dropdown-menu,#oracleView [role="listbox"],#oracleView .menu,.dropdown-menu,.popover{z-index:10000!important}
    .v141-core-alert{border-left:5px solid #b91c1c;background:#fef2f2;color:#5b2a27;border-radius:10px;padding:12px;font-size:12px;line-height:1.6;margin-top:10px}
    .v141-core-note{border:1px solid #cbd5e1;background:#f8fafc;color:#475569;border-radius:10px;padding:10px;font-size:11px;line-height:1.55;margin-top:10px}
  `;
  document.head.appendChild(s);
}

function readOutput(){
  const el=document.getElementById('oracleOutput');
  return el ? (el.innerText||el.textContent||'').trim() : '';
}

function actionButtons(){
  return [...document.querySelectorAll('#oracleView button,#oracleView a,button,a,[role="button"]')];
}

function addTeachingModal(){
  const text=readOutput();
  const disease=document.getElementById('oracleDisease')?.value||'Selected disease';
  modal('Teach me — '+disease,'Educational interpretation of the currently displayed Oracle pathway · not a new treatment decision',
    '<div class="v141-core-note"><b>Use:</b> This teaching panel explains the logic already displayed by the Oracle. It does not create an independent treatment recommendation.</div>'+
    '<div style="margin-top:12px"><b style="font-size:12px">Current pathway output</b><pre style="white-space:pre-wrap;font:12px/1.6 inherit;color:#334155;background:#fbfdff;border:1px solid #dbe5ec;border-radius:10px;padding:12px;margin-top:6px">'+esc(text||'No treatment pathway has been generated yet.')+'</pre></div>'+
    '<div style="margin-top:12px"><b style="font-size:12px">Teaching framework</b><div class="v141-core-note">1) Confirm the diagnosis and stage/risk phenotype. 2) Check the required decision inputs and contradictions. 3) Apply disease-specific treatment criteria. 4) Review contraindications, complications and patient priorities. 5) Reconcile the final plan with local protocols and the treating team.</div></div>');
}
function addMdtModal(){
  const text=readOutput();
  const disease=document.getElementById('oracleDisease')?.value||'Selected disease';
  modal('MDT summary — '+disease,'Structured multidisciplinary discussion template derived from the current Oracle pathway',
    '<div class="v141-core-note"><b>Working diagnosis / pathway</b><br>'+esc(text||'No treatment pathway has been generated yet.')+'</div>'+
    '<div class="v141-core-note"><b>MDT discussion checklist</b><br>• Diagnostic certainty and pathology/radiology adequacy<br>• TNM / grade / risk group and disease extent<br>• Treatment intent (curative / disease control / palliation)<br>• Surgical feasibility and alternatives<br>• Systemic therapy / radiation indications and contraindications<br>• Renal function, performance status, comorbidity and organ-specific safety<br>• Patient priorities, functional outcomes and fertility/sexual considerations where relevant<br>• Need for additional imaging, pathology review or molecular testing<br>• Follow-up and contingency plan</div>');
}

function bindCoreActions(){
  if(document.body.dataset.v141CoreActions==='1') return;
  document.body.dataset.v141CoreActions='1';
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a,[role="button"]'); if(!b) return;
    const txt=(b.innerText||b.textContent||'').trim().toLowerCase();
    if(txt==='mdt summary' || txt.includes('mdt summary')){ e.preventDefault(); e.stopImmediatePropagation(); addMdtModal(); return; }
    if(txt==='teach me' || txt.includes('teach me')){ e.preventDefault(); e.stopImmediatePropagation(); addTeachingModal(); return; }
    if(txt==='reset' || txt==='reset oracle' || txt.includes('reset')) {
      const view=b.closest('#oracleView'); if(!view) return;
      setTimeout(()=>{
        const out=document.getElementById('oracleOutput'); if(out) out.innerHTML='';
        const gate=document.getElementById('v13ClinicalGate'); if(gate) gate.innerHTML='';
        const comp=document.getElementById('v141DecisionCompleteness'); if(comp) comp.remove();
        const stone=document.getElementById('v141StoneModifiers'); if(stone) stone.remove();
        const state=getState(); delete state._v141Stone; delete state.stone_size_mm; delete state.stone_lower_pole; delete state.stone_hu; delete state.stone_ssd_cm; delete state.stone_sepsis;
      },50);
      setTimeout(()=>{
        const out=document.getElementById('oracleOutput'); if(out) out.innerHTML='';
      },250);
    }
  },true);
}













function openProstateRisk(){
  modal('Prostate cancer risk & ISUP calculator','EAU-style risk grouping using PSA, Grade Group and clinical T stage · verify the exact guideline/risk framework used locally',
    '<div class="v141-core-note">ISUP Grade Group mapping: GG1 = Gleason 3+3=6; GG2 = 3+4=7; GG3 = 4+3=7; GG4 = Gleason 8; GG5 = Gleason 9–10.</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px">'+
    '<input id="pcRiskPSA" type="number" step="0.1" min="0" placeholder="PSA (ng/mL)">'+
    '<select id="pcRiskGG"><option value="">Grade Group</option><option value="1">GG1</option><option value="2">GG2</option><option value="3">GG3</option><option value="4">GG4</option><option value="5">GG5</option></select>'+
    '<select id="pcRiskT"><option value="">Clinical T stage</option><option>cT1</option><option>cT2a</option><option>cT2b</option><option>cT2c</option><option>cT3</option><option>cT4</option></select>'+
    '</div><button id="pcRiskGo" style="margin-top:9px;border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer;background:#0f172a;color:#fff">Calculate risk group</button><div id="pcRiskOut" class="v141-core-note">Not calculated.</div>');
  setTimeout(()=>{document.getElementById('pcRiskGo').onclick=()=>{
    const psa=Number(document.getElementById('pcRiskPSA').value),gg=Number(document.getElementById('pcRiskGG').value),t=document.getElementById('pcRiskT').value;
    if(!Number.isFinite(psa)||!gg||!t){document.getElementById('pcRiskOut').innerHTML='<b>Enter PSA, Grade Group and clinical T stage.</b>';return;}
    const high=psa>20||gg>=4||t==='cT2c'||['cT3','cT4'].includes(t);
    const low=psa<10&&gg===1&&['cT1','cT2a'].includes(t);
    let group=high?'High-risk':low?'Low-risk':'Intermediate-risk';
    let subtype='';
    if(group==='Intermediate-risk'){
      const fav=(gg===2&&psa<10&&['cT1','cT2a','cT2b'].includes(t))||(gg===1&&psa>=10&&psa<=20&&['cT1','cT2a','cT2b'].includes(t))||(gg===1&&psa<10&&t==='cT2b');
      const unfav=(gg===2&&psa>=10&&psa<=20&&['cT1','cT2a','cT2b'].includes(t))||(gg===3&&['cT1','cT2a','cT2b'].includes(t));
      subtype=fav?' · favourable intermediate phenotype':unfav?' · unfavourable intermediate phenotype':' · intermediate group; verify the exact framework used';
    }
    document.getElementById('pcRiskOut').innerHTML='<b>'+group+'</b>'+subtype+'<br><span style="font-size:10px;color:#64748b">This calculator is a classification aid, not a treatment recommendation.</span>';
  };},0);
}

function openNephrometry(){
  modal('Nephrometry & stone complexity scores','Validated scoring references for renal-mass anatomy and PCNL stone complexity',
    '<div class="v141-core-note"><b>R.E.N.A.L. nephrometry</b><br>R ≤4 cm=1; >4 to <7 cm=2; ≥7 cm=3. E ≥50% exophytic=1; <50%=2; entirely endophytic=3. N ≥7 mm=1; >4 to <7 mm=2; ≤4 mm=3. A is a/p/x descriptor (no points). L: entirely beyond polar lines=1; crosses polar line=2; >50% across / crosses axial midline / entirely between polar lines=3. Total 4–12: low 4–6, intermediate 7–9, high 10–12 complexity.</div>'+
    '<div class="v141-core-note"><b>PADUA</b><br>Six numerical anatomic components: longitudinal location (superior/inferior 1; middle 2), exophytic rate (≥50% 1; <50% 2; endophytic 3), rim (lateral 1; medial 2), sinus involvement (no 1; yes 2), collecting-system relationship (no 1; dislocated/infiltrated 2), tumour size (≤4 cm 1; 4.1–7 cm 2; >7 cm 3). Anterior/posterior is a descriptor.</div>'+
    '<div class="v141-core-note"><b>Guy’s Stone Score</b><br>Grade I: solitary mid/lower-pole stone or solitary pelvic stone with simple anatomy. Grade II: solitary upper-pole stone, multiple stones with simple anatomy, or solitary stone with abnormal anatomy. Grade III: multiple stones with abnormal anatomy, calyceal diverticulum stone, or partial staghorn. Grade IV: staghorn calculus or any stone with spina bifida/spinal injury.</div>'+
    '<div class="v141-core-note"><b>S.T.O.N.E. nephrolithometry</b><br>Use the original PCNL scoring definitions from the validated reference rather than treating a simplified secondary schema as interchangeable. The components are stone size, tract length, obstruction, number of involved calyces and stone density.</div>');
}


function openTrials(){
  modal('Landmark trials — quick evidence map','Named pivotal studies for rapid teaching and pathway review · use the disease module for the actual treatment pathway',
    '<div class="v141-core-note"><b>Metastatic hormone-sensitive prostate cancer (mHSPC)</b><br>PEACE-1 and ARASENS evaluated intensified systemic therapy beyond ADT plus docetaxel. CHAARTED and LATITUDE established major doublet approaches; STAMPEDE is a platform trial evaluating multiple systemic strategies; ENZAMET evaluated enzalutamide-based intensification. Trial names are evidence landmarks, not standalone treatment rules.</div>'+
    '<div class="v141-core-note"><b>BCG-unresponsive NMIBC</b><br>KEYNOTE-057 evaluated pembrolizumab in high-risk BCG-unresponsive NMIBC. Current guideline pathways distinguish CIS-containing and papillary-only disease and continue to place radical cystectomy as the standard/preferred option for suitable high-risk BCG-unresponsive disease, with bladder-preserving options considered according to patient factors, availability and regulatory setting.</div>'+
    '<div class="v141-core-note"><b>Metastatic urothelial carcinoma</b><br>EV-302/KEYNOTE-A39 established enfortumab vedotin plus pembrolizumab as a first-line combination option for patients fit for combination therapy. CheckMate 901 established cisplatin/gemcitabine plus nivolumab as another evidence-based first-line option in selected cisplatin-eligible patients.</div>'+
    '<div class="v141-core-note"><b>Adjuvant ccRCC</b><br>KEYNOTE-564 defined the high-risk resected clear-cell RCC population studied for adjuvant pembrolizumab; eligibility should be checked explicitly against the trial framework rather than inferred from “post-nephrectomy” status.</div>');
}
function addGlobalSearch(){
  if(document.body.dataset.v141GlobalSearch==='1') return;
  document.body.dataset.v141GlobalSearch='1';
  const show=()=>{
    const old=document.getElementById('v141GlobalSearchModal'); if(old) old.remove();
    const back=document.createElement('div'); back.id='v141GlobalSearchModal'; back.className='no-print';
    back.style.cssText='position:fixed;inset:0;background:rgba(2,6,23,.58);z-index:100002;display:flex;align-items:flex-start;justify-content:center;padding:70px 12px';
    const panel=document.createElement('div'); panel.style.cssText='width:min(760px,100%);max-height:80vh;overflow:auto;background:#fff;border-radius:15px;box-shadow:0 25px 70px rgba(2,6,23,.35);padding:16px';
    const input=document.createElement('input'); input.id='v141SearchInput'; input.placeholder='Search disease, score, drug, trial, procedure…'; input.style.cssText='width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:10px;padding:11px;font-size:14px';
    const results=document.createElement('div'); results.style.cssText='margin-top:10px';
    panel.append(input,results); back.append(panel); document.body.append(back);
    const items=[...document.querySelectorAll('h1,h2,h3,h4,.section-title,button,a,.v141-tool')].filter(el=>!el.closest('#v141GlobalSearchModal')).map(el=>({el,text:(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim()})).filter(x=>x.text.length>1);
    const seen=new Set();
    const render=()=>{
      const q=input.value.trim().toLowerCase();
      const hits=items.filter(x=>!q||x.text.toLowerCase().includes(q)).filter(x=>{const k=x.text.slice(0,180);if(seen.has(k))return false;seen.add(k);return true;}).slice(0,30);
      results.innerHTML=hits.length?hits.map((x,i)=>'<button data-hit="'+i+'" style="display:block;width:100%;text-align:left;margin:4px 0;border:1px solid #e2e8f0;background:#fff;border-radius:9px;padding:9px;cursor:pointer;font-weight:700;color:#334155">'+esc(x.text.slice(0,180))+'</button>').join(''):'<div class="v141-core-note">No matching visible item.</div>';
      results.querySelectorAll('[data-hit]').forEach((b,i)=>b.onclick=()=>{const el=hits[i].el;back.remove();el.scrollIntoView({behavior:'smooth',block:'center'});});
    };
    input.addEventListener('input',render); input.addEventListener('keydown',e=>{if(e.key==='Escape')back.remove();}); render(); input.focus();
    back.addEventListener('click',e=>{if(e.target===back)back.remove();});
  };
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();show();}});
}

function addScoreLinks(){
  const grid=document.getElementById('v141QuickGrid'); if(!grid) return;
  const add=(id,title,sub,fn)=>{
    if(grid.querySelector('[data-core-tool="'+id+'"]')) return;
    const b=document.createElement('button'); b.type='button'; b.className='v141-tool'; b.dataset.coreTool=id; b.innerHTML='<b>'+esc(title)+'</b><span>'+esc(sub)+'</span>'; b.onclick=fn; grid.appendChild(b);
  };
  add('pc-risk','Prostate risk','ISUP Grade Group · PSA · cT stage',openProstateRisk);
  add('nephrometry','Nephrometry & stone scores','RENAL · PADUA · Guy’s · S.T.O.N.E. reference',openNephrometry);
  add('trials','Landmark trials','mHSPC · NMIBC · urothelial · RCC',function(){if(typeof window.openTrials==='function'&&window.openTrials!==openTrials)return window.openTrials();openTrials();});
}

function apply(){
  styleCore(); bindCoreActions(); addScoreLinks(); addGlobalSearch();
  /* V16: removed the second "Decision completeness" box (it counted field names the Oracle form does not use)
     and the separate stone-modifier box; stone decisions now go through the single stone engine. */
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
setTimeout(apply,1000); setTimeout(apply,2500);
})();