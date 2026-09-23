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
 era.value=Array.from(era.options).some(o=>o.value===params.get('era'))?params.get('era'):'all';
 search.value=params.get('q')||'';
 const inEra=y=>era.value==='all'||era.value===y||(era.value.includes('-')&&y!=='unknown'&&+y>=+era.value.split('-')[0]&&+y<=+era.value.split('-')[1]);
 function render(){
  const status=$('[data-year-status]',archive);if(status)status.hidden=true;
  const q=search.value.trim().toLocaleLowerCase();
  let count=0;
  records.forEach(r=>{r.hidden=!(inEra(r.dataset.year)&&(kind==='all'||r.dataset.tags.split(' ').includes(kind))&&(r.dataset.search+' '+r.dataset.year+' '+r.textContent).toLocaleLowerCase().includes(q));if(!r.hidden)count++;});
  groups.forEach(g=>{const n=$$('[data-record]',g).filter(r=>!r.hidden).length;g.hidden=!(inEra(g.dataset.yearGroup)&&n>0);$('header>span',g).textContent=n?n+' 条记录':$('[data-record]',g)?'当前筛选暂无匹配记录':'本年暂无收录';});
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===kind)));
  $('[data-result-count]',archive).textContent='显示 '+count+' / '+records.length+' 条记录';
  $('[data-empty]',archive).hidden=count!==0||!!pinnedYear;
  const visibleYears=groups.filter(g=>!g.hidden).map(g=>g.dataset.yearGroup);
  $$('[data-year-jump]',archive).forEach(a=>{a.hidden=false;a.setAttribute('aria-current',String(a.dataset.yearJump===(pinnedYear||visibleYears[0])));});
  const index=$('.year-index>div',archive);if(index){index.scrollLeft=0;index.dispatchEvent(new Event('yearindexchange'));}
 }
 function save(){const u=new URL(location.href);u.searchParams.set('era',era.value);if(kind!=='all')u.searchParams.set('type',kind);else u.searchParams.delete('type');if(search.value.trim())u.searchParams.set('q',search.value.trim());else u.searchParams.delete('q');u.hash='';history.replaceState(null,'',u);}
 filters.forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.filter;pinnedYear=null;render();save();}));
 search.addEventListener('input',()=>{pinnedYear=null;if(search.value.trim())era.value='all';render();save();});
 era.addEventListener('change',()=>{pinnedYear=null;render();save();});
 $('[data-reset]',archive).addEventListener('click',()=>{kind='all';search.value='';era.value='all';pinnedYear=null;render();save();});
 function revealHash(scroll=true){
  const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);
  const status=$('[data-year-status]',archive);if(status)status.hidden=true;
  if(!target&&/^year-(?:[0-9]{4}|unknown)$/.test(id)){const year=id.slice(5);if(status){status.textContent=(year==='unknown'?'年份未详':year+'年')+'暂无收录，可选择深色年份。';status.hidden=false;}return false;}
  if(!target||!archive.contains(target))return false;
  const y=target.dataset.year||target.dataset.yearGroup;
  if(!y)return false;
  pinnedYear=y;era.value=eraFor(y);kind='all';search.value='';render();
  if(target.matches('[data-record]')){const details=$('.record-details',target);if(details)details.open=true;}
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

