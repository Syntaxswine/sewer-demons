# Proposal — NPCs for the empty rooms (clues · corruption · flavor)

> **✅ SHIPPED (2026-06-25).** All NPCs in this doc + the companion
> [`PROPOSAL-NPCS-VOICES.md`](PROPOSAL-NPCS-VOICES.md) are **built and verified — 46/46
> across all 9 layers** (commits `db6694d` → `9b5547b`, local-only). Forks were resolved
> per the recommendations (Warden trimmed, Surveyor/Ringer cut, Felt→flavor, Gaff-odds
> deferred, etc.). Machinery: the `sewer-demons-add-npc` skill + `tools/npc-probe.mjs`
> (`node tools/npc-probe.mjs` → 46/46) + `tools/npc-manifest.json`. Each verified
> compile → probe → in-browser drive → zero console. This doc is now the *spec of record*.

**What this is.** The owner asked (2026-06-25): *"examine the game for rooms where we
can add NPCs that will either help the player with clues, corrupt the player more, or
just add general flavor text that makes the world more real. Flag them in a proposal
with suggestions for implementation."* This is that proposal. **Nothing here is built**
— it's a survey + a grounded build-list to approve, overturn, or trim.

> **Companion:** the *ambient damned* — Dante-style voiced lore NPCs (philosophical /
> blue-collar / liar-trickster) who talk about their level, life in hell, and how they got
> here — are a separate cast in [`PROPOSAL-NPCS-VOICES.md`](PROPOSAL-NPCS-VOICES.md). This
> doc is the **functional** set (clue / corrupt / flavor); that one is the **population**.
> The two share a rooms-budget, so read both before staffing a layer.

**Method.** Every one of the 9 layer files was read end-to-end, then each candidate was
**ground-checked against the live engine** (`sewer-demons.twee`): does the room exist,
does it already hold an NPC, does a proposed *clue* point at a mechanic/flag that
**actually exists**, is a proposed *reward* flag one the engine **actually reads**, and
is each new `$flag` name free? That grounding pass earned its keep — it killed four
"reward" flags that the engine never reads (a deal that charges corruption and delivers
nothing), caught two clues that point at a layer the player has already left, and demoted
three would-be corruptors whose payouts don't exist yet. Those corrections are folded in
below; the naïve version of each is noted so you can see what was wrong.

**The restraint rule (load-bearing).** The game's aesthetic is *the world is the
spectacle, the chrome is restrained.* So this is deliberately **clue- and flavor-led, with
corruptors as rare punctuation** — not a population. Several strong empty rooms are
recommended to **stay empty** (§6). A great atmosphere room earns its silence.

---

## 1. The headline: eight real mechanics have no in-world teacher

The single most valuable thing these NPCs do is **fix a discoverability gap**. The game
has eight built, working mechanics a player can pass the whole game never learning exist —
because the only place they're explained is *inside the very gate/fight that needs them.*
These NPCs are the missing teachers, planted **up-river of the thing they unlock**:

| Real mechanic (already built) | Today you learn it… | Proposed teacher |
|---|---|---|
| **The rope → Maintenance climb** (the L1 escape spine; `setup.has("rope")`) | only at the locked shaft itself | **L1 Last Inspector** (clue) |
| **The kappa BOW** (beat the bathhouse by bowing; locks at corruption ≥ 50) | only once you're in the fight | **L3 The Sitter** (clue) |
| **The BRAND escape route** (burning tree → brand → burns the L2 Fatberg gate) | only the L9 digger — *after* you've hit the bottom | **L6 Lost-and-Found Keeper** (clue, planted early) |
| **The Word** (read the Hellmouth inscription → magic; `$heardOfWord`) | Arrivals / the Fly (both skippable) | **L4 Scrivener** (earliest planter) + **L5 The Swallowed** (secondary) |
| **The Glut is weak to BLUNT** (the optional L4 boss; resists edged) | only the post-fight prose | **L4 The Last King** (clue) |
| **The privy-shrine Word** (`$sphincterWord` opens the L7 sphincter) | only if you find ThePrivyShrine | **L7 The Tooth-Counter** (clue) |
| **The third sigil-fragment's location** (down the runoff to L9) | nowhere — pure exploration | **L8 The Unrendered** (foreshadow) |
| **The crust-bridge** (cross the L9 castle gate free, instead of +26 burn) | only by tracing the vents yourself | **L9 The Bone-Rimmer** (clue) |

