# Sewer Demons — Map Architecture (the map bible)

A **9-layer vertical descent**. You're kidnapped to the hellmouth (L5); **descend**
into hell (6→9) for the three sigil-fragments, **ascend** the sewer (4→1) to climb
out — past a **gate on every layer**. Fixed, hand-authored, built incrementally.

> **Visual map:** open [`MAP-ATLAS.html`](MAP-ATLAS.html) in a browser (double-click;
> it's self-contained) for a force-directed flowchart of every layer with ↑/↓ badges
> on the rooms that connect up/down. Regenerate after any map change with
> `node tools/passage-graph.mjs --atlas`. The same tool does `--check` (link integrity)
> and `--json` (the raw graph). It is generated **from the Twee source**, so it never
> drifts from the actual passages.

## The register gradient

The horror changes flavour with depth — one continuous slide on one corruption
meter, **poisoned up top → possessed below**:

- **Sewer (L1–3): bathroom-horror + implied mutagenic industrial waste.** Privy /
  latrine / drain dread (lands on `RESEARCH-demonology-filth.md`: Šulak, Akaname,
  Kanbari-nyūdō) over leaking drums, chemical foam, runoff that shouldn't be that
  colour. The filth here *mutates flesh* — demon rats are mutated vermin; sewer
  Snares deal contamination/`$corruption` from exposure, not bargains.
- **In-between (L4–6): carnival energy** at the hellmouth — garish, festive,
  sinister fun; toxic blurring into supernatural.
- **Hell (L7–9): infernal** — purely demonic, ending in L9's sulfur castle.

**No central planning.** Every structure and the whole layout is organic,
accreted, illogical — meandering corridors, dead-ends, wrong turns. Not a grid.

## The bestiary (and the metaphysic under it)

**The sewer is mutagenic, and the mutation is *collective*.** The core claim — the
same one the Catacomb whispers (*"the dirt is how the demons get to be"*) — is that
the filth of the earth all swirls together into an evil **far greater than the sum
of its parts**. Filth doesn't merely rot down here; given enough dark and time, it
*agrees*. That is the engine of the whole register gradient: poison up top, pooled
into will below. Enemies grow in flavour with depth the way the horror does:

| Band | Creatures | What they are |
|------|-----------|---------------|
| **Sewer (L1–3)** | **demon rats**, **rat men** (denned in L3 `TheSumpGalleries`), **shit golems** (L3 `TheBoneWeir`) | the mutagen at work. Rats are mutated vermin; **rat men** are what a rat becomes when the mutation finishes it (upright, handed, hungry); **shit golems** are the thesis made flesh — a thousand discarded harmless things pooling into one shared, oversized appetite. |
| **Deep hinge / between (L3–4)** | **drain-crawlers**, **the drowned**, **kappa**, **the Glut** (boss), & stranger things | past the hinge where chemistry becomes intent, the deep throws up things that fit no clean category — the blind pale crawler; the drowned dead the flood keeps and raises for a passing lamp (L4 `TheDrownedChoir`); and the **kappa**, beaked webbed drowners who run a sunken sewer-//sentō// (L4 `TheBathhouse`) where the hospitality *is* the drowning — bested not by force but by the **bow** (folklore: a kappa must bow back, spilling the water-dish that is its strength), a path the deep locks once you're too corrupted to bend like a person; either way the spilled dish — the only clean water in hell — cleanses you. (The same kappa, industrialised, **tend the rendering vats** down in L8 and serve as the **vats' press-gang recruiter** — the `vatpress` encounter, the kappa parallel of the sty-hand's `pigpress`; to a kappa a rendering-tub and a bath-tub are the same work, "only the water in it ever changes.") And at the very bottom of the drowned galleries, in the well everything drains into, **the Glut** — the named apex shit-golem, the thesis taken to its limit: every harmless thing that ever washed down here, pooled into one will at last (L4 `TheDeepWell`, optional boss; weak only to BLUNT, like all aggregate filth). |
| **Hell (L7–9)** | **the grafted**, **the gorgers**, **pig demons** (incl. **sty-hands**) | true demons / made things, not aggregate filth. **The grafted** (L7) are assembled from spare parts — a beatable hell fight. **The gorgers** (L8) are the things that grow on discarded flesh and now render it at scale (Tallow is one) — a tanky wall. The **pig demons** den & breed in L7 (`TheSty`) and **rule the sulfur castle (L9)**; the lowest of them are the **sty-hands**, shovel-armed boar-labourers who work the pens and double as the deep's **press-gang** (the recruiter that hauls the idle to a shift — the job-aware "pigpress" encounter). And the **pig-form kidnapper of the intro is one of them**: the answer to *who took you and why the bottom of hell would want you*. |

**The world reads you back by band (2026-06-25).** Each band's resident class — sewer = **rat**, the L4
& L8 deeps = **filth**, the rest = **pig** (`setup.classOnFloor`) — is also the lens it judges *your*
body through. The **systemic regard** (`setup.regardOf`) reads a body whose dominant class matches the
band as **kin** (claimed — the press-gang waves you past as one of its own) and a mismatched one as
**wrong**, and it reads by **scent**: the shit-golem is an odor with just enough cohesion to come at you,
and the aggregate cannot tell a filth-bodied player from itself by smell. So the bestiary isn't only what
fights you — it's what *recognizes* you. **Full spec: `docs/TRANSFORMATION.md` → Systemic regard / the
olfactory pass + nose-blind.**

Engine: `setup.enemies` (in `sewer-demons.twee`) holds `rat`, `ratman`, `shitgolem`,
`crawler`, `drowned`, `kappa`, `grafted`, `gorger`, `pigdemon`, the boss `glut` (L4
`TheDeepWell`), `pig_pressgang` (the sty-hand / press-gang recruiter), and `shortweight`
(the WIS-ambush combat form of the **short-weight men** — the deep's opportunist tricksters
who read your *dumped* ability and test it; the third ledger. No band gate: they keep score
on every floor. Full spec: `docs/COMBAT.md` → "The short-weight men — the third ledger"), and the
**smoke creatures** `shadowperson` + `smokewisp` (Phase 0 of a proposed 4th "smoke" class —
`HANDOFF-SMOKE-CREATURES.md`; built `filth`-class for now). These are the first carriers of **identity
damage** (`idmg`): they barely tear flesh but corrupt you on every landed hit — you can *win* and still
walk out further gone (dispersed, "less singular"). The shadow-person's `chorus` move takes from two
segments at once; you scatter smoke rather than kill it, and scattering it means breathing it (the
scatter-toll). They den in the **fuming band** — `TheGuttering`, off the still (L6). Full spec:
`docs/COMBAT.md` → "Identity damage". The kappa
(L4 `TheBathhouse`) carries a non-combat alternative — the bow-duel (`setup.composedEnoughToBow`,
gated on `corruption < BOW_CORRUPTION_MAX`) — the first creature you can resolve by *comportment*. The per-layer pattern is to add a band-appropriate
entry and wire a real encounter (not just data). Sewer Snares still deal contamination/
`$corruption`, not bargains; the *bargains* are the named demons (L2/L4).

## The layers

| # | Layer | Band | Depth (clock) | Theme |
|---|-------|------|:---:|-------|
| 1 | The Storm Drains | sewer | 1 | rain, grates, daylight, the exit shaft; chemical runoff, foam, dead rats |
| 2 | The Trunk Mains | sewer | 2 | big brick mains, machinery, fatbergs; leaking drums, mutagenic sludge **← exemplar built** |
| 3 | The Old Drains | sewer | 3 | oldest masonry; where the chemistry stops being chemistry **← built (20 rooms)** |
| 4 | The Drowned Galleries | between | 4 | flooded pillared halls, wrong reflections |
| 5 | The Hellmouth / Throat | between | 5 | the threshold mouth (3 rooms); spawn after kidnap; the sewer flows in from outside; **the stairs down into the Shambles are at the back of the throat** |
| 6 | The Shambles | between | 6 | hell's edge; commerce, carnival; **market ↔ tavern linked by back alleys** (not via the mouth) |
| 7 | The Belly of the Beast | hell | 7 | dense demon town — deeper market, dens, dives; **sigil-fragment 1** |
| 8 | The Rendering Works | hell | 8 | hell's industry; gorgers, tallow-vats, the pits; **sigil-fragment 2** |
| 9 | The Sulphur Deep | hell | 9 | the bottom; throne-ward; a sulfur castle raised by 9 hydrothermal vents — bright canary-yellow Frasch/Louisiana-sulfur crust; **sigil-fragment 3**; `TheCinderfall` (the ash-flat dead-end) holds the **frog-conscript digger** — a non-combat NPC, a WWI-sapper-dead labourer broke to the work, who points across the Deep at the **burning tree** and tells you its fire "will burn through anything" (the breadcrumb to the `brand` → the L2 Fatberg escape gate) |

`setup.depthOf[passage]` = the layer number; deeper accrues toward the
`setup.SEAL_LIMIT` (**200**, tunable) belonging-seal faster. The seal bites on
**both** sides: sealed in the deep → `EndingResident` (`kept`); sealed reaching
for the surface → `EndingTrapped` (`lost`).

## Per-layer room template (≥20 rooms each)

| Type | Count | Role |
|------|:---:|------|
| **Ascent** | 1 | connects up to the layer above |
| **Descent** | 1 | connects down to the layer below |
| **Gate** | 1 | a condition to pass (item / fragment / combat / puzzle / pay-with-self) |
| **Rest** | 1 | safe; heals `$hp` to max |
| **Cache/Puzzle** | 3 | treasure (coins/items) or a puzzle-piece |
| **Snare** | 2 | bad-end rooms — usually *triggered* (do the thing → end); one is a pay-with-self temptation |
| **Passage** | ~11 | atmosphere / navigation / dead-ends / optional encounters |

Gates guard the **progress direction**: sewer layers gate *ascent* (escape is
hard), hell layers gate *descent* (the pieces are guarded).

## The meta-puzzle (escape key)

Three **sigil-fragments**, one in each hell layer (7,8,9). All three →
the **Unbinding Sigil** (`setup.hasSigil()`). The Sigil frees you not by climbing
but by **un-belonging** — it lets a person walk out the front of hell as a thing
hell has no claim on (neither demon nor prey). *Status:* **COMPLETE.** All three
fragments are placed and collectable: `sigil_warrens` (L7 `TheNavel`, gated by
`TheSphincter`), `sigil_rendering` (L8 `TheTallowHeart`, gated by `TheRenderLock`),
`sigil_deep` (L9 `TheThroneWard`, gated by `TheCastleGate`). With all three,
`setup.hasSigil()` → true and the **Hellmouth** offers **`EndingUnbound`** — the hard,
true exit: walk out the front of hell owing nothing, owned by no one (banks the new
`unbound` fate). The rope→climb escape (L1) remains the *other* working exit.

## Cross-life marks (metaprogression)

Specific corruption **fates/marks accumulate across playthroughs and never wash
off** (pure accumulation; boss decision). Persisted via SugarCube `memorize`/
`recall` (survives `Engine.restart` + browser sessions). The **meter still starts
clean each life** — only the marks carry. Enough marks **open new "win"
scenarios** a first-timer can't reach.

- Helpers (`setup`): `addMark(id)`, `hasMark(id)`, `markCount(id)`, `recordRun(fate)`
  (called by every ending — banks the fate + bargains taken: `faceless`/`rendered`/
  `indebted`), `forgetMarks()` (dev reset).
- Fate marks: survivor · marked_escape · damned · kept · lost · died · taken ·
  sovereign · **unbound** (the meta-puzzle win — all 3 fragments → `EndingUnbound`).
  All are reachable.
- StoryInit recalls `$returns` (prior run count) + `$marks` snapshot; intro +
  demons give callbacks to returnees.
- **First unlocked win:** `hasMark("damned")` → the Hellmouth offers
  **EndingSovereign** ("walk out as what you became" — bypasses rope/sigil; the
  mouth opens for its own). Banks `sovereign` for future compounding unlocks.

## Build status

- **Built fully (~20 rooms each — 7 of 9 layers):** **L1 The Storm Drains**, **L2 Trunk
  Mains**, **L3 The Old Drains**, **L4 The Drowned Galleries** (the whole mortal-sewer
  escape spine), and the **entire hell band** — **L7 The Belly of the Beast** (Cronenberg body horror),
  **L8 The Rendering Works** (the flesh-factory), **L9 The Sulphur Deep** (the pig-demon
  sulphur castle). The full descent L5→L9 and ascent L4→L1 are traversable end to end.
- **THE SIGIL IS COMPLETE & WIRED:** all three fragments placed (L7/L8/L9); collecting
  all three → `setup.hasSigil()` → the Hellmouth offers **EndingUnbound** (walk out the
  front of hell as a thing it has no claim on). The meta-puzzle is fully playable.
  sulphur castle), **L5 The Hellmouth** (the threshold/spawn), and **L6 The Shambles**
  (the carnival hell-town). **ALL NINE LAYERS ARE BUILT (~20 rooms each; 220 passages).**
  The full map is traversable end to end, both directions, and every layer lives in its
  own `layerN-*.twee` file (core = systems + intro + combat + endings only).
