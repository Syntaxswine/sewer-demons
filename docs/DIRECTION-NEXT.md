# Direction Notes — the Next Systems

Owner direction (2026-06-04), captured for the builder who picks this up after a
context clear. **The map is structurally complete** (all 9 layers, ~20 rooms each,
the Sigil meta-puzzle wired). The work below is the next phase: mechanics and depth,
not more rooms.

Each note has the **owner's directive** (do this) and **implementation thoughts**
(my suggestions — *not* locked; the owner designs by enrichment, so treat these as a
starting shape to overturn, and ask at real forks). The big one is §3.

---

## 1. Carnival gambling (L6 Shambles)  ✅ DONE (2026-06-04, mechanics)

**Owner:** *The carnival will likely have gambling mechanics. Simple wheel betting games.*

**Shipped (mechanics — owner is writing the final wheel-option prose; current prose is
serviceable placeholder, flagged in the passage):** `TheWheel` is now a repeatable bet
with two modes — **coin** (stake `setup.WHEEL_STAKE` = 4 coins) and **"asking for
trouble"** (a self-bet, no coins). Outcomes (`setup.WHEEL` / `setup.spinWheel`):
- **coin** — jackpot 3% (+40), win 12% (stake×3), **push 50% (lose your bet, nothing else)**,
  **lose 32% (lose your bet + a *little* transformation)**, curse 3%. House edge ~−1.4/spin.
- **trouble** — jackpot 10% (+60), win 15% (+15), **lose 35% (a little transformation)**,
  **transform 20% (a deep bite)**, curse 20%. No coin push — you don't get off clean.

Owner's severity ladder (2026-06-04): **push = lose the bet; lose = lose the bet *and* a
little of you.** All the transformation routes pig corruption through `setup.corrupt`
(carnival = pig class), so the wheel feeds §3 — gambling is a corruption faucet by class.

