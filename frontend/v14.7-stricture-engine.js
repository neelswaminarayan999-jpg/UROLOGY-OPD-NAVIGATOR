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
   if(a==='Traumatic/straddle'&&cal==='Obliterative'&&sp==='Extensive'){
     h+='<div class="v147ok"><b>Strong EPA phenotype:</b> short post-traumatic bulbar stricture with near/complete obliteration and full-thickness spongiofibrosis → transecting EPA is an established reconstructive option.</div>';
   }else{
     h+='<div class="v147ok"><b>Short bulbar phenotype:</b> if a first presentation is truly short and non-obliterative, dilation/DVIU may be considered after recurrence counselling. For definitive reconstruction, non-transecting EPA or free-graft urethroplasty are preferred over routine transecting EPA for non-straddle short bulbar strictures.</div>';
   }
 }else if(site==='Bulbar'&&len>2){
   h+='<div class="v147ok"><b>Longer bulbar stricture:</b> usually not amenable to tension-free EPA → free-graft urethroplasty, commonly buccal mucosa, is the principal reconstructive pathway. A short nearly-obliterative critical segment may permit an augmented non-transecting repair in selected cases.</div>';
 }else if(site==='Penile'){
   h+='<div class="v147ok"><b>Penile stricture:</b> endoscopic treatment has limited durability for established disease. Reconstructive planning is based on length, tissue quality and LS involvement; free-graft/staged reconstruction is commonly required for extensive disease.</div>';
 }else if(site==='Panurethral/multifocal'){
   h+='<div class="v147ok"><b>Panurethral/multifocal disease:</b> map the entire urethra before reconstruction. Buccal-mucosa-based substitution urethroplasty or staged reconstruction is selected according to tissue quality, LS, length and surgeon expertise.</div>';
 }else if(site==='Meatal/fossa navicularis'){
   h+='<div class="v147n"><b>Distal disease:</b> distinguish isolated meatal stenosis from fossa-navicularis/longer distal stricture. Meatotomy/meatoplasty may suit selected short distal disease; longer disease generally needs graft/flap-based reconstruction according to tissue quality.</div>';
 }else if(site==='Bulbomembranous'){
   h+='<div class="v147n"><b>Bulbomembranous:</b> treat as a specialised reconstructive problem. Short strictures may be amenable to EPA; longer/radiation-associated disease may require augmentation. Counsel explicitly about de novo stress incontinence because of sphincter proximity.</div>';
 }else if(site==='Posterior/bladder neck'){
   h+='<div class="v147n"><b>Posterior/bladder-neck stenosis:</b> this is not a routine anterior-stricture algorithm. Establish prior surgery/radiation, bladder function and sphincter status, then use the appropriate posterior/BNC reconstruction pathway.</div>';
 }
 if(prior==='Multiple endoscopic failures'||prior==='Previous urethroplasty')h+='<div class="v147a"><b>Recurrence gate:</b> repeated dilation/DVIU is not a substitute for definitive reconstruction in a fit patient with recurrent/long/complex disease. Refer to a reconstructive urethral surgeon and re-characterise the stricture before another intervention.</div>';
 if(cal==='Obliterative'||cal==='Near-obliterative')h+='<div class="v147n"><b>High-grade disease:</b> obtain precise anatomical mapping; endoscopic incision alone may not be appropriate when there is little/no lumen or extensive spongiofibrosis.</div>';
 h+='<div class="v147r"><h3>Follow-up</h3><div class="v147n">Track symptoms, uroflow/PVR and recurrence using an anatomical test when clinically indicated. A fall in Qmax alone is not sufficient to diagnose recurrence; correlate with symptoms and objective assessment.</div></div>';
 q('v147Result').innerHTML=h;
}
function hook(){var b=Array.from(document.querySelectorAll('button')).find(function(x){return /^Urethral Stricture$/i.test((x.innerText||'').trim())});if(b&&!b.__v147){b.__v147=true;b.onclick=function(e){e.preventDefault();e.stopPropagation();open()}}}
function init(){hook();setTimeout(hook,500);setTimeout(hook,1200);setTimeout(hook,2500)} if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();