- **To do:** demon re-theme (Whisperer/Tallow/Understudy against the research bestiary),
  audio assets, and a polish/balance pass — see HANDOFF §9. The *structure* is complete.
  (a drowned, red-lit stair past the drowned choir — not yet traversable; the drowned
  galleries are the provisional secret bottom-route into hell, to open when L7+ lands).
- *Note:* every layer now lives in its own file — `layer1-storm-drains.twee`,
  `layer2-trunk-mains.twee`, `layer3-old-drains.twee`, `layer4-drowned-galleries.twee`.
  All legacy layer rooms were consolidated out of `sewer-demons.twee`; **core now holds
  only systems, the intro, the hellmouth + hell town, combat, and the endings.**

## L1 The Storm Drains — room roster (reference)

The climax/escape layer, just under the street. Register: **hope betrayed** —
daylight through every grate, the city audible and oblivious overhead, false exits
everywhere, and the dawning sense the contamination flows *up* into the world (seeds
the Sovereign theme). Enter from L2 (`TheRisers` → **TheCatchbasin**, hub). The escape
spine: **Outfall** (find the honest route → `$foundRealExit`) → **Maintenance** (the
GATE — needs the rope, or `EndingTrapped` if sealed) → **ExitShaft** (the climb →
corruption-keyed endings: TrueEscape / Pyrrhic). Rest **TheGaugeHouse**; Caches
**TheStreetCatch**, **TheGulley**, **TheStrainer** (the gutter's-down sediment of the
ordinary world); Snares **TheAreaGrate** (a "helpful" passer-by at a street grate who's
something that got out *before* you → `EndingHelper`, banks `taken`) and **TheFoamfall**
(wash in the clean-looking foam → it takes the live layer under the filth, pay-with-self);
combat **TheRatDrift**/**TheRatDriftCleared** (a rat fattened on a raft of drowned rats); the rat vice
sites **TheLarder** (off TheCulvertRun — the fallen cheese pallet: the rat FOOD faucet `eatCheese` + the
nest-rest + the Cantor's magic-learn) and its deeper spur **TheCurdworks** (the rat **JOB** — the rats
cure the cheese; `setup.cheeseShift`, paid in the wheel = **payment-in-kind**);
Passage filler **TheStormFront, TheRiverMouth** (barred outfall to the river),
**TheSubwayBreach, TheCulvertRun, TheTideFlap, TheRainShaft, TheGalleryOfGrates**
(the city walking overhead), **TheJunctionVault, TheStreetStair** (a rusted-shut hatch).

## L2 Trunk Mains — room roster (reference)

Hub **Confluence**; Ascent **TheRisers** (→L1); Descent **TheSiphon** (→L3
DrownedHall); Gate **TheBlackValve** (contaminated flood — wade for `$corruption`
or drain it via **TheValvePuzzle**); Rest **ThePumpRoom**; Caches **TheGritTrap**,
**TheLostConduit**, **TheValvePuzzle**; Snares **TheStallRow** (open the wrong
stall → taken), **TheBackflow** (the "wash yourself clean" lie → pay-with-self);
demon bargain **Gut** (Tallow); combat **GritChamber**/**GritChamberCleared**;
Passage filler **TheScreeningHall, TheFatberg, TheDrumStore, TheWeir,
TheManholeBase, TheRatRun, TheSluice**.

