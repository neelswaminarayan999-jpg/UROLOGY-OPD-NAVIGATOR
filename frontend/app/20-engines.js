/* ===== v14.3-prostate-pathway ===== */
try{
/* Urology Oracle — prostate cancer clinical pathway.
   Targeted module: TNM + ISUP + PSA risk + treatment navigation.
   No global DOM rewriting; no AI/provider changes.
   Clinical content is a decision-support framework and requires clinician/MDT verification.
*/
(function(){
'use strict';

function esc(s){
  return String(s==null?'':s).replace(/[&<>"]/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];
  });
}
function q(id){return document.getElementById(id);}
function val(id){var e=q(id);return e?e.value:'';}
function num(id){var n=Number(val(id));return Number.isFinite(n)?n:null;}

function style(){
  if(q('v143ProstateStyle')) return;
  var s=document.createElement('style');
  s.id='v143ProstateStyle';
  s.textContent=
    '.v143-modal{position:fixed;inset:0;background:rgba(2,6,23,.68);z-index:100020;display:flex;align-items:flex-start;justify-content:center;padding:20px 12px;overflow:auto}'+
    '.v143-panel{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#fff;border-radius:16px;box-shadow:0 25px 80px rgba(2,6,23,.4);padding:18px;color:#172033}'+
    '.v143-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}'+
    '.v143-panel h2{margin:0;font-size:21px}.v143-sub{font-size:11px;color:#64748b;line-height:1.5;margin-top:5px}'+
    '.v143-section{border-top:1px solid #e8eef5;padding:12px 0}.v143-label{font-size:11px;font-weight:900;color:#17364d;margin-bottom:6px}'+
    '.v143-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'+
    '.v143-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'+
    '.v143-panel input,.v143-panel select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff;color:#173044}'+
    '.v143-btn{border:0;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer;background:#0f172a;color:#fff}'+
    '.v143-secondary{border:1px solid #cbd5e1;background:#fff;color:#173044}'+
    '.v143-note{border:1px solid #dbe4ee;background:#f8fafc;padding:11px;border-radius:10px;font-size:11px;line-height:1.6;margin-top:9px}'+
    '.v143-alert{border-left:5px solid #b91c1c;background:#fef2f2;padding:11px;border-radius:10px;color:#5b2a27;font-size:11px;line-height:1.6;margin-top:9px}'+
    '.v143-ok{border-left:5px solid #166534;background:#f0fdf4;padding:11px;border-radius:10px;color:#14532d;font-size:11px;line-height:1.6;margin-top:9px}'+
    '.v143-chip{display:inline-block;padding:4px 7px;border-radius:999px;background:#eef2ff;margin:2px 4px 2px 0;font-size:10px;font-weight:800}'+
    '@media(max-width:700px){.v143-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'+
    '@media(max-width:520px){.v143-grid,.v143-grid2{grid-template-columns:1fr}.v143-panel{padding:14px}}';
  document.head.appendChild(s);
}

function close(){
  var m=q('v143ProstateModal');
  if(m)m.remove();
}

function modal(body){
  close(); style();
  var back=document.createElement('div');
  back.id='v143ProstateModal'; back.className='v143-modal no-print';
  var p=document.createElement('div'); p.className='v143-panel';
  p.innerHTML=
    '<div class="v143-head"><div><h2>Prostate cancer pathway</h2><div class="v143-sub">TNM · ISUP Grade Group · PSA risk · localised / locally advanced / metastatic treatment navigation</div></div>'+
    '<button class="v143-btn v143-secondary" id="v143Close">Close</button></div>'+
    body;
  back.appendChild(p); document.body.appendChild(back);
  q('v143Close').onclick=close;
  back.addEventListener('click',function(e){if(e.target===back)close();});
}

function open(){
  modal(
    '<div class="v143-note"><b>Sequence:</b> establish pathology and Grade Group → clinical TNM → PSA/PSA density and tumour burden → risk group → treatment branch. Do not infer definitive treatment from PSA or Gleason score alone.</div>'+
    '<div class="v143-section"><div class="v143-label">Biopsy / pathology</div><div class="v143-grid">'+
      '<input id="v143PSA" type="number" min="0" step="0.01" placeholder="PSA (ng/mL)">'+
      '<input id="v143Gleason1" type="number" min="3" max="5" placeholder="Primary Gleason pattern (3–5)">'+
      '<input id="v143Gleason2" type="number" min="3" max="5" placeholder="Secondary Gleason pattern (3–5)">'+
      '<input id="v143PositiveCores" type="number" min="0" step="1" placeholder="Positive biopsy cores">'+
      '<input id="v143TotalCores" type="number" min="1" step="1" placeholder="Total biopsy cores">'+
      '<input id="v143MaxCorePct" type="number" min="0" max="100" step="1" placeholder="Maximum cancer/core (%)">'+
    '</div><div id="v143GradeResult" class="v143-note">Enter Gleason patterns to calculate ISUP Grade Group.</div></div>'+
    '<div class="v143-section"><div class="v143-label">Clinical staging</div><div class="v143-grid">'+
      '<select id="v143T"><option value="">Clinical T stage</option><option>T1c</option><option>T2a</option><option>T2b</option><option>T2c</option><option>T3a</option><option>T3b</option><option>T4</option></select>'+
      '<select id="v143N"><option value="">Clinical N stage</option><option>N0</option><option>N1</option></select>'+
      '<select id="v143M"><option value="">Clinical M stage</option><option>M0</option><option>M1</option></select>'+
      '<select id="v143M1"><option value="">If M1: metastatic pattern</option><option>M1a — non-regional lymph nodes</option><option>M1b — bone</option><option>M1c — other sites / visceral</option></select>'+
      '<select id="v143Life"><option value="">Estimated life expectancy</option><option>&gt;10 years</option><option>≤10 years</option></select>'+
      '<select id="v143Symptoms"><option value="">Symptoms / complications</option><option>No major cancer complication</option><option>Impending/actual spinal cord compression</option><option>Severe outlet obstruction / hydronephrosis</option><option>Other symptomatic advanced disease</option></select>'+
    '</div></div>'+
    '<div class="v143-section"><div class="v143-label">MRI / staging context</div><div class="v143-grid">'+
      '<input id="v143Volume" type="number" min="1" step="1" placeholder="Prostate volume (mL), optional">'+
      '<select id="v143MRI"><option value="">MRI / local staging</option><option>No MRI data</option><option>Organ-confined / no EPE</option><option>Extraprostatic extension suspected</option><option>Seminal vesicle invasion suspected</option></select>'+
      '<select id="v143Imaging"><option value="">Metastatic imaging</option><option>Conventional imaging</option><option>PSMA PET/CT available</option><option>Imaging incomplete</option></select>'+
    '</div><div id="v143PSADensity" class="v143-note">PSA density will appear when PSA and prostate volume are entered.</div></div>'+
    '<div class="v143-section"><button class="v143-btn" id="v143Generate">Generate prostate pathway</button></div>'+
    '<div id="v143Result"></div>'+
    '<div class="v143-note"><b>Evidence anchor:</b> EAU prostate guidance is updated for 2026. ISUP Grade Groups map Gleason 6 (3+3)→GG1, 7 (3+4)→GG2, 7 (4+3)→GG3, 8→GG4 and 9–10→GG5. Treatment selection remains dependent on stage, risk, life expectancy, comorbidity, patient priorities and MDT review.</div>'
  );
  q('v143Generate').onclick=generate;
  ['v143PSA','v143Gleason1','v143Gleason2','v143Volume'].forEach(function(id){
    q(id).addEventListener('input',updateLive);
  });
  updateLive();
}

function gradeGroup(g1,g2){
  if(!Number.isInteger(g1)||!Number.isInteger(g2)||g1<3||g1>5||g2<3||g2>5)return null;
  var sum=g1+g2;
  if(sum===6 && g1===3 && g2===3)return 1;
  if(sum===7 && g1===3 && g2===4)return 2;
  if(sum===7 && g1===4 && g2===3)return 3;
  if(sum===8)return 4;
  if(sum===9||sum===10)return 5;
  return null;
}

function updateLive(){
  var g=gradeGroup(Number(val('v143Gleason1')),Number(val('v143Gleason2')));
  var gr=q('v143GradeResult');
  if(gr){
    gr.innerHTML=g?'<b>ISUP Grade Group '+g+'</b> · Gleason '+val('v143Gleason1')+'+'+val('v143Gleason2')+' ('+(Number(val('v143Gleason1'))+Number(val('v143Gleason2')))+')':'Enter valid Gleason primary and secondary patterns (3–5).';
  }
  var psa=num('v143PSA'), vol=num('v143Volume'), pd=q('v143PSADensity');
  if(pd){
    if(psa!==null&&vol!==null&&vol>0)pd.innerHTML='<b>PSA density:</b> '+(psa/vol).toFixed(3)+' ng/mL/cc.';
    else pd.textContent='PSA density will appear when PSA and prostate volume are entered.';
  }
}

/* EAU-EANM-ESTRO-ESUR-ISUP-SIOG 2026, Table 3 (risk of biochemical recurrence, systematic biopsy):
   low = GG1 + PSA<10 + cT1-2; favourable intermediate = GG2 + PSA<10, or GG1 + PSA 10-20 (cT1-2);
   unfavourable intermediate = GG2 + PSA 10-20, or GG3 (cT1-2); high = GG4/5 or PSA>20;
   locally advanced = cT3-4 and/or cN+ (any GG, any PSA). The 2026 table no longer splits cT1-2 by sub-stage. */
function risk(psa,gg,t,n){
  if(['T3a','T3b','T4'].includes(t)||n==='N1')return 'Locally advanced';
  if(psa===null||!gg||!t)return 'Risk group incomplete';
  if(gg>=4||psa>20)return 'High risk';
  if((gg===2&&psa>=10)||gg===3)return 'Unfavourable intermediate risk';
  if((gg===2&&psa<10)||(gg===1&&psa>=10))return 'Favourable intermediate risk';
  if(gg===1&&psa<10)return 'Low risk';
  return 'Risk group incomplete';
}

window.oracleProstateRisk=function(psa,gg,t,n){return risk(psa,gg,t,n);};
function renderRiskNote(r,psa,gg,t){
  var src=' <span style="color:#64748b">(EAU 2026 risk table)</span>';
  var t2c=(t==='T2c'&&r!=='High risk'&&r!=='Locally advanced')?'<div class="v143-note"><b>cT2c:</b> the EAU 2026 risk table classifies localised disease by Grade Group and PSA, but the EAU treatment algorithm still shows cT2c within high-risk localised disease. Review the risk group at MDT before choosing a branch.</div>':'';
  if(r==='Low risk')return '<div class="v143-ok"><b>EAU low risk:</b> ISUP GG1, PSA &lt;10 ng/mL and cT1–2.'+src+'</div>'+t2c;
  if(r==='Favourable intermediate risk')return '<div class="v143-note"><b>EAU favourable intermediate risk:</b> GG2 with PSA &lt;10 ng/mL, or GG1 with PSA 10–20 ng/mL (cT1–2).'+src+' Selected patients may be considered for active surveillance after MRI review and counselling.</div>'+t2c;
  if(r==='Unfavourable intermediate risk')return '<div class="v143-note"><b>EAU unfavourable intermediate risk:</b> GG2 with PSA 10–20 ng/mL, or GG3 (cT1–2).'+src+' Active surveillance is generally not appropriate; discuss definitive treatment.</div>'+t2c;
  if(r==='High risk')return '<div class="v143-alert"><b>EAU high risk:</b> ISUP GG4–5 or PSA &gt;20 ng/mL.'+src+' Complete N and M staging before treatment selection.</div>';
  if(r==='Locally advanced')return '<div class="v143-alert"><b>EAU locally advanced:</b> cT3–4 and/or cN+, any GG, any PSA.'+src+' Confirm N and M staging before treatment selection.</div>';
  return '<div class="v143-alert"><b>Risk group incomplete:</b> enter PSA, Gleason patterns and clinical T stage. No treatment branch is shown until the risk group can be assigned.</div>';
}

function generate(){
  var psa=num('v143PSA'), g1=Number(val('v143Gleason1')), g2=Number(val('v143Gleason2'));
  var gg=gradeGroup(g1,g2), t=val('v143T'), n=val('v143N'), m=val('v143M'), life=val('v143Life'), symptoms=val('v143Symptoms');
  var pos=num('v143PositiveCores'), total=num('v143TotalCores'), maxPct=num('v143MaxCorePct');
  var r=risk(psa,gg,t,n), html='';

  if(!gg||!t||!n||!m){
    q('v143Result').innerHTML='<div class="v143-alert"><b>Staging/pathology incomplete.</b> Required before treatment navigation: Gleason primary + secondary pattern, clinical T, N and M stage. PSA is also required for risk classification.</div>';
    return;
  }
  if(psa===null){
    q('v143Result').innerHTML='<div class="v143-alert"><b>PSA required.</b> Enter the diagnostic PSA before generating a risk-directed treatment pathway.</div>';
    return;
  }

  var chips='<span class="v143-chip">PSA '+esc(psa)+' ng/mL</span><span class="v143-chip">ISUP GG '+gg+'</span><span class="v143-chip">'+esc(t)+'</span><span class="v143-chip">'+esc(n)+'</span><span class="v143-chip">'+esc(m)+'</span>';
  html+='<div class="v143-section"><div class="v143-label">Structured classification</div>'+chips+renderRiskNote(r,psa,gg,t);

  if(pos!==null&&total!==null&&total>0){
    var pct=(pos/total*100);
    html+='<div class="v143-note"><b>Positive cores:</b> '+pos+'/'+total+' ('+pct.toFixed(1)+'%). '+(pct<50?'This supports favourable-burden context but does not by itself establish favourable intermediate risk.':'High tumour-burden context; incorporate into final risk assessment.')+'</div>';
  }
  if(maxPct!==null)html+='<div class="v143-note"><b>Maximum cancer/core:</b> '+maxPct+'%.</div>';

  if(n==='N1'&&m==='M0'){
    html+='<div class="v143-note"><b>cN1 M0:</b> treat as node-positive locally advanced disease. Curative-intent prostate/pelvic radiotherapy plus long-term ADT is a core pathway; EAU 2026 also supports systemic intensification with abiraterone-based therapy in appropriate cN1M0 patients. Confirm staging, fitness and local protocol.</div>';
  }

  if(m==='M1'){
    html+=metastaticPathway();
  }else if(r==='High risk'||r==='Locally advanced'){
    html+=highRiskPathway(n,life);
  }else if(r==='Low risk'){
    html+=lowRiskPathway(life);
  }else if(r.indexOf('intermediate risk')>-1){
    html+=intermediatePathway(life,pos,total,r);
  }

  if(symptoms&&symptoms!=='No major cancer complication'){
    html+='<div class="v143-alert"><b>Urgent complication:</b> '+esc(symptoms)+'. If spinal cord compression or obstructive complication is suspected, urgent decompression/drainage and rapid systemic/local management take priority over routine pathway sequencing.</div>';
  }

  html+='<div class="v143-section"><div class="v143-label">Trial / evidence map</div>'+
    '<div class="v143-note"><b>Localised / intermediate:</b> ProtecT and other active-surveillance evidence underpin shared decision-making; CHHiP informs moderate hypofractionation in appropriate RT settings.</div>'+
    '<div class="v143-note"><b>High-risk / N1 M0:</b> STAMPEDE provides the major evidence base for systemic intensification with abiraterone in selected high-risk non-metastatic disease.</div>'+
    '<div class="v143-note"><b>Metastatic hormone-sensitive:</b> STAMPEDE, LATITUDE, TITAN, ARCHES/ENZAMET support ADT + ARPI strategies; PEACE-1 and ARASENS support triplet therapy with docetaxel + ARPI in appropriate fit patients.</div>'+
  '</div>'+
  '<div class="v143-note"><b>Clinical safety:</b> This module does not replace complete pathology, radiology, comorbidity/fitness assessment, genomic testing where indicated, or MDT review. Verify current regulatory indications, dosing and local formulary before prescribing.</div>';

  q('v143Result').innerHTML=html;
}

function lowRiskPathway(life){
  if(life==='≤10 years'){
    return '<div class="v143-section"><div class="v143-label">Treatment pathway — low risk</div><div class="v143-note"><b>Watchful waiting / conservative management:</b> appropriate when life expectancy is limited, with symptom-directed care and PSA/clinical follow-up according to the chosen strategy.</div></div>';
  }
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — low risk</div><div class="v143-note"><b>Active surveillance:</b> discuss as the standard disease-management strategy for appropriately selected low-risk patients with sufficient life expectancy. Define PSA, DRE/MRI and repeat-biopsy triggers using the local AS protocol.</div><div class="v143-note"><b>Definitive treatment:</b> radical prostatectomy or radiotherapy can be considered when surveillance is unsuitable or declined, after shared decision-making.</div></div>';
}

function intermediatePathway(life,pos,total,r){
  var burden='';
  if(pos!==null&&total!==null&&total>0){
    burden=(pos/total)<0.5?'Lower core burden entered.':'Higher core burden entered.';
  }
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — intermediate risk</div>'+
    (r==='Favourable intermediate risk'
      ?'<div class="v143-note"><b>Favourable intermediate risk:</b> selected patients, particularly ISUP GG2 with low-volume disease, low PSA density and concordant MRI, may be offered active surveillance after counselling. '+esc(burden)+'</div>'
      :'<div class="v143-alert"><b>Unfavourable intermediate risk:</b> active surveillance is generally not recommended. '+esc(burden)+'</div>')+
    '<div class="v143-note"><b>Definitive options:</b> radical prostatectomy in selected patients or external-beam radiotherapy. For unfavourable intermediate-risk disease, radiotherapy is generally combined with short-course ADT; surgical candidates may undergo radical prostatectomy with pelvic-node assessment as indicated.</div>'+
    (life==='≤10 years'?'<div class="v143-note"><b>Life expectancy:</b> with ≤10 years, conservative/watchful-waiting management should be discussed rather than automatically pursuing curative treatment.</div>':'')+
    '</div>';
}

function highRiskPathway(n,life){
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — high risk / locally advanced</div>'+
    '<div class="v143-note"><b>Curative-intent radiotherapy:</b> external-beam radiotherapy to prostate ± pelvic nodes with long-term ADT is a core pathway. Selected high-risk/locally advanced patients may also qualify for abiraterone + prednisone/prednisolone intensification under current EAU/STAMPEDE criteria and local approval.</div>'+
    '<div class="v143-note"><b>Radical prostatectomy:</b> an option for selected fit patients after counselling, usually with extended pelvic lymph-node dissection when indicated. Expect a tailored postoperative strategy if adverse pathology/PSA occurs.</div>'+
    (n==='N1'?'<div class="v143-alert"><b>Node-positive:</b> confirm cN1 M0 staging and plan prostate/pelvic RT + long-term ADT with systemic intensification where appropriate. This is not the same pathway as organ-confined high-risk disease.</div>':'')+
    (life==='≤10 years'?'<div class="v143-note"><b>Life expectancy:</b> reassess the balance of curative treatment vs symptom-focused/conservative management; high-risk pathology alone does not override limited life expectancy.</div>':'')+
    '</div>';
}

function metastaticPathway(){
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — metastatic hormone-sensitive prostate cancer (mHSPC / mAPMN/S)</div>'+
    '<div class="v143-note"><b>Do not use ADT monotherapy routinely</b> when combination therapy is appropriate and the patient has sufficient life expectancy and accepts the added toxicity.</div>'+
    '<div class="v143-note"><b>Core systemic options:</b> ADT + abiraterone/prednisone, apalutamide, enzalutamide or rezvilutamide; darolutamide is also an option in selected fit patients. Choose according to disease volume/risk, comorbidity, interactions, access and patient priorities.</div>'+
    '<div class="v143-note"><b>Triplet therapy:</b> in patients fit for docetaxel, EAU 2026 recommends docetaxel only as part of ADT + abiraterone or ADT + darolutamide rather than docetaxel + ADT alone when an appropriate ARPI is available.</div>'+
    '<div class="v143-note"><b>Genomics and biomarkers at diagnosis:</b> test germline/somatic HRR genes, and PTEN status and PSMA PET where these would change treatment.</div>'+
    '<div class="v143-note"><b>Biomarker-directed options (FDA approvals 2025–2026, metastatic androgen pathway modulation-naïve/-sensitive disease, formerly mHSPC):</b>'+
      '<br>• <b>HRR-mutated</b> (12-gene panel incl. BRCA1/2, ATM, CDK12, PALB2): talazoparib 0.5 mg daily + enzalutamide 160 mg daily + ADT (TALAPRO-3, FDA Oct 2026).'+
      '<br>• <b>BRCA2-mutated:</b> niraparib + abiraterone/prednisone + ADT (AMPLITUDE, FDA Dec 2025).'+
      '<br>• <b>PTEN-deficient</b> (validated IHC assay): capivasertib 400 mg twice daily, 4 days on / 3 days off + abiraterone 1000 mg + prednisone 5 mg daily + ADT (CAPItello-281, FDA Jun 2026).'+
      '<br>• <b>PSMA-positive:</b> Lu-177 PSMA-617 7.4 GBq every 6 weeks × 6 + an ARPI (PSMAddition, FDA Jul 2026).'+
      '<br><span style="color:#64748b">These are regulatory approvals; check the current EAU recommendation strength, local approval and funding before use.</span></div>'+
    '</div>';
}

function hook(){
  var b=document.querySelector('[data-disease="Ca Prostate"]');
  if(b && !b.__v143Hooked){
    b.__v143Hooked=true;
    b.onclick=function(e){if(e)e.preventDefault();open();};
  }
}
function init(){
  style(); hook();
  setTimeout(hook,800);
  setTimeout(hook,2000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

}catch(e){console.error("[v14.3-prostate-pathway]",e);}

/* ===== v14.4-oncology-pathways ===== */
try{
/* Urology Oracle — focused uro-oncology pathways: RCC, UTUC, Testis.
   2026 EAU-aligned clinical navigation. Separate module; no AI/provider changes.
*/
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>\"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m];});}
function close(){const x=document.getElementById('v144Modal');if(x)x.remove();}
function css(){if(document.getElementById('v144css'))return;const s=document.createElement('style');s.id='v144css';s.textContent=
'.v144-modal{position:fixed;inset:0;background:rgba(2,6,23,.68);z-index:100030;display:flex;justify-content:center;align-items:flex-start;padding:18px 10px;overflow:auto}.v144-panel{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#fff;border-radius:16px;padding:16px;color:#172033;box-shadow:0 25px 80px rgba(0,0,0,.35)}.v144-head{display:flex;justify-content:space-between;gap:10px}.v144-panel h2{margin:0;font-size:21px}.v144-sub{font-size:11px;color:#64748b;margin:4px 0 12px}.v144-sec{border-top:1px solid #e5e7eb;padding:11px 0}.v144-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v144-panel input,.v144-panel select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff}.v144-btn{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800;cursor:pointer}.v144-note,.v144-alert,.v144-ok{padding:10px;border-radius:9px;font-size:11px;line-height:1.6;margin-top:8px}.v144-note{background:#f8fafc;border:1px solid #dbe4ee}.v144-alert{background:#fef2f2;border-left:5px solid #b91c1c}.v144-ok{background:#f0fdf4;border-left:5px solid #166534}.v144-label{font-size:11px;font-weight:900;margin-bottom:6px;color:#17364d}@media(max-width:650px){.v144-grid{grid-template-columns:1fr 1fr}}@media(max-width:460px){.v144-grid{grid-template-columns:1fr}}';document.head.appendChild(s);}
function modal(title,sub,body){close();css();const m=document.createElement('div');m.id='v144Modal';m.className='v144-modal no-print';m.innerHTML='<div class="v144-panel"><div class="v144-head"><div><h2>'+esc(title)+'</h2><div class="v144-sub">'+esc(sub)+'</div></div><button class="v144-btn" id="v144Close">Close</button></div>'+body+'</div>';document.body.appendChild(m);document.getElementById('v144Close').onclick=close;m.onclick=e=>{if(e.target===m)close();};}
function field(id,type,ph){return '<input id="'+id+'" type="'+type+'" placeholder="'+ph+'">';}
function select(id,ph,opts){return '<select id="'+id+'"><option value="">'+ph+'</option>'+opts.map(x=>'<option>'+x+'</option>').join('')+'</select>';}
function v(id){const e=document.getElementById(id);return e?e.value:'';}
function n(id){const x=Number(v(id));return Number.isFinite(x)?x:null;}

function rcc(){
let body='<div class="v144-note"><b>Sequence:</b> renal mass characterization → TNM / venous involvement → histology when needed → local treatment → adjuvant/systemic branch → follow-up.</div>'+
'<div class="v144-sec"><div class="v144-label">Tumour and patient</div><div class="v144-grid">'+
field('rSize','number','Max tumour size (cm)')+select('rT','Clinical T stage',['cT1a','cT1b','cT2','cT3a','cT3b','cT3c','cT4'])+select('rN','N stage',['cN0','cN1','cNX'])+
select('rM','M stage',['cM0','cM1'])+select('rHist','Histology',['Clear-cell RCC','Papillary RCC','Chromophobe RCC','Other / unclassified','Histology not yet established'])+select('rThrom','Venous tumour thrombus',['None','Renal vein','IVC below diaphragm','IVC above diaphragm'])+
select('rKidney','Renal function / anatomy',['Normal contralateral kidney','Solitary kidney','Bilateral renal tumours','Compromised renal function'])+select('rFrailty','Frailty / surgical fitness',['Fit','Frailty / major comorbidity','Comprehensive geriatric assessment needed'])+
'</div></div><div class="v144-sec"><div class="v144-label">Post-nephrectomy / systemic information</div><div class="v144-grid">'+
select('rAdjuv','After nephrectomy',['Not applicable / not operated','pT1 / low-risk','pT2 G4','pT3 any grade','pT4','pN+','M1 NED after complete metastasectomy'])+
select('rPd1','Adjuvant pembrolizumab discussion',['Not assessed','Discuss if KEYNOTE-564-type high-risk clear-cell criteria met','Not appropriate / declined'])+
field('rHb','number','Hb (g/dL), optional')+field('rCa','number','Corrected Ca, optional')+field('rNeut','number','Neutrophils, optional')+field('rPlat','number','Platelets, optional')+
'</div></div><button class="v144-btn" id="rGen">Generate RCC pathway</button><div id="rOut"></div>';
modal('Kidney cancer pathway','RCC · 2026 EAU framework',body);
document.getElementById('rGen').onclick=()=>{let T=v('rT'),M=v('rM'),hist=v('rHist'),th=v('rThrom'),kid=v('rKidney'),frail=v('rFrailty'),out='';
if(!T||!M){out='<div class="v144-alert"><b>TNM incomplete.</b> Enter at least clinical T and M stage before treatment navigation.</div>';}
else if(M==='cM1'){out='<div class="v144-note"><b>Metastatic RCC:</b> confirm histology and obtain IMDC variables before systemic selection. Common first-line clear-cell combinations include nivolumab + ipilimumab, pembrolizumab + axitinib, pembrolizumab + lenvatinib, or nivolumab + cabozantinib according to IMDC risk, comorbidity, contraindications and local availability. <b>After progression on PD-1/PD-L1 therapy:</b> belzutifan 120 mg + lenvatinib 20 mg daily improved progression-free survival versus cabozantinib (LITESPARK-011, HR 0.74; FDA Sept 2026); belzutifan monotherapy remains an option after PD-(L)1 and VEGF-TKI therapy (LITESPARK-005). Monitor haemoglobin and oxygen saturation on belzutifan.</div><div class="v144-note"><b>Oligometastatic disease:</b> local treatment of metastases may be considered in selected patients; systemic therapy and local control should be integrated through MDT review.</div>';}
else if(T==='cT1a'){out='<div class="v144-ok"><b>Small renal mass:</b> partial nephrectomy is generally preferred when technically feasible. Active surveillance or tumour ablation are alternatives in selected patients, particularly when competing mortality/frailty makes intervention less attractive.</div>';}
else if(T==='cT1b'){out='<div class="v144-ok"><b>cT1b:</b> partial nephrectomy is preferred where technically feasible and oncologically appropriate; radical nephrectomy remains appropriate when partial nephrectomy is not suitable. Consider renal function, anatomy and surgical complexity.</div>';}
else if(T==='cT2'){out='<div class="v144-note"><b>cT2:</b> radical nephrectomy is commonly used; partial nephrectomy may be considered in selected cases, particularly when renal preservation is important and technically feasible. Use tumour complexity and renal reserve rather than size alone.</div>';}
else if(T.indexOf('cT3')===0||T==='cT4'){out='<div class="v144-note"><b>Locally advanced RCC:</b> if resectable, nephrectomy with removal of venous tumour thrombus when indicated is the core surgical pathway. Multidisciplinary planning is essential, especially for IVC involvement.</div>';if(th&&th!=='None')out+='<div class="v144-note"><b>Venous thrombus:</b> '+esc(th)+'. Map the thrombus level and plan vascular control/reconstruction with appropriate expertise.</div>';}
if(kid==='Solitary kidney'||kid==='Bilateral renal tumours'||kid==='Compromised renal function')out+='<div class="v144-alert"><b>Renal preservation flag:</b> nephron-sparing strategy deserves explicit consideration; obtain functional assessment and discuss with a renal/urologic oncology MDT.</div>';
if(frail==='Frailty / major comorbidity'||frail==='Comprehensive geriatric assessment needed')out+='<div class="v144-note"><b>Frailty:</b> incorporate comprehensive geriatric and nephrological assessment before choosing intervention or systemic therapy.</div>';
if(v('rAdjuv')==='pT2 G4'||v('rAdjuv')==='pT3 any grade'||v('rAdjuv')==='pT4'||v('rAdjuv')==='pN+'||v('rAdjuv')==='M1 NED after complete metastasectomy')out+='<div class="v144-note"><b>Adjuvant therapy:</b> for clear-cell RCC at intermediate-high or high risk of recurrence after nephrectomy (or after nephrectomy plus resection of metastases, M1 NED), discuss adjuvant pembrolizumab 200 mg every 3 weeks or 400 mg every 6 weeks for up to 1 year (KEYNOTE-564, with an overall-survival benefit). Adding belzutifan 120 mg daily for up to 54 weeks improved disease-free survival over pembrolizumab alone (LITESPARK-022, HR 0.72; FDA June 2026), with more grade ≥3 toxicity (anaemia, hypoxia). Start within 12 weeks of surgery. Verify regulatory eligibility and local access.</div>';
document.getElementById('rOut').innerHTML=out||'<div class="v144-note">Complete required fields.</div>';};}

function utuc(){
let body='<div class="v144-note"><b>Risk stratification is central.</b> Combine grade/cytology, imaging invasion, tumour size, multifocality and hydronephrosis with patient/renal factors; confirm diagnosis and discuss suspected UTUC in MDT.</div>'+
'<div class="v144-sec"><div class="v144-label">Tumour features</div><div class="v144-grid">'+
select('uGrade','Biopsy / cytology grade',['Low grade','High grade','Not available'])+field('uSize','number','Largest tumour size (cm)')+
select('uInv','Imaging invasion',['No invasive features','Invasion suspected','Cannot assess'])+select('uHydro','Hydronephrosis',['No','Yes'])+
select('uMulti','Multifocality',['Unifocal','Multifocal'])+select('uCyt','Urine cytology',['Negative / atypical','Positive high-grade'])+
select('uLoc','Location',['Renal pelvis','Proximal/mid ureter','Distal ureter','Multiple locations'])+select('uKid','Renal situation',['Two functioning kidneys','Solitary kidney','Compromised renal function'])+
'</div></div><div class="v144-sec"><div class="v144-label">After radical nephroureterectomy</div><div class="v144-grid">'+select('uPath','Pathology',['Not operated','pTis/Ta/T1 N0','pT2-T4 N0','pN+','Positive margin','ypT2+ / ypN+ after neoadjuvant chemotherapy'])+select('uPlat','Platinum fitness',['Cisplatin eligible','Carboplatin eligible','Platinum ineligible'])+'</div></div>'+
'<button class="v144-btn" id="uGen">Generate UTUC pathway</button><div id="uOut"></div>';
modal('Upper tract urothelial cancer pathway','UTUC · 2026 EAU framework',body);
document.getElementById('uGen').onclick=()=>{let grade=v('uGrade'),size=n('uSize'),inv=v('uInv'),hyd=v('uHydro'),multi=v('uMulti'),cyt=v('uCyt'),loc=v('uLoc'),kid=v('uKid'),out='';
let high=grade==='High grade'||inv==='Invasion suspected'||(size!==null&&size>2)||hyd==='Yes'||multi==='Multifocal'||cyt==='Positive high-grade';
if(!grade||!v('uLoc'))out='<div class="v144-alert"><b>Risk assessment incomplete.</b> Enter grade and tumour location; use imaging/cytology to complete formal risk stratification.</div>';
else if(high)out='<div class="v144-note"><b>High-risk phenotype:</b> radical nephroureterectomy is the standard treatment for high-risk non-metastatic UTUC. Distal ureterectomy is a selected kidney-sparing option for high-risk tumours confined to the distal ureter. Imperative kidney-sparing management requires case-by-case MDT/shared decision-making.</div>';
else out='<div class="v144-ok"><b>Low-risk phenotype:</b> kidney-sparing management is the preferred primary approach. Endoscopic ablation can be considered when complete treatment and stringent surveillance are feasible; second-look ureteroscopy should be performed within 8 weeks after endoscopic management.</div>';
if(kid!=='Two functioning kidneys')out+='<div class="v144-alert"><b>Renal preservation priority:</b> '+esc(kid)+'. Kidney-sparing options deserve explicit discussion, but oncologic risk must not be underestimated.</div>';
if(v('uPath')==='pT2-T4 N0'||v('uPath')==='pN+'||v('uPath')==='Positive margin'||v('uPath')==='ypT2+ / ypN+ after neoadjuvant chemotherapy')out+='<div class="v144-note"><b>Adjuvant treatment:</b> offer/discuss platinum-based adjuvant chemotherapy for eligible pT2–T4 and/or pN+ disease after RNU. A postoperative bladder instillation of chemotherapy is recommended after RNU in patients without prior bladder cancer to reduce intravesical recurrence.</div>';
if(v('uPath')==='pT2-T4 N0'||v('uPath')==='pN+'||v('uPath')==='Positive margin')out+='<div class="v144-note"><b>Immunotherapy:</b> adjuvant nivolumab or pembrolizumab may be discussed in selected patients who are unfit for or decline platinum-based chemotherapy, according to PD-L1/pathology and current jurisdictional indications.</div>';
document.getElementById('uOut').innerHTML=out;};}

function testis(){
let body='<div class="v144-note"><b>Before treatment:</b> scrotal US, bilateral examination, AFP + β-hCG + LDH, staging CT as indicated, and fertility counselling/sperm cryopreservation before orchidectomy or chemotherapy when feasible.</div>'+
'<div class="v144-sec"><div class="v144-label">Post-orchidectomy classification</div><div class="v144-grid">'+
select('tType','Histology',['Seminoma','Non-seminoma / NSGCT','Mixed germ-cell tumour'])+select('tStage','Clinical stage',['Stage I','Stage IIA','Stage IIB','Stage IIC/III'])+
select('tLvi','Lymphovascular invasion (NSGCT)',['Absent','Present','Not applicable'])+select('tMarkers','Markers after orchidectomy',['Normal / appropriately declining','Persistently elevated / rising','Not available'])+
select('tIG','IGCCCG prognosis if metastatic',['Good','Intermediate','Poor','Not yet classified'])+select('tSol','Contralateral testis',['Normal','Solitary / atrophic / abnormal'])+
'</div></div><button class="v144-btn" id="tGen">Generate testicular pathway</button><div id="tOut"></div>';
modal('Testicular cancer pathway','Germ-cell tumour · 2026 EAU framework',body);
document.getElementById('tGen').onclick=()=>{let type=v('tType'),stage=v('tStage'),lvi=v('tLvi'),markers=v('tMarkers'),ig=v('tIG'),out='';
if(!type||!stage)out='<div class="v144-alert"><b>Histology and stage required.</b></div>';
else if(stage==='Stage I'&&type==='Seminoma')out='<div class="v144-note"><b>Stage I seminoma:</b> surveillance is a key preferred strategy when reliable follow-up is feasible. Adjuvant carboplatin is an alternative in selected patients; radiotherapy is generally not routine.</div>';
else if(stage==='Stage I'&&type!=='Seminoma')out='<div class="v144-note"><b>Stage I NSGCT:</b> surveillance is appropriate for compliant patients. LVI is the major relapse-risk factor: LVI-negative pT1 disease is low-risk; LVI-positive disease has higher relapse risk and one cycle of BEP can be discussed. Nerve-sparing RPLND is reserved for highly selected circumstances.</div>';
else if((stage==='Stage IIA'||stage==='Stage IIB')&&type==='Seminoma')out='<div class="v144-note"><b>Stage IIA/IIB seminoma:</b> confirm whether small retroperitoneal nodes are unequivocally metastatic; in selected marker-negative small-volume cases, repeat imaging after 6–8 weeks may avoid overtreatment. If confirmed, chemotherapy is standard; radiotherapy remains a selected alternative in stage IIA/IIB depending on circumstances.</div>';
else if((stage==='Stage IIA'||stage==='Stage IIB')&&type!=='Seminoma')out='<div class="v144-note"><b>Stage IIA/IIB NSGCT:</b> marker-negative disease may be managed with nerve-sparing RPLND in an expert centre; selected patients may receive limited chemotherapy. Marker-positive disease is treated according to IGCCCG metastatic-risk principles.</div>';
else {out='<div class="v144-note"><b>Metastatic germ-cell tumour:</b> treatment is cisplatin-based and should follow IGCCCG prognosis. Good-prognosis seminoma/NSGCT generally receives BEP ×3 (EP ×4 if bleomycin unsuitable); intermediate/poor-risk disease generally requires intensified cisplatin-based therapy in an expert centre.</div>';if(ig==='Poor')out+='<div class="v144-alert"><b>Poor-risk disease:</b> refer to a high-volume germ-cell tumour centre; assess tumour-marker decline after the first cycle and consider treatment intensification where indicated.</div>';}
if(markers==='Persistently elevated / rising')out+='<div class="v144-alert"><b>Marker warning:</b> persistent/rising post-orchidectomy markers can upstage disease or indicate residual active disease; do not label as stage I based on imaging alone.</div>';
if(v('tSol')!=='Normal')out+='<div class="v144-note"><b>Contralateral testis abnormal/solitary:</b> discuss fertility, endocrine function and testicular-preservation options with specialist input.</div>';
document.getElementById('tOut').innerHTML=out;};}

function hook(){
const nav=document.getElementById('v142ClinicalNav');if(!nav)return;
[['Ca Kidney',rcc],['UTUC',utuc],['Ca Testis',testis]].forEach(([name,fn])=>{const b=nav.querySelector('[data-disease="'+name+'"]');if(b&&!b.__v144){b.__v144=true;b.onclick=e=>{e.preventDefault();fn();};}});
}
function init(){hook();setTimeout(hook,600);setTimeout(hook,1800);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}catch(e){console.error("[v14.4-oncology-pathways]",e);}

/* ===== v14.5-urgent-urology ===== */
try{
/* Urology Oracle — urgent urology safety module.
   High-acuity decision support. Separate module; no AI/provider changes.
   2026 EAU-aligned principles with clinician verification/local protocol required.
*/
(function(){
'use strict';

function esc(s){
  return String(s==null?'':s).replace(/[&<>"]/g,function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];
  });
}
function css(){
  if(document.getElementById('v145UrgentCss')) return;
  var s=document.createElement('style');
  s.id='v145UrgentCss';
  s.textContent=
    '.v145-modal{position:fixed;inset:0;background:rgba(2,6,23,.72);z-index:100040;display:flex;align-items:flex-start;justify-content:center;padding:18px 10px;overflow:auto}'+
    '.v145-panel{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#fff;color:#172033;border-radius:16px;padding:16px;box-shadow:0 25px 90px rgba(0,0,0,.4)}'+
    '.v145-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.v145-head h2{margin:0;font-size:21px;color:#0f172a}.v145-sub{font-size:11px;color:#64748b;margin-top:4px;line-height:1.5}'+
    '.v145-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}'+
    '.v145-card{border:1px solid #dbe4ee;border-radius:12px;background:#f8fafc;padding:11px;cursor:pointer;text-align:left}.v145-card:hover{box-shadow:0 6px 20px rgba(15,23,42,.08)}'+
    '.v145-card b{display:block;font-size:12px;color:#17364d}.v145-card span{display:block;font-size:10px;line-height:1.45;color:#64748b;margin-top:4px}'+
    '.v145-section{border-top:1px solid #e5e7eb;padding:11px 0}.v145-section h3{margin:0 0 7px;font-size:13px;color:#17364d}'+
    '.v145-alert{background:#fef2f2;border-left:5px solid #b91c1c;padding:11px;border-radius:9px;font-size:12px;line-height:1.6;margin-top:8px}.v145-action{background:#f0fdf4;border-left:5px solid #166534;padding:11px;border-radius:9px;font-size:12px;line-height:1.6;margin-top:8px}.v145-note{background:#f8fafc;border:1px solid #dbe4ee;padding:10px;border-radius:9px;font-size:11px;line-height:1.6;margin-top:8px}.v145-muted{color:#64748b;font-size:10px;line-height:1.5}.v145-btn{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800;cursor:pointer}'+
    '@media(max-width:560px){.v145-grid{grid-template-columns:1fr}.v145-panel{padding:13px}}';
  document.head.appendChild(s);
}
function close(){
  var x=document.getElementById('v145UrgentModal');
  if(x) x.remove();
}
function modal(title,sub,body){
  close(); css();
  var m=document.createElement('div');
  m.id='v145UrgentModal'; m.className='v145-modal no-print';
  m.innerHTML='<div class="v145-panel"><div class="v145-head"><div><h2>'+esc(title)+'</h2><div class="v145-sub">'+esc(sub)+'</div></div><button class="v145-btn" id="v145Close">Close</button></div>'+body+'</div>';
  document.body.appendChild(m);
  document.getElementById('v145Close').onclick=close;
  m.onclick=function(e){if(e.target===m)close();};
}
function openUrgent(){
  var cards=[
    ['torsion','Testicular torsion','Time-critical spermatic cord ischemia · do not delay exploration for imaging when clinical suspicion is high.'],
    ['infected','Obstructed infected system','Fever/sepsis + obstructed collecting system · antibiotics plus urgent drainage.'],
    ['fournier',"Fournier's gangrene",'Necrotising perineal infection · resuscitation, antibiotics and immediate source control/debridement.'],
    ['priapism','Ischaemic priapism','Painful rigid erection · emergency detumescence pathway.'],
    ['retention','Acute urinary retention','Immediate bladder drainage, cause assessment and planned trial without catheter.'],
    ['clot','Clot retention','Large-bore catheter, clot evacuation/irrigation and escalation to endoscopic control when needed.'],
    ['paraphimosis','Paraphimosis','Glans ischemia risk · urgent reduction; dorsal slit/circumcision if reduction fails or tissue is compromised.'],
    ['fracture','Penile fracture','Sudden detumescence, swelling and deformity after trauma · urgent urological assessment and repair.']
  ];
  var body='<div class="v145-note"><b>Emergency rule:</b> first identify time-critical threats to organ viability, sepsis and uncontrolled bleeding. Stabilise the patient, obtain cultures/labs/imaging only when they do not delay definitive source control, and involve the appropriate surgical/urological team early.</div>'+
    '<div class="v145-grid">'+cards.map(function(c){return '<button class="v145-card" data-urgent="'+c[0]+'"><b>'+esc(c[1])+'</b><span>'+esc(c[2])+'</span></button>';}).join('')+'</div>'+
    '<div class="v145-note v145-muted">Content is clinician-facing decision support, not an autonomous treatment order. Antibiotic selection/dosing, anaesthesia, transfusion and operative timing must follow patient factors, local resistance patterns, hospital protocols and senior/MDT judgement.</div>';
  modal('Urgent urology','High-acuity safety pathways · 2026 EAU-aligned principles',body);
  Array.from(document.querySelectorAll('[data-urgent]')).forEach(function(b){b.onclick=function(){renderUrgent(b.getAttribute('data-urgent'));};});
}
function renderUrgent(kind){
  var data={
    torsion:{
      title:'Testicular torsion',
      sub:'Acute scrotum · organ salvage emergency',
      red:'High clinical suspicion is an emergency. Do not allow ultrasound or laboratory testing to create avoidable delay to exploration.',
      sections:[
        ['Immediate assessment','Sudden unilateral scrotal pain, nausea/vomiting, high-riding or horizontal testis, absent cremasteric reflex and acute onset increase suspicion. Document time of symptom onset and examine both testes.'],
        ['Investigation','Colour Doppler ultrasound is useful when the diagnosis is equivocal and can be obtained without delaying treatment. A normal/indeterminate study does not overrule a high clinical suspicion.'],
        ['Definitive action','Urgent scrotal exploration with detorsion and assessment of viability. Fix the affected testis and perform contralateral orchiopexy because the underlying bell-clapper anatomy is often bilateral.'],
        ['Temporising measure','Manual detorsion may be attempted while preparing for surgery, but it is not definitive; persistent torsion must be excluded and operative fixation remains required.'],
        ['Pitfall','Do not treat presumed epididymitis first when the history/examination is strongly suggestive of torsion. Time from onset is critical.']
      ]
    },
    infected:{
      title:'Obstructed infected system',
      sub:'Obstruction + infection/sepsis · drainage emergency',
      red:'An infected obstructed collecting system requires urgent decompression. Definitive stone treatment should be deferred until sepsis/infection has resolved.',
      sections:[
        ['Immediate assessment','Assess sepsis physiology, haemodynamics, urine output and renal function. Obtain blood/urine cultures and laboratory tests, but do not delay drainage in a deteriorating patient.'],
        ['Antimicrobial treatment','Start appropriate IV antibiotics promptly according to local antibiogram, prior cultures, allergy history and sepsis protocol; adjust to culture results and renal function.'],
        ['Drainage','Urgently decompress with either ureteric stent or percutaneous nephrostomy. Choice depends on anatomy, expertise, obstruction level and patient stability; neither method should be considered universally superior.'],
        ['After source control','Monitor clinical response, renal function and cultures. Treat the underlying stone definitively only after the acute infection/sepsis has settled and the patient is fit for intervention.'],
        ['Pitfall','Do not perform definitive ureteroscopy/PCNL in the setting of uncontrolled infected obstruction simply because the stone is technically accessible.']
      ]
    },
    fournier:{
      title:"Fournier's gangrene",
      sub:'Necrotising soft-tissue infection · surgical emergency',
      red:'Suspected Fournier gangrene requires immediate resuscitation, broad-spectrum antimicrobial therapy and urgent operative source control. Do not wait for imaging if it would delay debridement in an unstable/highly suspicious patient.',
      sections:[
        ['Recognition','Severe perineal/genital pain, swelling, erythema, skin necrosis, bullae, crepitus, systemic toxicity or pain out of proportion should trigger urgent escalation. Early skin findings may underestimate deep disease.'],
        ['Resuscitation','Manage as sepsis: IV access, fluids/vasopressors as indicated, lactate and organ-function assessment, analgesia, glucose control and critical-care support when required.'],
        ['Antibiotics','Start broad-spectrum IV coverage for Gram-positive, Gram-negative and anaerobic organisms; add MRSA or other coverage according to local epidemiology/risk. Tailor once cultures return.'],
        ['Source control','Urgent extensive surgical exploration and debridement of all non-viable tissue is the cornerstone. Serial re-exploration/debridement is frequently required until the infection is controlled.'],
        ['Pitfall','Do not rely on LRINEC or CT to exclude the diagnosis when clinical suspicion is high. Imaging may define extent in a stable patient but must not delay source control.']
      ]
    },
    priapism:{
      title:'Ischaemic priapism',
      sub:'Low-flow priapism · emergency detumescence',
      red:'Painful rigid erection with corporal ischaemia is a medical emergency. The longer it persists, the greater the risk of permanent erectile dysfunction.',
      sections:[
        ['Confirm phenotype','Ischaemic priapism is typically painful with a rigid corpora cavernosa and relatively soft glans. Cavernosal blood gas and/or penile Doppler can support diagnosis when uncertainty exists, but treatment should not be unnecessarily delayed.'],
        ['First-line treatment','Provide analgesia/penile block as appropriate, aspirate dark stagnant corporal blood and irrigate with saline, followed by intracavernosal phenylephrine according to institutional protocol. Monitor blood pressure and heart rate during sympathomimetic treatment.'],
        ['Phenylephrine safety','Phenylephrine is the first-line sympathomimetic: AUA/SMSNA 2022 uses 100–500 micrograms/mL, 1 mL intracavernosally every 3–5 minutes for up to about 1 hour; EAU uses 200 micrograms every 3–5 minutes to a maximum of 1 mg within 1 hour. Monitor blood pressure and heart rate (ECG in cardiovascular disease). If detumescence fails after about 1 hour of aspiration/irrigation and sympathomimetics, proceed to a surgical shunt.'],
        ['Escalation','If aspiration/irrigation plus phenylephrine fails, proceed to surgical shunting; prolonged cases may require early consideration of a penile prosthesis pathway because corporal smooth-muscle necrosis becomes increasingly likely.'],
        ['Pitfall','Oral/systemic decongestants are not definitive treatment for established ischaemic priapism. Do not delay detumescence while investigating the underlying cause.']
      ]
    },
    retention:{
      title:'Acute urinary retention',
      sub:'Bladder drainage emergency · then identify the cause',
      red:'Prompt bladder decompression is required. Record drained volume, haematuria, pain and renal function/upper-tract concerns, and assess whether this is uncomplicated acute retention or part of a more dangerous process.',
      sections:[
        ['Immediate action','Urethral catheterisation is first-line when feasible. Use appropriate asepsis, adequate lubrication and the smallest suitable catheter that will reliably drain the bladder. Do not repeatedly force a catheter through resistance.'],
        ['If urethral catheterisation fails','Stop traumatic attempts when resistance or suspected urethral injury is encountered. Consider experienced catheterisation with appropriate technique, flexible cystoscopy-guided placement or suprapubic drainage when indicated.'],
        ['Cause assessment','Review BPH/BPO, stricture, constipation, medications, neurological disease, postoperative causes, clot retention and malignancy. Check urinalysis/culture when infection is suspected, renal function when indicated and PVR/ultrasound where clinically useful.'],
        ['Trial without catheter','For likely BPO-related retention, an alpha-blocker started before catheter removal can improve the chance of successful trial without catheter. Plan a supervised TWOC after an appropriate interval, commonly after several days, with local protocol determining timing.'],
        ['Pitfall','Gross haematuria with clots, sepsis, anuria, suspected urethral injury or neurological compromise requires a different urgent pathway rather than routine BPH-only management.']
      ]
    },
    clot:{
      title:'Clot retention',
      sub:'Haematuria with bladder tamponade',
      red:'Clot retention is a drainage and bleeding-control problem. Inability to drain the bladder, suprapubic pain/distension or ongoing heavy haematuria requires urgent urological escalation.',
      sections:[
        ['Immediate action','Insert an appropriately large-bore three-way haematuria catheter when safe and perform gentle manual irrigation with sterile saline to evacuate clots and restore drainage.'],
        ['Continuous bladder irrigation','Once the bladder is cleared and free drainage is established, continuous bladder irrigation may be used with the rate titrated to maintain clear/pale pink urine without over-distending the bladder.'],
        ['Escalation','Persistent clot burden, inability to maintain drainage, ongoing significant bleeding or recurrent obstruction warrants cystoscopic clot evacuation and identification/control of the bleeding source.'],
        ['Resuscitation','Assess haemodynamics, haemoglobin, renal function and anticoagulant/antiplatelet exposure. Correct reversible coagulopathy and manage transfusion according to clinical status and institutional protocol.'],
        ['Pitfall','Do not leave a blocked catheter in a painful distended bladder while waiting for imaging or routine review.']
      ]
    },
    paraphimosis:{
      title:'Paraphimosis',
      sub:'Glans/foreskin vascular compromise',
      red:'Treat as urgent when the retracted foreskin forms a constricting ring behind the glans, especially with oedema, discoloration or impaired perfusion.',
      sections:[
        ['Immediate action','Provide analgesia/local anaesthesia as appropriate, reduce oedema with compression and attempt manual reduction by advancing the glans while bringing the foreskin forward.'],
        ['If reduction fails','Urgent dorsal slit or other operative release is required. Circumcision can be performed as definitive treatment when appropriate.'],
        ['After reduction','Inspect glans and foreskin for ischemia/necrosis, document the cause and address recurrent phimosis or preputial disease.'],
        ['Pitfall','Do not postpone reduction simply because the patient is otherwise stable; prolonged constriction can compromise glanular blood flow.']
      ]
    },
    fracture:{
      title:'Penile fracture',
      sub:'Tunical rupture after penile trauma',
      red:'Sudden detumescence, a cracking/popping sensation, rapid swelling/ecchymosis and penile deformity after trauma strongly suggest tunical rupture and require urgent urological assessment.',
      sections:[
        ['Assessment','Examine for deformity, expanding haematoma, urethral bleeding and urinary difficulty. Suspected urethral injury changes the assessment and repair plan.'],
        ['Imaging','Clinical diagnosis is often sufficient. Ultrasound or MRI can be considered when the diagnosis is uncertain, but imaging should not cause avoidable delay when the clinical picture is convincing.'],
        ['Definitive treatment','Urgent surgical exploration, evacuation of haematoma and tunical repair is the standard pathway for confirmed/suspected significant fracture.'],
        ['Urethral injury','If there is blood at the meatus, inability to void or other strong concern for urethral injury, evaluate the urethra appropriately before instrumentation.'],
        ['Pitfall','Conservative treatment of a convincing fracture increases the risk of curvature, erectile dysfunction and other complications.']
      ]
    }
  };
  var d=data[kind];
  if(!d){openUrgent();return;}
  var html='<div class="v145-alert"><b>Time-critical warning:</b> '+esc(d.red)+'</div>';
  d.sections.forEach(function(s){html+='<div class="v145-section"><h3>'+esc(s[0])+'</h3><div>'+esc(s[1])+'</div></div>';});
  html+='<div class="v145-note"><b>Safety gate:</b> This pathway is a clinical decision-support aid. Confirm diagnosis, patient-specific contraindications, drug doses, cultures, operative fitness and local protocol before action.</div>'+
    '<button class="v145-btn" id="v145Back">Back to urgent urology</button>';
  modal(d.title,d.sub,html);
  document.getElementById('v145Back').onclick=openUrgent;
}
function hook(){
  var b=Array.from(document.querySelectorAll('button')).find(function(x){
    return /^Urgent urology$/i.test((x.innerText||'').trim()) || /^Urgent urology\s/i.test((x.innerText||'').trim());
  });
  if(b && !b.__v145Urgent){
    b.__v145Urgent=true;
    b.onclick=function(e){e.preventDefault();e.stopPropagation();openUrgent();};
  }
}
function init(){
  hook();
  setTimeout(hook,500);
  setTimeout(hook,1200);
  setTimeout(hook,2500);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();

}catch(e){console.error("[v14.5-urgent-urology]",e);}

/* ===== v14.6-stone-engine ===== */
try{
/* Urology Oracle — stone disease decision engine.
   EAU Urolithiasis 2026 aligned. Separate module; no AI/provider changes.
   Decision support only: verify imaging, cultures, patient factors and local protocol.
*/
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];});}
function css(){
 if(document.getElementById('v146StoneCss'))return;
 var s=document.createElement('style');s.id='v146StoneCss';
 s.textContent='.v146s-modal{position:fixed;inset:0;background:rgba(2,6,23,.72);z-index:100050;display:flex;align-items:flex-start;justify-content:center;padding:16px 9px;overflow:auto}.v146s-panel{width:min(1100px,100%);max-height:95vh;overflow:auto;background:#fff;color:#172033;border-radius:16px;padding:16px;box-shadow:0 25px 90px rgba(0,0,0,.4)}.v146s-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.v146s-head h2{margin:0;font-size:21px;color:#0f172a}.v146s-sub{font-size:11px;color:#64748b;margin-top:4px;line-height:1.5}.v146s-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v146s-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v146s-row{border-top:1px solid #e5e7eb;padding:11px 0}.v146s-row h3{margin:0 0 7px;font-size:13px;color:#17364d}.v146s-panel input,.v146s-panel select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff;color:#173044}.v146s-btn{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800;cursor:pointer}.v146s-note{background:#f8fafc;border:1px solid #dbe4ee;padding:10px;border-radius:9px;font-size:11px;line-height:1.6;margin-top:8px}.v146s-alert{background:#fef2f2;border-left:5px solid #b91c1c;padding:10px;border-radius:9px;font-size:12px;line-height:1.6;margin-top:8px}.v146s-action{background:#f0fdf4;border-left:5px solid #166534;padding:10px;border-radius:9px;font-size:12px;line-height:1.6;margin-top:8px}.v146s-tag{display:inline-block;padding:3px 7px;border-radius:999px;background:#e2e8f0;font-size:10px;font-weight:800;margin:2px 3px 2px 0}.v146s-small{font-size:10px;color:#64748b;line-height:1.5}@media(max-width:650px){.v146s-grid,.v146s-grid3{grid-template-columns:1fr}.v146s-panel{padding:13px}}';
 document.head.appendChild(s);
}
function close(){var m=document.getElementById('v146StoneModal');if(m)m.remove();}
function modal(title,sub,body){
 close();css();var m=document.createElement('div');m.id='v146StoneModal';m.className='v146s-modal no-print';
 m.innerHTML='<div class="v146s-panel"><div class="v146s-head"><div><h2>'+esc(title)+'</h2><div class="v146s-sub">'+esc(sub)+'</div></div><button class="v146s-btn" id="v146Close">Close</button></div>'+body+'</div>';
 document.body.appendChild(m);document.getElementById('v146Close').onclick=close;m.onclick=function(e){if(e.target===m)close();};
}
function val(id){var e=document.getElementById(id);return e?e.value:'';}
function n(id){var x=Number(val(id));return Number.isFinite(x)?x:null;}
function openStone(){
 var body='<div class="v146s-note"><b>First gate:</b> determine whether this is an emergency, whether active treatment is indicated, and whether the stone is renal, ureteric or complex/staghorn. For planned stone removal, obtain urine culture/microscopy and treat infection before intervention. An infected obstructed system requires drainage before definitive stone treatment. <b>Do not use this module as an autonomous operative order.</b></div>'+
 '<div class="v146s-row"><h3>1. Clinical state</h3><div class="v146s-grid3">'+
 '<select id="v146Type"><option value="">Stone location</option><option value="renal">Renal</option><option value="ureter">Ureteric</option><option value="both">Renal + ureteric</option></select>'+
 '<select id="v146Infection"><option value="">Infection/obstruction</option><option value="none">No clinical infection</option><option value="uti">UTI without infected obstruction</option><option value="infectedobstructed">Infected obstructed system / sepsis</option></select>'+
 '<select id="v146Symptoms"><option value="">Symptoms</option><option value="symptomatic">Pain / haematuria / recurrent symptoms</option><option value="asymptomatic">Asymptomatic</option><option value="growth">Documented growth</option></select>'+
 '</div></div>'+
 '<div class="v146s-row"><h3>2. Stone burden and anatomy</h3><div class="v146s-grid3">'+
 '<input id="v146Size" type="number" min="0" step="0.1" placeholder="Maximum stone diameter (mm)">'+
 '<input id="v146HU" type="number" min="0" placeholder="Stone density HU (NCCT)">'+
 '<select id="v146Location"><option value="">Renal location</option><option value="pelvis">Pelvis / UPJ</option><option value="uppermiddle">Upper / middle calyx</option><option value="lower">Lower pole</option><option value="staghorn">Partial/complete staghorn</option><option value="multiple">Multiple renal stones</option></select>'+
 '<input id="v146Ureter" type="number" min="0" step="0.1" placeholder="Ureteric stone size (mm), if applicable">'+
 '<select id="v146Hydro"><option value="">Hydronephrosis</option><option value="none">None/minimal</option><option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>'+
 '<select id="v146LowerAnatomy"><option value="">Lower-pole anatomy</option><option value="favourable">Favourable</option><option value="unfavourable">Unfavourable / steep IPA / narrow infundibulum</option><option value="na">Not applicable</option></select>'+
 '</div></div>'+
 '<div class="v146s-row"><h3>3. Patient/procedure modifiers</h3><div class="v146s-grid3">'+
 '<select id="v146Kidney"><option value="">Renal situation</option><option value="normal">Normal contralateral kidney</option><option value="solitary">Solitary functioning kidney</option><option value="bilateral">Bilateral significant stones</option><option value="impaired">Impaired renal function</option></select>'+
 '<select id="v146BMI"><option value="">Body habitus</option><option value="normal">No major access issue</option><option value="obese">Severe obesity / long skin-to-stone distance</option></select>'+
 '<select id="v146Anticoag"><option value="">Antithrombotic status</option><option value="none">None</option><option value="manageable">Can be safely managed per perioperative plan</option><option value="cannot">Cannot be safely interrupted / high bleeding concern</option></select>'+
 '<select id="v146Preg"><option value="">Pregnancy</option><option value="no">No</option><option value="yes">Yes</option></select>'+
 '<select id="v146Prior"><option value="">Prior treatment</option><option value="none">None</option><option value="stent">Stent / nephrostomy</option><option value="failed">Previous failed SWL/URS/PCNL</option></select>'+
 '<select id="v146StoneType"><option value="">Stone composition clue</option><option value="unknown">Unknown</option><option value="uric">Likely uric acid</option><option value="cystine">Cystine / resistant stone</option><option value="infection">Infection stone / struvite suspected</option><option value="hard">High-HU / hard stone suspected</option></select>'+
 '</div></div>'+
 '<div class="v146s-row"><h3>4. Complex PCNL / staghorn planning</h3><div class="v146s-grid3">'+
 '<select id="v146Complex"><option value="">Complexity</option><option value="not">Not complex</option><option value="partial">Partial staghorn</option><option value="complete">Complete staghorn</option><option value="complex">Complex branching/multiple calyces</option></select>'+
 '<select id="v146Calyces"><option value="">Calyceal involvement</option><option value="one">One calyx</option><option value="multiple">Multiple calyces</option><option value="all">Pelvis + multiple calyces</option></select>'+
 '<select id="v146Access"><option value="">Access expectation</option><option value="single">Likely single tract</option><option value="multiple">Likely multiple tracts</option><option value="uncertain">Uncertain — CT planning required</option></select>'+
 '<select id="v146PCNLMode"><option value="">PCNL strategy preference</option><option value="standard">Standard staged/tract-by-tract PCNL</option><option value="simultaneous">Consider simultaneous multi-access workflow</option><option value="ecirs">Consider ECIRS / combined retrograde assistance</option><option value="unknown">Not decided</option></select>'+
 '</div></div>'+
 '<button class="v146s-btn" id="v146Generate">Generate stone pathway</button><div id="v146Result" class="v146s-note">Enter the relevant data, then generate the pathway.</div>';
 modal('Stone disease decision engine','Renal stones · ureteric stones · PCNL/RIRS/SWL · complex/staghorn planning',body);
 setTimeout(function(){document.getElementById('v146Generate').onclick=render;},20);
}
function render(){
 var type=val('v146Type'),infection=val('v146Infection'),sym=val('v146Symptoms'),size=n('v146Size'),hu=n('v146HU'),loc=val('v146Location'),usize=n('v146Ureter'),hydro=val('v146Hydro'),lower=val('v146LowerAnatomy'),kidney=val('v146Kidney'),bmi=val('v146BMI'),anticoag=val('v146Anticoag'),preg=val('v146Preg'),prior=val('v146Prior'),stoneType=val('v146StoneType'),complex=val('v146Complex'),calyces=val('v146Calyces'),access=val('v146Access'),mode=val('v146PCNLMode');
 var h='';
 if(!type){h='<div class="v146s-alert"><b>Location required.</b> Select renal, ureteric or combined disease.</div>';return out(h);}
 if(infection==='infectedobstructed'){
   h+='<div class="v146s-alert"><b>EMERGENCY: infected obstruction.</b> Urgent decompression with ureteric stent or nephrostomy plus prompt antimicrobial treatment. Obtain cultures when feasible. Definitive stone treatment should wait until the infection/sepsis has resolved.</div>';
 }
 if(preg==='yes'){
   h+='<div class="v146s-alert"><b>Pregnancy gate.</b> Do not use the adult stone-size procedure algorithm unchanged. Use pregnancy-specific imaging/intervention pathways; avoid ionising radiation where possible and involve obstetric/urological teams.</div>';
 }
 if(anticoag==='cannot')h+='<div class="v146s-alert"><b>Bleeding-risk gate.</b> PCNL requires a specific antithrombotic/perioperative plan. If therapy cannot safely be interrupted, favour a multidisciplinary strategy rather than automatically selecting PCNL.</div>';
 if(sym==='asymptomatic'&&infection==='none'&&sym!=='growth')h+='<div class="v146s-note"><b>Observation can be considered:</b> stable asymptomatic calyceal stones do not automatically require intervention. Growth, obstruction, infection, symptoms, high-risk stone formation, patient preference and social/comorbidity factors can justify active treatment.</div>';
 if(type==='ureter'||type==='both'){
   if(usize===null)h+='<div class="v146s-alert"><b>Ureteric size required</b> to refine the URS/SWL pathway.</div>';
   else{
     h+='<div class="v146s-action"><b>Ureteric pathway:</b> '+(usize<10?'For a ureteric stone <10 mm, SWL or URS may be appropriate; choose using location, anatomy, likelihood of clearance, patient preference and local expertise.':'For a ureteric stone ≥10 mm, URS generally provides a higher single-procedure stone-free probability; SWL remains an option in selected patients, with possible repeat treatment.')+'</div>';
     if(infection==='none')h+='<div class="v146s-note"><b>Conservative trial first?</b> '+(usize<=10?'Stones ≤10 mm with controlled pain, no infection, adequate renal function and patient agreement can be observed with periodic imaging (most stones ≤5 mm pass spontaneously). '+(usize>5?'For a distal ureteric stone >5 mm, offer medical expulsive therapy with an alpha-blocker (e.g. tamsulosin 0.4 mg once daily, off-label) for up to 4–6 weeks. ':''):'Spontaneous passage is unlikely at this size; plan active removal. ')+'Analgesia: NSAIDs (e.g. diclofenac, ibuprofen) or metamizole first line where renal function allows, paracetamol as an alternative, opioids as second line. Intervene early for uncontrolled pain, infection, obstruction of a solitary kidney, falling renal function or failure to progress.</div>';
     if(usize>15)h+='<div class="v146s-note"><b>Large/impacted proximal ureter:</b> consider URS, and in selected large impacted proximal stones antegrade ureteroscopy or laparoscopic ureterolithotomy can be alternatives when retrograde treatment is unsuitable.</div>';
     if(hydro==='severe'&&infection==='none')h+='<div class="v146s-note"><b>Obstruction:</b> assess renal function and urgency. Persistent obstruction, renal deterioration, refractory pain or infection changes the treatment threshold.</div>';
   }
 }
 if(type==='renal'||type==='both'){
   if(size===null&&complex==='not')h+='<div class="v146s-alert"><b>Renal stone size required</b> for the main renal treatment algorithm.</div>';
   if(complex==='partial'||complex==='complete'||loc==='staghorn'||complex==='complex'){
     h+='<div class="v146s-action"><b>Complex/staghorn pathway:</b> PCNL is the primary treatment approach for most partial and complete staghorn/complex stones. Combined PCNL + RIRS/ECIRS can be considered when it may improve access to residual calyces; staged procedures remain appropriate when operative burden or safety limits complete clearance in one sitting.</div>';
     if(calyces==='multiple'||access==='multiple'){
       h+='<div class="v146s-note"><b>Access planning:</b> map the collecting system on CT and plan the minimum number and safest trajectories needed to reach the stone burden. More than one tract may be required for extensive branching stones. The choice should balance clearance, bleeding risk, anatomy and operative time.</div>';
     }
     if(mode==='simultaneous'){
       h+='<div class="v146s-note"><b>Simultaneous multi-access workflow:</b> this can mean creation of multiple tracts/accesses in the same operative setting, allowing parallel treatment of separate calyceal components. Evidence for specific simultaneous-versus-sequential puncture techniques is heterogeneous; treat this as a technique-selection option rather than a guideline-mandated superiority claim.</div>';
     }
     if(mode==='ecirs')h+='<div class="v146s-note"><b>ECIRS option:</b> simultaneous retrograde and percutaneous endoscopic access can help visualise and clear stones from difficult calyces and may reduce the need for additional percutaneous tracts in selected complex cases. Evidence quality varies.</div>';
     h+='<div class="v146s-note"><b>PCNL safety:</b> preprocedural CT should define stone burden and collecting-system/anatomical relationships, including potential interposed organs. Consider prone or supine PCNL according to anatomy and expertise. If feasible, obtain renal-pelvis urine and/or stone culture at PCNL.</div>';
   }else if(size!==null){
     if(size>20){
       h+='<div class="v146s-action"><b>Primary renal procedure: PCNL.</b> For renal stones >20 mm, EAU 2026 recommends PCNL as first-line treatment. RIRS/SWL are alternatives when PCNL is not an option, but staged/additional procedures are more likely.</div>';
     }else if(size>10){
       if(loc==='lower'){
         h+='<div class="v146s-action"><b>Lower-pole 10–20 mm:</b> favour PCNL or RIRS over SWL when complete clearance is important, particularly with unfavourable lower-pole anatomy. Mini-PCNL may have high clearance at the expense of greater invasiveness/bleeding and hospital stay.</div>';
       }else{
         h+='<div class="v146s-action"><b>Renal 10–20 mm:</b> SWL, RIRS and PCNL are options. Choice should incorporate stone density, anatomy, desired single-session clearance, bleeding risk, comorbidity and patient preference. mPCNL can have higher SFR but greater bleeding/hospital-stay burden than RIRS/SWL in comparative evidence.</div>';
       }
     }else{
       if(loc==='lower'){
         h+='<div class="v146s-action"><b>Lower-pole ≤10 mm:</b> SWL or RIRS are reasonable options; RIRS may provide higher clearance in some anatomies, while SWL is less invasive. Steep infundibulopelvic angle, long calyx, narrow infundibulum, long skin-to-stone distance and shock-wave-resistant composition reduce SWL success.</div>';
       }else{
         h+='<div class="v146s-action"><b>Renal ≤10 mm:</b> observation versus active treatment depends on symptoms, growth, obstruction, infection, risk profile and preference. If treatment is chosen, SWL or RIRS are common options; anatomy and HU modify SWL suitability.</div>';
       }
     }
     if(hu!==null&&hu>1000)h+='<div class="v146s-note"><b>CT density:</b> >1000 HU, particularly in a homogeneous stone, predicts lower SWL fragmentation success. Consider endourological alternatives when clinically appropriate.</div>';
     if(bmi==='obese')h+='<div class="v146s-note"><b>Severe obesity:</b> long skin-to-stone distance can reduce SWL efficacy and complicate percutaneous access; URS/RIRS may be relatively attractive depending on anatomy and expertise.</div>';
     if(lower==='unfavourable')h+='<div class="v146s-note"><b>Lower-pole anatomy unfavourable:</b> this decreases fragment clearance after SWL and can make RIRS technically harder; review IPA, infundibular length/width and access angles on CT.</div>';
   }
 }
 if(stoneType==='uric')h+='<div class="v146s-note"><b>Composition pathway:</b> if uric-acid stone is strongly suspected/confirmed, assess urine pH and consider oral chemolysis where appropriate and safe; confirm composition whenever stone material is available.</div>';
 if(stoneType==='infection')h+='<div class="v146s-note"><b>Infection-stone pathway:</b> culture-directed infection control and complete stone clearance are important; residual infected stone burden increases recurrence risk.</div>';
 h+='<div class="v146s-row"><h3>Perioperative checklist</h3><div class="v146s-grid">'+
 '<div class="v146s-note"><b>Before intervention:</b> urine culture/microscopy; renal function; CBC/coagulation as indicated; review antithrombotics; NCCT for anatomy/stone burden; antibiotics according to culture/local protocol.</div>'+
 '<div class="v146s-note"><b>During PCNL:</b> minimise unnecessary tracts; use safe image-guided access; consider stone/renal-pelvis culture; have a bleeding and collecting-system injury plan; choose standard/mini/tubeless strategy according to case complexity.</div>'+
 '<div class="v146s-note"><b>During RIRS:</b> safety wire and fluoroscopy availability; control intrarenal pressure; use Ho:YAG or TFL laser; avoid unnecessarily prolonged operative time; stent selectively according to procedural findings.</div>'+
 '<div class="v146s-note"><b>After treatment:</b> confirm clearance with appropriate imaging; retrieve/submit stone for analysis; assess residual fragments and infection; plan metabolic evaluation in recurrent/high-risk stone formers.</div>'+
 '</div></div>';
 out(h);
 function out(x){var r=document.getElementById('v146Result');if(r)r.innerHTML=x;}
}
function hook(){
 var b=Array.from(document.querySelectorAll('button')).find(function(x){return /^Stone Disease$/i.test((x.innerText||'').trim());});
 if(b&&!b.__v146){b.__v146=true;b.onclick=function(e){e.preventDefault();e.stopPropagation();openStone();};}
}
window.oracleOpenStone=openStone;
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

}catch(e){console.error("[v14.6-stone-engine]",e);}

/* ===== v14.7-stricture-engine ===== */
try{
/* Urology Oracle — urethral stricture reconstruction engine. 2026 EAU-aligned. */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];});}
function q(id){return document.getElementById(id)} function v(id){var e=q(id);return e?e.value:''} function close(){var m=q('v147StrModal');if(m)m.remove();}
function style(){if(q('v147StrCss'))return;var s=document.createElement('style');s.id='v147StrCss';s.textContent='.v147m{position:fixed;inset:0;background:rgba(2,6,23,.72);z-index:100060;display:flex;justify-content:center;align-items:flex-start;padding:16px 9px;overflow:auto}.v147p{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#fff;border-radius:16px;padding:16px;color:#172033;box-shadow:0 25px 90px rgba(0,0,0,.4)}.v147h{display:flex;justify-content:space-between;gap:10px}.v147h h2{margin:0;font-size:21px}.v147sub{font-size:11px;color:#64748b;line-height:1.5;margin-top:4px}.v147g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v147r{border-top:1px solid #e5e7eb;padding:11px 0}.v147r h3{font-size:13px;color:#17364d;margin:0 0 7px}.v147p input,.v147p select{box-sizing:border-box;width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:9px}.v147b{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800}.v147n{background:#f8fafc;border:1px solid #dbe4ee;border-radius:9px;padding:10px;font-size:11px;line-height:1.6;margin-top:8px}.v147a{background:#fef2f2;border-left:5px solid #b91c1c;border-radius:9px;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}.v147ok{background:#f0fdf4;border-left:5px solid #166534;border-radius:9px;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}@media(max-width:650px){.v147g{grid-template-columns:1fr 1fr}}@media(max-width:480px){.v147g{grid-template-columns:1fr}}';document.head.appendChild(s)}
function modal(body){close();style();var m=document.createElement('div');m.id='v147StrModal';m.className='v147m';m.innerHTML='<div class="v147p"><div class="v147h"><div><h2>Urethral stricture reconstruction pathway</h2><div class="v147sub">Site · length · calibre · aetiology · spongiofibrosis · previous treatment → endoscopic vs reconstruction</div></div><button class="v147b" id="v147Close">Close</button></div>'+body+'</div>';document.body.appendChild(m);q('v147Close').onclick=close;m.onclick=function(e){if(e.target===m)close()}}
function open(){
 modal('<div class="v147n"><b>Core principle:</b> define the stricture anatomically before selecting a procedure. Use symptoms/uroflow/PVR to detect obstruction, but use RUG/VCUG and/or urethroscopy when required to define site, length and calibre. A low Qmax alone does not diagnose stricture.</div>'+
 '<div class="v147r"><h3>Stricture phenotype</h3><div class="v147g">'+
 '<select id="v147Site"><option value="">Site</option><option>Meatal/fossa navicularis</option><option>Penile</option><option>Bulbar</option><option>Bulbomembranous</option><option>Panurethral/multifocal</option><option>Posterior/bladder neck</option></select>'+
 '<input id="v147Len" type="number" min="0" step=".1" placeholder="Length (cm)">'+
 '<select id="v147Cal"><option value="">Calibre</option><option>Non-obliterative</option><option>High-grade / flow-significant</option><option>Near-obliterative</option><option>Obliterative</option></select>'+
 '<select id="v147Aet"><option value="">Aetiology / tissue quality</option><option>Idiopathic</option><option>Traumatic/straddle</option><option>Instrumentation/iatrogenic</option><option>Lichen sclerosus</option><option>Radiation</option><option>Post-BPO surgery</option></select>'+
 '<select id="v147Spong"><option value="">Spongiofibrosis</option><option>Limited</option><option>Extensive</option><option>Unknown</option></select>'+
 '<select id="v147Prior"><option value="">Previous treatment</option><option>None</option><option>Dilation</option><option>DVIU</option><option>Multiple endoscopic failures</option><option>Previous urethroplasty</option></select>'+
 '</div></div>'+
 '<div class="v147r"><h3>Patient / reconstruction modifiers</h3><div class="v147g">'+
 '<select id="v147LS"><option value="">LS involvement</option><option>No</option><option>Yes</option><option>Unknown</option></select>'+
 '<select id="v147Fitness"><option value="">Reconstruction fitness</option><option>Fit</option><option>High anaesthetic/operative risk</option></select>'+
 '<select id="v147Goal"><option value="">Patient priority</option><option>Durable reconstruction</option><option>Avoid major surgery</option><option>Not yet discussed</option></select>'+
 '<select id="v147Urine"><option value="">Current drainage</option><option>Voiding</option><option>Catheter dependent</option><option>Suprapubic catheter</option></select>'+
 '</div></div><button class="v147b" id="v147Go">Generate reconstruction pathway</button><div id="v147Result"></div>');
 q('v147Go').onclick=generate;
}
function generate(){
 var site=v('v147Site'),len=Number(v('v147Len')),cal=v('v147Cal'),a=v('v147Aet'),sp=v('v147Spong'),prior=v('v147Prior'),ls=v('v147LS'),fit=v('v147Fitness'),goal=v('v147Goal');
 var h='';
 if(!site||!Number.isFinite(len)||len<=0||!cal||!a||!prior){q('v147Result').innerHTML='<div class="v147a"><b>Define the anatomy first:</b> site, measured length, calibre, aetiology and previous treatment are required.</div>';return}
 if(ls==='Yes'||a==='Lichen sclerosus')h+='<div class="v147a"><b>Lichen sclerosus:</b> avoid using genital skin in reconstruction. Confirm disease extent; distal/meatal disease may require staged or graft-based reconstruction depending on tissue quality.</div>';
 if(a==='Radiation'||site==='Bulbomembranous')h+='<div class="v147n"><b>Special phenotype:</b> radiation/post-BPO bulbomembranous disease requires explicit counselling about sphincter injury and postoperative incontinence; reconstruction choice depends on length, tissue quality and prior treatment.</div>';
 if(site==='Bulbar'&&len<=2){
   if(a==='Traumatic/straddle'&&(cal==='Obliterative'||cal==='Near-obliterative')&&sp==='Extensive'){
     h+='<div class="v147ok"><b>Strong EPA phenotype:</b> short post-traumatic bulbar stricture with near/complete obliteration and full-thickness spongiofibrosis → transecting EPA is an established reconstructive option.</div>';
   }else{
     var nonObl=(cal!=='Obliterative'&&cal!=='Near-obliterative');
     if(prior==='None'&&nonObl)h+='<div class="v147ok"><b>Primary, short (&lt;2 cm), non-obliterative bulbar stricture:</b> DVIU or dilatation is an acceptable first-line option (EAU 2026, weak), and urethroplasty is an equally valid primary choice (AUA 2023). Counsel that success falls with each repeat procedure. For definitive reconstruction of a non-straddle short bulbar stricture, use non-transecting EPA or free-graft urethroplasty rather than transecting EPA (EAU, weak).</div>';
     else if(prior==='Dilation'||prior==='DVIU')h+='<div class="v147a"><b>Recurrent after one endoscopic treatment:</b> offer urethroplasty rather than repeating dilatation/DVIU (AUA 2023, moderate); repeated endoluminal treatment is not curative and can lengthen the stricture. For a non-straddle short bulbar stricture use non-transecting EPA or free-graft urethroplasty.</div>';
     else if(prior==='Previous urethroplasty'&&nonObl)h+='<div class="v147n"><b>Short recurrence after bulbar urethroplasty:</b> DVIU/dilatation is reasonable for a short, veil-like recurrence (EAU 2026, weak); a longer or dense recurrence needs redo urethroplasty in a reconstructive centre.</div>';
     else h+='<div class="v147ok"><b>Short bulbar stricture, high-grade or recurrent:</b> plan urethroplasty. Non-transecting EPA or free-graft urethroplasty are preferred over transecting EPA when the stricture is not due to straddle injury (EAU, weak).</div>';
   }
 }else if(site==='Bulbar'&&len>2){
   h+='<div class="v147ok"><b>Longer bulbar stricture (&gt;2 cm):</b> do not use DVIU or dilatation as the only treatment (EAU 2026, strong). Usually not amenable to tension-free EPA → free-graft urethroplasty, commonly buccal mucosa, is the principal reconstructive pathway. A short nearly-obliterative critical segment may permit an augmented non-transecting repair in selected cases.</div>';
 }else if(site==='Penile'){
   h+='<div class="v147ok"><b>Penile stricture:</b> do not use DVIU (EAU 2026, strong: poor durability and risk of corporal venous leak). Offer augmentation urethroplasty, single-stage or staged according to tissue quality, LS and prior surgery (EAU, strong). Avoid anastomotic repair for penile strictures &gt;1 cm because of chordee (EAU, strong). Allow at least 4–6 months between stages.</div>';
 }else if(site==='Panurethral/multifocal'){
   h+='<div class="v147ok"><b>Panurethral/multifocal disease:</b> map the entire urethra before reconstruction. Buccal-mucosa-based substitution urethroplasty or staged reconstruction is selected according to tissue quality, LS, length and surgeon expertise.</div>';
 }else if(site==='Meatal/fossa navicularis'){
   h+='<div class="v147n"><b>Distal disease:</b> distinguish isolated meatal stenosis from fossa-navicularis/longer distal stricture. Meatotomy/meatoplasty may suit selected short distal disease; longer disease generally needs graft/flap-based reconstruction according to tissue quality.</div>';
 }else if(site==='Bulbomembranous'){
   h+='<div class="v147n"><b>Bulbomembranous:</b> treat as a specialised reconstructive problem. Short strictures may be amenable to EPA; longer/radiation-associated disease may require augmentation. Counsel explicitly about de novo stress incontinence because of sphincter proximity.</div>';
 }else if(site==='Posterior/bladder neck'){
   h+='<div class="v147n"><b>Posterior/bladder-neck stenosis:</b> this is not a routine anterior-stricture algorithm. Establish prior surgery/radiation, bladder function and sphincter status. First line for a non-obliterative vesicourethral anastomotic stricture or radiation-induced bulbomembranous stricture is visually controlled dilatation or DVIU (EAU, weak); for non-obliterative bladder-neck stenosis after BPO surgery, transurethral resection or hot-knife incision (EAU, strong). Obliterative or recurrent disease needs reconstruction in a specialist centre.</div>';
 }
 if(prior==='Multiple endoscopic failures'||(prior==='Previous urethroplasty'&&!(site==='Bulbar'&&len<=2)))h+='<div class="v147a"><b>Recurrence gate:</b> repeated dilation/DVIU is not a substitute for definitive reconstruction in a fit patient with recurrent/long/complex disease. Refer to a reconstructive urethral surgeon and re-characterise the stricture before another intervention.</div>';
 if(fit==='High anaesthetic/operative risk'||goal==='Avoid major surgery')h+='<div class="v147n"><b>If urethroplasty is not an option:</b> DVIU/dilatation followed by intermittent self-dilatation (± intraurethral corticosteroid) to stabilise the stricture (EAU, weak); paclitaxel-coated balloon dilatation for a short (&lt;3 cm) bulbar stricture recurring after at least two endoscopic treatments (EAU 2026, strong); perineal urethrostomy as a durable alternative; long-term suprapubic catheter for radiation-induced bulbomembranous stricture or poor performance status (EAU).</div>';
 if(cal==='Obliterative'||cal==='Near-obliterative')h+='<div class="v147n"><b>High-grade disease:</b> obtain precise anatomical mapping; endoscopic incision alone may not be appropriate when there is little/no lumen or extensive spongiofibrosis.</div>';
 h+='<div class="v147r"><h3>Follow-up</h3><div class="v147n">Track symptoms, uroflow/PVR and recurrence using an anatomical test when clinically indicated. A fall in Qmax alone is not sufficient to diagnose recurrence; correlate with symptoms and objective assessment.</div></div>';
 h+='<div class="v147sub" style="margin-top:8px">Source: EAU Urethral Strictures guideline 2026 (uroweb.org/guidelines/urethral-strictures); AUA Urethral Stricture Disease guideline 2023 (auanet.org). Reviewed 10 Nov 2026.</div>';
 q('v147Result').innerHTML=h;
}
window.oracleOpenStricture=function(){open();var g=q('v147Go');if(g)g.onclick=generate;};
function hook(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return /^Urethral Stricture$/i.test((x.innerText||'').trim())});if(b&&!b.__v147){b.__v147=true;b.onclick=function(e){e.preventDefault();e.stopPropagation();open()}}}
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500)} if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}catch(e){console.error("[v14.7-stricture-engine]",e);}

