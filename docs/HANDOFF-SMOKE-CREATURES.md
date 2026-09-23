# Handoff — the smoke creatures (a proposed FOURTH mutagen class)

> **✅ PHASE 0 IS SHIPPED (2026-07-20).** The owner said "lets work on that smoke class," and Phase 0 —
> the shadow-person + smoke-wisps + the smoke vice, all as `filth`-class (zero body-model change) — is
> **built, tuned, and driven in-browser to zero console.** It also delivered the **identity-damage**
> combat axis (the shadow-person is its first carrier — see §3 and `docs/COMBAT.md`). What remains
> below is **Phases 1–3** (the true 4th class, the ending, the plurality mechanic). **The load-bearing
> decision (fork 5.3, plurality-as-mechanic) is still the owner's to make before anyone touches the body
> model — Phase 0 deliberately did NOT need it resolved.** LOCAL-ONLY repo — commit, never push.
>
> **What Phase 0 shipped (commit follows this doc):** `setup.enemies.shadowperson` (idmg 2, chorus move,
> weakTo blunt / resists edged) + `smokewisp` (fodder); `setup.identityHit` + `IDMG_LINES` + the
> `enemyTurn` hook (corruption on every landed hit, guard halves, crit doubles); the `chorus`
> `ENEMY_MOVES` entry (takes from 2 segments — a miniature plurality); `setup.ADDICTIONS.smoke` +
> `setup.drawSmoke` (the DIFFUSE vice — spreads thin, no limb turns) + `smokeCompelled` + the
> `smokecraving` encounter; `setup.scatterToll` (you can't kill smoke, only breathe it — guarantees a
> won fight still costs the self); the `TheGuttering` / `TheGutteringCleared` room off `TheStill`; and
> the `TheBackAlleys` glowing-smoke beat rewired from a one-shot `<<corrupt "head" "pig">>` into the
> vice. Balance (live sim): a won fight costs ~1.3 meter (fast/equipped) → ~3.1 (fists/L1), bounded near
> a loss and scaling with how long you struggle. Science was web-verified before it hit prose (§2).

**What this is.** In the dreaming after the food×class matrix closed, the owner turned over the
back-alley "glowing smoke" (currently a one-line pig corruption beat) and said: *"I think it almost
makes sense to make a new species class. A semicolonial specter of smoke and stink. A shadow person."*
This handoff scopes that — the fourth nature — from vision through cost through a de-risking path.

**Read first (if you're picking this up cold):** `docs/TRANSFORMATION.md` (the 3-class body model + the
vices matrix), `docs/HANDOFF.md` §4 (SugarCube gotchas) + §9 (the vices arc — smoke is its unbuilt
fifth column), `docs/RESEARCH-demonology-filth.md` (the grounding-research home), and the
`sewer-demons-add-creature` / `sewer-demons-add-addiction` skills (the enemy + vice machinery).

---

## 1. The fourth nature — the gap it fills

rat / pig / filth are all **solid, wet, singular**. Each turns you into a different *single* creature,
and each costs you your humanity. Smoke does two things none of them does:

| nature | does to you | costs you | register | band (today) |
|---|---|---|---|---|
| rat | multiply | humanity | vermin | sewer (L1–3) |
| pig | fatten | humanity | livestock | carnival + court (L5–7, L9) |
| filth | dissolve | humanity | aggregate muck | drowned + renderers (L4, L8) |
| **smoke** | **disperse** | **your SINGULARITY** | **miasma / shadow** | *(the fork — see §5.2)* |

The headline horror: the other three cost your humanity; smoke costs your **first-person singular**. You
stop being *one*. A turned smoke-self is a **semicolony** — a loose crowd of motes, soot, and flies
wearing a person-shape out of habit — and it speaks as **we**. That is a genuinely new horror the game
has not touched, and the purest agency-loss yet: not "the body decides for you" (the feed, the
mouth-misspeak curse) but **"there is no single you left to decide."**

**It is not scope-creep — it's cashing a check the game already wrote.**
- The **Fly on the Wall is Beelzebub**, and `BACKLOG.md` already dreams *"a witness whose flies are on
  every wall."* A semicolonial specter of smoke and flies **is that dream embodied** — the flies
  aggregating into a shadow-person.
