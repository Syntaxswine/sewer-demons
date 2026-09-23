# Direction — Hellmouth rework · Arrivals intro · the Work-Curse · per-species body text

Owner direction, 2026-06-04. This is the **next phase** (the four notes in
`DIRECTION-NEXT.md` are all shipped, as are the fire-gate, the rat/golem encounters,
the blunt-damage type, and the corruption-tiered cage flavor). Captured as a handoff
**to build from next** — nothing here is built yet.

Format, as in `DIRECTION-NEXT.md`: **Owner** = the directive (do this). **Notes** = my
implementation/integration thoughts and open forks — *not* locked; ask at the real ones.

> **Discipline reminder (don't skip):** compile → both-direction link check (dead links
> AND the cleared-lander dynamic-orphans) → `node tools/combat-sim.mjs` if combat math
> moves → drive it in a browser → zero console. And the sharp one this phase will hit:
> **any DISPLAYED prose stored on `setup.*` must live in a raw-JS `<<script>>` block**, not
> the StoryInit `<<run>>` block, or TwineScript desugars operator-words inside the strings
> ("and"→"&&", "to"→"=", "is"→"==="). See `HANDOFF.md §4` and the existing
> `setup.CLASS_SENSE/CLASS_TEXTURE/TURNED_DESC` block.

---

## Owner's answer — the shape of a run (2026-06-04)

A builder's-letter open question was *"is this a roguelite or a single careful traversal?"*
The owner's answer is **both, with a twist:**

> *"There should be some content that is only visible if you 'lose' — but there should also be a
> canonical good ending where you get out clean. At the moment the corruption mechanics are such
> that I don't know if it's actually possible [to get out clean]; that's a fix for a later time I
> need to think about."*

What this settles, and how to build to it:
- **There is a canonical TRUE ending — get out clean, still yourself.** That already exists in
  spirit (`EndingTrueEscape` = survivor; `EndingUnbound` = the hardest clean exit via the Sigil).
  Treat *getting out uncorrupted* as the intended "win," the line everything else is measured against.
- **Losing is not game-over — it is a content branch.** Failing, falling, taking the work-curse,
  transforming, becoming — these open a whole **underbelly you only see by losing.** So design
  losing to be **generous with content, not punishing-to-restart.** The systems already built for
  this are exactly right: `CombatLost` (lose = situational transformation, not death) and the
  planned **work-curse** (§C — death just clocks you back in at your post). Lean in: make the
  lose-paths *rewarding to explore*, the spooky downstairs of the house.
- **Therefore the clean escape MUST remain achievable — and right now it may not be.** Owner flags
  this as a **known, deferred tuning problem** (don't fix it yet; they want to think about it). But
  it sets a hard **design constraint for everything you add from here: there must exist a careful
  path through the whole map that keeps corruption low enough to reach the canonical clean ending.**
  Every new corruption faucet, gate, and forced-loss you add narrows that path — so when you add
  one, ask whether a disciplined player can still thread the needle. The **deep-helpers** below (§D)
  are part of how that path stays open. (And: *nobody has audited a full clean run yet* — the other
  open question. Before tuning corruption, someone should attempt the clean traversal end-to-end and
  measure where it becomes impossible.)

This is the **both-and**: a fixed, hand-authored map you *can* beat clean in a single careful
traversal — wrapped around a roguelite underbelly of loss-content (marks, work, transformation,
becoming) that most players will see most of, because most players will lose.

---

## A. The Hellmouth (L5) is over-built — collapse it  ✅ DONE (2026-06-05)

> **Shipped.** `src/layer5-hellmouth.twee` collapsed 20 rooms → **3**: **Hellmouth** (hub;
> sewer flows in from outside; carries ascent → `Confluence`, deeper → `TheThroat`, arrivals
> → `TheArrivals`, + Sigil/Sovereign exits), **TheThroat** (back of the mouth; the
> stairs-down-to-Shambles → `TheMidway` live here now, plus the swallow-snare →
> `EndingSwallowed`, folding the old `TheUvula`), and **TheArrivals** (the waiting-room —
> `TheReckoning`+`TheNewlyTaken`+`TheSackHeap`+`TheVestibule`-rest folded into one page; one
> loot `$arrivalsLooted`; heals to full; the seat §C builds on). Salvaged the woodcut-as-map
> and lintel-of-names lines into the hub. Cut the 17 anatomy/snare/gargoyle rooms and the
> `$reckoningLooted/$newlyTakenLooted/$sackHeapLooted/$gargoylesCleared` vars; `depthOf`
> trimmed to the 3 survivors. Re-pointed L6 `TheMidway`'s back-up link to `TheThroat` (stairs
> at the back of the throat). Verified: compile clean, 0 dead links, no stranded L5 room, and
> driven in-browser — hub/throat/arrivals render, escape-up + swallow + Sigil exit + the
> down↔up loop (lands at `TheThroat`) all work, arrivals heals 3→20 and loots, 0 console
> errors. Docs updated: `MAP-ARCHITECTURE.md` L5 roster + table + L6 entry-point.

