/* Export aligned static body sections from ImageGen sources. Requires sharp.
 * Set NODE_PATH to your installed sharp package directory when needed.
 * Source geometry is measured on the shared 1254px canvas. No anatomy is repainted.
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'art/player-state/source');
const out = path.join(root, 'img/player-state');
const size = 640, reference = 1254;
const order = ['legR', 'legL', 'armR', 'armL', 'torso', 'head'];
const armR = [[300,263],[499,263],[532,342],[530,400],[510,540],[487,790],[300,790]];
const armL = [[742,263],[960,263],[960,790],[787,790],[765,540],[724,400],[716,342]];
function signedDistance(x,y,poly) {
  let inside=false, distance=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++) {
    const [ax,ay]=poly[j], [bx,by]=poly[i], dx=bx-ax,dy=by-ay;
    if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax) inside=!inside;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    distance=Math.min(distance,Math.hypot(x-ax-t*dx,y-ay-t*dy));
  }
  return inside?distance:-distance;
}
const smooth = (a,b,v) => { const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t); };
function coverage(x,y) {
  const ar=signedDistance(x,y,armR),al=signedDistance(x,y,armL);
  // Lower layers extend under torso; only the overlying torso fades at the join.
  // Hands hang alongside upper thighs: leg sections must not inherit those pixels.
  const legCorridor = y >= 805 || (x >= 490 && x <= 782);
  const legs=smooth(656,664,y)*(legCorridor?1:0);
  const torso=(1-smooth(-10,10,ar))*(1-smooth(-10,10,al))*(1-smooth(676,708,y))*smooth(229,237,y);
  return {legR:legs*(x<635?1:0),legL:legs*(x>=635?1:0),
    armR:smooth(-18,-10,ar),armL:smooth(-18,-10,al),torso,
    head:1-smooth(245,263,y)};
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const variants=fs.readdirSync(source).filter(f=>f.endsWith('.png')).map(f=>f.slice(0,-4)).sort();
  const masks=Object.fromEntries(order.map(s=>[s,Buffer.alloc(size*size)]));
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const c=coverage((x+.5)*reference/size,(y+.5)*reference/size);
    for(const s of order)masks[s][y*size+x]=Math.round(255*c[s]);
  }
  for(const variant of variants){
    const {data,info}=await sharp(path.join(source,variant+'.png')).resize(size,size).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    if(info.channels!==4)throw Error('RGBA required');
    for(const s of order){
      const pixels=Buffer.from(data);
      for(let i=0;i<size*size;i++){
        pixels[i*4+3]=Math.round(pixels[i*4+3]*masks[s][i]/255);
        if(!pixels[i*4+3])pixels.fill(0,i*4,i*4+3);
      }
      await sharp(pixels,{raw:{width:size,height:size,channels:4}}).extract({left:128,top:0,width:384,height:size}).png().toFile(path.join(out,variant+'-'+s+'.png'));
    }
  }
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({width:384,height:size,order,variants,
    leftRight:'Anatomical: armR/legR appear on the left of the portrait.',
    sources:'../../art/player-state/source',overlap:'Opaque underlap; feathered torso and neck.'},null,2)+'\n');
  console.log(`Exported ${variants.length*6} aligned 384 x ${size}px sections.`);
})();
