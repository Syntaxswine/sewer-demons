# Sewer Demons — Open Tasks (unfinished-work handoff)

*Snapshot 2026-06-27. A scannable digest of what's **not done**, pulled together from the
many scattered "Open from this arc" notes in `HANDOFF.md` §9. `HANDOFF.md` stays the
authoritative history + how-to-build/verify; this file is just the pick-up list. The map is
**structurally complete** (all 9 layers, 236 passages) — everything below is enrichment, not
structure. **The repo went PUBLIC on 2026-09-22 (`Syntaxswine/sewer-demons`): branch and
open a PR; the pre-public history stays on the local `archive-local-history` branch.***

> **See also `REVIEW-RPG-CANON.md` (2026-07-01):** a 32-item verified review of gaps vs the
> classic RPG canon — deliberately **non-overlapping** with this file, and the live per-finding
> tracker (SHIPPED / DECLINED / open). **The "trust / honesty" cluster is ✅ COMPLETE (2026-07-02):**
> R3 restart-warning note, R2 belonging-clock-as-settling-mind + the form-switch reset, R21 coinrot
> routing bug, R5 informed character creation, R4 tolls priced in the real currency
> (`setup.tollTag` — "pays 20 pig into your torso", would-turn escalation, curse-aware);
> **R1 (rewind arrows) DECLINED** — owner keeps player undo (see
> [[feedback_player_time_over_thesis_purity]]). **The seal-economy cluster (R10+C1) is also ✅
> COMPLETE (2026-07-02):** staying/working/gambling/leveling now cost belonging (`setup.passTime`,
> `LEVEL_SEAL`); SEAL_LIMIT retuned 360→440 against the re-run audit (floor had grown 183→223).
> The **combat-feel chain is ✅ COMPLETE 2026-07-02** (R12 signature moves · R13 crit-smear ·
> R14 threat-read · R15 packs · R16 parley · C2 morale): monsters telegraph and Guard/stun/Run
> have jobs; wounds smear; every declinable fight carries a tool-aware `<<scentof>>` read; five
> set-pieces are packs (two cross-class, the MIXED loss-marking thesis fires); Yield sits beside
> Surrender (the muzzle finally bites; the deep buys coin or labour); and badly-hurt or bereaved
> enemies can BREAK — paying nothing, refusing the turned player most of all (regard inside
> combat). Chain-closing sim + clean-run pass: green, no drift. **The world-remembers tier is
> OPEN: R17 blood ✅ SHIPPED (2026-07-02)** — kills tallied by class ($blood); kin kindness
> curdles at 3 of a kind, the floor stops offering labour at 5 (the reckoning), morale DC folds
> it in. **THE THIRD LEDGER ✅ SHIPPED (2026-07-03, `6360cca`, owner idea):** the **short-weight
> men** read your *dumped* stat and test your weakest number — six faces, fail-forward; weight
> scales with `statSpread()` so a flat build is safe and a min-maxer is hunted (creation's spread
> is now a risk curve). Closed **R9's ambush** (WIS lurker → free enemy opening turn), delivered
> **R7's fingerprint** (`setup.lastCheck`) + 6 new statCheck consumers, and **woke CHA** (the
> shunner face — CHA finally costs). **THE VICES ✅ SHIPPED (2026-07-20, owner idea):** a general
> **addiction ledger** (all vices tallied; only the DOMINANT one's craving nags; a rival must strictly
> EXCEED it to seize the call — *"spam to override"*, graceful competing-addiction failure) + **sewer-brew**
> (the *filth* food, bought at the L6 tavern; `setup.drinkBrew`) + the **drinking-contest** con (easy CON
> check, **inverted** payoff — winning is the trap; EV-verified a sucker's game, not a coin faucet) + a
> **dry-shakes withdrawal**. The cheese hook folded in as the first tenant; slop/smokes are now one-line
> `setup.ADDICTIONS` tenants. **The rest of the owner's food×class MATRIX is OPEN — see "Systems ·
> economy" below.** Next review items: R18 quest atom, R6 marks ledger, R20
> journal; R22 desc migration unlocks R23/R24 commerce. **Owner-parked (asked & answered
> 2026-07-02):** the CHA *bargain* arc (a bargain that SPENDS cha — distinct from the shunner
> that now reads a low one; R9 WIS *register-depth* queues behind it), cleanse-point tuning,
> R23's phial-of-rain, the named-demon re-theme — hold for owner input; the rest of the review
> is greenlit best-judgment. Pick-up work lives in both files.

---

## ★ Highest leverage / the "next obvious dread" (owner-brainstormed, recurring)

- **REGARD with mechanical teeth in commerce.** The world *reads* your body (regard) and you
  *read* the rooms (room-scent) — but regard is still **prose only**. A mismatched body should
  **pay more** at the Shambles market/tavern, a kindred one **less** (spends the `kin_<class>`
  marks). This is the owner's standing top pick across the last several letters. Files: the L6
  shop/tavern rooms (`layer6-shambles.twee`), `setup` regard helpers.
- **Social reaction to a transforming player, as a RULE.** Social corruption is *scattered, not
  systemic* — the `TheCageAct` barker lures with it, the Midway murmurs it, the Fly gives it
  freely — but **no room or NPC yet reacts to a pig-/rat-bodied player as a rule** (a pig-bodied
  you clocked in the carnival, etc.). The next obvious dread named by three+ letters.
- **`<<soothe>>` "relief" feed beat.** The transformation feed narrates the *fall* (corruption
  landing) but **never the easing** — the missing symmetric half. When `<<soothe>>` fires, narrate
  it. See `docs/TRANSFORMATION.md` → feed; skill `sewer-demons-expand-transformation-feed`.

## ★ The oldest debts (carried in every builder-letter)

- **AUDIO — the signature system has never made a sound.** 18 letters now. State-driven audio is
  the game's signature and there are **no mp3s**. Drop real files into `audio/` (table in
  `audio/README.md`), un-comment the `<<cacheaudio>>` block in `StoryInit`, and **verify with a
  human ear** (jsdom/automation is deaf — cross-passage continuity + end-of-track re-evaluation).