**The Clean Pool** (off `TheRisers`, reachable before the fatberg is burned open) — the
**only CLEANSE in the game** (owner 2026-06-05: there was nowhere to *reduce* corruption,
so a clean run was impossible to even audit). A single-use clear pool you and two
**shit-golems** discover at once — a **race**: `TheCleanPool` ("new") → **fight for it**
(win → `TheCleanPoolWon` flips `$cleanPool` to "won" → wash = `setup.soothe(30)`, single-use
via `$cleanPoolUsed`) or **lose/hang back** (the "fight" choice pre-sets `$cleanPool`="fouled",
so a flee/loss leaves it fouled without touching `CombatLost`) → the golems foul it →
**drinking it raises corruption** instead. Rewards the blunt **pipe** (the golems resist edged).
The pool is per-run (corruption resets each life).

## L3 The Old Drains — room roster (reference)

The hinge layer (chemistry → intent). Enter from L2 (`TheSiphon` → **TheGreatSink**,
hub); descend to L4 via **TheOlderStair** (→ `DrownedHall`); ascend to L2 via the
gate and **TheCorkscrew** (→ `Confluence`). Gate **TheChokedArch** (a collapsed arch
+ pocket of dead gas — vent it via **TheCounterweight** for a clean pass, or force
the squeeze for `+12 corruption`); Rest **TheLimeVault** (quicklime store, rot can't
enter); Caches **TheVotiveDrain** (drain-as-wishing-well), **TheDeadLetterDrain**
(the silt of the lost), **TheCounterweight** (puzzle + coins); Snares **TheWeepingGrate**
(the grate that knows your private name → `EndingGrate`, banks `taken`) and
**TheWarmSilt** (lie in the warm silt → it's your own heat leaving you, pay-with-self);
combat **TheCrawl**/**TheCrawlCleared** (the **drain-crawler**) and **TheBoneWeir**/
**TheBoneWeirCleared** (the **shit-golem** set-piece — the reef of debris that
*gathers* and stands up; the bestiary thesis dramatized); and **TheSumpGalleries**/**TheSumpGalleriesCleared** (an optional **rat-man** den
fight in the deep maze — fodder-tier, non-gating); Passage filler
**TheOldOutfall, TheInscription** (the literal hinge — carving that slides from
plumbing to intent down the wall), **TheCisternOverflow, TheBrokenSiphon,
TheTanneryDrain, TheRootCellar, TheDripstone**.

## L4 The Drowned Galleries — room roster (reference)

The "between" band: the flooded, surreal nadir of the mortal-sewer descent.
Everything is water — mirror-still black flood, the half-beat-late reflection, the
drowned dead. Enter from L3 (`TheOlderStair` → **DrownedHall**, ascent); hub
**DeepHub**. Gate **TheReflectingHall** (a mirror-still flood you must cross — learn
the submerged causeway at **TheStillFont**, or wade for `+18 corruption`); Rest
**TheTombIsland** (the one dry slab, where the dead are *only* dead); Caches
**TheStillFont** (read-the-reflection puzzle + coins), **TheReliquary**, **TheSiltKings**
(toll-coin from drowned thrones); Snares **TheUndertow** (the inviting drain →
`EndingUndertow`, banks `died`) and **TheReflection** (your freed reflection offers
to "take a turn" → it gives you *more* weariness, pay-with-self); combat
**TheDrownedChoir**/**TheDrownedChoirCleared** (**the drowned**, mid-tier); demon
bargains **Cistern** (the Whisperer) and **Gallery** (the Understudy); Descent
foreshadow **TheSunkenStair** (the warm red-lit drowned way down into hell, not yet
open); **optional BOSS TheDeepWell**/**TheDeepWellCleared** (the well everything drains
into; wake **the Glut** — the named apex shit-golem, weak only to BLUNT — for a big coin
purse + the **golem-breaker maul** it swallowed and never digested; two safe exits if you
walk away); Passage filler **TheCatacomb** (the ossuary thesis), **TheColonnade,
TheBellChamber, TheSunkenChapel, TheArchive, TheWeepingArch**.

## L5 The Hellmouth — room roster (reference)

The threshold and the player's **spawn** (intro `WriggleFree` → Hellmouth): the literal
hellmouth of the woodcuts — a jaw of fused bone, dripstone teeth, a throat that breathes —
where the two ways of the whole game split. Register: **liminal** — anatomical threshold
horror + the dread of arrival.

**Collapsed 2026-06-05** from a 20-room anatomy tour to **THREE locations** (+ the small
`TheIndenture` pick-page added with §C) (owner
direction: *"too literal… a well-described single page, or broken up into 3 locations; the
sewer should be outside the mouth, flowing into it; the stairs down to the carnival at the
back of the throat"*). The cut rooms' best lines (the woodcut-was-a-*map* beat, the
lintel-of-every-name beat) were salvaged into the hub; the rest were dropped:

- **Hellmouth** (hub / spawn) — the **sewer flows in from outside** (you rode the gutter
  down; here is the drain). Carries the **ascent** (back up the way you came → L2
  `Confluence`), the way **deeper** (→ `TheThroat`), the **arrivals** (→ `TheArrivals`),
  and the **Sigil/Sovereign** meta-exits (`EndingUnbound` / `EndingSovereign`).
- **TheThroat** — the back of the mouth and the **descent**: the **stairs down to the
  Shambles** are here now (→ L6 `TheMidway`), and so is the **swallow-snare** (touch the
  uvula → `EndingSwallowed`, banks `died` — folds the old `TheUvula`).
- **TheArrivals** — the waiting-room, folding the old `TheReckoning` + `TheNewlyTaken` +
  `TheSackHeap` + `TheVestibule` (rest, heals to full) into one page: the clerk-thing with
  the ledger, the man with your build and a wedding ring saying *this is a mistake*, the
  sack-heap with one of them yours. One loot (`$arrivalsLooted`, sweeps the spilled
  arrival-coin). **The SPAWN** (`WriggleFree` → here) and the **work-curse fork** (§C):
  *sneak out* (→ Hellmouth, `$sneakedOut`, keep yourself) vs *be processed* (→ `TheIndenture`).
- **TheIndenture** — the willing-acceptance page (reached only from the Arrivals fork). Sign
  for a post — the **carnival cage** (→ pig, transfers to L6 `TheCageAct`) or the **rendering
  vats** (→ filth, transfers to L8 `TheBoilHouse`) — and the work-curse takes you (banks the
  permanent `work_<station>` mark; you owe a first shift on arrival). Backing out is free.

The **§C work-curse** wires these threshold rooms to two workstations elsewhere on the map:
`TheCageAct` (L6, pig) and `TheBoilHouse` (L8, filth, the new "stir the vat" interaction).
A cursed loss reels you back to your post owing a shift; the station locks its exits until you
work one. Carries between lives permanently (returner spawns pre-indentured). Full mechanics in
`HANDOFF.md §5` (Work-curse row).

Note the geography flip: L6 `TheMidway`'s back-up link now lands at **`TheThroat`** (back of
the throat), not the hub. *(Cut: TheTeeth, TheTongue, ThePalate, TheJaw, TheBreath,
TheLastTooth, TheDripstoneFangs, TheGorge, TheChoirLoft, TheWoodcut, TheLintel, TheSalivaPool,
and the TheGargoyles/crawler fight.)*

## L6 The Shambles — room roster (reference)

The "in-between" band: hell's edge, the **carnival** hell-town the player spawns into
(via the Hellmouth) and gears up in. Register: garish, festive, **sinister fun** — the
seductive almost-normalcy that is the trap; the body-horror tints the attractions but
the dominant note is the fairground. Enter from L5 (`TheThroat` stairs → **TheMidway**, hub);
descend to L7 via the wet stair behind **HellMarket** (→ `TheGullet`); **market ↔ tavern
linked by back alleys** (`TheBackAlleys`, whose off-duty barkers' **glowing smoke** is now the
**smoke vice** — `setup.drawSmoke`, the diffuse fourth vice), off whose own wet stair sits **TheStill** —
the distillery that cooks the sewer-brew (the filth **JOB**; poorly paid in coin, pays its wage in the
drink = **payment-in-kind**; `setup.stillShift`). Past the still, **TheGuttering** / **…Cleared** — the
**smoke creatures' den** (Phase 0 of the proposed 4th class; the shadow-person + wisps, identity damage,
the scatter-toll; also a faucet for the smoke vice). (Distinct from the deeper wet stair behind HellMarket
that descends to L7.) Gear/economy hub **HellMarket** (rope/gaff/
leathers/knife — the way out is bought here); combat **HellTavern** (the bet-on rat; the **sewer-brew** taps — the *filth* food-vice, bought — and
its **drinking-contest** con `TheDrinkingContest`, an easy CON check whose win is the trap) — now
named **the Hellmouth Inn**, whose barkeep **TheFlyOnTheWall** is a non-combat **information
broker** (talked to, never fought): buy him a round + tip (`$flyTipped`) and he sells the
magic-recognition flags — `$heardOfGrimoire` (the privy grimoire) and `$heardOfWord` (the
readable Hellmouth inscription) — the *paid* alternative to passive perception or the `midgossip`
overhear; and **TheMenagerie**/**…Cleared** (an escaped rat-man exhibit); Rest **TheQuietBooth** (the
one closed booth — the one thing nobody's selling); Caches **TheWheel** (a rigged wheel —
win coin or lose a sliver of self), **TheLostAndFound**, **TheTill**; Snares **TheFreakShow**
(step onto the empty stage, become a wonder → `EndingExhibit`, banks `taken`) and
**TheHallOfMirrors** (trade places with the reflection that would rather stay → pay-with-
self); Passage filler **TheBigTop, TheStage** (the ribcage entertainer), **TheGaff** (the
carnival's secrets — the strings go up and don't come down), **TheButchersStall** ("a nice
piece of somebody"), **TheConfectioner, TheCarousel, TheFortuneTeller** (right, surgically
right), **ThePuppetShow** (the devil-puppet winks at the one real person in the crowd).

## L7 The Belly of the Beast — room roster (reference)

The first hell layer. Register: **Cronenberg body horror + bathroom horror** — a
slum of grown flesh and bone, peristaltic, all orifice and transformation; the body
as architecture, as commodity, as the thing that betrays you. The pig-demons den and
breed here. Enter from L6 (`HellMarket` → **TheGullet** → hub **TheCloaca**). Gate
**TheSphincter** (a clenched muscle guarding the belly's heart — open it with the
word learned at **ThePrivyShrine**, or force through for `+22 corruption`); behind it
**TheNavel** holds **sigil-fragment 1**. Rest **TheStillborn** (the one dead, inert
room); Caches **TheMeatRow** (a market of body-parts), **TheOrganTrove**, **TheToothWell**;
Snares **TheSurgery** (the Cutter — now a **menu of body-mod GRAFTS**: pick a lamp-eye /
tireless hand / turned hide / second heart, each a real mechanical bonus paid for in
corruption to a body-part and bound permanently; pay-with-self made literal) and **TheMolt**
(climb into the molting-pit and shed your old self → `EndingMolt`, banks `damned`); the
**Fleshcutter** (off TheGutway — the one surgeon who cuts a cursed item off you, for a
scar); combat **TheBoneLoom**/**…Cleared** (**the grafted** — assembled from spare parts, a
beatable hell fight) and **TheSty**/**…Cleared** (a **pig-demon**, the kidnapper's kind — a
hard optional fight, fleeable; a "Look the boar in the face" recognition beat reveals it
was the one that took you, doing rounds). NPC **TheBreeder** (off TheBirthingDens — the
sow-breeder who husbands the kidnapped into stock; tells the belly's whole grim economy). The
**holding pens** (**TheHolding**, off TheBirthingDens) make that economy playable: **pig-slop** as the
pig food-vice (eat at the trough — heal + pig; `setup.eatSlop`) and a **fattening capture**
(**TheHoldingKept** — cross the trough mostly-pig and the pen-boars pen and finish you; `pennedFatten`).
A reusable two-way **TheGapCrossing** links TheGutway ↔ TheBirthingDens (see the fork
table below). Descent foreshadow **TheChute** (down into the L8 Rendering Works);
Passage filler **TheGutway** (the intestinal main drag), **TheVilli, TheBirthingDens,
TheLatrine** (the Šulak's cathedral — the bathroom-horror apex), **TheAbscess, TheWeepingWall**.

## L8 The Rendering Works — room roster (reference)

Hell's industry: flesh-as-**factory**, the damned rendered into product (tallow,
candles, soap — the lamp-oil the not-children sang about). The Gorgers (Tallow's
kind) work the line. Register: Cronenberg-**industrial** — order, efficiency, no
malice, just a factory that makes what it makes out of *you*. Enter from L7
(`TheChute` → **TheIntake**, a one-way drop — you arrive as raw material); hub
**TheKillingFloor**; ascend via **TheManway** (→ L7 `TheGutway`). Gate **TheRenderLock**
(time the press, or **still the line** at **TheTally** for a clean cross, or force it
for `+24 corruption`); behind it **TheTallowHeart** (the master vat) holds **sigil-
fragment 2**. Rest **TheCooling** (the cold larder of set tallow); Caches **TheTallowStore,
TheCandleWorks** (wicks are hair), **TheSoapVat** (the cruellest joke); Snares **TheVat**
(climb into the warm broth → `EndingRendered`, banks `died`) and **TheWard** (a Gorger's
render-a-piece-of-you-to-armor bargain, like Tallow's — sets `$hasWard`, pay-with-self);
combat **ThePits**/**…Cleared** (a **gorger**, the L8 wall); Descent foreshadow **TheRunoff**
(the brimstone glow of L9 below); Passage filler **TheLine** (disassembly), **TheHooks,
TheBoilHouse, TheGreaseTrap** (the unrenderable remainder — bones), **TheForemansWalk**
(the management's view: the least infernal, most frightening), **TheTallowFalls**.

## L9 The Sulphur Deep — room roster (reference)

The bottom of everything: a sulphur castle raised by **nine hydrothermal vents**,
bright canary-yellow Frasch/Louisiana-sulphur crust, **full of pig demons** ruled by
their **lord** (the kidnapper's master). Register: infernal grandeur + the poison band
come *full circle* — the brimstone is both spiritual and chemical; the foam on the L1
storm-drains and the burning here are the same substance met at both ends. Enter from
L8 (`TheRunoff` → **TheBrimstoneShore**); hub **TheVentField**; ascend via **TheRunback**
(→ L8). No layer below — this is hell's floor. Gate **TheCastleGate** (a curtain of
sulphur-fire — cross on the **crust-bridge** traced at **TheNineVents**, or burn through
for `+26 corruption`); behind it **TheThroneWard** holds **sigil-fragment 3** *and* the
**lord's offer** (stay and be its heir → `EndingHeir`, banks `sovereign`). Rest **TheCrust**
(a cold yellow shelf); Caches **TheSulphurHoard** (sulphur-jewels), **TheVentMouth**,
**TheTribute** (the lord's cut of the harvest); Snare **TheThinCrust** (lie down on the
warm bright skin of the world → `EndingSublimed`, banks `died`); combat **TheCourt**/
**…Cleared** (a **pig-demon** courtier); Passage filler **TheNineVents** (the lungs of
the bottom), **TheYellowHall, TheSolfatara** (the fuming field where the circle closes),
**TheFumarole, TheVitriol** (acid pools), **TheGypsumWalk, TheCanaryCrust, TheCinderfall**
(the actual bottom — only up from here).

## Clean-vs-dirty route forks (owner 2026-06-07)

Four optional pockets, one per band, each reached **two ways** to a far-side cache: a **guarded
clean path** (a layer guard you **fight OR pay**) or a **discreet dirty shortcut** that **corrupts
you unless you carry the counter**. New rooms, additive — each hangs off an existing hub and loops
back, nothing rewired. (Engine/handoff: see HANDOFF §5 *Clean-vs-dirty fork*.)

| Layer | Junction → cache | Off hub | Guard (fight/pay) | Discreet hazard | Counter |
|---|---|---|---|---|---|
| L4 | `TheSluiceFork` → `TheSumpVault` | DeepHub | drowned / 12c | wade the black sluice (+16) | **waders** |
| L8 | `TheConveyorFork` → `TheColdStore` | TheForemansWalk | gorger / 22c | cross live steam (+18) | **switch** at `TheVentControl` (`$ductVented`) |
| L9 | `TheFumeCut` → `TheVentCache` | TheVentField | pig-demon / 24c | walk the fume-cut (+18) | **gas-mask** |

`waders`/`gasmask` are new tools sold at HellMarket (10/12 coins); `rope` is the existing climb-tool.

**L7's fork was promoted to a real thoroughfare (2026-06-08).** The old single-use `TheGapFork`→`TheHollow` loop-back is gone; in its place `TheGapCrossing` (+ `TheGapCleared` lander) is a **reusable, two-way** span linking **TheGutway ↔ TheBirthingDens** (each room links in, setting `$gapDest`). Both paths are read on entry: the HIGH bone-bridge (creatures up ahead — fight the wardens once → `$gapCleared`, free forever, OR pay **18 coins** each crossing) vs the LOW crevice (filthy — **+16 corruption** each crossing unless you carry **rope** to swing the clean gap). One-time coin stash at the lip (`$hollowLooted`).
The pattern is trivially extensible — copy a junction, pick a hazard + counter.
