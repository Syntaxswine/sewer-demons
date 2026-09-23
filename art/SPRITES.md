# The sprite pack

Sewer Demons draws a small isometric **diorama** above each room's prose — the floor, the
walls, and what is lying about. 197 of the 213 mapped rooms get one; the other 16 keep a
hand-drawn `<<roomart>>` illustration, which wins wherever it exists.

The art, the projection and the placement rules come from **Animal Factory Tactics**
(`Syntaxswine/animal-factory`, branch `tactics-prototype`) — the same owner's game, whose
2D sprite look this one was asked to adopt. What was adopted is a *format and a
calibration*, not a subject: painterly 3/4-isometric props on a 2:1 tile, lit from the
upper left, each drawn to a world size that keeps a barrel and a doorway in the same
world. What was **not** adopted is its palette. Tactics is a farm at noon; this is a
sewer, so every scene gets a band wash (`setup.SCENE_GRADE`) before it reaches the page.

| | |
|---|---|
| Runtime sprites | `img/sprite/{ground,prop,edge}/` — 6 grounds · 33 props · 13 edges |
| Manifest | `img/sprite/manifest.json` (tooling) and `src/sprite-data.twee` (the game) |
| Importer | `tools/prepare-sprites.py` |
| Renderer | `src/sprite-scene.twee` |
| Verifier | `tools/scene-probe.mjs` |
| Provenance | the `GROUNDS` / `PROPS` / `EDGES` tables in the importer, one `use` note each |

A Twine game is one HTML file that people open off a disk, where `fetch()` is blocked, so
the manifest is baked into the story as well as written to JSON. Both come out of the same
run of the importer and `--check` fails the build if they drift.

---

## The contract

**Frame.** 1254 × 1254 PNG, transparent, the object filling the frame. Don't pre-crop or
pre-scale: the importer measures the alpha ≥ 64 bounds and scales to the calibrated box
itself, and it reproduces Tactics' own catalogued crops on all 33 imported props to the
pixel (`python tools/prepare-sprites.py --selftest`).

**Projection.** 3/4 isometric on a 56 × 28 tile — a 2:1 diamond. A prop sits on the
bottom-centre of its tile group. Ground textures are flat **overhead** squares that tile;
the renderer skews them onto the diamond.

**Light.** From the upper left, baked in. Every piece has to agree, or a room lit from two
directions falls apart. Mirroring a piece reverses its lighting, so the renderer never
mirrors.

**World size.** Declared, not drawn. A prop's drawn box at zoom 1 is
`(w+h)*25` wide by `(w+h)*11 + 18` tall — `+43` instead of `+18` if it is `tall` — where
`w,h` is its tile footprint. Walls, windows and doors stand 72 px; jail bars 62; a railing
20. **These numbers are Tactics', transcribed.** Do not retune one to make a single piece
look better: it is the only thing keeping the set to one scale, and a drift shows up as a
barrel taller than a door long after anyone remembers why.

**Edges** (walls, fences, doors, bars) additionally need a `baseline` — `[x0, y0, x1, y1,
height]`, the two ends of the piece's ground line in source pixels and how tall it stands
there. The renderer shears the art onto a tile edge with it. For a slab drawn square to
the tile the importer measures a default; anything drawn on a slant needs the quad written
out by hand, and the giveaway is a wall that floats off its own floor.

---

## Adding a sprite

1. Save the PNG at `art/source/prop/<id>.png` (or `art/source/edge/<id>.png`).
2. Add one line to `LOCAL_PROPS` / `LOCAL_EDGES` in `tools/prepare-sprites.py`, with
   `crop: None` to have it measured. Keep new art in the `LOCAL_*` tables — the tables
   above them are transcriptions of somebody else's calibration, and a local drawing added
   there would be silently reverted the next time the Tactics art is re-imported.
3. `python tools/prepare-sprites.py`
4. Reference the id from `setup.SCENE_ROOM` or a `SCENE_ROLE_PROPS` pool in
   `src/sprite-scene.twee`.
5. `.\build.ps1` — `scene-probe.mjs` fails the build if an id does not resolve, because a
   mistyped one draws *nothing* and nobody notices an empty corner of a picture.

---

## What is still missing

