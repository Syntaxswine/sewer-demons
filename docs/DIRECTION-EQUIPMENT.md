# Direction — Equipment, Accessories, Curses & Magic

Owner direction, 2026-06-05. A big itemization expansion: tiered weapons & armor, a new
**accessory** layer, a **curse** system, and a **magic-bonus** system. Format follows the other
DIRECTION docs: **Owner** = the directive (verbatim/near-verbatim), **Notes** = implementation/
integration thoughts and open forks (not locked — ask at the real ones).

> ## ✅ INFRA BUILT — 2026-06-06 (the §F cross-cutting pipeline + capability flags)
> The hard part — **"build the equip-slot + item-modifier pipeline first, then it's mostly
> data"** (owner's vote) — is **done and verified in-browser**. What landed:
> - **6 equip slots:** `$weapon`, `$armor`, + four accessory slots `$ring`/`$necklace`/`$boots`/
>   `$gloves` (`setup.ACCESSORY_SLOTS` / `setup.EQUIP_SLOTS` / `setup.equipped()`).
> - **The modifier pipeline** `setup.itemMods()` → folds every equipped item's passive bonuses/
>   penalties (stat / all-stat / **hp** / **ac** / **encounter**) into `playerScores()`,
>   `playerMaxHp()`, `playerAC()`, and `setup.encounterRate()` — the same way `MARK_MODS`/
>   `FORM_MODS` already fold in. Per-creature **damage** bonus is `setup.itemDamageBonus(enemy)`,
>   applied in `playerStrike`/`doSpecial` (scope-gated: a class/enemy-id is stronger than "all").
> - **Curses** (`setup.itemCurses`/`curseEntries`/`hasCurse`/`curseParam`): stat-drains +
>   encounter-up via the pipeline; **capability flags** `canAttack`/`canRun`/`canSpeak`/
>   `canPickup`/`autoSurrender` read by the Combat six-button row + the `<<acquire>>` widget;
>   corruption curses wired at the source — `irreversible` (soothe/Clean Pool no-op) and
>   `always_class` (forces the corruption class in `setup.corrupt`); economy curse `coinrot`
>   (`setup.gainCoins` diverts coin → a `setup.JUNK` rubbish item).
> - **`setup.acquire(id)`** — central pickup: respects `nopickup`, auto-equips into the right
>   slot, recomputes. The `<<acquire>>` widget is now a thin wrapper.
> - **Schema fields live:** `tier`, `slot`, `magic:{scope,bonus,amount}`, `curse` (string |
>   `{id,stat,class,amount}` | array). **Five seed items** prove every path
>   (`ratbane_spike` per-type magic weapon; `quick_boots`/`ward_necklace`/`dim_ring` blessed
>   accessories; `greed_ring` cursed trap) — **UNDISTRIBUTED** (the where-from is fork §G).
> - **Verified:** every bonus/penalty/flag folds correctly; autoSurrender routes a fight straight
>   to CombatLost; disabled buttons render; zero console; combat-sim baseline unchanged.
>
> ## ✅✅ DATA + DISTRIBUTION BUILT — 2026-06-06 (the whole proposal now ships)
> The second half landed too (owner: "knock out all the elements… build tools to test them"):
> - **Weapons (§A):** full ladder `rusty 1d4 → copper 1d6 → bronze 1d8 → iron 1d10 → steel 1d12`,
>   **each in blunt + edged**; 4 **magic** (per-creature & all-scope dmg); 2 **cursed** (apparentTier).
> - **Armour (§B):** `rags 0 · clothes 1 · robes 1 · leather 1 · copper 2 · bronze 2 · iron 3 ·
>   steel 4`; **magic** `warded mail`; **cursed** `comely coat` (looks like steel, autoSurrender).
>   **robes' role (fork):** the quiet/light line — low AC + a −encounter rider.
> - **Accessories (§C):** 16, across all four slots, covering **every magic-bonus type** (str/dex/
>   con/int/wis/cha/all/hp/ac/encounter/dmg) and **all eleven curses** (verified by the linter).
> - **Identification (fork → hidden-until-equipped):** an item with magic/curse shows only its
>   **apparent tier** ("steel-looking armour (unidentified)") until equipped (too late for a curse)
>   or appraised; plain gear reads true. `isIdentified`/`identify`/`itemDisplayName`/`itemBrief`.
> - **Cursed removal (fork → NON-removable in the field):** a cursed item locks its slot, can't be
>   taken off normally, and **carries cross-life** (`recordRun`→`bankCursedGear`; `StoryInit`→
>   `seedCursedGear` re-grips). **✅ The cutter NPC is built (2026-06-07): the Fleshcutter** (L7
>   `TheFleshcutter`, off TheGutway). `setup.cutCurse(id)` removes the item + its mark for a small coin
>   fee, but leaves a permanent cross-life **SCAR** (always a stat-loss, sometimes another curse) —
>   you trade a known curse for one you didn't choose, never leaving clean. This is the **deliberate
>   brake (owner) on the "submit to everything → high corruption → purify at the very end" line**: the
>   high-corruption-then-cleanse playstyle is real and strong, and cursed gear (which you can't simply
>   doff before the Clean Pool) is how it's taxed. Scars = bodiless personal curses (`setup.scars`/
>   `addScar`) folded into `curseEntries()`.
> - **Distribution (fork → all of: shop + drops + magic-rare):** a data-driven **smith stall**
>   (weapons/armour to steel) + **trinket stall** (accessories) + **appraiser** in HellMarket
>   (`setup.MARKET_*`, `buy`, `appraise`); **enemy drops** on victory (`rollDrop`); magic NOT sold.
> - **THE mismatch rule (owner):** a drop whose **apparent tier outranks the monster** is far more
>   likely **cursed** (+0 rank 8% → +4 rank 95%). Verified: apparent-steel off a level-1 rat is
>   rare *and* 79% cursed — loot too good for what carried it is the in-fiction trap-tell.
> - **Equipment screen** (new `Equipment` passage, reached from the sidebar "⚙ Manage gear"):
>   equip/swap/remove per slot; cursed slots show "· bound to you"; masked names for unidentified.
> - **Tool:** `tools/equip-check.mjs` — parses `setup.items`, asserts every tier/curse/magic-type is
>   covered + ladders monotonic, prints the ladders/coverage/mismatch table. PASS. (It caught a
>   missing `int`-bonus item mid-build.)
>
> **Only forks left to the owner** (genuinely optional/prose): exact number tuning (all marked
> tunable); the **future uncurse NPC**; **nospeak** retro-gating on specific demon-bargain links
> (the flag works; wrap a bargain link in `<<if setup.canSpeak()>>` during the prose pass); deeper
> distribution placement (layer-gated finds, the wheel jackpot). The original "still data" note
> below is now historical.

