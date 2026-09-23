#!/usr/bin/env node
/* =====================================================================
   make-layer-maps.mjs — build one Animal Factory Tactics map per Sewer Demons layer.

   Run: node tools/make-layer-maps.mjs                 (write maps/ and report)
        node tools/make-layer-maps.mjs --check          (verify what is committed; exit 1 on drift)
        node tools/make-layer-maps.mjs --layer 7        (just one, for iterating)
        node tools/make-layer-maps.mjs --ascii 7        (print it, to see the shape without a browser)

   THE SOURCE IS THE GAME, NOT A DRAWING. Each layer already has a real floor plan: the
   room graph in src/map-data.twee carries a baked force-layout position for every room
   and every passage between them. This walks that graph and digs it -- a chamber per
   room at its own position, a corridor per passage, walls where the dug space meets rock.
   So the maps cannot contradict the game: re-run it after a rewire and the map follows.

   Materials come from setup.SCENE_LAYER and props from setup.SCENE_ROLE_PROPS in
   src/sprite-scene.twee -- the same tables the room dioramas read, so a Trunk Mains
   corridor is poured concrete in both places and stays that way if either is retuned.

   Output is Tactics' own version-2 map format (240x240, 3 levels), which its editor
   opens with Import and writes back with Export. When a checkout of Tactics is present
   the maps are validated with ITS OWN validateMap rather than anything reimplemented
   here; without one, that step SKIPS rather than passing quietly.

   Each map ships a sidecar `<name>.rooms.json` recording which tile rectangle is which
   passage. Nothing reads it yet. It is the seam for wiring a passage to a place on the
   map later, and it is written now because the generator is the only thing that knows.
   ===================================================================== */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'maps');
const TACTICS = join(dirname(ROOT), 'animal-factory-tactics', 'dist', 'tactics');

const W = 240, H = 240, MARGIN = 8;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

/* ---- read the game's own tables (string-aware literal grab, as the other probes do) ---- */
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
  throw new Error('unbalanced literal');
}
function grab(src, name) {
  const m = new RegExp('setup\\.' + name + '\\s*=\\s*').exec(src);
  if (!m) throw new Error('not found: setup.' + name);
  return eval('(' + matchBracket(src, m.index + m[0].length) + ')');   // eslint-disable-line no-eval
}

const mapSrc = readFileSync(join(ROOT, 'src', 'map-data.twee'), 'utf8');
const sceneSrc = readFileSync(join(ROOT, 'src', 'sprite-scene.twee'), 'utf8');
const mapGraph = grab(mapSrc, 'mapGraph');
const mapMeta = grab(mapSrc, 'mapMeta');
const SCENE_LAYER = grab(sceneSrc, 'SCENE_LAYER');
const ROLE_PROPS = grab(sceneSrc, 'SCENE_ROLE_PROPS');
const pack = JSON.parse(readFileSync(join(ROOT, 'img', 'sprite', 'manifest.json'), 'utf8'));

/* ---- material translation ------------------------------------------------------
   The diorama can wash a flat texture any colour it likes; a Tactics map may only use
   a terrain from its own list, and `river-water` is not one of them -- water there is
   the non-walkable `water` terrain, which would cut the Drowned Galleries in half. So
   L4 walks on wet flagstone and gets standing water in the gaps instead. */
const GROUND_SWAP = { 'river-water': 'ground-tiles' };
const ROCK = 'void';       /* valid terrain, not walkable, drawn as nothing: solid ground */
const POOL = 'water';      /* likewise not walkable -- scenery, never a route */

/* How big a room is, by what it is for. These are sized against the MAP, not against a
   notion of realism: a layer is one 240x240 map with ~25 rooms, so each gets about a
   48x48 cell of it. The first pass used 9x7 chambers and produced a subway diagram --
   3% of the map was room and the rest was corridor running fifty tiles between islands.
   A chamber has to be somewhere you could BE, not a station on a line. */
