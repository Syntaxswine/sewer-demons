/* Run after build.ps1. Requires playwright and sharp (NODE_PATH is supported).
 * Browser checks exercise the real compiled SugarCube model, not a duplicate.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const sharp = require('sharp');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const assets = path.join(root, 'img/player-state');
const manifest = JSON.parse(fs.readFileSync(path.join(assets, 'manifest.json')));

(async () => {
  assert.equal(manifest.variants.length, 10);
  for (const variant of manifest.variants) for (const seg of manifest.order) {
    const file = path.join(assets, `${variant}-${seg}.png`);
    const {data,info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(info.width, 384); assert.equal(info.height, 640);
    let visible = 0, transparent = 0;
    for (let i=3;i<data.length;i+=4) { if(data[i])visible++;else transparent++; }
    assert(visible > 100 && transparent > data.length/8, `${variant}/${seg}: empty or opaque backdrop`);
    if(seg.startsWith('leg')) {
      for(let y=0;y<410;y++)for(let x=0;x<384;x++){
        const sx=(x+128+.5)*1254/640;
        if(sx<490||sx>782)assert.equal(data[(y*384+x)*4+3],0,`${variant}/${seg}: stray hand pixels`);
      }
    }
  }
  // Every species/stage connected to a human neighbour must cover the internal joins.
  const joinPoints=[[630,249],[510,317],[748,325],[562,692],[705,692]];
  for(const variant of manifest.variants)for(const seg of manifest.order){
    const {data}=await sharp({create:{width:384,height:640,channels:4,background:'#00000000'}})
      .composite(manifest.order.map(s=>({input:path.join(assets,`${s===seg?variant:'human'}-${s}.png`)})))
      .raw().toBuffer({resolveWithObject:true});
    for(const [sx,sy]of joinPoints){const x=Math.floor(sx*640/1254)-128,y=Math.floor(sy*640/1254);
      assert(data[(y*384+x)*4+3]>=240,`${variant}/${seg}: transparent internal join at ${sx},${sy}`);}
  }
  console.log('PASS: 60 RGBA assets, no hand leakage into legs, 300 opaque mixed-body join probes');

  const server=http.createServer((req,res)=>{
    const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html';
    const file=path.resolve(dist,relative);
    if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',file.endsWith('.png')?'image/png':file.endsWith('.json')?'application/json':'text/html; charset=utf-8');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:process.env.PLAYER_BROWSER||'msedge'}:{})});
    const page=await browser.newPage({viewport:{width:1320,height:1040}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.url().endsWith('.png')&&r.status()!==200)errors.push(`${r.status()} ${r.url()}`)});
    await page.goto(base);await page.waitForSelector('.player-body-stack img');
    const checks=await page.evaluate(()=>{
      const {setup,State}=SugarCube,V=State.variables;
      let checked=0;
      const ok=(v,message)=>{if(!v)throw Error(message);checked++};
      const reset=()=>{V.body=setup.freshBody();V.form=setup.freshForm();setup.recomputeBody()};
      const read=seg=>setup.playerBodyVariant(seg);
      for(const cls of setup.CLASSES)for(const seg of setup.SEGMENTS)for(const n of [0,29,30,49,50,74,75,99,100]){
        reset();if(n)setup.corrupt(seg,cls,n);
        const stage=n===100?'turned':n>=75?'turning':n>=50?'tainted':null;
        ok(read(seg)===(stage?`${cls}-${stage}`:'human'),`${seg}/${cls}/${n}`);
        ok(setup.SEGMENTS.filter(s=>s!==seg).every(s=>read(s)==='human'),'independent limbs');
      }
      reset();setup.corrupt('head','rat',35);setup.corrupt('head','pig',25);
      ok(read('head')==='rat-tainted','mixed exposure uses total and dominant bucket');
      setup.corrupt('head','pig',15);ok(read('head')==='pig-turning','dominance changes before lock');
      reset();setup.corrupt('armL','rat',75);setup.soothe(30);
      ok(read('armL')==='human','washing below 50 restores human artwork');
      reset();setup.corrupt('armL','rat',100);setup.soothe(100);
      ok(read('armL')==='rat-turned','washing preserves locked form');
      setup.corrupt('armL','pig',20);ok(read('armL')==='rat-turned','overflow cannot change locked limb');
      reset();setup.corrupt('head','rat',100);setup.corrupt('torso','pig',75);
      setup.corrupt('armR','filth',100);setup.corrupt('armL','rat',50);setup.corrupt('legL','pig',100);
      ok(document.querySelectorAll('.player-body-stack img').length===6,'six static layers');
      return checked;
    });
    await page.waitForFunction(()=>document.querySelector('[data-body-seg="armR"]').dataset.bodyVariant==='filth-turned');
    const rendered=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.player-body-stack img')].map(i=>[i.dataset.bodySeg,i.dataset.bodyVariant])));
    assert.deepEqual(rendered,{head:'rat-turned',torso:'pig-turning',armR:'filth-turned',armL:'rat-tainted',legL:'pig-turned',legR:'human'},'inline changes refresh sidebar without navigation or manual UI update');
    assert((await page.locator('.player-body-portrait').getAttribute('aria-label')).includes('Right arm: filth, turned'));
    await page.waitForFunction(()=>[...document.querySelectorAll('.player-body-stack img')].every(i=>i.complete&&i.naturalWidth===384));
    assert.equal(await page.locator('.error').count(),0,'SugarCube errors');
    await page.locator('.bodymap').screenshot({path:path.join(dist,'player-sidebar-mixed.png')});
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>SugarCube.UIBar.unstow());
    assert(await page.locator('.player-body-stack').evaluate(el=>el.getBoundingClientRect().width<=document.documentElement.clientWidth));
    await page.screenshot({path:path.join(dist,'player-mobile.png')});
    await page.setViewportSize({width:1320,height:1040});
    await page.goto(base+'/img/player-state/index.html');
    await page.waitForFunction(()=>document.images.length===66&&[...document.images].every(i=>i.complete&&i.naturalWidth===384));
    await page.locator('#mixed').click();await page.locator('#background').click();
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth===384));
    await page.locator('.workspace').screenshot({path:path.join(dist,'player-mixed-review.png')});
    await page.locator('.examples').screenshot({path:path.join(dist,'player-stages-review.png')});
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${checks} real-engine assertions; inline refresh; all gallery assets; mobile layout; no browser or SugarCube errors`);
  } finally {
    if(browser)await browser.close();await new Promise(r=>server.close(r));
  }
})().catch(e=>{console.error(e);process.exitCode=1});
