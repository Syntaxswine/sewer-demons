# Sewer Demons — Per-Segment Corruption & Transformation

The corruption meter is no longer a single number. The body is **six segments**, each
carrying corruption attributed to a **mutagen class** (the filth that touched it). A
segment that fills to 100 **transforms** into its dominant class for the rest of the
life. This is the body-horror made mechanical: corruption was always "filth on the
body"; now it is literal, and the filth's *kind* decides what you become.

Owner design (2026-06-04). Engine lives in the `StoryInit <<run>>` block of
`src/sewer-demons.twee` as `setup.*`; the sim mirror is `tools/combat-sim.mjs`.

## The model

```
$body = { head, torso, armL, armR, legL, legR }   // each segment: { rat, pig, filth } buckets
$form = { head:"human", torso:"human", ... }       // what each segment has BECOME
$corruption                                          // DERIVED MIRROR = avg of the six segment totals
```

- **Segment total** (`setup.segTotal(seg)`) = `min(100, rat+pig+filth)` for that segment.
- **Dominant class** (`setup.segClass(seg)`) = the largest of its three buckets.
- **General meter** (`setup.totalCorruption()`) = `round(avg of the six segment totals)`.
  This is the owner's "average of all segments for a general corruption meter," and it
  is mirrored into `$corruption` so **every legacy read keeps working** (the meter, the
  `$corruption gte 35/70` tier-prose, the `gte 100` loss). **Never write `$corruption`
  directly** — it is engine-owned. Rooms use the widgets below.

### Thresholds / stages (owner: 30 / 50 / 75 / 100)

`setup.segStage(seg)` →

| Total | Stage | Read |
|------:|-------|------|
| ≥30 | `tingle` | a tingle, an itch, a strange feeling |
| ≥50 | `tainted` | the change has a grip |
| ≥75 | `turning` | it is going |
| 100 | `turned` | the segment becomes its dominant class — **locked for the life** |

A turned segment does not wash off (`setup.soothe` skips it); below 100, corruption can recede.

**Overflow — a maxed limb spills to a new target (owner 2026-07-03).** A segment holds a total
of 100; corruption past that is no longer *wasted* (the old code clamped and threw the excess
away). Now `setup.corrupt` fills the target toward 100 and **hands the overflow to a fresh limb**,
cascading until it's absorbed or the whole body is turned. `setup._spillTarget` prefers a limb
already carrying that class (so a body turns *coherently*, class by class, toward one creature —
the aggregate thesis) among those with room; else it opens a new limb **at random**. A big hit can
therefore turn one limb and flood the next in a single blow — and the transformation feed narrates
**each** hop that crosses a stage (via `setup.lastChangeSpills`, drained by `pushChange`), so you
watch it jump. When every segment is full the remainder is truly lost (nowhere left to go).
Verified in-browser: torso 90 +30 → torso turns, 20 to a fresh limb; torso-full +30 with legL
already filth → routes to legL (same-class), not the pig-tinged arm; whole-body-full → no crash,
excess dropped; a cascade turns two limbs and the feed shows both.

## Applying corruption — the widgets

Rooms attribute corruption by **source**: where you spend it decides what you become.

```
<<corrupt SEGMENT CLASS AMOUNT>>     e.g. <<corrupt "legL" "filth" 18>>
<<soothe AMOUNT>>                     rest/wash; eases un-turned segments
```

- `SEGMENT` ∈ head · torso · armL · armR · legL · legR
- `CLASS` ∈ rat · pig · filth

**Authoring mapping** (how the 55 migrated sites were assigned — follow it for new rooms):

| Source in the fiction | Segment |
|-----------------------|---------|
| wading / black water / running bed | a leg (`legL`) |
| bad air / fumes / brimstone / caustic foam | `head` |
| a face / reflection / mask bargain; learned words; the mind | `head` |
| a graft / ward / reaching into the vats / hand-work | an arm (`armR`) |
| drinking / the swallow / generic "pay with yourself" | `torso` |
| ambient room entry | `torso` |

