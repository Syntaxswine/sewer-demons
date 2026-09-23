# Character & creature sprites — what needs drawing

Sewer Demons has a working sprite layer and **no characters in it**. Rooms draw themselves;
the thing standing in the room does not exist. This file is the work order.

Three documents, three jobs — don't merge them:

| | |
|---|---|
| `docs/BESTIARY-ART.md` | **what each creature IS.** Written from the encounter prose, eight creatures deep. The design of record. Read it before drawing any of the eight it covers. |
| `art/SPRITES.md` | **the format and the pipeline.** Frame, projection, world-scale rule, how a finished file gets into the game. |
| *this file* | **the work order.** Who exists, what state their art is in, what poses are wanted, what they have to be the size of, and in what order to do it. |

Everything downstream is finished and waiting: the renderer, the manifest, the importer,
the build gate. Each item below is a drop-in.

---

## The format, in short

Read `art/SPRITES.md` for the full contract. For characters specifically:

- **192 × 256 transparent PNG**, ground anchor **(96, 244)** — the same frame Animal
  Factory Tactics uses, so its characters and these stand on the same floor.
- **Facing screen-right.** Never mirrored by the renderer: the light is baked in and
  mirroring reverses it.
- **Light from the upper left**, as everywhere else in the pack.
- Painterly and semi-realistic, matching the props — *not* pixel art, and *not* the
  Doré engraving of the existing portraits. Those portraits stay: they are the
  design-of-record for the creatures and they will keep their place in combat.
- **Muted.** The imported art is already washed per band by the renderer
  (`setup.SCENE_GRADE`), so draw at honest mid-tones and let the game key it. Don't
  pre-darken for atmosphere; the grade will do it twice.

### Scale is declared, not drawn

A farm has one size of worker. This bestiary runs from a dog-sized rat to a boss that
fills a chamber, so **every creature declares a world height** and the renderer scales it,
exactly as props are scaled to their calibrated box. Fill the 192 × 256 frame whatever the
creature is; the number below is what it will be drawn at.

The reference is **the player at 59px** — Tactics' own visible character height at zoom 1.

| creature | height | why |
|---|---:|---|
| `rat` | 30 | dog-sized, low, mid-scurry |
| `crawler` | 34 | long and boneless, nosing out of a low pipe |
| `smokewisp` | 40 | a loose lick of something, hanging at head height |
| `kappa` | 45 | small, beaked, child-height |
| **player** | **59** | the reference |
| `shortweight` | 59 | person-shaped on purpose — it is pretending |
| `drowned` | 59 | a human corpse, unfolding |
| `shadowperson` | 62 | a person-outline held out of habit, slightly too tall |
| `ratman` | 66 | reared, upright, handed |
| `pig_pressgang` | 68 | a working sty-hand with a shovel |
| `grafted` | 70 | too many joints, dragging itself free |
| `gorger` | 85 | enormous, placid, industrial |
| `pigdemon` | 90 | massive upright boar; push it further for the L9 lord |
| `shitgolem` | 110 | canon: "a man twice your size" |
| `glut` | 130 | the boss. It should not fit comfortably in frame. |

### Poses

Three are required, one is optional:

- **`idle`** — standing, weight settled. Used in the room diorama and as the combat
  default. If only one pose is ever drawn, draw this.
- **`attack`** — the strike. Shown on the creature's turn.
- **`down`** — defeated. Side-lying, like Tactics' body sprites: **no blood, no open
  wounds**, shared by "dead" and "beaten". This game has enough viscera in the prose.
