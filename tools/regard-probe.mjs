#!/usr/bin/env node
/* =====================================================================
   regard-probe.mjs — inspect & verify the SYSTEMIC REGARD prose matrix.
   Run: node tools/regard-probe.mjs            (coverage + the full grid; exit 1 on a gap)
        node tools/regard-probe.mjs --bands     (also print the depth→class band map)

   Like feed-inspect.mjs, this READS setup.REGARD / setup.CLASSES straight from
   src/sewer-demons.twee (no hand-copy to drift) and prints the world's verdict for
   every (body class × floor class × strength tier) — the matched/mismatched lines the
   player would actually see — so the whole matrix is reviewable without driving the game.
   It mirrors setup.regardOf's relation logic (bodyClass===floorClass ? matched : mismatched).

   See docs/TRANSFORMATION.md → "Systemic regard", and the feed's sibling tool.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'src', 'sewer-demons.twee');
const src = readFileSync(SRC, 'utf8');
const args = new Set(process.argv.slice(2));

/* ---- pull a `setup.<name> = {…}/[…]/N` literal out of the source (string-aware) ---- */
function grab(name) {
  const re = new RegExp('setup\\.' + name + '\\s*=\\s*', 'g');
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    const open = src[i];
    if (open === '{' || open === '[') return eval('(' + matchBracket(i) + ')');   // eslint-disable-line no-eval
    if (open >= '0' && open <= '9') return Number(src.slice(i, src.indexOf(';', i)).trim());
  }
  throw new Error('not found: setup.' + name);
}
function matchBracket(start) {
  let depth = 0, inStr = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced literal at ' + start);
}

const REGARD = grab('REGARD');
const CLASSES = grab('CLASSES');
const MIN = grab('REGARD_MIN_LOAD');
const COOLDOWN = grab('REGARD_COOLDOWN');
const TIERS = [1, 2, 3];
const TIER_NAME = { 1: 'tingeing', 2: 'mostly', 3: 'wholly' };

/* the depth→class band map, mirrored from setup.classOnFloor (verify against the engine) */
const BANDS = [
  { floor: 'rat', where: 'L1–3 storm drains / trunk mains / old drains (vermin)' },
  { floor: 'filth', where: 'L4 drowned galleries & L8 rendering works (the drowned / aggregate / renderers)' },
  { floor: 'pig', where: 'L5 mouth · L6 carnival · L7 belly · L9 castle (pig-ruled)' },
];

/* ---- coverage ---- */
const gaps = [];
for (const rel of ['matched', 'mismatched']) {
  for (const fc of CLASSES) {
    for (const t of TIERS) {
      const cell = ((REGARD[rel] || {})[fc] || {})[t];
      if (!cell || !String(cell).trim()) gaps.push(`${rel}/${fc}/${t}`);
    }
  }
}

/* ---- report ---- */
console.log('SYSTEMIC REGARD — prose matrix');
console.log(`  source : ${SRC}`);
console.log(`  shape  : 2 relations × ${CLASSES.length} floor-classes × ${TIERS.length} tiers = ${2 * CLASSES.length * TIERS.length} cells`);
console.log(`  calib  : REGARD_MIN_LOAD = ${MIN} (a class's avg body-load must reach this to be read at all) · REGARD_COOLDOWN = ${COOLDOWN} eligible moves`);
console.log(`  tiers  : ${TIERS.map((t) => t + '=' + TIER_NAME[t]).join('  ')}`);
console.log('');

if (gaps.length) { console.log(`HARD FAULTS — missing cells (${gaps.length}):`); gaps.forEach((g) => console.log('  ✗ ' + g)); console.log(''); }
else console.log('✓ coverage clean — every relation × floor-class × tier present\n');

if (args.has('--bands')) {
  console.log('BANDS (depth → resident class, mirror of setup.classOnFloor):');
  BANDS.forEach((b) => console.log(`  ${b.floor.padEnd(6)} ${b.where}`));
  console.log('');
}

/* the grid: for each floor, what a body of each class reads as, at each tier */
for (const band of BANDS) {
  console.log(`══ on a ${band.floor.toUpperCase()} floor (${band.where}) ══`);
  for (const body of CLASSES) {
    const rel = body === band.floor ? 'matched' : 'mismatched';
    console.log(`  body=${body}  → ${rel.toUpperCase()}${rel === 'matched' ? ' (claimed)' : ' (marked wrong)'}`);
    for (const t of TIERS) {
      const line = ((REGARD[rel] || {})[band.floor] || {})[t] || '(MISSING)';
      console.log(`      [${TIER_NAME[t]}] ${line}`);
    }
  }
  console.log('');
}

console.log(gaps.length ? `RESULT: ${gaps.length} missing cell(s) — fix before shipping.` : 'RESULT: clean.');
process.exit(gaps.length ? 1 : 0);
