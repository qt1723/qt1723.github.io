'use strict';
document.documentElement.classList.add('js');
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const menu=$('.menu-toggle'), nav=$('#navigation');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
const archive=$('[data-archive]');
if(archive){
 const records=$$('[data-record]',archive),groups=$$('[data-year-group]',archive),filters=$$('[data-filter]',archive);
 const search=$('[data-search-input]',archive),era=$('[data-era]',archive),params=new URLSearchParams(location.search);
 let kind=['all','zhou','dong','together','moments'].includes(params.get('type'))?params.get('type'):'all';
 let pinnedYear=null;
 const eraFor=y=>y==='unknown'?'unknown':+y<1990?'1968-1989':+y<2000?'1990-1999':+y<2010?'2000-2009':+y<2020?'2010-2019':'2020-2025';
 era.value=Array.from(era.options).some(o=>o.value===params.get('era'))?params.get('era'):(archive.dataset.section==='moments'?'2010-2019':'2000-2009');
 search.value=params.get('q')||'';
 const inEra=y=>era.value==='all'||era.value===y||(era.value.includes('-')&&y!=='unknown'&&+y>=+era.value.split('-')[0]&&+y<=+era.value.split('-')[1]);
 function render(){
  const q=search.value.trim().toLocaleLowerCase();
  let count=0;
  records.forEach(r=>{r.hidden=!(inEra(r.dataset.year)&&(kind==='all'||r.dataset.tags.split(' ').includes(kind))&&(r.dataset.search+' '+r.dataset.year+' '+r.textContent).toLocaleLowerCase().includes(q));if(!r.hidden)count++;});
  groups.forEach(g=>{const n=$$('[data-record]',g).filter(r=>!r.hidden).length;g.hidden=!(inEra(g.dataset.yearGroup)&&(n>0||(!q&&kind==='all')||pinnedYear===g.dataset.yearGroup));$('header>span',g).textContent=n?n+' 条记录':$('[data-record]',g)?'当前筛选暂无匹配记录':'本年暂无收录';});
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===kind)));
  $('[data-result-count]',archive).textContent='显示 '+count+' / '+records.length+' 条记录';
  $('[data-empty]',archive).hidden=count!==0||!!pinnedYear;
  const visibleYears=groups.filter(g=>!g.hidden).map(g=>g.dataset.yearGroup);
  $$('[data-year-jump]',archive).forEach(a=>{a.hidden=!visibleYears.includes(a.dataset.yearJump);a.setAttribute('aria-current',String(a.dataset.yearJump===(pinnedYear||visibleYears[0])));});
  const index=$('.year-index>div',archive);if(index)index.scrollLeft=0;
 }
 function save(){const u=new URL(location.href);u.searchParams.set('era',era.value);if(kind!=='all')u.searchParams.set('type',kind);else u.searchParams.delete('type');if(search.value.trim())u.searchParams.set('q',search.value.trim());else u.searchParams.delete('q');u.hash='';history.replaceState(null,'',u);}
 filters.forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.filter;pinnedYear=null;render();save();}));
 search.addEventListener('input',()=>{pinnedYear=null;if(search.value.trim())era.value='all';render();save();});
 era.addEventListener('change',()=>{pinnedYear=null;render();save();});
 $('[data-reset]',archive).addEventListener('click',()=>{kind='all';search.value='';era.value='all';pinnedYear=null;render();save();});
 function revealHash(scroll=true){
  const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);
  if(!target||!archive.contains(target))return false;
  const y=target.dataset.year||target.dataset.yearGroup;
  if(!y)return false;
  pinnedYear=y;era.value=eraFor(y);kind='all';search.value='';render();
  if(target.matches('[data-record]')){$('.record-details',target).open=true;}
  if(scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  return true;
 }
 $$('[data-year-jump]',archive).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState(null,'',a.hash);revealHash();}));
 window.addEventListener('hashchange',()=>revealHash());
 if(!revealHash())render();
}
const interviews=$('[data-interviews]');
if(interviews){
 const tabs=$$('[data-tab]',interviews),panels=$$('[data-panel]',interviews),search=$('[data-interview-search]',interviews),params=new URLSearchParams(location.search);
 let person=['zhou','dong','together'].includes(params.get('person'))?params.get('person'):'zhou', page=1;
 const size=9;
 search.value=params.get('q')||'';
 function render(){
  tabs.forEach(b=>{const active=b.dataset.tab===person;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  panels.forEach(p=>p.hidden=p.dataset.panel!==person);
  const panel=panels.find(p=>p.dataset.panel===person),all=$$('[data-interview-item]',panel),q=search.value.trim().toLocaleLowerCase();
  const matched=all.filter(a=>a.dataset.search.toLocaleLowerCase().includes(q));const pages=Math.max(1,Math.ceil(matched.length/size));page=Math.min(page,pages);
  all.forEach(a=>a.hidden=true);matched.slice((page-1)*size,page*size).forEach(a=>a.hidden=false);
  $('[data-interview-count]',interviews).textContent='当前栏目 '+matched.length+' 份资料';
  $('[data-interview-empty]',interviews).hidden=matched.length>0;
  $('[data-pagination]',interviews).hidden=pages<2;
  $('[data-page-label]',interviews).textContent=page+' / '+pages;
  $('[data-prev]',interviews).disabled=page===1;$('[data-next]',interviews).disabled=page===pages;
 }
 function save(){const u=new URL(location.href);u.searchParams.set('person',person);if(search.value)u.searchParams.set('q',search.value);else u.searchParams.delete('q');history.replaceState(null,'',u);}
 tabs.forEach((b,i)=>{
  b.addEventListener('click',()=>{person=b.dataset.tab;page=1;render();save();});
  b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].click();tabs[next].focus();}});
 });
 search.addEventListener('input',()=>{page=1;render();save();});
 $('[data-prev]',interviews).addEventListener('click',()=>{page--;render();interviews.scrollIntoView({block:'start'});});
 $('[data-next]',interviews).addEventListener('click',()=>{page++;render();interviews.scrollIntoView({block:'start'});});
 render();
}
const dialog=$('.image-dialog');let trigger,lightboxItems=[],lightboxIndex=0;
function showLightbox(index){
 lightboxIndex=(index+lightboxItems.length)%lightboxItems.length;
 const link=lightboxItems[lightboxIndex],img=$('img',dialog),caption=$('[data-lightbox-caption]',dialog);
 img.src=link.href;img.alt=link.querySelector('img')?.alt||'资料图片';caption.textContent=link.dataset.caption||'';
 $('[data-lightbox-count]',dialog).textContent=(lightboxIndex+1)+' / '+lightboxItems.length;
 $$('[data-lightbox-prev],[data-lightbox-next]',dialog).forEach(button=>button.hidden=lightboxItems.length<2);
}
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-lightbox]');
 if(!a||!dialog?.showModal)return;
 e.preventDefault();trigger=a;lightboxItems=$$('[data-lightbox]').filter(link=>!link.closest('[hidden]'));lightboxIndex=lightboxItems.indexOf(a);showLightbox(lightboxIndex);dialog.showModal();
});
$('[data-lightbox-close]')?.addEventListener('click',()=>dialog.close());
$('[data-lightbox-prev]')?.addEventListener('click',()=>showLightbox(lightboxIndex-1));
$('[data-lightbox-next]')?.addEventListener('click',()=>showLightbox(lightboxIndex+1));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showLightbox(lightboxIndex-1);if(e.key==='ArrowRight')showLightbox(lightboxIndex+1);});
dialog?.addEventListener('close',()=>{const img=$('img',dialog);img.removeAttribute('src');trigger?.focus();});