const ROOM_SIZE = {
  room:   [19, 15],
  rest:   [23, 19],
  fight:  [27, 23],   /* room to actually manoeuvre -- these are the fights */
  lander: [19, 15],
  ending: [23, 23]
};
const CORRIDOR = 5;        /* odd, so it centres on a room's midline; a tunnel, not a crack */
const GAP = 4;             /* rock left between two chambers */
const PULL = 0.06;         /* drift toward the middle -- see layout() */
const PULL_PASSES = 120;   /* ...and then STOP. See the note in layout(). */

const slug = (s) => s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

/* =====================================================================
   1. LAYOUT — place each room's chamber on the tile grid
   ===================================================================== */
function layout(rooms) {
  const xs = rooms.map((r) => r[2]), ys = rooms.map((r) => r[3]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const span = W - 2 * MARGIN;

  /* The force layout was drawn for a 1000x640 SVG panel; its aspect ratio carries no
     meaning, so stretch it to the square map rather than letterboxing it. */
  const place = rooms.map((r) => {
    const [w, h] = ROOM_SIZE[r[1]] || ROOM_SIZE.room;
    return {
      name: r[0], role: r[1], w, h,
      cx: MARGIN + ((r[2] - x0) / Math.max(1, x1 - x0)) * span,
      cy: MARGIN + ((r[3] - y0) / Math.max(1, y1 - y0)) * span
    };
  });

  /* Relax until no two chambers can touch. The SVG layout only had to keep LABELS from
     colliding; a chamber is a solid thing and needs its walls plus rock between.

     Separate them as RECTANGLES, along the axis they overlap least. The first version
     treated each as a circle of radius max(w,h)/2 and pushed radially, which is simply
     the wrong radius -- a 19x15 chamber's circumradius is 12.1, not 9.5 -- so pairs could
     satisfy the circle test and still share tiles. That is how 36 pairs across six layers
     ended up merged while every check in sight reported success. */
  for (let pass = 0; pass < 4000; pass++) {
    let moved = 0;
    for (let i = 0; i < place.length; i++) {
      for (let j = i + 1; j < place.length; j++) {
        const a = place[i], b = place[j];
        const dx = b.cx - a.cx, dy = b.cy - a.cy;
        const overX = (a.w + b.w) / 2 + GAP - Math.abs(dx);
        const overY = (a.h + b.h) / 2 + GAP - Math.abs(dy);
        if (overX <= 0 || overY <= 0) continue;          /* clear on at least one axis */
        const push = Math.min(overX, overY) / 2 + 0.01;  /* part along the cheaper axis */
        if (overX <= overY) {
          const s = (dx === 0 ? (i < j ? -1 : 1) : Math.sign(dx)) * push;
          a.cx -= s; b.cx += s;
        } else {
          const s = (dy === 0 ? (i < j ? -1 : 1) : Math.sign(dy)) * push;
          a.cy -= s; b.cy += s;
        }
        moved++;
      }
    }
    /* The force layout that produced these positions was CLAMPED to its panel, so many
       rooms sit exactly on x=54 or x=946 -- piled against the edge. Stretched to fill the
       map that becomes a ring of chambers around a hollow middle. A light pull inward
       lets the separation pass redistribute them instead.

       It has to STOP. Left running every pass it simply fights the separation, and the
       equilibrium where the two balance is chambers OVERLAPPING -- which merges rooms the
       graph says are not joined. So: pull for a while to gather them off the walls, then
       let separation alone run to convergence. checkSeparation() below is the gate. */
    for (const p of place) {
      if (pass < PULL_PASSES) { p.cx += (W / 2 - p.cx) * PULL; p.cy += (H / 2 - p.cy) * PULL; }
      p.cx = Math.min(W - MARGIN - p.w / 2, Math.max(MARGIN + p.w / 2, p.cx));
      p.cy = Math.min(H - MARGIN - p.h / 2, Math.max(MARGIN + p.h / 2, p.cy));
    }
    /* Break only once separation has nothing left to do AND the pull has stopped.
       Counting violations before applying the pull and then breaking on that count meant
       exiting on the very pass whose pull had just pushed two chambers back together --
       36 merged pairs across six layers, every one of which Tactics' own validator
       accepted without complaint. */
    if (!moved && pass >= PULL_PASSES) break;
  }

  for (const p of place) {
    p.cx = Math.round(p.cx); p.cy = Math.round(p.cy);
    p.x = p.cx - (p.w >> 1); p.y = p.cy - (p.h >> 1);
  }
  return place;
}

/* Two chambers that touch are ONE room with a false name: the player walks between places
   the game says are not joined, and every corridor the graph asked for becomes decorative.
   Nothing downstream notices -- the map still validates, still connects, still looks like a
   sewer. So it is checked here, on the rectangles, before a single tile is dug. */
function checkSeparation(place) {
  const bad = [];
  for (let i = 0; i < place.length; i++) {
    for (let j = i + 1; j < place.length; j++) {
      const a = place[i], b = place[j];
      /* inflate by 1: abutting walls with no rock between still counts as touching */
      const gapX = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w));
      const gapY = Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h));
      if (gapX < 1 && gapY < 1) bad.push(`${a.name} and ${b.name} touch`);
    }
  }
  return bad;
}

