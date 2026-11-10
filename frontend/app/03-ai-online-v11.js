
(function(){
'use strict';
if(window.__URO_V11_ONLINE_READY)return;window.__URO_V11_ONLINE_READY=true;
const q=id=>document.getElementById(id);
const esc2=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const onlineState={images:[],last:null};
const V10LAB=window.V10GetInvestigationSchema?window.V10GetInvestigationSchema():{};
const safeGet=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}};
const safeSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}};
const savedEndpoint=()=>safeGet('uroOracleAiEndpoint','/api/urology-ai');
const savedModel=()=>safeGet('uroOracleAiModel','gpt-5.6-sol');

function hideOnline(){q('onlineAiView')?.classList.add('hidden');}
function openOracleForDisease(name, prefill={}){
  hideOnline();
  if(typeof window.openOracle==='function')window.openOracle();
  const sel=q('oracleDisease');if(!sel||!ORACLE_FIELDS[name])return;
  sel.value=name;oracleState={...prefill};renderOracleForm();renderOracleRisk(name,oracleState);
  q('oracleOutput').innerHTML='<div class="v11-note"><b>Clinical pathway ready for review.</b><br>Any values loaded from the AI Investigation Lab are provisional. Verify/edit them, then click <b>Generate treatment plan</b>.</div>';
  q('oracleView')?.scrollIntoView({behavior:'smooth',block:'start'});
}
window.openOracleForDisease=openOracleForDisease;
function diseaseSectionIndex(name){const d=DISEASES[name];if(!d)return -1;let best=-1;for(let i=0;i<d.sections.length;i++){const s=d.sections[i];const hay=(s.title+' '+s.items.flat().join(' ')).toLowerCase();if(/tnm|stage|staging|classification/.test(hay))return i;if(/risk|stratification/.test(hay))best=i;}return best;}
function openDiseaseTNM(name){if(typeof window.openDisease==='function')window.openDisease(name);const idx=diseaseSectionIndex(name);setTimeout(()=>{const el=q('sec-'+idx);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});else{const h=q('diseaseHeader');h?.insertAdjacentHTML('beforeend','<div class="v11-note mt-3"><b>Classification section:</b> no dedicated TNM/staging heading was found; use the disease sections shown below.</div>');}},60);}
window.openDiseaseTNM=openDiseaseTNM;

// Navigation repair: every major view explicitly hides the online pane, while Home also hides the dynamically created Book Lab.
['openDisease','openCalculators','openDrugs','openTrials','openOracle','openProcedureAtlas'].forEach(fn=>{
 const orig=window[fn];
 if(typeof orig==='function' && !orig.__v11Wrapped){const wrapped=function(){hideOnline();q('bookLabView')?.classList.add('hidden');return orig.apply(this,arguments)};wrapped.__v11Wrapped=true;window[fn]=wrapped;}
});
const origHome=window.showHome;if(typeof origHome==='function'&&!origHome.__v11OnlineWrapped){const wrapped=function(){hideOnline();q('bookLabView')?.classList.add('hidden');return origHome.apply(this,arguments)};wrapped.__v11OnlineWrapped=true;window.showHome=wrapped;}