/* 背景音乐暂时停用，取得授权音乐后恢复。
// Persist explicit listening preference across full page navigation.
const musicPlayer=$('[data-music-player]'),music=musicPlayer?.querySelector('audio'),musicButton=musicPlayer?.querySelector('button');
if(music&&musicButton){
 const key='kapok-music-preference';
 const read=()=>{try{return localStorage.getItem(key);}catch{return null;}};
 const remember=value=>{try{localStorage.setItem(key,value);}catch{}};
 let wanted=read()==='playing';
 music.volume=.22;
 const update=()=>{const playing=!music.paused;musicPlayer.classList.toggle('is-playing',playing);musicButton.setAttribute('aria-pressed',String(playing));musicButton.setAttribute('aria-label',playing?'暂停背景音乐':'播放背景音乐');};
 const resume=()=>{if(wanted)music.play().catch(update);};
 musicButton.addEventListener('click',()=>{
  wanted=!wanted;remember(wanted?'playing':'paused');
  if(wanted)resume();else music.pause();update();
 });
 music.addEventListener('play',()=>{if(!wanted)music.pause();update();});
 music.addEventListener('pause',update);
 music.addEventListener('error',()=>{wanted=false;update();musicButton.setAttribute('aria-label','音频暂不可用，点击重试');});
 document.addEventListener('click',e=>{if(!e.target.closest('[data-music-player]')&&music.paused)resume();});
 window.addEventListener('pageshow',()=>{wanted=read()==='playing';if(!wanted)music.pause();update();});
 window.addEventListener('storage',e=>{if(e.key===key){wanted=e.newValue==='playing';if(!wanted)music.pause();update();}});
 update();resume();
}
*/
// Keep the same era picker on touch devices and desktop, with a native no-JS fallback.
$$('[data-era]').forEach(select=>{
 const wrapper=document.createElement('div');wrapper.className='era-picker';
 select.parentElement.after(wrapper);
 const label=select.parentElement;label.firstChild.textContent='年代 ';wrapper.append(label);
 const trigger=document.createElement('button');trigger.type='button';trigger.className='era-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','选择年代');
 const list=document.createElement('div');list.className='era-options';list.id='era-options';list.setAttribute('role','listbox');list.setAttribute('aria-label','选择年代');list.hidden=true;trigger.setAttribute('aria-controls',list.id);
 wrapper.append(trigger,list);select.hidden=true;
 const buttons=Array.from(select.options).map(option=>{const b=document.createElement('button');b.type='button';b.textContent=option.textContent;b.dataset.value=option.value;b.setAttribute('role','option');b.tabIndex=-1;list.append(b);b.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));close();trigger.focus();});return b;});
 function sync(){trigger.textContent=select.selectedOptions[0].textContent;buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.value===select.value)));}
 function close(){list.hidden=true;trigger.setAttribute('aria-expanded','false');}
 function open(){sync();list.hidden=false;trigger.setAttribute('aria-expanded','true');buttons.find(b=>b.dataset.value===select.value)?.focus();}
 trigger.addEventListener('click',()=>list.hidden?open():close());
 trigger.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();open();}});
 wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'){close();trigger.focus();}if(!list.hidden&&['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();let i=buttons.indexOf(document.activeElement);i=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[i].focus();}});
 // Safari may emit focusout with a null relatedTarget before the trigger's click.
 wrapper.addEventListener('pointerdown',e=>{if(e.target.closest('.era-trigger'))e.preventDefault();});
 wrapper.addEventListener('focusout',e=>{if(e.relatedTarget&&!wrapper.contains(e.relatedTarget))close();});
 wrapper.addEventListener('keydown',e=>{if(e.key==='Tab')setTimeout(()=>{if(!wrapper.contains(document.activeElement))close();},0);});
 document.addEventListener('click',e=>{if(!wrapper.contains(e.target))close();});
 select.addEventListener('change',sync);$('[data-reset]')?.addEventListener('click',sync);$('[data-search-input]')?.addEventListener('input',sync);window.addEventListener('hashchange',sync);$$('[data-year-jump]').forEach(a=>a.addEventListener('click',sync));sync();
});
function scatterConfetti(link){
 if(!link)return;
 link.classList.remove('nav-bloom');
 $$('.nav-petals i',link).forEach(p=>{
  p.style.setProperty('--x',((Math.random()-.5)*78).toFixed(1)+'px');
  p.style.setProperty('--y',(-12-Math.random()*24).toFixed(1)+'px');
  p.style.setProperty('--fall',(8+Math.random()*22).toFixed(1)+'px');
  p.style.setProperty('--r',((Math.random()-.5)*560).toFixed(0)+'deg');
  p.style.setProperty('--delay',Math.round(Math.random()*110)+'ms');
  p.style.setProperty('--duration',Math.round(850+Math.random()*250)+'ms');
 });
 requestAnimationFrame(()=>requestAnimationFrame(()=>link.classList.add('nav-bloom')));
}
$$('#navigation a').forEach(link=>{
 const bloom=()=>{scatterConfetti(link);try{sessionStorage.setItem('kapok-nav-arrival',new URL(link.href).pathname);}catch{}};
 link.addEventListener('pointerdown',bloom);link.addEventListener('keydown',e=>{if(e.key==='Enter')bloom();});
});
try{if(sessionStorage.getItem('kapok-nav-arrival')===location.pathname){sessionStorage.removeItem('kapok-nav-arrival');scatterConfetti($('#navigation a[aria-current]'));}}catch{}

// Use the existing illustrated covers for both absent and failed interview images.
$$('.interview-cover[data-cover-variant]').forEach(cover=>{
 const img=$('img',cover);if(!img)return;
 const fallback=()=>{if(!img.isConnected)return;const art=document.createElement('span');art.className='book-cover-sprite book-variant-'+cover.dataset.coverVariant;art.setAttribute('role','img');art.setAttribute('aria-label','书籍与木棉花 AI 插画封面');img.replaceWith(art);cover.classList.add('is-book-cover');};
 img.addEventListener('error',fallback,{once:true});if(img.complete&&img.naturalWidth===0)fallback();
});
// A persistent, narrow scrubber makes the horizontal year index discoverable on iOS too.
$$('.year-index').forEach(index=>{
 const years=$('div',index);if(!years)return;
 const control=document.createElement('input');control.type='range';control.className='year-scroll-control';control.min='0';control.max='100';control.step='.1';control.value='0';control.setAttribute('aria-label','左右滑动年份索引');years.after(control);
 const update=()=>{const max=years.scrollWidth-years.clientWidth;control.hidden=max<=1;control.value=max>0?String(years.scrollLeft/max*100):'0';control.setAttribute('aria-valuetext','年份索引滚动位置 '+Math.round(+control.value)+'%');};
 control.addEventListener('input',()=>{years.scrollLeft=(years.scrollWidth-years.clientWidth)*(+control.value/100);});
 years.addEventListener('scroll',update,{passive:true});years.addEventListener('yearindexchange',()=>requestAnimationFrame(update));
 new ResizeObserver(update).observe(years);document.fonts.ready.then(update);update();
});