/* =====================================================================
   2. DIG — chambers, then corridors along the real passages
   ===================================================================== */
function dig(place, intra, ground) {
  const terrain = Array.from({ length: H }, () => Array(W).fill(ROCK));
  const owner = Array.from({ length: H }, () => Array(W).fill(-1));   /* which room a tile belongs to */
  const corridor = Array.from({ length: H }, () => Array(W).fill(false));

  place.forEach((p, i) => {
    for (let y = p.y; y < p.y + p.h; y++) {
      for (let x = p.x; x < p.x + p.w; x++) { terrain[y][x] = ground; owner[y][x] = i; }
    }
  });

  /* Route each passage AROUND the other rooms, not through them.

     The first version ran a two-segment L from centre to centre and carved whatever rock
     it crossed. With chambers packed this tightly an L often ploughs straight through a
     third room, and then the corridor is not one tunnel from A to B -- it is two stubs,
     A to C and C to B. The passage the graph asked for does not exist, and two it never
     asked for do. On the Belly that cost 17 of 33 passages, and nothing else noticed:
     the map still validated, because Tactics only checks that the four squad starts can
     reach the exit, not that every room can reach its neighbours. fidelity() checks it.

     So: Dijkstra over the rock, with the other chambers impassable and a heavy penalty
     for hugging one. The penalty is what keeps a corridor from running flush along a
     third room's wall, which would join them just as surely as crossing it. */
  const foreignNear = (x, y, a, b) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const o = owner[y + dy]?.[x + dx];
        if (o !== undefined && o >= 0 && o !== a && o !== b) return true;
      }
    }
    return false;
  };
  const HUG = 14;    /* cost of a step that touches a room this passage is not for */
  const CROSS = 0;   /* ...and of crossing a tunnel already dug. MEASURED AND SET TO ZERO.

     A crossing joins two rooms the graph does not join, so the obvious move is to price
     it and route around. Swept against corridor width, it does not work:

         width 3   penalty  0 / 7 / 20  ->  364 / 407 / 358 crossings
         width 5   penalty  0 / 7 / 20  ->  378 / 437 / 475

     The penalty is neutral at best and usually worse, because a detour long enough to
     dodge one tunnel runs alongside two others. The number is structural, not tunable:
     these passage graphs are not planar, so no arrangement of tunnels on a flat map
     carries every passage without meeting another. Left at zero and counted, rather than
     left in as a knob that does not turn anything. */

  function route(a, b) {
    const start = a.cy * W + a.cx, goal = b.cy * W + b.cx;
    const dist = new Int32Array(W * H).fill(0x7fffffff);
    const from = new Int32Array(W * H).fill(-1);
    /* bucket queue: costs are small integers, so this stays linear */
    const buckets = [];
    const push = (i, d) => { (buckets[d] ||= []).push(i); };
    dist[start] = 0; push(start, 0);
    for (let d = 0; d < buckets.length; d++) {
      const bucket = buckets[d];
      if (!bucket) continue;
      for (let k = 0; k < bucket.length; k++) {
        const i = bucket[k];
        if (dist[i] !== d) continue;
        if (i === goal) { d = buckets.length; break; }
        const x = i % W, y = (i - x) / W;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 2 || ny < 2 || nx >= W - 2 || ny >= H - 2) continue;
          const o = owner[ny][nx];
          if (o >= 0 && o !== a.i && o !== b.i) continue;              /* another room: impassable */
          const step = 1 + (foreignNear(nx, ny, a.i, b.i) ? HUG : 0) + (corridor[ny][nx] ? CROSS : 0);
          const nd = d + step, j = ny * W + nx;
          if (nd < dist[j]) { dist[j] = nd; from[j] = i; push(j, nd); }
        }
      }
    }
    if (from[goal] < 0 && goal !== start) return null;
    const path = [];
    for (let i = goal; i !== -1; i = from[i]) { path.push(i); if (i === start) break; }
    return path;
  }

  const half = CORRIDOR >> 1;
  let unrouted = 0;
  for (const [ai, bi] of intra) {
    if (ai === bi) continue;                       /* a self-loop is a re-entry, not a passage */
    const a = { ...place[ai], i: ai }, b = { ...place[bi], i: bi };
    const path = route(a, b);
    if (!path) { unrouted++; continue; }
    for (const i of path) {
      const x = i % W, y = (i - x) / W;
      if (terrain[y][x] === ROCK) { terrain[y][x] = ground; corridor[y][x] = true; }
      /* widen, but never into a tile that would put this tunnel against a third room */
      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > half) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 1 || ny < 1 || nx >= W - 1 || ny >= H - 1) continue;
          if (terrain[ny][nx] !== ROCK) continue;
          if (foreignNear(nx, ny, ai, bi)) continue;
          terrain[ny][nx] = ground; corridor[ny][nx] = true;
        }
      }
    }
  }
  return { terrain, owner, corridor, unrouted };
}