> **Discipline reminder:** compile via `.\build.ps1` (compiles + syncs art) → both-direction link
> check → `node tools/combat-sim.mjs` if combat math moves → drive in a browser → zero console.
> And the sharp one: **any DISPLAYED prose stored on `setup.*` must live in the raw-JS `<<script>>`
> block**, not StoryInit's `<<run>>` (operator-word desugaring). See `HANDOFF.md §4`.

---

## Where this plugs in — the current item engine (baseline)

So the builder isn't guessing. Today (`src/sewer-demons.twee`):

- **Registry:** `setup.items` — each entry `{ name, kind, … }`. Kinds in use: `weapon`
  (`die` "XdY" + `dtype` "blunt"/"edged"), `armor` (`ac` bonus), `tool`, `costume`, `consumable`
  (`heal`). E.g. `knife {die:"1d8", dtype:"edged"}`, `pipe {die:"1d6", dtype:"blunt"}`,
  `leathers {ac:1}`, `salve {heal:8}`.
- **Equip slots:** **just two** — `$weapon` and `$armor` (single ids). `<<acquire id>>` adds to
  `$inventory[]` and auto-equips a weapon/armor if that slot is empty.
- **Combat math** (`docs/COMBAT.md`): attack = `d20 + STR mod + prof(2) − corruptionPenalty` vs
  AC; damage = `weaponDie + STR mod` × `setup.typeMult(weaponType, enemy)` (×1.5 weakness / ×0.5
  resist). Player AC = `10 + DEX mod + armor.ac`. **Damage type matters** (blunt scatters golems).
