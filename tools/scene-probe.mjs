#!/usr/bin/env node
/* =====================================================================
   scene-probe.mjs — inspect & verify the ROOM DIORAMA rollout (the sprite scenes).
   Run: node tools/scene-probe.mjs             (coverage + faults; exit 1 on a fault)
        node tools/scene-probe.mjs --rooms     (also list every room and what it draws)
        node tools/scene-probe.mjs --pack      (also list the imported sprite pack)

   The diorama above a room's prose is DERIVED — from the room's layer (which picks the
   floor and wall material), its role (which picks what is lying about) and a hash of its
   own name (which picks the size and the arrangement). Only setup.SCENE_ROOM is authored
   by hand, and a hand-authored table is where the silent faults live: a room name that
   was never a passage, or a prop id that is not in the sprite pack, both fail by simply
   drawing nothing. Nobody notices an empty corner of a picture. So they are checked here.

   Like scent-probe.mjs / feed-inspect.mjs, this reads the real tables straight out of
   src/sprite-scene.twee and the real pack out of img/sprite/manifest.json — no hand copy
   to drift — and resolves every room the way setup.sceneFor does, without driving a browser.

   FAULTS (exit 1)
     · a SCENE_ROOM key that is not a passage        — the override can never fire
     · a SCENE_ROOM key that is not a mapped room    — sceneFor returns null for it
     · a prop / wall / ground id not in the pack     — silently draws nothing
     · a layer with no material palette              — every room in it goes bare
   NOT a fault, but reported
     · SHADOWED: the room carries a hand-drawn <<roomart>>, which wins. Keeping the
       override is deliberate — see the note in setup.SCENE_ROOM.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const sceneSrc = readFileSync(join(ROOT, 'src', 'sprite-scene.twee'), 'utf8');
const storySrc = readFileSync(join(ROOT, 'src', 'sewer-demons.twee'), 'utf8');
const mapSrc = readFileSync(join(ROOT, 'src', 'map-data.twee'), 'utf8');
const pack = JSON.parse(readFileSync(join(ROOT, 'img', 'sprite', 'manifest.json'), 'utf8'));
const args = new Set(process.argv.slice(2));

/* ---- pull a `setup.<name> = {…}` literal out of a source (string-aware) ---- */
function matchBracket(src, i) {
  const open = src[i], close = open === '{' ? '}' : ']';
  let depth = 0, q = null, esc = false;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (esc) { esc = false; continue; }
    if (q) { if (c === '\\') esc = true; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j + 2) + 1; continue; }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return src.slice(i, j + 1);
  }
  throw new Error('unbalanced literal at ' + i);
}
function grab(src, name) {
  const m = new RegExp('setup\\.' + name + '\\s*=\\s*').exec(src);
  if (!m) throw new Error('not found: setup.' + name);
  const i = m.index + m[0].length;
  return eval('(' + matchBracket(src, i) + ')');   // eslint-disable-line no-eval
}

const SCENE_ROOM = grab(sceneSrc, 'SCENE_ROOM');
const SCENE_LAYER = grab(sceneSrc, 'SCENE_LAYER');
const ROLE_PROPS = grab(sceneSrc, 'SCENE_ROLE_PROPS');
const GRADE = grab(sceneSrc, 'SCENE_GRADE');
const mapGraph = grab(mapSrc, 'mapGraph');
const mapMeta = grab(mapSrc, 'mapMeta');

/* every passage in the story, and which of them carry a hand-drawn illustration */
const passages = new Map();
for (const m of storySrc.matchAll(/^:: ([^[\n]+?)\s*(\[[^\]]*\])?$/gm)) passages.set(m[1].trim(), '');
for (const file of ['layer1-storm-drains', 'layer2-trunk-mains', 'layer3-old-drains',
                    'layer4-drowned-galleries', 'layer5-hellmouth', 'layer6-shambles',
                    'layer7-belly', 'layer8-rendering-works', 'layer9-sulphur-deep']) {
  const text = readFileSync(join(ROOT, 'src', file + '.twee'), 'utf8');
  for (const m of text.matchAll(/^:: ([^[\n]+?)\s*(\[[^\]]*\])?$/gm)) passages.set(m[1].trim(), '');
  for (const m of text.split(/^:: /m).slice(1)) {
    const name = m.split(/\r?\n/, 1)[0].replace(/\s*\[[^\]]*\]\s*$/, '').trim();
    if (/<<roomart/.test(m)) passages.set(name, 'roomart');
  }
}
for (const m of storySrc.split(/^:: /m).slice(1)) {
  const name = m.split(/\r?\n/, 1)[0].replace(/\s*\[[^\]]*\]\s*$/, '').trim();
  if (/<<roomart/.test(m)) passages.set(name, 'roomart');
}

/* every MAPPED room (what setup.depthOf covers), with its layer and role */
const rooms = new Map();
for (const [layer, G] of Object.entries(mapGraph)) {
  for (const r of G.rooms) rooms.set(r[0], { layer: Number(layer), role: r[1] });
}