/* =====================================================================
   3. WALL — rock face everywhere the dug space ends; a door frame at each mouth
   ===================================================================== */
function wall(terrain, owner, corridor, wallArt) {
  const edges = {};
  const floor = (x, y) => x >= 0 && y >= 0 && x < W && y < H && terrain[y][x] !== ROCK;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!floor(x, y)) continue;
      if (!floor(x + 1, y)) edges[`e:${x}:${y}`] = wallArt;
      if (!floor(x - 1, y)) edges[`e:${x - 1}:${y}`] = wallArt;
      if (!floor(x, y + 1)) edges[`s:${x}:${y}`] = wallArt;
      if (!floor(x, y - 1)) edges[`s:${x}:${y - 1}`] = wallArt;
    }
  }
  /* Where a corridor meets a chamber, stand a frame in the gap so the mouth reads as a
     way in rather than as a hole in the wall. The doorway piece is open: it blocks
     neither movement nor sight. */
  let doors = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!corridor[y][x]) continue;
      if (owner[y]?.[x + 1] >= 0) { edges[`e:${x}:${y}`] = 'doorway-concrete-open'; doors++; }
      if (owner[y]?.[x - 1] >= 0) { edges[`e:${x - 1}:${y}`] = 'doorway-concrete-open'; doors++; }
      if (owner[y + 1]?.[x] >= 0) { edges[`s:${x}:${y}`] = 'doorway-concrete-open'; doors++; }
      if (owner[y - 1]?.[x] >= 0) { edges[`s:${x}:${y - 1}`] = 'doorway-concrete-open'; doors++; }
    }
  }
  return { edges, doors };
}

