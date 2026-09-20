// Data coverage and generated navigation checks; no network access required.
const fs=require('fs'),path=require('path'),assert=require('assert'),yaml=require('js-yaml');
const load=n=>yaml.load(fs.readFileSync('source/_data/'+n+'.yml','utf8'));
const timeline=load('timeline'),interviews=load('interviews'),archive=load('archive');
const raw=JSON.parse(fs.readFileSync('tools/workbook-extracted.json','utf8'));
const seen=[new Map(),new Map()];
timeline.forEach(r=>r.fields.forEach(f=>seen[0].set(f.cell,f)));
interviews.forEach(r=>r.fields.forEach(f=>seen[1].set(f.cell,f)));
for(let s=0;s<2;s++){
 const skip=s===0?new Set(['A1','A169',...Object.keys(raw.sheets[0].cells).filter(c=>/^[A-Z]+2$/.test(c))]):new Set(Object.keys(raw.sheets[1].cells).filter(c=>Number(c.match(/\d+/)[0])<=4));
 for(const [cell,value] of Object.entries(raw.sheets[s].cells)){
  if(skip.has(cell))continue;
  assert(seen[s].has(cell),'Missing original cell '+s+':'+cell);
  const f=seen[s].get(cell);
  if(value.formula)assert(f.image,'Missing embedded image '+cell);
  else assert.strictEqual(f.text,value.text,'Altered original text '+cell);
  if(value.link)assert.strictEqual(f.url,value.link,'Missing original hyperlink '+cell);
 }
}
assert.strictEqual(archive.reading,raw.sheets[1].cells.B1.text);
assert.strictEqual(archive.interview_preface,raw.sheets[1].cells.A2.text);
assert.strictEqual(archive.timeline_preface,raw.sheets[0].cells.A1.text);
assert.strictEqual(archive.timeline_interlude,raw.sheets[0].cells.A169.text);
const all=[...timeline,...interviews];assert.strictEqual(new Set(all.map(x=>x.id)).size,all.length);
for(const r of all){for(const image of r.images)assert(fs.existsSync('source'+image),'Missing image '+image);for(const s of r.sources)assert(/^https?:\/\//.test(s.url),'Invalid source protocol');}
assert.strictEqual(timeline.find(x=>x.row===4).year,null);
assert.strictEqual(timeline.find(x=>x.row===45).year,2005);
assert.strictEqual(timeline.find(x=>x.row===45).date,'2月8日');
if(fs.existsSync('public/timeline/index.html')){
 const pages=['','timeline/','zhou-tao/','dong-qing/','together/','moments/','interviews/'];
 for(const page of pages){
  const p='public/'+page+'index.html';assert(fs.existsSync(p),'Missing page '+p);
  const html=fs.readFileSync(p,'utf8');assert(html.includes('lang="zh-CN"'));
  assert(!/pixel-title|menu-cursor|Chen Huang|world-layer/.test(html),'Old theme markup '+p);
  for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
   const dest='public'+decodeURI(match[1]);assert(fs.existsSync(dest)||fs.existsSync(path.join(dest,'index.html')),'Broken local path '+match[1]);
  }
 }
 const html=fs.readFileSync('public/timeline/index.html','utf8');for(const r of timeline)assert(html.includes('id="'+r.id+'"'),'Timeline row missing '+r.id);
 const ih=fs.readFileSync('public/interviews/index.html','utf8');for(const r of interviews)assert(ih.includes('id="'+r.id+'"'),'Interview missing '+r.id);
}
console.log('PASS: all original cells, hyperlinks and 123 images accounted for; '+timeline.length+' timeline records; '+interviews.length+' interviews.');
