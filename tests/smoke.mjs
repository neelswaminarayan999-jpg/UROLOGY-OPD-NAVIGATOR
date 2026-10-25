import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const child=spawn(process.execPath,[path.join(root,'backend-server.mjs')],{cwd:root,env:{...process.env,PORT:'8799',WEB_ROOT:path.join(root,'frontend'),GEMINI_API_KEY:''}});
const get=p=>new Promise((resolve,reject)=>{const r=http.get('http://127.0.0.1:8799'+p,res=>{let b='';res.on('data',x=>b+=x);res.on('end',()=>resolve({status:res.statusCode,body:b,headers:res.headers}));});r.on('error',reject)});
try{
 await new Promise(r=>setTimeout(r,250));
 const h=await get('/health');assert.equal(h.status,200);assert.match(h.body,/urology-oracle-online-ai/);
 const i=await get('/');assert.equal(i.status,200);assert.match(i.body,/Urology Oracle/);
 const sw=await get('/sw.js');assert.equal(sw.status,200);assert.match(sw.body,/api\//);
 const mf=await get('/manifest.webmanifest');assert.equal(mf.status,200);
 console.log('HTTP smoke: PASS');
}finally{child.kill('SIGTERM');}
