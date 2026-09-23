#!/usr/bin/env node
// passage-graph.mjs — extract the passage→passage navigation graph from the
// Twee source, grouped by layer (setup.depthOf), and classify every edge as
// up / down / intra-layer / cross (jump). Zero deps; reads src/*.twee.
//
//   node tools/passage-graph.mjs           # human summary, per layer
//   node tools/passage-graph.mjs --json    # full graph as JSON (for the diagram)
//   node tools/passage-graph.mjs --check   # link integrity: every goto target exists
//
// Conventions it relies on (verified 2026-06-16):
//   * navigation is ALWAYS <<goto "Target">> (no [[wiki]] links in this repo)
//   * setup.depthOf in sewer-demons.twee is the authoritative passage→layer map
//   * combat returns route through setup.startFight(enemy, "Return") and a
//     <<goto>> inside the *Cleared lander, so they show up as ordinary gotos.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

// ---- read every twee source ------------------------------------------------
const files = readdirSync(SRC).filter((f) => f.endsWith(".twee"));
const corpus = Object.fromEntries(
  files.map((f) => [f, readFileSync(join(SRC, f), "utf8")])
);

// ---- authoritative layer map (setup.depthOf) -------------------------------
function parseDepthOf() {
  const core = corpus["sewer-demons.twee"];
  const m = core.match(/setup\.depthOf = \{([\s\S]*?)\};/);
  if (!m) throw new Error("could not find setup.depthOf");
  const body = m[1].replace(/\/\*[\s\S]*?\*\//g, ""); // strip block comments
  const depth = {};
  for (const pair of body.matchAll(/(\w+)\s*:\s*(\d+)/g)) {
    depth[pair[1]] = Number(pair[2]);
  }
  return depth;
}
const depthOf = parseDepthOf();

// ---- parse passages --------------------------------------------------------
// Returns { name -> { name, tags, file, layer, gotos:Set, header:bool } }
function parsePassages() {
  const passages = {};
  for (const [file, text] of Object.entries(corpus)) {
    // split on passage headers: lines beginning ":: "
    const re = /^::\s+([^\[\n]+?)\s*(\[[^\]]*\])?\s*$/gm;
    const heads = [...text.matchAll(re)];
    for (let i = 0; i < heads.length; i++) {
      const name = heads[i][1].trim();
      const tags = heads[i][2]
        ? heads[i][2].slice(1, -1).split(/\s+/).filter(Boolean)
        : [];
      const start = heads[i].index + heads[i][0].length;
      const end = i + 1 < heads.length ? heads[i + 1].index : text.length;
      const body = text.slice(start, end);
      // skip the non-room special passages (stylesheet/script/StoryData/etc.)
      const gotos = new Set(
        [...body.matchAll(/<<goto\s+"([^"]+)"/g)].map((g) => g[1])
      );
      passages[name] = {
        name,
        tags,
        file,
        layer: depthOf[name],
        gotos,
        body,
      };
    }
  }
  return passages;
}
const P = parsePassages();

// ---- classify a passage's role ---------------------------------------------
function roleOf(p) {
  if (p.tags.includes("ending")) return "ending";
  const n = p.name;
  if (/Cleared$/.test(n)) return "lander"; // post-combat landing room
  // heuristic role tags from name/body (cosmetic for the diagram legend)
  const b = p.body;
  if (/\$hp to \$maxhp|setup\.rest|fully rest|heals/i.test(b)) return "rest";
  if (/setup\.startFight\(/.test(b)) return "fight";
  return "room";
}

// ---- build per-layer view --------------------------------------------------
const ROOM_TAGS = new Set(); // not used; layer is from depthOf
function build() {
  const layers = {};
  for (const p of Object.values(P)) {
    if (p.layer === undefined) continue; // non-room passage
    (layers[p.layer] ??= []).push(p);
  }
  const edgesByLayer = {};
  const missing = [];
  for (const p of Object.values(P)) {
    for (const t of p.gotos) {
      if (!P[t]) {
        missing.push({ from: p.name, to: t });
        continue;
      }
      const fromL = p.layer;
      const toL = P[t].layer;
      if (fromL === undefined) continue;
      let kind;
      if (toL === undefined) kind = "out"; // to a non-layer passage (combat/etc.)
      else if (toL < fromL) kind = "up";
      else if (toL > fromL) kind = "down";
      else kind = "intra";
      (edgesByLayer[fromL] ??= []).push({ from: p.name, to: t, kind, toL });
    }
  }
  return { layers, edgesByLayer, missing };
}
const G = build();

// ---- assemble the layer-grouped graph object -------------------------------
function buildOut() {
  const out = { depthOf, layers: {}, missing: G.missing };
  for (const [L, ps] of Object.entries(G.layers)) {
    out.layers[L] = {
      rooms: ps
        .map((p) => ({
          name: p.name,
          role: roleOf(p),
          tags: p.tags,
          gotos: [...p.gotos],
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      edges: (G.edgesByLayer[L] || []).sort(
        (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)
      ),
    };
  }
  return out;
}

// ---- force layout (server-side; same algorithm as tools/atlas-viewer.js) ---
const MAP_W = 1000, MAP_H = 640;
const LAYER_NAME = {
  0: "The Surface", 1: "L1 · Storm Drains", 2: "L2 · Trunk Mains",
  3: "L3 · Old Drains", 4: "L4 · Drowned Galleries", 5: "L5 · Hellmouth",
  6: "L6 · Shambles", 7: "L7 · Belly of the Beast", 8: "L8 · Rendering Works",
  9: "L9 · Sulphur Deep",
};
const BAND = {
  0: "meta", 1: "sewer", 2: "sewer", 3: "sewer", 4: "between", 5: "between",
  6: "between", 7: "hell", 8: "hell", 9: "hell",
};
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function layoutLayer(rooms, intraEdges, layerKey) {
  const n = rooms.length;
  const rnd = mulberry32(layerKey * 99991 + n);
  const P = rooms.map((_, i) => {
    const ang = (i / n) * Math.PI * 2 + rnd() * 0.6;
    const rad = 160 + rnd() * 120;
    return { x: MAP_W / 2 + Math.cos(ang) * rad, y: MAP_H / 2 + Math.sin(ang) * rad };
  });
  const area = MAP_W * MAP_H, k = Math.sqrt(area / Math.max(n, 1)) * 0.72;
  let temp = MAP_W / 9;
  for (let it = 0; it < 380; it++) {
    const disp = P.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        let dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01, f = (k * k) / d;
        const ux = dx / d, uy = dy / d;
        disp[i].x += ux * f; disp[i].y += uy * f;
        disp[j].x -= ux * f; disp[j].y -= uy * f;
      }
    for (const e of intraEdges) {
      let dx = P[e[0]].x - P[e[1]].x, dy = P[e[0]].y - P[e[1]].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01, f = (d * d) / k;
      const ux = dx / d, uy = dy / d;
      disp[e[0]].x -= ux * f; disp[e[0]].y -= uy * f;
      disp[e[1]].x += ux * f; disp[e[1]].y += uy * f;
    }
    for (let m = 0; m < n; m++) {
      disp[m].x += (MAP_W / 2 - P[m].x) * 0.012;
      disp[m].y += (MAP_H / 2 - P[m].y) * 0.012;
      const dl = Math.sqrt(disp[m].x * disp[m].x + disp[m].y * disp[m].y) || 0.01;
      const lim = Math.min(dl, temp);
      P[m].x += (disp[m].x / dl) * lim;
      P[m].y += (disp[m].y / dl) * lim;
      P[m].x = Math.max(54, Math.min(MAP_W - 54, P[m].x));
      P[m].y = Math.max(48, Math.min(MAP_H - 60, P[m].y));
    }
    temp *= 0.975;
  }
  return P.map((p) => [Math.round(p.x), Math.round(p.y)]);
}

// Build the compact runtime graph the in-game Map screen draws: per layer,
// positioned rooms + de-duped intra edges (with one-way flag) + cross-layer links.
function buildMapGraph() {
  const out = buildOut();
  const graph = {};
  for (const [L, layer] of Object.entries(out.layers)) {
    if (L === "0") continue; // the surface/meta band isn't a map layer
    const rooms = layer.rooms;
    const idx = {};
    rooms.forEach((r, i) => (idx[r.name] = i));
    // de-dupe intra edges to undirected pairs, track one-way-ness
    const pair = {};
    const links = [];
    for (const e of layer.edges) {
      if (e.kind === "intra") {
        const a = idx[e.from], b = idx[e.to];
        if (a == null || b == null) continue;
        const lo = Math.min(a, b), hi = Math.max(a, b), key = lo + "_" + hi;
        if (!pair[key]) pair[key] = { lo, hi, fwd: false, rev: false };
        if (e.from === rooms[lo].name) pair[key].fwd = true;
        else pair[key].rev = true;
      } else if (e.toL >= 1 && e.toL !== Number(L)) {
        // genuine layer-to-layer connector (skip combat/meta L0 returns)
        links.push([idx[e.from], e.toL, e.to]);
      }
    }
    const intra = Object.values(pair).map((p) => [p.lo, p.hi, p.fwd && p.rev ? 0 : 1]);
    const pos = layoutLayer(rooms, intra, Number(L));
    graph[L] = {
      rooms: rooms.map((r, i) => [r.name, r.role, pos[i][0], pos[i][1]]),
      intra,
      links,
    };
  }
  return graph;
}

// ---- dynamic landers: rooms reached only via a combat return (the 2nd arg of
//      setup.startFight) — they have no static incoming goto, which is expected.
function startFightReturns() {
  const set = new Set();
  // first arg may be a quoted enemy id OR an array of them (["shitgolem","shitgolem"]);
  // the 2nd arg is the return/landing passage we care about.
  for (const text of Object.values(corpus))
    for (const m of text.matchAll(/setup\.startFight\(\s*(?:"[^"]+"|\[[^\]]*\])\s*,\s*"([^"]+)"/g))
      set.add(m[1]);
  return set;
}

// ---- per-layer reachability over intra edges, seeded from the rooms you can
//      ENTER the layer at (targets of cross-layer up/down edges) + dynamic
//      combat-return landers. Flags genuinely unreachable rooms (a disconnect).
function reachability() {
  const dyn = startFightReturns();
  const report = {};
  for (const L of Object.keys(G.layers)) {
    if (L === "0") continue; // L0 = intro/combat/meta, not a navigable map layer
    const rooms = G.layers[L].map((p) => p.name);
    const inLayer = new Set(rooms);
    const entries = new Set();
    for (const edges of Object.values(G.edgesByLayer))
      for (const e of edges)
        if ((e.kind === "up" || e.kind === "down") && String(e.toL) === String(L))
          entries.add(e.to);
    const dynIn = rooms.filter((r) => dyn.has(r));
    dynIn.forEach((r) => entries.add(r));
    const adj = {};
    for (const e of G.edgesByLayer[L] || [])
      if (e.kind === "intra") (adj[e.from] ??= []).push(e.to);
    const seeds = [...entries].filter((r) => inLayer.has(r));
    const vis = new Set(seeds), q = [...seeds];
    while (q.length) {
      const n = q.shift();
      for (const m of adj[n] || []) if (!vis.has(m)) { vis.add(m); q.push(m); }
    }
    report[L] = {
      total: rooms.length, reached: vis.size,
      entries: seeds, dynamic: dynIn,
      unreached: rooms.filter((r) => !vis.has(r)),
    };
  }
  return report;
}

// ---- one-way intra edges (A->B exists, B->A does not). Some are intentional
//      (snares, drops, combat-gated landers); the report catches a HALF-FINISHED
//      break — where you cut a connection in only one direction.
function onewayEdges() {
  const report = {};
  for (const L of Object.keys(G.edgesByLayer)) {
    const intra = (G.edgesByLayer[L] || []).filter((e) => e.kind === "intra");
    const has = new Set(intra.map((e) => e.from + ">" + e.to));
    const seen = new Set(), ones = [];
    for (const e of intra)
      if (!has.has(e.to + ">" + e.from)) {
        const key = e.from + ">" + e.to;
        if (!seen.has(key)) { seen.add(key); ones.push([e.from, e.to]); }
      }
    if (ones.length) report[L] = ones;
  }
  return report;
}

const strip = (s) => s.replace(/^The/, "");

// ---- output ----------------------------------------------------------------
const arg = process.argv[2];

if (arg === "--json") {
  console.log(JSON.stringify(buildOut(), null, 2));
} else if (arg === "--atlas") {
  const out = buildOut();
  const viewer = readFileSync(join(ROOT, "tools", "atlas-viewer.js"), "utf8");
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sewer Demons — Map Atlas</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0c0d0f; color: #c8ccd0;
    font: 14px/1.5 "Iosevka", "Consolas", ui-monospace, monospace; }
  header { padding: 14px 18px 8px; border-bottom: 1px solid #23262b; }
  h1 { margin: 0 0 2px; font-size: 18px; color: #c9b86a; letter-spacing: .5px; }
  .sub { color: #6b727a; font-size: 12px; }
  #tabs { display: flex; flex-wrap: wrap; gap: 5px; padding: 10px 18px; }
  .tab { background: #16181c; color: #9aa1a8; border: 1px solid #2a2e34;
    padding: 5px 11px; border-radius: 5px; cursor: pointer; font: inherit; font-size: 12px; }
  .tab:hover { border-color: #4a5159; color: #d6dade; }
  .tab.active { background: #c9b86a; color: #0c0d0f; border-color: #c9b86a; font-weight: 700; }
  .layout { display: grid; grid-template-columns: 1fr 248px; gap: 0; }
  #stage { padding: 6px 18px 18px; }
  .titlebar { display: flex; align-items: baseline; gap: 12px; margin: 2px 0 6px; }
  #layer-title { font-size: 15px; color: #e4e7ea; font-weight: 700; }
  .band { font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
    padding: 2px 7px; border-radius: 3px; }
  .band-sewer { background: #2f3a2a; color: #9fc77f; }
  .band-between { background: #3a2f1c; color: #e0b46a; }
  .band-hell { background: #3a1f1c; color: #e08a6a; }
  .band-meta { background: #23262b; color: #9aa1a8; }
  #layer-stats { color: #6b727a; font-size: 12px; }
  svg { width: 100%; height: auto; background:
    radial-gradient(circle at 50% 40%, #15171b 0%, #0c0d0f 80%);
    border: 1px solid #23262b; border-radius: 8px; }
  .node { cursor: grab; }
  .node:active { cursor: grabbing; }
  .node.sel rect { stroke: #c9b86a; stroke-width: 2.5; }
  aside { padding: 14px; border-left: 1px solid #23262b; min-height: 640px; }
  aside h3 { margin: 0 0 6px; font-size: 14px; color: #e4e7ea; word-break: break-word; }
  aside p { margin: 6px 0; font-size: 12px; color: #aab0b7; }
  aside b { color: #c9b86a; }
  .hint { color: #6b727a; font-style: italic; }
  .role { display: inline-block; font-size: 10px; text-transform: uppercase;
    letter-spacing: .8px; padding: 2px 7px; border-radius: 3px; margin-bottom: 6px;
    background: #23262b; color: #c8ccd0; }
  .role-rest { background: #2f3a2a; color: #9fc77f; }
  .role-fight { background: #3a1f1c; color: #e08a6a; }
  .role-ending { background: #1c1c20; color: #c9b86a; }
  .legend { display: flex; flex-wrap: wrap; gap: 12px; padding: 8px 18px 4px;
    color: #8a9098; font-size: 11px; }
  .legend span { display: inline-flex; align-items: center; gap: 5px; }
  .sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block;
    border: 1px solid #0c0d0f; }
</style></head>
<body>
<header>
  <h1>Sewer Demons — Map Atlas</h1>
  <div class="sub">9-layer descent · generated from the Twee source by
    <code>tools/passage-graph.mjs --atlas</code>. Drag rooms; click to trace exits.
    <span style="color:#7fb0e0">↑</span>/<span style="color:#e0925f">↓</span>
    badges mark the rooms that connect to the layer above/below (hover for target).</div>
</header>
<div id="tabs"></div>
<div class="legend">
  <span><i class="sw" style="background:#7d8893"></i> room</span>
  <span><i class="sw" style="background:#4e9a6b"></i> rest (heals)</span>
  <span><i class="sw" style="background:#b4503e"></i> fight</span>
  <span><i class="sw" style="background:#566069"></i> combat-cleared lander</span>
  <span><i class="sw" style="background:#1c1c20"></i> ending</span>
  <span><span style="color:#7fb0e0">↑</span> ascent</span>
  <span><span style="color:#e0925f">↓</span> descent</span>
</div>
<div class="layout">
  <div id="stage">
    <div class="titlebar">
      <span id="layer-title"></span>
      <span class="band" id="layer-band"></span>
      <span id="layer-stats"></span>
    </div>
    <svg id="canvas" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7"
          markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#4a5159"/>
        </marker>
      </defs>
    </svg>
  </div>
  <aside id="panel"></aside>
</div>
<script>window.__GRAPH__ = ${JSON.stringify(out)};</script>
<script>
${viewer}
</script>
</body></html>
`;
  const dest = join(ROOT, "docs", "MAP-ATLAS.html");
  writeFileSync(dest, html, "utf8");
  console.log(`Wrote ${dest} (${(html.length / 1024).toFixed(0)} KB, self-contained).`);
} else if (arg === "--embed") {
  const graph = buildMapGraph();
  const data =
    "setup.mapMeta = " + JSON.stringify({ layerName: LAYER_NAME, band: BAND }) + ";\n" +
    "setup.mapGraph = " + JSON.stringify(graph) + ";\n";
  const twee =
    ":: MapData [script]\n" +
    "/* GENERATED by tools/passage-graph.mjs --embed — DO NOT EDIT BY HAND.\n" +
    "   Regenerated by build.ps1 before every compile, so it never drifts from the\n" +
    "   actual passages. The runtime adjacency + baked force-layout positions the\n" +
    "   in-game Map screen (setup.mapView, in the raw-JS script-block) draws. Each layer:\n" +
    "   rooms [name, role, x, y] · intra [aIdx, bIdx, oneway] · links [fromIdx, toLayer, toName]. */\n" +
    data;
  const dest = join(SRC, "map-data.twee");
  writeFileSync(dest, twee, "utf8");
  const rooms = Object.values(graph).reduce((a, l) => a + l.rooms.length, 0);
  console.log(`Wrote ${dest} (${(twee.length / 1024).toFixed(0)} KB, ${rooms} rooms across ${Object.keys(graph).length} layers).`);
} else if (arg === "--reachable") {
  const r = reachability();
  let bad = 0;
  for (const L of Object.keys(r).sort((a, b) => a - b)) {
    const x = r[L];
    const genuine = x.unreached.filter((n) => !x.dynamic.includes(n));
    console.log(
      `L${L}: ${x.reached}/${x.total} reachable  from [${x.entries.map(strip).join(", ") || "—"}]` +
        (x.dynamic.length ? `  · landers(combat): ${x.dynamic.map(strip).join(", ")}` : "")
    );
    if (genuine.length) {
      bad += genuine.length;
      console.log(`   ⚠ UNREACHABLE: ${genuine.map(strip).join(", ")}`);
    }
  }
  console.log(
    bad
      ? `\n${bad} unreachable room(s) — a disconnect (see ⚠). Dynamic landers are reached via combat returns and are fine.`
      : `\nOK — every room reachable (dynamic landers via combat returns).`
  );
  if (bad) process.exit(1);
} else if (arg === "--oneway") {
  const o = onewayEdges();
  const ks = Object.keys(o).sort((a, b) => a - b);
  if (!ks.length) {
    console.log("No one-way intra edges — every in-layer connection is two-way.");
  } else {
    console.log(
      "One-way intra edges (A→B exists, B→A does not). Intentional for drops / snares /\n" +
        "combat landers — but a surprise here is usually a break cut in only one direction:\n"
    );
    for (const L of ks) {
      console.log(` L${L}:`);
      for (const [a, b] of o[L]) console.log(`   ${strip(a)} → ${strip(b)}`);
    }
  }
} else if (arg === "--check") {
  if (G.missing.length === 0) {
    console.log(`OK — all goto targets resolve (${Object.keys(P).length} passages).`);
  } else {
    console.log(`MISSING goto targets (${G.missing.length}):`);
    for (const m of G.missing) console.log(`  ${m.from} -> ${m.to}`);
    process.exit(1);
  }
} else {
  // human summary
  const LAYER_NAME = {
    0: "Intro / combat / meta",
    1: "L1 Storm Drains",
    2: "L2 Trunk Mains",
    3: "L3 Old Drains",
    4: "L4 Drowned Galleries",
    5: "L5 Hellmouth",
    6: "L6 Shambles",
    7: "L7 Belly of the Beast",
    8: "L8 Rendering Works",
    9: "L9 Sulphur Deep",
  };
  for (const L of Object.keys(G.layers).sort((a, b) => a - b)) {
    const ps = G.layers[L];
    const edges = G.edgesByLayer[L] || [];
    const up = edges.filter((e) => e.kind === "up");
    const down = edges.filter((e) => e.kind === "down");
    console.log(`\n${LAYER_NAME[L] || "L" + L}  —  ${ps.length} rooms`);
    console.log(
      `  roles: ` +
        Object.entries(
          ps.reduce((a, p) => ((a[roleOf(p)] = (a[roleOf(p)] || 0) + 1), a), {})
        )
          .map(([k, v]) => `${v} ${k}`)
          .join(", ")
    );
    if (up.length)
      console.log(
        `  ↑ up:   ` + [...new Set(up.map((e) => `${e.from}→${e.to}(L${e.toL})`))].join(", ")
      );
    if (down.length)
      console.log(
        `  ↓ down: ` + [...new Set(down.map((e) => `${e.from}→${e.to}(L${e.toL})`))].join(", ")
      );
  }
  console.log(
    `\nTOTAL: ${Object.keys(P).length} passages, ${
      Object.values(G.edgesByLayer).flat().length
    } edges. Missing targets: ${G.missing.length}. (run with --json or --check)`
  );
}
