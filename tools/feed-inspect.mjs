#!/usr/bin/env node
/* =====================================================================
   feed-inspect.mjs — inspect & verify the TRANSFORMATION FEED prose matrix.
   Run: node tools/feed-inspect.mjs            (summary + warnings; exit 1 on a hard fault)
        node tools/feed-inspect.mjs --list     (also print every assembled beat)
        node tools/feed-inspect.mjs --deepen   (also print the "works deeper" lines)
        node tools/feed-inspect.mjs --overlap  (also print feed<->BODY_DESC shared phrases)

   Unlike combat-sim.mjs (which hand-mirrors engine MATH that Node can't extract),
   this tool READS THE PROSE STRAIGHT FROM src/sewer-demons.twee — setup.CHANGE_DESC,
   CHANGE_DEEPEN, SEG_PROSE, PART_TYPE, SEGMENTS, CLASSES, STAGE_AT, CHANGE_MIN_AMT,
   and BODY_DESC — so it can never drift from the game. (The 2026-06-24 audit caught an
   agent's hand-copied scanner that had drifted to curly apostrophes; this avoids that
   whole class of bug by parsing the one source of truth.)

   It assembles every beat EXACTLY as setup.describeChange does ("Your <part> " + predicate),
   then reports:
     • COVERAGE  — every part x class x stage cell present & non-empty (hard fault if not)
     • BUILD     — each predicate reads grammatically after its subject: lowercase start,
                   no double-subject, terminal punctuation (hard fault if not)
     • ANATOMY   — advisory: a predicate naming a part it shouldn't (a "body" beat that says
                   "finger", a "head" beat that says "knee"), with a class-aware allowlist
     • ECHO      — advisory: phrases (4+ words) reused across feed cells (de-mechanize these)
     • OVERLAP   — advisory: phrases the feed shares with the side-bar BODY_DESC readout
                   (the audit's "push the feed toward eventful, leave the inventory to the
                   side-bar" polish direction — this is how you find the overlaps to break)

   See docs/TRANSFORMATION.md → "The transformation feed", and the
   sewer-demons-expand-transformation-feed skill.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'src', 'sewer-demons.twee');
const src = readFileSync(SRC, 'utf8');

const args = new Set(process.argv.slice(2));

/* ---- pull a JS literal assigned to `setup.<name>` out of the source ---------------
   Finds the ASSIGNMENT (not a `.random()` use or a comment mention) by requiring the RHS
   to open with { / [ / a digit, then string-aware brace-matches to the literal's end. */
function grab(name) {
  const re = new RegExp('setup\\.' + name + '\\s*=\\s*', 'g');
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    const open = src[i];
    if (open === '{' || open === '[') return evalLit(matchBracket(i));
    if (open >= '0' && open <= '9') {
      const end = src.indexOf(';', i);
      return Number(src.slice(i, end).trim());
    }
    // RHS is something else (e.g. a function or a reference) — keep looking
  }
  throw new Error('could not find an object/array/number assignment for setup.' + name);
}

/* return the substring from src[start] (a { or [) to its matching close, string-aware */
function matchBracket(start) {
  let depth = 0, inStr = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced literal starting at offset ' + start);
}

/* eslint-disable no-eval */
function evalLit(text) { return eval('(' + text + ')'); }

/* ---- the engine's own data, straight from the source ---- */
const SEGMENTS = grab('SEGMENTS');
const CLASSES = grab('CLASSES');
const PART_TYPE = grab('PART_TYPE');
const SEG_PROSE = grab('SEG_PROSE');
const STAGE_AT = grab('STAGE_AT');
const CHANGE_DESC = grab('CHANGE_DESC');
const CHANGE_DEEPEN = grab('CHANGE_DEEPEN');
const CHANGE_MIN_AMT = grab('CHANGE_MIN_AMT');
const BODY_DESC = grab('BODY_DESC');

const STAGES = STAGE_AT.map((s) => s.key).slice().reverse();   // tingle -> tainted -> turning -> turned (low to high)
const PARTS = [...new Set(SEGMENTS.map((s) => PART_TYPE[s]))];  // head, torso, arm, leg

