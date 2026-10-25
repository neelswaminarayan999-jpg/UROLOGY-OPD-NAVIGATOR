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
        ['Phenylephrine safety','Commonly used diluted concentrations are around 100–500 micrograms/mL, administered in small intracavernosal aliquots at short intervals under monitoring. Follow the local protocol for concentration, maximum cumulative dose and cardiovascular precautions.'],
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