- **`tele`** *(optional, twelve creatures)* — the **telegraph**. Combat already prints a
  wind-up line before a signature move lands ("*stops fighting and sets up a shrill,
  carrying squeal*"). A pose for that moment is the single highest-value optional frame
  in this document, because the mechanic is already there and unillustrated. The twelve
  with a signature move are marked in the roster below.

---

## Tier 1 — the player paper-doll

**This is the one to do first, and it is the reason the game wants sprites at all.**

Corruption here is not a bar. It is tracked **per body segment** — `head · torso · armL ·
armR · legL · legR` — against three mutagen classes (`rat · pig · filth`), each crossing
four stages at 30 / 50 / 75 / 100 (`tingle · tainted · turning · turned`). The prose
already reads from that 72-cell matrix; `setup.BODY_DESC` has a written line for every
cell. A player can finish a run with a rat's head, a pig's legs and one arm gone to filth,
and right now the only place that shows is a sidebar of text.

A layered sprite makes it **something you watch happen to your own body**.

### The count

One image per segment per state: `6 segments × (1 human + 3 classes × 4 stages)` = **78**.

If 78 is too many for a first pass, the useful subset is:

> **24 images** — a clean human set (6) plus `turned` for all six segments in all three
> classes (18). That buys a body that visibly changes. The two middle stages cross-fade
> between human and turned until they are drawn, which reads as a dissolve rather than a
> gap.

### The registration rule — this is the part that breaks if you get it wrong

**Every one of the 78 is a full 192 × 256 frame with that segment painted in its place and
everything else transparent.** Not a cropped limb with an offset. Not a sprite sheet of
parts. A full frame each time.

That is deliberately wasteful of pixels and completely bulletproof: any segment can be
swapped for any other at any stage and it lands in the right place with no layout maths,
no per-part anchors, and nothing to drift when a later stage is drawn by a different hand
on a different day. Draw the whole figure once as a guide, then export six masked copies
per state.

**Draw order**, back to front: `armL · legL · torso · legR · head · armR`
(far arm, far leg, body, near leg, head, near arm — the figure faces screen-right).

The silhouette must stay coherent across states. A `turned` pig leg is a short hard
trotter and a `turned` rat leg is a high-heeled runner's spring — different shapes, but
both have to meet the same torso at the same hip and reach the same ground line at y=244.
**Pin the joints; vary everything else.**

### The prose is the brief

Don't invent these. `setup.BODY_DESC` in `src/sewer-demons.twee` has a written line for
every cell, and the art should be a reading of it. A sample of the corners:

- **head / rat / turned** — *"pushed out into a long whiskered muzzle, ears risen raw,
  teeth gone to chisels"*
- **torso / pig / turning** — *"the body slung heavy and broad, pink and bristled, the
  spine dropping toward all fours"*
- **arm / filth / turned** — *"a fingerless dripping pseudopod that holds a thing by
  flowing around it"*
- **leg / rat / tainted** — *"the foot narrowing and clawing, the heel rising, the leg
  quickening under you"*

Note the ladder inside each class: `tingle` is a **sensation with almost nothing to see**
(draw it as a tension, a wrongness of posture, at most a discoloration), `tainted` is the
first honest visible change, `turning` is past disguising, `turned` is finished. A `tingle`
frame that already looks monstrous collapses the whole ladder — the horror is in how
gradual it is.

### Weapons: later, and cheaply

The player has ten equipment slots, which would multiply this by a catalogue. Don't.
If a weapon should show, it is **one overlay per weapon TYPE, not per item** — six images
(`dagger · hook · spear · sword · axe · hammer`), drawn to the same frame and anchor, laid
over the near arm. Tier and material are told in the text. That is a separate, later, and
much smaller job.

---

## Tier 2 — the bestiary

Fourteen creatures. Ten already have an engraving portrait to work from, and those
portraits are the design of record: **read the portrait and `docs/BESTIARY-ART.md`, then
draw the same creature in the sprite format.** They are not being replaced.

`★` marks a signature move, and therefore a creature worth a `tele` pose.

| id | name | band | portrait | in `BESTIARY-ART.md` | ★ | notes |
|---|---|---|:--:|:--:|:--:|---|
| `rat` | demon rat | sewer | ✅ | ✅ | ★ squeal | the first wrong thing. Hairless, swollen, too many eyes |
| `ratman` | rat-man | sewer | ✅ | ✅ | ★ squeal | the mutation finished: upright, handed, unhurried |
| `crawler` | drain-crawler | L3 | ✅ | ✅ | ★ coil | blind, pale, a mouth far too wide for a head with nothing to aim it |
| `drowned` | the drowned | L4 | ✅ | ✅ | ★ grapple | grief, not malice. Unfolding joint by waterlogged joint |
| `kappa` | a kappa | L4 | ✅ | ✗ | ★ pullunder | **the dish of water on its skull is the whole character** — it is the creature's weakness and the way you beat it without fighting. Bow-able. Small, beaked, webbed |
| `shitgolem` | shit-golem | sewer | ✅ | ✅ | ★ engulf | a thousand harmless discarded things stood up into one body. No face, only the place one would go |
| `pig_pressgang` | a sty-hand | L7/L8 | ✅ | ✗ | ★ drag | shovel-armed, herds bodies to work. Its errand is an offered shift, not a fight — it should look like **labour, not predation** |
| `gorger` | a gorger | L8 | ✅ | ✅ | ★ gulp | rendering-house worker made of the rendered. Placid, enormous, up to its elbows in the work |
| `pigdemon` | pig-demon | L7/L9 | ✅ | ✅ | ★ gore | the answer to who took you. The cruelty is the **boredom** in the eyes |
| `glut` | the Glut | boss | ✅ | ✗ | ★ engulf | the drains, woken. Currently uses `demon1.png`. The only boss — draw it at a scale that breaks the frame |

### Tier 3 — no art of any kind

These four have **no portrait and no entry in `BESTIARY-ART.md`.** They need designing
before they can be drawn. The registry comments below are everything that exists.

| id | name | ★ | all that is written down |
|---|---|:--:|---|
| `grafted` | the grafted | — | **Has a `BESTIARY-ART.md` entry but no portrait** — the only creature described in full and never drawn. "A thing that should have been structure and became a creature instead": stitched from every spare part to hand, too many joints and not enough plan, half-woven into a wall-loom of bone and sinew and then *kept*, dragging itself free. Signature: **wrong eyes, borrowed, scattered where eyes shouldn't be.** ★ manyhands |
| `shadowperson` | a shadow-person | ★ chorus | "A person-shaped aggregate of smoke, soot, and flies, holding a human outline out of habit." **Speaks as WE.** The registry calls it *"the 'what you're becoming' mirror"* — it should read as the player's silhouette with the person subtracted. Fighting it costs you identity even when you win |
| `smokewisp` | a smoke-wisp | — | *Ignis fatuus* — "a loose lick of the aggregate, the glow that says THIS WAY". Fodder, but each touch takes a wisp of you. A lure with a body barely there |
| `shortweight` | a short-weight | — | **Six sprites, not one.** It reads your *dumped* ability score and presents as whatever preys on that weakness: `str` **a leaner** (peels off the wall, puts its dead weight against you like a door that wants shutting) · `dex` **a flicker** (fast, lean, too many fingers, already through your pockets) · `con` **a breather** · `int` **a sharp** · `cha` **a shunner** · `wis` **a lurker** (passive, ambush). They are one grey folding thing wearing six approaches — the family resemblance must survive. Prose for each is in `setup.SHORTWEIGHT` |

### Counts

| | |
|---|---:|
| required (14 creatures × idle/attack/down) | 42 |
| the short-weight's other five faces × 3 | 15 |
| optional telegraph poses (12 creatures) | 12 |
| **bestiary total** | **57 required · 69 with telegraphs** |
| player paper-doll | 24 minimum, 78 complete |

---

## Tier 4 — NPCs (not yet, and probably not all)

46 NPCs are wired across the nine layers (`tools/npc-manifest.json`,
`docs/PROPOSAL-NPCS.md`). They are inline text — someone to talk to, bargain with, or
overhear — and most should stay that way: a face on every voice would flatten the
difference between a passing mutter and a character.

If any get art, it is the ones the player *deals with* repeatedly and who already have
room illustrations: **the Fly on the Wall** (the Hellmouth Inn barkeep and information
broker), **the Fleshcutter** (curse removal), **the digger**. Treat that as a separate,
later decision, not part of this order.

---

## Order of work

1. **Player `turned` set + human** — 24 images. The single change that makes the game's
   central mechanic visible. Nothing else comes close.
2. **The four undrawn creatures** — `grafted`, `shadowperson`, `smokewisp`, `shortweight`.
   These are gaps in the bestiary itself, not just in the sprite layer, and `grafted` is
   fully written and has simply never been drawn.
3. **`idle` for the ten portraited creatures** — the diorama and the combat stage both
   start working the moment these land.
4. **`attack` and `down`.**
5. **The player's two middle stages** — the remaining 54, which turn a switch into a slide.
6. **Telegraph poses**, for the wind-up the combat log already narrates.

---

## Getting a finished file into the game

1. Save at `art/source/char/<id>-<pose>.png` — 192 × 256, transparent, anchored (96, 244).
2. Add one line to `LOCAL_PROPS` in `tools/prepare-sprites.py` (or the character table, if
   one has been added by then) with `crop: None`; the crop is measured for you, and that
   measurement is verified against 33 hand-calibrated references by
   `python tools/prepare-sprites.py --selftest`.
3. `python tools/prepare-sprites.py`
4. `.\build.ps1` — the build fails if an id doesn't resolve, because a mistyped one draws
   *nothing* and an empty corner of a picture is not something anyone notices.
5. Check it in the browser. Sprites land in the room diorama's front row, which is left
   empty for exactly this.

## What not to do

- **Don't mirror to face left.** The light is baked in.
- **Don't retune a world height to make one creature look better in isolation.** The
  numbers above are a set; the Glut is frightening because the rat is small.
- **Don't pre-darken for mood.** The renderer grades every scene per band already.
- **Don't redraw the engraving portraits.** They are the design of record and they keep
  their place. These sprites are a second view of the same creature, not a replacement.
- **Don't make `tingle` look monstrous.** The whole ladder lives or dies on that frame
  being almost nothing.
