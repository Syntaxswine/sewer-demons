# Sewer Demons — RPG-Canon Review (2026-07-01)

*A design review of the game against the classic D&D/CRPG canon — character creation,
exploration, talking, fighting, loot, inventory, buying and selling. The genre has been
reimplemented so many times that its floor is well documented; this review hunts the
low-hanging fruit that floor implies. Everything here is **new relative to
`BACKLOG.md` / `HANDOFF.md` §9** (overlaps are scoped and flagged); backlog items were
deliberately excluded.*

**Method.** Nine parallel reviewers (one per subsystem) read the actual source; 45 raw
findings were merged to 37, the top 28 each adversarially fact-checked by an independent
skeptic against `src/` (greps, line reads, `dist/` engine internals). **Zero were refuted.**
All file:line pointers below survived that check. The 9 below-cap findings (§8) are merged
but **unverified** — re-check pointers before building on them.

**Constraints honored throughout:** no new layers up or down (horizontal rooms are fine);
nothing audio-dependent; hand-authored and fixed; lean voice, diegetic framing.

**The meta-finding:** the engine is ahead of the content. Again and again the gap is not
missing machinery but **unwired plumbing the prior arcs already paid for** — `statCheck`
declared "the convention for ALL non-combat checks" with one consumer; `canSpeak` with
zero; multi-enemy combat with one pack in 26 fights; ~41 authored item descs that render
once; three olfactory systems the player can't act through; a foreshadowed loop-back stair
never opened. Most fixes below are cheap *because* the foundations are already laid.

---

## 1 · Trust & fairness — the chrome betrays the thesis (do these first)

**R1. Stock rewind arrows undo every irreversible beat.** `[DECLINED 2026-07-01 — WON'T
DO]` The analysis stands (zero `Config.*`, so the default Backward/Forward arrows let one
click un-cast the bones / un-land a `<<corrupt>>` / un-die a death, and marks written via
`memorize()` desync). **But the owner keeps the arrows on, deliberately:** save-scumming is
always available anyway, and removing undo disrespects the player's time. The agency-loss
thesis lives in the *fiction and systems*, not in stripping standard player conveniences —
so **do not disable history controls, and do not "helpfully" re-file this.** (Same lesson
as R3: a default that looks like a thesis-bug can be an intentional player-respect choice.)
Leaving it also keeps R26's `visited()` on the full default `maxStates`, no cap needed.