const credits=$('.credits-dialog'),openCredits=$('[data-open-credits]');
openCredits?.addEventListener('click',()=>credits?.showModal());
$('[data-close-credits]')?.addEventListener('click',()=>credits?.close());
credits?.addEventListener('click',e=>{if(e.target===credits)credits.close();});
credits?.addEventListener('close',()=>openCredits?.focus());

const musicPlayer=$('[data-music-player]'),music=musicPlayer?.querySelector('audio'),musicButton=musicPlayer?.querySelector('button'),musicStatus=musicPlayer?.querySelector('[data-music-status]');
if(music&&musicButton){
 music.volume=.22;
 let autoPending=true;
 const setMusicState=playing=>{musicPlayer.classList.toggle('is-playing',playing);musicButton.setAttribute('aria-pressed',String(playing));musicButton.setAttribute('aria-label',playing?'暂停背景音乐':'播放背景音乐');musicStatus.textContent=playing?'正在播放 · 点击暂停':'轻触播放';};
 const stopAuto=()=>{autoPending=false;document.removeEventListener('click',firstInteraction);document.removeEventListener('keydown',firstInteraction);};
 const firstInteraction=e=>{if(!autoPending||e.target.closest('[data-music-player]')||(e.type==='keydown'&&!['Enter',' '].includes(e.key)))return;stopAuto();music.play().catch(()=>setMusicState(false));};
 musicButton.addEventListener('click',async()=>{
  stopAuto();
  if(!music.paused){music.pause();return;}
  musicButton.disabled=true;
  try{await music.play();}catch{setMusicState(false);musicStatus.textContent='音频暂不可用';}
  finally{musicButton.disabled=false;}
 });
 music.addEventListener('pause',()=>setMusicState(false));
 music.addEventListener('play',()=>{stopAuto();setMusicState(true);});
 music.addEventListener('error',()=>{stopAuto();setMusicState(false);musicStatus.textContent='音频暂不可用';});
 document.addEventListener('click',firstInteraction);
 document.addEventListener('keydown',firstInteraction);
 music.play().catch(()=>{if(autoPending){setMusicState(false);musicStatus.textContent='轻触播放';}});
}