/* ===== v14.8-bph-engine ===== */
try{
/* Urology Oracle — BPH / male LUTS treatment-selection engine. 2026 EAU-aligned. */
(function(){
'use strict';
function e(s){return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}function q(id){return document.getElementById(id)}function v(id){var x=q(id);return x?x.value:''}function n(id){var x=Number(v(id));return Number.isFinite(x)?x:null}function close(){var x=q('v148BphModal');if(x)x.remove()}
function css(){if(q('v148Css'))return;var s=document.createElement('style');s.id='v148Css';s.textContent='.v148m{position:fixed;inset:0;background:rgba(2,6,23,.72);z-index:100070;display:flex;justify-content:center;align-items:flex-start;padding:16px 9px;overflow:auto}.v148p{width:min(1080px,100%);max-height:95vh;overflow:auto;background:#fff;border-radius:16px;padding:16px;color:#172033;box-shadow:0 25px 90px rgba(0,0,0,.4)}.v148h{display:flex;justify-content:space-between}.v148h h2{margin:0;font-size:21px}.v148sub{font-size:11px;color:#64748b;margin-top:4px}.v148g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v148r{border-top:1px solid #e5e7eb;padding:11px 0}.v148r h3{font-size:13px;margin:0 0 7px;color:#17364d}.v148p input,.v148p select{box-sizing:border-box;width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:9px}.v148b{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800}.v148n{background:#f8fafc;border:1px solid #dbe4ee;border-radius:9px;padding:10px;font-size:11px;line-height:1.6;margin-top:8px}.v148a{background:#fef2f2;border-left:5px solid #b91c1c;border-radius:9px;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}.v148ok{background:#f0fdf4;border-left:5px solid #166534;border-radius:9px;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}@media(max-width:650px){.v148g{grid-template-columns:1fr 1fr}}@media(max-width:480px){.v148g{grid-template-columns:1fr}}';document.head.appendChild(s)}
function modal(body){close();css();var m=document.createElement('div');m.id='v148BphModal';m.className='v148m';m.innerHTML='<div class="v148p"><div class="v148h"><div><h2>BPH / male LUTS treatment engine</h2><div class="v148sub">Phenotype · objective assessment · medication · UDS gate · procedure selection</div></div><button class="v148b" id="v148Close">Close</button></div>'+body+'</div>';document.body.appendChild(m);q('v148Close').onclick=close;m.onclick=function(x){if(x.target===m)close()}}
function open(){modal('<div class="v148n"><b>Sequence:</b> classify storage/voiding/post-micturition symptoms → exclude infection/retention/stricture/neurologic causes → assess PVR, uroflow and prostate anatomy → choose conservative, drug or surgical pathway.</div>'+
'<div class="v148r"><h3>Clinical phenotype</h3><div class="v148g"><select id="v148IPSS"><option value="">IPSS</option><option>0-7 mild</option><option>8-19 moderate</option><option>20-35 severe</option></select><select id="v148Storage"><option value="">Storage symptoms</option><option>Minimal</option><option>Prominent</option></select><select id="v148Void"><option value="">Voiding symptoms</option><option>Minimal</option><option>Prominent</option></select><select id="v148PVR" ><option value="">PVR</option><option>&lt;50 mL</option><option>50-149 mL</option><option>150-299 mL</option><option>≥300 mL</option></select><input id="v148Qmax" type="number" min="0" step=".1" placeholder="Qmax (mL/s)"><input id="v148VV" type="number" min="0" step="1" placeholder="Voided volume (mL)"></div></div>'+
'<div class="v148r"><h3>Prostate / complication assessment</h3><div class="v148g"><input id="v148Vol" type="number" min="1" placeholder="Prostate volume (mL)"><select id="v148Median"><option value="">Median lobe</option><option>No</option><option>Yes</option><option>Unknown</option></select><select id="v148AUR"><option value="">Complications</option><option>None</option><option>Recurrent retention</option><option>Refractory haematuria</option><option>Recurrent UTI</option><option>Bladder stones</option><option>Upper tract/renal compromise</option></select><select id="v148PSA"><option value="">PSA context</option><option>Not needed for treatment choice</option><option>Needed for cancer/progression decision</option></select><select id="v148Med"><option value="">Medication history</option><option>None</option><option>Alpha-blocker</option><option>5-ARI</option><option>Combination</option><option>Other LUTS medication</option></select><select id="v148Sex"><option value="">Sexual priority</option><option>No specific priority</option><option>Preserve ejaculation if possible</option></select></div></div>'+
'<div class="v148r"><h3>UDS / surgical context</h3><div class="v148g"><select id="v148UDS"><option value="">UDS question</option><option>Clearly BPO phenotype; UDS unlikely to change decision</option><option>Diagnosis uncertain</option><option>Possible detrusor underactivity</option><option>Possible detrusor overactivity</option><option>Young patient / atypical voiding</option><option>Previous failed invasive treatment</option></select><select id="v148Anticoag"><option value="">Antithrombotic therapy</option><option>No</option><option>Yes</option></select><select id="v148Surgery"><option value="">Surgical preference</option><option>Open to surgery</option><option>Prefer medication / minimally invasive</option><option>Not decided</option></select></div></div><button class="v148b" id="v148Go">Generate BPH pathway</button><div id="v148Result"></div>')}
function openOld(){open()}
function generate(){var ip=v('v148IPSS'),storage=v('v148Storage'),voiding=v('v148Void'),pvr=v('v148PVR'),qmax=n('v148Qmax'),vv=n('v148VV'),vol=n('v148Vol'),median=v('v148Median'),comp=v('v148AUR'),med=v('v148Med'),sex=v('v148Sex'),uds=v('v148UDS'),ant=v('v148Anticoag'),surg=v('v148Surgery');var h='';
if(!ip||!storage||!voiding||!pvr){q('v148Result').innerHTML='<div class="v148a"><b>Core assessment incomplete.</b> Enter symptom severity, storage/voiding phenotype and PVR.</div>';return}
if(qmax!==null&&vv!==null&&vv<150)h+='<div class="v148a"><b>Low-volume uroflow:</b> Qmax is less reliable when voided volume is &lt;150 mL. Repeat a representative study before using flow rate as a major treatment discriminator.</div>';
if(qmax!==null&&qmax<10)h+='<div class="v148n"><b>Low Qmax:</b> this supports a low-flow pattern but does not distinguish BPO from detrusor underactivity or urethral stricture. Use clinical context, PVR and selective pressure-flow UDS when the distinction matters.</div>';
if(comp!=='None'&&comp)h+='<div class="v148ok"><b>Surgical indication/complication pathway:</b> recurrent retention, recurrent infection, bladder stones, refractory haematuria or upper-tract/renal compromise attributable to BPO strengthens the indication for operative treatment after appropriate evaluation.</div>';
if(pvr==='≥300 mL')h+='<div class="v148a"><b>Marked PVR:</b> assess renal function, infection, bladder contractility and alternative causes of poor emptying. If surgery is being considered, pressure-flow UDS may be useful because detrusor underactivity changes expected benefit.</div>';
if(uds&&uds!=='Clearly BPO phenotype; UDS unlikely to change decision')h+='<div class="v148n"><b>UDS gate:</b> selective pressure-flow urodynamics is appropriate when BPO is uncertain or detrusor underactivity/overactivity is plausible, and in selected younger patients, high PVR or previous failed invasive treatment. Do not make UDS mandatory for every man with severe uncomplicated voiding LUTS.</div>';
if(!vol){h+='<div class="v148a"><b>Prostate volume required for procedure selection.</b> Obtain TRUS/transabdominal imaging when choosing surgery.</div>'}
else if(vol<30){h+='<div class="v148ok"><b>Small prostate (&lt;30 mL):</b> if moderate-to-severe BPO symptoms require surgery and there is no middle lobe, TUIP is an established option. Other minimally invasive approaches depend on anatomy and availability.</div>'}
else if(vol<=80){h+='<div class="v148ok"><b>30–80 mL:</b> bipolar or monopolar TURP is a standard surgical option. AEEP/HoLEP/ThuLEP and selected vaporisation/Aquablation approaches are alternatives according to anatomy, expertise, bleeding risk and patient priorities.</div>';if(sex==='Preserve ejaculation if possible')h+='<div class="v148n"><b>Ejaculatory priority:</b> discuss ejaculation-preserving options where anatomically appropriate, including Aquablation and selected minimally invasive procedures; explain that conventional TURP/enucleation commonly affect antegrade ejaculation.</div>'}
else{h+='<div class="v148ok"><b>Large prostate (&gt;80 mL):</b> anatomical enucleation (e.g. HoLEP/ThuLEP/bipolar enucleation) is a major endoscopic option. Open/simple prostatectomy remains an option when endoscopic enucleation is unavailable, particularly for very large glands.</div>'}
if(ant==='Yes')h+='<div class="v148n"><b>Antithrombotics:</b> procedure choice should account for bleeding risk and the possibility of continuing therapy. Laser enucleation/vaporisation have supporting safety data in selected anticoagulated/antiplatelet patients, but perioperative management remains individualized.</div>';
h+='<div class="v148r"><h3>Medication pathway</h3><div class="v148n">Mild, non-bothersome symptoms → watchful waiting/lifestyle measures. For bothersome voiding LUTS, an alpha-blocker is a common first pharmacologic option. For men with enlarged prostate and progression risk, 5-ARI or combination therapy can be considered. Storage-directed drugs are selected only after assessing PVR and voiding safety.</div></div>';
h+='<div class="v148r"><h3>Preoperative checklist</h3><div class="v148n">History + validated symptom score/QoL · DRE · urinalysis · PVR · uroflow before treatment · prostate imaging for surgical planning · renal function when indicated/considering surgery · cystoscopy only when pathology or surgical planning makes findings relevant · selective UDS when indicated.</div></div>';
q('v148Result').innerHTML=h}
window.oracleOpenBPH=function(){open();setTimeout(function(){var g=q('v148Go');if(g)g.onclick=generate},20)};
function hook(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return /^BPH \/ Male LUTS$/i.test((x.innerText||'').trim())});if(b&&!b.__v148){b.__v148=true;b.onclick=function(e){e.preventDefault();e.stopPropagation();open();setTimeout(function(){q('v148Go').onclick=generate},20)}}}
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}catch(e){console.error("[v14.8-bph-engine]",e);}