The curse the owner asked for is the **mouth-misspeak** (*"asking for trouble … your mouth
sometimes picks another option than the one you chose, maybe 5%"*): a one-time document
**capture-listener** (in StoryInit, registered once, survives restart) that, when
`$mouthCursed`, redirects ~5% (`setup.MISSPEAK_CHANCE`) of choice-clicks to a *different*
link on the passage. Composes everywhere — combat included (you go to flee and your hand
swings instead). Shown in the sidebar ("Your mouth no longer always says what you mean").
**Currently in-life** (resets each run); **open fork:** make it a cross-life *cursed
object / tattoo* per the seals/curses-carry-over rule if the owner wants it permanent
(it's deliberately not, to stay legible and non-brutal). See HANDOFF systems table.

**Carnival trap enrichment (2026-06-04, owner: "the circus area has a lot more spots for
traps"):** L6 is now seeded with **lingering traps** — optional "linger too long" choices
that cost a little **pig** corruption: TheMidway (let the fun have you), TheBigTop (watch
the show), TheStage (try a turn), TheGaff (follow the string), HellTavern (drink the cup),
TheBackAlleys (the glowing smoke), TheCarousel (ride it), TheFortuneTeller (hear the rest),
ThePuppetShow (stay for the next show). **Food vendors feed you pig** (owner): TheConfectioner
(free sample) and TheButchersStall (a cut, 2 coins) both **heal a little hp** (the bait) and
rub in **pig** corruption (torso). And the **cage act** (new `TheCageAct`, off TheStage):
the barker talks you into the cage to play an oddity for coin (a repeatable coin↔pig faucet);
the barker's "help" is the **motley** (new `costume` item) — taking it costs a deeper pig
hit but pays better per turn (`$cageDressed`). All composes with §3 (carnival = pig class);
the lengthy lingering = a pig-build path. **Gotcha logged:** never pass `random(x, y)` as a
`<<corrupt>>` macro arg — the space splits the parser → NaN; compute to a temp first.

Original note retained below.

**Where it lands:** L6 `TheWheel` (`layer6-shambles.twee`) is already a stub for this —
right now it's a one-shot rigged spin (`$wheelPlayed`). Expand it into a real
betting loop. There's room for more games off `TheGames` (the bible's "ring the bell,
hook the duck, guess which cup the soul is under").

**Implementation thoughts:**
- Keep it **simple wheel betting**: pick a stake (coins), spin, win/lose by a
  weighted roll. The honest cheat is already written into the prose — the barker's
  hand never leaves the brake — so the odds *should* be tilted against the player
  (house edge), and the "win just often enough to keep you turning it" is the trap.
- The interesting twist (already seeded): you can bet **coin** or bet **yourself**.
  Losing a self-bet should cost corruption (and, once §3 lands, target a body
  segment / feed a mutagen class — gambling in a pig-run carnival exposes you to
  *pig*). That makes the wheel a corruption faucet disguised as fun.
- Mechanically trivial — `random()`, a stake variable, a payout table. The design
  work is the *temptation curve*, not the code. Don't over-build; 1–2 games is plenty.

---

## 2. The Rendering Works is where filth is MADE flesh (L8)

**Owner:** *The flesh factory is where filth is made flesh.*

**Reframe to reconcile:** I built L8 (`layer8-rendering-works.twee`) primarily as
*reductive* — bodies rendered DOWN into product (tallow, candles, soap). The owner's
note adds the *generative* direction: it is where **filth is made flesh** — the engine
that turns raw filth UP into the flesh that the belly (L7) grows with and that
ultimately **transforms the player** (see §3). Both directions are true (a real
rendering works both breaks down and builds up), but the **generative** reading is now
primary, because it makes L8 the thematic ORIGIN of the mutagen.

**Implementation thoughts:**
- This ties L8 directly to §3: **the mutagen classes (rat / pig / filth) are made
  here.** The Rendering Works is where filth becomes the flesh that then becomes you.
  Consider an L8 room or beat that makes this explicit — vats where filth is cultured
  into raw class-flesh, sorted by class, sent up to the belly to be grown and down
  to the harvest to be worn.
- Likely a prose/concept pass on L8 (add the generative beat), not a teardown. The
  existing rooms (TheBoilHouse, TheLine, the master vat) can carry the new reading.
- If §3 needs an in-world *source* for a mutagen class the player hasn't been exposed
  to elsewhere, L8 is the place to acquire it.

---

## 3. Per-segment corruption & limb transformation  ✅ DONE (2026-06-04)

**Shipped.** Full spec now lives in `docs/TRANSFORMATION.md`. Summary of what landed and
the owner calls that shaped it:
- **Six segments × three classes**; `$corruption` became a derived **mirror = average** of
  the segment totals (owner), so every legacy read kept working and only the 55 write-sites
  changed (→ `<<corrupt segment class amount>>` / `<<soothe amount>>`).
- **Deterministic thresholds 30/50/75/100** (owner) → tingle/tainted/turning/turned; a
  segment turns into its dominant class at 100. **Class is set by the source** of the
  corruption (the band + the body part — wading→leg/filth, fumes→head, grafts→arm, the
  carnival & sulphur castle→pig).
- **Loss reframed toward autofail** (owner): a corrupt **arm** drags your swing, a corrupt
  **leg** your flee (`setup.limbPenalty`); the `gte 100` become-ending now means *fully
  transformed*. Transformed limbs grant `FORM_MODS` stat shifts (a real build).
- **Resets each life** (owner; cross-life carriers are seals/cursed-objects/tattoos), with
  the **creature-kin** twist: becoming wholly one creature banks a lingering `kin_<class>`
  mark (`setup.isKin`) that should make that species friendlier.
- Visible 6-segment **Body readout** in the sidebar (field-guide monospace).

**Remaining follow-ups** (in TRANSFORMATION.md → Open/future): wire `limbPenalty` into actual
room checks (the lever example); spend the `kin_*` marks on friendliness; rat is under-sourced
(add rat-den corruption sites). The §2 note below is **partly addressed** — L8 is now class-tagged
`filth` as the mutagen's origin; a dedicated generative beat in L8 prose is still open.

### (original notes, retained for reference) ← THE BIG ONE

**Owner:** *Transformation and corruption should likely be broken down by % of
corruption per body-part segment: head, torso, right arm, left arm, right leg, left
leg. As corruption goes up it's easier for the limb to transform into whatever class
of mutagen the player has been exposed to. Example classes: rat, pig, filth demon.*

This replaces the single global `$corruption` (0–100) with **six segments**, each with
its own corruption %, plus **mutagen-class exposure** tracking, plus **transformation**
when a segment corrupts enough. It's the spine of the game's body horror made
mechanical. It also touches a LOT of existing code — plan the migration carefully.

### 3a. Data model (suggested)
```
$body     = { head, torso, armL, armR, legL, legR }   // each 0–100, % corruption
$exposure = { rat, pig, filth }                        // cumulative exposure counters
$form     = { head:"human", torso:"human", armL:"human", ... }  // what each segment has become
```
- **Keep a derived global** for backward-compat: `setup.totalCorruption()` =
  avg (or max) of the six segments. Point the existing reads at it (see 3d) so the
  meter, combat penalty, and ending thresholds keep working while you migrate.

### 3b. Applying corruption to segments
- Today ~80 rooms do `<<set $corruption to $corruption + N>>`. Replace the *concept*
  with a helper: **`setup.corrupt(segment, amount, class)`** — bumps one segment AND
  records exposure to a mutagen class.
- Migrate the **thematically specific** sites first: wading/black water → legs;
  bad-air/foam/brimstone → head+torso; face bargains (Understudy) → head; Tallow's/
  Gorger's ward (a rendered limb) → a specific arm; the saliva pool → whatever
  touches it. Leave generic exposure to spread across segments (or a contextual
  default per layer).
- **Class tagging is by place/source**, and the bestiary already defines the classes:
  rat-things (sewer vermin, the belly's rat-men) → `rat`; pig-things (the sty, the
  sulphur deep, the kidnapper) → `pig`; filth/aggregate (drowned, shit-golem, the
  rendering) → `filth`. So WHERE the player spends corruption decides what they
  become. That's a lovely emergent build system — a player who keeps wading sewers
  goes rat; one who deals with the pig court goes pig.

### 3c. Transformation
- **Scaling probability:** as a segment's % rises, the chance it transforms into the
  **dominant exposure class** rises (owner: "as corruption goes up it's easier"). E.g.
  on each corruption bump, roll `random(1,100) <= segment%` → if it hits and the
  segment is still human, transform it into `argmax($exposure)`.
- A transformed segment is then that class (lock it, or allow further drift). Consider
  thresholds (the limb is "tainted" at 50, "turning" at 75, "turned" at 100) for prose
  beats even before the full transform.

### 3d. Where the global `$corruption` is read TODAY (migration checklist)
The single meter is load-bearing in a handful of places — repoint these at
`setup.totalCorruption()` (or redesign per-segment), then the ~80 *write* sites can
migrate incrementally:
- **StoryCaption** — the meter + body-state line (this becomes the per-segment readout;
  see 3e).
- **PassageHeader** — the global-loss check `$corruption >= 100` → `EndingBecome`.
  (Per-segment: maybe "all/most segments turned" → become, instead of a single number.)
- **Combat** — `setup.corruptionPenalty()` (−1/25). Could become per-relevant-segment
  (arm corruption hurts your swing; leg corruption hurts your flee).
- **Endings** — `ExitShaft` uses `$corruption >= 70` → Pyrrhic vs TrueEscape; several
  endings key off it.
- **A few rooms** show corruption-tier variant prose (`>= 35`, `>= 70`).

### 3e. The payoff — make it VISIBLE and make it MATTER
- **UI:** StoryCaption's body-state line becomes a **6-segment character readout** (the
  field-guide aesthetic — monospace, low-key; a little body diagram or a list:
  `head human · R-arm RAT 80% · L-leg pig 40% …`). The corruption-as-filth theme
  becomes corruption-as-visible-transformation. This is a strong visual centerpiece.
- **Combat (compose with the D&D engine):** transformed segments shift ability scores,
  computed in `setup.recomputePlayer()` right alongside the cross-life `MARK_MODS` — a
  rat-arm → +DEX, a pig-limb → +STR/+CON, a filth-limb → +CON/−CHA, etc. **This is the
  cleanest integration point: transformations are just in-life, per-segment stat mods,
  and the machinery to apply mods already exists.** (See `docs/COMBAT.md`.)
- **The fiction reacts:** a pig-limbed player should read as "one of them" to the pig
  demons (extend the existing `hasMark("damned")` Hellmouth recognition); the demons'
  dialogue can clock your form.
- **Cross-life:** decide with the owner whether a *completed* transformation banks a
  mark (e.g. `rat`-bodied → a persistent mark, composing with the pure-accumulation
  marks system) or resets each life. Current rule: meter resets each life, marks carry.

### 3f. Discipline
This is a big migration. Do it the way every layer was done: **compile → both-direction
link check → `node tools/combat-sim.mjs` → drive in browser → zero console**, in small
steps. Keep the derived-global shim until the new model is proven, so you never break the
existing endings/meter mid-migration. **Open forks for the owner:** does global
`$corruption` become avg or max of segments? Do transformations persist as marks? Is
transform probabilistic-per-bump or threshold-deterministic?

---

## 4. Level-up / XP mechanic  ✅ DONE (2026-06-04)

**Owner:** *Adding the level-up mechanism is another good goal.*

**Shipped.** Killing an enemy grants XP = `statLevel × hd × 4`; cumulative thresholds
`60·(L−1)·L` (L2=120, L3=360…) raise `$level`, which lifts every ability on the existing
`baseScore` curve. `setup.gainXP()` does the award + multi-level loop + grants the new max
HP (not a full heal); `CombatVictory` calls it and narrates the level-up; the StoryCaption
statsheet shows `XP n / next`. XP/level reset each life (marks remain the cross-life track).
**Target met: 5 rat-men = level 2.** Full spec in `docs/COMBAT.md` → *Leveling & XP*; sim
extended with a POWER CURVE + XP ECONOMY readout (`node tools/combat-sim.mjs`). Verified
compile → drive → zero console.

One **open fork** left for you (also noted in COMBAT.md): should a deep run bank a
mechanical head-start across lives? If so, do it as a *mark* (e.g. a starting-level bump),
not by carrying `$level` through `Engine.restart` — keep "meter resets, marks carry" clean.

---

## Suggested order for the next builder

1. ~~**Level-up (§4)**~~ — ✅ done 2026-06-04 (the warm-up).
3. ~~**Per-segment transformation (§3)**~~ — ✅ done 2026-06-04 (the big one). See
   `docs/TRANSFORMATION.md`.
2. ~~**Carnival gambling (§1)**~~ — ✅ done 2026-06-04 (mechanics; owner writing final
   wheel prose). Self-bets feed pig corruption; the "asking for trouble" curse is the
   mouth-misspeak.

**All four owner direction notes are now addressed.** Remaining open threads: the §2
generative-L8 prose beat; spend the `kin_*` marks (friendliness); wire `limbPenalty`/the
mouth-curse into more room checks; rat is under-sourced; and the owner's final wheel copy.

Use the `sewer-demons-add-creature` skill for any new enemies; keep `docs/COMBAT.md` and
`tools/combat-sim.mjs` in sync; keep `docs/MAP-ARCHITECTURE.md` current. And read
`docs/TO-THE-BUILDERS.md` — there's a letter for you there.