**R2. The belonging clock is invisible, and silent exactly where it runs fastest.**
`[S — SHIPPED 2026-07-01]` `$deepTurns` accrued per-move (×depth) and flipped `$sealed`
(360) inside PassageHeader's `<<silently>>` unnarrated; the `SEAL_WARN` (220) prose lived
in 4 upper-band passages only; the caption showed nothing. A player could cross 220 AND 360
unannounced — a warn-before-irreversible break at the most run-deciding threshold.
**Owner reframe (the improvement over the original proposal):** don't surface it as a
*navigation* clock ("the exit is closing") — surface it as a **psychological** one: the
MIND getting comfortable in the dark and in the shape the deep is making of you. *Comfort is
the corruption.* This is the same revulsion→acceptance→relish arc the scent system already
runs, applied to the belonging axis — and it sidesteps over-assertion (a mind settling in is
true even for a Sigil-holder who could still leave). **Shipped:** `setup.sealTier()` (0-3 off
`SEAL_WARN`/mid/`SEAL_LIMIT`) + `setup.SEAL_MIND` prose in the `<<script>>` block; a
persistent `.seal-state` caption line from ≥WARN ("The way back up has stopped nagging at
you." → "This shape, this dark — they've started to feel like yours." → "You live here now.
You've stopped reaching for the way out."); and a `.settle-line` milestone **beat** that
fires once per tier escalation (monotonic `$sealNoticed`, no re-fire), violet-grey = the mind
axis. Tier-3 is claim-scoped ("whatever leaves here now goes out the front, or not at all" —
verified: layer5 `EndingUnbound` is not `$sealed`-gated). Verified in-browser: exact tier
boundaries (220/290/360 + `$sealed` override), caption tracks tier, beat fires once and
never repeats, silent below WARN, zero console.
**Owner follow-up (shipped same day): the clock RESETS when your dominant form changes**
(rat→pig, via `setup.bodyClass().cls`). The seal tracks settling into your *current* nature,
so becoming something else un-does the settling — `$deepTurns`→`SEAL_RESET_TO` (0), `$sealed`
cleared, `$sealNoticed` re-armed, and a distinct `.settle-switch` un-settling beat ("The rat
in you is giving way to the pig… the settling starts over from nothing"). First onset
(human→first class) only records the form, no reset. It's self-limiting (changing dominance
means pumping corruption into a new class, marching toward the corruption-loss end — a trade,
not a free dodge; the low-corruption clean run never switches, so its clock floor is intact).
Robustness fix: the belonging block moved *before* the encounter roll and a fired beat
suppresses that move's encounter, because `<<goto>>` does **not** abort the rest of
PassageHeader — otherwise an encounter would advance `$sealNoticed`/`$formLast` while
discarding the (unrendered) beat, losing it permanently. Verified: first-onset no-reset;
rat→pig and pig→filth reset + correct prose; beat shows even at a forced 100% encounter rate
(suppresses it); non-beat moves still encounter normally; zero console.

**R3. Sidebar Restart wipes the cross-life ledger with no warning that it differs from a
death-restart.** `[S — SHIPPED 2026-07-01]` **Owner correction: the wipe is intentional.**
Every in-game restart path (any ending's "Again" → `setup.restartCarry`, 18 sites) carries
marks/runs/scars/discovered/build; the manual sidebar Restart is the *one deliberate* true
fresh start (StoryInit :421–430). The original "invert the default" proposal was wrong — it
would erase the only intended full wipe. The real gap is only that the button gives no hint
it behaves differently from dying-and-continuing. **Shipped fix:** a low-key note above the
button (a `#menu-item-restart::before` in the Story Stylesheet, dim ochre italic, field-guide
chrome) — *"Wipes every past life. Reaching an ending and going again keeps your marks; this
button alone clears them."* CSS-only, targets the `<li>::before` so it won't clash with the
`<a>::before` power icon; verified in-browser (renders above the button, icon intact, zero
console). *Autosave sub-point left open:* with `Config.saves.maxAutoSaves` at its default 0
there is no autosave, so a closed tab still loses an in-progress run — a separate,
un-endorsed question (the death-carry loop is the intended safety net); noted, not built.

**R4. Toll prices are posted in a dead currency.** `[M — SHIPPED 2026-07-02]` Eleven choice
links said "(+20 corruption)" but drove `<<corrupt "torso" "pig" 20>>` — one *segment* bucket;
the visible meter (avg of six) moved ~+3.3. The label over-warned ~6× on the bar and
under-warned on what matters: the segment, the **class** (what you'd become), and whether
it would *finish* a part (irreversible, unwarned). **Shipped:** `setup.tollTag(seg, cls, amt)`
in the `<<script>>` block — *"pays 20 pig into your torso"*, the bodymap's own words (amount ·
class · segment), escalating *"— enough to turn it for good"* when `segTotal(seg)+amt >= 100`
(soothe skips turned segments — that sale is forever) and *"— turned already; it scarcely
matters now"* past it; mirrors `corrupt()`'s `always_class` curse resolution so the tag never
lies about what would actually land (verified: sty_signet worn → a filth-priced toll honestly
reads pig). All 11 links converted to the computed-label pattern (TheSmithStall's), bodies
untouched — label and landing verified to agree in-browser, and the label is now *state-aware*
(the same knife reads "enough to turn it for good" once your torso is 75-full, which a static
label never could). The two prose price-previews (layer9 fume-cut, layer4 sump sluice) aligned
to the same currency; the Cutter's four graft labels retrofitted to the helper (now with the
class word); and the **L1 Pryer — which posted NO price at all for a 14-rat graft — now posts
it**, "and there is no taking it back".

**R5. The creation screen commits a permanent cross-life build on zero information.**
`[S — SHIPPED 2026-07-01]` Blurbs were pure flavor; nothing said CON is the *sole* input to
max HP (CON 1 = **1 max vigor at L1, every life**), that INT changes how plainly the world
deals with you, or that the spread is memorized once and carried across all lives. No derived
preview; no confirm — against HANDOFF §8(c) ("an informed choice, never a gotcha").
**Shipped, all three parts:** (a) a mechanical `does` clause per stat woven into the blurb
italics (STR "how often your blows land, and how deep"; DEX "your armour, and your chance to
get away"; CON "your vigour — and nothing else feeds it; set it low and you wake frail"; INT
"how plainly the world deals with you, and the fuel for what magic you learn"; WIS/CHA kept
honest — CHA's notes it's thin "yet", the informed-choice opposite of a gotcha); (b) a live
vigour preview above Begin — "your body would wake with N vigour" (+ "barely a body at all"
at ≤4), `Math.max(1, 4*(5+mod(con)))`, matching L1 `playerMaxHp`; (c) an inline
`<<linkreplace>>` second-ask when any stat ≤4, copy corrected to the engine (permanent +
cross-life; a level or two lifts a low start *within* a life, never the next life's; only a
Restart undoes it — which ties into R3's warning). Verified: default shows the clauses +
"12 vigour" and Begins straight through; a CON-1 build shows "1 vigour — barely a body",
gates Begin behind the warning→Yes confirm, and commits to the previewed maxhp 1; zero
console. Overlap: backlog's caption-split is the in-game side; this is the creation side.

**R6. Marks bank in silence — no death recap, no ledger, no reader.** `[M]` Every ending
calls `recordRun` (:791–799) which silently banks the fate mark, bargain marks, cursed
gear; the 18 bare "Again" links never say that pressing them is *how anything survives*.
Six of the fate marks have zero consumers anywhere. The world reads your marks constantly;
you can never read your own. **Fix, three lean surfaces:** (a) an `<<again>>` widget
replacing the 18 links: one compressed ledger beat ("The deep enters it in the register:
*witless*. What follows you down: …") — read **live `recall('marks')`**, not the StoryInit
`$marks` snapshot, so the just-banked fate shows; (b) returning players (`$returns gt 0`)
find their own incised entries in the layer-5 threshold register (extends :296–304);
(c) the Fortune-teller reads what carried for ~5 coins via a `setup.MARK_READ` table
(unknown ids get "something the deep has not named to me" so future marks never break it).
Overlap: backlog's caption-split + kin-spending are the *teeth*; this is the missing
*communication* layer.

---

## 2 · The sheet lives between fights

**R7. `statCheck` — "the convention for ALL non-combat checks" — has ONE consumer in 236
passages, and it's mute.** `[M — PARTIAL: fingerprint SHIPPED + 6 new consumers 2026-07-03]`
Only the bones appraised (layer6:778). **The short-weight men** (see the third-ledger note
below / COMBAT.md) added **six** fail-forward `statCheck` consumers at a stroke (one per
dump stat), and delivered fix (b): statCheck now stashes `setup.lastCheck {roll, mod, pen,
dc, margin, fresh, passed}` and `setup.checkMargin()` gives the narration word, still
returning a plain boolean (coercion never calls `.valueOf`). **Still open:** the ~6–9
*authored* band-checks (a) as set-dressing, and a systematic `checkAftermath` line + the
`Math.max(corruptionPenalty, limbPenalty)` ride-along.
**Fix (remaining):** (a) ~6–9 diegetic **fail-forward** checks, ~2 per band (seized sluice-wheel STR 12
in L2, corpse-choked silt squeeze CON 10 in L3, grease-slick tallow crossing DEX 11 in L8
— authored as set-dressing, never a locked door; failure pays in corruption/HP/noise via
`<<corrupt>>`); (b) keep dice hidden but leave a fingerprint: statCheck keeps returning a
plain boolean (verifier: the `.valueOf` object trick fails — JS boolean coercion never
calls it) and stashes `setup.lastCheck` {roll, mod, pen, dc, margin}; a `checkAftermath`
margin-word line narrates close/comfortable/fresh-penalty. Ride-along: fold
`Math.max(corruptionPenalty, limbPenalty)` into statCheck like fleeRoll does — discharges
part of the backlog's limbPenalty wish in one line.

**R8. XP pays for kills only.** `[M]` `gainXP` has exactly one caller: CombatVictory.
The kappa **bow** — the game's celebrated nonviolent beat — yields the cleanse but no XP
while **forcing** the same kappa pays 48 XP; XP is the only asymmetry between the paths,
i.e. the game literally rewards violence over the bow. Clean-run players finish at L1 with
−2 mods. **Fix:** an `<<earn N>>` widget (gainXP + extracted level-up prose) at ~9 one-shot
milestone sites: valve puzzle, counterweight, causeway lesson (keep its +2 filth cost —
it becomes a priced trade), kappa bow (the keystone: composure-gated at corruption<50, so
it structurally rewards the clean player), privy-shrine word, 3 sigil pickups, fatberg
burn, first shift. Amounts sized off the real table (rat-man 24, kappa 48).

**R9. WIS is dead from 1–11, and combat-inert.** `[M — the AMBUSH SHIPPED 2026-07-03 via
the short-weight men; keen/numb register still open]` Sole consumer was `passivePerception`
(:2790) feeding two DC-11 gates — both bypassed by free narrative tip-offs. **Shipped:** the
WIS short-weight is an **ambush** — a passive `statCheck('wis', 10)` on a safe-seeming heap;
a failed sense = the lurker takes a **free opening turn** (`setup.ambushFight`), the fight
starting before you decided to have one — agency-loss in its purest combat form, exactly as
specced, and the fresh −2 rides it (the unhardened get jumped). WIS is no longer
behaviourally identical across 1–11: a low-WIS body gets ambushed where a keen one senses
it a step short (and may strike first). **Still open:** the keen/numb *register* (`isKeen`
mirroring the mind register), the keen slip-aside link, and passive room reads. Note the
short-weights ALSO woke **CHA** (its own face, a real consequence — see R below / the
third-ledger note), which the fix's *"backlog says CHA wakes next; WIS queues behind it"*
sequencing predates: both now have teeth via one system, the register-depth still to come.

**R10. Leveling is the one power faucet the deep gives away free.** `[S — SHIPPED
2026-07-02, one commit with C1]` Every other strength source is priced in self (Word,
motley, grafts, cheese, shifts); gainXP raised all six scores + HP for nothing — while the
level-up prose explicitly claims "the deep has been teaching you." **Shipped:**
`setup.LEVEL_SEAL = 15` booked per level in the gainXP loop (flat, not depth-scaled —
CombatVictory sits at depth 0), with the same seal check as the clock; one ledger sentence
in the level-up paragraph ("The deep does not teach for free: every lesson is one more way
you belong to it"). The margin arithmetic surfaced a buried debt: **the map had grown
under the old limit** — the audit floor is now 223 (was 183 when 360 was set), so 360 had
quietly shrunk from 2.0× to 1.6× of floor. **SEAL_LIMIT → 440, SEAL_WARN → 260** (floor
223 · rule-of-thumb real run 312–379 · + 2–3 lessons ≈ 342–424 · + one rest ≈ 350–440;
a double-descent re-diver ≈ 446 on moves alone still seals). Re-audited green.

**R11. Smell is done to the player but never wielded.** `[M]` Three olfactory systems and
no scent *verb*: stealth items are all light/sound-framed; no cover-scent, no smelling
like the floor. The fiction calls the scent-read "a sense that does not lie" — an open
invitation to let the player try to lie to it, at a price. **Fix:** `$scentMask {cls, left}`
— wallow at the sty / vat-grease / a HellMarket vial; price = `<<corrupt>>(seg, cls, 4–6)`
(the disguise IS a corruption faucet: pretending to belong is a down payment on
belonging); nose-blindness hides the moves-left count. Verified gate: the mask must
**synthesize** the regardOf read (floor load at REGARD_MIN_LOAD 35, tier at 2) or it's a
silent no-op for fresh bodies — or scope the fiction so the mask only takes on a
beast-enough body and say so in the market copy. Overlap: backlog's regard items are all
the world reading the real body; a player-side spoof verb is new.

---

## 3 · Combat reads differently

**R12. Every monster fights identically; Guard is a dominated button.** `[M — SHIPPED
2026-07-02]` One AI: one weapon-die attack per round, forever; no enemy status effects under
any name. With zero variance, Guard (deal 0, halve incoming) only stretched the attrition
race. **Shipped — all 11 species have a signature move**, telegraph-then-payoff (`move:` on
the registry → `setup.ENEMY_MOVES`, prose + effects in the script block; `every` cadence,
default 3, Glut 2): the wind-up **spends its attack** (the telegraph round is a free window,
marked *"— gathering itself —"* on the card), the payoff **auto-lands** next round unless
answered — **Guard blunts it** (charge quartered, grab shrugged, gulp halved+starved),
**a stun cancels it** (the stun special finally has a premium target), **Run leaves first**.
The moves, from what each thing is: rat/rat-man *squeal* (+1 rat, pack caps 4 — Guard can't
stop a sound), shit-golem/Glut *engulf* (**lose your next action** — menu collapses to
*Wrench yourself free*), drowned/crawler/kappa *grapple/coil/pullunder* (**held** — Run reads
"held fast" one round), gorger *gulp* (heals itself the wound's worth), pig-demon/grafted
*gore/manyhands* (the Guard test — double dice unguarded, quartered braced), sty-hand *drag*
(**a landed drag claims you for the shift** — `$workOwed` + station, the recruiter recruits).
Verified per-move in-browser (cadence, guard/stun answers, pack cap, gulp-heal arithmetic,
drag claim, held release) + UI click-throughs (marker, "held fast" Run, wrench cycle). Sim
stays a per-hit probe, now disclaimed in-file. Spec: `docs/COMBAT.md` → "Signature moves".

**R13. Winning is mechanically sterile.** `[S — SHIPPED 2026-07-02]` Corruption flowed only
on LOSS or casting; twenty 1-HP scrapes left you as clean as never being touched — despite
every enemy carrying a `class` that canonically "rubs off." **Shipped — the smear:** on an
enemy **crit** (nat 20, ~5%/attack, already rolled and narrated), `CRIT_SMEAR = 2` of its
class into one random segment; **Guard halving a crit halves the smear** (Guard's second
job, verified: braced crit = half damage AND 1-point smear). The log line speaks R4's real
currency: *"The wound keeps a little of the pig that made it (2 into your R-arm)."* Bounded,
avoidable, and the win ledger is honest now — you beat the thing, and you wear a little of it.

**R14. No pre-fight "con" read.** `[M — SHIPPED 2026-07-02]` statLevel spans 3–12 and the
bottom of the curve is brutal (fresh L1 vs pig-demon: 7%), but HP/AC appeared only after
committing. The canon consider-check had a uniquely diegetic channel sitting unused: **you
could smell rooms and the world smelled you, but you could not smell the thing in front of
you.** **Shipped:** `setup.threatRead(spec)` (script block) — pack statLevel + 2×hd
(strongest full, rest half) shifted by the creature's *nature vs the tool in your hand*
(weakTo/resists ∓2, weakTypes/resistTypes ∓2, boss +2), against 3×level + weapon-die max;
four rungs (0 / −6 / −8 boundaries), four prose reads in `setup.THREAT_SCENT`
(sing/plural), surfaced by `<<scentof spec>>` in the room-scent band voice (rung 3 gets a
new rust-red `.rs-dread`). Calibrated against the sim and verified in-browser: the whole
L1-fists column matches (rat 0, kappa 1/65%, drowned 2/28%, grafted 3/1%), the armed
column matches (gorger 1/57%, golem 2/22%, pigdemon 2/25%), and the affinity shift shows —
the same golem reads rung 2 sword / rung 0 golembreaker; the Glut reads conservative on
purpose (a boss should smell like leave). Rolled out at 22 gate-room sites + the 3
encounter fight-arms (`<<scentof _den>>` handles the denizen pack's array; plural prose
verified at TheCleanPool's two golems); the Bathhouse failed-bow arm deliberately skipped
(no choice left to inform). It is a smell, not a stat sheet: it cannot see armor,
consumables, or luck, and the material +N inside a die class stays below its resolution.

**R15. The pack machinery is content-starved.** `[S — SHIPPED 2026-07-02]` Arrays, aim UI,
sweep/cleave specials, mixed-class loss marking — all built; **one** pack fight in 26
callsites (2× shitgolem), zero mixed packs, so the aim UI almost never appeared and the
most thematic branch — a mixed pack marks you MIXED, the mutagenic thesis — could never
fire. **Shipped — five set-pieces converted** (each with a prose beat introducing the
second body, its `<<scentof>>` retargeted to the pack, and the cleared-lander acknowledging
the extra corpse): RatKing → `["ratman","rat","rat"]` (the den attends its champion);
**TheSty → `["pigdemon","grafted"]` CROSS-CLASS** (the boar's muck-hand rises off the
wallow's edge); ThePits → `["gorger","grafted"]` (the pits keep an assembler); TheDeepWell
→ `["glut","shitgolem"]` (spray before the wave); **TheSumpGalleries →
`["ratman","drowned"]` CROSS-CLASS** (it drained here, so it belongs here — the hinge
floor's first mixed press). **The mixed CombatLost case authored:** `loseFight` now returns
`clsSet` (distinct classes that actually LANDED in the marks — honest even when a 1-limb
roll lands only one nature from a mixed pack), and CombatLost branches on
`clsSet.length > 1` → *"Not one nature but several were worked into you at once — pig and
filth together in the torn places — … they pool, the way everything down here pools."*
**denizenPack mixes** (the 3-line tweak, verified at rate in-browser over 300 draws each):
d≤3 pairs are half ratman+rat, d4 pushes a strayed ratman 35% (drowned+ratman — rat/filth
mixed), d7 lends the boar a grafted 25% (pig/filth mixed). Verified: RatKing driven
end-to-end (3 actors, aim UI up, victory → lander → flag → the new prose), the mixed-loss
branch driven twice (nLimbs=1 correctly held the single-class prose; nLimbs≥2 fired the
mixed line), zero console. Balance sits on R14's read: the 3-rat den reads rung 2 at L1
fists, the doubled Sty reads the verdict rung — the packs arrived pre-labeled.

**R16. No mid-fight parley — and `canSpeak` has ZERO consumers.** `[M — SHIPPED 2026-07-02]`
Surrender was all-or-nothing (robbed + corrupted + marched); canon's yield/bribe middle path
was absent — in the one game where CombatLost itself canonizes that the deep wants labour,
not death. **Shipped:** a **"Yield — offer them something"** action beside Surrender, gated
`<<if setup.canSpeak()>>` else the act-spent grey *"Yield — your voice will not come"* —
**the silver_muzzle's first mechanical bite**, in the curse's own label language. The yield
submenu telegraphs whether anything can HEAR (`setup.packListens()` — any alive actor with
`parleys`; minded kinds only: rat-man, kappa, gorger, pig-demon, sty-hand — the gorger and
pig-demon already take tolls at the forks, so the flag is canon-consistent) *before* you
spend the round. Two offers: **toss the purse** (`setup.yieldPurse()` — loseFight's robbery
formula, voluntary; they take what they take, you walk out unmauled to `$combatOrigin`) or
**offer the shift** (`pressGangTo($combatOrigin)`, or the binding reels a work-cursed player
to their own post owing a shift — mirrors the encounter's go-quietly branch). Both land on
the new `CombatYielded` beat ("how much like paying a toll" / "found serviceable, and
marched"). Offering at a deaf pack = a wasted round, telegraphed — the log line + the pack's
riposte. `parleys` carried through the combatActor whitelist; `CombatYielded` added to
encounterEligible's exclusions. All four paths driven in-browser (purse took 5/20 → walked
out whole; shift → marched to TheBoilHouse unmauled; deaf golem ate the round; muzzled Yield
greyed), zero console. HANDOFF §5's canSpeak-in-combat claim is finally true.

**C2 (critic, verified by grep). Enemies have no morale.** `[M — SHIPPED 2026-07-02]`
Nothing ever broke, fled, or yielded on the enemy side; the only self-preservation in hell
belonged to the player. **Shipped:** `setup.moraleCheck(e)` runs at the top of each enemy's
action in `enemyTurn` — when **badly hurt** (wounded AND ≤⅓ hp; a pristine 1-hp rat is not
"badly hurt") or **a packmate has fallen**, it weighs the fight ONCE per fight (per-actor
`moraleChecked` latch, no re-roll spam): d20 + statLevel vs **DC 8 + 2×your turned limbs +
2×pack deaths**. Shipped standalone on turned-limb count (R17's `$blood` can deepen the DC
later). A broken enemy **flees** (hp 0 + `fled`; the card reads *"— fled —"*) and pays
**nothing**: spoils only accrue in playerStrike when a body falls, `dropSourceEnemy` skips
fled, and an all-fled "victory" gets its own beat (*"nothing dead, nothing to strip, the
room simply yours because everything else in it declined you"*) with no scrape/XP/drop
lines. Bosses + the sty-hand hold by nature (paid to bring bodies). A held check is silent.
Rates verified in-browser (500-draw samples: hurt rat clean 18%≈20 expected, 4 turned limbs
59%≈60, pigdemon clean 0%, pigdemon 4-limbs+2-dead 45%, glut/sty-hand 0%); a rat-pack break
driven end-to-end through the Guard button. **The break exposed a real seam and it's fixed:**
pre-C2, the enemy phase could never end a fight, so Guard/Items/Wrench/failed-Run/deaf-Yield
checked only `$hp` — a whole-pack break left a dead fight on screen. All six handlers now run
the full outcome tri-check. The horror read landed: the more turned you are, the more hell's
own creatures refuse you — regard, inside combat.

---

## 4 · The world remembers

**R17. Victory leaves no residue — violence is quietly the optimal purity strategy.**
`[M — SHIPPED 2026-07-02]` Losing writes itself into your body; winning wrote nothing —
the murderhobo stance was the cheapest and cleanest, the exact inversion of horror canon.
**Shipped:** `$blood {rat,pig,filth}` tallied by `setup.tallyBlood()` at the top of
CombatVictory (the one funnel — set-piece and encounter kills count free; the sty boar
composes with the sows' memory). **Fled enemies are NOT tallied** — a broken enemy takes
nothing of you with it, in both directions. Cost as **regard/attention, never meter
points** (clean run untouched — floor 223/49% re-verified; regard-probe clean). Two
thresholds per class per life: `BLOOD_FELT 3` — kin smell it (kinhelp kindness CURDLES
as a shown beat, no coin/heal; the backtowork kin-claim pass closes — the *withered
welcome*; morale DC +2 vs that class, verified 20%→30% break at 3 rat kills, so a
kin-slayer sees more flights = less reward — attention compounding into economics);
`BLOOD_FEARED 5` — the floor stops offering labour (backtowork becomes *the reckoning*,
go-quietly withdrawn; pigpress/vatpress poach offers withdrawn on pig/filth blood;
refuse-links relabel "Meet them — it was always going to come to this"). The
`$workCursed` **binding-reel stays reachable at any blood** ("Stand on the binding — you
are owed work, not a grave" → driven to TheCageAct, shift owed): a ledger has no nose.
All baselines below threshold verified intact; the C2 morale-DC fold this item owed is
paid. Doc: COMBAT.md → "The blood ledger". Overlap: backlog's regard reacts to what you
ARE; this is what you DID.

**R18. The quest atom never closes.** `[M]` The one embryo: the barkeep announces a rat
bounty (layer6:325) — but the fight is ungated and repeatable (an immortal 2-coin+XP
faucet), no bounty is ever paid, and the Fly never registers the deed. Zero NPC-issued
completable goals exist (grepped eight phrasings). Agency-loss horror needs agency to
erode; a world that never asks anything OF you flattens the meter the game is about.
**Fix:** close the rat loop (one-shot flag, `HellTavernCleared` lander, real 8–10 coin
bounty + `<<corrupt 'torso' 'pig' 3>>` — doing the place a service makes you a little more
its own; one acknowledging line in the Fly's tipped branch), then 2–3 hand-authored
errands built AS the §D helpers-in-the-deep pattern (`$helped_<id>`, once per run, reward
in the room's own currency): the Newly-Laid (L4 tomb) → the Voice Above (L2); the
Lost-and-Found (L6) → the still-lucid Unrendered on TheHooks (L8).

**R19. NPCs are deed-blind — including the one whose premise is that he sees everything.**
`[S]` A systematic sweep of 130+ flags found NO conversation anywhere that reacts to a
deed done elsewhere (rooms do; dialogue never). The Fly introduces himself with "a fly
sees a great deal that reckons itself unwatched," then has nothing to say about the Glut
lying scattered or the Word in your throat. **Fix:** 2–3 deed topics in the `$flyTipped`
branch (exact existing `<<if flag>><<linkreplace>>` idiom; kappa logic is
`$kappaBested ? ($kappaBowed ? bowed : forced) : silence`; don't touch the load-bearing
rumor flags); one conditional clause in the Fortune-teller's reading. Zero engine work.

**R20. Ten load-bearing clues + the sigil meta-puzzle are untrackable.** `[M]` Clue NPCs
are one-shot linkreplaces whose revisit lines deliberately withhold ("he told you the way
of it"); no journal/rumor log exists; `$sigil` surfaces nowhere — not caption, not Pack.
A player who sleeps between sessions loses the 46-cast's discoverability work. **Fix — the
journal canon, done diegetically:** *what the arm remembers* — you scratch what matters
into your own skin. A `Scratches` passage (Equipment/Map pattern, no depthOf = no clock
tick) rendering a `setup.HEARD` table (script block) mapped from the EXISTING one-shot
flags, one FINDS-style compressed line each, plus the bone fragments you carry. The
signature twist for free: entries render through the mind register (at low INT the valve
becomes "the round thing"); if the arm turns, lines written on it are "stretched past
reading." Your own notes stop being yours — the journal enacts the thesis.

---

## 5 · Economy, inventory, body

**R21. The coinrot curse is bypassed by the biggest faucets (routing comment is wrong).**
`[S — SHIPPED 2026-07-01]` **Straight bug.** The comment claimed "the wheel — are routed"; it
wasn't: `spinWheel` and `castBones` paid bare `V.coins +=`, plus 12 unrouted `$coins + _pay`
sites (tavern/cage/boil-house wages, and finds in L3/L4/L5) = **14 unrouted payout points**.
A coinrot-cursed player collected full wages in clean coin, wasting the curse and the horror
beat of watching your pay rot. **Fixed:** all 14 routed through `setup.gainCoins` (returns the
amount kept, 0 when it curdles to junk); each payline now branches on the result so it never
claims coin a cursed hand didn't keep (the wheel/bones expose `res.got`/`.got`; the 12 layer
sites use a local `_got`). Comment corrected. Verified in-browser: `gainCoins(10)` = 10 clean
/ 0 + junk cursed; the bones coin-face and a tavern shift each show the curdle prose and add
no coin when cursed, pay normally when not; grep confirms no bare `$coins +=` faucets remain;
zero console.

**R22. No way to look at what you carry.** `[S]` Pack is a bare name list; ~41 authored
`desc` strings render exactly ONCE in the whole game (the Cutter's graft install) — dead
prose, and the hidden-until-identified system invites turning a find over in your hands
with nowhere to do it. **Fix:** a "Your pack" section on the Equipment screen
(itemDisplayName masked for unidentified + brief + desc; junk with its descs). Verified
prerequisite, STEP ONE: the desc strings live in the StoryInit `<<run>>` block —
**desugared-mangled** — so migrate the registry to the `<<script>>` block first (HANDOFF
§4); this also fixes the probably-live mangle at the graft site itself.

**R23. One consumable in a ~74-item catalog, usable only inside combat.** `[M]` Salve is
the entire consumable class; `useItem` has zero call sites outside the Combat menu; no
consumable touches anything but HP. The infrastructure is generic and starved. **Fix:**
an `effect` field switched in useItem ({buff/fight, encounter:N, soothe, dmg}) + 4–5
items bottling existing systems: butcher's blood-draught (+2 STR one fight, small pig
rider — carnival-sold phials keep the established corruption-rider price structure),
tallow taper (−encounter for N moves, rides the $workCooldown decrement pattern),
nose-plug (suppress next scent-recoil/regard read), bile-phial (thrown XdY), phial of
rain (portable soothe — gate against the clean-run economy or cut). Out-of-combat use
surfaces from R22's pack section.

**R24. Loot is a one-way street.** `[M]` `setup.buy` exists; no sell, pawn, fence, or
discard anywhere (grepped six ways). Drops pile up forever; coinrot junk "sells for
nothing" with no one to even refuse it; duplicate drops are silently discarded while the
prose announces "It's yours" (phantom loot — **small bug**, CombatVictory :3808–3813).
**Fix — the Ragman**, a lost-things buyer off HellMarket/TheLostAndFound: mundane gear at
~1/3 book, junk at 1 coin ("he weighs the hair and pays for the weight"), a flat **blind**
price for unidentified pieces (no appraisal questions asked — the missing third option in
the drop-mismatch rule: wear it / pay 6 to appraise / fence it blind and let some other
mark wear it), refuses known-cursed and quest tools. Twist: a cursed piece fenced blind
reappears on the trinket-monger's velvet for the next mark. Add 3–4 `kind:'valuable'`
keepsakes to FINDS (the stopped wristwatch — prose already written, grant currently
coins-only). Fix the duplicate-drop message (convert to scavenge-coins). Build him
regard-blind; the backlog's regard-pricing modulates him later.

**R25. Creation grants stats but no starting kit.** `[S]` You were snatched off the
street — and your pockets were empty. `$inventory = ["clothes"]`, bare fists; the Combat
Items button reads "Nothing usable" for the whole opening act. **Fix:** one pick, 3–5
modest options (rusty knife, a salve, a keepsake, a stub of candle…), asked in-fiction at
the moment the creation text says "what you carry under with you is all you will have
left to lose." Verified traps: grant in `commitBuild` for life 1 (StoryInit runs before
creation renders) AND in StoryInit after seedCursedGear for re-lives, keyed off a pocket
field banked with the build; use direct-push, NOT `setup.acquire` (a returner's re-seated
manacle_ring curse would silently eat the grant). Nothing that soothes.

**C3 (critic, verified by grep). Layers 1–3 have zero coin sinks.** `[M]` First possible
spend is an L4 toll; first shop is L6. A third of the game teaches that money exists so
press-gangs can take it. **Fix:** one tosher/mudlark peddler in a side-chamber off an
L2/L3 hub (horizontal growth), selling 3–4 cheap existing-registry items (a salve, a
low-tier weapon, rope) via the verbatim stall widget pattern (layer6:150–170). Being
robbable of coins you were *saving* finally gives loseFight's robbery early teeth. He
buys nothing (R24 stays its own fix).

---

## 6 · Structure, prose, time

**R26. No revisit-aware room prose anywhere.** `[M]` Zero `visited()` calls in src/. The
mandatory ~36-room round-trip re-serves the full 2–3-paragraph unfold on every re-entry —
during the game's tensest stretch, racing the seal upward, when the return leg is
dramatically the *opposite* journey. (Scoped by verification: NPCs and state beats DO
vary; it's the unconditional base unfold that repeats.) **Fix:** hand-authored compression
on the mandatory-spine rooms only: wrap ONLY the atmospheric unfold in
`<<if visited() lte 1>>full<<else>>one compressed line<</if>>`, leaving NPC/state/warn
material outside the wrapper. Get the spine list by extending clean-run-path.mjs to emit
its route (it already BFS-walks it). Verified: prose-guard would fail BY DESIGN here (it
asserts control-line invariance) — verify with build gates + a link-set diff instead.
Interaction: R1's maxStates cap must stay above the deepest revisit read.

**R27. The designed loop-back — TheSunkenStair — was foreshadowed, built, and never
opened.** `[M]` The drowned red-lit stair from L4 into hell (layer4:504–528) is still a
dead-end under a "/* foreshadow — opens when L7–9 land */" header; all nine layers have
been built for weeks. One hell entrance = every escape is the same full round-trip, and
L3/L4's richest optional content sits on a cul-de-sac. **Fix (the Dark Souls rule —
unlock from the far side):** a bottom mouth in L8 off TheGreaseTrap/TheRunoff (the stair's
prose already smells of "sulphur, and under the sulphur, cooking"; the kappa tend both
waters — it's their commute), opened by draining the throat ($ductVented switch pattern)
or granted after the bow. Two-way once open; the mandatory first descent untouched (rope,
brand, fragments still force the full trip) — this rewards the *return* and gives the
belonging clock a real strategic choice. Both-direction links, depthOf entries, regen
map-data, re-run clean-run-path.

**C1 (critic, verified by grep). Time passes only by walking.** `[M — SHIPPED 2026-07-02,
one commit with R10]` The sole `deepTurns` accrual in 236 passages was the PassageHeader
per-move line — a full rest, an indenture shift, unlimited wheel spins were all
**clock-free**, while crossing three doorways in hell costs 15–27. The seal fiction says
"staying makes you belong"; the mechanics only charged *moving*. **Shipped:**
`setup.passTime(rooms)` beside the clock knobs — rooms × current depth, same seal check,
so a rest in hell can itself flip the seal (verified in-browser: a wheel-spin at 438
sealed at 444, and the very next move fired R2's tier-3 settle-beat + caption — zero
extra wiring, the composition came free). Charged acts: **rests** (`REST_TIME 4` — in all
9 heal-on-entry rest rooms, charged ONLY when the heal actually heals, so a full-vigor
walk-through stays a free corridor and the structural budget is untouched); **shifts**
(`SHIFT_TIME 2` — doShift, doPressedShift, pressedToWork); **gambles** (`GAMBLE_TIME 1`
per wheel-spin/bones-throw — a long session at the gutter now costs the evening it takes).
Deliberately NOT charged: counter snacks (butcher/confectioner — minutes, not hours, and
already priced in coin+corruption). Depth-0 rooms are free, matching the walk clock.

**C4 (critic, verified by grep). No hireling — the oldest slot in the canon, and the
cheapest human witness.** `[M]` Nothing can walk beside you. The classic function (the
hireling is spent before you are) translates perfectly into this game's currency: the
deep takes labour, not lives. **Fix:** ONE non-combatant porter hired at the Hellmouth Inn
(another early coin sink): small encounter-avoidance while he lives (the felted_boots
lever), occasional footer interjections keyed to existing state — his nervous counting is
a diegetic delivery channel for R2's seal warnings — and his end IS the beat: when a
press-gang fires with him present, **they take him instead.** One lean line, gone, no
rescue. The first time agency-loss happens to someone beside you, and a persistent face
to flinch at what your hand is becoming.

---

## 7 · Sequencing — three coupled clusters, then content

1. **Trust pass — ✅ COMPLETE 2026-07-02:** ~~R3~~ (shipped) · ~~R1~~ (declined — owner keeps
   player undo) · ~~R2~~ (shipped) · ~~R21~~ (shipped) · ~~R5~~ (shipped) · ~~R4~~ (shipped —
   tolls priced in the real currency). The honesty layer is fully in.
2. **Seal economy — ✅ COMPLETE 2026-07-02:** ~~R10~~ + ~~C1~~ shipped together, one
   SEAL_LIMIT retune (360→440, floor had grown 183→223 under the old number), one
   clean-run re-audit (green, 49% headroom over floor). Staying, working, gambling and
   learning all cost belonging now — the clock charges *time*, not just steps.
3. **Combat feel — ✅ COMPLETE 2026-07-02 (~~R12~~ → ~~R13~~ → ~~R14~~ → ~~R15~~ → ~~R16~~ →
   ~~C2~~):** all six rungs shipped in one day — the telegraph gave Guard its job, the
   crit-smear its second, the threat-read closed the sensory gap, the packs woke the aim UI +
   mixed-marking thesis, the parley opened the middle path, and morale gave hell's own
   creatures self-preservation (regard inside combat). **Chain-closing pass run:** combat-sim
   numbers match the R14 calibration within noise (kappa 64/65, gorger 56/57, golem 21/22 —
   the rungs stand); clean-run audit unchanged (floor 223, 49% headroom — the chain never
   touched the clock). ~~C2 ships standalone on turned limbs; if R17's `$blood` lands later,
   fold it into the morale DC~~ — **paid 2026-07-02: R17 shipped and the DC fold with it.**
4. Everything else is independently shippable; R22's desc migration is a hard prerequisite
   for R23/R24's surfaces (and fixes a live mangle). R9 (WIS) queues behind the backlog's
   CHA arc by design.

## 8 · Below the verification cap (merged, ranked 29–37 — **pointers unverified**)

The games row is described-but-unplayable (no gamble pays in anything but coins) · coin
supply is unbounded with nothing recurring to spend surplus on (partially answered by
R24/C3) · nine layers, one shop — hell's own market sells nothing · the social web is one
thread wide (across 46 NPCs, exactly one references another) · gates render as generic
rooms on the map screen · five of six magic items are lottery-only (~0.1%/fight), no
placed legendary loot beyond golembreaker · no secret rooms (passive WIS exists; the
fog-of-war map is ready for content that doesn't exist) · in-life stat movement is
mono-channel (only INT can move mid-life; the $statMods channel was built for all six) ·
no respec ever, and death doesn't help — the build outlives every life.

## 9 · Also noted

- `docs/GAME-SPEC.md` is badly stale — it still describes a 3-passage prototype with
  "visible vs hidden meter" as an open question. Either mark it historical or retire it
  to an ARCHIVE header; a newcomer reading docs/ in order gets a false map.
- Two straight bugs worth fixing regardless of the plan: the coinrot routing (R21) and
  the phantom duplicate-drop message (inside R24).

---

*Method note: review ran as a 39-agent workflow — 9 subsystem reviewers → merge/rank →
one adversarial verifier per finding (each instructed to refute; 0 of 28 refuted, most
adjusted with corrections folded in above) → a completeness critic (C1–C4). All 28 kept
findings carry source-verified pointers as of commit 795be1d.*