Everything below needs to be drawn. I could not make it in-session: producing painterly
art in this style needs image generation, which I had no tool for. The format, the
pipeline, the renderer, the verifier and the wiring are all finished and waiting, so each
item here is a drop-in — nothing downstream needs writing again.

### 1. Characters — the largest gap, and the one the game is built for

There are **no character sprites at all**. The diorama deliberately leaves its front row
empty for them, and combat still uses the old flat portrait boxes.

Match Tactics' character sheets: **192 × 256 transparent frames, ground anchor (96, 244),
facing screen-right**, full body, same painterly hand as the props.

*The player* is the interesting one. Corruption in this game is per **body segment** —
`head · torso · armL · armR · legL · legR` — times three mutagen classes (rat / pig /
filth) times four stages (`tingle · tainted · turning · turned`). The prose already reads
from that 72-cell matrix (`setup.BODY_DESC`), so the sprite should too: a **layered
paper-doll**, one image per segment per class per stage, composited in draw order. That is
13 variants per segment (human plus 3 × 4) — 78 images — and it is what makes the game's
central mechanic something you watch happen to a body rather than read about.

If 78 is too many for a first pass, the useful subset is `turned` for all six segments in
all three classes (18 images) plus a clean human set (6): 24 images buys a body that
visibly changes, with the two middle stages cross-faded until they are drawn.

*The bestiary* is 15 enemies, ids from `setup.enemies`: `rat · ratman · shitgolem ·
crawler · drowned · kappa · grafted · gorger · pigdemon · pig_pressgang · glut ·
shortweight · shadowperson · smokewisp`. Eleven of them already have a portrait in
`img/enemy/` — 896 × 1344 Doré-style engravings, worth looking at first, since they are
the design of record even though the new sprites are painted rather than hatched. Poses
wanted: `idle`, `attack`, `down`.

### 2. Props a farm never had

Priority order — the first four are the ones whose absence is most visible today, because
rooms that should be unmistakable are currently furnished out of the same crate-and-barrel
pool as everywhere else.

| id | what | why |
|---|---|---|
| `pipe-mouth` | a brick or iron outfall mouth, man-high | the single most sewer-ish object there is, and there is nothing like it |
| `grate-floor` | a storm grate / manhole ring, flat, ground-layer | L1 is named for them |
| `channel-run` | a sewage channel with a walkway beside it | the basic shape of a trunk main; every L2 room implies one |
| `wall-flesh` | the Belly's wall — muscle and gut, not masonry | L7 currently draws Victorian brick, which is simply wrong |
| `sluice-gate` | a valve gate with a hand wheel | the Sluice, the Black Valve, the Valve Puzzle |
| `fatberg` | a congealed grease mass | there is a hand-drawn one; a prop version would let it appear elsewhere |
| `meat-hooks` | a rail of hanging hooks | L8, The Hooks |
| `rendering-vat` | a tallow cauldron over a fire | L8, The Vat, the Boil House |
| `stall-canvas` | a carnival stall with striped awning | L6 is a whole carnival built from corrugated sheet |
| `wheel-fortune` | the gambling wheel | The Wheel is a named room and a mechanic |
| `brimstone-vent` | a fumarole with sulphur crust | L9 is nine kinds of vent |
| `ground-sulphur` | yellow crusted ground texture | L9 borrows gravel today |
| `ground-flesh` | a living floor | L7 borrows dirt today |
| `ground-sewage` | flowing filth, tiling | L4 borrows river water, which is far too clean |

### 3. Surfaces not yet wired

The scene system covers rooms. Still on flat art:

- **Combat** — the portrait boxes in `.combat-screen` are `background-size: cover` images.
  They should become a sprite stage: player and enemies on a ground line, in the room's own
  materials. Needs characters first.
- **The map screen** — `setup.mapView` draws rooms as coloured SVG rectangles. Role-keyed
  sprite icons would carry the same information with the same vocabulary as the rooms.

---

## Reproducing the import

```
python tools/prepare-sprites.py --from ../animal-factory-tactics
```

Requires Pillow and a checkout of the Tactics repo. The committed sprites are the
deliverable — a clone without that private repo builds and plays normally, and
`--check` reports `SKIP` rather than failing.