| Band | Class | Why |
|------|-------|-----|
| L1–L4 sewer + L5 hellmouth + L8 rendering | `filth` | aggregate sewer-filth; L8 is where filth is *made flesh* (the mutagen's origin) |
| L6 Shambles, L9 Sulphur Deep | `pig` | the carnival hell-town and the sulphur castle are the pig court's ground |
| (rat-man dens, when corruption is sited there) | `rat` | vermin lineage |

## Transformation & its effects

- **Transform**: when a segment's total hits 100, `$form[seg]` becomes its dominant class.
- **Stat mods** (`setup.FORM_MODS`, applied per turned limb in `playerScores`, beside the
  cross-life marks): `rat → +DEX`, `pig → +STR +CON`, `filth → +CON −CHA`. Turned limbs
  make you fight like what you became — a real build (sim: 4 pig limbs lift the gorger
  fight 31%→78%).
- **Autofail** (the owner's "corrupt hands pull bad levers," generalized): a corrupt
  **arm** drags your attack roll, a corrupt **leg** drags your flee — `setup.limbPenalty("arm"|"leg")`
  = `floor(worse-paired-limb / 25)` (0..−4). Combat uses `max(generalPenalty, limbPenalty)`,
  so attributed limb-corruption bites harder than the general meter. Rooms can call
  `setup.limbPenalty("arm")` to gate a lever/skill check the same way.

## The loss, and what carries over

- **Become-ending**: when every segment is turned (so the mirror reaches 100), PassageHeader's
  existing `$corruption gte 100 → EndingBecome` fires — now meaning *fully transformed*, not
  "generally grimy." The lean toward **autofail over instakill** (owner) comes from the
  per-limb penalties biting long before that.
- **Cross-life**: transformation **resets each life** (the cross-life carriers are seals,
  cursed objects, tattoos — the marks system). The one exception (owner's "both-and"): if you
  become **wholly one creature** (`setup.becameClass()` returns a class), EndingBecome banks a
  lingering **creature-kin mark** `kin_<class>` (`setup.isKin(cls)`) — that species reads you as
  one of their own thereafter, in this life and the next. (Friendliness hooks: extend the
  Hellmouth `hasMark`-style recognition; one is wired in EndingBecome's prose. More to come.)

## Migration / back-compat

`$corruption` is a derived mirror, kept in sync by `setup.recomputeBody()` (called from
`corrupt`/`soothe`/StoryInit/`healBody`). A save predating this system is migrated by
`setup.healBody()` (PassageHeader self-heal): it builds the body and seeds each segment with
the old general value (as filth) so the meter isn't wiped.

## Testing

- `node tools/combat-sim.mjs` — now includes a TRANSFORMED-build row (FORM_MODS + a corrupt-arm
  penalty) showing the tradeoff. Keep `FORM_MODS` in sync with the engine.
- In-browser: drive a snare to fill a segment; watch the **Body** readout in the left bar
  (per-segment, field-guide monospace) cross 30/50/75/100; confirm a corrupt arm shows
  "drags at your swing — −N to hit" in combat. Target zero console output.

## Appearance text — `setup.BODY_DESC` (the part × species × stage matrix)

Each corrupting segment shows a one-clause description of **what it looks like** under its row
in the StoryCaption Body readout (the `.bm-desc` sub-line, stage-tinted). `setup.segDesc(seg)`
dispatches into **`setup.BODY_DESC[partType][species][stage]`**:
- **partType** = `setup.PART_TYPE[seg]` → `head` / `torso` / `arm` (armL,armR) / `leg` (legL,legR).
- **species** = `setup.segClass(seg)` (dominant exposure) for the sub-turned stages; for a **turned**
  limb it's `form[seg]` (what it actually became).
- **stage** = `setup.segStage(seg)` → `tingle` (≥30, a *sensation*, felt-not-seen) / `tainted` (≥50,
  the first visible sign) / `turning` (≥75, well underway) / `turned` (100, the finished anatomy).

So it's **4 part-types × 3 species × 4 stages = 48 strings** (DIRECTION §B, owner: "it needs to
vary by species" — expanded 2026-06-05 from the old per-class `CLASS_SENSE`/`CLASS_TEXTURE` +
per-part `TURNED_DESC`, which are now gone). All of it lives in the raw-JS **`<<script>>` block**
(not `<<run>>`), because the strings are DISPLAYED and `<<run>>` would desugar operator-words inside
them (HANDOFF §4). The current text is a **first draft** (serviceable body-horror) flagged for the
owner's voice-pass — the dispatch/matrix is solid; the prose is the part with an owner's ear to come.

## The transformation feed — change beats as they land (owner 2026-06-24)

`BODY_DESC` is the **state** readout (what a segment looks like *now*, in the side-bar). The
**feed** is the **transition** beat — *what just happened to you* — surfaced in the main column
the moment corruption lands ("a more detailed description of the changes as they happen").

- `setup.corrupt` records a transient `setup.lastChange` (the before/after stage of the hit, and
  the curse-resolved class, so it narrates what *actually* landed — `always_class` and all).
- The **`<<corrupt>>` widget** calls `setup.pushChange`, which queues a beat onto `$pendingChanges`
  **only if it's worth narrating**: a fresh threshold cross, a finished turn, or a single hit
  ≥ `setup.CHANGE_MIN_AMT` (8). Sub-threshold ambient ticks (+2/+3) that cross no line stay silent,
  so the feed keeps its bite. (A segment's stage is monotonic-up, so a fixed ambient tick narrates
  at most once — when it first pushes you across a threshold — never on revisit.)
- **`PassageHeader`** flushes `$pendingChanges` into a `.change-feed` block at the top of the room
  you land on, then clears it. It sits *after* the random-encounter roll, so an encounter redirect
  carries the queue forward (cleared only once actually rendered). Because a `<<corrupt>>` fired
  inside a link narrates on the *destination*, the cost reads as catching up with you as you move
  on. Skipped on `[ending]` passages — `EndingBecome` owns the becoming-prose (the one deliberately
  dropped beat is the final meter-tipping turn).
- **Prose**: `setup.CHANGE_DESC[partType][class][stage]` — 4 part-types × 3 classes × 4 stages,
  rendered as `"Your " + SEG_PROSE[seg] + " " + predicate` (so `armL`/`armR` → "left/right arm",
  `torso` → "body"). Plus `setup.CHANGE_DEEPEN[class]` short "works deeper" lines for big
  within-stage hits. Lives in the raw-JS `<<script>>` block beside `BODY_DESC` (the prose carries
  operator-words the StoryInit desugaring would mangle).
- **Styling**: stage-tinted (`cf-tingle`/`cf-tainted`/`cf-turning`), the turned beat bold-red
  (`cf-turned`), and deepen beats muted (`cf-deepen`) so a "works deeper" line never wears the loud
  finality style.

**Boundary — only the widget feeds.** Engine-internal `setup.corrupt` callers (the `loseFight`
maul, casting, the Cutter graft, work-shifts, the cheese) bypass the widget and keep their own
bespoke prose, so there is no double-narration. (Verified by a 3-agent adversarial audit
2026-06-24: sole-feeder, save-safe `$pendingChanges`, no spam vector, full 72+18 matrix coverage,
`always_class` narrates the applied class.)

**Expand / verify**: run **`node tools/feed-inspect.mjs`** — it reads the matrix straight from this
source (no hand-copy to drift), assembles every beat, and flags coverage gaps, construction slips
(a predicate that won't read after "Your &lt;part&gt; "), anatomy mismatches, within-feed echoes, and
the cells that overlap the side-bar `BODY_DESC` (`--list` / `--overlap` / `--deepen` for detail). The
full editing procedure — voice rules, the intransitive-agency lesson, calibration knobs, adding a class
or stage — is the **`sewer-demons-expand-transformation-feed`** skill.

## Systemic regard — the world reads the body you wear (owner 2026-06-24)

The feed narrates your body *changing*; **regard** narrates the world *answering* it — the outward
face of the same agency-horror (the feed: the body decides for you; regard: the world decides what
you *are*). It is a RULE, not a scattered touch: every band reads a transformed body, automatically.

- **The missing primitive** (now built): a graded whole-body class read. `setup.classLoad(cls)` /
  `setup.classLimbs(cls)` (the rat-only `ratLoad`/`ratLimbs` now delegate to these) and
  `setup.bodyClass()` → `{cls, load, limbs}` for the class you are MOSTLY becoming, or null. Fills the
  gap left by `becameClass()` (all-or-nothing) — a 3-pig/3-clean body finally reads as *pig*.
- **The verdict**: `setup.regardOf(passage)` compares `bodyClass()` against `setup.classOnFloor(passage)`
  (the existing depth→class faction map: L1–3 rat, L4/L8 filth, else pig). Same class → **matched**
  (the denizens claim you as their own — no vote asked); different → **mismatched** (a place that gets
  to define "wrong" has decided you are it). Below `REGARD_MIN_LOAD` (35) you read as still yourself and
  it stays quiet. `regardTier` (1 tingeing / 2 mostly / 3 wholly, from turned limbs then load) picks the
  intensity; a cross-life `kin_<class>` mark escalates a matched read ("the deep has always known you").
- **Prose**: `setup.REGARD[relation][floorClass][tier]` — 2 × 3 × 3 = 18 cells, in the raw-JS
  `<<script>>` block. Tone is per-band: pig = seductive welcome / contempt; rat = feral acceptance /
  heavy-intruder; filth = claimed-by-the-swarm / read-as-meat. Matched is written to be *unsettling
  even when "positive"* — being claimed is dispossession too.
- **Surfacing**: a `PassageHeader` ambient `.regard-line` (below the feed), styled `r-matched` (sickly
  ochre) / `r-mismatched` (cold slate). **Cooldown-gated**: a CHANGED verdict (new band / tier / body
  class) shows at once; the same verdict only refreshes after `REGARD_COOLDOWN` (8) eligible moves — so
  it's pervasive, not a nag. Fires on real rooms only (`depthOf >= 1`, not endings).
- **Verify/expand**: `node tools/regard-probe.mjs --bands` prints the whole grid (every body × floor ×
  tier) and checks coverage from source. Any room/NPC can react by calling `setup.regardOf(passage())`;
  reactions that corrupt must route through `setup.corrupt()` (never write `$corruption`).

### Olfactory pass + the nose-blind milestone (owner 2026-06-25)

The game's second governing body-horror motif (with lack-of-agency) is **bromidrophobia** — odor-disgust,
the stink you can't wash off *or* smell on yourself. Two builds make it explicit, anchored on the
filth/"shit-demon" class (an odor with just enough cohesion to come at you):

- **Olfactory regard.** All 18 `setup.REGARD` cells rewritten so the world's verdict is a **scent**-read
  — kin/intruder recognition is the most animal sense there is. This gives the social cost of a corrupt
  body a voice (the filth `FORM_MOD`'s `cha −1`, *"and it shows"*, bites loudest in the mismatched reads).
  Matched = the band smells its own in you (filth's purest: *the aggregate cannot tell you from itself*);
  mismatched = you smell wrong, of meat, *"by a sense that does not lie and cannot be argued with."*
  Prose-only change — `regardOf`/tiers/cooldown unchanged; `regard-probe.mjs` still 18 cells.
- **The nose-blind milestone** — **olfactory adaptation made a mechanic**, and the motif's sharpest point.
  Once you're *mostly* a class (`setup.noseBlindReady`: `classLoad ≥ NOSE_BLIND_LOAD` 50, or 3 turned limbs),
  a **one-time-per-class** beat fires: you realize you've stopped smelling the thing you're becoming,
  because there's no longer a *you* set apart from it to smell it with — so the realization that you've
  stopped noticing means you're further gone than the meter says (agency-horror via the nose). Prose
  `setup.NOSE_BLIND[class]` (filth home, rat/pig generalize); fired in `PassageHeader` against `$noseBlind`
  (resets each life via restart; a split body gets each saturated class's beat, one per passage; flags only
  on show). Styled `.nose-blind` — a drained grey milestone band, distinct from the feed (a change) and
  regard (a verdict): this is an *absence*.

### Room-scent — the world's stink, and your eroding disgust (owner 2026-06-25)

The **third olfactory system**, and the one that turns bromidrophobia outward onto the *world*.
Regard is the world smelling **you**; nose-blind is you no longer smelling **yourself**; room-scent
is your reaction to the **world's** reek — and how the disgust that should protect you erodes, then
inverts, as you corrupt. Disgust is the body's contamination-alarm; watching it switch off (and then
start to *like* the rot) is the purest body-horror of the three, because it corrupts the *judge*.

- **The ladder** (owner-set thresholds) — the full olfactory-**adaptation** curve. A stinky room
  has an intrinsic stench-**kind**; your reaction to it slides with general `$corruption`: **recoil**
  (≤10 — a *fresh* body in violent revolt: gagging, eyes streaming, the get-out instinct) → *[silent
  middle, 11–74 — revulsion has habituated to "bad but survivable"; the room's own prose carries it]*
  → **accept** (≥75 — the disgust-alarm has gone quiet, *"it is only air now"*) → **relish** (≥90 —
  worse, the body **wants** it). The **extremes speak**, the habituated middle stays silent — and the
  recoil baseline is what the later erosion betrays (you remember how unbearable it was; the same room
  reads recoil → silent → accept → relish across a playthrough). Knobs: `setup.SCENT_RECOIL_AT` (10) /
  `setup.SCENT_EASE_AT` (75) / `setup.SCENT_RELISH_AT` (90).
- **Species affinity** (owner). `eff = $corruption + setup.SCENT_AFFINITY_PER_LIMB (5) × turned limbs
  whose class matches the smell` — additive-only, matching-class-only. You go comfortable in your own
  kind's places first: a **rat-man** eases into the den (`denMusk`, rat) before a fresh body would,
  while a sulfur field (a pig smell) gives him nothing. Load-bearing in the mid-game window (1–3
  turned limbs); by 6 limbs you're ~100 corruption anyway.
- **LIVE / reversible.** `setup.scentTier` re-derives every room from the current meter, so washing
  off (`<<soothe>>`) restores the disgust — the *continuous slide*, where nose-blind is the *latched*
  once-per-life milestone.
- **Mechanical teeth — the fresh-revulsion band bites (owner 2026-06-25).** The recoil band
  (corruption ≤ `SCENT_RECOIL_AT`) isn't only prose. The horror is the **inversion** it mechanises: at
  the very start the *world* penalises you for staying human, and a little corruption is the relief
  (agency-loss, mechanised — the game rewards giving in).
    - **Gate** — `setup.inuredEnough()` (corruption > 10) gates foul interactions a fresh human can't
      make themselves do. It is the **exact inverse** of `setup.composedEnoughToBow()` (which locks once
      you're too *corrupted* to bend like a person): the two bracket the range — *too fresh to kneel at
      the filth-shrine, too far gone to bow to the kappa.* Applied to **`ThePrivyShrine`** (the
      `$sphincterWord` lesson is refused while fresh, with a "come back when more of you has stopped
      minding" beat; the exits stay open, so it's a soft self-resolving gate, never a softlock — and in
      practice no one reaches L7 still fresh). Reusable: any foul option gates with `<<if
      setup.inuredEnough()>>…<<else>>…refusal…<</if>>`. Also applied to the **`FINDS` cache system**:
      11 finds whose *take* is a visceral hand-in-filth (the storm-screen, the grit-trap, silt among
      bones, the dead-letter strata; the clotted meat-row gutter, the organ-trove, the tooth-well; the
      tallow-store, candle-works and soap-vat) carry `fresh: true` and are filtered out of
      `setup.eligibleFinds()` while fresh — so the gross gutter coins don't surface until you've inured,
      **delaying easy coin at low levels** (this also lowers the `goodfind` encounter weight, which scales
      with the eligible count). Non-gross coin (the melancholy street-catch, the votive drain, carnival
      tills, the drowned votives, mineral sulphur) stays available — a fresh player keeps a clean trickle.
      And to the **transformative cheese** (`TheLarder`): a fresh body can't *willingly* eat it or bed in
      the rats' nest (both refused — they're the two willing on-ramps that arm `$cheeseTasted`). **But the
      addiction can still be hooked involuntarily**: losing a fight to a rat-thing now arms `$cheeseTasted`
      in `setup.loseFight` (`forceFedCheese`) — the rats cram the reeking soft past your teeth while you're
      down, with a one-time `CombatLost` beat (*"you did not choose the cheese; it has chosen you"*). So you
      can be addicted to a thing you never chose to taste — and the **`ratcraving`** encounter is left
      *ungated* on purpose: once hooked, the craving overrides your fresh revulsion (the agency-loss path
      onto the rat track). The larder eat is the *choice* you're too human to make; the craving is the
      compulsion that doesn't ask.
    - **Penalty** — non-combat stat checks take `setup.freshCheckPenalty()` (`SCENT_FRESH_CHECK_PENALTY`,
      −2 while fresh, 0 once inured): queasy, flinching, the reek souring every deliberate act. Route
      future non-combat checks through **`setup.statCheck(stat, dc)`** (`d20 + mod(stat) − freshPenalty ≥
      dc`) and the penalty is automatic. *(Future-proofing — there are no non-combat stat ROLLS yet; the
      convention is in place for when they land. Combat keeps its own corruption/limb penalties.)*
- **Prose**: `setup.ROOM_SCENT[kind] = {class, recoil, accept, relish}` — 7 kinds (`sewage`, `denMusk`,
  `offal`, `pork`, `privy`, `tallow`, `sulfur`) × 3 spoken tiers = 21 cells, in the raw-JS `<<script>>`
  block. The `recoil` cells are the visceral opposite register from `accept`/`relish` (the alarm at
  full volume vs the body at peace). Each kind's `class` is set by **what the smell IS, not the floor
  faction** (the sewer mains smell of the aggregate filth that mutated the rats, so the rat smell is
  the *den*).
- **Rollout**: `setup.scentOf` = `SCENT_OVERRIDE` (a per-room reskin, or `null` to opt a clean/dry
  room out) wins, else `SCENT_BAND[depth]` (the uniform-stench bands L1–3 sewage / L7 offal / L8
  tallow / L9 sulfur; L4–6 are per-room only). Reskin **sibling** rooms together (both rat dens →
  `denMusk`; the sty + gutway → `pork`; the latrine + shrine → `privy`).
- **Surfacing**: a `PassageHeader` `.room-scent` beat (a warm amber band) between the feed and the
  regard beat, cooldown-gated + fire-on-change like regard (shares `REGARD_COOLDOWN`). Real rooms only.
- **Verify/expand**: `node tools/scent-probe.mjs` (`--ladder` / `--rooms`) checks coverage + rollout
  from source; the **`sewer-demons-expand-room-scent`** skill is the full editing procedure (the
  three-system boundary, the voice rules, adding a kind, the affinity math).

## Magic as a corruption faucet (owner-goal 2026-06-18)

The **Word** (see `docs/COMBAT.md` → Magic) is a new corruption SOURCE, and a self-reinforcing
one. Every cast `setup.corrupt("head", setup.classOnFloor($combatOrigin), spell.self)` — a taint of
**the fighting floor's own class** settles in your **head**. Because the mana ceiling is
`magicLevel×4 + corruption/10`, casting → more corruption → a *wider* well → more casting: the
intended vice spiral. (It also corrupts the *victim*, but enemies don't transform — their guard just
sloughs; AC erosion, not a body.) So a caster who leans on the Word will turn their **head** first,
in the class of wherever they do their fighting — a magic-built run reads as a head going over to the
deep. Composes with the cheese ([[the rat path]]): the same addiction that feeds the rat also refuels
the Word, so a rat-build caster turns head-first to rat while the cheese turns the limbs.

## The vices — the addiction ledger & food-as-corruption (owner 2026-07-20)

The owner's frame: **every transform class gets a corrupting FOOD**, and every consumable feeds an
**ADDICTION** the deep keeps score of. Four mouths of one engine (the fourth = Phase 0 of the proposed
smoke class — `HANDOFF-SMOKE-CREATURES.md`):

| class | food | job (source) | acquired | corrupts |
|---|---|---|---|---|
| **rat** | the cheese | **the curdworks** ✅ `TheCurdworks` (L1) | `TheLarder` (L1), scavenged in the sewer | random seg, `rat` |
| **pig** | **pig-slop** ✅ (+ butcher/confectioner heals) | vats · freakshow · dens-work (exist); **the pens** ✅ (the fattening capture) | eaten at the trough in `TheHolding` (L7); the slop-craving forages the pig band | random seg, `pig` |
| **filth** | **sewer-brew** | **the still** ✅ `TheStill` (L6) | bought at `HellTavern` taps (L6), 3 coin | `torso`, `filth` |
| **(smoke→filth)** | **the glow** ✅ (`setup.drawSmoke`) | the smoke creatures' den `TheGuttering` (L6, off the still) | `TheBackAlleys` barkers (L6); the smoke-craving forages *anywhere* (the glow is the air) | **DIFFUSE** — a thin film across **3 segs**, `filth` (Phase 0) |

**The ledger** — `$addiction` (`{ id: intensity }`) + `$addictionTop`, in the `setup.ADDICTIONS`
registry. THE RULE (owner): *all* vices are tallied, but **you only feel the CALL of the strongest**.
`setup.craving()` returns the dominant vice (past its `nag` floor) or `""`; every craving ENCOUNTER
gates on it, so **exactly the loudest addiction ever nags** — competing addictions fail gracefully,
never two calls at once. A rival can **seize dominance only by strictly EXCEEDING** the reigning
tally (`setup.feedAddiction` — ties keep the incumbent), so *"spam it over ... if you needed to"* is a
real, **paid** effort. This is a genuine sliver of terrible agency in an agency-loss game: a player
being **compelled** by the cheese (which past mostly-rat eats without asking) can deliberately **drown
it under brew** — drink until brew rules — trading the rat doom-spiral for a booze habit, and paying
in filth + coin to do it.

**Three textures of craving** (each vice expresses differently — not a reskin):
- **Cheese = FORAGE.** The rat scavenges and feeds itself in the sewer (`ratcraving`, `d ≤ 3`); past
  `cheeseCompelled()` (`ratLimbs ≥ 3`) it **auto-eats**. Agency-loss by *action* (the body eats).
- **Brew = the DRY shakes.** The still is a place you can't carry, so brew's call follows you
  **anywhere** as WITHDRAWAL (`brewwithdrawal`), never a forage. Below `brewCompelled()` (intensity
  ≥ 30) you ache and walk on **clean**; at/above it the body **gnaws at itself** for the missing
  measure (`setup.brewPang`, a small self-`filth`). Agency-loss by *degradation* (the body bleeds).
- **The glow = the AIR (diffuse).** Smoke is not a food you find but the air itself, so the craving
  finds you **anywhere** (`smokecraving`, `d ≥ 1`) — always a wisp within reach. But the glow is the
  vice that **does not concentrate**: `setup.drawSmoke` spreads a thin `filth` film across **3
  segments**, so the meter climbs but **no limb ever turns** — you go *vaguer*, not clawed. It is the
  one vice that is **pure loss, no build** (dispersal's whole point). Past `smokeCompelled()` (≥ 30)
  the lungs **draw on their own**. Agency-loss by *dilution* (there is less and less of you to decide).

**Sewer-brew** (`setup.drinkBrew`, `SEWERBREW_PRICE = 3`): the bait is Dutch courage (a little vigor,
+mana if the Word is known), the cost is `filth` into the **gut**, *deeper the filthier you already
are* (`+classLimbs("filth")` — mirrors the cheese scaling with `ratLimbs`). Distinct from the
barkeep's **free** belonging-cup (which is `pig`) — brew is **bought**. **The drinking contest**
(`setup.drinkingContest`, off `HellTavern`) is its con: an *easy CON check* whose payoff is inverted —
**winning** means you drank the whole contest (the purse **and** the big dose; brew rules you fastest),
**losing** is a smaller forfeit (one measure, no coin). The better you hold your drink, the harder you
are hooked; the coin is bait. EV + anti-farm gate in `docs/COMBAT.md` → *The drinking contest*.

**The Still — the filth JOB** (`setup.stillShift`, room `TheStill`, L6, off `TheBackAlleys`' wet stair).
The distillery that *makes* the brew — the filth column's **labour** half, pairing the food with its
source. Grueling and **poorly paid in coin** (`STILL_WAGE`, below the tavern's bar-work — *a still is
not a bank*). Three tiers: *light*/*hard* pay coin for `filth` (the fumes, the mash on your skin), and —
the owner's **payment-in-kind** — *take your wage in the drink*: you work the shift AND drink your keep
(a `drinkBrew(2)` ration), so the still pays you in the very thing it makes. This keeps the two vectors
**distinct**: plain **labour corrupts the BODY** (`filth`, no addiction), only the **in-kind wage feeds
the VICE** (`brew` climbs → dominance → withdrawal). The spiral made literal — *work the vice's source,
get paid in the vice; you start taking your wage in the barrel, and one day you are the barrel.* (Like
the tavern bar-work, it's a voluntary room-job that does **not** book `passTime` — an open consistency
call vs the indenture `doShift`, which does.)

**The Pens — pig-slop, the pig FOOD + the fattening CAPTURE** (`setup.eatSlop` / `pennedFatten`, rooms
`TheHolding` + `TheHoldingKept`, L7 off `TheBirthingDens`). The pig column's food — the matrix's third and
last **food** — built onto the Belly's own harvest lore (the Breeder: *"you'll keep, a while … rushing
spoils the meat"*). BAIT: the cheapest calories in hell (heal, worth most when hurt and broke — the
cheese's pig twin). COST: pig into a **random** segment (unlike the gut-only brew — so slop *alone* can
spread you toward the compulsion). Eaten at the trough in `TheHolding`; the **slop-craving** (`slopcraving`,
pig band `d≥5`) forages once tasted — *there is always a trough in the warm places* — and **compels** at
`pigLimbs≥3` (you go to the trough the way the farrow do). At the pens, that compulsion has a dark payoff
the wild craving does not: the **fattening capture** (`TheHolding` → `TheHoldingKept` → `pennedFatten`) —
cross to the trough mostly-pig and the pen-boars stop seeing a hand and see stock; they pen and finish you
(heavy pig across 2–3 segments, half vigor), and you claw back out heavier and more theirs (a full turn
tips `EndingBecome` as usual). The compelled `TheHolding` still offers a **last flee** (*tear yourself
away*) — the sliver of agency before the trough decides for you. The pig column's **job** already existed
(the `TheBirthingDens` dens-work + the vats/freakshow), so the pens complete pig as **food + capture**.

**The Curdworks — the rat JOB** (`setup.cheeseShift`, room `TheCurdworks`, L1 off `TheLarder`). The cheese's
labour twin, and the **last cell** of the matrix: the rats *cure* the fallen pallet (cave-aging, washed
rinds, the cheese-mites/casu-marzu **crawl** the curers are proud of). Poorly paid in coin (`CHEESE_WAGE`,
below topside), and — the still's exact shape — its in-kind wage is **a wheel** (`setup.eatCheese`): labour
marks the body with `rat`, only the wheel feeds the cheese vice. **THE FOOD×CLASS MATRIX IS NOW COMPLETE** —
every class has a **food** and a **job**: **rat** cheese (`TheLarder`) + curdworks (`TheCurdworks`); **pig**
slop (`TheHolding`, + butcher/confectioner heals) + the pens/dens/vats; **filth** sewer-brew (`HellTavern`)
+ the still (`TheStill`). The three jobs share one shape — *poor in coin, paid in the vice they make*
(payment-in-kind), the doom-spiral made literal three times over.

**The Glow — the smoke vice + the smoke creatures** (`setup.drawSmoke`, room `TheGuttering` off `TheStill`,
L6 — Phase 0 of the proposed 4th class, `HANDOFF-SMOKE-CREATURES.md`). The back-alley barkers' glowing
smoke, made a real ledger tenant, feeding `filth` for now (smoke = the air-phase of filth; Phase 1 would
re-point it to a `smoke` class). BAIT: the ache eased + fear gone quiet — a **downward, detached** calm
(the opium reading, web-verified: *detachment, not courage*), a small heal, **no mana**. COST: it
**DIFFUSES** (see the third craving-texture above) — you go vaguer everywhere, no limb turning; pure loss,
no build. Faucets: the barkers (`TheBackAlleys`, rewired from a one-shot `<<corrupt "head" "pig">>`) + the
smoke creatures' den. The **den** (`TheGuttering`) is where the vice meets the new combat axis: the
**shadow-person** (a person-shape of smoke, soot, and flies, speaking as *we*) + **smoke-wisps** carry
**identity damage** (`idmg`) — they barely tear flesh but corrupt you on every landed hit, so *winning
finally costs your self* (docs/COMBAT.md → *Identity damage*). The **chorus** move takes from two segments
at once (a working sliver of the un-built plurality horror); and because *you cannot kill smoke, only
scatter it into the air you breathe*, `setup.scatterToll` guarantees a diffuse corruption even on a clean
win (the floor under the in-fight idmg, which alone would vanish in a fast fight). You "clear" the room for
today, never for good — the haze, and the vice, remain.

**Migration**: `setup.healAddiction()` (PassageHeader self-heal) builds `$addiction` on a pre-ledger
save and seeds `cheese` from the legacy `$cheeseTasted` flag, so an already-hooked save still feels the
pull. Idempotent. (The `smoke` tenant needs no migration — a fresh key in `$addiction` is absent-safe.)

## Open / future

- **Per-room autofail content**: the `setup.limbPenalty()` hook exists; wire it into actual
  room checks (the owner's lever example) — a corrupt hand fumbling a mechanism, a corrupt leg
  failing a climb.
- **Friendliness payoff**: spend the `kin_*` marks — pig-kin offered passage at the Sty / the
  Court; rat-kin in the belly; filth-kin un-hunted by the aggregate.
- **Per-stage prose beats** ✅ **SHIPPED 2026-06-24** — the transformation feed (see its section
  above) narrates every meaningful change at the moment it lands, in the main column, escalating
  by stage. *Optional future polish flagged by the voice audit*: the feed and `BODY_DESC` share
  register and parts-vocabulary; the feed cells could be pushed harder toward the eventful/felt and
  leave the clinical inventory to the side-bar (not yet done — the owner asked for detail, which
  shipped; sharpening the two channels apart is a separate voice-pass).
- **Class spread**: rat WAS the dead third — pig 27 corruption sources, filth 32, **rat 0** (you
  could only fall into rat by losing to rat-things, never choose it). **ADDRESSED 2026-06-18 (the
  transformative cheese):** `TheLarder` (L1, off TheCulvertRun) is a stinky-cheese pallet — eat
  (`setup.eatCheese`: heal HP / rat bite) or bed down in the rats' nest (`setup.ratNestRest`: rest
  to full / deeper rat bite), both repeatable. Tasting it arms the **`ratcraving`** encounter (the
  craving finds you in the sewer band; weight climbs with `setup.ratLimbs()`), and past mostly-rat
  (`setup.cheeseCompelled()` = 3+ turned limbs) the eat **COMPELS** — the body feeds itself, no
  resist. Food-as-corruption is the carnival's pig pattern (TheConfectioner/TheButchersStall)
  ported to rat; composes with the kin event (cheese → rat → sewer rats read you as family).
