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
 '<select id="v146Prior'><option value="">Prior treatment</option><option value="none">None</option><option value="stent">Stent / nephrostomy</option><option value="failed">Previous failed SWL/URS/PCNL</option></select>'+
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
 if(stoneType==='uric')h+='<div class="v146s-note"><b>Composition pathway:</b> if uric-acid stone is strongly suspected/confirmed, assess urine pH and consider oral chemolysis where appropriate and safe; confirm composition whenever stone material is available.';
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
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