- The core metaphysic (`RESEARCH-demonology-filth.md`; the `add-creature` skill's *"the filth swirls
  into evil greater than the sum"*) **is** the semicolonial principle. Smoke is that same principle
  applied to **air** instead of muck.

---

## 2. The grounding (the science — a real asset, honestly sourced)

> **Provenance:** this section began as an in-session design/science discussion (2026-07-20). Before the
> Phase-0 prose shipped, the three claims that reach player-facing text were **web-verified** by a
> parallel research pass (a workflow, one agent per claim + a cross-check). Verified findings that shaped
> the prose: **(ignis fatuus)** real, centuries-documented, but keep the light *cool, pale, faint* — NOT
> a hot flame — and don't have any NPC "explain" it (the mechanism is genuinely disputed: phosphine vs.
> chemiluminescent cold-flames vs. a 2025 microlightning model); a sewer is a legit cousin of the marsh.
> **(the glow / opium referent)** the honest effect is *dulled fear / placid detachment / analgesia* — a
> **downward** calm, **NOT** swaggering "courage" (that's alcohol/nitrous); so the bait is steadiness,
> not bravado. **(siphonophore)** the colony-of-zooids-as-one-animal / "semicolony" framing is fair for
> the "we." Still un-verified (the endotoxin agent tripped a usage filter, and it's a Phase-1+
> world-reaction concern, not Phase-0 prose): the **bioaerosol / endotoxin** rabbit hole — miasma
> re-measured with instruments — **verify at authoring time** ([[feedback_cross_check_research_disagreements]]).

The owner's own question sharpened the grounding: *does dried, aerated filth (Victorian-London street
dust, not just chemical off-gassing) still harm you?* The answer is the spine of the whole class:

- **Miasma theory: right correlation, wrong mechanism.** The stink wasn't the poison — it *marked*
  concentrated fecal contamination, which was the danger. Sanitarians cut death rates by chasing the
  smell, for the "wrong" reason. **The smell was the smoke alarm, not the fire.** (This is the class's
  thesis in one line — and a rare "right for the wrong reasons" episode the game can dramatize.)
- **Two things are in that air, and they hurt differently:**
  - *Off-gas chemicals* (H₂S, ammonia, mercaptans, indole/skatole, methane) = the SMELL. Mostly a
    marker + irritant — **except** confined, where H₂S is acutely lethal ("sewer gas" killed nightmen).
  - *Particulate* — dried, pulverised filth (Victorian London: overwhelmingly **horse** manure, plus
    human waste, ground to dust by iron hooves and cartwheels). Genuinely aerosolised faecal solids.