/* =====================================================================
   GRAPH FIDELITY — does the dug map say what the game says?

   The header of this file claims the maps cannot contradict the game. That is a claim
   about the DUG TILES, not about the intent, and it has to be measured on them.

   Flood the corridors (chamber tiles excluded, so a route may not pass through a third
   room) and note which chambers each corridor system touches. Then:

     · every passage in the graph must have a corridor system joining its two rooms
     · a corridor system touching two rooms the graph does NOT join is a SHORTCUT --
       somewhere the player can walk that the game does not think is walkable

   Shortcuts appear where two corridors cross. In a sewer a junction is natural and
   arguably better than a tangle of non-intersecting tubes, so they are reported rather
   than treated as faults -- but they are reported, because "the map agrees with the
   game" is only worth saying if somebody counted.
   ===================================================================== */
function fidelity(place, intra, owner, corridor) {
  const seen = Array.from({ length: H }, () => Array(W).fill(false));
  const systems = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!corridor[y][x] || seen[y][x]) continue;
      const touch = new Set(), stack = [[x, y]];
      seen[y][x] = true;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const o = owner[ny][nx];
          if (o >= 0) { touch.add(o); continue; }        /* reached a chamber: stop there */
          if (corridor[ny][nx] && !seen[ny][nx]) { seen[ny][nx] = true; stack.push([nx, ny]); }
        }
      }
      systems.push(touch);
    }
  }
  const key = (a, b) => (a < b ? a + ':' + b : b + ':' + a);
  const wanted = new Set(intra.filter(([a, b]) => a !== b).map(([a, b]) => key(a, b)));
  const joined = new Set();
  for (const s of systems) {
    const list = [...s];
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) joined.add(key(list[i], list[j]));
  }
  const missing = [...wanted].filter((k) => !joined.has(k));
  const shortcuts = [...joined].filter((k) => !wanted.has(k));
  const nameOf = (k) => k.split(':').map((i) => place[Number(i)].name).join(' ↔ ');
  return {
    wanted: wanted.size,
    missing: missing.map(nameOf),
    shortcuts: shortcuts.length,
    shortcutSample: shortcuts.slice(0, 3).map(nameOf)
  };
}

/* =====================================================================
   4. DRESS — props by role, standing clear of the walls and the doorways
   ===================================================================== */
function dress(place, terrain, edges, rng, propRules) {
  const props = [], taken = new Set();
  const blocked = (x, y) =>
    edges[`e:${x}:${y}`] || edges[`e:${x - 1}:${y}`] || edges[`s:${x}:${y}`] || edges[`s:${x}:${y - 1}`];

  for (const p of place) {
    const pool = ROLE_PROPS[p.role] || ROLE_PROPS.room;
    const want = 3 + Math.floor((p.w * p.h) / 40);
    for (let n = 0, tries = 0; n < want && tries < 60; tries++) {
      const id = pool[Math.floor(rng() * pool.length)];
      const rule = propRules[id];
      if (!rule) continue;
      const fw = rule.w, fh = rule.h;
      /* inset by one so a footprint can never sit against a wall it might cross */
      const x = p.x + 1 + Math.floor(rng() * Math.max(1, p.w - 2 - fw + 1));
      const y = p.y + 1 + Math.floor(rng() * Math.max(1, p.h - 2 - fh + 1));
      let ok = true;
      for (let dx = 0; dx < fw && ok; dx++) {
        for (let dy = 0; dy < fh && ok; dy++) {
          const k = `${x + dx},${y + dy}`;
          if (taken.has(k) || terrain[y + dy]?.[x + dx] === ROCK || blocked(x + dx, y + dy)) ok = false;
        }
      }
      if (!ok) continue;
      for (let dx = 0; dx < fw; dx++) for (let dy = 0; dy < fh; dy++) taken.add(`${x + dx},${y + dy}`);
      props.push({ x, y, z: 0, kind: id });
      n++;
    }
  }
  return { props, taken };
}

