'use strict';
hexo.extend.helper.register('safe_url', s => /^https?:\/\//i.test(s || '') ? s : '#');
hexo.extend.helper.register('tag_label',s=>({zhou:'🍑 周涛',dong:'🍉 董卿',together:'🌺 共同',moments:'✨ 名场面'}[s]||s));

// Presentation-only consolidation, checked against the workbook's merged cells.
// Raw timeline data and its source provenance remain intact.
hexo.extend.helper.register('archive_records', (rows, section) => {
 const column={moments:'C',together:'D',zhou:'E',dong:'F'}[section];
 const notes=new Set(rows.filter(r=>[3,6].includes(r.row)).map(r=>r.observation));
 const groups=new Map();
 for(const raw of rows){
  const row={...raw,observation:notes.has(raw.observation)?'':raw.observation,tags:raw.tags.filter(t=>t!=='moments'||!notes.has(raw.observation))};
  if(!column){groups.set(row.id,row);continue;}
  let owner=(row.inherited_fields||[]).find(f=>new RegExp('^'+column+'[0-9]+$').test(f.cell))?.cell||column+row.row;
  // Same 2010 press conference: one row has the month, the other the exact day.
  if(section==='dong'&&row.row===98&&rows.find(r=>r.row===97)?.summaries.some(a=>row.summaries.some(b=>a.label===b.label&&a.text===b.text)))owner='F97';
  // A second merged note repeats the closing sentence of the same programme note.
  if(section==='moments'&&owner==='C195')owner='C191';
  const key=row.year+'|'+owner;
  if(!groups.has(key)){groups.set(key,{...row,archiveDates:[row.date],archiveRows:[row]});continue;}
  const item=groups.get(key);item.archiveGrouped=true;item.archiveRows.push(row);
  if(!item.archiveDates.includes(row.date))item.archiveDates.push(row.date);
  item.date=item.archiveDates.join('、');
  if(section==='dong'&&owner==='F97')item.date='9月6日';
  item.images=[...new Set([...item.images,...row.images])];
  item.sources=[...new Map([...item.sources,...row.sources].map(source=>[source.url,source])).values()];
  item.summaries=[...new Map([...item.summaries,...row.summaries].map(summary=>[summary.label+'|'+summary.text,summary])).values()];
  item.tags=[...new Set([...item.tags,...row.tags])];
 }
 return [...groups.values()];
});
