// Sewer Demons — clean-run reachability / belonging-clock audit.
//   node tools/clean-run-path.mjs
// Parses the room graph (<<goto>> edges) + setup.depthOf from src/, then computes the
// MINIMUM possible $deepTurns ("belonging clock") for a focused escape — descend for the
// rope (HellMarket, L6) and the brand (TheBurningTree, L9), climb back, burn the fatberg,
// reach the exit (ExitShaft, L1) — and compares it to the warning (120) and seal (200).
// A LOWER BOUND: it ignores gate/item conditions (treats every <<goto>> as always open) and
// lets the path pass through any room, so the real journey can only be LONGER. If even the
// lower bound exceeds the seal, a clean escape is provably impossible under current tuning.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const files = readdirSync(srcDir).filter(f => f.endsWith(".twee"));
const allText = files.map(f => readFileSync(join(srcDir, f), "utf8")).join("\n");

// ---- depthOf (reuse a brace-matched extractor so comments/strings don't miscount) ----
function extractObject(text, marker) {
  const start = text.indexOf(marker);
  let i = text.indexOf("{", start), objStart = i, depth = 0, s = null, line = false, block = false;
  for (; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && n === "/") { block = false; i++; } continue; }
    if (s) { if (c === "\\") { i++; continue; } if (c === s) s = null; continue; }
    if (c === "/" && n === "/") { line = true; i++; continue; }
    if (c === "/" && n === "*") { block = true; i++; continue; }
    if (c === '"' || c === "'") { s = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return text.slice(objStart, i + 1); }
  }
  throw new Error("unbalanced");
}
const depthOf = eval("(" + extractObject(allText, "setup.depthOf = {") + ")");
const SEAL = +(/setup\.SEAL_LIMIT\s*=\s*(\d+)/.exec(allText) || [])[1] || 200;
const WARN = +(/setup\.SEAL_WARN\s*=\s*(\d+)/.exec(allText) || [])[1] || Math.round(SEAL * 0.6);

// ---- passages + their <<goto>> edges ----
const passages = {};   // name -> Set(targets)
for (const f of files) {
  const text = readFileSync(join(srcDir, f), "utf8");
  const parts = text.split(/^:: /m);
  for (const part of parts) {
    const m = /^([^\[\n]+?)(?:\s*\[[^\]]*\])?\s*\n([\s\S]*)$/.exec(part);
    if (!m) continue;
    const name = m[1].trim();
    if (!name || name.startsWith("Story") || name === "PassageHeader" || name === "Widgets") continue;
    const targets = new Set();
    let g; const re = /<<goto\s+"([^"]+)"/g;
    while ((g = re.exec(m[2]))) targets.add(g[1]);
    passages[name] = targets;
  }
}

// ---- Dijkstra: cost of a path = sum of depthOf over every room ENTERED (PassageHeader adds
//      depthOf[passage] on arrival). Edge A->B costs depthOf[B]. ----
const d = (p) => depthOf[p] || 0;
function shortest(from, to) {
  const dist = { [from]: 0 }, prev = {}, seen = new Set();
  const pq = [[0, from]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, node] = pq.shift();
    if (seen.has(node)) continue;
    seen.add(node);
    if (node === to) break;
    for (const nb of (passages[node] || [])) {
      if (!(nb in passages)) continue;
      const nc = cost + d(nb);
      if (dist[nb] === undefined || nc < dist[nb]) { dist[nb] = nc; prev[nb] = node; pq.push([nc, nb]); }
    }
  }
  if (dist[to] === undefined) return null;
  const path = []; let n = to; while (n) { path.unshift(n); n = prev[n]; }
  return { cost: dist[to], path };
}

// ---- the mandatory escape waypoints ----
const ROPE = "HellMarket";        // L6 — buy the rope
const BRAND = "TheBurningTree";   // L9 — the branch that never stops burning
const FATBERG = "TheFatberg";     // L2 — burn it open with the brand
const EXIT = "ExitShaft";         // L1 — the climb out

console.log("Sewer Demons — clean-run / belonging-clock audit");
console.log(`  ${Object.keys(passages).length} passages; SEAL_LIMIT ${SEAL}, warning ${WARN}, depth = layer number on entry\n`);

const legs = [
  ["Start", ROPE],     // descend for the rope
  [ROPE, BRAND],       // deeper for the brand
  [BRAND, FATBERG],    // climb back to the choke
  [FATBERG, EXIT],     // through the burned fatberg to the exit
];
let total = 0, ok = true;
for (const [a, b] of legs) {
  const r = shortest(a, b);
  if (!r) { console.log(`  ${a} -> ${b}: NO PATH (graph gap?)`); ok = false; continue; }
  total += r.cost;
  console.log(`  ${a} -> ${b}: +${r.cost} deepTurns  (${r.path.length} rooms)`);
}
console.log("");
if (ok) {
  console.log(`MIN POSSIBLE deepTurns for a focused brand-route escape (lower bound): ${total}`);
  console.log(`  warning fires at ${WARN} — best case ${total >= WARN ? "CROSSES it" : "stays under"}`);
  console.log(`  seal closes at ${SEAL} — best case ${total >= SEAL ? "CROSSES → escape IMPOSSIBLE at this tuning" : `leaves ${SEAL - total} headroom (${Math.round((1 - total / SEAL) * 100)}%)`}`);
  console.log(`  (real runs are LONGER: this ignores backtracking, gates, rest/shop detours, dead-ends, lost fights.)`);
  console.log(`  rule of thumb: a real focused run ≈ 1.4–1.7× the lower bound (~${Math.round(total * 1.4)}–${Math.round(total * 1.7)}); keep SEAL_LIMIT above that.`);
}