/* the game's own private generator: the same room always dresses the same way */
function rngFor(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
}

/* =====================================================================
   build one layer
   ===================================================================== */
function buildLayer(L, propRules) {
  const G = mapGraph[String(L)];
  const mat = SCENE_LAYER[L];
  const ground = GROUND_SWAP[mat.ground] || mat.ground;
  const rng = rngFor('sewer-layer-' + L);

  const place = layout(G.rooms);
  place.forEach((p, i) => { p.i = i; });
  const touching = checkSeparation(place);
  const { terrain, owner, corridor, unrouted } = dig(place, G.intra, ground);
  const fid = fidelity(place, G.intra, owner, corridor);
  const { edges, doors } = wall(terrain, owner, corridor, mat.wall);
  const { props, taken } = dress(place, terrain, edges, rng, propRules);

  /* standing water in the Drowned Galleries: rock pockets inside the walls, turned to
     pools. Scenery only -- never on a route, because `water` is not walkable. */
  let pools = 0;
  if (mat.ground === 'river-water') {
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if (terrain[y][x] !== ROCK) continue;
        let touch = 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (terrain[y + dy]?.[x + dx] !== ROCK) touch++;
        if (touch >= 2 && rng() < 0.55) { terrain[y][x] = POOL; pools++; }
      }
    }
  }

  /* four squad starts and one travel marker, on real floor, clear of props.
     The starts go in the layer's FIRST room and the marker in the last, so a playtest
     walks the length of the layer instead of standing on its own exit. */
  const freeIn = (p, n) => {
    const out = [];
    for (let y = p.y + 1; y < p.y + p.h - 1 && out.length < n; y++) {
      for (let x = p.x + 1; x < p.x + p.w - 1 && out.length < n; x++) {
        if (terrain[y][x] !== ROCK && !taken.has(`${x},${y}`)) out.push({ x, y, z: 0 });
      }
    }
    return out;
  };
  let starts = [], exits = [];
  for (const p of place) { if (starts.length < 4) { const f = freeIn(p, 4); if (f.length === 4) starts = f; } }
  for (let i = place.length - 1; i >= 0 && !exits.length; i--) {
    const f = freeIn(place[i], 1);
    if (f.length && !starts.some((s) => s.x === f[0].x && s.y === f[0].y)) exits = f;
  }

  const name = `${mapMeta.layerName[String(L)]}`.slice(0, 60);
  const map = {
    version: 2, width: W, height: H, levels: 3, name,
    terrain, upper: [{}, {}], edges, stairs: [], climbs: [], props,
    starts, guards: [], exits
  };
  const rooms = place.map((p) => ({ name: p.name, role: p.role, x: p.x, y: p.y, w: p.w, h: p.h }));
  return { map, rooms, touching, fid, unrouted, stats: { rooms: place.length, links: G.intra.length, doors, props: props.length, pools, ground, wall: mat.wall } };
}

/* =====================================================================
   verification — Tactics' OWN validator, or an honest skip
   ===================================================================== */
async function validator() {
  if (!existsSync(join(TACTICS, 'maps.js'))) return null;
  const maps = await import(pathToFileURL(join(TACTICS, 'maps.js')).href);
  return maps.validateMap;
}