const faults = [];
const fault = (msg) => faults.push(msg);
const known = (group, id) => Object.prototype.hasOwnProperty.call(pack[group], id);

/* ---- 1. the material palette covers every layer that has rooms ---- */
for (const layer of Object.keys(mapGraph)) {
  const mat = SCENE_LAYER[layer];
  if (!mat) { fault(`L${layer} has rooms but no SCENE_LAYER palette — every room in it draws bare`); continue; }
  if (!known('grounds', mat.ground)) fault(`L${layer} ground "${mat.ground}" is not in the sprite pack`);
  if (!known('edges', mat.wall)) fault(`L${layer} wall "${mat.wall}" is not in the sprite pack`);
  const band = mapMeta.band[layer];
  if (!GRADE[band]) fault(`L${layer} is band "${band}", which has no SCENE_GRADE wash`);
}

/* ---- 2. every role pool names real props ---- */
for (const [role, pool] of Object.entries(ROLE_PROPS)) {
  for (const id of pool) if (!known('props', id)) fault(`SCENE_ROLE_PROPS.${role} names "${id}", not in the sprite pack`);
}
const roles = new Set([...rooms.values()].map((r) => r.role));
for (const role of roles) if (!ROLE_PROPS[role]) fault(`role "${role}" exists on the map but has no prop pool (falls back to "room")`);

/* ---- 3. every hand-authored override ---- */
const shadowed = [];
for (const [name, ov] of Object.entries(SCENE_ROOM)) {
  if (!passages.has(name)) { fault(`SCENE_ROOM."${name}" is not a passage — the override can never fire`); continue; }
  if (!rooms.has(name)) { fault(`SCENE_ROOM."${name}" is not a mapped room — sceneFor returns null for it`); continue; }
  if (passages.get(name) === 'roomart') shadowed.push(name);
  for (const id of ov.props || []) if (!known('props', id)) fault(`SCENE_ROOM."${name}" names prop "${id}", not in the sprite pack`);
  if (ov.wall && !known('edges', ov.wall)) fault(`SCENE_ROOM."${name}" names wall "${ov.wall}", not in the sprite pack`);
  if (ov.ground && !known('grounds', ov.ground)) fault(`SCENE_ROOM."${name}" names ground "${ov.ground}", not in the sprite pack`);
}

/* ---- rollout ---- */
const withArt = [...rooms.keys()].filter((n) => passages.get(n) === 'roomart');
const drawn = rooms.size - withArt.length;
console.log(`SPRITE PACK — ${Object.keys(pack.grounds).length} grounds · ${Object.keys(pack.props).length} props · ${Object.keys(pack.edges).length} edges`);
console.log(`COVERAGE   — ${rooms.size} mapped rooms · ${drawn} draw a derived diorama · ${withArt.length} keep a hand-drawn roomart`);
console.log(`OVERRIDES  — ${Object.keys(SCENE_ROOM).length} authored${shadowed.length ? ` · ${shadowed.length} SHADOWED by roomart: ${shadowed.join(', ')}` : ''}`);
console.log('');
console.log('BY LAYER:');
for (const layer of Object.keys(mapGraph).sort()) {
  const mat = SCENE_LAYER[layer] || {};
  const n = [...rooms.values()].filter((r) => r.layer === Number(layer)).length;
  console.log(`  L${layer} ${String(n).padStart(3)} rooms  ${String(mat.ground || '—').padEnd(16)} ${String(mat.wall || '—').padEnd(18)} ${mapMeta.band[layer]}`);
}

if (args.has('--pack')) {
  console.log('\nPACK:');
  for (const group of ['grounds', 'props', 'edges']) {
    console.log(`  ${group}:`);
    for (const [id, e] of Object.entries(pack[group])) console.log(`    ${id.padEnd(24)} ${String(e.size.join('x')).padEnd(9)} ${e.use}`);
  }
}
if (args.has('--rooms')) {
  console.log('\nROOMS:');
  for (const [name, r] of [...rooms].sort((a, b) => a[1].layer - b[1].layer || a[0].localeCompare(b[0]))) {
    const ov = SCENE_ROOM[name], mat = SCENE_LAYER[r.layer] || {};
    const art = passages.get(name) === 'roomart' ? '  [roomart — no diorama]' : '';
    console.log(`  L${r.layer} ${name.padEnd(26)} ${String(r.role).padEnd(7)} ${(ov && ov.ground) || mat.ground}/${(ov && ov.wall) || mat.wall}${ov ? '  *override*' : ''}${art}`);
  }
}

console.log('');
if (faults.length) { faults.forEach((f) => console.log('  FAULT: ' + f)); }
console.log(faults.length ? `RESULT: ${faults.length} fault(s) — fix before shipping.` : 'RESULT: clean.');
process.exit(faults.length ? 1 : 0);