- **No human has ridden a full run.** The standing prerequisite. The INT arc especially wants one:
  gamble a mind into the gutter, survive at the floor, and crawl out *simple* — does it land?

---

## INT arc follow-ups (the arc is ✅ complete — these are the small tails)

- **Base-vs-marks caption split.** Show *who you were* (the char-creation build) vs *what the sewer
  made* (the marks) **separately** on the stat caption. Envisioned in the char-creation design,
  not built. Files: the `StoryCaption` `.ss-grid` block; `recall("build")` vs `MARK_MODS`.
- **`combat-sim` coverage for extreme builds.** Character creation now lets you build spreads the
  sim doesn't model (CON 1 ≈ a 4-HP glass cannon; STR 14 = +2 to hit). The 42-pt budget bounds
  spikes, but a tuning pass against extreme builds is unowned. Tool: `tools/combat-sim.mjs`.
- **CHA — a low one now COSTS (the short-weight shunner, 2026-07-03); a high one still spends
  nothing.** The third-ledger shunner reads a *dumped* CHA and prices you for it — so CHA is no
  longer fully inert. What's still open is the *upside*: the proven arc shape — **author → stake →
  consequence** — a **bargain that finally SPENDS a high CHA**, and a face that reads it back. (The
  named-demon/bargain pattern, not the add-creature skill.) Owner-parked pending input.
