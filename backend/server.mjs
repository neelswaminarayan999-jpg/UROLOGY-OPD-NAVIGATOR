import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(process.env.WEB_ROOT || path.join(__dirname, 'frontend'));
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACKS = String(process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.8-flash').split(',').map(x=>x.trim()).filter(Boolean);
const API_KEY = process.env.GEMINI_API_KEY || '';
const BASE_URL = (process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
const MAX_BODY = 32 * 1024 * 1024;
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_10MIN || 20);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const buckets = new Map();

function corsHeaders(origin){
  const allowed = ALLOWED_ORIGIN === '*' || origin === ALLOWED_ORIGIN;
  return allowed ? {'Access-Control-Allow-Origin':ALLOWED_ORIGIN==='*'?'*':origin,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,GET,OPTIONS','Vary':'Origin'} : {};
}
function json(res,status,body,origin=''){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...corsHeaders(origin)});res.end(JSON.stringify(body));}
function clientIp(req){return String(req.headers['x-forwarded-for']||'').split(',')[0].trim()||req.socket.remoteAddress||'unknown';}
function rateAllowed(req){const now=Date.now(),key=clientIp(req),windowMs=10*60*1000;const recent=(buckets.get(key)||[]).filter(t=>now-t<windowMs);if(recent.length>=RATE_LIMIT){buckets.set(key,recent);return false;}recent.push(now);buckets.set(key,recent);return true;}
function readBody(req){return new Promise((resolve,reject)=>{let total=0,chunks=[];req.on('data',c=>{total+=c.length;if(total>MAX_BODY){reject(new Error('Request too large'));req.destroy();return;}chunks.push(c);});req.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));req.on('error',reject);});}
function stripDataUrl(v){const m=String(v||'').match(/^data:([^;]+);base64,(.+)$/s);return m?{mimeType:m[1],data:m[2]}:null;}
function extractText(data){return (data?.candidates||[]).flatMap(c=>(c?.content?.parts||[]).map(p=>p?.text).filter(x=>typeof x==='string')).join('\n').trim();}
function schema(){return {type:'object',properties:{technical_adequacy:{type:'string'},observations:{type:'array',items:{type:'string'}},interpretation:{type:'string'},differential:{type:'array',items:{type:'string'}},urgent_flags:{type:'array',items:{type:'string'}},missing_data:{type:'array',items:{type:'string'}},uncertainty:{type:'array',items:{type:'string'}},teaching:{type:'array',items:{type:'string'}},suggested_disease:{type:'string',enum:['Ca Prostate','Ca Bladder','UTUC','Ca Penis','Ca Testis','Ca Kidney','Urethral Cancer','Adrenal / Neuroendocrine','Urethral Stricture','BPH / Male LUTS','Stone Disease','None']},suggested_oracle_values:{type:'object',properties:{disease:{type:'string'},fields:{type:'array',items:{type:'object',properties:{id:{type:'string'},value:{type:'string'}},required:['id','value']}}},required:['disease','fields']},pathway_link:{type:'object',properties:{requires_clinician_confirmation:{type:'boolean'},suggested_module:{type:'string'},note:{type:'string'}},required:['requires_clinician_confirmation','suggested_module','note']}},required:['technical_adequacy','observations','interpretation','differential','urgent_flags','missing_data','uncertainty','teaching','suggested_disease','suggested_oracle_values','pathway_link']};}
function prompt(body){const study=String(body.study||'investigation');const ctx=body.context||{};return `You are the online investigation assistant inside a urology clinical decision-support tool. Study: ${study}.\n\nPatient/context data:\n${JSON.stringify(ctx)}\n\nInterpret only the supplied images, written report and structured data. Do not invent measurements. Distinguish visible facts from interpretation. State technical limitations. Provide observations, interpretation, differential/alternatives, urgent flags, missing information, uncertainty and teaching points. If an existing Oracle module is reasonably suggested, choose one canonical module and provide only directly supported structured values. This is advisory clinical decision support; do not issue an autonomous diagnosis or treatment order.`;}
async function callGemini(body,model){
  const parts=[{text:prompt(body)}];
  if(typeof body.context?.report==='string'&&body.context.report)parts.push({text:'Written report:\n'+body.context.report});
  for(const img of (body.images||[])){const x=stripDataUrl(img);if(x&&/^image\//i.test(x.mimeType))parts.push({inline_data:{mime_type:x.mimeType,data:x.data}});}
  const request={contents:[{role:'user',parts}],generationConfig:{responseMimeType:'application/json',responseSchema:schema(),thinkingConfig:{thinkingLevel:'low'},maxOutputTokens:2200}};
  const r=await fetch(`${BASE_URL}/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'x-goog-api-key':API_KEY,'Content-Type':'application/json'},body:JSON.stringify(request)});
  const txt=await r.text();let data={};try{data=JSON.parse(txt);}catch{}
  if(!r.ok){const e=new Error(data?.error?.message||txt.slice(0,800)||`Gemini HTTP ${r.status}`);e.status=r.status;throw e;}
  return {output_text:extractText(data),model,provider:'Gemini'};
}
async function runAI(body){if(!API_KEY)throw new Error('Server is not configured with GEMINI_API_KEY.');const models=[MODEL,...FALLBACKS.filter(x=>x!==MODEL)];let last;for(const model of models){try{return await callGemini(body,model);}catch(e){last=e;if(![429,503].includes(e.status))break;}}throw last||new Error('Gemini request failed.');}
function serveStatic(req,res,origin){let p=(req.url||'/').split('?')[0];if(p==='/')p='/index.html';if(!p.startsWith('/')||p.includes('..'))return json(res,400,{error:'Invalid path'},origin);const file=path.resolve(WEB_ROOT,'.'+p);if(!file.startsWith(WEB_ROOT)||!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,404,{error:'Not found'},origin);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);}
const server=http.createServer(async(req,res)=>{const origin=String(req.headers.origin||'');try{if(req.method==='OPTIONS'){res.writeHead(204,corsHeaders(origin));return res.end();}if(origin&&ALLOWED_ORIGIN!=='*'&&origin!==ALLOWED_ORIGIN)return json(res,403,{error:'Origin is not allowed.'},origin);if(req.method==='GET'&&req.url==='/health')return json(res,200,{ok:true,service:'urology-oracle-online-ai',model:MODEL,fallbacks:FALLBACKS,provider:'Gemini',configured:Boolean(API_KEY)},origin);if(req.method==='POST'&&req.url==='/api/urology-ai'){if(!rateAllowed(req))return json(res,429,{error:'Rate limit reached. Please try again later.'},origin);let body={};try{body=JSON.parse(await readBody(req));}catch{return json(res,400,{error:'Invalid JSON payload.'},origin);}return json(res,200,await runAI(body),origin);}if(req.method==='GET')return serveStatic(req,res,origin);return json(res,405,{error:'Method not allowed'},origin);}catch(e){return json(res,e.status===429?429:500,{error:e?.message||String(e)},origin);}});
server.listen(PORT,HOST,()=>console.log(`Urology Oracle backend listening on ${HOST}:${PORT}; Gemini model=${MODEL}`));
