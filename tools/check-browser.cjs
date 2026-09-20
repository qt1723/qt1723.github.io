const { chromium }=require('C:/Users/23118/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert');const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync('tools/previews',{recursive:true});
 for(const route of ['/','/timeline/','/zhou-tao/','/dong-qing/','/together/','/moments/','/interviews/']){
  await page.goto('http://localhost:4000'+route,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').count(),1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desktop overflow '+route);
  if(route==='/'||route==='/timeline/'||route==='/interviews/')await page.screenshot({path:'tools/previews/desktop-'+(route==='/'?'home':route.split('/')[1])+'.png',fullPage:route==='/'});
 }
 await page.goto('http://localhost:4000/timeline/');
 await page.locator('[data-filter="zhou"]').click();assert(await page.locator('[data-record]:visible').count()>0);
 assert(await page.locator('[data-record]:visible').evaluateAll(rs=>rs.every(r=>r.dataset.tags.split(' ').includes('zhou'))));
 await page.locator('[data-search-input]').fill('不存在的内容abcd');assert(await page.locator('[data-empty]').isVisible());
 await page.locator('[data-reset]').click();assert.equal(await page.locator('[data-record]:visible').count(),234);
 await page.locator('[data-year-jump="1969"]').click();assert(await page.locator('#year-1969').isVisible());
 await page.goto('http://localhost:4000/timeline/#t150');assert(await page.locator('#t150 .record-details').getAttribute('open')!==null);
 const media=page.locator('#t150 .video-card').first();assert(await media.isVisible());assert((await media.getAttribute('href')).startsWith('http'));
 await page.locator('#t150 [data-lightbox]').first().click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!await page.locator('dialog').isVisible());
 await page.goto('http://localhost:4000/interviews/?person=dong');assert.equal(await page.locator('#tab-dong').getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('[data-interview-item]:visible').count(),9);
 await page.locator('[data-next]').click();assert.equal(await page.locator('[data-page-label]').innerText(),'2 / 5');
 await page.locator('#tab-together').click();assert.equal(await page.locator('[data-interview-item]:visible').count(),4);
 await page.locator('#tab-zhou').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#tab-dong').getAttribute('aria-selected'),'true');
 await page.locator('[data-interview-search]').fill('zzzznotfound');assert(await page.locator('[data-interview-empty]').isVisible());
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/timeline/','/zhou-tao/','/dong-qing/','/together/','/moments/','/interviews/']){
  await page.goto('http://localhost:4000'+route,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow '+route);
  await page.locator('.menu-toggle').click();assert(await page.locator('#navigation').isVisible());await page.locator('.menu-toggle').click();
  if(route==='/'||route==='/timeline/'||route==='/interviews/')await page.screenshot({path:'tools/previews/mobile-'+(route==='/'?'home':route.split('/')[1])+'.png',fullPage:route==='/'});
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: seven desktop/mobile pages; navigation, filters, search, year links, media cards, image dialog, interview tabs and pagination.');
})().catch(e=>{console.error(e);process.exit(1)});