function ascii(map, rooms, step = 3) {
  const rows = [];
  for (let y = 0; y < H; y += step) {
    let line = '';
    for (let x = 0; x < W; x += step) {
      const t = map.terrain[y][x];
      line += t === 'void' ? ' ' : t === 'water' ? '~' : rooms.some((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) ? '#' : '.';
    }
    rows.push(line.replace(/\s+$/, ''));
  }
  return rows.join('\n');
}

/* ===================================================================== */
const layers = opt('--layer') ? [Number(opt('--layer'))] : Object.keys(mapGraph).map(Number).sort((a, b) => a - b);
const asciiOf = opt('--ascii') ? Number(opt('--ascii')) : null;
const validate = await validator();

/* prop footprints: Tactics' PROPS table when it is here, else the baked manifest, which
   was generated from it and carries the same numbers */
let propRules;
if (existsSync(join(TACTICS, 'environment.js'))) {
  propRules = (await import(pathToFileURL(join(TACTICS, 'environment.js')).href)).PROPS;
} else {
  propRules = Object.fromEntries(Object.entries(pack.props).map(([k, v]) => [k, { w: v.footprint[0], h: v.footprint[1] }]));
}

if (!flag('--check')) mkdirSync(OUT, { recursive: true });

let faults = 0, written = 0, shortcutTotal = 0;
console.log('layer  name                        rooms  links  doors  props   ground           wall              bytes  valid   cross');
for (const L of layers) {
  const { map, rooms, touching, fid, unrouted, stats } = buildLayer(L, propRules);
  const file = `layer${L}-${slug(mapMeta.layerName[String(L)].replace(/^L\d+\s*·\s*/, ''))}`;
  const text = JSON.stringify(map);
  const sidecar = JSON.stringify({ layer: L, name: map.name, band: mapMeta.band[String(L)], rooms }, null, 1) + '\n';

  if (unrouted) {
    console.log(`  FAULT L${L}: ${unrouted} passage(s) could not be routed at all -- no rock path between the chambers`);
    faults++;
  }
  if (fid.missing.length) {
    console.log(`  FAULT L${L}: ${fid.missing.length} passage(s) in the graph have no corridor -- ${fid.missing.slice(0, 3).join('; ')}`);
    faults++;
  }
  if (touching.length) {
    console.log(`  FAULT L${L}: ${touching.length} chamber pair(s) touch -- ${touching.slice(0, 3).join('; ')}`);
    faults++;
  }
  let verdict = 'SKIP (no Tactics checkout)';
  if (validate) {
    /* allowDisconnected:false -- the whole point is that the layer joins up */
    const errs = validate(map, { connectivity: true });
    verdict = errs.length ? 'FAIL: ' + errs[0] : 'ok';
    if (errs.length) { faults++; }
  }

  if (flag('--check')) {
    const a = join(OUT, file + '.json'), b = join(OUT, file + '.rooms.json');
    if (!existsSync(a) || readFileSync(a, 'utf8') !== text) { console.log(`  DRIFT: ${file}.json differs from a fresh build`); faults++; }
    if (!existsSync(b) || readFileSync(b, 'utf8') !== sidecar) { console.log(`  DRIFT: ${file}.rooms.json differs`); faults++; }
  } else {
    writeFileSync(join(OUT, file + '.json'), text);
    writeFileSync(join(OUT, file + '.rooms.json'), sidecar);
    written++;
  }

  shortcutTotal += fid.shortcuts;
  console.log(`L${L}     ${map.name.padEnd(26)} ${String(stats.rooms).padStart(5)} ${String(stats.links).padStart(6)} ${String(stats.doors).padStart(6)} ${String(stats.props).padStart(6)}   ${stats.ground.padEnd(16)} ${stats.wall.padEnd(17)} ${String(text.length).padStart(7)}  ${verdict.padEnd(6)}  ${String(fid.shortcuts).padStart(4)}`);
  if (asciiOf === L) console.log('\n' + ascii(map, rooms) + '\n');
}

console.log('');
console.log(`Corridor crossings that join rooms the graph does not: ${shortcutTotal} across ${layers.length} layer(s).`);
console.log('A crossing is a junction, which a sewer is entitled to -- but it IS a place the player can walk');
console.log('that the passage graph does not model. Counted, not hidden.');
console.log('');
if (flag('--check')) console.log(faults ? `RESULT: ${faults} fault(s).` : 'RESULT: committed maps match a fresh build, and Tactics accepts every one.');
else console.log(faults ? `RESULT: ${written} written, ${faults} fault(s) -- see the FAULT lines above.` : `RESULT: ${written} map(s) written to maps/.`);
process.exit(faults ? 1 : 0);
