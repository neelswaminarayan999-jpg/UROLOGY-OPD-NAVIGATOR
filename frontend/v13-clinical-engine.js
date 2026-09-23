/* Urology Oracle V13.1 — deterministic safety/provenance/rules layer.
   This layer validates inputs and records provenance; it does not replace the large
   V12/V13 clinical corpus already embedded in index.html. Online AI remains online-only.
*/
(function(){
'use strict';
const VERSION='13.3.0';
const GUIDELINE_SET={EAU:'2026',TNM:'9th edition where adopted by the relevant 2026 guideline'};
const RULE_META={
  prostate:{version:'EAU-PCa-2026',source:'EAU Prostate Cancer 2026'},
  bladder:{version:'EAU-NMIBC/MIBC-2026',source:'EAU NMIBC + MIBC/Metastatic Bladder Cancer 2026'},
  utuc:{version:'EAU-UTUC-2026',source:'EAU UTUC 2026'},
  urethralStricture:{version:'EAU-US-2026',source:'EAU Urethral Strictures 2026'},
  stones:{version:'EAU-UROL-2026',source:'EAU Urolithiasis 2026'},
  infections:{version:'EAU-UI-2026',source:'EAU Urological Infections 2026'},
  maleLuts:{version:'EAU-MALE-LUTS-2026',source:'EAU Non-neurogenic Male LUTS 2026'},
  general:{version:'ORACLE-RULES-13.1',source:'Urology Oracle V13.1 deterministic safety layer'}
};
const DRUGS={
 cisplatin:{name:'Cisplatin',renalGate:'Calculate CrCl/eGFR and apply disease-specific cisplatin fitness rule; do not infer from a single creatinine value.',monitor:['CBC','creatinine/CrCl','electrolytes','magnesium','hearing when clinically indicated','neuropathy'],warnings:['nephrotoxicity','ototoxicity','peripheral neuropathy']},
 gemcitabine:{name:'Gemcitabine',monitor:['CBC','renal function','hepatic function'],warnings:['myelosuppression','pulmonary/hepatic toxicity']},
 pembrolizumab:{name:'Pembrolizumab',monitor:['CBC','renal function','hepatic function','thyroid function'],warnings:['immune-mediated toxicity']},
 enfortumab:{name:'Enfortumab vedotin',monitor:['CBC','renal function','glucose','skin/neurologic assessment'],warnings:['rash','neuropathy','hyperglycaemia','ocular toxicity']},
 docetaxel:{name:'Docetaxel',monitor:['CBC','hepatic function'],warnings:['neutropenia','fluid retention','hypersensitivity']},
 cabazitaxel:{name:'Cabazitaxel',monitor:['CBC','renal/hepatic function'],warnings:['neutropenia','febrile neutropenia','diarrhoea']},
 tamsulosin:{name:'Tamsulosin',monitor:['blood pressure','orthostatic symptoms'],warnings:['postural hypotension','ejaculatory disturbance']},
 dutasteride:{name:'Dutasteride',monitor:['PSA interpretation','sexual adverse effects'],warnings:['sexual adverse effects','PSA reduction requiring interpretation']}
};
function uniq(a){return [...new Set(a.filter(Boolean))];}
function value(v,k){return v&&v[k]!=null?String(v[k]).trim():'';}
function bladderStage(v){const t=value(v,'t'),m=value(v,'m');if(m==='M1')return'METASTATIC';if(t==='T4b')return'LOCALLY ADVANCED / UNRESECTABLE';if(['T2','T3','T4a'].includes(t))return'MIBC';if(['Ta','Tis','T1'].includes(t))return'NMIBC';return'INCOMPLETE';}
function galsky(v){const c=[
 ['ECOG PS ≥2',value(v,'g_ecog')!==''?Number(v.g_ecog)>=2:null],
 ['CrCl <60 mL/min',value(v,'g_crcl')!==''?Number(v.g_crcl)<60:null],
 ['Grade ≥2 hearing loss',value(v,'g_hearing')!==''?v.g_hearing==='Grade ≥2':null],
 ['Grade ≥2 peripheral neuropathy',value(v,'g_neuro')!==''?v.g_neuro==='Grade ≥2':null],
 ['NYHA III–IV heart failure',value(v,'g_nyha')!==''?v.g_nyha==='NYHA III–IV':null]
 ];
 return {components:c,positive:c.filter(x=>x[1]===true).map(x=>x[0]),missing:c.filter(x=>x[1]===null).map(x=>x[0])};
}
function required(d,v){
 if(d==='Ca Bladder'){const s=bladderStage(v),r=['t','m'];if(s==='NMIBC')r.push('grade','cis','resect');if(['MIBC','METASTATIC','LOCALLY ADVANCED / UNRESECTABLE'].includes(s))r.push('rct','immuno','g_ecog','g_crcl','g_hearing','g_neuro','g_nyha');if(s==='MIBC'&&value(v,'nodes')==='')r.push('nodes');return r;}
 if(d==='Urethral Stricture')return ['sex','site','length','obliterative','primary'];
 if(d==='Stone Disease')return ['site','size','infection'];
 if(d==='BPH / Male LUTS')return ['bother','size'];
 return [];
}
function contradictions(d,v){const x=[];const add=(s)=>{if(!x.includes(s))x.push(s)};
 if(d==='Ca Bladder'){const s=bladderStage(v);if(value(v,'m')==='M0'&&/M1/.test(value(v,'nodes')))add('Nodal field appears to contain M1; check staging field mapping.');if(s==='MIBC'&&value(v,'grade')&&/low/i.test(value(v,'grade')))add('MIBC with low-grade-only input is internally unusual; verify pathology/staging.');const g=galsky(v);if(g.positive.length===0&&g.missing.length===0&&value(v,'cisplatin')==='No')add('Cisplatin status says No despite no classic Galsky-unfit criterion; verify additional contraindications or data.');}
 if(d==='Urethral Stricture'){if(value(v,'length')==='Short (<2 cm)'&&value(v,'obliterative')==='Complete obliteration')add('Short length does not override complete obliteration; confirm lumen status and reconstructive plan.');if(value(v,'site')==='Penile'&&value(v,'treatment')==='DVIU')add('Penile stricture + DVIU requires explicit specialist justification; verify anatomy and reconstructive pathway.');}
 if(d==='Stone Disease'){if(value(v,'infection')==='Yes'&&value(v,'definitive')==='Immediate definitive stone treatment')add('Obstructed infected system requires sepsis/drainage-first management; verify that definitive treatment is not being scheduled before source control.');}
 return x;}
function audit(d,v){
 const missing=uniq(required(d,v).filter(k=>value(v,k)===''));
 const contradictionsFound=contradictions(d,v);
 const stage=d==='Ca Bladder'?bladderStage(v):'';
 const g=d==='Ca Bladder'?galsky(v):null;
 return {version:VERSION,disease:d,stage,missing,contradictions:contradictionsFound,galsky:g,status:contradictionsFound.length?'CONTRADICTORY':missing.length?'INCOMPLETE':'READY'};
}
function provenance(d){return RULE_META[(d==='Ca Bladder'?'bladder':d==='UTUC'?'utuc':d==='Urethral Stricture'?'urethralStricture':d==='Stone Disease'?'stones':d==='BPH / Male LUTS'?'maleLuts':d==='Ca Prostate'?'prostate':'general')]||RULE_META.general;}
function renderBanner(a){let el=document.getElementById('v13ClinicalGate');if(!el){el=document.createElement('div');el.id='v13ClinicalGate';el.className='no-print';const target=document.querySelector('#oracleView .oracle-grid')||document.getElementById('oracleView');if(target)target.parentNode.insertBefore(el,target);}const p=provenance(a.disease);let cls=a.status==='READY'?'ok':a.status==='CONTRADICTORY'?'warn':'step';el.innerHTML=`<div class="${cls}" style="margin:8px 0;padding:10px 12px;border-radius:10px;font-size:11px;line-height:1.5"><b>V13 clinical gate: ${a.status}</b> · Rules ${p.version}<br>${a.missing.length?'<b>Missing:</b> '+a.missing.join(', ')+'<br>':''}${a.contradictions.length?'<b>Contradictions:</b> '+a.contradictions.join(' | ')+'<br>':''}<span style="opacity:.82">Source family: ${p.source}. AI is advisory only; clinician confirmation is required before Oracle handoff.</span></div>`;}
function decisionTrace(d,v,output){const a=audit(d,v),p=provenance(d);return {oracleVersion:VERSION,ruleSet:p,validation:a,inputs:Object.fromEntries(Object.entries(v||{}).filter(([,x])=>x!==''&&x!=null)),outputSummary:String(output||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,1600),timestamp:new Date().toISOString()};}
function install(){
 window.UROLOGY_ORACLE_V13={version:VERSION,guidelines:GUIDELINE_SET,rules:RULE_META,drugs:DRUGS,audit,decisionTrace,provenance,galsky,bladderStage};
 const old=window.runOracle;
 if(typeof old==='function'&&!old.__v13Wrapped){window.runOracle=function(name){const v=window.oracleState||{};const a=audit(name,v);renderBanner(a);if(a.status!=='READY'){const out=document.getElementById('oracleOutput');if(out)out.innerHTML=`<div class="warn"><b>Definitive pathway blocked.</b><div style="margin-top:8px">${a.missing.length?'<b>Missing:</b> '+a.missing.join(', ')+'<br>':''}${a.contradictions.length?'<b>Contradictions:</b> '+a.contradictions.join('<br>')+'<br>':''}<div style="margin-top:8px">Complete or reconcile the record before generating a definitive treatment plan.</div></div>`;return;}const result=old.apply(this,arguments);try{const out=document.getElementById('oracleOutput');if(out){const t=document.createElement('details');t.style.marginTop='12px';t.innerHTML='<summary style="cursor:pointer;font-weight:800">Decision trace & provenance</summary><pre style="white-space:pre-wrap;font-size:10px;margin-top:8px">'+JSON.stringify(decisionTrace(name,v,out.innerText),null,2).replace(/[<&>]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]))+'</pre>';out.appendChild(t);}}catch{}return result;};window.runOracle.__v13Wrapped=true;}
 const refresh=()=>{const d=document.getElementById('oracleDisease')?.value;if(d)renderBanner(audit(d,window.oracleState||{}));};document.addEventListener('DOMContentLoaded',()=>{refresh();setInterval(refresh,1200);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