That table *is* the proposal's core argument. Everything else is flavor and the occasional
deal.

---

## 2. Role balance & band coverage

**~26 NPCs across 9 layers** (16 ship as-is, ~10 ship with the grounded fix, ~4 cut as
collisions). The spread is healthy and exactly inverted from "every NPC is a tempter":

- **Clue — 10.** The teachers above + a couple of secondary planters.
- **Flavor — ~11.** World-economy legibility; each carries at most a *small* knowing-cost
  corruption (the band's "comprehension costs you" beat), never a deal.
- **Corrupt — 5.** The rare punctuation: one per band-ish, each a real pay-with-self.

**Band coverage** — each band gets at least one clue, one flavor, one corruptor:
sewer (L1–3), carnival (L4–6), hell (L7–9) all balanced. Good.

**Not a gap — a rule (§7):** the **Clean Pool cleanse** (L2) has no teacher *on purpose*.
Foreknowledge would un-clean it. **Do not add one** — recorded so no future pass "helpfully" does.

---

## 3. Ship as proposed (KEEP — grounded, no changes needed)

Each is the named idiom, talk-only, sits **beside its own choice link** (the writing rule),
with a spent-NPC line on revisit. Real engine calls and adjacent passages are confirmed.

### Sewer (L1–3)

- **L1 · TheJunctionVault · the Last Inspector** *(clue)* — a council drains-inspector
  fossilised by the very system he was sent to measure, slumped by the IN-CASE-OF-FLOODING
  box already in the room's prose. **Gives:** the two facts you otherwise only learn at the
  locked shaft — the rungs run out above head-height (a free-climb is suicide; you need a
  line) and *rope is only sold back down through the market* (L6 HellMarket). Grounds the
  whole escape spine. **Impl:** digger idiom, `$inspectorTalked`, free (no corrupt). Exits
  → TheSubwayBreach / TheGaugeHouse.

- **L1 · TheSubwayBreach · the Commuter** *(flavor)* — a runoff-warped shape pressed to the
  breach where the drain meets the live transit tunnel, learning the train timetable.
  **Gives:** the layer's thesis made legible — *the deep climbs OUT, wears the city* (seeds
  the Sovereign theme, rhymes with the TheAreaGrate snare without duplicating it: the Grate
  *enacts*, the Commuter *explains*). **Impl:** Breeder idiom, `$breachKnown`,
  `<<corrupt "head" "filth" 9>>` (≥ the 8 feed-threshold so the change narrates). Exits →
  TheRainShaft / TheJunctionVault.

