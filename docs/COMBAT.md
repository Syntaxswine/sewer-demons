# Sewer Demons — Combat (D&D-style)

The combat engine is **D&D 5e-flavoured**: six ability scores, a d20 attack roll
against Armor Class, damage dice plus modifiers. It lives in the `StoryInit`
`<<run>>` block of `src/sewer-demons.twee` as `setup.*` functions, and is mirrored
for offline balance testing by `tools/combat-sim.mjs`. **Keep the two in sync** — if
you change a formula here or in the engine, update the other and re-run the sim.
(Note: the sim models a **single-target** exchange — the per-hit math below is exact, but
it does not simulate multi-enemy packs, specials, guard, or items. Treat it as a per-hit
balance probe, not a full-fight simulator.)

## The combat screen — six actions, multiple enemies (owner 2026-06-05)

Combat is a **screen**, not a wall of prose: the opponent **name(s)** + a **portrait** + the
**player and enemy HP bars side by side** (`Combat` passage; CSS in `Story Stylesheet`,
`.combat-screen`/`.cbt`/`.portrait`/`.hpbar`/`.combat-actions`). The **portrait** is a drop-in
frame — it shows `img/enemy/<id>.png` if the file exists, else a class-glyph placeholder
(`setup.CLASS_GLYPH`; `e.img` defaults to the enemy id). The player's portrait shows its own
glyph, which becomes the class glyph once you've fully turned (`setup.becameClass()`).