**(Original direction below, for reference.)**


**Owner:** *"You went a little too literal with the hellmouth. It should mostly just be a
well-described single page, or broken up into 3 locations. The sewer should be outside the
hellmouth, flowing into it. The stairs down to the carnival should be at the back of the
throat."*

**Current state:** `src/layer5-hellmouth.twee` is **20 rooms** — a full anatomy tour
(Hellmouth hub, TheTeeth, TheTongue, ThePalate, TheJaw, TheThroat, TheBreath, TheLastTooth,
TheDripstoneFangs, TheGorge, TheChoirLoft, TheWoodcut, TheLintel), the arrivals cluster
(TheReckoning, TheNewlyTaken, TheSackHeap, TheVestibule), two snares (TheSalivaPool drink,
TheUvula→EndingSwallowed), and a combat (TheGargoyles/crawler). That's the over-literal part.

**Target geography (owner):**
- The **sewer is OUTSIDE** the mouth, flowing *into* it — not "the sewer is the throat."
  You came down the sewer; it empties into the mouth. (Today the hub says *"the sewer above
  you is merely the throat"* — reverse that: the sewer is its own thing, outside/upstream.)
- The **stairs down to the Shambles** are at the **back of the throat** (today they're
  "inside the mouth, past the last tooth").
- Keep it to **~1–3 locations**, not 20.

**Notes — suggested 3 locations:**
1. **The Mouth / threshold** (the rich single page): the fused-bone arch where the sewer
   pours in. The hub. Carries the exits — **out to the sewer** (↑ escape) and the
   meta-puzzle endings (`hasSigil()` → EndingUnbound; `hasMark("damned")` → EndingSovereign).
2. **The Throat**: leads back and down; **the stairs to the Shambles are at its back** (→ L6
   TheMidway). Good home for the **swallow** "third way" snare (fold `TheUvula`/EndingSwallowed
   here) — the throat is literally where you'd be swallowed.
3. **The Arrivals / waiting-room** (owner likes this — see §C): the reckoning + holding-pen +
   sacks **folded into one** well-written page. This becomes the **start** and the seat of the
   work-curse choice. Keep the strongest beats: the clerk-thing with the ledger; the man with
   your build and a wedding ring saying *"this is a mistake"*; the heap of sacks, one of them
   yours.

**Fold / cut:** TheTeeth, TheTongue, ThePalate, TheJaw, TheBreath, TheLastTooth,
TheDripstoneFangs, TheGorge, TheChoirLoft, TheWoodcut, TheLintel → cut, or salvage their best
single sentences into the three survivors (the woodcut-was-a-map beat and the lintel-of-names
beat are worth saving as lines). TheSalivaPool snare → cut or fold into the throat.
TheGargoyles combat → optional: drop it, or move the crawler fight elsewhere.

**Connections that MUST survive the collapse** (verify each after):
- Spawn: the intro lands here (today `WriggleFree → Hellmouth`; under §C the intro lands in
  the Arrivals page instead).
- ↑ **out to the sewer**: `→ Confluence` (L2). (The L2→L1 fire-gate I just built is upstream
  of this; unaffected.)
- ↓ **to the Shambles**: `→ TheMidway` (L6), now via the back of the throat.
- Endings still offered at the Mouth: **EndingUnbound** (Sigil), **EndingSovereign** (damned),
  and **EndingSwallowed** (the swallow snare, relocated to the throat).
- A **rest** somewhere (today TheVestibule heals to full) — fold into the Arrivals page or drop.
- Update `setup.depthOf` (remove the cut rooms; keep the survivors at depth 5). Update
  `MAP-ARCHITECTURE.md` L5 roster.

---

## B. Per-species body-part descriptions — the full matrix (greenlit)  ✅ DONE (2026-06-05, first draft)

> **Shipped.** Replaced the old per-class `CLASS_SENSE`/`CLASS_TEXTURE` + per-part `TURNED_DESC`
> with one nested **`setup.BODY_DESC[partType][species][stage]`** — the full **4 × 3 × 4 = 48**
> matrix (head/torso/arm/leg × rat/pig/filth × tingle/tainted/turning/turned). `segDesc` rewritten
> to index it (turned uses `form[seg]`; earlier stages use dominant `segClass`). Lives in the
> `<<script>>` block (displayed strings → desugaring gotcha). Verified in-browser: forced segments
> to each stage/species, the `.bm-desc` readout shows the right line, no operator-word bleed, zero
> console. **The prose is a FIRST DRAFT** (the builder's serviceable body-horror), flagged in-code
> and in `TRANSFORMATION.md` for the owner's voice-pass — the matrix/dispatch is the solid part.

**(Original direction below, for reference.)**


**Owner:** *"Doing that extra writing for body parts will really pay off. It's going to be
more than 3× the writing though, because it needs to vary by species."*

**Current state** (`setup.*`, in the `<<script>>` block beneath StoryInit's `<<run>>`):
- `CLASS_SENSE` — tingle (≥30), **per class only** (3 strings).
- `CLASS_TEXTURE` — tainted/turning (≥50/75), **per class only** (3 strings).
- `TURNED_DESC[partType][class]` — turned (100), **per part-type × class** (4×3 = 12).

So today the partial stages are generic-by-class. **Owner wants per-species (rat/pig/filth) ×
per-part × per-stage** — the full matrix.

**Notes:**
- Target structure: one nested table `partType × class × stage` → ≈ **4 part-types × 3 species
  × 4 stages = 48** distinct descriptions (vs ~18 today). "Species" = the three mutagen classes
  (rat / pig / filth). Part-types are head / torso / arm / leg (`setup.PART_TYPE`).
- Keep the **stage logic** the same: tingle = a *sensation* (felt-not-seen); tainted/turning =
  the change *coming in*; turned = the *finished anatomy*. Now each is part-and-species-specific
  (a pig *jaw* lengthening reads different from a pig *leg* shortening to a trotter; a rat *hand*
  vs a rat *foot*).
- Refactor `setup.segDesc(seg)` to index the one table by `(PART_TYPE[seg], segClass(seg),
  stage)`. **It all lives in the raw-JS `<<script>>` block** (the desugaring gotcha) — extend the
  existing one; do not move it into `<<run>>`.
- This is a pure-writing task with no system risk → a good warm-up or parallel track. Verify by
  driving a body through each stage per class in the browser (you can `setup.corrupt(seg, cls, n)`
  from the preview to force states).

---

## C. Start with the new arrivals · the Work-Curse (the big new system)  ✅ DONE (2026-06-05)

> **Shipped.** The full work-curse / indenture system, owner's forks settled in-session:
> **(forks)** *willing → you pick* the post / *otherwise assigned* (cross-life seed + the
> reserved `inflictWorkCurse` hook); the curse **carries between lives permanently** (banks
> `work_<station>`, pure-accumulation); a cursed loss **stacks both** (maul + back-to-post).
> **(build)** New state `$workCursed/$workStation/$workOwed/$sneakedOut` (StoryInit + self-heal
> + cross-life seed). Engine in the `<<script>>` block: `WORKSTATIONS` (cage→pig L6, vats→filth
> L8), `takeWorkCurse`/`assignStation`/`inflictWorkCurse`/`doShift`/`workRoom`/`workLabel`.
> Intro re-pointed: `WriggleFree` → `TheArrivals` (pre-indentured returners route to their post
> instead); the Arrivals fork = *sneak out* (`$sneakedOut` → Hellmouth, keep yourself) vs
> *be processed* → new `TheIndenture` (pick cage/vats → curse + first shift owed → transfer).
> Workstations: `TheCageAct` (L6) and `TheBoilHouse` (L8, new "stir the vat") each gain an
> **obligation branch** — when owed, exits lock until you work one shift (`doShift`). `CombatLost`
> stacks the curse-respawn when `$workCursed`. `StoryCaption` indenture indicator. `TheIndenture`
> added to `depthOf`. **Verified in-browser:** willing curse (cage+vats) → transfer + mark +
> locked exits + caption; shift → class corruption + unlock; cursed loss → maul + owed + reeled
> to post; cross-life → pre-indentured spawn + WriggleFree routing; sneak-out keeps you, fork
> spent on revisit. Compile clean, 0 dead links, **zero console**. (Caught + fixed a real bug:
> a literal `<<script>>` in a JS comment inside the script block broke the block at runtime —
> HANDOFF §4.)
>
> **Open (per owner's run-shape constraint):** the work-curse adds pig/filth faucets on a
> schedule — when the corruption-tuning / clean-run-audit pass happens, check a disciplined
> player can still thread the clean ending. Possible later: more stations; the `inflictWorkCurse`
> assigned-path needs an actual involuntary trigger if one is wanted (a snare, a deep-helper's
> price); shedding the curse (currently permanent by the pure-accumulation rule — confirm that's
> desired long-term).

**(Original direction below, for reference.)**


**Owner:** *"I really like the waiting area for new arrivals. You should probably start in with
them and have to sneak your way out, or receive a curse that makes you respawn at a work
location after losing a battle. If you choose to receive the curse you are transferred to one of
the floors — carnival or lower — and assigned a work station, something like the cage in the
carnival, or perhaps stirring the vats in the filth/flesh factory. And you will need to work at
least one interaction with that station every time you are forced to return to it."*

This reworks the **intro** and adds a **respawn/indenture mechanic**. It composes with the
existing lose-is-transformation system (`CombatLost`/`setup.loseFight`).

### C1. The new intro

- You **start in the Arrivals waiting-room** *with* the other newly-taken (replaces the current
  `WriggleFree → Hellmouth` drop). You wake sacked-and-dropped among them, before you're sorted.
- Two ways out of the room — the **fork that defines the run**:
  - **Sneak out** — slip past the reckoning/sorting into the mouth and the wider game.
    *Keep yourself*: normal respawn (lose a battle → `CombatLost` situational transformation as
    today). Higher risk, but you stay you longer.
  - **Take the curse** (let yourself be processed / volunteer) — you're **inducted as a worker**:
    transferred down to a floor (carnival **L6** or lower) and **assigned a workstation**. The
    curse = a **respawn point at that station** + the obligation below. Lower risk of true loss,
    but it corrupts you on a schedule.

**Notes / forks:**
- **Sneak-out** is probably a one-time choice or a light stealth check (e.g. a DEX/WIS check, or
  spend a little corruption to slip the clerk), not a whole subsystem. Owner fork.
- The intro currently is `Start → Captured → WriggleFree`. Re-point `WriggleFree` (or replace it)
  to land in the Arrivals page. Preserve the kidnap beats (the pig-Šulak snatch, the bigger thing
  plucking your captor off).

### C2. The Work-Curse mechanic

- **State (new):** `$workCursed` (bool), `$workStation` (id, e.g. `"cage"` / `"vats"`),
  `$workOwed` (bool — "you must do an interaction before you may leave"). Init in StoryInit;
  add to the PassageHeader self-heal.
- **On taking the curse:** set `$workCursed`, assign a `$workStation`, and **transfer the player
  to that station's floor** (you start the run deeper, at your post).
- **Respawn behavior (the heart of it):** today `$hp ≤ 0` → `CombatLost` → `setup.loseFight()`
  (transform) → `$combatOrigin`. With the curse: a lost battle instead **returns you to your
  workstation** and sets `$workOwed = true`. (Suggest: the curse *replaces* the `loseFight`
  transformation — you don't get mauled-into-transformation, you get *sent back to work* — and
  the mandatory work-interaction below is where the corruption comes from instead. One faucet, not
  two. Owner fork: replace, or stack both.)
- **The obligation:** while `$workOwed`, the workstation room **locks its exits** until you do
  **one work interaction**; doing it clears `$workOwed` and re-opens the way out. *"At least one
  interaction every time you're forced to return."*

### C3. The workstations (corruption faucets you're chained to)

- **The cage (L6 carnival):** `TheCageAct` already exists and is exactly this — a repeatable
  "play an oddity" interaction that pays a little coin and applies **pig** corruption (a random
  segment). Reuse it as the carnival workstation; one cage-turn satisfies `$workOwed`.
- **The vats (L8 Rendering Works):** owner's "stirring the vats in the filth/flesh factory." Build
  a **new "stir the vat" interaction** analogous to the cage — a repeatable turn that applies
  **filth** corruption (and maybe a sliver of coin/none), at one of the existing vat rooms
  (`TheVat`, `TheSoapVat`, `TheTallowHeart`, or a new `TheVatWork`). Same faucet shape as the cage.
- Both are **class-true**: cage → pig, vats → filth. Which station you're assigned biases what you
  transform into — a lovely "your job makes you" beat that feeds §B's descriptions and the
  kin-mark system (become wholly your station's class → `kin_<class>`).

### C4. How it reads as a whole

The curse is **easy-mode-with-a-cost**: you can't really die (you just clock back in), but every
death is another shift, and every shift turns you a little more into what the station makes —
until you've become a carnival-pig or a rendering-filth-thing and the become-ending (`EndingBecome`
via full transformation) closes on you *at your post*. Sneaking out keeps your shape but puts real
loss back on the table. That's the trade.

**Forks for the owner:**
- **Assigned vs chosen** station? Owner said "assigned" but also "something like the cage… or
  perhaps the vats" — assign by the floor you're sent to, let the player pick, or roll it?
- **Per-run vs cross-life?** The respawn point is per-run by nature; but "a curse" could persist
  as a *cursed object / tattoo / seal* (the established cross-life carriers) so a returnee starts
  pre-indentured. Default: per-run (chosen each start). Fork.
- **Replace or stack** the `loseFight` transformation (see C2).
- Are there **more than two** stations eventually (a belly station, a sulphur station)? The two
  named (cage, vats) are enough to ship.

---

## D. Helpers in the deep — but not free (new, 2026-06-04)

**Owner:** *"There should be some, even in the deepest reaches, who will help — although I suspect
the deeper you go they are not fully altruistic. They will want something in exchange: a task
completed, a gift of some sort, etc."*

This is how the clean escape stays *possible* (see Owner's-answer above): scattered through hell are
**helpers** — entities who will actually aid you (open a way, mend you, give you a thing you need,
point you true) — but at a **price that grows with depth.** Shallow helpers are nearly kind and ask
little; the deepest ones drive hard bargains and the help they give is half a trap.

**Notes / integration:**
- The game **already has the seed** of this — the L4 demon-bargains (**the Whisperer** marks you a
  way out for corruption; **Tallow**/the Gorger renders you a ward; **the Understudy** takes your
  face for safe passage). Those are *tempters*. The new note asks for **helpers** specifically — and
  for a **depth gradient of self-interest**: near the surface, a genuinely-helpful soul who asks a
  small favour; in the deep, something that will help you *only* if you fetch it a thing, do it a
  task, or hand over something of yours.
- **The exchange forms the owner named:** a **task completed** (a fetch/do-X errand — kill the thing
  in the next room, carry this there, light that), a **gift** (hand over an item — coins, the brand,
  a sigil fragment, part of yourself), or a bargain in the existing currency (corruption / a mark).
  A reusable **helper pattern** would pay off: `offer → price (task | gift | corruption | mark) →
  deliver the help`, with a `$helped_<id>` flag so each is once-per-run.
- **The depth gradient is the soul of it:** wire the *cost* and the *honesty of the help* to the
  layer. A helper in L4 might just want you to carry a message up; a helper in L9 wants a sigil
  fragment, or a limb, or for you to take its place — and the "help" it gives may be exactly the
  thing that damns you. The deeper, the more the help and the trap are the same gift.
- **This is the pressure-release valve for the corruption economy.** If the clean run is too tight
  (the standing concern), helpers are the designed slack: the careful player threads the needle *by
  finding and satisfying the right helpers*, paying prices that don't corrupt them past saving. So
  build helpers and the corruption tuning together — they're two sides of "is the clean ending
  reachable."
- **Fork:** are helpers fixed NPCs in fixed rooms, or a pattern you sprinkle? Do any *recur* across
  lives (a helper who remembers your marks, like the Hellmouth already does for `damned`)? And which
  ones are real help vs. dressed-up snares — probably a spectrum, deepening with the layer.

## Suggested build order

1. ~~**A — collapse the Hellmouth to ~3 locations**~~ ✅ **DONE 2026-06-05.** Geography clarified
   and the `TheArrivals` page §C needs now exists. All must-survive connections verified in-browser.
2. ~~**C — the arrivals intro + work-curse**~~ ✅ **DONE 2026-06-05.** Reused `TheCageAct`, built
   the `TheBoilHouse` vat-work, added the state + cross-life seed + `CombatLost` stacking. Verified.
3. ~~**B — the per-species body descriptions**~~ ✅ **DONE 2026-06-05** (first draft for the owner's
   voice-pass). Full `setup.BODY_DESC` 48-string matrix in the `<<script>>` block.
4. **D — helpers in the deep**: content, sprinkle as you go (extends the existing L4 bargain
   pattern). Build them *with* the corruption-tuning pass, since they're the slack that keeps the
   clean ending reachable.

**Before you tune corruption or add the next gate:** attempt the **canonical clean run** end-to-end,
as a player, and find where (if anywhere) it becomes impossible. That audit is the missing
measurement — the combat-sim measures fights, nothing measures a full clean traversal. It is the
prerequisite for the deferred "is getting out clean actually possible" fix.

Cross-references to keep current as you go: `docs/HANDOFF.md` (systems table + the §9 START-HERE
pointer), `docs/MAP-ARCHITECTURE.md` (L5 roster), `docs/COMBAT.md` (if `CombatLost` routing
changes), `docs/TRANSFORMATION.md` (the body text + kin marks), and the project memory.