- **L2 · TheManholeBase · the Voice Above** *(flavor)* — someone on the world-side of the
  sealed cover who hears you push, talks down, and cannot lift it. **Gives:** pays off the
  room's own "tarred shut from above" line and Confluence's "carrying its waste politely
  away" — *the city seals its own poison in on purpose, and has written you off.* **Impl:**
  Breeder idiom, `$voiceHeard`, `<<corrupt "head" "filth" 4>>`. Returner callback ("are you
  still the one that called?"). Exit → TheScreeningHall.

- **L3 · TheBrokenSiphon · the Sitter** *(clue)* — the "someone sheltered here and didn't
  leave" the room already names, made into a half-mutated husk who gave up at the last dry
  spot. **Gives:** the **kappa bow** breadcrumb — *down there the polite thing wins, not the
  strong thing, but only while you can still BE polite; mind you stay bendable* (the mechanic
  locks at corruption ≥ 50). **Grounding fix:** keep it **thematic** — do **not** write
  "directly below" (the bathhouse isn't literally adjacent) and do **not** name kappa/
  bathhouse (unmet). **Impl:** digger idiom, `$sitterTalked`, free. Exit → TheCisternOverflow.

- **L3 · TheInscription · the Reader** *(flavor)* — a works-surveyor who came to catalogue
  the hinge-carving and read the lower courses too long, the filth tingeing his mind.
  **Gives:** the game's central thesis spoken aloud at the exact room where it turns — *the
  filth doesn't rot, it AGREES; a thousand harmless ruins pool into one appetite larger than
  their sum.* **Grounding note:** must carry the **collective-mutagen thesis**, not restate
  the room's own corruption-gated "reading is obeying" line. **Impl:** Breeder idiom,
  `$readerKnown`, `<<corrupt "head" "filth" 3>>`. Exits unchanged.

### Carnival / between (L4–6)

- **L4 · TheSiltKings · the Last King** *(clue)* — of twelve silt-thrones, the twelfth still
  has a fading dignity and one piece of advice. **Gives:** the **Glut boss tactic** — *what's
  in the well comes apart, it does not cut* (the engine truth: `weakTo:'blunt'`, resists
  edged; echoes the post-fight prose). Arrive carrying a hammer for the golem-breaker payoff.
  **Impl:** clue, `$kingSpoke`, free; **loot (`$siltKingsLooted`) stays entirely separate** —
  the king does not gate the coins. Exits → TheBellChamber / TheSunkenChapel.

- **L4 · TheTombIsland · the Newly-Laid** *(flavor)* — among the safely, decently dead, one
  fresh enough to still talk, calm about it. **Gives:** *why the deep KEEPS rather than kills
  — being kept IS the win; the dirt drains down to FEED, the demons get to BE.* **Impl:**
  Breeder idiom in the Rest room (the `$hp → $maxhp` heal at entry stays untouched),
  `$tombDeadKnown`, `<<corrupt "head" "filth" 6>>`. Returner greets you by the change it can
  already see. Exits unchanged.

- **L5 · TheThroat · the Swallowed** *(clue)* — a person caught mid-swallow behind the uvula,
  speaking from the soft red dark. **Gives:** two things — (1) a **secondary `$heardOfWord`**
  planter (so a player who sneaked past Arrivals can still get the read-the-arch branch back
  at the front of the mouth), and (2) names the uvula = the swallow, turning the adjacent
  `EndingSwallowed` snare into an **informed** death (the warn-before-irreversible rule).
  **Grounding fix:** guard the flag set — `<<if not $heardOfWord>><<set $heardOfWord to
  true>><</if>>` — so it doesn't double-narrate; frame the Word as *go read it at the FRONT
  arch*, not here. **Impl:** clue, `$throatVoiceHeard`, beside the uvula choice (no new room).

- **L5 · Hellmouth · the Beadle of the Lip** *(flavor)* — one of the small begging firelight
  things the hub already mentions, given a single cringing face. **Gives:** the rope-economy
  *joke* the hub states ("you need things from down there to get back up") made legible — *the
  deep gates the climb so the swallowed must descend and earn the means.* **Grounding fix:**
  make it **always-present** (the source line is `damned`-mark-gated, but the beadle greets
  any arrival); place it **after** the load-bearing inscription block so it doesn't crowd the
  Word set-piece; double-quote args. **Impl:** Breeder idiom, `$beadleHeard`, `<<corrupt
  "head" "filth" 5>>` (a silent ambient tick). Comprehension only — no flag unlock.

- **L6 · TheLostAndFound · the Lost-and-Found Keeper** *(clue)* — the booth keeper who
  inventories what everyone put down and never came back for, and so has heard the *one* story
  of a thing that walked back out. **Gives:** the **BRAND escape route** — the only far, real
  way out that L6 never names — *one tree at the bottom burns and never burns out; a soul broke
  a branch off it and carried fire that kept, and melted a way out up where the fat sits across
  the pipes.* This is the early-planted twin of the L9 digger's clue. **Grounding fix:** drop
  the parenthetical "(Claims Clerk)" from the name (a `clerk` archetype exists elsewhere); keep
  it the single returner story, one reveal. **Impl:** digger idiom, `$keeperTalked`, free; the
  `$lostFoundLooted` coin-grab stays untouched. Exits → TheTill / TheWheel.

### Hell (L7–9)

- **L7 · TheToothWell · the Tooth-Counter** *(clue)* — a gleaner at the rim of the shed-tooth
  well whose whole remaining self is the count. **Gives:** for the player who walked past it,
  a free nudge that **ThePrivyShrine** teaches the wet syllable that opens the sphincter
  (`$sphincterWord`) — *the way past the clenched gate is learned by kneeling, not forced.*
  **Grounding fix:** point **only** at ThePrivyShrine/`$sphincterWord` (this layer, real);
  drop the `$heardOfGrimoire` strand (different layer's mechanic). **Impl:** digger idiom,
  `$toothCounterTalked`, free. Lives inside TheToothWell after the loot block.

- **L7 · TheWeepingWall · the gland-face** *(flavor)* — the house-sized crying face already in
  the room, made to **answer**. **Gives:** turns the room's narrated inference into the face's
  own dim **confession** — *the same water, wept and drained and digested and wept again, all
  the way down from the drowned galleries* (ties L4 ↔ L7 into one grieving loop; it is *made*
  to weep the slum into being and cannot stop). **Grounding note:** must *advance past* the
  room's existing prose, not restate it. **Impl:** Breeder idiom, `$wallHeard`, `<<corrupt
  "head" "filth" 2>>`. Exits unchanged.

- **L8 · TheForemansWalk · the Tallykeep** *(flavor / broker)* — a clerk-Gorger who walks the
  figures down from the foreman (who "never trades, only notices") — the deliberate spin-off:
  the one who *will* talk. **Gives:** the Works' whole supply chain made legible — *the candles
  are the Shambles' light and the not-children's jingle; the soap is sold back to the people
  who came to stay clean; the tallow hauls up to the markets; the remainder drains to the
  bottom.* On a second buy it adds **your** line to the ledger. **Grounding fix:** sell "where
  the remainder goes" as **spoken lore, not a flag** (the would-be `$heardOfDeepFragment` has
  no consumer); guard the regard beat for a null return. **Impl:** Fly-broker idiom (coin-gated,
  revisitable), `$tallykeepPaid` / `$tallykeepReturned`, `<<corrupt "head" "filth" 3>>`.

- **L8 · TheGreaseTrap · the Remainder** *(flavor)* — in the geology of bones and float, the one
  shape still a person — the part the process could not boil an oil out of. **Gives:** the
  layer's honest confession — *there is always a remainder, and the un-renderable part is the
  part that was a person* — quietly rhyming with the meta-puzzle (the master-vat sigil-mark
  survived because it's the **same kind of un-reducible thing**). **Grounding note:** narrative
  resonance only — sets/checks **no** sigil flag. **Impl:** Breeder idiom, `$remainderKnown`,
  `<<corrupt "head" "filth" 3>>`. Returner: thinner-voiced "remember me." Exits unchanged.

- **L9 · TheVitriol · the Bone-Rimmer** *(clue)* — a thirst-mad soul white to the elbows with
  the lime-bones of others who drank, who has learned the field's lethal geography by surviving
  it. **Gives:** the **crust-bridge** (`$crustBridge`) — *the fire-gate is not the only way
  through; where two vent-breaths lean together the crust runs cold and load-bearing; read it at
  the nine throats before you pay the gate in your own skin* (saves the +26 burn toll). **Impl:**
  digger idiom, `$vitriolTalked`, free. Exits → TheCinderfall / TheSolfatara.

- **L9 · TheGypsumWalk · the Gypsum-Eater** *(flavor)* — a mild, contented thing kneeling in the
  gypsum drifts, eating the soft pale mineral by the handful — the one creature that solved hell
  by wanting nothing past the next handful. **Gives:** *why the Deep keeps souls without bars —
  the bottom feeds appetite until appetite is all that's left.* He's the lord's "larder" thesis
  seen from **inside** the larder, the live face of the warm-crust snare (`EndingSublimed`).
  **Impl:** Breeder idiom, `$gypsumKnown`, `<<corrupt "head" "pig" 4>>` (the comprehension that
  makes the warm crust look like rest). Exits unchanged.

---

## 4. Ship with the grounded fix (REVISE — the naïve version was mechanically wrong)

These are good ideas whose first draft pointed at something the engine doesn't have. The fix
is folded in; the catch is named so you can see why.

- **L1 · TheStreetStair · the Pryer** *(corrupt)* — a drain-dweller whose arm has gone over,
  offering to do to your hand what the filth did to its. **Catch:** the original reward `$hasGrip`
  is a **dead flag** — FORM_MOD stat bonuses only apply when a segment fully *turns* (≥100), and a
  25-point corrupt doesn't turn it, so the deal would charge corruption and deliver **nothing**.
  **Fix:** grant the **existing `graft_hand` accessory** ("tireless hand", +2 STR, slot `hand`)
  the way the L7 Cutter installs grafts, so `itemMods()` actually delivers the edge; pay
  `<<corrupt "armR" "rat" 14>>` (reskinned to `rat` for the L1 register, no pig-demons yet); gate
  one-shot on `setup.has("graft_hand")` — **no new flag.** The hatch stays rusted shut (sells
  body-power, not a false exit). **Fork:** do you want a graft reachable in L1, *before* the
  Cutter? If not, demote to a rewardless pay-with-self like the Tanner below.

- **L2 · TheSluice · the Felt** *(was clue → now flavor)* — the listening grey fungus the room
  says is "aware of you, in no particular hurry." **Catch:** the original brand clue is a
  **functional duplicate** of the L9 digger (the map bible assigns the brand breadcrumb to the
  digger), and worse, the player only meets TheSluice on the **ascent** — after they've already
  heard the digger or already hold/missed the brand. **Fix:** **demote to flavor** — the felt
  *reads the player back* (the "world reads you by accumulation" note), tasting the same change
  beginning in you. Free, `$feltNoticed`, no brand line. Exit → TheWeir.

- **L2 · TheDrumStore · the Tarman** *(corrupt)* — a man who came for the drums and stayed too
  long breathing them, now more leaked chemistry than himself, who'll deal. **Catch:** the
  original reward (the `gasmask`/oilskin hood) is the **counter-item for the L9 fume-cut**, bought
  at L6 on the descent and used at L9 — by the time you reach L2 (ascent) it wards against
  **nothing you can still meet.** Dead reward. **Fix:** make him a **coin scavenger** — he strips
  the dead men's coin and trades it for a bite of skin: `<<run setup.gainCoins(random(14,22))>>`
  + `<<corrupt "head" "filth" 22>>` (the fumes into your sinuses — matches the room's own "begins
  to itch, and to change"). Ascent-relevant payoff. `$tarmanDealt`; keep the plain exit (no
  teleport).

- **L3 · TheTanneryDrain · the Tanner** *(corrupt)* — the room's "curing you into something that
  will keep" made literal: a tannery remnant who'll cure a patch of your hide. **Catch:** the
  original `$hasHide` armoured-hide reward **collides head-on** with the existing `graft_hide`
  item (same body-part, same torso cost, same +2 AC concept, owned by the L7 Cutter) and would let
  you reach a turned-hide bonus before the Cutter; and the "$hasWard-style hook" claim misreads
  `$hasWard` (which banks a *cross-life mark*, not armor). **Fix:** make it a **rewardless
  pay-with-self** — accept = `<<corrupt "torso" "filth" 12>>` (the horror of letting the place tan
  you *is* the payload; **not** 25 — that's a deep-band number, the layer's own heaviest deliberate
  corrupt is 12), refuse = `<<soothe 4>>`. `$tannerCured`, no reward flag, no mark hook. **Fork:**
  if you *want* a real reward here, the clean path is to make the Tanner an alternate installer of
  the existing `graft_hide` — but that collides with the Cutter's exclusivity, so it's your call.

- **L4 · TheArchive · the Scrivener** *(clue)* — a waterlogged clerk still filing the dissolved
  ledgers, the hand that wrote the private names down before the Whisperer traded them. **Gives:**
  sets **`$heardOfWord`** (the earliest of three planters) — the room itself says things were
  "written down by something patient and filed against the day it would be useful," so the tip is
  diegetically owed. **Catch/fix:** geography — it must say *writing down here answers to a patient
  reader, so when you reach the fused-bone arch ahead, look at it and it reads back* — **not** that
  a gate here is inscribed (the readable arch is the L5 Hellmouth, not L4). One-shot `$scrivenerTold`,
  free. Exits unchanged.

- **L6 · TheCarousel · the Wrangler** *(flavor)* — the operator who breaks the menagerie's overstock
  to the saddle and explains, unasked, how a rider becomes a mount. **Gives:** the carnival's
  body-economy made legible — *the mounts ARE the broken stock; ride a few rounds, then you're
  ridden* (the game's agency-loss fear in fairground dress). **Catch/fix:** the original charged a
  `<<corrupt "legL" "pig" 3>>` that **contradicts its own "the cost is comprehension" design** and
  duplicates the room's existing ride-beat leg-corrupt. **Fix: free** — drop the corrupt; the
  second-visit "you've started to sway" callback is **prose only.** `$wranglerKnown`. Exits unchanged.

- **L6 · TheGaff · the Mechanic** *(corrupt)* — behind the rigged wheels, a grease-handed mechanic
  who clocks you as someone who's seen the strings and offers to let you in on the trade. **Gives:**
  `$knowsTheGaff` — *the carnival reads you as its own now, staff near enough, no longer a clean
  mark.* Bought with `<<corrupt "armR" "pig" 25>>` (the working hand goes over); refuse `<<soothe
  6>>`. **Catch/fix:** the original sold a "tilts the wheel/games your way" edge — **that hook does
  not exist** (`setup.spinWheel` reads no such flag). **Fix:** ship it as a **belonging/regard flag
  only** (a real, legible social state), and **do not** claim a working odds-edge. **Fork:** if you
  want the mechanical edge, it's **deferred engine work** — a new `$knowsTheGaff` branch in
  `setup.spinWheel` — spec it separately, don't ship it as already-working.

- **L7 · TheMeatRow · the Tally-Boy** *(clue)* — a vendor literally assembled from the stock it
  sells, running a sideline in what it overheard. **Catch:** the original was a **paid info-broker
  selling `$heardOfTree` / `$heardOfSigil`** — both **dead flags** (the brand and sigil paths are
  *item*-gated, not knowledge-gated), and the broker framing **duplicates the L6 Fly** almost
  exactly. **Fix:** recast as a **free prose-pointer** (digger idiom) in its **own small passage**
  `TheTallyBoy` off TheMeatRow (so it doesn't crowd the loot/Surgery/Fleshcutter links): one
  breadcrumb — the "fire at the bottom that burns through anything" (the brand, as rumour) — plus
  the broker self-regard beat (*it sees which of your parts it would shelve where*). `$meatRowTipped`,
  optional `<<corrupt "head" "pig" 1>>`. Add the new room to `setup.depthOf` (=7) and run
  `tools/passage-graph.mjs --check`.

- **L7 · TheLatrine · the Šulak** *(was corrupt → now flavor)* — the watcher-at-thresholds the room
  already names as "the whole room, patient, attending," speaking from every stall at once. **Catch:**
  the original reward `$hasComposure` (a poise/flee boon) **has no engine home** — there's no composure
  stat, no CHA-flee, nothing reads it; and wiring a "+22, choose a stall" bargain into a room whose
  prose ends *"do not, under any circumstances, choose a stall"* contradicts the room's own warning
  (the gotcha the writing-rule forbids). **Fix: demote to a flavor monologue** — it delivers the
  threshold-philosophy (agency-loss / being-watched, the game's core fear), `$sulakHeard`, a modest
  `<<corrupt "head" "filth" 3>>` for hearing it out, a `<<soothe>>` refuse; the room's warning stays
  the dominant note. **Fork:** a real poise/composure stat is a separate mechanic build (graft-style)
  if you ever want it.

- **L8 · TheHooks · the Unrendered** *(clue)* — among the hanging work, one body still has a face and
  is slowly, lucidly changing expression. **Gives:** points **down** to the **third sigil-fragment** —
  *the last third rode the runoff into the Sulphur Deep's yellow light.* **Catch/fix:** the original
  added `$heardOfDeepFragment`, a **dangling flag** (the runoff path opens freely; nothing gates on
  "have you heard"). **Fix:** keep it **pure foreshadowing** behind one `$hooksSpoke` only;
  `<<corrupt "head" "filth" 2>>` (lean close to a rendering mouth). Re-word to point unambiguously at
  L9's fragment, not L8's own. Exits → TheWard / TheTallowFalls / TheLine.

---

## 5. Cut (collisions — do not staff these)

- **L2 TheRatKing** — the rat-king council is already a resolved social set-piece; the cheese/rat-
  craving arc is its own thing. Don't crowd it.
- **L5 TheArrivals** — already at capacity: clerk-thing ledger + wedding-ring man + the grey reader
  who plants `$heardOfWord`. (The L5 Swallowed clue is deliberately a *secondary* planter for players
  who sneak past Arrivals, not a duplicate.)
- **L5 TheIndenture** — the work-curse contract **is** the layer's corruptor/bargain already
  (`setup.takeWorkCurse`). A second corruptor in a 3-room layer breaks restraint.
- **L8 TheTallowFalls — the Warmth-at-the-Top** — the proposed `$tallowGlazed` leg-ward duplicates
  **TheWard**'s existing render-a-piece bargain (and `$hasWard` grants a *mark*, not armor, so the
  "parallel ward bonus" was never real). L8's corruptor slot is filled.
- **L4 TheBellChamber — the Ringer** *(recommend cut)* — the underwater-bell set-piece is lovely, but
  the proposed `$deepEar` buys a **navigation shortcut that doesn't exist**, and it's **redundant** with
  the Last King (both point at the same well-boss, in adjacent rooms), in a layer already carrying
  three heavy head-corrupt interactions (Whisperer 35, Understudy 45, the Reflection 32). **Fork:** if
  you love the bell, keep it as a *free* one-shot mood beat (`$ringerHeard`, no corrupt, no fake flag) —
  but cut is the cleaner restraint call.

---

## 6. Deliberately left empty (restraint)

Considered and **recommended to stay empty** — their power is the absence of anyone:

- **L1 TheGaugeHouse** (the Rest) — the one quiet "you're briefly just a person" beat in a layer about
  hope betrayed; a resident cheapens it.
- **L3 TheCisternOverflow** — the lagging-reflection beat is self-contained, and the reflection motif
  belongs to L4 (the Reflection snare, the Whisperer).
- **L3 TheRootCellar** — the warm pulsing roots are brand/burning-tree territory, which is the L9
  digger's job; a resident here doubles that clue.

---

## 7. One thing that must stay un-taught (owner, 2026-06-25)

I'd first flagged the **Clean Pool cleanse** (L2, off TheRisers — the only corruption-*reducer* in the
game) as a gap: "no teacher." **That was the wrong lens. It's intentional, and it stays that way.**
If the player were *told* about it, it wouldn't be clean — both literally (the cleanse's whole power is
stumbling onto the only clear water in hell, unearned) and as design (foreknowledge turns a grace into a
quest-marker, and a race you can pre-game). **Discovery *is* the mechanic. Do not add a teacher for the
cleanse**, and apply the same caution to anything else whose value is the surprise of finding it.

The general rule this corrects: **a missing teacher is not automatically a gap.** The §1 clue-NPCs all
point at *load-bearing progression* a player can hard-stuck on — the rope climb, the kappa bow (which
*locks* at corruption ≥ 50, so early knowledge is the whole point), the brand escape route. Those
genuinely benefit from being learnable up-river. A *grace* you stumble onto is the opposite: signposting
it destroys the thing. Keep the cleanse unmarked.

---

## 8. Suggested build order

Sequenced by gameplay value (the teachers first — they fix the discoverability gap), then world-
legibility, then the deals (which need the most design care). All are additive — each hangs off an
existing room and loops back, nothing rewired.

1. **The eight clue-teachers (§1 table)** — highest value, all free or near-free, no engine work:
   Last Inspector, Sitter, Last King, Lost-and-Found Keeper, Scrivener, Swallowed, Tooth-Counter,
   Bone-Rimmer (+ the Hooks foreshadow). Start here.
2. **The flavor witnesses** — Commuter, Voice Above, Reader, Newly-Laid, Beadle, Weeping Wall,
   Tallykeep, Remainder, Gypsum-Eater, the demoted Felt & Wrangler & Šulak. Pure prose + small
   knowing-cost corrupts; no new mechanics.
3. **The five corruptors** — Pryer, Tarman, Tanner, Gaff, Warmer. Do these last and one at a time:
   each has a fork above (the Pryer's L1-graft question, the Tanner's reward-or-not, the Gaff's
   deferred wheel-edge). Settle the fork before writing.

A natural **first slice to validate the pattern**: build **one layer fully** (L1 — Inspector + Commuter
+ Pryer = clue + flavor + corrupt, the whole triad in one band) the way every layer was built — compile
→ `tools/passage-graph.mjs --check` → drive in browser → zero console — then roll the rest.

---

## 9. Forks for the owner (decide before building)

- **Pryer (L1):** OK to let a `graft_hand` appear in L1, *before* the L7 Cutter? (If not → rewardless.)
- **Tanner (L3):** rewardless pay-with-self (recommended), or alternate `graft_hide` installer?
- **Gaff (L6):** ship `$knowsTheGaff` as belonging-flavor only (recommended), or commission the deferred
  `setup.spinWheel` odds-edge as real engine work?
- **Ringer (L4):** cut (recommended), or keep as a free mood beat?
- **Šulak (L7):** flavor monologue now (recommended); build a real composure/poise stat later, or never?
- **Corrupt amounts:** the corruptors use targeted body-corruption as the real cost (the rewards are
  mostly narrative). Confirm the band-appropriate numbers (sewer ~12–14, the Tarman's 22 for a real coin
  payoff, the carnival/hell deals 18–25). All are real `seg`/`class` pairs; all verified against the feed
  threshold.

---

*Survey + grounding: a 9-layer parallel read, each candidate ground-checked against the live engine
(room existence, NPC collisions, real-flag/real-mechanic confirmation, free-flag-name checks). The
grounding pass is why every flag, `<<corrupt>>` call, and adjacent-passage name above is real and not
guessed. — 2026-06-25*
