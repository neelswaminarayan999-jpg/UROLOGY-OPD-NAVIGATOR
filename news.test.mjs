// V16.13 weekly news: ranking, filtering and abstract parsing (no network), plus the shipped news.json shape.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { score, abstracts, query } from './tools/weekly-news.mjs';

const rct = score({ uid: '1', title: 'Adjuvant therapy in high-risk disease: a randomized phase 3 trial', source: 'Eur Urol', pubtype: ['Journal Article', 'Randomized Controlled Trial'], sortpubdate: '2026/11/20 00:00', articleids: [{ idtype: 'doi', value: '10.1/x' }] });
const obs = score({ uid: '2', title: 'Outcomes of ureteroscopy in a single-centre retrospective series', source: 'Urology', pubtype: ['Journal Article'] });
const gl = score({ uid: '3', title: 'EAU-ESTRO consensus statement on salvage radiotherapy after prostatectomy', source: 'Eur Urol', pubtype: ['Journal Article'] });
assert.ok(rct && obs && gl);
assert.equal(rct.type, 'Randomised trial'); assert.equal(rct.doi, '10.1/x'); assert.equal(rct.date, '2026-11-20');
assert.equal(gl.type, 'Guideline / consensus');
assert.ok(rct.score > obs.score && gl.score > obs.score, 'trials and guidelines rank above routine series');
assert.equal(score({ uid: '4', title: 'Re: Robotic versus open cystectomy for bladder cancer', source: 'J Urol', pubtype: ['Comment', 'Journal Article'] }), null, 'replies dropped');
assert.equal(score({ uid: '5', title: 'Editorial comment on a trial of stent omission after ureteroscopy', source: 'J Urol', pubtype: ['Editorial'] }), null, 'editorials dropped');
assert.ok(score({ uid: '6', title: 'Androgen receptor signalling in a mouse model of castration resistance', source: 'Eur Urol', pubtype: ['Journal Article'] }).score < obs.score + 1, 'animal work ranked down');
const xml = '<PubmedArticleSet><PubmedArticle><MedlineCitation><PMID Version="1">111</PMID><Abstract><AbstractText Label="BACKGROUND">Why &amp; how.</AbstractText><AbstractText Label="RESULTS">HR 0.72 <i>p</i>&lt;0.01.</AbstractText></Abstract></MedlineCitation></PubmedArticle><PubmedArticle><MedlineCitation><PMID Version="1">222</PMID></MedlineCitation></PubmedArticle></PubmedArticleSet>';
const a = abstracts(xml);
assert.equal(a['111'], 'BACKGROUND: Why & how. RESULTS: HR 0.72 p<0.01.'); assert.equal(a['222'], '');
assert.match(query(), /"Eur Urol"\[ta\]/); assert.match(query(), /"N Engl J Med"\[ta\]\) AND|"N Engl J Med"\[ta\] OR/);
const news = JSON.parse(fs.readFileSync('frontend/data/news.json', 'utf8'));
assert.ok(Array.isArray(news.items) && news.items.length >= 3 && news.updated);
for (const x of news.items) { assert.ok(x.id && x.title && x.url && /^https:\/\//.test(x.url), 'news item ' + x.id); }
assert.equal(new Set(news.items.map(x => x.id)).size, news.items.length, 'unique ids');
console.log('weekly news: PASS — ranking, filters, abstract parsing and news.json');
