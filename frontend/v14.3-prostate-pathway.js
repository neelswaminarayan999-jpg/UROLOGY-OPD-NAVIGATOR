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

function risk(psa,gg,t){
  var highFeature=(psa!==null&&psa>20)||gg>=4||['T3a','T3b','T4'].includes(t);
  var lowFeature=(psa!==null&&psa<10)&&gg===1&&['T1c','T2a'].includes(t);
  if(lowFeature)return 'Low risk';
  if(highFeature)return 'High risk / locally advanced feature';
  if((psa!==null&&psa>=10&&psa<=20)||gg===2||gg===3||['T2b','T2c'].includes(t))return 'Intermediate risk';
  return 'Risk group incomplete';
}

function renderRiskNote(r,psa,gg,t){
  if(r==='Low risk')return '<div class="v143-ok"><b>Risk pattern:</b> low-risk phenotype by the entered PSA, Grade Group and cT fields.</div>';
  if(r==='Intermediate risk')return '<div class="v143-note"><b>Risk pattern:</b> intermediate-risk phenotype. Further subclassification requires tumour burden (including biopsy core involvement) and the complete pathology/staging record before choosing active surveillance vs definitive treatment.</div>';
  if(r.indexOf('High risk')===0)return '<div class="v143-alert"><b>High-risk / locally advanced feature:</b> at least one high-risk variable is present. Confirm cT, Grade Group, PSA, N stage and metastatic imaging before treatment selection.</div>';
  return '<div class="v143-alert"><b>Risk group incomplete:</b> enter PSA, Grade Group and clinical T stage. Do not force a treatment branch from incomplete data.</div>';
}

function generate(){
  var psa=num('v143PSA'), g1=Number(val('v143Gleason1')), g2=Number(val('v143Gleason2'));
  var gg=gradeGroup(g1,g2), t=val('v143T'), n=val('v143N'), m=val('v143M'), life=val('v143Life'), symptoms=val('v143Symptoms');
  var pos=num('v143PositiveCores'), total=num('v143TotalCores'), maxPct=num('v143MaxCorePct');
  var r=risk(psa,gg,t), html='';

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
  }else if(t==='T3a'||t==='T3b'||t==='T4'||r.indexOf('High risk')===0){
    html+=highRiskPathway(n,life);
  }else if(r==='Low risk'){
    html+=lowRiskPathway(life);
  }else{
    html+=intermediatePathway(life,pos,total);
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

function intermediatePathway(life,pos,total){
  var burden='';
  if(pos!==null&&total!==null&&total>0){
    burden=(pos/total)<0.5?'Lower core burden entered.':'Higher core burden entered.';
  }
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — intermediate risk</div>'+
    '<div class="v143-note"><b>Favourable intermediate-risk phenotype:</b> selected patients, particularly with ISUP GG2 and low-volume disease, may be considered for active surveillance after full review. '+esc(burden)+'</div>'+
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
  return '<div class="v143-section"><div class="v143-label">Treatment pathway — metastatic hormone-sensitive prostate cancer</div>'+
    '<div class="v143-note"><b>Do not use ADT monotherapy routinely</b> when combination therapy is appropriate and the patient has sufficient life expectancy and accepts the added toxicity.</div>'+
    '<div class="v143-note"><b>Core systemic options:</b> ADT + abiraterone/prednisone, apalutamide, enzalutamide or rezvilutamide; darolutamide is also an option in selected fit patients. Choose according to disease volume/risk, comorbidity, interactions, access and patient priorities.</div>'+
    '<div class="v143-note"><b>Triplet therapy:</b> in patients fit for docetaxel, EAU 2026 recommends docetaxel only as part of ADT + abiraterone or ADT + darolutamide rather than docetaxel + ADT alone when an appropriate ARPI is available.</div>'+
    '<div class="v143-note"><b>Genomics:</b> assess germline/somatic homologous-recombination repair alterations in metastatic disease; selected HRR-mutated patients may qualify for PARP-inhibitor combinations according to current indications.</div>'+
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