function canonicalDisease(s){const x=String(s||'').toLowerCase();const map=[
 ['Ca Prostate',['prostate','prostatic carcinoma','prostate cancer','mri of the prostate']],
 ['Ca Bladder',['bladder','urothelial carcinoma of bladder','mibc','nmibc']],
 ['UTUC',['upper tract','utuc','renal pelvis urothelial','ureteric urothelial']],
 ['Ca Penis',['penile cancer','penis cancer']],
 ['Ca Testis',['testis','testicular']],
 ['Ca Kidney',['kidney cancer','renal cell','rcc','renal mass']],
 ['Urethral Cancer',['urethral carcinoma','urethral cancer']],
 ['Adrenal / Neuroendocrine',['adrenal','pheochromocytoma','ppgl','adrenocortical']],
 ['Urethral Stricture',['urethral stricture','stricture urethra','urethral stenosis']],
 ['BPH / Male LUTS',['bph','benign prostatic','male luts','bladder outlet obstruction','prostatic obstruction']],
 ['Stone Disease',['stone','calculus','urolithiasis','staghorn','nephrolithiasis','ureteric stone']]
];
 for(const [d,terms] of map)if(terms.some(t=>x.includes(t)))return d;return '';
}
function onlineStudyFields(type){const key=V10LAB[type];if(!key)return [];return key.fields.map(a=>({id:'ai-'+a[0],base:a[0],label:a[1],type:a[2],options:a[3]}));}
function renderOnlineFields(type){
 const fs=onlineStudyFields(type); if(!fs.length)return '<div class="v11-muted">No additional numeric field is required for this study. You can still supply an image and report text.</div>';
 return '<div class="v11-grid">'+fs.map(f=>{if(f.type==='select')return '<div class="v11-field"><label>'+esc2(f.label)+'</label><select id="'+esc2(f.id)+'"><option value="">Select…</option>'+f.options.split('|').map(o=>'<option>'+esc2(o)+'</option>').join('')+'</select></div>';return '<div class="v11-field"><label>'+esc2(f.label)+'</label><input id="'+esc2(f.id)+'" type="number" step="any"></div>';}).join('')+'</div>';
}
function defaultStudyForFocus(focus){if(V10LAB[focus])return focus;const map={'Ca Prostate':'mpmri','Urethral Stricture':'rgu','BPH / Male LUTS':'uroflow','Stone Disease':'ctstone','Ca Kidney':'renogram'};return map[focus]||'uroflow';}
function buildOracleSchemaForStudy(type){
 const diseases={
  uroflow:['BPH / Male LUTS','Urethral Stricture'], pfs:['BPH / Male LUTS'], filling:['BPH / Male LUTS'], mpmri:['Ca Prostate'], rgu:['Urethral Stricture','Urethral Cancer'], ctstone:['Stone Disease'], renogram:['Stone Disease','Ca Kidney'], trus:['BPH / Male LUTS','Ca Prostate'], penile:['Ca Penis'], semen:[], urine:['Ca Bladder','UTUC'], labs:[], diary:['BPH / Male LUTS']
 }[type]||[];
 return diseases.map(d=>{const fields=(ORACLE_FIELDS[d]||[]).map(f=>({id:f.id,label:f.label,type:f.type||'select',options:f.options||[]}));return {disease:d,fields};});
}
function getOnlinePayload(){
 const type=q('aiStudyType')?.value||'uroflow';
 const values={};for(const f of onlineStudyFields(type)){const e=q(f.id);if(e&&e.value!=='')values[f.base]=e.value;}
 const context={sex:q('aiSex')?.value||'',age:q('aiAge')?.value||'',symptoms:q('aiSymptoms')?.value||'',reason:q('aiReason')?.value||'',history:q('aiHistory')?.value||''};
 const report=q('aiReportText')?.value||'';
 const schema=buildOracleSchemaForStudy(type);
 const instruction={role:'system',content:[{type:'input_text',text:'You are a urology clinical-decision-support assistant. You are not the final diagnostician or prescriber. Analyze the supplied investigation images, report text and structured data together. Clearly separate observable findings from interpretation, differential considerations and uncertainty. Flag urgent patterns, technical limitations and important missing data. Never invent a measurement that is not visible or supplied. Before any treatment link is used, the clinician must verify the original study and confirm/edit all proposed structured values.'}]};
 const userText='Return a compact JSON object with exactly these top-level keys: technical_adequacy, observations, interpretation, differential, urgent_flags, missing_data, uncertainty, suggested_disease, suggested_oracle_values, pathway_link, teaching. suggested_oracle_values must be an object containing disease plus a fields object using the exact field IDs provided in the schema; only include values you can support from the supplied data. pathway_link must include requires_clinician_confirmation:true.\n\nSTUDY TYPE: '+type+'\nCLINICAL CONTEXT: '+JSON.stringify(context)+'\nSTRUCTURED INVESTIGATION VALUES: '+JSON.stringify(values)+'\nPASTED REPORT: '+report+'\nOFFLINE ORACLE SCHEMA AVAILABLE FOR THIS STUDY: '+JSON.stringify(schema);
 return {type,values,context,report,instruction,userText,schema};
}
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error||new Error('File read failed'));r.readAsDataURL(file);});}
function renderImages(){const host=q('aiImageList');if(!host)return;host.innerHTML=onlineState.images.length?onlineState.images.map((x,i)=>'<div class="v11-image-card"><img src="'+x.data+'" alt="AI image '+(i+1)+'"><span><b>'+esc2(x.name)+'</b><br>'+Math.round(x.size/1024)+' KB <button type="button" onclick="window.V11RemoveAIImage('+i+')" style="border:0;background:none;color:#991b1b;font-weight:900;cursor:pointer">remove</button></span></div>').join(''):'<div class="v11-muted">No images selected. The online engine also works from structured fields + report text.</div>';}
window.V11RemoveAIImage=i=>{onlineState.images.splice(i,1);renderImages();};
async function handleAIImages(files){const arr=[...files].slice(0,4);const bad=arr.find(f=>!f.type.startsWith('image/'));if(bad){q('aiStatus').innerHTML='<div class="v11-alert"><b>Upload error:</b> only image files are accepted.</div>';return;}const tooBig=arr.find(f=>f.size>8*1024*1024);if(tooBig){q('aiStatus').innerHTML='<div class="v11-alert"><b>Upload error:</b> each image must be ≤8 MB.</div>';return;}try{onlineState.images=await Promise.all(arr.map(async f=>({name:f.name,size:f.size,data:await fileToDataURL(f)})));renderImages();q('aiStatus').innerHTML='<div class="v11-status">'+onlineState.images.length+' image(s) ready for analysis.</div>';}catch(e){q('aiStatus').innerHTML='<div class="v11-alert"><b>Image read failed:</b> '+esc2(e.message||e)+'</div>';}}
function connectionMode(){return q('aiMode')?.value||'proxy';}
function requestEndpoint(){return (q('aiEndpoint')?.value||savedEndpoint()).trim();}
function requestModel(){return q('aiModel')?.value||savedModel();}
async function callOnlineAI(testOnly=false){
 const status=q('aiStatus'),out=q('aiOutput');if(!status||!out)return;
 const endpoint=requestEndpoint(),model=requestModel();if(!endpoint){status.innerHTML='<div class="v11-alert"><b>Connection error:</b> enter an AI endpoint.</div>';return;}
 const payload=getOnlinePayload();
 if(!testOnly && payload.type && payload.report==='' && !onlineState.images.length && !Object.keys(payload.values).length){out.innerHTML='<div class="v11-alert"><b>Nothing to interpret yet.</b> Add an image, paste a report, or enter structured study values.</div>';return;}
 status.innerHTML='<div class="v11-status">Sending '+(onlineState.images.length?'image(s) + ':'')+'structured data to '+esc2(endpoint)+' …</div>';
 const content=[{type:'input_text',text:payload.userText}];
 onlineState.images.forEach(img=>content.push({type:'input_image',image_url:img.data}));
 const body={model,input:[payload.instruction,{role:'user',content}],max_output_tokens:3000};
 try{
  const headers={'Content-Type':'application/json'};if(connectionMode()==='direct'){const key=(q('aiApiKey')?.value||'').trim();if(!key){throw new Error('Enter an API key for direct browser testing. For production, use a server-side proxy so the key is not shipped in the HTML.');}headers.Authorization='Bearer '+key;}
  const resp=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(body)});const txt=await resp.text();let data={};try{data=JSON.parse(txt)}catch{}if(!resp.ok)throw new Error(data.error?.message||txt.slice(0,500)||('HTTP '+resp.status));
  const outText=data.output_text||((data.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||x.output_text||'').filter(Boolean).join('\n'))||data.text||'';
  renderAIResult(outText,data,testOnly);status.innerHTML='<div class="v11-status">Online AI response received. All proposed treatment-link fields remain clinician-verification gates.</div>';
 }catch(e){status.innerHTML='<div class="v11-alert"><b>Online AI request failed.</b><br>'+esc2(e.message||e)+'<br><span class="v11-muted">For production, use a governed server-side endpoint. The offline Oracle remains fully usable without this connection.</span></div>';
 }
}
function jsonFromText(txt){const t=String(txt||'').trim();try{return JSON.parse(t)}catch{}const a=t.indexOf('{'),b=t.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(t.slice(a,b+1))}catch{}}return null;}
function arr(v){return Array.isArray(v)?v:(v==null||v===''?[]:[String(v)]);}
function normaliseOracleValues(suggested){
 if(!suggested||typeof suggested!=='object')return {disease:'',fields:{}};let d=canonicalDisease(suggested.disease||'');if(!d&&ORACLE_FIELDS[suggested.disease])d=suggested.disease;if(!d)return {disease:'',fields:{}};
 const raw=suggested.fields||{},valid={};for(const [id,value] of Object.entries(raw)){const f=(ORACLE_FIELDS[d]||[]).find(x=>x.id===id);if(!f||value==null||value==='')continue;if(f.type==='number'){const n=Number(value);if(Number.isFinite(n))valid[id]=n;}else{const vv=String(value);const exact=(f.options||[]).find(o=>String(o).toLowerCase()===vv.toLowerCase());if(exact)valid[id]=exact;}}
 return {disease:d,fields:valid};
}
function renderAIResult(txt,raw,testOnly){
 const out=q('aiOutput');if(!out)return;const j=jsonFromText(txt);if(!j){out.innerHTML='<h4>Online AI interpretation</h4><div class="v11-note">The endpoint returned text rather than the requested JSON shape. Read the narrative below, then independently verify the original study.</div><pre style="white-space:pre-wrap;font-size:10px;line-height:1.5;color:#334155">'+esc2(txt||JSON.stringify(raw,null,2))+'</pre>';return;}
 const tech=j.technical_adequacy;const sd=normaliseOracleValues(j.suggested_oracle_values);onlineState.last={json:j,normalized:sd};
 let html='<h4>AI-assisted investigation interpretation</h4>';
 if(testOnly){html+='<div class="v11-note"><b>Connection test successful.</b><br>The endpoint returned a parseable response. Clinical analysis was not run.</div>';out.innerHTML=html;return;}
 if(tech)html+='<div class="v11-kv"><b>Technical adequacy</b><div>'+esc2(typeof tech==='string'?tech:(tech.adequate!=null?(tech.adequate?'Adequate':'Not adequate')+' — '+(tech.issues||''):JSON.stringify(tech)))+'</div></div>';
 const sections=[['What the study shows','observations'],['Interpretation','interpretation'],['Differential / alternatives','differential'],['Urgent flags','urgent_flags'],['Missing data','missing_data'],['Uncertainty / limitations','uncertainty'],['Teaching points','teaching']];
 for(const [title,key] of sections){const a=arr(j[key]);if(a.length)html+='<h5>'+esc2(title)+'</h5><ul>'+a.map(x=>'<li>'+esc2(typeof x==='string'?x:JSON.stringify(x))+'</li>').join('')+'</ul>';}
 const candidate=canonicalDisease(j.suggested_disease||sd.disease||'');if(candidate)html+='<div class="v11-note mt-3"><b>Potential offline pathway module:</b> '+esc2(candidate)+'<br><span class="v11-muted">This is a provisional routing suggestion, not a diagnosis. Verify the original study and patient context.</span></div>';
 if(sd.disease){const chips=Object.entries(sd.fields).map(([k,v])=>'<span class="v11-chip">'+esc2(k)+' = '+esc2(v)+'</span>').join('');html+='<div class="v11-result" style="margin-top:10px"><h5>Proposed structured fields for offline Oracle</h5><div>'+ (chips||'<span class="v11-muted">No valid Oracle field values were safely extracted.</span>') +'</div><div class="v11-actions"><button type="button" class="v11-btn green" onclick="window.V11OpenAIPathway()">Review & open treatment pathway</button></div></div>';}else html+='<div class="v11-note mt-3"><b>No validated offline pathway mapping was produced.</b><br>The AI interpretation can still be used as a teaching/interpretation aid; enter confirmed values manually in the offline Oracle where applicable.</div>';
 html+='<div class="v11-muted" style="margin-top:10px">AI output is advisory. Final diagnosis, staging, treatment selection and procedure choice remain clinician decisions. Verify every extracted field against the original image/report.</div>';
 out.innerHTML=html;
}
window.V11OpenAIPathway=function(){const x=onlineState.last?.normalized;if(!x?.disease){q('aiOutput').insertAdjacentHTML('beforeend','<div class="v11-alert" style="margin-top:8px"><b>No verified pathway mapping is available.</b></div>');return;}openOracleForDisease(x.disease,x.fields);};
function savePrefs(){const ep=q('aiEndpoint')?.value?.trim();const model=q('aiModel')?.value;if(ep)safeSet('uroOracleAiEndpoint',ep);if(model)safeSet('uroOracleAiModel',model);q('aiStatus').innerHTML='<div class="v11-status">Endpoint/model preference saved locally. The API key is never stored by this module.</div>';}
function buildOnlineAI(focus){const root=q('onlineAiRoot');if(!root)return;root.innerHTML='<div class="v11-ai-card"><div class="v11-ai-head"><h3>Online AI Investigation Lab</h3><p>Upload radiology plates, uroflow curves or UDS traces, add standard dropdown data and/or the written report, then obtain an AI-assisted read. The app will only load validated AI-suggested fields into the offline Oracle after an explicit review step.</p></div><div class="v11-ai-body"><div class="v11-note"><b>Clinical workflow:</b> image/report + standard data → AI observations → differential/uncertainty → clinician verification → structured phenotype → offline treatment Oracle. Never treat the AI response as an autonomous diagnosis or treatment order.</div><div class="v11-grid" style="margin-top:10px"><div class="v11-field"><label>Investigation type</label><select id="aiStudyType"><option value="uroflow">Uroflow curve</option><option value="pfs">Pressure-flow UDS</option><option value="filling">Filling cystometry</option><option value="mpmri">Prostate MRI</option><option value="rgu">RGU / MCUG</option><option value="ctstone">Stone CT / NCCT</option><option value="renogram">Renogram</option><option value="trus">TRUS / prostate measurements</option><option value="penile">Penile Doppler</option><option value="semen">Semen analysis</option><option value="urine">Urinalysis / urine culture</option><option value="labs">CBC / KFT</option><option value="diary">Bladder diary</option></select></div><div class="v11-field"><label>Sex</label><select id="aiSex"><option value="">Not specified</option><option>Male</option><option>Female</option><option>Other / not stated</option></select></div><div class="v11-field"><label>Age group</label><select id="aiAge"><option value="">Not specified</option><option>&lt;18</option><option>18–39</option><option>40–59</option><option>60–79</option><option>≥80</option></select></div><div class="v11-field"><label>Primary symptoms / phenotype</label><select id="aiSymptoms"><option value="">Not specified</option><option>Hematuria</option><option>Storage LUTS</option><option>Voiding LUTS</option><option>Retention</option><option>Stone symptoms / renal colic</option><option>Urethral symptoms</option><option>ED / sexual dysfunction</option><option>Infertility</option><option>Surveillance / known cancer</option><option>Other</option></select></div><div class="v11-field"><label>Why was this study done?</label><select id="aiReason"><option value="">Not specified</option><option>Initial diagnostic work-up</option><option>Pre-operative planning</option><option>Post-operative / post-treatment assessment</option><option>Cancer staging / surveillance</option><option>Functional urology assessment</option><option>Emergency / urgent assessment</option></select></div><div class="v11-field"><label>Relevant prior history</label><select id="aiHistory"><option value="">None stated</option><option>Prior urethral procedure</option><option>Prior stone procedure</option><option>Prior prostate surgery</option><option>Prior bladder cancer treatment</option><option>Prior pelvic radiation</option><option>Known prostate cancer</option><option>Known RCC / renal mass</option><option>Other oncologic history</option></select></div></div><div class="v11-field" style="margin-top:10px"><label>Additional structured investigation data</label><div id="aiStructuredFields">'+renderOnlineFields(focus||'uroflow')+'</div><div class="v11-help">These fields mirror the offline investigation reader. They are sent alongside the images and report so the model can cross-check the visual and numeric information.</div></div><div class="v11-grid2" style="margin-top:10px"><div class="v11-field"><label>Paste the written report / impression</label><textarea id="aiReportText" placeholder="Paste the radiology/urodynamics/uroflow report or impression here. The model will compare the text with the supplied image and structured data."></textarea></div><div><div class="v11-field"><label>Investigation images (up to 4, ≤8 MB each)</label><input id="aiImageUpload" type="file" accept="image/*" multiple style="display:block;margin-top:6px;font-size:10px"></div><div id="aiImageList" class="v11-image-list"></div><div id="aiStatus" style="margin-top:8px"></div></div></div><div class="v11-result" style="margin-top:10px"><h5>Online connection</h5><div class="v11-grid"><div class="v11-field"><label>Connection mode</label><select id="aiMode"><option value="proxy">Server-side proxy (recommended)</option><option value="direct">Direct OpenAI API (temporary browser testing)</option></select></div><div class="v11-field"><label>Endpoint</label><input id="aiEndpoint" value="'+esc2(savedEndpoint())+'" placeholder="/api/urology-ai or your governed endpoint"></div><div class="v11-field"><label>Model</label><select id="aiModel"><option value="gpt-5.6-sol">GPT-5.6 Sol — high-reasoning</option><option value="gpt-5.6-terra">GPT-5.6 Terra — balanced</option><option value="gpt-5.6-luna">GPT-5.6 Luna — lower cost</option></select></div></div><div class="v11-grid2" style="margin-top:8px"><div class="v11-field" id="aiKeyWrap" style="display:none"><label>API key — session only</label><input id="aiApiKey" type="password" autocomplete="off" placeholder="Do not embed a production key in this HTML"><div class="v11-help">Direct browser mode is for testing only. Production deployments should keep credentials on a server-side proxy.</div></div><div class="v11-field"><label>Data/privacy gate</label><select id="aiPrivacy"><option>De-identified / no direct identifiers</option><option>PHI present — use only with an authorized governed backend</option></select><div class="v11-help">Do not send identifiable patient data to an unapproved endpoint.</div></div></div><div class="v11-actions"><button type="button" class="v11-btn light" id="aiSaveBtn">Save endpoint/model</button><button type="button" class="v11-btn light" id="aiTestBtn">Test connection</button><button type="button" class="v11-btn primary" id="aiRunBtn">Analyze image + data</button><button type="button" class="v11-btn light" id="aiResetBtn">Reset online lab</button></div></div><div id="aiOutput" class="v11-result"><h4>Online AI output</h4><div class="v11-muted">Add an image, report or structured investigation values, then run the online analysis.</div></div></div></div>';
 q('aiStudyType').value=defaultStudyForFocus(focus);q('aiModel').value=savedModel();q('aiMode').addEventListener('change',()=>{q('aiKeyWrap').style.display=connectionMode()==='direct'?'block':'none';});q('aiStudyType').addEventListener('change',()=>{q('aiStructuredFields').innerHTML=renderOnlineFields(q('aiStudyType').value);});q('aiImageUpload').addEventListener('change',e=>handleAIImages(e.target.files||[]));q('aiRunBtn').addEventListener('click',()=>callOnlineAI(false));q('aiTestBtn').addEventListener('click',()=>callOnlineAI(true));q('aiSaveBtn').addEventListener('click',savePrefs);q('aiResetBtn').addEventListener('click',()=>{onlineState.images=[];onlineState.last=null;buildOnlineAI(q('aiStudyType')?.value||'uroflow');});renderImages();
}
function openOnlineAI(focus){aiState.focus=(typeof focus==='string'&&DISEASES[focus])?focus:'';buildOnlineAI(focus);['homeView','diseaseView','oracleView','calcView','drugView','trialView','searchView','procedureView'].forEach(id=>q(id)?.classList.add('hidden'));q('bookLabView')?.classList.add('hidden');q('onlineAiView')?.classList.remove('hidden');q('onlineAiView')?.scrollIntoView({behavior:'smooth',block:'start'});}
window.openOnlineAI=openOnlineAI;