/* mirror of setup.describeChange (the cross/turn beat) */
function beat(part, cls, stage, seg) {
  const pred = ((CHANGE_DESC[part] || {})[cls] || {})[stage];
  if (!pred) return null;
  return 'Your ' + (SEG_PROSE[seg] || 'body') + ' ' + pred;
}
/* a representative segment for a part-type (for the SEG_PROSE subject); arm/leg use the L side */
const repSeg = (part) => SEGMENTS.find((s) => PART_TYPE[s] === part);

/* ---- checks ---- */
const faults = [];   // hard (exit 1)
const notes = [];    // advisory

// COVERAGE + BUILD
for (const part of PARTS) {
  for (const cls of CLASSES) {
    for (const stage of STAGES) {
      const pred = ((CHANGE_DESC[part] || {})[cls] || {})[stage];
      if (!pred || !pred.trim()) {
        faults.push(`COVERAGE  ${part}/${cls}/${stage} — missing or empty cell`);
        continue;
      }
      const full = beat(part, cls, stage, repSeg(part));
      if (/^[A-Z]/.test(pred)) faults.push(`BUILD     ${part}/${cls}/${stage} — predicate starts with a capital (it follows "Your ${SEG_PROSE[repSeg(part)]} "): "${pred}"`);
      if (/^(your|it|the)\b/i.test(pred)) faults.push(`BUILD     ${part}/${cls}/${stage} — predicate restates a subject ("${pred.split(' ').slice(0, 2).join(' ')}…") → double subject: "${full}"`);
      if (!/[.!?]$/.test(pred.trim())) faults.push(`BUILD     ${part}/${cls}/${stage} — no terminal punctuation: "${pred}"`);
      if (/\s{2,}/.test(pred)) notes.push(`BUILD?    ${part}/${cls}/${stage} — double space in predicate`);
    }
  }
}
for (const cls of CLASSES) {
  if (!CHANGE_DEEPEN[cls] || !CHANGE_DEEPEN[cls].trim()) faults.push(`COVERAGE  deepen/${cls} — missing CHANGE_DEEPEN line`);
}