/* ===== v14.9-scores-engine ===== */
try{
/* Urology Oracle — integrated scores & calculators. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const close=()=>{$('v149ScoreModal')?.remove()};
function css(){if($('v149Css'))return;const s=document.createElement('style');s.id='v149Css';s.textContent=`
.v149m{position:fixed;inset:0;background:rgba(2,6,23,.74);z-index:100080;display:flex;justify-content:center;align-items:flex-start;padding:14px 8px;overflow:auto}
.v149p{width:min(1080px,100%);max-height:96vh;overflow:auto;background:#fff;color:#172033;border-radius:16px;padding:16px;box-shadow:0 25px 90px rgba(0,0,0,.42)}
.v149h{display:flex;justify-content:space-between;gap:10px}.v149h h2{margin:0;font-size:21px}.v149sub{font-size:11px;color:#64748b;margin-top:4px}
.v149tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.v149tab{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:7px 10px;font-weight:800;font-size:11px}
.v149g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v149p input,.v149p select{box-sizing:border-box;width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:9px}.v149b{border:0;border-radius:9px;padding:9px 12px;background:#0f172a;color:#fff;font-weight:800;cursor:pointer}.v149n{background:#f8fafc;border:1px solid #dbe4ee;border-radius:9px;padding:10px;font-size:11px;line-height:1.6;margin:8px 0}.v149a{background:#fef2f2;border-left:5px solid #b91c1c;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}.v149ok{background:#f0fdf4;border-left:5px solid #166534;padding:10px;font-size:12px;line-height:1.6;margin-top:8px}.v149score{font-size:20px;font-weight:900}
@media(max-width:680px){.v149g{grid-template-columns:1fr 1fr}}@media(max-width:460px){.v149g{grid-template-columns:1fr}}`;
document.head.appendChild(s)}
function modal(){close();css();const m=document.createElement('div');m.id='v149ScoreModal';m.className='v149m';m.innerHTML=`
<div class="v149p"><div class="v149h"><div><h2>Urology scores & calculators</h2><div class="v149sub">Calculate → interpret → hand off to the relevant Oracle pathway. Scores support clinical judgement.</div></div><button class="v149b" id="v149Close">Close</button></div><div class="v149tabs" id="v149Tabs"></div><div id="v149Body"></div></div>`;
document.body.appendChild(m);$('v149Close').onclick=close;m.onclick=e=>{if(e.target===m)close()}}
const tabs=['IPSS','IIEF-5','ISUP','TWIST','STONE','Clavien-Dindo'];
function open(){modal();tabs.forEach((name,i)=>{const b=document.createElement('button');b.className='v149tab';b.textContent=name;b.onclick=()=>render(i);$('v149Tabs').appendChild(b)});render(0)}
function render(i){
let h='';
if(i===0)h=`<div class="v149n"><b>IPSS:</b> seven symptom items, each 0–5. Total 0–35; QoL/bother is separate.</div><div class="v149g">${[1,2,3,4,5,6,7].map(n=>`<input id="ip${n}" type="number" min="0" max="5" placeholder="Item ${n} (0–5)">`).join('')}<select id="ipq"><option value="">QoL/bother</option>${[0,1,2,3,4,5,6].map(n=>`<option>${n}</option>`).join('')}</select></div>`;
if(i===1)h=`<div class="v149n"><b>IIEF-5 / SHIM:</b> five validated items scored 1–5; total 5–25.</div><div class="v149g">${[1,2,3,4,5].map(n=>`<input id="ie${n}" type="number" min="1" max="5" placeholder="Item ${n} (1–5)">`).join('')}</div>`;
if(i===2)h=`<div class="v149n"><b>ISUP Grade Group:</b> 3+3=GG1; 3+4=GG2; 4+3=GG3; Gleason 8=GG4; Gleason 9–10=GG5.</div><div class="v149g"><select id="g1"><option value="">Primary</option><option>3</option><option>4</option><option>5</option></select><select id="g2"><option value="">Secondary</option><option>3</option><option>4</option><option>5</option></select></div>`;
if(i===3)h=`<div class="v149g"><select id="tw1"><option value="0">Swelling absent</option><option value="2">Swelling present +2</option></select><select id="tw2"><option value="0">Testis not hard</option><option value="2">Hard testis +2</option></select><select id="tw3"><option value="0">Cremasteric reflex present</option><option value="1">Absent +1</option></select><select id="tw4"><option value="0">No nausea/vomiting</option><option value="1">Nausea/vomiting +1</option></select><select id="tw5"><option value="0">Not high-riding</option><option value="1">High-riding +1</option></select></div>`;
if(i===4)h=`<div class="v149n"><b>STONE:</b> original score 0–13. A race-free modified score removes the original origin/race component. Both are probability aids, not diagnostic substitutes.</div><div class="v149g"><select id="ss"><option value="">Sex</option><option value="0">Female 0</option><option value="2">Male 2</option></select><select id="st"><option value="">Timing</option><option value="0">&gt;24 h 0</option><option value="1">6–24 h 1</option><option value="3">&lt;6 h 3</option></select><select id="so"><option value="">Original origin/race component</option><option value="0">Black 0</option><option value="3">Non-Black 3</option></select><select id="sn"><option value="">Nausea/vomiting</option><option value="0">None 0</option><option value="1">Nausea alone 1</option><option value="2">Vomiting 2</option></select><select id="sh"><option value="">Dipstick haematuria</option><option value="0">Absent 0</option><option value="3">Present 3</option></select></div>`;
if(i===5)h=`<select id="clv"><option value="">Observed postoperative event</option><option value="I">Grade I</option><option value="II">Grade II</option><option value="IIIa">Grade IIIa</option><option value="IIIb">Grade IIIb</option><option value="IVa">Grade IVa</option><option value="IVb">Grade IVb</option><option value="V">Grade V</option></select><div class="v149n">Grade III is divided into IIIa/IIIb and Grade IV into IVa/IVb.</div>`;
$('v149Body').innerHTML=`<div class="v149n">${i===5?'Select the documented intervention or organ-failure level.':'Enter the required inputs, then calculate.'}</div>${h}<button class="v149b" id="v149Calc">Calculate</button><div id="v149Out"></div>`;
$('v149Calc').onclick=()=>calculate(i)}
function calculate(i){
const out=$('v149Out');const ok=x=>`<div class="v149ok">${x}</div>`;const err=x=>`<div class="v149a">${x}</div>`;
if(i===0){const a=[1,2,3,4,5,6,7].map(n=>Number($('ip'+n).value));if(a.some(x=>!Number.isInteger(x)||x<0||x>5)){out.innerHTML=err('Enter all seven IPSS items (0–5).');return}const s=a.reduce((x,y)=>x+y,0),c=s===0?'Asymptomatic':s<=7?'Mild':s<=19?'Moderate':'Severe';out.innerHTML=ok(`<div class="v149score">IPSS ${s}/35</div>${c} · QoL ${$('ipq').value||'not entered'}/6`);return}
if(i===1){const a=[1,2,3,4,5].map(n=>Number($('ie'+n).value));if(a.some(x=>!Number.isInteger(x)||x<1||x>5)){out.innerHTML=err('Enter all five IIEF-5 items (1–5).');return}const s=a.reduce((x,y)=>x+y,0),c=s>=22?'No ED':s>=17?'Mild ED':s>=12?'Mild-to-moderate ED':s>=8?'Moderate ED':'Severe ED';out.innerHTML=ok(`<div class="v149score">IIEF-5 ${s}/25</div>${c}`);return}
if(i===2){const a=Number($('g1').value),b=Number($('g2').value);let g=null;if(a===3&&b===3)g=1;else if(a===3&&b===4)g=2;else if(a===4&&b===3)g=3;else if(a+b===8)g=4;else if(a+b===9||a+b===10)g=5;if(!g){out.innerHTML=err('Enter a valid Gleason primary/secondary combination.');return}out.innerHTML=ok(`<div class="v149score">ISUP GG ${g}</div>Gleason ${a}+${b}`);return}
if(i===3){const s=['tw1','tw2','tw3','tw4','tw5'].reduce((x,id)=>x+Number($(id).value),0),c=s<=2?'Low (0–2)':s<=4?'Intermediate (3–4)':'High (5–7)';out.innerHTML=ok(`<div class="v149score">TWIST ${s}/7</div>${c}<br><b>Clinical override:</b> suspected torsion requires urgent assessment.`);return}
if(i===4){const ids=['ss','st','so','sn','sh'];if(ids.some(id=>$(id).value==='')){out.innerHTML=err('Complete all STONE inputs. Do not infer the origin/race component.');return}const s=ids.reduce((x,id)=>x+Number($(id).value),0),m=s-Number($('so').value),c=s<=5?'Low':s<=9?'Moderate':'High';out.innerHTML=ok(`<div class="v149score">STONE ${s}/13</div>Original (validated bands 0–5 low, 6–9 moderate, 10–13 high): ${c} · Race-free sum without the origin item: ${m}/10 (no validated risk bands; do not apply the original cut-offs)<br>Use imaging to establish diagnosis when indicated.`);return}
const g=$('clv').value;if(!g){out.innerHTML=err('Select the documented postoperative event.');return}out.innerHTML=ok(`<div class="v149score">Clavien–Dindo ${g}</div>Record the actual intervention/organ-failure level and event date.`)}
window.oracleOpenScores=open;
function hook(){const b=[...document.querySelectorAll('button')].find(x=>(x.innerText||'').trim()==='Scores');if(b&&!b.__v149){b.__v149=true;b.onclick=e=>{e.preventDefault();e.stopPropagation();open()}}}
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}catch(e){console.error("[v14.9-scores-engine]",e);}