**Multiple enemies.** A fight is an **array** `$enemies[]` (was a single `$enemy`).
`setup.startFight(spec, ret)` takes either a string id (one foe) or an **array** of ids (a
pack) — `setup.startFight(["shitgolem","shitgolem"], ret)`. `$target` is the aimed enemy
(click a card's "» aim here"); `setup.aliveEnemies()`/`firstAliveIndex()` track the living.
**Every living enemy ripostes each round** (so a pack hits you several times per turn).
Victory when all are down → `CombatVictory`, which reads `$combatSpoils` (coins + XP
**summed across the whole pack**, accrued in `setup.hurtEnemy` as each falls).

**The six buttons** (a `$combatMenu` of `main`/`special`/`items` drives the row):
- **Attack** — `setup.playerStrike($target)`: one focused hit on the aimed enemy (the existing
  d20 + STR + prof − arm-corruption vs AC, × damage-type multiplier).
- **Guard** — brace: deal nothing, but **every incoming hit this round is halved**
  (`setup.enemyTurn(true)`).
- **Special** — opens a menu of **unique sweep attacks** (`setup.SPECIALS`): each hits **every
  living enemy** for weapon damage × a `mult` **slightly below 1** (the sweep tax). Usable a
  number of times per fight equal to your **level** (`setup.specialMax()` = `$level`;
  `$specialUses` counts; `setup.specialsLeft()`). The base **Sweeping blow** is always
  available; **form specials** (Clawing flurry/Goring charge/Filth lash) appear once you've
  grown a limb of that class (`setup.hasFormLimb` — transformation feeds your moveset).
- **Items** — opens a menu of **consumables** in your pack (`setup.usableItems()`, items of
  `kind:"consumable"`); using one (`setup.useItem`) applies its effect (e.g. `salve` heals 8)
  and **costs your turn** (the enemies still riposte). Consumed on use.
- **Surrender** — deliberately take the loss → `CombatLost` (the transformation / work-curse
  content; losing is a content branch, so this is a real choice, not just a fail state).
- **Run** — the flee check (`setup.fleeRoll()`: d20 + DEX − leg-corruption ≥ 10) → `$combatOrigin`
  on success; on failure the pack gets a free round.

Turn order each action: **player acts → if not already victory, `setup.enemyTurn()` →** route by
`setup.combatOutcome()` (`victory`/`loss`/continue). Displayed combat prose is built in `setup.*`
functions held in the **`<<script>>` block** (raw JS) so the operator-word desugaring can't mangle
it; the `Combat` passage itself is wrapped in `<<nobr>>` so the logic lines don't print blank gaps.
Loop-variable closures in the card/menu loops use `<<capture>>` (an un-captured aim link was a real
bug — the target wouldn't switch).

## Signature moves — telegraph, then payoff (review R12, 2026-07-02)

Every species has **one signature move** (`move:` on the registry entry → a `setup.ENEMY_MOVES`
id; prose + effects live there, in the script block). Cadence: every `every` rounds (default 3;
the Glut winds every 2) the creature **spends its attack winding up** — the telegraph line prints
in the log and the enemy card shows *"— gathering itself —"* (`.cbt-wind`). The payoff
**auto-lands next round** (no attack roll) unless answered. The answers give the buttons jobs:

- **Guard blunts it** — each move says how: a charge is quartered ("you take it on the brace"),
  a grab/engulf is shrugged off entirely, a gulp is halved and heals nothing.
- **A stun cancels it** — a stunned winder loses the gathered move ("the gathered violence goes
  out of it"), so the player's stun special finally has a premium target.
- **Run leaves before it lands** — the wind-up round is also your flee window.

The moves come from what each thing IS, and several take agency **on the turn** (the game's
thesis): `squeal` (rat/rat-man — calls another rat from the dark; pack caps at 4; Guard can't
stop a sound, stun/kill the caller can) · `engulf` (shit-golem/Glut — **you lose your next
action**: the menu collapses to *Wrench yourself free* / Surrender, `$engulfed`) · `grapple` /
`coil` / `pullunder` (drowned/crawler/kappa — **held**: Run reads *"held fast"* for one round,
`$held`, released as the next round turns) · `gulp` (gorger — bites and **heals itself the
wound's worth**) · `gore` / `manyhands` (pig-demon/grafted — the Guard test: double dice
unguarded, quartered braced) · `drag` (sty-hand — a landed drag **claims you for the shift**:
`$workOwed`, station set if unclaimed, plus held; the recruiter recruits).

`combatActor` carries the state (`move`/`every`/`rounds`/`winding`); `startFight` resets
`$held`/`$engulfed`. **`tools/combat-sim.mjs` does NOT model moves** (disclaimed in-file) —
read its win-rates as the attrition baseline.

**The crit-smear (review R13, 2026-07-02).** An enemy **crit** also smears `setup.CRIT_SMEAR`
(= 2) of its class into one random segment — winning is no longer sterile; every scrape can
leave a little of the thing in you (~5%/attack, bounded, avoidable). **Guard halving a crit
halves the smear** — Guard's second job. The log names the price in the body's real currency
("2 into your R-arm").

## The threat-read — smell the thing before you commit (review R14, 2026-07-02)

The canon "consider" check, through the game's own channel: you could smell rooms
(room-scent) and the world smelled you (regard), but the thing squaring up in front of you
was the one thing your nose skipped. Now every fight-offer carries a one-line scent read.

- **`setup.threatRead(spec)`** (script block) → rung 0–3. Enemy side: pack
  `statLevel + 2×hd` (strongest at full weight, the rest at half), shifted by the
  creature's **nature vs the tool in your hand** — `weakTo`/`resists` ∓2,
  `weakTypes`/`resistTypes` ∓2, `boss` +2. Player side: `3×level + weapon-die max`
  (fists = 1d2; the material `+N` inside a die class is below the read's resolution).
  Rung boundaries on the differential: `≥0` / `≥−6` / `≥−8` / below.
- **Calibrated against `tools/combat-sim.mjs`** (2026-07-02 run) — holds within one rung
  across the L1-fists, L1-bronze-sword and power-curve tables: <40% win reads rung 2
  ("more than you"), <~5% reads rung 3 (the verdict). The affinity shift is visible: the
  same shit-golem reads rung 2 with a sword, rung 0 with the golembreaker. The Glut reads
  conservative on purpose — a boss should smell like *leave*. **If you retune enemies or
  weapon dice, re-run the sim and re-check the rung boundaries.**
- **`<<scentof spec>>`** (widget) renders the rung's prose (`setup.THREAT_SCENT`,
  sing/plural) in the room-scent band voice; rung 3 gets the rust-red `.rs-dread`. Placed
  above the fight-offering links at every gate-room site + the 3 encounter fight-arms
  (`<<scentof _den>>` takes the denizen pack's array). Convention for new fights: **if a
  passage offers a `startFight` link the player can decline, put a `<<scentof>>` above
  it**; a forced fight (no choice) gets no read.
- It is a **smell, not a stat sheet**: coarse by design — potency and nature only. It
  cannot see your armor, consumables, spells, or luck.

## Packs — the multi-enemy content (review R15, 2026-07-02)

The array machinery (`startFight(["a","b"], ...)`, `$target` aim UI, sweep/cleave specials,
mixed-class loss marking) predates R15; R15 gave it **content**. Five set-pieces are packs
now — RatKing `["ratman","rat","rat"]`, **TheSty `["pigdemon","grafted"]` (cross-class)**,
ThePits `["gorger","grafted"]`, TheDeepWell `["glut","shitgolem"]`, **TheSumpGalleries
`["ratman","drowned"]` (cross-class)** — and `denizenPack` sends mixed presses on the hinge
floors (d≤3 half the pairs are ratman+rat; d4 35% drowned+ratman; d7 25% pigdemon+grafted).

**Mixed loss marking:** `loseFight` cycles the landed marks through the pack's classes and
returns `clsSet` (the distinct classes that actually landed — a 1-limb roll from a mixed
pack honestly reads single). CombatLost branches on `clsSet.length > 1` for the mixed
prose (the mutagenic thesis: separate ruins pooling into one shared appetite). Conventions
for new packs: give the second body a prose beat in the room, point the `<<scentof>>` at
the whole array (the read weighs the strongest at full, the rest at half), and let the
cleared-lander acknowledge every corpse.

## Parley — Yield, the middle path (review R16, 2026-07-02)

Surrender is everything at once (robbed AND corrupted AND marched). **Yield** is the canon
bribe/yield middle path, beside Surrender in the main menu — in a world whose loss screen
already says the deep wants labour, not death.

- **Gated on the voice:** `<<if setup.canSpeak()>>`, else the act-spent grey *"Yield — your
  voice will not come"*. This is the `nospeak` curse's (silver_muzzle's) **first mechanical
  consumer** — the capability flag finally bites in combat.
- **`parleys`** (registry flag → combatActor): the minded kinds accept — rat-man (councils),
  kappa (courtesies), gorger + pig-demon (they already run tolls at the forks), sty-hand
  (recruiting IS its errand). Rats, golems, crawler, drowned, grafted, and the Glut do not.
  `setup.packListens()` = any alive enemy parleys.
- **The submenu telegraphs first** ("Something out there is listening" / "Nothing in front
  of you has ears for an offer") — offering at a deaf pack is an informed gamble that wastes
  the round (log line + the pack's riposte), never a gotcha.
- **Toss the purse:** `setup.yieldPurse()` — the SAME robbery formula a loss uses
  (`1 + random(ceil(coins/2))`, capped at what you carry), but voluntary: they take what
  they take and you walk out **unmauled** to `$combatOrigin`.
- **Offer the shift:** `pressGangTo($combatOrigin)` (a work-cursed player is instead reeled
  to their own post, `$workOwed` — mirrors the encounter's go-quietly branch). Marched,
  body untouched; the station room charges the shift's own price.
- Both land on **`CombatYielded`** (a lander like CombatVictory; in encounterEligible's
  exclusion list so walking out can't chain straight into an encounter).

The price ladder reads: **win** (spoils, and R13's smear risk) > **yield coin** (poorer,
whole) > **yield labour** (a shift's corruption, unmauled) > **lose/surrender** (robbed +
marked + marched). Agency-loss note: the muzzle removing Yield means a cursed player
literally cannot buy their way out — the voice was the price.

## Morale — the enemy side gets self-preservation (review C2, 2026-07-02)

`setup.moraleCheck(e)` runs at the top of each enemy's action in `enemyTurn`. Triggers —
**badly hurt** (wounded AND ≤⅓ max hp; a pristine 1-hp rat is not "badly hurt") or **a
packmate has fallen**. One weigh per fight per actor (`moraleChecked` latch):

```
d20 + statLevel  vs  DC = MORALE_DC_BASE(8) + 2×(your turned limbs) + 2×(pack deaths)
                          + 2 if bloodOf(its class) ≥ BLOOD_FELT   (R17 fold, 2026-07-02)
```

- A **held** check is silent — courage makes no noise. A **broken** enemy flees: hp 0 +
  `fled`, the card reads *"— fled —"*, and it pays **no XP, no coins, no drop** (spoils
  accrue only in `playerStrike` when a body falls; `dropSourceEnemy` skips the fled; an
  all-fled victory has its own nothing-to-strip beat). The cleanest kills are the ones
  that never finish — an organic damper on violence-as-optimal.
- **Immune:** bosses (`boss`) and the sty-hand press-gang (paid to bring bodies).
- Reference rates (verified in-browser, 500-draw samples): a hurt rat vs a clean player
  breaks ~20%; vs 4 turned limbs ~60%. A hurt pig-demon vs clean: never; vs 4 limbs + 2
  pack deaths: ~45%. **The horror read: the more turned you are, the more hell's own
  creatures refuse to finish the argument — regard, inside combat.**
- **Engine rule this bought:** the enemy phase can now END a fight, so every handler that
  calls `enemyTurn` (Guard, Items, Wrench, failed Run, deaf-Yield) must run the full
  victory/loss/continue tri-check — never a bare `$hp` check. (R17's `$blood` is now
  folded into the DC — see the blood ledger below.)

## The blood ledger — victory leaves residue (review R17, 2026-07-02)

Losing writes itself into your body; winning used to write **nothing** — the murderhobo
stance was the cheapest and cleanest path, the exact inversion of the horror canon.
Now every body that **falls** is tallied by mutagen class in `$blood {rat, pig, filth}`
(`setup.tallyBlood()`, called once at the top of CombatVictory — set-piece and encounter
kills alike flow through that one funnel). A **fled** enemy is not tallied: a broken
enemy takes nothing of you with it, *in both directions*.

The cost is **regard/attention, never meter points** — a clean run structurally requires
fighting, so blood must not touch corruption. Two thresholds (per class, per life):

| knob | value | what the world does |
|---|---|---|
| `BLOOD_FELT` | 3 kills of a class | Its kin **smell it**: the kinhelp kindness curdles (beat fires, no coin/heal — shown, not silently zeroed); the backtowork kin-claim free pass closes (the **withered welcome** — the gap begins to open, then the wind turns); morale DC **+2** vs that class (its kind's blood on you argues for running). |
| `BLOOD_FEARED` | 5 kills of a class | The floor's own denizens **stop offering labour**: backtowork becomes **the reckoning** (go-quietly withdrawn — a known killer of their kind is not pressed, he is *handled*); the pigpress/vatpress poaching offers are withdrawn (pig / filth blood respectively); the refuse links relabel (*"Meet them — it was always going to come to this"*). |

- **The binding-reel stays reachable at ANY blood** (`$workCursed`): a ledger has no
  nose — signed property is collected, not killed. Verified driven: the reckoning's
  *"Stand on the binding"* link reels an indentured player to their own post, shift owed.
- The morale fold means a kin-slayer sees **more flights = less XP/coin per fight** —
  the more you kill, the less killing pays. Attention compounding into economics.
- Rates verified in-browser (800-draw samples): hurt rat vs clean player ~20%; vs 3 rat
  kills ~30% (theory 20/30). Baselines below threshold all intact (kin-claim at 0, poach
  offers at 4, kindness at 2).
- Calibration: the mandatory spine forces only a handful of kills spread across classes —
  a non-murderhobo stays under FELT per class; the RatKing set-piece massacre (3 rat
  bodies in one fight) reaches FELT by itself, deliberately: slaughter the rat court and
  the rats know. Refused press-gangs are where FEARED lives.
- Not in the sim (`tools/combat-sim.mjs` header notes it): blood never touches
  to-hit/damage, so the win% tables stand.

## The short-weight men — the third ledger (owner 2026-07-03)

The deep keeps **three** books on you. Regard reads what you **are** (the body you're
wearing); the blood ledger reads what you **did** (the kills). The short-weights read what
you **chose never to be** — the ability you dumped at creation, the door left unlocked that
you walk past in every life. "The denizens keep score."

A **short-weight man** is a grey opportunist that has weighed you and found you wanting in
one pan, and comes to collect the difference. On the `shortweight` encounter it reads
`setup.dumpStat()` (your lowest score; ties break by `SHORTWEIGHT_PRIORITY` — the cleverest
cruelty first, so WIS wins) and runs `setup.statCheck(dumpStat, SHORTWEIGHT_DC=10)` against
that pan — **never a fair one**. Fail-forward always: coin / corruption / a shove / an
ambush — never a wall.

Two things give it teeth:
- **The fresh −2 rides the check** (statCheck folds `freshCheckPenalty()`), so the deep
  hunts the **unhardened hardest** — a fresh WIS-2 body can roll a 14 and still fail DC-10.
- **The encounter weight scales with `statSpread()`** (max−min of live `$scores`):
  `min(8, max(0, spread − 3))`. A flat *seven-all-round* build (spread 0) is grey and
  **never hunted**; a min-maxer paints a target. This finally makes creation's spread a real
  **risk curve** — the generalist is safe and mediocre, the spike is powerful and preyed on.

Six faces, dispatched by which stat is lowest (prose in `setup.SHORTWEIGHT`, script block):

| dump | face | gambit → fail-cost | concede (certain, smaller) |
|---|---|---|---|
| **STR** | a leaner | throw it off → robbed (or a −1 shove if you've no coin) | pay it 2 to shove off |
| **DEX** | a flicker | catch its wrist → coin lifted (or an ear-cuff if broke) | let it have 1 loose coin |
| **CON** | a breather | weather it → +5 filth to a segment | back off holding your breath → +2 |
| **INT** | a sharp | play → fleeced (deeper than the others) | **walk — free** (the wise decline a con) |
| **CHA** | a shunner | face it down → +4 of the **floor's** class (self-debasement — you belong more) | slip past small → +2 |
| **WIS** | a lurker | *passive* — see below | — |

**WIS is the outlier — an ambush (this closes review R9's ambush).** You don't get a
sidle-up; you get a heap of safe-seeming sacking and a passive `statCheck('wis')`:
- **Sense passed** → you feel the wrongness a step short: *back away* (clean) or *strike
  first* (a normal fight, **you** have initiative — reward the wise).
- **Sense failed** → the fight starts with the lurker having **already hit you**. The
  `setup.ambushFight(spec, ret)` primitive runs one free `enemyTurn` and hands its log to
  the Combat screen, so the enemy's opening blow (and any crit-smear) has landed before your
  first action. Verified: a fresh WIS-dump player took 5–7 + a crit-smear before acting.
  `ambushFight` is reusable for any future ambush.

Resolution: the five social faces route through `ShortWeightDone` (no `depthOf`, excluded
from the encounter re-roll so it can't chain); WIS routes into `Combat`. The `shortweight`
enemy (statLevel 4, hd 2) is a modest but real threat — sim 97–100% vs an equipped L1, the
free opening turn is the sting, not a kill.

Ride-alongs this delivered: **R9's ambush** (via a creature, not a bare refuse-roll);
**CHA finally costs something** (the char-creation screen literally said it did "little down
here yet"); the WIS char-creation promise ("smells a wrong thing coming") is now true; and
`statCheck` got **R7's fingerprint** — it stashes `setup.lastCheck {roll, mod, pen, dc,
margin, fresh, passed}` and `setup.checkMargin()` gives a narration word, while still
returning a plain boolean (coercion never calls `.valueOf`, so old callers are untouched).
Tuning knobs: `SHORTWEIGHT_DC`, `SHORTWEIGHT_PRIORITY`, the spread thresholds in the
encounter weight, and the per-face costs in `shortweightTry`/`shortweightCede`.

## The drinking contest — a CON check with an inverted payoff (owner 2026-07-20)

A second non-combat `statCheck` con (the short-weights read your *dump* stat; this reads **CON**
straight). At `HellTavern` a still-reeking challenger bets the rail on a drinking bout;
`setup.drinkingContest()` runs `statCheck("con", CONTEST_DC=8)` — **easy** — but the table is
**inverted**, which is the whole cruelty:

| outcome | coin | brew dose | filth (gut) | why |
|---|---|---|---|---|
| **WIN** | +7–9 (`gainCoins`) | +~12 (`drinkBrew` k=2.5) | +~10–15 | you drank the **whole** contest to win it |
| **LOSE** | 0 | +~5 (k=1) | +~4–6 | a smaller forfeit — you had the one measure |

**The better you hold your drink, the harder you are hooked** — winning takes the big dose and makes
`brew` your dominant vice fastest (see `docs/TRANSFORMATION.md` → *The vices*). The **coin is bait**,
not reward. No ante — the deep doesn't want your coin, it wants YOU; only flesh is staked.

**EV, verified (`scratchpad/contest-ev.md`):** with the fresh −2 riding early, `P(win)` ≈ 45 %
(dumped-CON everyman) → 75 % (CON-build, inured). `E[filth]/contest` ≈ 8.9 (everyman) → 9.9
(CON-build) — *higher* the better your CON, because you win (and drink) more. `E[coin]/contest` ≈
4.4–5.6, and coin-per-corruption is **worse than honest bar-work** ("drink with the patrons": ~15
coin / ~11.5 corr) — so the contest is a **sucker's game, not a coin faucet**. Anti-farm: each win
piles ~12 `filth` on the gut (→ turns, then overflow-spills), and `setup.contestOffered()` closes
the bout once you're mostly-filth (`classLimbs("filth") ≥ 4`) — *"nobody bets against the barrel you
have become."* Farming self-terminates in a wrecked body for ~25–40 coin. Tuning: `CONTEST_DC`,
`CONTEST_PRIZE`, `CONTEST_WIN_POTENCY`/`CONTEST_LOSE_POTENCY`, `contestOffered`.

## Ability scores

Six scores, the canonical set: **STR DEX CON INT WIS CHA**. Standard 5e modifier:

```
mod(score) = floor((score - 10) / 2)
```

So 7 → −2, 3 → −4, 9 → −1, 10 → 0, 12 → +1. The sewer is a diminished place; even
the player starts below the 10 baseline. What matters is the *relative* spread.

### Flat stats per level (current design — boss)

Early-stage simplification: **every ability equals one flat number set by level.**
The player is **all 7s at level 1**. Enemies carry a single `statLevel` that sets all
six of their scores (boss's examples: **rat men all 3s, sewage demons all 9s**).

- Player: `setup.LEVEL_BASE = { 1: 7 }`, `setup.baseScore(lvl)` (default growth
  `7 + (lvl-1)*2` for unlisted levels). Levels 2+ are **earned in play** via XP — see
  **Leveling & XP** below. Each level adds +2 to every ability (i.e. +1 to every
  modifier per two levels), so the curve is generous on purpose.
- Enemy: `setup.enemies[id].statLevel`. `setup.startFight` derives everything from it.

> **statLevel steps in twos.** The 5e modifier floors, so `statLevel` 6 and 7 yield the
> *same* mod (−2); 8/9 → −1; 10/11 → 0. To make a creature meaningfully harder than
> another, jump the mod (e.g. 6 → 8), or change `hd` (more HP) / `weaponDie` (more
> damage). Always confirm with `tools/combat-sim.mjs` rather than trusting the number.

When per-ability differentiation is wanted later, give actors a real `{str,dex,...}`
block instead of a flat `statLevel`; the math below already reads per-ability.

## Derived numbers

| Quantity | Formula |
|----------|---------|
| **Max HP** | player: `(level+3) × (5 + mod(CON)) + itemMods().hp` → L1 all-7s clean = `4×3 = 12`. enemy: `hd × (5 + mod(CON))`, min 1, where `hd` = the creature's hit dice / size. |
| **Armor Class** | `10 + mod(DEX) + armor.ac + itemMods().ac`. Enemy AC = `10 + mod(statLevel)`. |
| **Attack roll** | `d20 + mod(STR) + proficiency` vs target AC. **Player** gets `setup.PLAYER_PROF` (=2, the protagonist's edge; scales with level later). Enemies get no proficiency. |
| **Damage** | `round(weaponDie + mod(STR)) × typeMult + itemDamageBonus(enemy)`, min 1. Player unarmed = `1d2`; weapons carry a `die` ("1d6"/"1d8"). Enemies use their `weaponDie` + `mod(statLevel)`. |

> **Equipment & item modifiers (2026-06-06).** Stat/HP/AC/encounter bonuses from equipped gear
> (magic blessings +, curses −) fold in through `setup.itemMods()` — the same pipeline as
> `MARK_MODS`/`FORM_MODS`, so all the formulas above already include them. The **per-creature
> magic damage** bonus `setup.itemDamageBonus(enemy)` is added after the type multiplier in
> `playerStrike`/`doSpecial` (scope `all` < a specific class/enemy-id, which is "much stronger").
> Curses also drive **capability flags** the six-button row reads: `canAttack` (disables
> Attack+Special), `canRun` (disables Run), `autoSurrender` (drops the fight to `CombatLost` on
> entry).
>
> **Weapon TYPES (2026-06-07, owner).** A weapon has two axes: **TIER** (rusty→steel→magic+cursed,
> a flat damage bonus — the "level") × **TYPE** (dagger/hook/spear/sword/axe/hammer — the damage
> RANGE, the blunt/edged class, and the unlocked special). `die`/`dtype` **derive** from type×tier
> (`setup.weaponDie`/`weaponDtype`/`weaponKind`; `TYPE_DIE` = dagger 1d4 · hook 1d6 · spear 1d6 ·
> sword 1d8 · axe 1d10 · hammer 1d12; `TIER_DMG_BONUS` rusty +0 … steel +4; hammer = blunt). An item
> may override `die`/`dtype` explicitly. **Enemy affinities live on the enemy sheet**
> (`weakTypes`/`resistTypes`), merged with the broad blunt/edged `weakTo`/`resists` by `setup.typeMult`
> (now `typeMult(dtype, enemy, wkind)`): net weak ×1.5, net resist ×0.5. **Type specials** (in
> `setup.SPECIALS`, gated by `wreq` = weapon type, N uses/fight = level): sword/spear → **Sweeping
> blow** (all foes); axe → **Cleave** (two); hammer → **Crushing blow** + **stun** (foe skips its
> next turn — `enemyTurn` honours `enemy.stunned`); hook → **Snag** (stun); dagger → **Flurry** (3
> cuts on one foe). Form-limb specials (claw/gore/lash) still gate by grown class. **Lint with
> `tools/equip-check.mjs`; balance with the TYPE MATRIX in `tools/combat-sim.mjs`** (which flags that
> a hammer's big die can out-damage an affinity — a tuning lever). Full catalog spec + the curse/magic catalog: `docs/DIRECTION-EQUIPMENT.md`.
| **Crit / fumble** | natural 20 always hits and **doubles the weapon dice**; natural 1 always misses. |
| **Flee** | `d20 + mod(DEX) − corruptionPenalty ≥ 10`; failure = a free enemy attack. |

## Corruption in combat

Corruption drags you in combat — **−1 per full 25** (0 → −4) — but as of the per-segment
system it is now **limb-specific** (see `docs/TRANSFORMATION.md`):
- **Attack roll** ← your **arm** corruption: `max(setup.corruptionPenalty(), setup.limbPenalty("arm"))`.
- **Flee check** ← your **leg** corruption: `max(setup.corruptionPenalty(), setup.limbPenalty("leg"))`.

`setup.corruptionPenalty()` reads the general mirror (avg of segments); `setup.limbPenalty(which)`
reads the worse of the paired limbs. The `max()` means attributed limb-corruption bites harder
than the general meter — a rotted swing-arm fails you even when the rest of you is clean. This is
the owner's "corrupt hands pull bad levers," inside the d20 frame.

**Transformed limbs also shift the sheet:** each fully-turned segment applies `setup.FORM_MODS`
in `playerScores`, beside the cross-life marks (`rat → +DEX`, `pig → +STR +CON`, `filth → +CON −CHA`).
So the body you grow fights like what it became — a build with a built-in accuracy cost while a
turning arm is still corrupt. Full detail and the authoring mapping: `docs/TRANSFORMATION.md`.

## Losing a fight — no death (owner, 2026-06-04)

`$hp ≤ 0` in combat **no longer kills you** — and neither does **Surrender** (both route to
`CombatLost` → `setup.loseFight()`). The cost of going down (owner, 2026-06-05):
- **They rob you**: you lose **some of your coins** if you have any — `min(coins, 1 + rand(0,
  ceil(coins/2)))`, i.e. up to ~half, never all.
- **They work their nature in**: **up to 5 corruption on ONE OR MORE limbs** (1–3 random
  segments, each `+1..5`), of the **class of what beat you** (every `setup.enemies` entry has a
  `class`: rat-things → `rat`, aggregate/grown/drowned/rendered → `filth`, pig-demons → `pig`;
  a mixed pack marks you mixed).
- You **come to at half vigor**.

This is deliberately **lighter than a heavy maul** (it was previously `statLevel`-scaled, up to
+10/segment) — losing *costs* you (coins + a little of yourself) but doesn't instantly turn you,
which fits the "losing is a content branch, be generous not punishing" run-shape. Enough losses
(or one at the brink) still complete a full transformation and tip you into `EndingBecome` (you
become what beat you, banking its `kin_*` mark). `loseFight()` returns `{cls, segs, marks,
coinsLost, name}` for the `CombatLost` prose.

**Combat return targets:** `startFight(id, ret)` stores `$combatReturn = ret` (where **victory**
goes — often a "cleared" lander) and `$combatOrigin = ` the room you fought in (where **flee**
and **loss** return you). Victory → `$combatReturn`; flee/loss → `$combatOrigin`. (Routing flee
to the origin also fixed a latent bug where fleeing a den landed on its "you defeated it" lander.)

**If you're work-cursed (DIRECTION §C), a loss stacks both** (owner): the `loseFight()` maul still
applies, AND `CombatLost` sets `$workOwed` and routes you to your **workstation** (not
`$combatOrigin`) — the binding reels you back to your post, where one shift (more corruption of the
station's class) is owed before the exits unlock. So a cursed loss corrupts you twice: the maul, and
the shift. An *uncursed* loss is unchanged (plain maul → `$combatOrigin`), which is what keeps the
sneak-out / "stay yourself" path meaningful. See `HANDOFF.md §5` (Work-curse row).

**Bespoke CAPTURE scenes (owner 2026-07-03).** Most losses end with the deep marching you to the
nearest **work shift** — but some dens don't run shifts, they *keep* their catches, and hauling a
rat-run loss to a pig cage read wrong. `setup.CAPTURE_SCENE`, keyed by `$combatOrigin`, lets a
set-piece override the generic press-gang **tail** of `CombatLost` with its own capture beat +
destination (the shared top — maul / class-taint / coins — still runs; the work-curse binding still
takes priority above it). Two entries so far, the rat den: lose in **TheRatRun** and the rats drag
you *deeper* (→ `TheRatKing`, into worse danger at half vigor); lose at **TheRatKing** and the den
handles you, marks you, and spills you *back out* (→ `TheRatRun`) — *"a postponement, not a
pardon."* Extensible: add an entry per den that takes rather than employs (the kappa drowning, the
gorger's gullet, etc.).

## Damage types (owner, 2026-06-04)

Weapons carry a `dtype` (`blunt` / `edged`); **unarmed fists count as blunt**. Enemies can carry
`weakTo` and/or `resists` a type. `setup.typeMult(weaponType, enemy)` → **×1.5** on a weakness,
**×0.5** on a resistance, ×1 otherwise; the Combat passage multiplies the player's damage by it
(min 1) and telegraphs it ("the right tool — it *scatters*" / "your blade just parts its muck —
you want something *blunt*").

- Weapons: `hook`/`knife` = **edged**; `pipe` (new, 1d6) and fists = **blunt**.
- The **shit-golem** (sewage demon) is `weakTo: "blunt", resists: "edged"` — filth parts around a
  blade and closes again, but scatters under a club. Sim (L1+leathers vs golem): **pipe 1d6 ≈ 39%**
  beats **knife 1d8 ≈ 6%** — a worse die wins because it's the right type. A `length of pipe` is
  findable at `TheScreeningHall` (L2), right where the first golem stands up, to teach this in situ.
- Adding a weak/resistant enemy: set `weakTo`/`resists` on the `setup.enemies` entry (carried to
  the actor in `startFight`); mirror it in `tools/combat-sim.mjs`. No other enemy has a type today.

## Leveling & XP

Defeating an enemy grants **experience**; enough of it raises your **level**, which
lifts every ability score on the flat-per-level curve above. XP and level are
**in-life** — they reset each run alongside the corruption meter. The cross-life
track is *marks* (next section); the deep doesn't let you keep your *skill*, only its
*scars*.

| Thing | Formula / value |
|-------|-----------------|
| **XP per kill** | `setup.enemyXP(e) = statLevel × hd × 4`. Difficulty (statLevel) × size (hd). |
| **XP to reach level L** | `setup.xpToReach(L) = 60·(L−1)·L` (cumulative). L2=120, L3=360, L4=720, L5=1200, L6=1800… increments grow by 120 each tier, so each level is a longer climb. |
| **Award + level-up** | `setup.gainXP(amount)` adds XP, applies any level-ups (loops for multi-level payouts), rebuilds the sheet, and adds the **newly-gained max HP** to current vigor (you gain the new hit points — *not* a full heal). Returns levels gained so `CombatVictory` can narrate it. |
| **Where it fires** | `CombatVictory` calls `gainXP($enemy.xp)` (XP is stamped onto the enemy actor in `startFight`). |

**XP yield by enemy** (and how many of each to go L1→L2, needs 120):

| Creature | statLevel | hd | xp/kill | kills → L2 |
|----------|:---:|:---:|:---:|:---:|
| demon rat | 3 | 1 | 12 | 10 |
| rat-man | 3 | 2 | **24** | **5** |
| drain-crawler | 5 | 2 | 40 | 3 |
| the drowned | 6 | 3 | 72 | 2 |
| the grafted | 8 | 3 | 96 | 2 |
| a gorger | 9 | 4 | 144 | 1 |
| shit-golem | 9 | 4 | 144 | 1 |
| pig-demon | 10 | 4 | 160 | 1 |

The design target (boss): **~5 of the easiest opponents = the first level** — five
rat-men (5×24 = 120) is exactly level 2. Because enemy difficulty is flat and the
player's curve is steep, **combat eases as you climb** (`tools/combat-sim.mjs` POWER
CURVE: a fresh L1 wins ~29% vs a shit-golem, ~81% at L2, ~99% at L3; the pig-demon
goes 7→45→90→100% over L1–L4). That is intentional — the *late-game* threat is
corruption / depth / the belonging-clock / what you become, not raw fights. If combat
ever needs to stay tense deep down, flatten the per-level growth or scale enemy
`statLevel`/`hd` with depth rather than nerfing XP.

> **Open fork (owner):** level/XP currently reset each life. If a *deep* run should
> feel like it banked something mechanical run-over-run, that belongs in the marks
> system (e.g. a mark that grants a starting-level bump), not in carrying `$level`
> across `Engine.restart` — keep the "meter resets, marks carry" rule clean.

## Cross-life marks = ability modifiers (the curses are a build)

The metaprogression ([[project_sewer_demons]] cross-life marks) feeds straight into
the sheet. Each mark you carry shifts ability scores — **not always for the worse.**
`setup.MARK_MODS` (applied once per mark present, floored at 1):

| Mark | Δ | The fiction |
|------|---|-------------|
| `damned` | STR +1, CON +1, WIS −1 | the deep hardens the body, dulls the soul |
| `faceless` | DEX +1, CHA −2 | no face: unreadable, and uncharming |
| `rendered` | CON +2, DEX −1 | flesh rendered to ward: tough, but stiff |
| `indebted` | INT +1, WIS +1, CHA −1 | the Whisperer's knowledge, and its lien |
| `sovereign` | STR +1, CHA +2 | you wore a crown down here, once |
| `marked_escape` | WIS +1 | you came out changed, and warier |
| `survivor` | WIS +1 | you came out clean, and learned the place |

Effect proven by sim: a fresh L1 character beats a shit-golem (all-9s) ~29% of the
time; one that banked `rendered` + `damned` in past lives wins ~77% (CON 7→10 lifts
HP 12→20). **A wall a first life can't pass becomes passable once the deep has left
its marks** — combat joins the "marks open new paths" spine. CHA is currently
combat-inert; it's reserved for demon-bargain checks later (a natural future hook).

## The bestiary, in stat-level terms

`statLevel` is the difficulty dial. The ladder a level-1 (all-7s) player faces, with
knife + leathers (see `tools/combat-sim.mjs` for live numbers):

| Creature | statLevel | hd | die | L1 win-rate | Role |
|----------|:---:|:---:|:---:|:---:|------|
| demon rat | 3 | 1 | 1d4 | ~100% | fodder |
| rat-man | 3 | 2 | 1d4 | ~100% | the finished mutation |
| drain-crawler | 5 | 2 | 1d6 | ~100% | deep-hinge oddity |
| the drowned | 6 | 3 | 1d6 | ~92% | L4 mid-tier; ~28% to an *unarmed* wanderer |
| the grafted | 8 | 3 | 1d6 | ~64% | L7 hell-tier fair fight (body-horror assembly) |
| a gorger | 9 | 4 | 1d8 | ~31% | L8 wall (the renderers; Tallow's kind) |
| shit-golem ("sewage demon") | 9 | 4 | 1d8 | ~30% | a real wall; optional/fleeable; trivial once marked |
| pig-demon | 10 | 4 | 1d8 | ~8% | the kidnapper's kind; hard optional in L7, rules L9 |

(L1 player, knife + leathers. `node tools/combat-sim.mjs` for live numbers + the
fists-only and marked-build columns.)

## Magic — the Word (owner-goal 2026-06-18)

Magic is, mostly, a **combat skill** drawn out of the deep itself. It is a seventh combat
action (a **Cast** button + spell submenu, mirroring Special), and it is OFF until you learn
it. Engine in the `<<script>>` block of `src/sewer-demons.twee` (with the cheese/addiction
code, since they share the mana hook); the sim mirror is `tools/combat-sim.mjs` (MAGIC row).

### Mana — the channel, and its tie to corruption

`$mana` / `$maxmana`, surfaced in the StoryCaption kit **only once learned**. The ceiling:

```
setup.maxMana() = magicLevel × MANA_PER_LEVEL(4)  +  floor(corruption / 10)
```

So mana is fuelled by **two** things: your **magic level** (= your character level once
you've learned — `setup.magicLevel()`, 0 unlearned) and your **corruption**. The deep worked
into you *is* the wellspring — the more of it you carry, the more you can call back out. Since
a cast corrupts you, casting slowly **widens its own well**: the vice. `setup.recomputeMana()`
keeps `$maxmana` in step + clamps `$mana` (called from `recomputePlayer`, guarded — it's
defined in the later script-block). Mana refills on a true rest **and** by feeding an
**addiction** (`setup.restoreMana`): `eatCheese` tops it a little, `ratNestRest` fills it —
the same vices that taint you. (The future "smoke on the midway" uses the same hook; see the
`sewer-demons-add-addiction` skill.)

### Casting — ~2× a weapon strike, and it corrupts BOTH

`setup.SPELLS` (id · cost · behavior `bolt`/`sweep` · `power` multiple · `self` caster-taint ·
`bite` victim-AC · `minLevel`): **The Hex** (L1), **Withering Word** (L3), **Spreading Rot**
(L4, sweep). `setup.castSpell(id)`:

- **Damage** = `setup.spellBase() × power`, where `spellBase = 1d(SPELL_DIE 8) + SPELL_FLAT(2)·magicLevel`.
  It **auto-hits** and **ignores blunt/edged type resistance** (the Word finds the flesh) — which
  is what makes a cast worth ~**2×** a weapon strike at the same level. The sim MAGIC row holds
  the ratio at **2.0–2.3×** across L1–L5 (it converges on 2× as you climb; the low-level premium
  is intentional — magic is a mana-limited, self-harming **burst**). Tune `SPELL_DIE`/`SPELL_FLAT`
  in BOTH the engine and the sim.
- **Corrupts the VICTIM**: its guard sloughs — `e.ac -= bite` (floored at 6), `e.corrupted += bite`.
  The deep eats it; subsequent blows (weapon or Word) land easier.
- **Corrupts the CASTER**: `setup.corrupt("head", setup.classOnFloor($combatOrigin), self)` — a taint
  of **the floor's own class** settles behind your eyes. (Reads `$combatOrigin`, not `State.passage`,
  because mid-fight the passage is `"Combat"` — depth 0.) This is also the loop that widens the well.
- **Leveling lifts both**: magic level = character level, so a level-up raises the mana ceiling AND
  `spellBase` (more dice-flat, and higher spells unlock at their `minLevel`).

### Learned three ways (all live)

`setup.learnMagic(source)` — sets `$magicKnown`, records `$magicSource`, fills the well. One-time;
each source shows an "already known" line afterward. The three vectors the owner asked for:

| Vector | Where | Source tag |
|--------|-------|-----------|
| a **character** | **TheLarder** (L1) — the rat **Cantor** in the nest sings the Word and teaches it | `cantor` |
| an **item** | **TheStallRow** (L2, the privy) — a **grimoire printed on the toilet roll**, read sheet by sheet (the Šulak snare waits one stall over) | `grimoire` |
| a **location** | **Hellmouth** (L5) — trace the **incised arch-script** | `wall` |

Two of the three are **gated** — the Cantor (character) is the one reliable, ungated, early route,
so magic is never fully locked behind a check.

**The location (Hellmouth = spawn) must not hand you magic turn one:** `setup.canReadInscription()`
opens the trace-and-learn action only if you've **heard the arch can be read** (`$heardOfWord`,
planted by a further-gone captive at **TheArrivals**) OR you pass a **passive WIS/perception check**
(`setup.passivePerception() = 10 + WIS mod ≥ PERCEIVE_INSCRIPTION_DC 11` — by level/WIS-marks, not a
fresh L1). Otherwise it's gibberish ("come back when the deep has worn you keener").

**The item (privy roll) has TWO gates** — a physical one and a knowledge one:
- **Access**: the roll-stall is usually **occupied** — a per-visit `random(1,100) ≤ 20` (**20% free**)
  in `TheStallRow` itself; occupied → "come back when it's free" (re-enter to re-roll, diegetic).
- **Recognition**: even with the stall free, you won't think to *read* printed bog-paper unless
  `setup.canReadGrimoire()` — the same passive perception **OR** `$heardOfGrimoire`, set by the
  **`midgossip`** random encounter (overhear two midway demons, L6, gossip that the deep prints its
  primer on the stall roll). Free + can't-read shows the locked teaser.
- **The tell**: the special stall is marked by a **pink glow** — and the room view is deliberately
  **vague** ("one stall has an eerie pink glow"); the occupancy roll + the printed-roll detail + the
  read action are all revealed when you **step in** (a `<<linkreplace>>`, so the detail lives inside the
  stall, not in the room). The glow is the concrete thing the midway demons name ("they lit the bloody
  hole pink so the marks'd look"), turning "a glowing hole I won't investigate" into "that's the
  primer." Flavor, not a flag — recognition still gates on `canReadGrimoire()`.
- **The snare next door** (the shut stall → `EndingTakenStall`, the Šulak latrine-lurker) is now
  **warned before the click**: the lurker prose sits beside its link and the label telegraphs it
  ("Open the shut stall anyway — and meet what's been waiting"), so the bad end is an informed choice,
  not a gotcha. House style: each choice's description sits next to its own link.

## Determinism note

Engine dice use `Math.random` (via `setup.d`), not SugarCube's save-seeded
`State.random()`. Combat is real-time and not replayed from saves, so save-determinism
isn't needed; this also lets `tools/combat-sim.mjs` reproduce the math in plain Node.

## Testing

- **`tools/combat-sim.mjs`** — `node tools/combat-sim.mjs` prints win-rate + average
  rounds for the L1 player vs every enemy (and a marked-build comparison). Run it
  after any combat-math or stat change; it's the cheap balance check.
- **In-browser** — drive an actual fight (Combat passage) and read the log; the
  ability sheet is in the left UI bar (`StoryCaption`). Target zero console output.

## Open / future

- ~~A real level-up mechanic + XP~~ — **done** (see *Leveling & XP* above).
- Per-ability stat blocks (drop flat `statLevel`) for differentiated enemies.
- Proficiency-scaling with level (`PLAYER_PROF` is a flat 2 today; left flat because
  the per-level ability curve is already steep — revisit if combat needs more bite).
- Named skills (Athletics/Stealth/Perception…) and ability **checks/saves** outside
  combat (WIS to resist a temptation, CHA to haggle a demon down, STR to force a gate).
- Initiative (currently player-acts-then-enemy); multi-enemy encounters.
- Weapon/armor variety; damage types; status effects (disease fits the mutagen theme).

### Identity damage (owner, 2026-07-20) — ✅ SHIPPED (both sides)

**The hole (was):** combat had exactly one health axis — **vigor** (HP). The transformation axis
(`$body` segments / `$corruption`) was touched by combat only when you **lose** (`setup.loseFight`
works the enemy's `class` into two mauled segments). So a strong player who *wins* every fight
never risked their **self** — you could grind the sewer indefinitely and stay clean of corruption as
long as your HP held. Winning should not be a corruption-free ride.

**What shipped (the ENEMY side, via the smoke creatures — HANDOFF-SMOKE-CREATURES.md Phase 0):**
- **`idmg` field** on an enemy (+ `idmgFlavor`), carried to the actor in `setup.combatActor`. In
  `setup.enemyTurn`, an enemy with `idmg > 0` corrupts a random segment (its `cls`) on **every landed
  hit** instead of the vigor "tears into you" line — narrated by `setup.identityHit` /
  `setup.IDMG_LINES[flavor]`. **Guard halves it** (bracing keeps more of you together); a **crit
  doubles** it. The vigor loss is small (these things barely tear flesh); the cost is what you *are*.
- **The `chorus` `ENEMY_MOVES`** entry (the shadow-person's telegraph): takes `idmg` from **two
  segments at once** — a working miniature of the un-built plurality horror.
- **`setup.scatterToll`** (called in `TheGutteringCleared`): a guaranteed diffuse corruption on the
  **win** — "you can't kill smoke, only breathe it." This is the floor under "you can win and still
  lose yourself," since in-fight idmg alone scales with fight length (a 3-round win would pay almost
  nothing). Live-sim balance: a won Guttering fight costs ~1.3 corruption-meter (fast/equipped) → ~3.1
  (fists/L1) — bounded near a loss, scaling with how long you struggle; the wrong (edged) weapon drags
  it out and costs more (smoke `resists: edged`, `weakTo: blunt`).
- The **smoke creatures** (`shadowperson`, `smokewisp`) are the first carriers; the machinery is
  **general**, so the next carriers slot in cheaply (below).

**What shipped (the PLAYER side, 2026-07-20):**
- **`taint` on a weapon** (`{cls, amt, line?}`, in `setup.items`) — a tainted weapon works its own
  nature into the **WIELDER** on every landed blow (enemies don't transform, so the corruption lands on
  *you*): power now, self later, so the nastiest weapon isn't a free pick if you're trying to stay human.
  `setup.weaponTaint` reads the equipped weapon, corrupts a random segment, returns a log clause (an
  optional `taint.line` with `{amt}`/`{seg}` placeholders carries the weapon's own voice). Hooked into
  `playerStrike` (per landed hit) and `doSpecial` (**once per action**, not per hit — an AoE special
  doesn't multiply the self-cost). First carrier: the **`hungry_knife`** finally *delivers* on its
  description (`taint filth 2` — "it feeds on the part of you that could still wash clean"); it's
  `apparentTier: steel`, so the cost is discovered by use, the cursed-weapon way.
- **`setup.identityResist(cls)`** — a body already turned toward a class shrugs off more of the **same**
  (`min(2, floor(classLimbs(cls)/2))`): you can't disperse what's already half-gone. Threaded through
  **`identityHit` + `scatterToll` + `weaponTaint`** (every caller floors at 1, so it never fully negates
  — it only rewards commitment). The **build answer to the smoke fight**: a fresh SINGULAR body takes the
  full cost (the point), a filth-turned one takes less. Verified: 4 filth limbs → resist 2 → the knife's
  taint and the shadow-person's idmg both drop 2→1.

**Cheap next carriers** (the machinery is general): more **tainted weapons** (a smoke/tallow-slick blade
findable in the fuming band would close the loop with the smoke class) — add `taint` to the `setup.items`
entry; more **enemy** `idmg` carriers (L8 tallow-smoke, a spore/miasma thing) — set `idmg` + `idmgFlavor`
+ an `IDMG_LINES` line; and **armor/mark** idmg-resistance (extend `identityResist` to read a gear/mark
bonus — a second, non-body build answer).

Open design questions (deferred, not blocking): should idmg read as its own combat-log meter rather than
folding into the transformation feed? Should it be **resistible by a save** (CON/WIS) rather than flat —
a check like the short-weight men — so a steady body shrugs off more? (Phase 0 chose flat + guard-halves
for legibility.)