// ANATOMY (advisory, class-aware allowlist so pig "foreleg/trotter" on an arm/leg isn't flagged)
const WRONG = {
  head:  ['knee', 'ankle', 'heel', 'foot', 'wrist', 'finger', 'hand', 'hoof', 'trotter', 'paw', 'rib', 'breastbone', 'spine', 'belly'],
  torso: ['jaw', 'snout', 'muzzle', 'whisker', 'tusk', 'knee', 'ankle', 'heel', 'foot', 'wrist', 'finger', 'hand', 'hoof', 'trotter', 'paw'],
  arm:   ['knee', 'ankle', 'heel', 'jaw', 'snout', 'muzzle', 'whisker', 'tusk', 'rib', 'breastbone', 'spine', 'belly'],
  leg:   ['jaw', 'snout', 'muzzle', 'whisker', 'tusk', 'finger', 'grip', 'rib', 'breastbone', 'belly'],
};
const ANATOMY_OK = ['foreleg', 'forearm'];   // legitimate compound limbs that contain a substring we'd otherwise flag
for (const part of PARTS) {
  for (const cls of CLASSES) {
    for (const stage of STAGES) {
      const pred = ((CHANGE_DESC[part] || {})[cls] || {})[stage];
      if (!pred) continue;
      const words = pred.toLowerCase().replace(/[^a-z'\- ]/g, ' ').split(/\s+/);
      for (const w of (WRONG[part] || [])) {
        if (words.includes(w) && !ANATOMY_OK.some((ok) => pred.toLowerCase().includes(ok) && ok.includes(w))) {
          notes.push(`ANATOMY   ${part}/${cls}/${stage} — names "${w}" (review): "${beat(part, cls, stage, repSeg(part))}"`);
        }
      }
    }
  }
}

// phrase helpers
const grams = (text, n = 4) => {
  const w = text.toLowerCase().replace(/[^a-z'\- ]/g, ' ').split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(' '));
  return out;
};

// ECHO — 4-word phrases reused across DIFFERENT feed cells
const echo = new Map();   // gram -> Set(cellId)
for (const part of PARTS) for (const cls of CLASSES) for (const stage of STAGES) {
  const pred = ((CHANGE_DESC[part] || {})[cls] || {})[stage];
  if (!pred) continue;
  const id = `${part}/${cls}/${stage}`;
  for (const g of grams(pred)) { if (!echo.has(g)) echo.set(g, new Set()); echo.get(g).add(id); }
}
const echoes = [...echo.entries()].filter(([, ids]) => ids.size >= 2).sort((a, b) => b[1].size - a[1].size);

// OVERLAP — phrases the feed shares with the matching BODY_DESC cell
const overlaps = [];
for (const part of PARTS) for (const cls of CLASSES) for (const stage of STAGES) {
  const fp = ((CHANGE_DESC[part] || {})[cls] || {})[stage];
  const bp = ((BODY_DESC[part] || {})[cls] || {})[stage];
  if (!fp || !bp) continue;
  const bset = new Set(grams(bp, 3));
  const shared = [...new Set(grams(fp, 3))].filter((g) => bset.has(g));
  if (shared.length) overlaps.push({ cell: `${part}/${cls}/${stage}`, shared });
}

/* ---- report ---- */
const cellCount = PARTS.length * CLASSES.length * STAGES.length;
console.log('TRANSFORMATION FEED — prose matrix inspection');
console.log(`  source : ${SRC}`);
console.log(`  shape  : ${PARTS.length} parts × ${CLASSES.length} classes × ${STAGES.length} stages = ${cellCount} beat cells (+ ${CLASSES.length} deepen lines)`);
console.log(`  parts  : ${PARTS.join(', ')}    classes: ${CLASSES.join(', ')}    stages: ${STAGES.join(' → ')}`);
console.log(`  calib  : CHANGE_MIN_AMT = ${CHANGE_MIN_AMT} (a single within-stage hit ≥ this fires a "works deeper" beat)`);
console.log('');

if (faults.length) { console.log(`HARD FAULTS (${faults.length}):`); faults.forEach((f) => console.log('  ✗ ' + f)); console.log(''); }
else console.log('✓ coverage + construction clean — every cell present, every predicate reads after its subject\n');

if (notes.length) { console.log(`ADVISORY (${notes.length}):`); notes.forEach((n) => console.log('  • ' + n)); console.log(''); }

if (echoes.length) {
  console.log(`ECHO — phrases shared across feed cells (${echoes.length}); vary these to de-mechanize the escalation:`);
  echoes.slice(0, 25).forEach(([g, ids]) => console.log(`  • "${g}"  ← ${[...ids].join(', ')}`));
  if (echoes.length > 25) console.log(`  … and ${echoes.length - 25} more`);
  console.log('');
}

if (args.has('--overlap')) {
  console.log(`OVERLAP — feed cells sharing a 3-word phrase with the side-bar BODY_DESC (${overlaps.length}):`);
  overlaps.forEach((o) => console.log(`  • ${o.cell}: ${o.shared.map((s) => `"${s}"`).join(', ')}`));
  console.log('');
} else {
  console.log(`OVERLAP — ${overlaps.length} feed cells share a phrase with BODY_DESC (run --overlap to list; the polish direction is to break these so the feed stays eventful and the side-bar keeps the inventory).\n`);
}

if (args.has('--list')) {
  console.log('ALL BEATS:');
  for (const part of PARTS) {
    for (const cls of CLASSES) {
      for (const stage of STAGES) {
        const b = beat(part, cls, stage, repSeg(part));
        console.log(`  [${part}/${cls}/${stage}] ${b || '(MISSING)'}`);
      }
    }
    console.log('');
  }
}
if (args.has('--deepen')) {
  console.log('DEEPEN LINES (a big within-stage hit, ≥ CHANGE_MIN_AMT):');
  for (const cls of CLASSES) console.log(`  [${cls}] ${(CHANGE_DEEPEN[cls] || '(MISSING)') + (SEG_PROSE[repSeg('arm')] || 'X') + '.'}`);
  console.log('');
}

console.log(faults.length ? `RESULT: ${faults.length} hard fault(s) — fix before shipping.` : 'RESULT: clean.');
process.exit(faults.length ? 1 : 0);