// Header action buttons can also be triggered safely by data attributes in future revisions.
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-v11-action]');if(!b)return;const action=b.dataset.v11Action;if(action==='treatment')openOracleForDisease(b.dataset.disease);if(action==='tnm')openDiseaseTNM(b.dataset.disease);if(action==='online')openOnlineAI(b.dataset.disease);});

// Self-test: all offline disease engines must return a non-empty management block without throwing.
function runEngineSelfTest(){
 const cases={
  'Ca Prostate':{state:'Localized',gg:'2',psa:10,ct:'T2a',cn:'N0',cm:'M0'},
  'Ca Bladder':{t:'Ta',m:'M0',grade:'LG',cis:'No',resect:'Yes'},
  'UTUC':{risk:'Low-risk phenotype',location:'Renal pelvis',t:'Ta/Tis',grade:'Low',hydro:'No',cyto:'Negative/low-grade',size:'<2 cm',multifocal:'No',met:'M0'},
  'Ca Penis':{primary:'T1a',grade:'G2',lvi:'No',cngroin:'cN0'},
  'Ca Testis':{hist:'Seminoma',stage:'I',markers:'Normal'},
  'Ca Kidney':{hist:'Clear-cell RCC',t:'T1a',nodes:'N0',met:'M0'},
  'Urethral Cancer':{site:'Bulbar male',hist:'SCC',t:'T2',nodes:'N0',met:'M0',resect:'Yes'},
  'Adrenal / Neuroendocrine':{lesion:'Adrenal incidentaloma',pheo:'Yes',hormone:'Negative',imaging:'Benign-appearing'},
  'Urethral Stricture':{sex:'Male',site:'Bulbar',length:'1–2 cm',obliterative:'Non-obliterative',primary:'Primary untreated'},
  'BPH / Male LUTS':{bother:'Moderate/severe/bothersome',complication:'None',size:'30–80 mL'},
  'Stone Disease':{site:'Kidney',size:'10–20 mm',infection:'No',renal:'Normal',staghorn:'No'}
 };
 const results=[];for(const [name,v] of Object.entries(cases)){try{const fn={"Ca Prostate":prostateOracle,"Ca Bladder":bladderOracle,"UTUC":utucOracle,"Ca Penis":penisOracle,"Ca Testis":testisOracle,"Ca Kidney":kidneyOracle,"Urethral Cancer":urethralCancerOracle,"Adrenal / Neuroendocrine":adrenalOracle,"Urethral Stricture":strictureOracle,"BPH / Male LUTS":bphOracle,"Stone Disease":stoneOracle}[name];const out=fn(v);results.push({name,ok:typeof out==='string'&&out.includes('Recommended pathway')});}catch(e){results.push({name,ok:false,error:String(e)})}}
 window.URO_ORACLE_SELFTEST={passed:results.filter(x=>x.ok).length,total:results.length,results};return window.URO_ORACLE_SELFTEST;
}
window.URO_ORACLE_SELFTEST_RUN=runEngineSelfTest;setTimeout(runEngineSelfTest,0);
})();
