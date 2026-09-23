# Direction: rebuild Sewer Demons on the Tactics engine

**Owner decision, 2026-09-23.** Sewer Demons stops being a Twine game. It is rebuilt on the
**Animal Factory Tactics** engine (in-game name *Red Shift*, `Syntaxswine/animal-factory`,
branch `tactics-prototype`), carrying its own art and its own story.

This file is the direction. It does not decide the design; it records what the decision
means, what already exists that carries over, what dies, and the questions that have to be
answered before anyone writes a line of the new thing.

---

## What the engine is

About 4,000 lines of ES modules under `dist/tactics/`, plus ~2,000 lines of design docs in
`docs/tactics/`. Turn-based squad tactics on a 240 × 240 isometric tile map:

- sight cones, line of sight, cover, windows and doors that block differently
- aimed shots by body location — **head, weapon, torso, legs**
- overwatch, stances, turn order, projectiles, explosives, ground fire
- spatial 4 × 4 backpacks with two ready slots
- downed / stabilised / dead injury states, XP levels to 10
- an overmap of 10 × 10 sectors, a map editor and a placement editor

It is a complete, working game loop. That is the point of the decision: Sewer Demons has
spent its life hand-rolling combat, movement and a fog-of-war map out of passage links, and
all of it already exists here, better.

---

## What carries over unchanged

Most of the recent work was, by accident, already aimed at this target — it was done in the
engine's own formats because the brief was "in the 2D sprite style of Animal Factory
Tactics". None of it needs redoing.

| | |
|---|---|
| **The nine layer maps** | `maps/layerN-*.json` — already the engine's native version-2 format, already accepted by its own `validateMap` with connectivity, already openable in its editor. A chamber per room, a corridor per passage, dug from the passage graph. |
| **The environment sprite pack** | `img/sprite/` — 6 grounds, 33 props, 13 wall/door/fence edges, imported from the engine's own art with its own world-scale calibration transcribed rather than re-derived. |
| **The painted bestiary** | `img/sprites/enemy/` — ten creatures at the engine's 1254 × 1254 source frame, generated against its painted style. They become its characters directly. |
| **The tooling** | `tools/make-layer-maps.mjs`, `tools/prepare-sprites.py`, `tools/preview-layer-maps.py`, and the gates in them. |
| **The art contract** | `art/SPRITES.md`, `art/CHARACTER-SPRITES.md` — written to the engine's frame, anchor, lighting and scale rules. |

## What dies

- The SugarCube runtime, and passages-as-navigation.
- `src/sprite-scene.twee`, the `<<scene>>` widget, the `.room-scene` CSS, `src/sprite-data.twee`.
  The room diorama existed to give a prose game a picture of a place; the engine draws the
  place natively and you stand in it.
- `setup.mapView` — the fog-of-war map screen. The engine has an overmap.
- The hand-rolled D&D combat: `setup.enemies` stat blocks, `setup.ENEMY_MOVES`, morale,
  parley, the crit-smear. All of this becomes engine units and engine rules. **The design
  intent behind them does not die** — see below.

## What carries over as content, and needs translating

This is the actual work, and it is mostly writing and data, not engine code.

| from the Twine game | to the engine |
|---|---|
| 245 passages of prose across 9 layers | room and event text on the maps; the layer maps already carry a room index naming which tile rectangle is which passage (`maps/*.rooms.json`) |
| 14 enemies with `statLevel`/`hd`/`weaponDie` | engine units — species, archetype, personality, weapon |
| 69-item gear catalog (weapons, armour, accessories, grafts, consumables) | engine inventory; the backpack is spatial, so item *shape* becomes a real design axis it never had |
| the belonging/seal economy, jobs, addictions, curses | engine progression and world state |
| 46 NPCs | engine actors or event text |
| the endings | engine win/lose conditions |

---

## The design questions that have to be answered first

Naming them rather than answering them. Each one changes what gets built.

**1. Solo horror against squad tactics.** This is the big one. Sewer Demons is one person
alone in a sewer; the engine is a four-person squad with `starts.length !== 4` a hard
validation error. Either the game becomes a squad game — a press-ganged work gang, a
party of the damned, which the fiction can absolutely support — or the engine's squad
assumption gets relaxed. They are very different games. **Decide this before anything.**

**2. Corruption has a natural home, and it is a good one.** The engine already aims shots
at *head, weapon, torso, legs*. Sewer Demons already tracks corruption per body
segment — `head · torso · armL · armR · legL · legR` × three mutagen classes × four stages,
a 72-cell matrix with written prose for every cell. These two systems are asking to be the
same system: a limb that takes a hit is a limb that changes. That is a better mechanic than
either game has today, and it is the strongest argument that this port is the right idea.

**3. The weapons do not match.** The engine's catalog is pistols, rifles, assault rifles,
flamethrowers, RPGs. Sewer Demons stops at the steel maul: daggers, hooks, spears, swords,
axes, hammers. Melee in a sight-cone game with overwatch is a real design problem, not a
reskin — closing distance has to be survivable or every fight is lost before it starts.

**4. How much of the writing survives?** The prose is the best thing in the Twine game and
the reason it is worth porting at all. Room-scent, the transformation feed, the regard
system and the damned-voice NPCs are all built on *reading a passage*. A tactics game shows
you a room instead of describing it. Decide what becomes ambient text, what becomes an
event, and what is simply lost — and be honest that some of it is lost.

**5. Where the new thing lives.** The engine is in a **private** repo; Sewer Demons is
**public**. Copying the engine into this repo publishes it. That is a one-way action and
the owner's call, not a build decision. Options: build in the private repo; build in a new
private repo; make the whole thing public deliberately. **Unresolved — do not copy the
engine anywhere until this is answered.**

---

## The order of work, once those are answered

1. Settle question 1 (solo or squad) and question 5 (where it lives).
2. Stand the engine up with a Sewer Demons skin: the nine maps, the environment pack, the
   painted bestiary. This is close to free — the assets are already in its formats.
3. Replace the farm cast: `SPECIES`, `recruits.js`, `archetypes.js`, `personalities.js`,
   `progression.js` and the character art modules are where the farm lives.
4. Build the corruption system onto the engine's hit locations (question 2).
5. Solve melee (question 3).
6. Port the content layer by layer, starting at L1, using `maps/*.rooms.json` to know which
   passage belongs to which room.

The Twine game stays in this repo as the **source of record** for story, bestiary, gear and
the corruption model. It is 190 commits of design that the rebuild reads from. Do not delete
it, and do not try to keep it running in parallel — it is a reference now, not a build.