- **Three harm routes (the nuance the class can mine):**
  1. **Fecal-oral by settling** (the big one, *not* inhalation): the classic killers (cholera, typhoid,
     dysentery) infect the gut; the dust spread them by *settling* on food/hands/mouths → swallowed. The
     dust was airborne and dangerous, but you got sick by ingesting it. (And the flagship case cuts
     against dust: cholera's *Vibrio* desiccates fast and is waterborne — Snow's pump.)
  2. **True inhalation pathogens** (where miasma is basically right): TB; fungal spores off dried
     droppings (*Histoplasma*/*Cryptococcus* — bird/bat guano); Q fever (*Coxiella*, absurdly infectious
     as aerosol); hantavirus (dried rodent excreta); anthrax ("woolsorters' disease"). Spores + roundworm
     eggs survive drying for months–years and ride dust.
  3. **Non-infectious lung harm** (most vindicates "bad air is bad"): even *sterile* faecal dust carries
     **endotoxin (LPS)** → "organic dust toxic syndrome," chronic bronchitis in wastewater/compost/farm
     workers. Dose-dependent (occupational ≫ ambient), but real. The most-exposed Victorians — dustmen,
     nightmen, cesspit-emptiers, flushers — had brutal lungs.
- **The flies were the biggest "aerial" route of all** (filth → fly → dinner) — which is why Beelzebub
  fits the class so well.
- **Ignis fatuus** (will-o'-the-wisp — glowing gas off decomposition) is the literal real-world referent
  for the back-alley **"glowing smoke"** already in the game.
- **Semicolonial / siphonophore biology** (many zooids, one animal — the owner's exact word) is the
  literal referent for the plurality body-horror.

**Design payoff of the science:** the class can pose the owner's own question *inside the fiction* — is
the reeking dried air actually harming you, or only marking the harm? — and answer it the way the
history does: both, and neither the way you'd think.

---

## 3. The creatures (Phase 0 — ✅ BUILT 2026-07-20)

The cheapest, highest-signal slice, and where "the smoke creatures" literally live. Built **as
`filth`-class** (zero body-model change), to test whether the aesthetic sings before committing a 4th
class (see §6). **As-built decisions (the things the build taught that the scope didn't foresee):**

- **Combat identity = IDENTITY DAMAGE, resolved.** The open §7 question is answered: the shadow-person's
  signature is the new `idmg` axis — it barely tears flesh (weaponDie 1d3) but corrupts a random segment
  on *every landed hit* (guard halves, crit doubles). Its telegraph move is **`chorus`** — the aggregate
  speaks with many mouths and takes from **two segments at once**, a working miniature of the Phase-3
  plurality horror. `idmgFlavor: "smoke"` gives the dispersal voice ("*a little of you goes with it…
  less one thing… not yours to call back*").
- **The SCATTER-TOLL (a build discovery).** In-fight idmg scales with fight length — so a well-equipped
  player who wins in 3 rounds paid almost nothing, which *undercut the whole point* ("winning should cost
  the self"). Fix, and it's more thematically true: **you cannot destroy smoke, only scatter it into the
  air you're breathing.** `setup.scatterToll` applies a guaranteed diffuse corruption on the WIN
  (`TheGutteringCleared`). No heal, and NO forced addiction — breathing it in a scrap isn't the *choice*
  that drawing the glow is, so the vice stays opt-in (unlike the rats' forced cheese). This is the floor
  under "you can win and still lose yourself."
- **The vice DIFFUSES (the key mechanical distinction).** `setup.drawSmoke` doesn't concentrate into one
  turning limb like the cheese/slop — it spreads a thin film of filth across 3 segments at once, so the
  meter climbs but nothing turns. Smoke is the one vice that is **pure loss, no build** — dispersal's
  whole point. Bait = the ache eased (analgesia — see §2's opium finding, *detachment not courage*).
- **You "clear" it but never kill it.** `TheGutteringCleared` says so — the shape scatters "for today,"
  the haze (and the vice faucet) remain; the flag only stops XP re-farming.

**Original scope (still the plan for Phase 1's re-point to `smoke`):**

- **The shadow-person** — a person-shaped aggregate of smoke, soot, and flies; a silhouette that holds
  a human outline by habit and comes apart at the edges. The "what you're becoming" mirror (as the pig
  court mirrors pig-you). A strong `<<roomart>>` combat portrait. Combat identity **needs a pass**
  (§7): candidates — *dissipate-to-evade* (comes apart to dodge, reforms), a *chorus* attack (many small
  voices/bites at once), brief *possession/misdirection*. Use `sewer-demons-add-creature`.
- **Smoke-wisps / the glow** — ignis fatuus: low fodder that lures (the glow that says *this way*), the
  aggregate's loose particles. Fits a pack (`denizenPack`) — a shadow-person trailing wisps.
- **The smoke VICE** — the back-alley **glowing smoke** (`TheBackAlleys`, currently `<<corrupt "head"
  "pig" 5>>` on a `<<linkreplace>>`) becomes a proper **ledger tenant** (`setup.ADDICTIONS`). Bait:
  calm / courage / a shave off a combat penalty (inhaled steadiness — the barker's high). Cost: a
  little more diffuse. Craving: the want for the next lungful. Faucet: the barkers (L6) + the **still's
  fumes** (a lovely cross-tie — the still already exists) + the renderers' tallow-smoke (L8). Compels
  when you're mostly-air. **In Phase 0 it feeds `filth`; in Phase 1 it re-points to `smoke`.**

Band for the creatures/vice = the **fuming/burning places**: the still, the renderers (L8), the
fire-arch/Hellmouth (L5), the carnival glow (L6). (This foreshadows the §5.2 band fork.)

---

## 4. The blast radius — if it becomes a full class (the honest cost)

A class is load-bearing. This is **comparable to the entire vices-matrix arc**, over multiple sessions —
the opposite end of the spectrum from "a one-line `ADDICTIONS` tenant." Everything a 4th class touches:

- **Body model** — `$body[seg] = {rat,pig,filth}` gains a `smoke` key on every segment; `freshBody`,
  `setup.corrupt`, `segTotal`/`segClass`, `classLimbs`, `classLoad`, `recomputeBody`, the overflow-spill,
  and **save-migration** (`healBody` must add/tolerate the key on pre-4th saves).
- **Form + prose** — `setup.FORM_MODS.smoke`, `setup.SPECIALS.smoke`, and **two whole new prose columns**:
  `BODY_DESC` (part × smoke × stage) and the transformation-feed `CHANGE_DESC` (part × smoke × stage) —
  ~24 authored cells each. Plus the caption / visible-meter colour for smoke.
- **Class-as-build** — `kin_smoke` mark + a `kinhelp` payoff, `setup.MARK_MODS` entry, a become-**ending**
  (dispersal — §5.4), the playstyle payoff.
- **Enemies** — the Phase-0 creatures re-classed to `smoke` (so a loss marks you smoke); `denizenPack` /
  band tables; `combat-sim.mjs` rows.
- **World-reaction** — room-scent (the class *is* a smell — does a smoke-body read the world differently?),
  regard (the world reads a smoke-body), nose-blind (you can't smell yourself — but you *are* smell),
  `depthOf` / encounter bands.
- **Framing** — the game says "three natures" in places; a fourth needs a light prose sweep.

---

## 5. The forks (the owner's calls — resolve before building past Phase 0)

**5.1 — Full class vs. lighter forms.** Three tiers:
- **(a) A true 4th mutagen class** [big — §4].
- **(b) Smoke = the air-phase of `filth`** — a shadow-person enemy + a smoke vice that corrupts `filth`,
  **no new body key**; reuses filth's band/kin/ending. ~70% of the flavour for ~10% of the cost — but
  **loses the distinct plurality-horror** (a smoke-you would just read as filth-you).
- **(c) Enemy-family + vice only, no transform.** The shadow-person exists; you don't become one.

  *Recommendation:* **(a) is justified only if you want the plurality *mechanic* (5.3).** Otherwise (b).

**5.2 — A band, or NO band.** Each existing class owns a region. Smoke's radical option: **no home band**
— it's the between-air, thickest where things burn (still / renderers / fire-arch / carnival glow).
Elegant and true to "miasma is everywhere," but it complicates *where the craving fires* and *where
smoke-things den*. (Phase 0 sidesteps this by denning them in the fuming places.)

**5.3 — Plurality: a MECHANIC or just prose? (THE load-bearing decision.)** The thing that *earns* a
whole class over a reskin is if going smoke makes **"the rest of you" vote** — a plurality version of the
mouth-misspeak curse (`$mouthCursed` / `setup.MISSPEAK_CHANCE`): past a threshold, some choices get made
by the murmuration, not you. Most work, most novel, and the whole argument for (a) over (b). If plurality
is *only* prose ("we" not "I"), the class is weaker and (b) wins. **Everything else follows from this.**

**5.4 — The ending.** Dispersal is a genuinely new loss shape — not death, not becoming-a-creature, but
**diffusion** (everywhere and no one). Arguably the bleakest: the others at least become *a* thing.
Worth designing even if the class stays at (b)/(c).

**5.5 — Choosable, or only a slide?** The cheese exists because `rat` was unchoosable at creation (the
dead-third problem — `TRANSFORMATION.md`). Is smoke a char-creation start-option, or purely a trap you
dissipate into? (Composes with: does going smoke unlock an evasion/insubstantial build worth choosing?)

---

## 6. The de-risking path (recommended)

Don't build the class first. Let it **earn** its blast radius:

- **Phase 0** ✅ **DONE (2026-07-20)** — the **shadow-person + smoke-wisps + the smoke vice**, all
  `filth`-class, + the identity-damage axis + the scatter-toll. Zero body-model change. *It's in the
  game; go stand in `TheGuttering` (off the still, L6) and see if it sings.*
- **Phase 1** (the next rung, IF it sings — and after fork 5.3 is called): add the 4th body key +
  minimal `FORM_MODS`/feed prose; **re-point the vice + creatures from `filth` to `smoke`** (search for
  `idmgFlavor: "smoke"`, `class: "filth"` on the two enemies, `cls: "filth"` in `ADDICTIONS.smoke`, and
  the `"filth"` args in `drawSmoke`/`scatterToll`/`identityHit` — all deliberately marked "Phase 0 =
  filth" in-code). Resolve fork 5.2 (band).
- **Phase 2**: the dispersal **ending** (5.4) + `kin_smoke` + the build (5.5).
- **Phase 3** (the crown): **plurality-as-mechanic** (5.3) — the murmuration votes.

This ships content on stable infra first ([[feedback_refactor_vs_content_sequencing]]) and keeps every
phase independently shippable + verifiable.

---

## 7. Open questions / gaps (the honest half)

- **Fork 5.3 is un-callable by anyone but the owner** — whether the plurality-mechanic is worth a whole
  class is a taste question: a **fourth distinct horror** vs. **more depth on the three you have**.
- ~~**Combat identity is un-designed**~~ ✅ **RESOLVED in Phase 0** — the shadow-person's identity is
  **identity damage** (corruption per landed hit, `idmgFlavor: "smoke"`) + the **chorus** move (two
  segments at once) + the **scatter-toll** (you breathe what you scatter). The `idmg` axis is now
  general machinery (`docs/COMBAT.md` → *Poison / identity-damage weapons*), so a future poison blade or
  the L8 tallow-smoke can carry it too. What's still open: a *dissipate-to-evade* move (comes apart to
  dodge, reforms) would need an untargetable-window flag the engine doesn't have yet — deferred.
- **The "three natures / three ledgers" framing** needs a light sweep if it becomes four (minor, real).
- **Grip duality** — smoke "can't be gripped" *and* "can't grip"; ties to the existing `canPickup`
  ("can't pick up") curse. A natural mechanical hook, unexplored.
- **Room-scent identity crisis** — a class that *is* a smell interacting with the smell systems (scent /
  nose-blind / regard) is either a rich seam or a tangle. Un-scoped.

---

## Recommended next step

**Phase 0 is done.** The smoke creatures are a thing you can stand in a room (`TheGuttering`, off the
still) and be afraid of, and nothing is committed that you'd have to unwind. The next move is **the
owner's**, and it's genuinely a taste call, not an engineering one:

1. **Play it.** Does the shadow-person + the chorus + the diffuse vice + "you can win and still lose
   yourself" *sing*? If it lands, the case for a real 4th class gets much stronger.
2. **Then call fork 5.3** (plurality-as-mechanic — §5.3). *Everything else follows from this.* If yes →
   Phase 1 (the body key) then Phases 2–3 (ending, then the murmuration votes). If no → Phase 0 is a
   perfectly good stopping point, and the smoke stays a rich `filth`-variant with a unique combat axis.

Cheap follow-ons that don't need fork 5.3 and strengthen Phase 0 in place. **✅ The player-side of
identity damage shipped (2026-07-20, right after Phase 0):** tainted weapons (`taint {cls,amt,line}` →
`setup.weaponTaint`, corrupts the WIELDER per blow; the `hungry_knife` delivers its promise) +
`setup.identityResist` (a turned body shrugs off more of the same — the smoke fight's build answer, so
a fresh SINGULAR body pays full and a filth-turned one pays less). Still cheap + open: **art** (a
`shadowperson` combat portrait + a `guttering` room illustration — calls already wired, files just need
to land); **more carriers** (a smoke/tallow-slick tainted *weapon* findable in the fuming band — the
loop-closer; the L8 tallow-smoke or a spore thing as an *enemy* — `idmg`/`idmgFlavor` is general); and
**armor/mark** idmg-resistance. All in `docs/COMBAT.md` → *Identity damage*.