- **The `sharp` tier is under-consumed.** `setup.isSharp()` (INT ≥ 10) is wired but has only *one*
  consumer (the bones' appraise check). It wants content — sharp-only reads/options.
- **Deeper low-INT (the bigger version).** Degrade the **room prose itself** at low INT — the
  three-paragraph unfold collapsing to one blunt block, vocabulary going (the *valve* → *the round
  thing*). A larger pass than the shipped reaction-beats; the prose pass left a rich baseline to
  degrade FROM. `setup.mind()` / `isDim()` already exist.
- **More NPCs given the "simple" (INT-1) treatment.** Only 3 done (the Fly, the beadle, the
  appraiser). The selection principle (articulate NPCs condescend; dumb ones don't) is documented
  in the mind-register engine comment. Candidates: the Fortune-teller, the Whisperer, the Cantor.
- **Loaded bones (optional).** A *hidden second rig* under the gutter-bones' honest table, revealed
  by an INT/WIS check. Not load-bearing (the published odds already carry the rig), but a nice cruelty.
- **The bone-man wants a portrait + a real name.** `TheGutterBones`' caster is unnamed (a deliberate
  quiet contrast to the wheel-tout) — could earn a `<<roomart>>` portrait and a name.

## Creatures · art · NPCs (dreamed or half-built)

- **★ CHARACTER SPRITES — the open art job (2026-09-22).** Rooms now draw themselves as
  isometric sprite dioramas; the things standing in them do not exist. Full work order in
  [`../art/CHARACTER-SPRITES.md`](../art/CHARACTER-SPRITES.md): the player **paper-doll**
  (one image per body segment per mutagen class per stage — 24 minimum, 78 complete), the
  14-creature bestiary at idle/attack/down, and **four creatures with no art of any kind**
  (`grafted` — fully described in `BESTIARY-ART.md` and never drawn — plus `shadowperson`,
  `smokewisp`, and `shortweight`, which needs six faces). Pipeline and renderer are done;
  every item is a drop-in.

- **Re-theme the named demons** (Whisperer / Tallow / Understudy) against the research bestiary
  (Šulak / Akaname the filth-licker / Kanbari-nyūdō). Still first-draft text — *the most visible
  unpolished thing in an otherwise-complete game.*
- **Kappa vat-tender variant** enemy (its own art) + a **bow-out** from the L8 press-gang.
- **Hellmouth inscription: lit-when-readable image-swap.** The conditional `<<roomart>>` is wired;
  it just needs the "lit" art. See `sewer-demons-illustrate-room`.
- **Curse-removal NPC.** `setup.uncurse` stub is ready; no NPC calls it yet.
- **Wider recurring-Beelzebub presence** across the layers (the Fly on the Wall was the first
  realization; a witness whose flies are on every wall).
- **Dreamed demons** (seventh-letter sketchbook): the **wearer / hollow** (identity-horror mimic;
  the `faceless` mark + helping-hand ending hint it); the **bloom / cordyceps** (a parasite that
  could be the *caster's body* — magic easier through the fungus, at the cost of whose will casts);
  the **privy-yōkai** (Akaname / Kanbari-nyūdō / Bar Shiriqa) as low-cost creatures in existing classes.
- More **enemy types / weapons / armor** — one `setup.enemies` entry per band is the pattern; skills
  `sewer-demons-add-creature` / `-add-item` / `-add-npc` / `-add-addiction`.

## Systems · economy · tuning

- **The food×class MATRIX — the JOBS half (owner 2026-07-20).** **Filth column ✅ COMPLETE:** the
  **addiction ledger** + **sewer-brew** (food, its drinking-contest con, dry-shakes withdrawal) + **THE
  STILL** (`TheStill`, L6 — the filth **JOB** that makes the brew, paying its wage in the drink =
  **payment-in-kind**). **Pig column ✅ COMPLETE:** **pig-slop** (the food, eaten at the trough in
  `TheHolding`, L7, built onto the Belly's harvest lore) + the **fattening CAPTURE** (`pennedFatten` — cross
  the trough mostly-pig → penned & finished); the pig **JOB** already existed (dens-work + vats + freakshow).
  **Rat column ✅ COMPLETE:** the **curdworks** (`TheCurdworks`, L1 off `TheLarder` — the rats cure the
  cheese; `setup.cheeseShift`, paid in the wheel = payment-in-kind). **★ THE FOOD×CLASS MATRIX IS CLOSED**
  — every class has a food + a job (rat cheese+curdworks · pig slop+pens/dens · filth brew+still). Post-
  matrix polish (none blocking): the back-alley **glowing smoke** became **✅ THE SMOKE CLASS, PHASE 0
  (2026-07-20)** — the *semicolonial specter* (shadow-person + wisps) whose horror is losing your
  **singularity** (you become *we*), plus the **smoke vice** (`setup.drawSmoke` — the diffuse fourth
  vice), built `filth`-class (no body-model change). It also delivered the **identity-damage** combat axis
  (see below). Fully tracked in **[`docs/HANDOFF-SMOKE-CREATURES.md`](HANDOFF-SMOKE-CREATURES.md)** — the
  **owner's calls remain** for Phases 1–3: **play it, then call fork 5.3 (plurality-as-mechanic)** — a real
  4th body key vs. a rich `filth`-variant. Cheap Phase-0 follow-ons (no fork needed): art (a `shadowperson`
  portrait + `guttering` room illus, calls already wired) and more idmg carriers. Also: addiction **decay**
  (today monotonic — a habit never fades); and whether voluntary room-jobs (curdworks / still / bar-work)
  should book `passTime` like the indenture `doShift` (a seal-economy consistency call).
- **More cleanse points**, tuned against the clean-run audit (`docs/AUDIT-CLEAN-RUN.md`,
  `tools/clean-run-path.mjs`). Also: **hint the Clean Pool's blunt-weapon requirement**; a design
  call on whether escape *should* mandate the full L9 round-trip.
- **Spend the `kin_*` marks** (largely unused) and **wire `limbPenalty` / the curse into more room
  checks** so those levers are load-bearing, not dangling.
- **More cross-life unlocks** (compounding): give `faceless` / `rendered` / `indebted` / `unbound`
  their own paths/endings + demon-specific returnee dialogue (only `damned`→EndingSovereign and the
  3-fragment→EndingUnbound exist). Possible: a mark that **banks a starting-level head-start**.
- **More regard sites** (the helper makes them one-liners): the press-gang arms (`pigpress` /
  `vatpress`), etc.
- **Identity damage (owner 2026-07-20) — ✅ SHIPPED, both sides.** The hole (combat touched the
  transformation axis only on a LOSS, so winning was corruption-free) is **closed**. *Enemy side:* the
  smoke creatures carry `idmg` (corruption on every landed hit, guard halves, crit doubles), the `chorus`
  move takes two segments, `scatterToll` guarantees a won fight costs the self. *Player side:* weapon
  `taint {cls,amt,line}` corrupts the WIELDER per landed blow (`setup.weaponTaint`, hooked into
  playerStrike + doSpecial-once-per-action); the `hungry_knife` delivers its promise. *Both:*
  `setup.identityResist` — a turned body shrugs off more of the same (the smoke fight's build answer).
  Cheap follow-ons (machinery is general): **more tainted weapons** (a smoke/tallow blade in the fuming
  band would close the loop) via a `taint` field; **more enemy carriers** (L8 tallow-smoke, spore/miasma)
  via `idmg`+`idmgFlavor`; **armor/mark idmg-resistance** (extend `identityResist`). Spec: `docs/COMBAT.md`
  → *Identity damage*.
- **Balance pass** on combat numbers, gate costs, coin economy (all marked tunable in-file;
  `combat-sim.mjs` + `equip-check.mjs`).

## Research follow-ups (`docs/RESEARCH-demonology-filth.md`)

- European named **latrine demons**; the **Beelzebub / flies / pestilence** complex; **Kappa in
  cesspits**. Open questions anchoring future creatures.

---

*If you're starting cold: read `HANDOFF.md` §3 (build & verify: `.\build.ps1`, preview port 8738,
drive via `window.SugarCube.*`) and §4 (SugarCube gotchas) first. Every change: build green + driven
in-browser + dense local-only commit as `StonePhilosopher`.*
