# Layer maps

One map per layer — nine tile maps in **Animal Factory Tactics'** version-2 format
(240 × 240, three levels), which its editor opens with **Import** and writes back with
**Export**.

| | |
|---|---|
| Maps | `layerN-<name>.json` — the map itself |
| Room index | `layerN-<name>.rooms.json` — which tile rectangle is which passage |
| Preview | `preview/layerN-<name>.png`, and `preview/all-layers.png` |
| Generator | `../tools/make-layer-maps.mjs` |
| Previewer | `../tools/preview-layer-maps.py` |

```
node tools/make-layer-maps.mjs              # rebuild all nine
node tools/make-layer-maps.mjs --layer 7    # just one, while iterating
node tools/make-layer-maps.mjs --ascii 7    # see its shape without a browser
node tools/make-layer-maps.mjs --check      # verify the committed maps; exit 1 on drift
python tools/preview-layer-maps.py --sheet  # redraw the floorplans
```

## The source is the game, not a drawing

Nothing here was placed by hand. Each layer already had a floor plan: the room graph in
`src/map-data.twee` carries a baked position for every room and every passage between
them, and `tools/passage-graph.mjs --embed` regenerates it from the real passages on every
build. The generator walks that graph and digs it — a chamber per room at its own
position, a corridor per passage, walls where the dug space meets rock.

Materials come from `setup.SCENE_LAYER` and props from `setup.SCENE_ROLE_PROPS` in
`src/sprite-scene.twee` — the same tables the room dioramas read, so a Trunk Mains
corridor is poured concrete in both places and stays that way if either is retuned.

| layer | rooms | passages | floor | wall |
|---|---:|---:|---|---|
| L1 Storm Drains | 23 | 29 | asphalt — the street is the ceiling | brick |
| L2 Trunk Mains | 25 | 30 | concrete | concrete |
| L3 Old Drains | 23 | 29 | dirt — cut-and-cover | brick |
| L4 Drowned Galleries | 26 | 34 | wet flagstone, standing water in the gaps | brick |
| L5 Hellmouth | 4 | 3 | concrete | concrete |
| L6 Shambles | 29 | 39 | glazed tile | corrugated — hell builds in sheet metal |
| L7 Belly of the Beast | 28 | 33 | dirt | brick *(should be flesh — see `art/SPRITES.md`)* |
| L8 Rendering Works | 24 | 31 | concrete | corrugated |
| L9 Sulphur Deep | 23 | 30 | gravel — ash and crust | concrete |

L5 is four rooms in a line because the Hellmouth *is* four rooms in a line. The maps are
as odd as the layers are.

## What is checked

Three gates, each catching something the others do not:

1. **Tactics' own `validateMap`**, imported from a checkout of that repo rather than
   reimplemented — terrain keys, edge keys, prop footprints on supported floor, four
   starts and one travel marker, and reachability between them. Without that checkout the
   step prints `SKIP` rather than passing quietly.
2. **Chamber separation.** Two chambers that touch are one room with a false name. The
   first version separated them as circles of radius `max(w,h)/2`, which is the wrong
   radius — a 19 × 15 chamber's circumradius is 12.1, not 9.5 — so 36 pairs across six
   layers merged, and *every other check reported success.* They are separated as
   rectangles now, and the touch test runs on the rectangles before a tile is dug.
3. **Graph fidelity.** Every passage in the graph must have a corridor joining its two
   rooms, where "joining" means a tunnel that does not pass through a third chamber. The
   first router ran an L from centre to centre and carved the rock it crossed; packed this
   tightly, an L often ploughs through a third room, leaving two stubs instead of one
   tunnel. That cost **17 of 33 passages on the Belly** — and the map still validated,
   because Tactics only checks that the squad starts can reach the exit, not that every
   room can reach its neighbours. Corridors are routed around other chambers now.

## The honest number: 378 crossings

Where two corridors meet they make a junction, and a junction joins two rooms the passage
graph does not join. Across the nine layers there are **378** such pairs.

This was treated as a defect and priced — route around a tunnel already dug — and then
measured, which is the only reason it is written down as a finding rather than a fix:

| | penalty 0 | 7 | 20 |
|---|---:|---:|---:|
| corridor width 3 | 364 | 407 | 358 |
| corridor width 5 | 378 | 437 | 475 |

The penalty is neutral at best and usually worse: a detour long enough to dodge one tunnel
runs alongside two others. **The number is structural.** These passage graphs are not
planar, so no arrangement of tunnels on a flat map carries every passage without meeting
another. The knob was set back to zero rather than left in as a control that controls
nothing.

For a sewer, junctions are right — a drain system is junctions. But it does mean the map
is more connected than the game: **a map is not yet a substitute for the passage graph**,
because the graph is where the gates live (a locked way, a one-way drop, a corruption
toll). If these maps ever carry navigation, that has to be reckoned with first — either by
building the layer on more than one level so crossings can pass over each other, or by
marking junction tiles as impassable in the directions the graph does not allow.

## Not a build gate, on purpose

`--check` exists and is fast (half a second for all nine) but `build.ps1` does **not** run
it. Nothing reads these maps yet, and a gate that fails the build whenever someone edits a
passage would block the writing — which is the work this repo is actually for — to protect
an asset no player can reach. Run `--check` and regenerate when the room graph changes;
promote it to a gate the day the maps become load-bearing.

## Editing by hand

Import a map in the Tactics editor, change it, Export. The export is authoritative from
that point for that file — but the next `make-layer-maps.mjs` run will overwrite it, so
either keep hand edits in the generator or move the file out of `maps/` first. There is no
merge between the two and pretending otherwise would lose work.
