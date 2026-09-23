#!/usr/bin/env node
/* =====================================================================
   scent-probe.mjs — inspect & verify the ROOM-SCENT prose matrix + rollout.
   Run: node tools/scent-probe.mjs            (coverage + the kind×tier grid; exit 1 on a gap)
        node tools/scent-probe.mjs --rooms     (also list every room's resolved scent-kind)
        node tools/scent-probe.mjs --ladder     (also print the tier ladder + affinity math)

   The THIRD olfactory system (with REGARD / NOSE_BLIND): your reaction to the WORLD's
   stink, eroding as you corrupt — revulsion (SILENT — the room's own prose owns it) →
   `accept` (~75) → `relish` (~90). Each kind carries a `class` for the species-affinity
   bonus (a turned limb of the matching class makes you comfortable with that smell sooner).

   Like feed-inspect.mjs / regard-probe.mjs, this READS setup.ROOM_SCENT / SCENT_BAND /
   SCENT_OVERRIDE / setup.depthOf straight from src/sewer-demons.twee (no hand-copy to drift),
   mirrors setup.scentOf's resolution (override first, else band default), and verifies the
   whole matrix + rollout without driving the game.

   See docs/TRANSFORMATION.md → "Room-scent", and the two sibling tools.
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
    const i = m.index + m[0].length;
    const open = src[i];
    if (open === '{' || open === '[') return eval('(' + matchBracket(i) + ')');   // eslint-disable-line no-eval
    if (open >= '0' && open <= '9') return Number(src.slice(i, src.indexOf(';', i)).trim());
  }
  throw new Error('not found: setup.' + name);
}
function matchBracket(start) {
  /* comment-aware: skip // line and /* block *​/ comments so an apostrophe or brace inside
     a comment (e.g. "the room's layer") can't unbalance the string/brace tracking. */
  let depth = 0, inStr = null, esc = false, inLine = false, inBlock = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (inLine) { if (c === '\n') inLine = false; continue; }
    if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (c === '/' && n === '/') { inLine = true; i++; continue; }
    if (c === '/' && n === '*') { inBlock = true; i++; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced literal at ' + start);
}

const ROOM_SCENT = grab('ROOM_SCENT');
const BAND = grab('SCENT_BAND');
const OVERRIDE = grab('SCENT_OVERRIDE');
const RECOIL = grab('SCENT_RECOIL_AT');
const EASE = grab('SCENT_EASE_AT');
const RELISH = grab('SCENT_RELISH_AT');
const AFF = grab('SCENT_AFFINITY_PER_LIMB');
const CLASSES = grab('CLASSES');
const DEPTH = grab('depthOf');

const KINDS = Object.keys(ROOM_SCENT);
const TIERS = ['recoil', 'accept', 'relish'];

/* ---- mirror of setup.scentOf (override first — even an explicit null opt-out — else band default) ---- */
function scentOf(passage) {
  if (Object.prototype.hasOwnProperty.call(OVERRIDE, passage)) return OVERRIDE[passage];
  return BAND[DEPTH[passage] || 0] || null;
}

/* ---- coverage / integrity faults (exit 1) ---- */
const faults = [];
for (const k of KINDS) {
  const cell = ROOM_SCENT[k];
  if (!cell.class) faults.push(`kind "${k}" has no class`);
  else if (!CLASSES.includes(cell.class)) faults.push(`kind "${k}" class "${cell.class}" is not in setup.CLASSES`);
  for (const t of TIERS) {
    if (!cell[t] || !String(cell[t]).trim()) faults.push(`kind "${k}" missing/empty ${t}`);
  }
}
/* every kind a BAND or OVERRIDE points at must exist in ROOM_SCENT (null = opt-out, ok) */
for (const [d, k] of Object.entries(BAND)) {
  if (k && !ROOM_SCENT[k]) faults.push(`SCENT_BAND[${d}] → "${k}" has no ROOM_SCENT entry`);
}
for (const [p, k] of Object.entries(OVERRIDE)) {
  if (k !== null && !ROOM_SCENT[k]) faults.push(`SCENT_OVERRIDE[${p}] → "${k}" has no ROOM_SCENT entry`);
}

/* ---- report ---- */
console.log('ROOM-SCENT — prose matrix + rollout');
console.log(`  source : ${SRC}`);
console.log(`  shape  : ${KINDS.length} kinds × ${TIERS.length} spoken tiers = ${KINDS.length * TIERS.length} cells (the habituated middle is SILENT — the room prose owns it)`);
console.log(`  calib  : recoil ≤ ${RECOIL} · accept ≥ ${EASE} · relish ≥ ${RELISH} effective corruption · affinity +${AFF}/matching turned limb`);
console.log(`  bands  : ${Object.entries(BAND).map(([d, k]) => `L${d}=${k}`).join('  ')}  (other layers: per-room override only)`);
console.log('');

if (faults.length) { console.log(`HARD FAULTS (${faults.length}):`); faults.forEach((f) => console.log('  ✗ ' + f)); console.log(''); }
else console.log(`✓ coverage clean — every kind has class + all ${TIERS.length} tiers (${TIERS.join('/')}); every band/override target exists\n`);

if (args.has('--ladder')) {
  console.log('THE LADDER (effective corruption = general $corruption + ' + AFF + ' × matching turned limbs):');
  console.log(`  0 – ${RECOIL}     recoil      a FRESH body in violent revolt — the extreme human reaction`);
  console.log(`  ${RECOIL + 1} – ${EASE - 1}   (revulsion) SILENT — habituated to "bad but survivable"; the room's own prose carries it`);
  console.log(`  ${EASE} – ${RELISH - 1}   accept      the disgust-alarm has gone quiet; it is only air now`);
  console.log(`  ${RELISH} – 100+ relish      worse — the body wants it`);
  console.log(`  affinity: a TURNED limb of a kind's class adds +${AFF} (matching-class-only, additive-only)`);
  console.log('');
}

/* the grid */
for (const k of KINDS) {
  const cell = ROOM_SCENT[k];
  console.log(`══ ${k.toUpperCase()}  (class: ${cell.class}) ══`);
  for (const t of TIERS) console.log(`  [${t}] ${cell[t]}`);
  console.log('');
}

/* rollout: group every known passage by its resolved kind */
const byKind = {}; KINDS.forEach((k) => (byKind[k] = []));
const optedOut = [];
for (const p of Object.keys(DEPTH)) {
  const k = scentOf(p);
  if (k === null && Object.prototype.hasOwnProperty.call(OVERRIDE, p)) optedOut.push(p);
  else if (k && byKind[k]) byKind[k].push(p);
}
console.log('ROLLOUT — rooms resolving to each kind (band default ⊕ overrides):');
for (const k of KINDS) {
  console.log(`  ${k.padEnd(8)} ${byKind[k].length} room(s)`);
  if (args.has('--rooms')) byKind[k].forEach((p) => console.log(`      ${p}  (L${DEPTH[p]})`));
}
console.log(`  ${'(opt-out)'.padEnd(8)} ${optedOut.length} room(s): ${optedOut.join(', ')}`);
console.log('');

console.log(faults.length ? `RESULT: ${faults.length} fault(s) — fix before shipping.` : 'RESULT: clean.');
process.exit(faults.length ? 1 : 0);
