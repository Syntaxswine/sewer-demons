# Sewer Demons

A Twine / **SugarCube** interactive horror game. You're trapped in a sewer with
demons who want to corrupt you. Find the way out — *without losing yourself*.

The hook is a **state-driven soundtrack**: instead of a baked playlist, the
music re-evaluates game state at every track boundary, so anything you've done
(crossed a corruption threshold, met a demon) reshapes what plays next.

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
audio/                       .mp3 tracks (see audio/README.md; none committed yet)
dist/                        Compiled HTML output (git-ignored)
.tools/                      Vendored Tweego + SugarCube format (git-ignored)
docs/                        SPEC, HANDOFF, MAP-ARCHITECTURE, RESEARCH
```

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