- **Stat pipeline:** `setup.playerScores()` → base-by-level **+ `setup.MARK_MODS`** (cross-life
  marks shift scores) **+ `setup.FORM_MODS`** (transformed limbs). `setup.recomputePlayer()`
  rebuilds `$scores`/`$maxhp`; call it on any equip/mark/level change.
- **Cross-life carriers (established):** "seals, cursed objects, tattoos" persist between lives via
  `memorize`/`recall` marks (pure accumulation). **A cursed item is exactly this** — see Curses.
- **Encounter rate:** `setup.ENCOUNTER_RATE` (4). **Corruption classes:** rat/pig/filth; `$form`
  per segment; transformations at 100. **CHA** is currently combat-inert ("reserved for bargain
  checks") — relevant to *cannot speak*.

**The big new infra this needs (do this first):** a real **equipment-slot system** + an
**item-modifier pipeline** that folds equipped gear's bonuses/penalties into `recomputePlayer()`,
combat, and the encounter roll — the same way `MARK_MODS`/`FORM_MODS` already fold in. Once that
exists, weapons/armor/accessories/curses/magic are all just data on items.

---

## A. Weapons — 7 classes (owner)

> **Owner:** "7 classes of weapons, or 6+1, in order of desirability: **Cursed, Rusty, Copper,
> Bronze, Iron, Steel, Magic**."

Ascending desirability: **Cursed (worst/trap) < Rusty < Copper < Bronze < Iron < Steel < Magic
(best)**. The "6+1" reads as **6 wantable tiers (Rusty→Magic) + 1 cursed outlier** — confirm.

**Notes:**
- Maps straight onto the existing `weapon` kind: each tier = a bigger **damage `die`** (and Magic
  carries a magic bonus, §E; Cursed carries a curse, §D). Suggested ladder (owner to tune, verify
  with `combat-sim.mjs`): Rusty `1d4` → Copper `1d6` → Bronze `1d8` → Iron `1d10` → Steel `1d12` →
  Magic `1d12`+bonus; Cursed `1d6`-ish but it can't be dropped and carries a curse.
- **`dtype` is an orthogonal axis** (blunt vs edged — golems care). A tier could exist in both
  (an iron *club* vs iron *blade*), or each named weapon picks one. Fork: do tiers × dtypes, or
  just give each tier a fixed dtype? The current `pipe`(blunt)/`knife`(edged) should slot into the
  ladder.
- **Cursed weapons** are the hook for §D: equipping one is a trap (strong-looking but cursed), and
  by the cross-life rule it may not come off (or only via a specific cleanse). 
- **Magic weapons** carry a §E bonus (esp. the per-creature-type damage bonus — fits `typeMult`).

## B. Armor — 10 classes (owner)

> **Owner:** "**cursed, rags, clothes, robes, leather, copper, bronze, iron, steel, magic**."

Ascending desirability: **cursed < rags < clothes < robes < leather < copper < bronze < iron <
steel < magic**. (Note `robes` sits below leather — likely the "caster/light" line; and `rags`/
`clothes` are the near-nothing starting tiers.)

**Notes:**
- Maps onto the `armor` kind's **`ac`** bonus: rags `0` → clothes `0/1` → robes `1` → leather `1`
  → copper `2` → bronze `2/3` → iron `3` → steel `4` → magic `4`+bonus; cursed low AC + a curse.
  (Owner to tune; remember player AC = `10 + DEX + ac`, so each +1 is meaningful — keep the spread
  tight.) `leathers` (ac 1) is today's only armor; it becomes the "leather" rung.
- **robes** may want a special role (e.g., the tier that best carries/amplifies magic, or doesn't
  impede something) rather than pure AC — fork for the owner.

## C. Accessories — a new layer (owner)

> **Owner:** "**rings, necklaces, boots, gloves.** accessories can be **blessed or cursed**."

**Four new equip slots**, each holding one accessory; each accessory is **blessed** (a §E-style
bonus) or **cursed** (a §D curse). This is the cleanest carrier for both the magic and curse
systems.

**Notes:**
- Needs `$ring`/`$necklace`/`$boots`/`$gloves` (or a `$equip` map) + a kind `accessory` with a
  `slot` field. Blessed → a magic bonus; cursed → a curse. Same modifier pipeline as armor/weapon.
- Thematic slot leanings (fork): boots → DEX/flee/encounter-rate; gloves → STR/attack; necklace →
  CHA/health/all-stats; rings → anything (the flexible slot). Lets you telegraph an item by slot.
- **Blessed vs cursed should be hidden until equipped or identified** (a "you don't know what it
  does until you put it on" tension) — fork: identification mechanic, or visible on pickup?

## D. Curses (owner — "in no particular order")

> auto surrender · −one single stat point · −all stat points · unable to pick up objects · coins
> turn into other objects · transformations are irreversible · transformations are always X type ·
> cannot run in combat · cannot attack in combat · cannot speak · increase encounter rates

A **curse** is an effect attached to a cursed weapon/armor/accessory (and, per the established
rule, cursed items **carry between lives** as marks and **resist removal**). One item = one curse
(or more). Per-curse implementation hooks:

| Curse | Hook / how to wire it |
|---|---|
| **Auto surrender** | Combat: force the Surrender path (→ `CombatLost`) at fight start, or remove all other actions. Brutal — pairs with a big stat boost as the "trap." |
| **−1 to one stat** | A negative modifier in the item-modifier pipeline → folds into `recomputePlayer()` like a bad `MARK_MOD`. |
| **−1 (or −all) to all stats** | Same pipeline, applied to every score. The heavy version. |
| **Can't pick up objects** | Gate `<<acquire>>` / pickup links on `not cursed("nopickup")`. |
| **Coins turn into other objects** | On coin gain (loot/wheel/sweep), divert to junk items instead of `$coins`. Needs a junk-item pool + intercept at the coin-add sites. |
| **Transformations irreversible** | `setup.soothe()` (and the Clean Pool) skip / can't reduce segments while this curse is active — corruption only ratchets. (Big interaction with the clean-run audit.) |
| **Transformations always X type** | Force the corruption class: `setup.corrupt()` overrides the passed class to the cursed class (rat/pig/filth). You become one specific thing no matter the source. |
| **Cannot run in combat** | Hide/disable the **Run** button (and the work-curse-style escape). |
| **Cannot attack in combat** | Hide/disable **Attack** (and Special?) — forces Guard/Items/Surrender only. |
| **Cannot speak** | Disable dialogue/CHA-bargain options (the L4 demon bargains, future helper/talk options). Ties to CHA being "reserved for bargains." |
| **Increase encounter rate** | Add to `setup.ENCOUNTER_RATE` while equipped (e.g. +4–8%). Composes directly with the new encounter system. |

**Notes:** build a `setup.curses()` helper (collect active curse-ids from equipped/cursed items +
cross-life cursed marks) and a `setup.hasCurse(id)` the above hooks check. Cursed items are the
deliberate **risk/reward trap**: strong stats, nasty rider, hard to shed.

## E. Magic bonuses (owner)

> **Owner:** "magic can grant bonuses, **against one type of creature or all creatures**. if it's
> one type of creature it's **much stronger**. it could give a bonus to **any stat, to all stats,
> health, armor, decrease encounter rates**."

A **blessing/magic** effect on a magic weapon/armor or a blessed accessory. Two axes:
1. **Scope:** *one creature type* (stronger) **or** *all creatures* (weaker). "Creature type" =
   the bestiary classes/ids (rat / pig / filth, or a specific enemy like `pigdemon`). The
   per-type combat bonus maps perfectly onto **`setup.typeMult`** / the attack math (a bonus that
   only applies when the target matches).
2. **Bonus body** (any of): **+a stat**, **+all stats**, **+health** (`$maxhp`), **+armor** (AC),
   **−encounter rate**.

**Notes:**
- Schema idea: `magic: { scope:"all" | "rat"|"pig"|"filth"|<enemyId>, bonus:"str"|"all"|"hp"|
  "ac"|"encounter", amount: N }`. Per-type bonuses use a bigger `amount` than `all`-scope.
- Stat/HP/AC bonuses fold into `recomputePlayer()` (the modifier pipeline). The **per-creature
  damage/hit** bonus applies in `setup.playerStrike`/`doSpecial`/`attack` when
  `enemy.cls === scope` (or enemy.id). `−encounter` subtracts from `setup.ENCOUNTER_RATE`.
- This is the **good mirror** of curses; accessories are the main carrier (blessed), plus the
  Magic weapon/armor tiers.

---

## F. Cross-cutting — the infra to build first

1. **Equip slots:** weapon, armor, + ring/necklace/boots/gloves (and consider mainhand dtype).
   A `$equip` map or discrete `$`-vars + a `setup.equipped()` accessor.
2. **Item-modifier pipeline:** one place that gathers every equipped item's stat/HP/AC/encounter/
   per-type modifiers (like `MARK_MODS`/`FORM_MODS` already do) and applies them in
   `recomputePlayer()`, the combat rolls, and the encounter roll. Curses are negative modifiers +
   capability flags; magic is positive modifiers. **Build this once; everything else is data.**
3. **Item schema extension:** add `tier`, `slot`, `curse`, `magic`, `blessed/cursed` fields to
   `setup.items` entries. Keep displayed text desugaring-safe.
4. **`<<acquire>>` upgrades:** handle accessory slots; respect "can't pick up" curse; handle the
   "auto-equip best tier?" question (fork).
5. **Cross-life:** cursed gear persists as marks (established rule) and resists removal; blessed/
   magic gear is per-run unless the owner wants some to carry. Fork.
6. **Capability flags** for the combat UI: `canAttack`/`canRun`/`canSpeak` etc. read by the
   `Combat` six-button row and dialogue options.

## G. Open forks (settle when building)

- **Numbers:** exact die per weapon tier, AC per armor tier, bonus/penalty magnitudes — tune with
  `combat-sim.mjs`.
- **dtype × tier:** do metal tiers come in blunt *and* edged, or one each?
- **Acquisition/distribution:** where does tiered gear come from — HellMarket tiers, drops,
  layer-gated finds, the wheel? How rare is Magic?
- **Identification:** are blessed/cursed hidden until equipped (the classic "cursed item" trap), or
  visible? Can cursed gear be removed at all (and how — a cleanse, the Clean Pool, a deep-helper)?
- **Stacking:** how many bonuses/curses at once (4 accessories + weapon + armor = up to 6)? Any caps?
- **Cross-life:** which magic/blessed items (if any) carry between lives vs cursed (which do)?
- **Robes' special role**, and the **coins-turn-to-objects** junk pool contents.

## Suggested build order

1. **Infra first (§F):** equip slots + the modifier pipeline + schema fields + capability flags.
   Nothing else works cleanly without it. Verify the pipeline with one test item before scaling.
2. **Weapons (§A) + Armor (§B):** pure data on the new schema; tune dice/AC with the sim.
3. **Accessories (§C):** the 4 slots + blessed/cursed carriers.
4. **Magic (§E):** the bonus system (stat/all/hp/ac/encounter + per-type) — the good half.
5. **Curses (§D):** wire each capability flag/penalty to its system; cursed-carries-cross-life +
   resists-removal last (it touches the clean-run economy — coordinate with the deferred corruption
   tuning / clean-run audit).
6. Distribution & identification pass; then balance with `combat-sim.mjs` + a play-through.

**Cross-references:** `docs/COMBAT.md` (combat math + the six actions), `docs/HANDOFF.md` (systems
table, §4 gotchas), `docs/TRANSFORMATION.md` (corruption classes / `$form` — the *always-X* and
*irreversible* curses live here), and the `sewer-demons-add-creature` skill (creature `class`/`id`
that magic's per-type scope targets).
