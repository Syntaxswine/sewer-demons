# Sewer Demons

A Twine / **SugarCube** interactive horror game. You're trapped in a sewer with
demons who want to corrupt you. Find the way out — *without losing yourself*.

The hook is a **state-driven soundtrack**: instead of a baked playlist, the
music re-evaluates game state at every track boundary, so anything you've done
(crossed a corruption threshold, met a demon) reshapes what plays next.

Rooms are drawn as small **isometric sprite dioramas** above their prose -- the floor,
the walls and what is lying about, in the materials of the layer you are on and washed
to its band. 197 of the 213 mapped rooms get one without a line of per-room authoring;
the 16 with a hand-drawn illustration keep it. See [`art/SPRITES.md`](art/SPRITES.md)
for the art contract and the provenance, and [`art/CHARACTER-SPRITES.md`](art/CHARACTER-SPRITES.md)
for the open art job -- there are no character sprites yet, and the game is built to want them.

Each of the nine layers is also dug out as **one tile map** in the same game's editor
format -- a chamber per room, a corridor per passage, generated from the room graph so it
cannot drift from the real passages. See [`maps/README.md`](maps/README.md), and
[`maps/preview/all-layers.png`](maps/preview/all-layers.png) for all nine at a glance.
Nothing in the game reads them yet.

**Agents / new contributors: start with [`docs/HANDOFF.md`](docs/HANDOFF.md)** —
it has the toolchain, the SugarCube gotchas, every system, and the backlog.

See also [`docs/GAME-SPEC.md`](docs/GAME-SPEC.md) (original brief),
[`docs/MAP-ARCHITECTURE.md`](docs/MAP-ARCHITECTURE.md) (the 9-layer map bible), and
[`docs/RESEARCH-demonology-filth.md`](docs/RESEARCH-demonology-filth.md) (grounding research).

## Layout

```
src/sewer-demons.twee        Core: systems, intro, hellmouth, combat, endings
src/layer2-trunk-mains.twee  L2 Trunk Mains (one .twee per layer going forward)
src/layer3-old-drains.twee   L3 The Old Drains (the hinge layer)
src/sprite-scene.twee        The room diorama: renderer + the tables it derives from
src/sprite-data.twee         GENERATED sprite manifest (tools/prepare-sprites.py)
src/map-data.twee            GENERATED room graph (tools/passage-graph.mjs)
img/sprite/                  The sprite pack: grounds, props, wall/door edges
maps/                        One tile map per layer, dug from the room graph
img/enemy/ img/room/         Hand-drawn combat portraits and room illustrations
art/SPRITES.md               The sprite contract, provenance, and what is still missing
audio/                       .mp3 tracks (see audio/README.md; none committed yet)
dist/                        Compiled HTML output (git-ignored)
.tools/                      Vendored Tweego + SugarCube format (git-ignored)
docs/                        SPEC, HANDOFF, MAP-ARCHITECTURE, RESEARCH
```

## History

This repo starts at a single squashed commit. The game was built local-only over 190
commits between 2026-06-03 and 2026-09-22; when it was opened to the public the owner
chose a fresh history, so that archive stays on a local branch and was never pushed.

## Build & run

The source is **Twee3** notation, which keeps the game diff-friendly in git.
Two ways to turn it into a playable HTML file:

### Option A — Tweego (CLI, recommended for this repo)

[Tweego](https://www.motoslave.net/tweego/) compiles `.twee` → `.html`.

```sh
# one-time: install SugarCube format into tweego's storyformats dir, then:
tweego -o dist/sewer-demons.html src/
```

Open `dist/sewer-demons.html` in a browser.

### Option B — Twine app

In the Twine desktop/web app: **Library → Import → From File**, choose
`src/sewer-demons.twee`. Set the story format to **SugarCube 2.37.x** if asked.

## Status

Playable vertical slice (~73 passages). Built: the kidnap intro → **hellmouth**
→ hell town (market/tavern with a mixed coin/pay-with-yourself economy) → a
**combat** system → the rope-gated sewer escape → multiple state-keyed endings.
Systems in place: state-driven audio chooser, **visible corruption meter** (reads
as physical filth), a **9-layer** map model with per-layer **gates / rest / snares
(bad ends)**, a **sigil meta-puzzle** scaffold, and **cross-life marks** that persist
between playthroughs and unlock new endings. **L2 (Trunk Mains)** and **L3 (The Old
Drains)** are built out fully (~20 rooms each).

Audio runs **silent** (no mp3s committed yet; the chooser guards against missing
tracks). Local-only repo — no GitHub remote. See [`docs/HANDOFF.md`](docs/HANDOFF.md)
for the full picture and the backlog.
