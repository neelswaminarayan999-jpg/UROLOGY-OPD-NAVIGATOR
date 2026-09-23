import assert from 'node:assert/strict';
import http from 'node:http';

process.env.PORT='8799';
process.env.GROQ_API_KEY='test-groq';
process.env.GEMINI_API_KEY='test-gemini';
process.env.CEREBRAS_API_KEY='test-cerebras';
process.env.OPENROUTER_API_KEY='test-openrouter';

const valid = {
  technical_adequacy:'Adequate', observations:[], interpretation:'Test', differential:[], urgent_flags:[],
  missing_data:[], uncertainty:[], suggested_disease:'None', suggested_oracle_values:{disease:'None',fields:[]},
  pathway_link:{requires_clinician_confirmation:true,suggested_module:'None',note:'Test'}, teaching:[]
};
let calls=0;
global.fetch = async (url) => {
  calls++;
  if (String(url).includes('groq.com')) return new Response(JSON.stringify({choices:[{message:{content:'User Safety: unsafe\nSafety Categories: Unauthorized Advice'}}]}),{status:200,headers:{'content-type':'application/json'}});
  if (String(url).includes('generativelanguage.googleapis.com')) return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(valid)}]}}]}),{status:200,headers:{'content-type':'application/json'}});
  return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(valid)}}]}),{status:200,headers:{'content-type':'application/json'}});
};
await import('../backend-server.mjs?schema-test=1');
await new Promise(r=>setTimeout(r,80));
const response=await new Promise((resolve,reject)=>{const req=http.request('http://127.0.0.1:8799/api/urology-ai',{method:'POST',headers:{'content-type':'application/json'}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>resolve({status:r.statusCode,json:JSON.parse(d)}));});req.on('error',reject);req.end(JSON.stringify({study:'test',context:{}}));});
const body=response.json;
assert.equal(response.status,200);
assert.equal(body.provider,'Gemini');
assert.equal(body.output_text,JSON.stringify(valid));
assert.equal(body.fallback_attempts.length,1);
assert.equal(body.fallback_attempts[0].provider,'Groq');
console.log('provider schema fallback: PASS');
process.exit(0);
