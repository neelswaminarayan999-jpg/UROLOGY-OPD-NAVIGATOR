/* Urology Oracle — focused uro-oncology pathways: RCC, UTUC, Testis.
   2026 EAU-aligned clinical navigation. Separate module; no AI/provider changes.
*/
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]);}
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
else if(M==='cM1'){out='<div class="v144-note"><b>Metastatic RCC:</b> confirm histology and obtain IMDC variables before systemic selection. Common first-line clear-cell combinations include nivolumab + ipilimumab, pembrolizumab + axitinib, pembrolizumab + lenvatinib, or nivolumab + cabozantinib according to IMDC risk, comorbidity, contraindications and local availability.</div><div class="v144-note"><b>Oligometastatic disease:</b> local treatment of metastases may be considered in selected patients; systemic therapy and local control should be integrated through MDT review.</div>';}
else if(T==='cT1a'){out='<div class="v144-ok"><b>Small renal mass:</b> partial nephrectomy is generally preferred when technically feasible. Active surveillance or tumour ablation are alternatives in selected patients, particularly when competing mortality/frailty makes intervention less attractive.</div>';}
else if(T==='cT1b'){out='<div class="v144-ok"><b>cT1b:</b> partial nephrectomy is preferred where technically feasible and oncologically appropriate; radical nephrectomy remains appropriate when partial nephrectomy is not suitable. Consider renal function, anatomy and surgical complexity.</div>';}
else if(T==='cT2'){out='<div class="v144-note"><b>cT2:</b> radical nephrectomy is commonly used; partial nephrectomy may be considered in selected cases, particularly when renal preservation is important and technically feasible. Use tumour complexity and renal reserve rather than size alone.</div>';}
else if(T.indexOf('cT3')===0||T==='cT4'){out='<div class="v144-note"><b>Locally advanced RCC:</b> if resectable, nephrectomy with removal of venous tumour thrombus when indicated is the core surgical pathway. Multidisciplinary planning is essential, especially for IVC involvement.</div>';if(th&&th!=='None')out+='<div class="v144-note"><b>Venous thrombus:</b> '+esc(th)+'. Map the thrombus level and plan vascular control/reconstruction with appropriate expertise.</div>';}
if(kid==='Solitary kidney'||kid==='Bilateral renal tumours'||kid==='Compromised renal function')out+='<div class="v144-alert"><b>Renal preservation flag:</b> nephron-sparing strategy deserves explicit consideration; obtain functional assessment and discuss with a renal/urologic oncology MDT.</div>';
if(frail==='Frailty / major comorbidity'||frail==='Comprehensive geriatric assessment needed')out+='<div class="v144-note"><b>Frailty:</b> incorporate comprehensive geriatric and nephrological assessment before choosing intervention or systemic therapy.</div>';
if(v('rAdjuv')==='pT2 G4'||v('rAdjuv')==='pT3 any grade'||v('rAdjuv')==='pT4'||v('rAdjuv')==='pN+'||v('rAdjuv')==='M1 NED after complete metastasectomy')out+='<div class="v144-note"><b>Adjuvant therapy:</b> for selected high-risk clear-cell RCC after nephrectomy, adjuvant pembrolizumab should be discussed when trial/label criteria are met. Verify current regulatory eligibility and timing locally.</div>';
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