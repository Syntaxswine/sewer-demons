# Sewer Demons — Agent Handoff

Everything another agent needs to pick up this project. Last updated 2026-07-20
(the transformation feed + voice-pass, systemic regard, and the smell-horror pass — olfactory regard + the
nose-blind milestone; then the room-scent layer — the THIRD olfactory system, your eroding disgust at the
world's stink (recoil → accept → relish), plus the fresh-revulsion mechanical teeth: a gate, a non-combat
stat penalty, and the cheese hook; **then the NPC population — 46 voices across all 9 layers (clue/corrupt/
flavor + the Dante-style ambient damned), the inline-`<<linkreplace>>` pattern + the `npc-probe` tool + the
`sewer-demons-add-npc` skill — the eleventh letter; **then the prose pass — every navigable room grown to
three exploring paragraphs (doorway → moving in → deeper register) + the lean-voice discipline (the transport
is structural, not ornate) + the `prose-guard` tool — the twelfth letter**; then the RPG-canon review and its
shipped clusters — **trust**, **seal-economy**, the full **combat chain** (R12–C2, six rungs), and the
**world-remembers** work: the **blood ledger** (R17) and the **short-weight men / third ledger**, plus the
corruption-**overflow** spill and the **rat-run capture** scene; then **THE VICES — a general addiction
ledger (all vices tallied, only the loudest calls, spam to override) + sewer-brew (the filth food, bought
at the tavern) + the drinking-contest con + brew withdrawal — the twentieth letter** — the
**thirteenth–twentieth letters**, all detailed in the arc blocks below). **Read this first**, then `docs/GAME-SPEC.md` (the original
brief), `docs/MAP-ARCHITECTURE.md` (the map bible), and `docs/RESEARCH-demonology-filth.md`
(grounding research).

> And when you've got the lay of it, read **`docs/TO-THE-BUILDERS.md`** — a short
> letter from the builder who laid this foundation about *how to hold the work*
> (the craft and collaboration lessons that don't fit in a reference table).

---

## 1. What this is

A **Twine interactive-fiction horror game in SugarCube 2.37.3**. You're a person
kidnapped off the street by a pig-demon and dragged down into a sewer that is a
literal **hellmouth**. Goal: **find a way out without losing yourself.** The spine
is a hidden-then-visible **corruption** stat; the demons offer real help (shortcuts,
gear, the exit) but every bargain costs a piece of you.

Core pillars (all built & working):
- **State-driven soundtrack** — the music re-picks from a pool based on live game
  state at every track boundary (not a baked playlist). *(Runs silent: no audio
  files committed yet; the engine is wired and guarded.)*
- **Visible corruption meter** that reads as **physical filth on the body**.
- **9-layer vertical map** (sewer → hellmouth → hell), each layer a templated level.
- **Combat, inventory, economy** (coins + pay-with-yourself), **gates**, **a sigil
  meta-puzzle**, and **cross-life marks** that persist between playthroughs and
  unlock new endings.

---

## 2. Repo & status

- Location: `C:\Users\baals\Local Storage\AI\sewer-demons`
- **LOCAL-ONLY. No GitHub remote** (the owner removed it deliberately — private
  repos felt too exposed). Local git history is intact; **do NOT add a remote or
  push** unless explicitly asked. **Commit locally** after each working change.
- Git identity: commits go out as `StonePhilosopher`.
- **Structurally complete: ~239 passages, one `.twee` file per layer** (all 9 layers built
  to the ~20-room template; full descent/ascent traversable; sigil meta-puzzle wired). See §9.
  Remaining work is enrichment, not structure.
- **The rooms are now POPULATED (2026-06-26): 46 NPCs across all 9 layers** — clue/corrupt/flavor
  + the Dante-style "ambient damned". Spec: `docs/PROPOSAL-NPCS.md` (+ `…-VOICES.md`); track with
  `node tools/npc-probe.mjs` (→ 46/46); author with the `sewer-demons-add-npc` skill. See §5, §9.
- **The room prose is now AT DEPTH (2026-06-26): every navigable room unfolds across ~3 exploring
  paragraphs** (doorway → moving in → deeper register — the owner's "rooms reveal themselves as you move
  through them"; 117 rooms + the `Captured` intro). Guard prose-only edits with `node tools/prose-guard.mjs`
  (markup byte-identical to HEAD). **The voice stays LEAN — transport is structural, not ornate; see §8.** See §9.
- **A design review vs the RPG canon exists (2026-07-01): `docs/REVIEW-RPG-CANON.md`** — 32 verified,
  adversarially-checked findings (non-overlapping with §9/BACKLOG), the live per-finding tracker
  (SHIPPED/DECLINED/open). The **trust/honesty cluster is ✅ COMPLETE 2026-07-02** (R3, R2 +
  form-switch reset, R21, R5, R4 tolls-in-real-currency; R1 DECLINED — owner keeps player undo), and
  so is the **seal-economy cluster (R10+C1)** — staying/working/gambling/leveling cost belonging now;
  SEAL_LIMIT retuned 360→440 vs the re-run audit. The **combat chain is ✅ COMPLETE 2026-07-02**
  (R12 signature moves · R13 crit-smear · R14 threat-read · R15 packs · R16 parley · C2 morale — monsters
  telegraph, wounds smear, you smell the fight before you take it, packs wake the aim UI, Yield opens the
  middle path, and enemies can break and flee). The **WORLD-REMEMBERS work is underway (2026-07-02/03)** —
  the deep keeps three books on you: the **blood ledger** (R17 — kills tallied by class, read as regard) and
  the **short-weight men** (the *third ledger* — a den's clerks read your **dumped** stat and test it;
  closes R9's ambush + finally makes CHA cost), plus two owner polish items — corruption **overflow** (a
  maxed limb spills to a new target instead of wasting it) and a bespoke **rat-run capture** loss scene
  (`setup.CAPTURE_SCENE`, extensible per den). **Then THE VICES (2026-07-20):** a general **addiction
  ledger** — every corrupting food/drink is tallied, only the **dominant** vice's craving nags, and a
  rival seizes the call only by strictly **exceeding** it ("spam to override"); the first new tenant is
  **sewer-brew** (the *filth* food, bought at the L6 tavern) with a **drinking-contest** con (easy CON
  check, inverted payoff — winning is the trap) and a dry-shakes **withdrawal**. **Then THE STILL** —
  the filth **JOB** that makes the brew (`TheStill`, L6, off the back-alley wet stair): grueling, poorly
  paid in coin, and paying its wage in the drink itself (**payment-in-kind** — labour marks the body,
  only the in-kind wage feeds the vice; the spiral made literal). **Then THE PENS** — pig's food (`pig-slop`, eaten at the trough in `TheHolding`,
  L7) built onto the Belly's harvest lore, plus a **fattening capture** (cross the trough mostly-pig →
  the pen-boars pen and finish you). **Then THE CURDWORKS** — rat's JOB (`TheCurdworks`, L1 off
  `TheLarder`; the rats cure the cheese, and pay in the wheel), which **CLOSES the food×class matrix**:
  every class now has a **food** and a **job** (rat cheese+curdworks · pig slop+pens/dens · filth
  brew+still). **Then THE SMOKE CLASS — PHASE 0 (2026-07-20):** the back-alley glowing smoke becomes a
  **fourth nature** — the **shadow-person** + **smoke-wisps** (`TheGuttering`, off the still) + the
  **smoke vice** (`drawSmoke`, the ledger's fourth tenant, the one that DIFFUSES — no limb turns, pure
  loss), all `filth`-class for now (zero body-model change; Phase 0 of `HANDOFF-SMOKE-CREATURES.md`). It
  also added a **new general combat axis — IDENTITY DAMAGE** (`idmg`): corruption on every landed hit, so
  **winning finally costs your self**, with a **scatter-toll** flooring the cost ("you can't kill smoke,
  only breathe it"). **245 passages.** See §9 + the arc blocks up top.

```
sewer-demons/
├─ src/
│  ├─ sewer-demons.twee        # core ONLY: StoryData, StoryInit (all systems), widgets,
│  │                           #   StoryCaption (meter+char-sheet), PassageHeader, intro,
│  │                           #   hellmouth, hell town, combat, all endings (NO layer rooms)
│  ├─ layer1-storm-drains.twee # L1 the climax/escape layer, ~20 rooms (the way out)
│  ├─ layer5-hellmouth.twee    # L5 the threshold/spawn, ~20 rooms (the iconic mouth; two ways split here)
│  ├─ layer6-shambles.twee     # L6 the carnival hell-town, ~20 rooms (HellMarket/gear, the spawn-town)
│  ├─ layer2-trunk-mains.twee  # L2 (Confluence hub, GritChamber, Gut/Tallow), ~20 rooms
│  ├─ layer3-old-drains.twee   # L3 the hinge layer (chemistry → intent), ~20 rooms
│  ├─ layer4-drowned-galleries.twee  # L4 the "between"/drowned band, ~20 rooms (Whisperer/Understudy)
│  ├─ layer7-belly.twee        # L7 first hell layer, Cronenberg body horror, ~20 rooms (sigil-fragment 1)
│  ├─ layer8-rendering-works.twee # L8 hell's flesh-factory, ~20 rooms (gorgers, sigil-fragment 2)
│  └─ layer9-sulphur-deep.twee  # L9 the bottom: pig-demon sulphur castle, ~20 rooms (sigil-fragment 3, EndingUnbound)
├─ docs/
│  ├─ GAME-SPEC.md             # original design brief (verbatim from owner)
│  ├─ MAP-ARCHITECTURE.md      # the 9-layer "map bible" — themes, template, bestiary
│  ├─ COMBAT.md                # the D&D-style combat system spec (engine source-of-truth)
│  ├─ TRANSFORMATION.md        # per-segment corruption + mutagen-class transformation spec
│  ├─ DIRECTION-HELLMOUTH-ARRIVALS-WORK.md  # ACTIVE phase: Hellmouth collapse + work-curse + body text
│  ├─ DIRECTION-NEXT.md        # prior-phase direction notes (all four shipped)
│  ├─ RESEARCH-demonology-filth.md  # cited folklore/demonology research
│  └─ HANDOFF.md               # this file
├─ tools/combat-sim.mjs        # offline combat balance probe (node tools/combat-sim.mjs)
├─ tools/equip-check.mjs       # equipment catalog linter (node tools/equip-check.mjs) — run after gear edits
├─ tools/clean-run-path.mjs    # belonging-clock / escape-reachability audit (node tools/clean-run-path.mjs) — run after map/depth edits
├─ tools/npc-probe.mjs         # NPC roster validator (node tools/npc-probe.mjs → 46/46) — reads npc-manifest.json; run after NPC edits
├─ tools/npc-manifest.json     # the NPC roster (room/flag/kind per NPC) — the probe's source of truth
├─ tools/prose-guard.mjs       # markup-invariant guard (node tools/prose-guard.mjs) — proves a prose-only pass touched no macro/link/NPC/header (byte-identical vs HEAD); run after any room-prose edit
├─ docs/PROPOSAL-NPCS.md       # the functional NPCs (clue/corrupt/flavor) — spec of record, marked SHIPPED
├─ docs/PROPOSAL-NPCS-VOICES.md # the ambient damned (Dante voices) + the trickster two-mode rule — SHIPPED
├─ audio/README.md             # cache-id → filename → role table (no mp3s yet)
├─ .tools/                      # Tweego + SugarCube format (git-ignored, see §3)
├─ dist/                        # compiled HTML (git-ignored)
└─ README.md, .gitignore
```
> **Repeated tasks have skills — invoke them, don't re-derive:**
> `sewer-demons-add-creature` (enemy schema + encounter pattern + verification),
> `sewer-demons-add-npc` (the inline-`<<linkreplace>>` NPC pattern + the trickster
> two-mode rule + `npc-probe` verification), `sewer-demons-illustrate-room`,
> `sewer-demons-expand-transformation-feed`, `sewer-demons-expand-room-scent`.

---

## 3. Build & verify (DO THIS — it's how every change was validated)

There is **no `npm`/`package.json`**. The game is Twee3 source compiled to a single
HTML file by **Tweego**, which is vendored (git-ignored) in `.tools/`.

**Tweego bundles only SugarCube 2.30.0**, but the game targets **2.37.3** — the
correct format is installed at `.tools/storyformats/sugarcube-2-37/`. You MUST set
`TWEEGO_PATH` to that storyformats dir or the compile fails on the version.

### Compile — use `.\build.ps1` (the canonical build)
```powershell
& "C:\Users\baals\Local Storage\AI\sewer-demons\build.ps1"
```
`build.ps1` sets `TWEEGO_PATH`, compiles **both** `dist\index.html` (what the preview
server serves at `/`) **and** `dist\sewer-demons.html` (the named copy), then **syncs
`img/ → dist\img/`** so the combat portraits / room art resolve when serving `dist/`.
**Always build with this, not bare tweego** — a bare compile to only `sewer-demons.html`
leaves the served `index.html` STALE (this bit during the equipment build: the engine
looked unchanged in-browser until `index.html` was rebuilt). Manual equivalent if needed:
```powershell
$tweego = "C:\Users\baals\Local Storage\AI\sewer-demons\.tools\tweego.exe"
$env:TWEEGO_PATH = "C:\Users\baals\Local Storage\AI\sewer-demons\.tools\storyformats"
& $tweego -o "...\dist\index.html"        "...\src"
& $tweego -o "...\dist\sewer-demons.html" "...\src"
```
Tweego compiles **every `.twee` in `src/`** into one HTML.

### Run & drive in a browser (Claude preview tools)
A static-server config exists in the workspace `.claude/launch.json` named
**`sewer-demons`** (python http.server on **port 8738**, serving `dist/`).
- `preview_start {name:"sewer-demons"}` → returns a `serverId`.
- The game's globals live under **`window.SugarCube.*`** (NOT bare globals): use
  `SugarCube.State.variables` (the `$` vars), `SugarCube.State.passage`,
  `SugarCube.Engine.play("Passage")`, `SugarCube.setup.*`.
- Reload after recompiling: `preview_eval` → `window.location.href='/index.html?v='+Math.floor(performance.now())`.
- Check `preview_console_logs {level:"warn"}` after — **target is zero console output.**

### Two cheap checks worth running every time
1. **Compile exit 0** (catches macro/syntax errors).
2. **Link integrity — BOTH directions.** A one-directional check (every `<<goto>>`
   target resolves to a passage) only proves nothing is *broken* — it can't see a
   passage that is *defined but unreachable*. That gap hid a dead ending
   (`EndingTrapped`/`"lost"`) for several commits: written, compiling, and reachable
   by no path. So check **both** ways:
   - **Dead links:** `goto` targets ∖ passage defs → must be empty.
   - **Orphans:** passage defs ∖ `goto` targets → only the special passages
     (`Start`, `StoryInit`, `StoryCaption`, `PassageHeader`, `Widgets`, the `Story*`
     passages) **and combat-cleared landers** (`GritChamberCleared`, `TheCrawlCleared`
     — reached *dynamically* via `$combatReturn`, which a static `<<goto>>` scan
     can't see) are allowed; **any `Ending*` here is a dead ending.** Bash:
     ```sh
     cd src
     grep -h '^:: ' *.twee | sed 's/ \[.*//; s/^:: //' | sort > /tmp/defs.txt
     grep -ohE '<<goto "[^"]+"' *.twee | sed -E 's/<<goto "//; s/"//' | sort -u > /tmp/tgt.txt
     comm -23 /tmp/tgt.txt /tmp/defs.txt   # dead links (want: empty)
     comm -13 /tmp/tgt.txt /tmp/defs.txt   # orphans (want: only specials)
     ```
   Current state: **all `<<goto>>` resolve; no orphan endings.**

---

## 4. SugarCube 2.37 gotchas (LEARNED THE HARD WAY — don't re-discover these)

- **Audio API.** `SimpleAudio.tracks` is a *collection*, not a function. Use
  `SimpleAudio.tracks.get(id)` / `.has(id)` — there is **no** top-level
  `SimpleAudio.has()`. There's no "is anything playing" accessor; we hold the current
  track in `setup.current` and check `AudioTrack.isPlaying()`. `<Array>.delete()` is
  deprecated (we filter instead).
- **Restart, not goto.** `<<goto "Start">>` is *navigation only* — it does **not**
  re-run `StoryInit`, so state never resets. Use `<<run Engine.restart()>>` for "New
  Game"/"Again". (Goto-to-Start caused an infinite `EndingBecome` loop when corruption
  was maxed — fixed in `cb0a75e`.)
- **Persistence scope.** `memorize`/`recall`/`forget` work inside TwineScript and are
  **lexically captured** inside the `setup.*` closures (defined in a StoryInit
  `<<run>>` block) — they are **NOT** `window` globals. From `preview_eval` you must
  read marks via `setup.hasMark(...)`, not a bare `recall(...)`.
- **Testing staleness.** After `Engine.play(...)` or a link `.click()`, SugarCube
  commits the new state/DOM on the *next* microtask. Reading `State.passage`/vars in
  the **same** `preview_eval` turn yields the *stale* value, and doing **two**
  `Engine.play` calls in one turn loses the first. Pattern: **one action per
  `preview_eval`, read in the next call.** Sharper corollary: after `Engine.play`,
  `State.variables` is a **new object**, so a `var V` captured *before* it is stale —
  don't trust a flag you read right after a `<<linkreplace>>` click. Read a **structural
  signal** instead ("did the success-branch prose render?") and confirm the flag in a
  **separate** eval. (Also: hammering `Engine.play` ~80× in one eval slides past the
  history window and drops vars — a harness artifact, not a game bug.)
- **`.textContent` joins words across source newlines.** The game renders **every source
  newline as `<br>`** (no global newline-collapse — verified: 60 `<br>` in one passage, no
  `<p>`), and a `<br>` contributes nothing to `.textContent`, so two words on adjacent source
  lines read back **mashed**: `"the slag\nand clinker"` → `"slagand clinker"`, `"burn\nthrough"`
  → `"burnthrough"`. This is **not a render bug** — on screen it's a normal line-break — but it
  will make a `textContent` regex check fail and send you chasing a ghost. When you verify prose,
  **strip all whitespace and match the contiguous letters** (`t.replace(/[^a-z]/gi,'').includes(...)`).
- **Verify an image *loaded*, not just that the tag rendered.** Both art systems hide a missing
  file with `onerror` (combat portrait `port-img` → `display:none`; `<<roomart>>` → parent hidden),
  so a wrong path fails **silently**. Check `naturalWidth > 0` and that the parent isn't
  `display:none`, not merely that the `<img>` exists. (See `sewer-demons-illustrate-room`.)
- **No spaced expressions as macro args.** A macro argument containing a space inside
  parens is split by the arg parser: `<<corrupt _seg "pig" random(4, 8)>>` parses
  `random(4,` and `8)` as two broken args → `NaN`. Compute first:
  `<<set _amt to random(4, 8)>><<corrupt _seg "pig" _amt>>`. (Bit the L6 food/cage-act
  corruption; literal-number args like `<<corrupt "head" "pig" 4>>` are fine.)
- **`/* */` IS a passage comment** in SugarCube markup (stripped on render), alongside
  `/% %/` and `<!-- -->` — so builder-notes in a passage body don't display.
- **`<<run>>`/`<<set>>` DESUGAR operator-words inside string literals.** TwineScript turns
  `to`→`=`, `and`→`&&`, `is`→`===`, `or`→`||`, `not`→`!`, `eq/neq/gt/lt…` into JS ops — and
  in the big StoryInit `<<run>>` block this leaks **inside string literals**, so a stored
  `setup.X = "light and quick"` becomes `"light && quick"`, `"settling in to stay"` →
  `"settling in = stay"`. (Hit the body-segment descriptions; the item `.desc` fields are
  also mangled but never displayed.) **Fix: hold any DISPLAYED prose that lives on `setup.*`
  in a raw-JS `<<script>>…<</script>>` block** (not desugared), as the body-segment
  descriptions now are. Short labels/names without whole-word operators are fine in `<<run>>`.
- **A literal macro tag inside a `<<script>>` block — even in a JS comment — breaks the
  block.** SugarCube scans a `<<script>>…<</script>>` body as raw text for its closing tag and
  counts any `<<foo>>` it sees as a nested opener. A builder-comment that *mentions* `<<script>>`
  (e.g. "held in this `<<script>>` block") registers as a second opener, so the real `<</script>>`
  closes the inner one and the outer block reports **"cannot find a closing tag for macro
  `<<script>>`"** — a runtime hang, **green compile**. (Cost me a stuck renderer on the work-curse
  build.) Fix: never write a literal `<<…>>` tag inside a `<<script>>` body; say "this raw-JS block"
  instead. Same caution for `<<nobr>>`/`<<silently>>` text inside script.
- **`$` vs `setup.`** — `$vars` are serialized into saves; engine logic
  (functions, the chooser, registries, the audio track handle) lives in `setup.` so it
  never serializes.

---

## 5. Systems reference (all in `src/sewer-demons.twee` unless noted)

**StoryInit** holds the `$` state inits AND a big `<<run>>` block defining all
`setup.*` engine logic. Key pieces:

| System | Where / how |
|--------|-------------|
| **Audio chooser** | `setup.playNext()` — builds an eligible track pool from live state (base bed always; demon motifs once met; corruption-tier tracks scale in), avoids immediate repeat, re-arms the `ended` handler. Guarded by `SimpleAudio.tracks.has()` → silent + safe with no files. Kicked off on the first click ("Struggle"), revived in `PassageHeader` after reloads. Audio cache block is **commented out** until real mp3s exist (`audio/README.md`). |
| **Corruption (per-segment)** | The body is **6 segments × {rat,pig,filth}** (`$body`/`$form`); `$corruption` 0–100 is now a **derived mirror = avg of segments** (engine-owned — rooms use `<<corrupt seg class amount>>`/`<<soothe amount>>`, never `<<set $corruption…>>`). `StoryCaption` shows the general meter + a **6-segment Body readout**. Segments transform into their dominant class at 100. **Full spec: `docs/TRANSFORMATION.md`.** |
| **Transformation feed (2026-06-24)** | The moment a `<<corrupt>>` lands, a body-change beat is narrated in the main column — the **internal face** of agency-loss (the body acting without you). `setup.corrupt` records `setup.lastChange`; the `<<corrupt>>` widget (the SOLE feeder) queues it via `setup.pushChange` onto `$pendingChanges`; `PassageHeader` flushes a `.change-feed` stinger at the top of the next room (so a corrupt inside a link narrates on the destination). Calibrated: only a threshold cross / full turn / hit ≥ `CHANGE_MIN_AMT` 8. Prose `setup.CHANGE_DESC` (4 parts × 3 classes × 4 stages, raw-JS block) + `CHANGE_DEEPEN`; stage-tinted CSS, turned bold, deepen muted. Engine-internal `corrupt` callers keep their own prose (no double-narration). Tool **`tools/feed-inspect.mjs`**. Editing procedure = `sewer-demons-expand-transformation-feed` skill. **Full spec: `docs/TRANSFORMATION.md`.** |
| **Systemic regard (2026-06-24)** | The world reads the body you wear **as a rule** — the **outward face** of agency-loss (the world decides what you *are*). `setup.bodyClass()` (graded whole-body dominant class; `classLoad`/`classLimbs` generalize the rat-only `ratLoad`/`ratLimbs`, which now delegate) vs `setup.classOnFloor()` → `setup.regardOf(passage)` = **matched** (claimed, no vote) / **mismatched** (marked wrong). `regardTier` 1/2/3, `REGARD_MIN_LOAD` 35; a `kin_<class>` mark escalates a matched read. Prose `setup.REGARD` (18 cells, **scent-reads** — the world's nose, voicing the filth `cha −1`). Surfaced as a cooldown-gated (`REGARD_COOLDOWN` 8) `PassageHeader` `.regard-line` (a changed verdict shows at once) + **the `backtowork` press-gang reading your body** (kin → free slip-past; rival → handling). Tool **`tools/regard-probe.mjs --bands`**. **Full spec: `docs/TRANSFORMATION.md` → Systemic regard.** |
| **Nose-blind milestone (2026-06-25)** | Olfactory adaptation as a mechanic, the bromidrophobia motif's sharpest point: once you're *mostly* a class (`setup.noseBlindReady`: `classLoad ≥ NOSE_BLIND_LOAD` 50, or 3 turned limbs) a **one-time-per-class** beat (`setup.NOSE_BLIND`, filth home) fires — you've stopped smelling what you're becoming, so noticing you stopped means you're further gone than the meter says. `PassageHeader` checks the unflagged classes against `$noseBlind` (resets each life via restart; a split body gets each class one-per-passage; flags only on show); `.nose-blind` milestone band. |
| **Room-scent — the THIRD olfactory system (2026-06-25)** | Regard = the world smells YOU; nose-blind = you stop smelling YOURSELF; **room-scent = your reaction to the WORLD's stink, eroding as you corrupt** — the full olfactory-adaptation curve, re-derived LIVE each room (reversible; nose-blind is the latched milestone). A stinky room has an intrinsic stench-**kind** (`setup.scentOf`: a band default by depth `SCENT_BAND` + per-room `SCENT_OVERRIDE` reskins / `null` opt-outs). `setup.scentTier` slides the reaction: **`recoil`** (fresh body, eff ≤ `SCENT_RECOIL_AT` 10 — violent revolt; the EXTREMES speak, the habituated middle 11–74 is SILENT, the room prose owns it) → **`accept`** (eff ≥ `SCENT_EASE_AT` 75) → **`relish`** (eff ≥ `SCENT_RELISH_AT` 90 — the body *wants* it). `eff = $corruption + SCENT_AFFINITY_PER_LIMB (5) × turned limbs whose class matches the smell` (a rat-man eases into the den first; additive/matching-only). Prose `setup.ROOM_SCENT[kind] = {class, recoil, accept, relish}` (7 kinds × 3 = 21 cells, raw-JS block, class = what the SMELL is not the floor faction). Cooldown-gated `.room-scent` `PassageHeader` beat (feed → **scent** → regard → nose-blind; shares `REGARD_COOLDOWN`). Tool **`tools/scent-probe.mjs`** (`--ladder`/`--rooms`); skill **`sewer-demons-expand-room-scent`**. **Full spec: `docs/TRANSFORMATION.md` → Room-scent.** |
| **Fresh-revulsion gate + penalty (2026-06-25)** | The recoil band has mechanical teeth — the **inversion**: the world penalises you for staying human, a little corruption is relief (agency-loss mechanised). **`setup.inuredEnough()`** (corruption > `SCENT_RECOIL_AT`) gates foul interactions a fresh human can't do — the **exact inverse** of `setup.composedEnoughToBow()` (locks when too *corrupted*); the two bracket the meter (*too fresh to kneel at the filth-shrine, too far gone to bow to the kappa*). Applied to **`ThePrivyShrine`** (the `$sphincterWord` lesson refused while fresh; exits stay open = soft, never a softlock), the **`FINDS` cache** (11 foul reaches carry `fresh:true`, filtered from `eligibleFinds()` while fresh — delays gross gutter coin at low levels), and the **cheese** (`TheLarder`: both willing on-ramps gated; but `setup.loseFight` to a RAT-thing arms `$cheeseTasted` involuntarily — `forceFedCheese`, a one-time `CombatLost` beat — and the `ratcraving` is left UNGATED, so the craving overrides the fresh revulsion: *addicted to a thing you never chose to taste*). **Penalty:** non-combat stat checks take `setup.freshCheckPenalty()` (`SCENT_FRESH_CHECK_PENALTY` −2) while fresh; route future checks through **`setup.statCheck(stat, dc)`** (FUTURE-PROOFING — no non-combat stat *rolls* exist yet; combat keeps its own corruption/limb penalties). **Full spec: `docs/TRANSFORMATION.md` → Room-scent / Mechanical teeth.** |
| **Global corruption loss** | `PassageHeader` hijacks to `EndingBecome` when `$corruption >= 100` (skipped on `[ending]` passages). With the mirror = avg, this now means **every segment turned** = fully transformed; becoming wholly one class banks a `kin_<class>` mark. The day-to-day consequence of corruption is now **per-limb autofail** (corrupt arm → worse swing, corrupt leg → worse flee), not an instant 100-loss. |
| **Depth / belonging clock** | `setup.depthOf[passage]` = the room's **layer number (1–9)**; `PassageHeader` adds it to `$deepTurns` each room, deeper accrues faster. At `setup.SEAL_LIMIT` (**200**, tunable — a focused escape banks ~50, only a repeat deep-diver crosses it) `$sealed` → the way up is gone. The seal **bites on both sides** now: caught in the deep (DrownedHall/DeepHub ascent links) → `EndingResident` (`kept`); reaching for the surface (Maintenance/ExitShaft) → `EndingTrapped` (`lost`). Warning copy fires at 120 (60%); Confluence foreshadows the surface seal. *(Before `<commit>`, `SEAL_LIMIT` was 1000 and `$sealed` was read only in DeepHub — so both fates were effectively unreachable.)* |
| **Inventory / economy** | `$coins`, `$hp`/`$maxhp`, `$inventory[]`, `$weapon`/`$armor`. `setup.items` registry; `<<acquire id>>` widget (adds + auto-equips). Kit readout under the meter in `StoryCaption`. Mixed economy: coins for most goods; some cost **corruption** ("pay with yourself"); paying for ordinary goods with self is a baited foolish bargain (see `HellMarket`). |
| **Carnival wheel** | `TheWheel` (L6) — a repeatable bet. `setup.spinWheel(mode)` + `setup.WHEEL`/`WHEEL_STAKE`/`WHEEL_JACKPOT`. **coin** (stake 4): jackpot3/win12/**push50 (lose bet)**/**lose32 (lose bet + little transform)**/curse3. **trouble** (self-bet): jackpot10/win15/**lose35 (little transform)**/**transform20 (deep bite)**/curse20. Owner's ladder: push = lose the bet; lose = lose it + a little of you. Transform routes pig corruption via `setup.corrupt`. Mechanics in `setup.*`; the passage just narrates the returned `kind` (prose is placeholder for the owner's pass). |
| **Mouth-misspeak curse** | `$mouthCursed` (in-life; the wheel's "asking for trouble" outcome). A **document `click` capture-listener** registered ONCE in StoryInit (guarded by `setup._misspeakWired`; survives `Engine.restart`) that, when cursed, redirects ~5% (`setup.MISSPEAK_CHANCE`) of `a.link-internal` clicks to a *different* link on the passage — your mouth saying the wrong thing. Works everywhere incl. combat. Shown in `StoryCaption` ("Your mouth no longer always says what you mean"). Open fork: make it a cross-life cursed-object/tattoo if it should persist. |
| **Combat (D&D-style, multi-enemy screen)** | **Full spec: `docs/COMBAT.md`.** Six ability scores (`$scores`, STR/DEX/CON/INT/WIS/CHA), `mod = floor((score−10)/2)`. **Flat per level** (boss): player all-7s at `$level` 1; enemies carry one `statLevel`. **MULTI-ENEMY (owner 2026-06-05):** a fight is `$enemies[]` (was single `$enemy`); `setup.startFight(spec, ret)` takes a string id OR an **array** of ids. The `Combat` passage is a **screen** — name + drop-in portrait (`img/enemy/<id>.png`, class-glyph placeholder) + **player/enemy HP bars side by side** + the action row (`$combatMenu` = main/special/items/cast/yield): **Attack** (`playerStrike($target)`, the aimed enemy), **Guard** (`enemyTurn(true)` halves incoming), **Special** (a `setup.SPECIALS` sweep hitting ALL living enemies for ×`mult`<1; **N per fight = level**, base sweep always + form-gated ones via `hasFormLimb`), **Items** (`usableItems()`/`useItem` — consumables like `salve`; costs your turn), **Yield** (review R16 — the parley middle path: gated `setup.canSpeak()` (the muzzle's bite), submenu telegraphs `packListens()`, toss the purse (`yieldPurse`, walk out unmauled) or offer the shift (`pressGangTo`), deaf pack = a wasted round → `CombatYielded`; see `docs/COMBAT.md` → Parley), **Surrender** (deliberate → `CombatLost`), **Run** (`fleeRoll()` → `$combatOrigin`). Every living enemy ripostes each round; victory when all down → `CombatVictory` reads `$combatSpoils` (coins+XP **summed across the pack**). Attack = `d20 + STR mod + prof(2) − armPen` vs AC; damage `weaponDie + STR mod` × type-mult; nat20 crit/nat1 fumble. **`$hp≤0` NO LONGER kills** → `CombatLost` → `setup.loseFight()`: the **enemies' classes** mark two mauled segments by their `statLevel`, half-vigor revival; a loss completing a full transformation → `EndingBecome`. *(If `$workCursed`, the loss also routes to your workstation owing a shift.)* Combat prose is built in `setup.*` functions in the **`<<script>>` block** (desugaring-safe); the passage is `<<nobr>>`-wrapped; loop closures use `<<capture>>`. **Cross-life marks shift scores** (`setup.MARK_MODS`); turned limbs too (`setup.FORM_MODS`). Balance probe `tools/combat-sim.mjs` (single-target only). **Adding a creature → `sewer-demons-add-creature` skill** (set its `class`; optional `img`). **Non-combat resolution (owner 2026-06-18, the kappa):** an encounter can offer a *comportment* path instead of a fight — the **kappa** at L4 `TheBathhouse` (the drowned sewer-sentō) is bested by the **bow** (folklore: a kappa must bow back, spilling the water-dish that is its strength), gated by `setup.composedEnoughToBow()` (`corruption < setup.BOW_CORRUPTION_MAX` 50 — the deep in you locks simple courtesy); fail/refuse → `startFight("kappa", "TheBathhouseCleared")`. Either way the spilled dish runs `setup.soothe(setup.DISH_CLEANSE)` (the only clean water in hell). `$kappaBested` gates the encounter, `$kappaBowed` varies the cleared prose, `$bathhouseLooted` one-times the hoard (coins + a bonesetting heal-to-full). This is the Talmudic "warding/comportment over washing" note (RESEARCH-demonology-filth §4) made mechanical. |
| **Magic — the Word (owner-goal 2026-06-18)** | **Full spec: `docs/COMBAT.md` → Magic.** A **seventh combat action** (a **Cast** button + spell submenu, mirroring Special), OFF until learned. Engine in the **`<<script>>` block** (with the cheese/addiction code — shared mana hook). **Mana** (`$mana`/`$maxmana`, shown in the kit only once learned): ceiling = `magicLevel×4 + floor(corruption/10)` — fuelled by **magic level** (`setup.magicLevel()` = `$level` once learned, 0 unlearned) AND **corruption** (the deep in you IS the well). `setup.recomputeMana()` (guarded call in `recomputePlayer`) keeps it in step. Refills on rest **and by feeding an addiction** (`setup.restoreMana`: `eatCheese` a little, `ratNestRest` full) — the future midway-smoke uses the same hook. **`setup.SPELLS`** (Hex L1 · Withering Word L3 · Spreading Rot L4-sweep), `setup.castSpell(id)`: damage = `spellBase()×power`, `spellBase = 1d8 + 2·magicLevel` (`SPELL_DIE`/`SPELL_FLAT`), **auto-hits + ignores blunt/edged resist** → ~**2× a weapon strike** at level (sim MAGIC row holds 2.0–2.3× L1–5; tune in BOTH engine + sim). **Corrupts BOTH:** victim's guard sloughs (`e.ac -= bite`, floored 6) and the caster takes `self` **head**-corruption of **the fighting floor's class** (`setup.classOnFloor($combatOrigin)` — NOT `State.passage`, which is `"Combat"` mid-fight). Casting → corruption → wider well → more casting (the vice spiral; see `docs/TRANSFORMATION.md`). Leveling lifts BOTH mana ceiling and `spellBase`. **Learned 3 ways** (`setup.learnMagic(src)`, one-time, each shows an "already known" line after): a **character** (TheLarder rat **Cantor**, L1, `cantor` — the ONE ungated/reliable early route), an **item** (**TheStallRow** the privy, L2 — a **grimoire printed on the toilet roll**, `grimoire`), a **location** (Hellmouth arch **script**, L5, `wall`). **Two are gated.** *Location* (Hellmouth = spawn, mustn't give magic turn-one): `setup.canReadInscription()` = `$heardOfWord` (a captive at TheArrivals tells you the arch can be read) **OR** passive perception (`setup.passivePerception() = 10 + WIS mod ≥ setup.PERCEIVE_INSCRIPTION_DC 11` — by level/WIS-marks, not a fresh L1). *Item* (privy roll) = **two** gates: **access** (the stall is usually occupied — per-visit `random(1,100) ≤ 20` in TheStallRow) **AND** **recognition** (`setup.canReadGrimoire()` = passive perception **OR** `$heardOfGrimoire`, set by the `midgossip` L6 encounter). |
| **Equipment — catalog, gear screen, shop, drops (2026-06-06, COMPLETE)** | **Full spec: `docs/DIRECTION-EQUIPMENT.md`** (all of §A–G built). **Catalog** in `setup.items`: weapon ladder (rusty→steel, blunt+edged) + magic + cursed; armour ladder (rags→steel) + magic + cursed; 16 accessories covering every magic-bonus type + all 11 curses. Tier orders `setup.WEAPON_TIERS`/`ARMOR_TIERS`; `setup.MATERIAL_RANK`/`apparentTier`. **Weapon TYPES (2026-06-07):** a second axis — dagger/hook/spear/sword/axe/hammer set the damage RANGE (`setup.TYPE_DIE` + `TIER_DMG_BONUS` flat tier bonus; `die`/`dtype` DERIVE via `setup.weaponDie`/`weaponDtype`/`weaponKind`), the blunt/edged class, and an unlocked SPECIAL (sword/spear sweep · axe cleave · hammer/hook stun · dagger flurry — `setup.SPECIALS` gated by `wreq`; stun sets `enemy.stunned`, honoured in `enemyTurn`). Enemy TYPE-affinities live on the enemy sheet (`weakTypes`/`resistTypes`), merged with blunt/edged in `setup.typeMult(dtype,enemy,wkind)`. See `docs/COMBAT.md` → Weapon TYPES; balance with the TYPE MATRIX in `tools/combat-sim.mjs`. **Identification = hidden-until-equipped** (`isIdentified`/`identify`/`itemDisplayName`/`itemBrief`): magic/cursed items show only their apparent tier until worn (a curse grips on equip) or appraised; plain gear reads true. **Equip/swap** `setup.equip`/`unequip`/`slotItems` + the **`Equipment` passage** (sidebar "⚙ Manage gear" → stashes `$gearReturn`). **Cursed = non-removable in the field** (`slotLocked`; owner's call), **carries cross-life** (`recordRun`→`bankCursedGear`; StoryInit→`seedCursedGear` re-grips). **The ONE way off — the Fleshcutter (L7 `TheFleshcutter`, off TheGutway):** `setup.cutCurse(id)` removes the item + its cross-life mark for a coin fee (`setup.UNCURSE_COST` 15) BUT inflicts a permanent cross-life **SCAR** — always a stat-loss, sometimes a worse curse too (`setup.SCAR_CURSES`). Scars = bodiless personal curses in a recalled `"scars"` array, appended by `setup.curseEntries()` so every curse hook (flags, stat-drains, labels) treats them like worn curses; `setup.scars`/`addScar`/`scarLabel`. **You never get clean of curses — only trade a known one for a scar** (the deliberate brake on "wear cursed power-gear → purify at the end"). `forgetMarks` clears scars too. **Cursed-item distribution + legibility (owner 2026-06-07):** MOST cursed items are now **purely negative** (no boon — `manacle_ring`/`bound_gaunts`/`crown_thorns`/`silver_muzzle`/`bell_charm`/`sty_signet`), with only a couple **mixed temptations** (`lead_boots` con+3/can't-run, `greed_ring` str+3/coinrot) + the cursed weapons/armour (gear has inherent value). And `itemBrief` now shows the **specific** downside (`setup.curseTag`/`CURSE_TAG` → "✗ can't run in combat"), not a generic "CURSED" — readable once identified (hidden-until-equipped still hides it pre-equip). **Distribution:** data-driven **smith + trinket stalls + appraiser** in HellMarket (`setup.MARKET_*`/`buy`/`appraise`), **enemy drops** (`rollDrop` in CombatVictory), magic never sold. **THE mismatch rule (owner):** a drop whose apparent tier outranks the monster is likelier **cursed** (+0→8%…+4→95%) — steel off a rat = a trap. **Tool: `tools/equip-check.mjs`** (catalog linter — run it after touching gear data). Numbers tunable; verified in-browser (equip/swap/drops/id/shop/cursed-lock/cross-life, zero console). **GRAFTS — the Cutter's body-mods (2026-06-08):** a 5th equip family that rides the same pipeline. `setup.GRAFT_SLOTS` (`eye`/`hand`/`hide`/`heart`) is appended to `EQUIP_SLOTS` (so `itemMods`/`equipped`/Equipment-screen pick them up) but NOT to `ACCESSORY_SLOTS` (so `acquire` never auto-equips one). 4 graft items (kind `accessory`, `graft:true`, `graftSeg`/`graftAmt`, a magic bonus: eye +2 enc · hand +2 STR · hide +2 AC · heart +12 HP). `setup.installGraft(id)` (the ONLY way in — the `TheSurgery` menu) pays `graftAmt` **pig corruption** to `graftSeg`, seats the part permanently, identifies it. `isGraft`/`isBound`(=cursed‖graft) lock the slot (`slotLocked`) and refuse `unequip`. `graftsAvailable`/`GRAFT_FOR_SLOT`/`graftBrief`. Equipment screen hides empty graft slots, shows worn ones as "· grafted". NOT carried cross-life. — *Below: the §F pipeline this all rides on.* | 
| **Item-modifier pipeline (§F infra, 2026-06-06)** | **Full spec: `docs/DIRECTION-EQUIPMENT.md`** (§F-INFRA). **6 equip slots** — `$weapon`, `$armor`, + accessories `$ring`/`$necklace`/`$boots`/`$gloves` (`setup.ACCESSORY_SLOTS`/`EQUIP_SLOTS`/`equipped()`). **`setup.itemMods()`** folds every equipped item's passive **magic** (+) / **curse** (−) into `playerScores`/`playerMaxHp`/`playerAC`/`setup.encounterRate()` — exactly like `MARK_MODS`/`FORM_MODS`. magic schema `{scope, bonus, amount}`, bonus = a stat \| `all` \| `hp` \| `ac` \| `encounter` \| `dmg`; the **per-creature** `dmg` bonus is `setup.itemDamageBonus(enemy)` in `playerStrike`/`doSpecial` (scope-gated — a class/id is stronger than `all`). **Curses** (`itemCurses`/`curseEntries`/`hasCurse`/`curseParam`, item `curse` = string\|`{id,stat,class,amount}`\|array): **capability flags** `canAttack`/`canRun`/`canSpeak`/`canPickup`/`autoSurrender` read by the Combat six-button row + `<<acquire>>`; corruption curses at the source — `irreversible` (soothe/Clean Pool no-op), `always_class` (forces the class in `setup.corrupt`); economy `coinrot` (`setup.gainCoins` diverts coin→`setup.JUNK`). **`setup.acquire(id)`** is the central pickup (respects `nopickup`, auto-equips by slot, recomputes); `<<acquire>>` is a thin wrapper — **call recompute on any equip change** (acquire does). Pipeline functions live in the **StoryInit `<<run>>` block before line ~929** (they must exist before the init `recomputeBody()` call); displayed curse-label strings are in the `<<script>>` block. **5 seed items** prove the schema (undistributed — where-from is fork §G). **NEXT = pure data:** the weapon/armor TIER ladders + more accessories + distribution/identification. |
| **Gate pattern** | A room that only reveals its onward link once a condition is met. Exemplar: `TheBlackValve` (L2) — drain it via `TheValvePuzzle` (`$valveClosed`) for a clean pass, OR **wade for +15 corruption** (pay-with-self). |
| **Clean-vs-dirty fork (2026-06-07, owner)** | A junction with two ways to a far-side cache: a **GUARDED clean path** (a layer guard you **fight OR pay**) vs a **DISCREET dirty shortcut** that **corrupts you UNLESS you carry the counter**. Three remain loop-back pockets (additive — nothing existing rewired): `TheSluiceFork`→`TheSumpVault` (L4, **waders**, off DeepHub) · `TheFumeCut`→`TheVentCache` (L9, **gas-mask/oilskin hood**, off TheVentField) · `TheConveyorFork`→`TheColdStore` (L8, **a switch — `$ductVented`, thrown at `TheVentControl`**, off TheForemansWalk). **The L7 fork was promoted to a real thoroughfare (2026-06-08):** `TheGapFork`→`TheHollow` is gone; `TheGapCrossing` (+`TheGapCleared` lander) is now a **reusable, two-way** span linking **TheGutway ↔ TheBirthingDens** (each links in, setting `$gapDest`; the high bone-bridge — fight the wardens once → `$gapCleared`, free, OR pay 18c each crossing; the low crevice — +16 corruption each crossing unless you carry **rope**; one-time `$hollowLooted` stash at the lip). Counters: new tools `waders`/`gasmask` (sold at HellMarket) + existing `rope` + the switch. Pattern = guarded link(s) `startFight(guard, farside)` / pay `$coins`; discreet link checks `setup.has(counter)` (or the flag) → clean `<<goto>>` else `<<corrupt …>>` first. Loot flags `$sumpVaultLooted`/`$ventCacheLooted`/`$hollowLooted`/`$coldStoreLooted`. Easy to add more — copy a junction, pick a hazard/counter. |
| **Snare pattern** | A bad-end room, usually **triggered** (you do the thing → end). Exemplars (L2): `TheStallRow` (open the latrine stall → `EndingTakenStall`, the Šulak privy payoff) and `TheBackflow` (the "wash yourself clean" lie → +30 corruption, can trip the global loss). |
| **Rest pattern** | Safe room, `<<set $hp to $maxhp>>`. Exemplar: `ThePumpRoom` (L2). |
| **Sigil meta-puzzle (COMPLETE)** | `$sigil[]` + `setup.hasSigil()` (all 3 of `setup.SIGIL_FRAGMENTS`). **All three placed & collectable:** L7 `TheNavel`, L8 `TheTallowHeart`, L9 `TheThroneWard` (each behind that layer's gate). With all three → Hellmouth offers **`EndingUnbound`** (banks the `unbound` fate — the hard true exit). Rope→climb (L1) is the other working exit. |
| **Cross-life marks (metaprogression)** | Persistent via `memorize`/`recall` (survive `Engine.restart` + browser). `setup.addMark/hasMark/markCount/recordRun/forgetMarks`. Every ending calls `recordRun(fate)` → banks the fate (`survivor/marked_escape/damned/kept/lost/died/taken/sovereign`) + bargains (`faceless/rendered/indebted`). **Meter starts clean each life; only marks carry; pure accumulation (never cleanse).** Marks unlock new wins — first one: `hasMark("damned")` → Hellmouth offers `EndingSovereign`. `StoryInit` recalls `$returns` + `$marks`; intro/demons give returnee callbacks. |
| **Work-curse / indenture (DIRECTION §C)** | `$workCursed`/`$workStation`("cage"/"vats")/`$workOwed`/`$sneakedOut`. Engine in the `<<script>>` block: `setup.WORKSTATIONS` (cage→pig@`TheCageAct` L6, vats→filth@`TheBoilHouse` L8), `takeWorkCurse(st)` (sets state + banks the **permanent** `work_<st>` mark), `assignStation()`/`inflictWorkCurse()` (the *assigned* path — by floor; reserved for involuntary hooks, **not** fired by ordinary combat loss), `doShift()` (station-class corruption to a random segment + clears the debt), `workRoom()`/`workLabel()`. **Acquire:** *willing* at the Arrivals fork (`TheArrivals` → `TheIndenture`, **you pick** the post) or *assigned* (cross-life seed at StoryInit from the mark, or a future hook). **Carries between lives, permanently** (pure-accumulation rule): a returner is seeded pre-indentured at StoryInit and `WriggleFree` routes them to their post. **Respawn = stack both** (owner): a cursed combat loss keeps the `loseFight` maul AND sets `$workOwed` + routes `CombatLost` to the workstation (not `$combatOrigin`). The station **locks its exits** while `$workOwed`; one shift clears it. Indicator in `StoryCaption`. Sneaking out (`$sneakedOut`) keeps the plain `CombatLost` (you stay yourself). **Work uniform + reward (owner 2026-06-06):** the player starts in **clothes** (the default armour, AC 1); taking the curse runs `setup.dressInWorkRags()` → your clothes are **replaced with rags** ("your new work clothes", AC 0), and the rags-uniform carries cross-life too (a returner is re-dressed at StoryInit). `setup.doShift()` counts `$shiftsWorked`; at `setup.WORK_LEATHER_AT` (**5**) the job **issues free leather** (auto-equipped if you're still in rags/clothes) — narrated in `TheCageAct`/`TheBoilHouse`. (`dressInWorkRags` lives in the run-block, not the script-block, because the StoryInit init-call uses it — the same ordering trap as the modifier pipeline.) **One-off forced shift (owner 2026-06-07):** an **unclaimed** player who SUBMITS — surrenders/loses any fight, or takes the press-gang "go quietly" — is now **marched to a random real station** (`setup.pressGangTo` → `TheCageAct`/`TheBoilHouse`, stashing `$pressedReturn`), works a single shift there (`setup.doPressedShift` — station-class corruption, NO curse/debt), and the room's pressed branch (gated `<<if $pressedReturn>>`) releases them back via a "Back to it" link that clears `$pressedReturn`. (Claimed players still reel to their OWN post via the binding — unchanged.) This replaced the old narrate-only press-gang shift + the 50%-on-encounter-loss roll (now unclaimed losses always conscript). | 
| **Random encounters (owner 2026-06-05)** | `PassageHeader` rolls `setup.ENCOUNTER_RATE` (**4**%, tunable) per real room move; `setup.encounterEligible()` gates to real rooms (`depthOf ≥ 1`) and skips arrivals back from an encounter/combat (no chaining). On a hit it stores `$encounterReturn = passage()` and `<<goto "RandomEncounter">>`. **Extensible pool:** `setup.ENCOUNTERS` (weighted) + `setup.pickEncounter()`; **entry #1 = the press-gang ("backtowork")**: the floor's **local denizens** (`setup.denizenPack()`, layer-appropriate, 1–2) demand you work. **Comply** → `setup.pressedToWork()` (a one-off shift at a random `setup.PRESSWORK` location → that class's corruption, **NO curse**) → back to `$encounterReturn`. **Resist** → `$encounterFight=true`, `startFight(pack, $encounterReturn)` with `$combatOrigin` overridden to `$encounterReturn` (so a loss returns to the room, not the encounter). Win → continue; **lose → `CombatLost` + a 50% chance they `pressedToWork()` you anyway** (the `$encounterFight` block, cleared after). `RandomEncounter` has **no `depthOf`** so it can't self-trigger. Add encounter types by extending `ENCOUNTERS` + a `<<case>>` in `RandomEncounter`. **Weights may be FUNCTIONS** (owner 2026-06-17, `setup.encWeight` evaluates them each roll) so an encounter's frequency can track live state. First use: **`pigpress`** — a **sty-hand** boar (art `Pig_PressGang.png`) comes recruiting; weight **12 when the cage is YOUR post** (`workStation === "cage"`) vs **5** for `backtowork`, so it's the MAIN encounter for a cage-bound player and only a **rare cross-poach** (weight 1) otherwise. Comply: claimed-to-cage → reeled to your own post owing a shift; else → one-off pig shift at the cage (`pressGangTo(ret, "cage")`, no curse). Resist → fight `pig_pressgang`. **`vatpress` (owner 2026-06-18) — the kappa parallel** for the OTHER post: a vat-tending kappa (the bathhouse kappa industrialised — it tends the rendering vats the way it tends a bathhouse tub, "only the water in it ever changes") recruits for the **vats**; weight **12 when `workStation === "vats"`** else **1**. Comply: claimed-to-vats → reeled to `TheBoilHouse` owing a shift; else → one-off filth shift at the vats (`pressGangTo(ret, "vats")`). Resist → fight `kappa` (the same L4 enemy). So the two workstations now each have a dedicated recruiter (cage = sty-hand, vats = kappa). **POSITIVE events (owner 2026-06-17):** not every encounter is a threat. **`goodfind`** surfaces a coin/item/cleanse waiting in a REAL room on the current floor (`setup.FINDS`, each anchored to a room + its `*Looted` flag) — the blurb NAMES that room ("…back at the organ-trove…") though you're standing elsewhere; taking it grants the reward where you are. Weight = `min(10, 3 × eligibleFinds().length)`, so a picked-clean floor stops offering them. The per-room coin pickups were **THINNED out of the rooms and migrated here** (room keeps a flag-aware ambient line, no take-action) — **DONE FOR THE WHOLE MAP (27 finds across all 9 layers)**; the one deliberately KEPT in-room is `TheArrivals`' spawn-coin (narratively load-bearing). `TheArrivals` and `TheStillFont` show the careful case: only the loose-coin block migrated, the room's other beats (the arrival fork; the causeway puzzle) stayed. Find types: `coins` (opt. `cost`+`costClass` — each costed find keeps its AUTHORED class, not the band default), `item` (`setup.acquire` — e.g. salve, a gaff, a coil of rope), `cleanse` (`setup.soothe` — clean rain L1, clean steam L9). To add more: a floor's `FINDS` entries + its room-thinning go together to avoid double-dip. **`kinhelp`** spends the under-used `kin_<class>` marks: a creature of a class you've WHOLLY turned does you a kindness (coin+heal); fires only when `kinReady()` (you carry that band's class mark), weight 3. Both via `setup.takeFind`/`takeKinHelp`; engine + the `FINDS` table (displayed prose) live in the raw-JS `<<script>>` block. **`ratcraving` (owner 2026-06-18) — the rat on-ramp.** Rat was the dead third of the body (pig 27 corruption sources, filth 32, rat 0); the **transformative cheese** at `TheLarder` (L1, off TheCulvertRun) is the fix — eat (`setup.eatCheese`: heal/rat-bite) or nest-rest (`setup.ratNestRest`: full heal/deeper bite). Tasting arms `ratcraving`, a sewer-band event whose weight CLIMBS with `setup.ratLimbs()`; past mostly-rat (`cheeseCompelled()` = 3+ turned limbs) it COMPELS — the body eats, no resist link. Engine in the `<<script>>` block. See `docs/TRANSFORMATION.md` → Open/future. **`midgossip` (owner 2026-06-18) — a pure eavesdrop, no fight.** Fires only on the **midway (L6)**, only while `!$heardOfGrimoire && !$magicKnown` (weight 4): two off-the-clock carnival pigs let slip that the deep prints its primer on the privy bog-roll (TheStallRow) — sets `$heardOfGrimoire`, which is the tip-off half of the privy grimoire's recognition gate (`setup.canReadGrimoire`). The parallel to the Arrivals tip-off for the arch. |
| **NPC dialogue — clue/corrupt/flavor + the ambient damned (2026-06-26)** | The populated rooms. **46 NPCs across all 9 layers**, each an inline **`<<linkreplace>>`** beside the room's own exits (the [choice-presentation rule](#)), gated on a one-shot `$...Talked/Heard/Known` flag (declared in the StoryInit **"NPC dialogue flags"** block), with a spent-revisit `<<else>>` beat; **talk-only** (never `startFight`). Most reveal-prose is `<<nobr>>`-wrapped for clean flow. Roles: **clue** (free; points at a REAL mechanic — the eight teachers, e.g. the Scrivener sets `$heardOfWord` → `canReadInscription()`), **corrupt** (a real reward bought with a big targeted `<<corrupt>>`, refuse `<<soothe>>`; the L1 Pryer reuses `setup.installGraft(id, cls)` — the **`cls` param is new**, defaults `"pig"` so the Cutter is unchanged), **flavor / the Dante voices** (free, or one **silent sub-8** knowing-cost tick). **Tricksters** follow the two-mode policy: a *braggart's* fake dangle resolves to nothing; a *shill* points at a real hazard hiding its cost (the wheel **Tout** → the existing `TheWheel` exit) but **never** at a death-route or the cleanse — every dangle is pure prose (no `<<goto>>`/flag). One **new passage**: `TheTallyBoy` (off `TheMeatRow`, `depthOf` = 7). Spec: `docs/PROPOSAL-NPCS.md` + `…-VOICES.md`. Validate with **`tools/npc-probe.mjs`** (`→ 46/46`, reads `npc-manifest.json`, exits 1 on a real bug); author with the **`sewer-demons-add-npc`** skill. |

---

## 6. The map (see `docs/MAP-ARCHITECTURE.md` for the full bible)

**9 layers, top (surface) → bottom (deep hell).** Depth = layer number drives the clock.

1. Storm Drains · 2. **Trunk Mains** (built) · 3. Old Drains — *sewer band:*
   **bathroom-horror + implied mutagenic industrial waste** (privy dread + leaking
   drums; demon rats are mutated vermin).
4. Drowned Galleries · 5. **Hellmouth** (spawn after kidnap) · 6. Shambles
   (market/tavern) — *in-between:* **carnival** energy; the toxic blurs into the
   supernatural; the stairs down are *inside the mouth*; market↔tavern link by back alleys.
7. Belly of the Beast · 8. Rendering Works · 9. **Sulphur Deep** — *hell:* infernal, ending in a
   **sulfur castle raised by 9 hydrothermal vents** (canary-yellow, Louisiana/Frasch look).

The register grades **poisoned (chemical) up top → possessed (spiritual) below** on
one continuous meter. **No central planning** — layout is organic, dead-ended,
meandering (not hub-and-spoke).

**Per-layer template (≥20 rooms):** 1 Ascent · 1 Descent · 1 **Gate** · 1 Rest ·
3 Cache/Puzzle · 2 Snare (bad ends) · ~11 Passage filler. Hell layers each hold one
**sigil-fragment**.

**Flow:** kidnap → arrive Hellmouth (L5) → descend (6→9) for the 3 fragments → ascend
the sewer (4→1) to climb out, past a gate per layer.

---

## 7. Locked design decisions (don't relitigate without the owner)

- Engine: **SugarCube** (for cross-passage audio). Not Harlowe.
- Corruption meter: **VISIBLE**, and reads as **physical filth** (dirtier as you corrupt).
- Demons: **both named individuals AND generic classes.** Named so far: the Whisperer
  (knowledge bargain), Tallow (a Gorger; flesh-for-armor), the Understudy (a Wearer;
  takes your face).
- **Bestiary / metaphysic (owner-set):** the sewer is **mutagenic**, and the mutation
  is **collective** — the filth swirls together into an evil **greater than the sum of
  its parts**. Generic enemies by band: sewer = **rat men + shit golems** (mutated
  vermin / aggregate filth); the deep hinge throws up **stranger creatures**
  (drain-crawler); the **sulfur castle (L9) is full of pig demons.** Full table:
  MAP-ARCHITECTURE "Bestiary".
- The kidnapper is a **pig**-form Šulak-style privy demon (research §2) — i.e. **one of
  the L9 pig demons**; Šulak is the in-fiction answer to *how you got here* and the
  bottom of hell is *what* took you.
- Combat: **simple + light randomness.**
- Economy: **mixed** — coins primary; some things cost *yourself*; paying for ordinary
  things with yourself is a deliberate foolish bargain.
- Belonging seal: depth-weighted; **`SEAL_LIMIT = 360`**, warning `SEAL_WARN = 220`
  (tunable — was 200, which the clean-run audit proved made escape IMPOSSIBLE: the
  brand-route floor is 183 deepTurns, see `docs/AUDIT-CLEAN-RUN.md`). Sealing in the
  deep → `EndingResident` (`kept`); sealing at the surface exit → `EndingTrapped` (`lost`).
- Cross-life: **specific marks/fates** carry (not a meter residue), **pure
  accumulation** (never cleanse), and they **open new win scenarios.**

---

## 8. Working conventions (how the owner likes it)

- **Hand-authored prose, fixed (not procedural) rooms.** Build **incrementally** — you
  do NOT have to finish a layer (or the map) in one pass.
- **~3 paragraphs of text per passage** (transitions/branch pages may be shorter); lean
  hard into stench/rot/filth. **Achieved map-wide (2026-06-26 prose pass):** every room now
  *unfolds* across three beats — the doorway (first impression at a glance), the step inward (a
  detail the first look missed), the deeper register (what the place lands on). A room reveals
  itself as the reader moves through it; it is *walked, not catalogued* (if you could shuffle the
  three paragraphs without loss, you wrote a list, not a room). Guard prose-only edits with
  `tools/prose-guard.mjs`.
- **Keep the voice LEAN — the transport is structural, not ornate** (learned 2026-06-26, the
  twelfth letter). The game's power is COMPRESSION: a single set-off word ("…just more refuse,
  *held*.") lands harder than a swelling paragraph. The ache the owner prizes — Conrad's "Youth", the
  doubled time, the *telling that knows* — comes from STRUCTURE (a voice that already knows the end),
  not from beautiful sentences, which are downstream of it; a present-tense game room can't host that
  frame, so grafted-on literary swell is costume with no body. (A Conrad-inflected ornate rewrite of
  `TheRiverMouth` was tested and rightly rejected for the lean original.) Default to compression;
  reserve any heightened register for a few load-bearing rooms and even there let *rhythm* carry it,
  not adjectives. Don't dress up *the thing told*. The lean voice getting out of the way **is** the effect.
- **Choice presentation (standing rule — all Twine writing, see `feedback_choice_presentation`):**
  (a) put each choice's **description right beside its own link**, not a wall of prose up top with
  bare links below; (b) **vague from outside, detail on entering** — a thing seen from the room gets
  a short teaser, the close-up is revealed when the player steps in/opens it (a `<<linkreplace>>` or
  sub-passage); (c) **warn before an irreversible bad-end** — telegraph the danger in the prose
  beside the link AND the label, tag terminal choices "(an ending)", and audit state-conditional
  links for the case where a benign one turns terminal (e.g. once `$sealed`). A bad end is an
  informed choice, never a gotcha. Dedicated snare rooms already model this; the lure beside the link
  is the warning.
- Modular: **one `.twee` file per layer** going forward (`src/layerN-*.twee`).
- **Verify in the browser before claiming done** (compile + drive + zero console
  errors); report failures honestly with output.
- Dense, observational **commit messages** (the owner reads them like papers): per-item
  tables, the why, verification numbers.
- Keep `docs/MAP-ARCHITECTURE.md` updated when you add/relink rooms.

---

## 9. Backlog / where to go next

> **▶ For a scannable, prioritized list of just the UNFINISHED work, see [`docs/BACKLOG.md`](BACKLOG.md)**
> (digest of every "Open from this arc" note below, plus the standing debts). The sections below remain the
> authoritative per-arc history + how it was built/verified.

**✅ THE MAP IS STRUCTURALLY COMPLETE.** All 9 layers are built to the ~20-room template
(220 passages), each in its own `layerN-*.twee` file; the full descent/ascent is
traversable; the **Sigil meta-puzzle is complete and wired** (3 fragments → `EndingUnbound`
at the Hellmouth). The remaining work is *enrichment*, not structure.

> **▶ THE VICES — THE ADDICTION LEDGER + SEWER-BREW ✅ 2026-07-20** (the **twentieth letter**,
> local-only). Owner frame, offered in a dreaming exchange and greenlit: *every transform class should
> have a corrupting FOOD, and the deep should keep score of your vices.* Two things shipped.
> **(1) A general addiction ledger.** `$addiction` (`{id: intensity}`) + `$addictionTop`, registry
> `setup.ADDICTIONS`. THE RULE (owner): all vices are tallied, but **you only feel the CALL of the
> strongest** — `setup.craving()` returns the dominant vice past its nag floor, and every craving
> ENCOUNTER gates on it, so **exactly the loudest addiction ever nags** (competing addictions fail
> gracefully — never two calls at once). A rival seizes the call **only by strictly EXCEEDING** the
> reigning tally (`setup.feedAddiction`; ties keep the incumbent) — the owner's *"spam it over ... if
> you needed to"* made a real, paid lever: a player being COMPELLED by the cheese (auto-eats past
> mostly-rat) can **drown it under brew** and trade the rat doom-spiral for a booze habit. The old
> `ratcraving`/`$cheeseTasted` cheese hook was **folded in** as the first tenant (weight now reads
> `craving()==="cheese"`). **(2) Sewer-brew — the filth food.** `setup.drinkBrew` (bait: a little
> vigor + mana; cost: `filth` into the gut, deeper the filthier you are), sold at the `HellTavern` taps
> for 3 coin (distinct from the barkeep's **free** pig belonging-cup). Its con is **THE DRINKING
> CONTEST** (`setup.drinkingContest`, new passage `TheDrinkingContest`): an *easy CON check* with an
> **inverted** payoff — **winning** takes the purse AND the big dose (brew rules you fastest), **losing**
> is one measure and no coin. The better you hold your drink, the harder you are hooked; the coin is
> bait. **EV-verified a sucker's game, not a coin faucet** (worse coin/corruption than honest bar-work;
> `contestOffered()` closes it once you're mostly-filth so it can't be farmed — `scratchpad/contest-ev.md`,
> COMBAT.md → *The drinking contest*). Brew's craving is the **DRY SHAKES** (`brewwithdrawal`, follows you
> anywhere — the still is a place you can't carry): below the compel floor you ache and walk on clean,
> above it the body gnaws itself (`setup.brewPang`). Migration: `setup.healAddiction` seeds the ledger +
> cheese from legacy `$cheeseTasted`. Verified in-browser: the cheese↔brew dominance flip (spam-to-
> override + loser silenced), brew purchase, contest **win & lose** (die-stubbed), withdrawal compelled &
> clean, self-heal; build green (**239 passages**); zero console. Full spec: **TRANSFORMATION.md → *The
> vices*** + **COMBAT.md → *The drinking contest*.**
> **↳ THE STILL ✅ (same session, 2026-07-20)** — the filth **JOB**, first cell of the matrix's other
> half, and the payoff of this letter's own forward-dream (*"build the jobs, and make each one pour you a
> drink"*). New L6 room `TheStill` (depthOf 6) off `TheBackAlleys`' wet stair (paying off the alley-hand's
> *"down's where it all ends up"*). `setup.stillShift(mode)`: *light*/*hard* pay meager coin (`STILL_WAGE`,
> below the bar — *a still is not a bank*) for `filth`; the standing offer is the owner's **payment-in-kind**
> — *take your wage in the drink* (a `drinkBrew(2)` ration), so the still pays you in what it makes.
> **Labour corrupts the BODY** (`filth`); only the **in-kind wage feeds the brew VICE** (dominance →
> withdrawal) — the two vectors kept distinct, the spiral made literal (*"you start taking your wage in
> the barrel, and one day you are the barrel"*). A stillman lore one-shot (`$stillmanHeard`) spells the
> offer out. Verified in-browser: all three tiers (light +3f/+1c · hard +5f/+5c · in-kind +12f total / 0
> coin / brew→dominant + "loudest thing" line), lore one-shot, wet-stair reachability; build green (240
> passages, L6 27/27); zero console. Matches the tavern bar-work (voluntary room-job, **no** `passTime`).
> **↳ THE PENS ✅ (same session, 2026-07-20)** — pig's FOOD + a fattening CAPTURE, and (with the pig JOB
> already extant — the `TheBirthingDens` dens-work + the vats + the freakshow) the **pig column complete**.
> Built ONTO the Belly's own harvest lore (grep-the-tree): the Breeder already said *"you'll keep, a while
> … rushing spoils the meat"* and the dens already had a slop-trough for the farrow — the pens are the
> fattening stage that promise set up. New L7 rooms `TheHolding` (off `TheBirthingDens`) + `TheHoldingKept`.
> **Pig-slop** is a fourth ledger tenant (`setup.ADDICTIONS.slop`, pig): `setup.eatSlop` heals (the cheapest
> calories in hell) and works pig into a **random** seg — so slop *alone* can reach the compulsion, unlike
> the gut-only brew; `slopcraving` forages the pig band (`d≥5`) once tasted and **compels** at `pigLimbs≥3`.
> THE CAPTURE: cross the trough mostly-pig and the pen-boars pen you — `pennedFatten` (heavy pig ×2–3 segs,
> half vigor; a full turn tips `EndingBecome`); the compelled room still grants a **last flee**. Verified
> in-browser: eat (+4 vigor / 6 pig random-seg / slop→dominant), craving 0→3 pig-band / 0 at L1, compelled
> branch (no-eat, drift + flee), the capture (+18 pig / half vigor / claw-out), dens↔pens link; build green
> (242 passages, L7 28/28); zero console. Full spec: TRANSFORMATION.md → *The Pens*.
> **↳ THE CURDWORKS ✅ — THE MATRIX IS COMPLETE (same session, 2026-07-20)** — rat's JOB, the last cell, the
> twin of the still, and the full realization of the twentieth letter's own forward-dream (*"build the jobs,
> and make each one pour you a drink"*). New L1 room `TheCurdworks`, spur off `TheLarder` (the rat FOOD
> faucet — food + job grouped, as the pens sit by the dens and the still behind the tavern). The rats *cure*
> the fallen pallet (cave-aging / washed rinds / the casu-marzu **crawl** the curers are proud of).
> `setup.cheeseShift(mode)` mirrors `stillShift` exactly: light/hard pay meager coin (`CHEESE_WAGE`, below
> topside) for `rat`; the in-kind wage is **a wheel** (`setup.eatCheese`) — labour marks the body, only the
> wheel feeds the cheese vice (payment-in-kind). A curd-master lore one-shot (`$curdmasterHeard`). Verified
> in-browser: light (+4 rat / +1 coin / cheese 0) · hard (+5 rat / +3 coin / cheese 0) · in-kind (+9 rat
> total / +6 vigor / wheel feeds cheese→dominant + arms the ratcraving / +1 coin, "loudest thing" line),
> lore one-shot, Larder↔curdworks link; build green (243 passages, L1 23/23); zero console. **THE FOOD×CLASS
> MATRIX IS CLOSED:** rat = cheese (`TheLarder`) + curdworks (`TheCurdworks`); pig = slop (`TheHolding`, +
> butcher/confectioner) + pens/dens/vats; filth = brew (`HellTavern`) + still (`TheStill`). Three jobs, one
> shape — *poor in coin, paid in the vice they make*. Full spec: TRANSFORMATION.md → *The Curdworks*.
> **↳ THE SMOKE CLASS — PHASE 0 ✅ 2026-07-20** (the **twenty-second letter**; the back-alley glowing
> smoke, which the last note flagged as a one-liner, instead became the **fourth nature**). Owner:
> *"lets work on that smoke class."* Built the recommended Phase 0 of `HANDOFF-SMOKE-CREATURES.md`
> (`filth`-class, zero body-model change): the **shadow-person** + **smoke-wisp** enemies (`setup.enemies`,
> `chorus` `ENEMY_MOVES`), the **smoke vice** `setup.drawSmoke` (the ledger's **fourth** tenant — the one
> that **DIFFUSES**: a thin film across 3 segs, no limb turns, pure loss no build) + `smokecraving`, and
> the room **`TheGuttering`**/`…Cleared` off `TheStill`. It also delivered a **new general combat axis —
> IDENTITY DAMAGE** (`idmg`/`idmgFlavor` on any enemy; `setup.identityHit` + `enemyTurn` hook): corruption
> on every landed hit (guard halves, crit doubles), so **winning finally costs your self** — closing the
> hole where a strong player stayed clean by never losing. The **scatter-toll** (`setup.scatterToll`)
> guarantees a won fight still costs you ("you can't kill smoke, only breathe it"), since in-fight idmg
> alone vanishes in a fast win. Science web-verified before prose (ignis fatuus cool not hot; opium =
> detachment not courage; siphonophore "we"). Live-sim balance: won fight ~1.3 meter (fast/equipped) →
> ~3.1 (fists/L1), bounded near a loss. Build green (**245 passages**, L6 29/29); driven to zero console
> (drawSmoke diffuse, the arbitration flip incl. smoke, the chorus taking two segs, the toll readout).
> Full spec: `HANDOFF-SMOKE-CREATURES.md` (Phase 0 = DONE) + `docs/COMBAT.md` → *Identity damage*.
> **↳ Open (owner's call for Phases 1–3):** *play it, then decide fork 5.3* (plurality-as-mechanic — a
> real 4th body key vs. a rich `filth`-variant). Cheap Phase-0 follow-ons (no fork): a `shadowperson`
> portrait + `guttering` room art (calls wired); more `idmg` carriers (L8 tallow-smoke, a spore thing).
> **↳ Player-side identity damage ✅ (same day, 2026-07-20 — the fork-free follow-on):** weapon `taint`
> `{cls,amt,line}` corrupts the WIELDER per blow (`setup.weaponTaint`, in playerStrike + doSpecial-once-
> per-action; the `hungry_knife` delivers its long-promised "feeds on the part of you that could still
> wash clean"), + `setup.identityResist` (a turned body shrugs off more of the same — the smoke fight's
> build answer; fresh SINGULAR body pays full, filth-turned pays less; threaded through identityHit +
> scatterToll + weaponTaint). Verified in-browser (taint lands + narrates in the live combat log;
> 4-filth-limbs → resist 2 → knife taint & shadowperson idmg both 2→1; doSpecial taints once not per hit);
> zero console. Still cheap-open: a **smoke/tallow tainted WEAPON** in the fuming band (loop-closer),
> **armor/mark** idmg-resistance. Also still: addiction **decay** (monotonic); the voluntary-room-job
> `passTime` consistency call.
>
> **▶ THE THIRD LEDGER — THE SHORT-WEIGHT MEN ✅ 2026-07-03** (the **nineteenth letter**;
> commit `6360cca`, local-only). Owner idea, offered in a dreaming exchange and greenlit:
> *the denizens keep score.* The deep now keeps **three books** on you — regard reads what
> you ARE (the body), the blood ledger reads what you DID (the kills, R17), and the
> **short-weight men** read what you CHOSE NEVER TO BE: the ability you dumped at creation,
> the unlocked door you walk past in every life. A grey opportunist weighs you, finds you
> short in one pan, and tests your **weakest** stat — `setup.statCheck(dumpStat(), 10)`,
> never a fair roll; fail-forward always (coin / corruption / a shove / an ambush). Two
> teeth: the **fresh −2 rides the check** (the deep hunts the unhardened hardest — a fresh
> WIS-2 body rolled a 14 and still failed), and the **encounter weight scales with
> `statSpread()`** so a flat *seven-all-round* build is grey and never hunted while a
> min-maxer paints a target — creation's spread is finally a real **risk curve**. Six faces
> (STR leaner · DEX flicker · CON breather · INT sharp · CHA shunner · WIS lurker), prose in
> `setup.SHORTWEIGHT`. **WIS is the outlier and closes review R9: an AMBUSH** — a passive
> sense check on a safe-seeming heap; fail = the fight opens with the enemy having *already
> hit you* (`setup.ambushFight` runs one free `enemyTurn` before Combat renders). Ride-alongs:
> **CHA finally costs something** (the creation screen literally said it did "little down
> here yet"); the WIS creation promise ("smells a wrong thing coming") is now true; and
> `statCheck` got **R7's fingerprint** (`setup.lastCheck` + `setup.checkMargin()`, boolean
> return intact) plus six new fail-forward consumers where there was one. New passage
> `ShortWeightDone` (no depthOf, excluded from the encounter re-roll); enemy `shortweight`
> (statLevel 4 hd 2, sim 97–100% vs an equipped L1 — the free turn is the sting, not a kill).
> Verified in-browser across all six faces + both ambush paths + the 0-coin shove fallback;
> build green (238 passages); zero new console. Full spec: **COMBAT.md → "The short-weight
> men — the third ledger."** *(This was a NEW owner idea, not a review item — but it lands
> squarely in the world-remembers theme and discharged R9 + part of R7 + the CHA-wakes debt
> as ride-alongs.)*
>
> **↳ Corruption OVERFLOW (owner, same day — `005e9c3`).** *"If corruption reaches max for one
> of the limbs the corruption should try and pick a new target."* It didn't: `setup.corrupt`
> clamped a maxed segment back to 100 and **wasted** the excess. Now it fills to the cap and
> **cascades** the overflow to a fresh limb (`setup._applyOne` returns the excess;
> `setup._spillTarget` prefers a limb already carrying that class → a body turns coherently
> class-by-class, else a random new limb; loop guarded at `SEGMENTS.length`). The feed narrates
> **every** hop that crosses a stage (`setup.lastChangeSpills`, drained by `pushChange` via the
> new shared `setup._queueBeat`) — a big hit that maxes one limb and floods the next shows both.
> Applies to ALL corruption sources. Doc: **TRANSFORMATION.md** → thresholds. Verified unit +
> feed, zero console.
>
> **↳ Rat-run CAPTURE scene (owner, same day — `62dbbf1`).** *"The rat run has no special loss
> scene if you are captured."* Right — every loss ran the one generic `CombatLost` (maul →
> marched to a **work shift**), which read wrong for a den whose prose foreshadows being *taken*.
> New `setup.CAPTURE_SCENE` (keyed by `$combatOrigin`) overrides the generic press-gang **tail**
> with a bespoke capture beat + destination (shared maul/taint/coins top still runs; work-curse
> binding still wins above it). Rat den, directional: lose in **TheRatRun** → dragged *deeper* to
> `TheRatKing`; lose at **TheRatKing** → handled, marked, spilled *back out* to `TheRatRun`
> (*"a postponement, not a pardon"*). **Extensible** — one entry per den that takes rather than
> employs (the kappa drowning, the gorger's gullet are natural next ones). Doc: **COMBAT.md** →
> "Losing a fight." Verified all four paths (both captures + work-curse override + non-registry
> regression), zero console.

> **▶ RPG-CANON REVIEW → TRUST PASS ✅ → SEAL ECONOMY ✅ → THE COMBAT CHAIN ✅ → WORLD-REMEMBERS (in
> progress) — 2026-07-01/02** (the **sixteenth–eighteenth letters**; commits `af12323` review, trust
> pass `1d38f7e` `ff5bac6` `e6bb99d` `1c08a02` `a6e308a` `778462b` `1084017` (R4 closes it), seal
> economy `ff19db7` (R10+C1), combat chain `acb5e4e` (R12) `4bbc9a3` (R13) `c93030c` (R14) `5baabe5`
> (R15) `7f6fb7c` (R16) `f06df81` (C2, closes it), world-remembers `2f99b78` (R17), all local-only). The owner asked for a design review of the game
> against the well-documented D&D/CRPG canon — creation, exploration, talk, fight, loot, inventory,
> buy/sell — hunting the low-hanging fruit decades of reimplementations imply, EXCLUDING what this file
> already tracks. Delivered as **`docs/REVIEW-RPG-CANON.md`**: **32 verified findings**, from a
> multi-agent workflow (9 subsystem reviewers over the real source → merge/rank → one adversarial
> verifier per finding, each told to REFUTE — 0 of 28 refuted → a completeness critic). **That doc is
> the live per-finding tracker** (each carries SHIPPED / DECLINED / open + file:line pointers) — read it
> before picking up review work. **Meta-finding: the engine is ahead of the content** — the recurring
> gap is unwired plumbing prior arcs paid for (`statCheck` with ONE consumer, `canSpeak` with zero, pack
> combat with one pack in 26 fights, ~41 item `desc`s that render once).
>
> **Shipped — the "trust / honesty" cluster** (tell the player the truth; agency-loss lands harder as a
> KNOWN, chosen risk than a UI gotcha):
> - **R3 restart warning** (`1d38f7e`) — the sidebar Restart wipes the whole cross-life ledger; owner
>   confirmed that is INTENTIONAL (the one true fresh start), so it got a low-key `#menu-item-restart::before`
>   note ("Reaching an ending and going again keeps your marks; this button alone clears them"), NOT a
>   behaviour change.
> - **R1 rewind arrows — DECLINED** (`ff5bac6`) — owner keeps SugarCube's back/forward undo:
>   *"save-scumming is always an option; be respectful of the player's time."* **Do not re-file this.**
>   The thesis lives in the fiction/systems, not in stripping player conveniences (memory:
>   `feedback_player_time_over_thesis_purity`).
> - **R2 the belonging clock made legible — as a settling MIND** (`e6bb99d` + follow-up `1c08a02`) —
>   `$deepTurns`/`$sealed` was an invisible doom clock, silent in L5–9 where it runs fastest. Surfaced
>   (owner reframe, better than the review's navigation framing) as the mind getting COMFORTABLE in the
>   dark/the form — *comfort is the corruption*, same revulsion→accept→relish arc as scent. A persistent
>   `.seal-state` caption line + once-per-tier `.settle-line` beats (`setup.sealTier` / `SEAL_MIND`,
>   script block). **Follow-up: the clock RESETS when your dominant form changes** (rat→pig via
>   `setup.bodyClass().cls`) — the settling undoes (`$deepTurns`→`SEAL_RESET_TO`, un-seal, a
>   `.settle-switch` un-settling beat); self-limiting (a switch costs corruption). **Engine lesson baked
>   in:** `<<goto>>` does NOT abort the rest of PassageHeader, so a beat rendered after the encounter roll
>   is discarded while its state advances (permanent loss for settling beats) — so the belonging block
>   sits BEFORE the encounter roll and a fired beat suppresses that move's encounter (`_sealBeat`).
> - **R21 coinrot routing bug** (`a6e308a`) — `setup.gainCoins` exists so the coin-curdling curse can
>   intercept income, but 14 payout points (the wheel, the bones, 12 wage/find sites) paid bare
>   `V.coins +=` / `$coins +`, so a cursed player kept full wages. All 14 routed; each payline now
>   branches on the amount KEPT (0 → a curdle beat). Straight bug — the routing comment had lied.
> - **R5 informed character creation** (`778462b`) — the permanent cross-life build was set on pure
>   flavour; now each stat carries a mechanical `does` clause, a live vigour preview sits above Begin
>   (CON 1 = "1 vigour — barely a body"), and dumping any stat ≤4 triggers a warn→Yes confirm (per §8c,
>   "an informed choice, never a gotcha").
>
> - **R4 tolls priced in the real currency** (2026-07-02) — closes the trust pass. Eleven pay-with-yourself
>   links said "(+20 corruption)" (a dead number: one segment bucket, meter moves a sixth of it, nothing
>   about what you'd become or whether the part would FINISH). Now `setup.tollTag(seg,cls,amt)` (script
>   block) renders *"pays 20 pig into your torso"* in the bodymap's own words, escalating *"— enough to
>   turn it for good"* at `segTotal+amt >= 100` and *"— turned already; it scarcely matters now"* past it;
>   mirrors `corrupt()`'s `always_class` curse resolution (a cursed toll honestly reads the forced class).
>   The label is STATE-AWARE — the same knife escalates as your torso fills. All 11 links converted
>   (computed labels, bodies untouched; label==landing verified in-browser); the layer9/layer4 prose
>   price-previews aligned; the Cutter's graft labels retrofitted; the L1 Pryer (posted NO price for a
>   14-rat graft) now posts its price too. **The trust/honesty cluster is COMPLETE.**
> - **R10+C1 the seal economy — time costs belonging** (2026-07-02) — the clock only charged *moving*;
>   sleeping, working, gambling and leveling were all clock-free while the fiction said "staying makes
>   you belong." Now: `setup.passTime(rooms)` (rooms × current depth, same seal check — a wheel-spin at
>   438 seals at 444 and R2's tier-3 beat + caption fire on the next move, zero extra wiring) charged by
>   the 9 rest rooms (`REST_TIME 4`, ONLY when the heal heals — full-vigor walk-throughs stay free
>   corridors), all three shift paths (`SHIFT_TIME 2`), and the wheel/bones (`GAMBLE_TIME 1`);
>   `LEVEL_SEAL 15` booked per level in gainXP (flat — CombatVictory is depth 0) with a ledger sentence
>   in the level-up prose. **SEAL_LIMIT 360→440, SEAL_WARN 260**: the audit floor had grown 183→223
>   under the old number (360 had quietly shrunk to 1.6× floor); 440 = floor 223 + real-run 312–379 +
>   lessons + a rest, while a double-descent re-diver (~446 moves alone) still seals. Re-audited green
>   (49% headroom). **The seal-economy cluster is COMPLETE.**
> - **R12 signature moves — every monster fights like what it is** (2026-07-02) — one AI (a weapon-die
>   hit per round forever) made Guard a dominated button. Now all 11 species carry a `move:`
>   (registry → `setup.ENEMY_MOVES`, script block): **telegraph-then-payoff** — the wind-up spends its
>   attack (card shows *"— gathering itself —"*), the payoff auto-lands next round unless answered:
>   Guard blunts it, a stun cancels it, Run leaves first. Several take agency ON the turn: engulf
>   (menu collapses to *Wrench yourself free*), grapple/coil/pullunder (Run reads *"held fast"*),
>   the sty-hand's drag (a landed drag CLAIMS you for the shift — `$workOwed` + station). Gorger
>   gulp heals itself the wound's worth; rat squeal grows the pack (cap 4); pig-demon gore is the
>   Guard test (double dice unguarded, quartered braced). Per-move + UI-cycle verified in-browser;
>   `combat-sim.mjs` disclaims moves in-file; spec in `docs/COMBAT.md` → "Signature moves".
> - **R13 the crit-smear — winning is no longer sterile** (2026-07-02) — corruption flowed only on
>   loss or casting. Now an enemy crit smears `CRIT_SMEAR 2` of its class into a random segment,
>   named in R4's currency ("2 into your R-arm"); **Guard halving a crit halves the smear** —
>   Guard's second job (verified: braced crit = half damage AND a 1-point smear).
> - **R14 the threat-read — smell the thing before you commit** (2026-07-02) — the canon "con"
>   check through the game's own channel (you smelled rooms, the world smelled you; the thing in
>   front of you was the one thing your nose skipped, and the curve's bottom — fresh L1 vs
>   pig-demon 7% — hit like a gotcha). `setup.threatRead(spec)` (script block): pack
>   statLevel+2×hd (strongest full, rest half) shifted by nature-vs-your-tool (weakTo/resists,
>   weakTypes/resistTypes ∓2, boss +2) against 3×level + weapon-die max → 4 rungs (0/−6/−8),
>   4 sing/plural prose reads, surfaced by `<<scentof>>` in the room-scent band voice (rung 3 =
>   new rust-red `.rs-dread`). Calibrated off the sim and verified in-browser column-by-column
>   (kappa 1/65%, drowned 2/28%, golem-with-sword 2/22% but golem-with-golembreaker 0 — the
>   affinity shows); rolled out at 22 gate sites + 3 encounter arms (`<<scentof _den>>` handles
>   the pack array; plural verified at the CleanPool pair); Bathhouse failed-bow arm skipped on
>   purpose (no choice left to inform). Convention for new fights in `docs/COMBAT.md`: a
>   declinable startFight link gets a read above it. Sim header now warns its numbers are
>   consumed by the rungs. Bonus: a stale R4 miss fixed en route (the L8 conveyor steam preview
>   still said "+18 corruption"; now "18 filth into your torso").
> - **R15 packs — the machinery built for many gets its many** (2026-07-02) — the aim UI /
>   sweep-cleave / mixed-marking plumbing had ONE consumer in 26 callsites. Five set-pieces
>   converted (prose beat for the second body + scentof retargeted at the pack + lander
>   acknowledges every corpse): RatKing `["ratman","rat","rat"]`, **Sty `["pigdemon","grafted"]`
>   cross-class**, Pits `["gorger","grafted"]`, DeepWell `["glut","shitgolem"]`,
>   **SumpGalleries `["ratman","drowned"]` cross-class**. `loseFight` returns `clsSet` (classes
>   that actually LANDED); CombatLost's new mixed branch speaks the thesis ("not one nature but
>   several… they pool"). `denizenPack` mixes on the hinge floors (d4 35% drowned+ratman, d7 25%
>   pigdemon+grafted; rates sampled in-browser). Balance rides R14 — the packs arrive pre-labeled
>   by the scent-read. RatKing driven end-to-end; mixed-loss branch driven both ways.
> - **R16 parley — the middle path** (2026-07-02) — Surrender was all-or-nothing and `canSpeak`
>   had ZERO consumers. Now **Yield** sits beside Surrender: gated on the voice (the silver
>   muzzle's first mechanical bite — *"Yield — your voice will not come"*), a submenu that
>   telegraphs `packListens()` BEFORE the round is spent (minded kinds only: ratman/kappa/
>   gorger/pigdemon/sty-hand — the toll-takers of the forks, canon-consistent), two offers:
>   the purse (loseFight's robbery formula, voluntary, walk out unmauled) or the shift
>   (`pressGangTo`; work-cursed → reeled to your own post). Deaf pack = a telegraphed wasted
>   round. New `CombatYielded` lander (237th passage). The price ladder: win > yield coin >
>   yield labour > lose. All four paths driven in-browser; §5's combat row corrected.
> - **C2 morale — hell gets self-preservation; the chain closes** (2026-07-02) —
>   `setup.moraleCheck` in enemyTurn: badly hurt (wounded AND ≤⅓ hp — a pristine 1-hp rat is
>   NOT hurt, caught by rate-sampling) or a packmate fallen → ONE weigh per fight: d20+statLevel
>   vs DC 8 + 2×turned limbs + 2×pack deaths. Broken → flees paying NOTHING (spoils/drops skip
>   the fled; an all-fled victory gets its nothing-to-strip beat); bosses + sty-hand immune;
>   held checks silent. **Regard inside combat**: the more turned you are, the more hell's own
>   creatures refuse to finish the argument. **Engine rule bought by the seam it exposed:** the
>   enemy phase can now END a fight, so all six enemyTurn callers (Guard/Items/Wrench/failed-Run/
>   deaf-Yield×2) run the full outcome tri-check — never bare `$hp` (two rats broke under Guard
>   and the screen sat there until fixed). **Chain-closing pass run:** sim matches the R14
>   calibration within noise; clean-run floor 223 / 49% headroom unchanged.
>
> **Shipped — the world-remembers tier (opened 2026-07-02; owner greenlit the judgment-ready list):**
> - **R17 the blood ledger** (`2f99b78`) — victory finally leaves residue. `$blood {rat,pig,filth}`
>   tallied by `setup.tallyBlood()` at the top of CombatVictory (one funnel, set-pieces free; FLED
>   enemies NOT tallied — a broken enemy takes nothing of you with it, in both directions). Cost as
>   **regard/attention, never meter points** (clean-run floor 223/49% re-verified; regard-probe
>   clean). `BLOOD_FELT 3`: kin smell it — kinhelp kindness CURDLES (a shown beat, no coin/heal),
>   the backtowork kin-claim pass closes (the *withered welcome*), morale DC +2 vs that class
>   (verified 20%→30%; a kin-slayer sees more flights = less reward). `BLOOD_FEARED 5`: the floor
>   stops offering labour — backtowork becomes *the reckoning* (go-quietly withdrawn), pigpress/
>   vatpress poach offers withdrawn (pig/filth). The `$workCursed` **binding-reel stays reachable
>   at any blood** (driven: "Stand on the binding" → TheCageAct, shift owed) — a ledger has no
>   nose. Doc: COMBAT.md → "The blood ledger"; sim header honesty note updated.
>
> Everything else worth doing is ranked in
> `REVIEW-RPG-CANON.md` §7 — combat cluster ✅; world-remembers is OPEN: next up **R18 quest atom**,
> then R6 marks ledger, R20 journal (R19 deed-topics rides with them; R22 desc migration is the
> hard prerequisite for R23/R24 commerce). **Emergent same-day options (2026-07-03, see the top arc
> blocks):** more **capture scenes** for dens that take rather than employ (`setup.CAPTURE_SCENE` —
> the kappa drowning, the gorger's gullet), and the short-weights' forward dream — a **cross-life
> memory** so a returner meets the clerk that has weighed the same hole in a hundred lives.
> **Owner-parked items (2026-07-02, asked & answered):** the CHA *bargain* arc (a bargain that
> SPENDS a high CHA — distinct from the shunner that now reads a low one; R9 WIS register-depth
> behind it), cleanse-point tuning (the "must escape mandate the full L9 round-trip?" call), R23's
> phial-of-rain (soothe economy), and the named-demon re-theme — hold for owner input; everything
> else on the review is greenlit best-judgment.
> **Verification held all session:** every change built green (238 passages), driven in-browser via
> `window.SugarCube.*` with staged state, zero console; dense local commits as `StonePhilosopher`;
> nothing pushed.
> **⚠ Preview-browser gotcha (2026-07-02, cost a diagnostic detour):** the preview tab now opens
> HIDDEN → viewport width 0 → SugarCube's boot spins forever on `$window.width()` ("Loading…",
> empty setup, no errors). Fix: `preview_resize` with EXPLICIT width/height (the desktop preset
> resets to native = 0) **after every reload/Engine.restart()**. Never kick `Engine.start()` by
> hand — it skips StoryInit and poisons the session store (recover: `session.delete('state')` +
> restart + resize). Screenshots time out while the tab is hidden — verify via DOM/state evals.

> **▶ PROSE PASS — every room to three exploring paragraphs — ✅ COMPLETE 2026-06-26** (the
> **twelfth letter**; commits `29348bd`→`b141c38`→`8ea20f1`, local-only). The owner asked the room
> descriptions bumped to ~3 paragraphs and to "feel like the reader is exploring the space — the rooms
> may reveal themselves as you move through them." **117 thin room-scenes** across all 9 layers (+ the
> kidnap intro `Captured`) grown from 1–2 static blocks into a three-beat **unfold**: doorway → moving
> in → deeper register. **Machinery (reuse it):** **`tools/prose-guard.mjs`** proves a prose-only pass
> touched ZERO logic-bearing markup (every macro/link/NPC `<<linkreplace>>`/header byte-identical to
> HEAD — a compile can't catch a dropped-but-still-compiling macro; standalone `<<nobr>>`/`<<silently>>`
> formatting tags are exempt). The harness was **expand (one agent per layer) → markup-guard →
> adversarial critique (one skeptic per layer) → repair**; the critique caught 3 block defects the guard
> can't see — `Maintenance` leaking its own escape-puzzle + contradicting its `$sealed`/no-rope branches,
> `TheRatRun` pulling a later room's reveal into the scene, `TheAbscess`'s garbled sentence — all fixed,
> plus a polish round (de-duped echoes, a degendered Shambles entity, a pivoted `TheTally`, dropped a few
> mannered asterisks). **The lasting lesson, now HANDOFF §8: keep the voice LEAN.** A Conrad-inflected
> ornate rewrite of `TheRiverMouth` was tested and rightly rejected for the lean original — the transport
> the owner loves is STRUCTURAL (the doubled-time "telling that knows"), not ornate swell; compression
> beats pastiche; don't dress up *the thing told*. **Verified:** prose-guard 10/10 · build 233/233
> reachable · driven in-browser, zero console. **No new mechanics** (a prose session) — the "teeth" debts
> (regard-with-teeth, `statCheck` consumer, a mismatched body paying more) are exactly where the 10th/11th
> letters left them.
>
> **▶ NPC POPULATION — `docs/PROPOSAL-NPCS.md` + `docs/PROPOSAL-NPCS-VOICES.md` — ✅ COMPLETE
> 2026-06-26 (46/46).** The empty rooms now have **people.** **Functional NPCs** (clue/corrupt/
> flavor) + **the ambient damned** (Dante-style voiced souls — philosophical / blue-collar /
> liar-trickster), 46 across all 9 layers, each an inline `<<linkreplace>>` gated on a one-shot
> flag with a spent-revisit beat. This is the long-open **§D helpers-in-the-deep**, delivered. The
> eight **clue** NPCs fix a real discoverability gap (mechanics you could hard-stuck on —
> rope / bow / brand / Word / Glut-blunt / privy-Word / the 3rd fragment / the crust-bridge — now
> have in-world teachers planted *up-river* of the thing they unlock). **Machinery (reuse it, do not
> re-derive):** the **`sewer-demons-add-npc`** skill + **`tools/npc-probe.mjs`** (`node
> tools/npc-probe.mjs` → 46/46; validates room/flag/wiring, exits 1 on a real bug) +
> `tools/npc-manifest.json`. **The trickster rule is POLICY** (`…-VOICES.md` §2): a liar may lie about
> *itself* or **shill** a real local hazard (the wheel **Tout**) hiding its cost — but **never**
> force-route to a death and **never** point at the Clean Pool grace; every dangle resolves to
> nothing (verified in-browser, each trickster sets only its flag). **A missing teacher is not
> automatically a gap** — the Clean Pool cleanse stays un-taught ON PURPOSE (foreknowledge un-cleans
> it; PROPOSAL-NPCS §7). **Owner-side leftovers (optional):** the Gaff Mechanic's `$knowsTheGaff` is a
> belonging flag only — wiring it into `setup.spinWheel` for a real house-insider odds-edge is
> deferred engine work; the L7 Šulak ships as a flavor monologue (a composure/poise stat, if ever
> wanted, is a separate build). All `db6694d`→`9b5547b`, local-only.

> **▶ THE INT ARC — char creation · the arcane-bones game · low-intelligence dialog — ✅ COMPLETE
> 2026-06-27 (`ad2e885` + `9c31fcb` + `fb45e17` + `628a319` + `a5b680e`; the **fifteenth letter** closes it).**
> Three ideas the owner floated that were really **one arc** — now all three shipped, and the long-open
> **`statCheck` teeth debt** is paid: INT is the first ability the game changes, reads back, *and* lets you
> author. The arc is **author → stake → consequence** around ONE stat, the proving stat the way L2 was the
> proving layer — and the pattern now templates to any other stat (a STR ordeal, a CHA bargain, …). The
> three pieces:
> - **Character creation (assign base stats) — ✅ SHIPPED 2026-06-27 (`a5b680e`).** `:: CharacterCreation`
>   (the new StoryData start), framed as **"the before"** — *who were you, in the life they're about to drag
>   you under.* The player distributes the **default character's own point total** (budget = `6 ×
>   baseScore(1)` = **42**; all-sevens IS the default, so an untouched **Begin** = today's character,
>   backward-compatible) across the six abilities — **min 1** (INT 1 = the "simple" tier from room one),
>   **max `CC_MAX`** (14). Steppers + a "Still to place" counter + Begin gated on all-placed + an "even it
>   out" reset. **Engine** (`<<script>>` block): `setup.CC_STATS`/`ccDescribe`/`CC_MAX`, `setup.commitBuild`
>   (stores the spread as per-stat **deltas** from the default base in persistent `"build"`, re-heals to the
>   new CON-max, recomputes), `setup.hasBuild` (the screen redirects to `Start` if a build exists).
>   `playerScores` folds the build delta onto the **level-scaling** base (the spread grows: L2 = base 9 +
>   delta). **Persistence:** set ONCE, **carried across lives** (the marks then layer on top — *who you were*
>   vs *what the sewer made*); wiped only on a true fresh start (StoryInit no-carryover wipe +
>   `forgetMarks`, both now `forget("build")`); a death-restart auto-skips creation to the kidnap. **Verified
>   in-browser** (fresh→creation; default→Begin→default char; a fool build STR13/INT1 total-42 → isSimple at
>   `Start`; build scales by level; carried life skips). **Caveat:** spreads the `combat-sim` doesn't cover
>   (CON 1 ≈ 4-HP glass cannon); the 42-pt budget bounds spikes, but tuning extreme builds is a follow-up.
>   **Deferred polish:** the "base vs marks" split on the stat caption (show *who you were* / *what the sewer
>   made* separately) — envisioned, not built.
> - **Low-intelligence dialog (the owner's spec) — ✅ SHIPPED 2026-06-27 (`9c31fcb`).** The **mind register**:
>   `setup.mind()` → **dim / dull / sharp** by current INT (folds `$statMods` etc. via `$scores`); base 7 is
>   **dull** (the everyman, untouched), **dim** is INT ≤ 5 (`MIND_DIM_AT` — you gambled real ground away),
>   **sharp** ≥ 10 (`MIND_SHARP_AT`). Helpers `setup.isDim()` / `setup.isSharp()`. The owner's brief: *mostly
>   negative — mockery + severe misunderstanding — with one or two spots where being dim is the KEY.* Built as
>   `<<if setup.isDim()>>` **overlays on existing rooms** (the normal INT-7 path byte-untouched), clustered in
>   the L6 carnival where you gamble, so the consequence lands where you incurred it. **4 negative:** the
>   bone-man's won-livestock glance (`TheGutterBones`); the Fly reading your *emptied mind* not your corruption
>   (`TheFlyOnTheWall`); the wheel-tout giving up and pointing you at the children's games (`TheGames`); the
>   **Hellmouth inscription** confidently misread as animal claw-marks (`Hellmouth`, L5 — the
>   severe-misunderstanding beat). **2 inversions (dim is the key) — both target snares that hook the MIND:**
>   `TheHallOfMirrors` (the swap-bargain finds no mind to land in → you pass CLEAN where the clever eat 24
>   corruption, +5–9 coins flicked in contempt) and `TheFortuneTeller` (a future is a thing you hold in the
>   mind and you've too little to hold it → the foreknowledge-curse beads off, and she gives the one true thing
>   small enough to stick: the **way-out clue**, `$fortuneClue`, granted ONLY to the dim, where the clever pay
>   4 corruption to dig it out). Verified in-browser (every dim beat, the normal path intact, the snares
>   skipped, coins/clue set), zero console. **Deferred (optional, the deeper version):** degrading the *room
>   prose itself* at low INT — the three-paragraph **unfold** collapsing to one blunt block, vocabulary going
>   (the *valve* → *the round thing*), the "narration IS the mind" idea — a bigger pass than the owner's
>   reaction-beat spec; the prose pass left a rich baseline to degrade FROM, but it stays dreamed.
> - **Low-INT, deeper — the "simple" tier (INT 1) — ✅ SHIPPED 2026-06-27 (`fb45e17`).** Below "dim", at the
>   floor (`MIND_SIMPLE_AT` = 1, `setup.isSimple()`), the **articulate NPCs openly dumb-down and condescend**,
>   *replacing* their normal dialogue with small words "for your own good" — and the likelihood scales with the
>   **NPC's own intelligence** (a fly / appraiser / beadle talk down to you; a rat-man wouldn't notice). The
>   thresholds are **cumulative:** `isDim()` stays true in the simple range, so the dim reaction-beats still fire
>   underneath — a passage with both checks `isSimple` FIRST. Three NPCs done (normal path byte-untouched): the
>   **Fly** (talks small and kind, waives his own tip, the abstract clue goes out of you *"like water through a
>   grate"* — futile, does NOT set `$heardOfWord`, matching the inscription beat); the **beadle** (the lowest
>   thing in the place finally has something to feel bigger than → simplifies the escape-loop to *"Down. Shiny.
>   Up. Out."*, STILL functional, sets `$beadleHeard` — concrete instructions stick where the Fly's abstract one
>   doesn't); the **trinket-monger + appraiser** (pitches you like a child at a sweet-shop window; shop machinery
>   untouched). **The selection principle is documented in the engine comment** — future smart NPCs should follow
>   it, dumb ones don't (no formal NPC-INT attribute yet; hand-picked). **Reachability — now LIVE in normal play
>   (`628a319`):** the bones' witless ending was changed from a hard floor to an EVENT (see the bones bullet), so
>   you can now gamble down to INT 1 and survive — this tier is reachable by play, not just by future
>   char-creation. (`setup.mind()` gained the `"simple"` tier; `setup.isSharp()` still has only the bones' appraise
>   check as a consumer.)
> - **The arcane-bones game (carnival INT-gamble) — ✅ SHIPPED 2026-06-27 (`ad2e885`).** `TheGutterBones`
>   (L6, off `TheGames`): you crouch in the gutter and throw a quiet bone-man's **arcane `d12`** — no pitch,
>   because the odds are chalked on the kerb in the open. The table (the published board IS the rig, by
>   design): **1:** −3 INT · **2–5:** −1 · **6–7:** nothing · **8:** +10 coins · **9–11:** +1 · **12:** +3.
>   The −1 band (4 faces) outweighs the +1 (3), so **EV = −1/12 INT/throw** (a slow bleed); the lone coin
>   face is the counterweight (**≈+0.83 coin/throw**) — the bones **price a wit at exactly 10 coins**. **Free
>   to throw** (coins only come OUT; your mind is the only stake). Engine: **`setup.castBones` / `BONES_TABLE`
>   / `BONES_PRICE`=10 / `WITLESS_INT`=3** (sewer-demons.twee). **The reusable win:** a NEW **`$statMods`**
>   in-life acquired-stat-delta channel, folded into `setup.playerScores` after marks/forms/equipment (before
>   the floor-at-1), **reset each life** by StoryInit — the **first** way the game changes a stat mid-life
>   (base was flat; only marks/forms/gear differed). `recomputePlayer()` after each cast → the side-panel INT
>   drops live. **`statCheck`'s first non-combat consumer:** the in-room **appraise** INT check (DC 11) — a
>   sharp head reads the rig (*"ten coins a wit, the gutter always collects"*) and can walk; a dull one just
>   sees coins. **Floor with teeth — an EVENT, not a hard threshold (`628a319`):** you can ride the bones down to
>   INT 1 and LIVE (this is what makes the dim + simple tiers reachable in play — walk away, roam witless, even
>   climb back); the gutter only KEEPS you (`EndingWitless`) when, already at the floor (`intBefore < WITLESS_INT`,
>   i.e. INT 1–2), the **ruin** comes up (face 1, "the bones take three") for wits you no longer have — ~1/12 per
>   throw down there. Telegraphed: the in-room warning splits (the ruin-warning at INT < 3, a milder one at 3–6). Verified:
>   build 235 passages · L6 26/26 · driven in-browser (every face band via stubbed `d12`, live INT fold,
>   floor-at-1, the witless ending via the link, appraise pass/fail) · zero console. **Deferred (optional):**
>   physically **loaded bones** (a hidden second rig revealed by an INT/WIS check) — not load-bearing now the
>   numbers carry it; the coin payout (10) is a tuning dial; the bone-man could earn a portrait + a real name.
> - **Arc complete (`a5b680e`, 2026-06-27).** Built in the reverse of play order — consequence (low-INT
>   dialog) → stake (the bones) → authorship (char creation) — so each piece landed with the next already
>   meaning something. The loop now closes on itself: **author → stake → consequence**, the first stat fully
>   alive, the lowest tier reachable **three ways** (gamble the bones to the floor, or build a fool). The same
>   shape is now a **template** for the other inert stats (CHA is still combat-only; a bargain that finally
>   spends it is the obvious next). **Open follow-ups** (small): the **base-vs-marks** caption split (show *who
>   you were* / *what the sewer made* separately); `combat-sim` coverage for extreme builds; the `sharp` tier
>   still has only the bones' appraise check as a consumer. ("Dream then reconcile" — `feedback_dream_then_reconcile`.)
>
> **▶ START HERE (active phase): `docs/DIRECTION-HELLMOUTH-ARRIVALS-WORK.md`** —
> ~~**§A collapse the Hellmouth to ~3 locations**~~ ✅ **DONE 2026-06-05** (sewer outside flowing
> in; stairs at the back of the throat; 20 rooms → Hellmouth/TheThroat/TheArrivals). ~~**§C the
> arrivals intro + Work-Curse**~~ ✅ **DONE 2026-06-05** (start in TheArrivals → sneak out or take
> the curse via TheIndenture → pick the L6 cage or L8 vats; cursed loss reels you back to your
> post owing a shift; carries between lives permanently). ~~**§B** the full per-species body-part
> descriptions~~ ✅ **DONE 2026-06-05** (the `setup.BODY_DESC` 48-string matrix; **first draft**,
> flagged for the owner's voice-pass). **STILL OPEN:** **§D** the helpers-in-the-deep (build *with*
> the corruption-tuning pass). ~~The standing prerequisite: nobody has audited a full clean run~~
> ✅ **CLEAN-RUN AUDIT DONE 2026-06-07** (`docs/AUDIT-CLEAN-RUN.md`, `tools/clean-run-path.mjs`) —
> it found the escape was **structurally impossible** (brand-route floor 183 deepTurns vs the old
> `SEAL_LIMIT` 200) and **fixed it** (seal 200→360, warning→`SEAL_WARN` 220). The clean path is
> **clock-bound, not corruption-bound** (0 corruption through the sewer band), so corruption-faucet
> tuning can now proceed against a measured baseline. Open follow-ups from the audit: hint the Clean
> Pool's blunt-weapon requirement; design call on whether escape *should* mandate the full L9 round-trip.
>
> **Clean Pool shipped (2026-06-05, owner mid-session):** the game had **no cleanse anywhere** — so
> a clean run was unauditable (corruption only ever rose). Added **the Clean Pool** (L2, off
> `TheRisers`): the **only way to reduce corruption** — a single-use clear pool you must *win* from
> converging shit-golems (win → wash/`soothe(30)`; lose/hang-back → fouled → drinking *raises*
> corruption). See `MAP-ARCHITECTURE.md` L2 roster. **This unblocks the clean-run audit** — with one
> cleanse now on the map, the careful-traversal measurement can finally mean something. (Owner will
> likely want *more* cleanse points later, tuned against the audit.)
>
> **▶ EQUIPMENT — `docs/DIRECTION-EQUIPMENT.md` — ✅ COMPLETE 2026-06-06 (all of §A–G).** The whole
> proposal shipped: the §F pipeline + the full weapon/armour/accessory **catalog**, **identification**
> (hidden-until-equipped), the **`Equipment`** management screen, the **shop** (smith/trinket/
> appraiser stalls in HellMarket) + **enemy drops** with the owner's **mismatch→curse** rule, and
> **cursed gear** that's non-removable + carries cross-life. Lint with **`tools/equip-check.mjs`**;
> tune numbers there + with `combat-sim.mjs`. **Owner-side leftovers only** (optional): a future
> **curse-removal NPC** (`setup.uncurse` stub is ready), **nospeak** retro-gating on demon-bargain
> links during the prose pass, and any deeper distribution placement (layer-gated finds / the wheel).
>
> **Prior phase — `docs/DIRECTION-NEXT.md` — all four DONE**: ~~level-up~~ (ef9b13e) ·
> ~~**per-segment corruption & transformation**~~ (**`docs/TRANSFORMATION.md`**) · ~~**carnival
> gambling**~~ (L6 `TheWheel` + the mouth-misspeak curse) · Rendering-Works-as-"filth made flesh"
> partly done (L8 class-tagged `filth`). Standing smaller threads: spend the `kin_*` marks, wire
> `limbPenalty`/the curse into more room checks, rat under-sourced (now also fed by losing to
> rat-things), the owner's final wheel copy.

> **▶ MAGIC + KAPPA + ART — ✅ SHIPPED 2026-06-18** (full session; see `docs/TO-THE-BUILDERS.md`
> seventh letter, `docs/COMBAT.md` → Magic, and the per-feature commits). **Magic ("the Word"):** a
> combat skill (a 7th action, Cast + spell menu) drawn off corruption — mana ceiling = magic-level×4
> + corruption/10, refuelled by addiction items (cheese), ~2× a weapon strike (sim-verified),
> corrupts caster (head, floor class) AND victim (AC sloughs); learned 3 ways (Cantor L1 / privy
> bog-roll grimoire L2 / Hellmouth arch L5, the last gated by `canReadInscription`); engine in the
> `<<script>>` block. **The kappa + the drowned bathhouse (L4 `TheBathhouse`):** bested by the
> **bow-duel** (`setup.composedEnoughToBow`, corruption < 50) or by force; either way the spilled
> dish cleanses you — the first **comportment-over-combat** resolution. **`vatpress`:** the kappa as
> the L8 vats press-gang (parallel to the sty-hand's `pigpress`). **The digger:** a non-combat
> frog-conscript NPC at `TheCinderfall` (L9) — the work-curse run to its end — who gives the
> burning-tree clue. **Standing rule:** choice-presentation (HANDOFF §8 + the `feedback_choice_presentation`
> memory, crossposted to Hellivator). **New skill:** `sewer-demons-illustrate-room` (room art via
> `<<roomart>>`). **Art wired:** kappa combat portrait + room illustrations (bathhouse/boilhouse/
> digger/Hellmouth woodcut). Bad-end sweep telegraphed the two sealed `EndingResident` "Search the
> wall" gotchas. **Open from this arc:** the kappa wants a vat-tender *variant* enemy (own art) + a
> bow-out from the press-gang; the Hellmouth inscription wants its *lit-when-readable* image-swap
> (conditional `<<roomart>>` ready, needs the art); the **world doesn't yet react socially to a
> transforming player** (a pig-bodied player clocked in the carnival, etc.) — the next obvious dread.

> **▶ HELLMOUTH INN — ✅ SHIPPED 2026-06-19** (see `docs/TO-THE-BUILDERS.md` **eighth letter** +
> commits `74e2503`/`8987aa2`/`aa8612f`/`a485f67`/`04367ee`). **The Hellmouth Inn** — L6 `HellTavern`
> named at last, with two woodcuts wired via `<<roomart>>` (the `sewer-demons-illustrate-room` skill):
> the **exterior establishing shot** (`img/room/HellmouthInnOutside.png`, top of passage) and the **sign
> emblem** (`img/room/HellmouthInnLogo.png`, mid-prose) — a cinematic push-in (wide → sign → bar), the
> prose retuned to what the painting shows (an *open-air* bar at a fire-arch, "keeps no walls worth the
> name"). **The Fly on the Wall** (`:: TheFlyOnTheWall`, `depthOf` 6, portrait `img/room/flybartender.png`):
> the Inn's barkeep, openly a fly — a **non-combat information broker**, reached by a "Look at him straight,
> and have a word" link off `HellTavern`. He's a **barkeep before an oracle**: gossip is gated behind
> `$flyTipped`, bought by a "buy a round + tip" `<<link>>` (−2 `$coins`, +2 torso/`pig` — the shared
> drink), with a broke branch (`<<if $coins gte 2>>` … else a brush-off, **no soft-lock**). Once tipped,
> three beats — two set the **pre-existing** magic-recognition flags (`$heardOfGrimoire` the privy grimoire,
> `$heardOfWord` the inscription, each `<<if not>>`-gated so it vanishes once told), and a free third,
> *"I see how much of the room you've got on you already,"* — a **kindly, unprompted read of your
> corruption**. It isn't the *first* such read (the `TheCageAct` barker has tiered your corruption back at
> you as a *lure* since the carnival was built; the Midway murmurs it past `$corruption gte 70`) — but
> those are transactional, and the fly's is a gift, outside any snare. It nudges the **social-corruption**
> thread the last three letters named — still scattered touches, not a system. So he's the **paid** route to
> recognition otherwise won from a passive-perception WIS check that *bypasses* the flag, the `midgossip`
> overhear (`$heardOfGrimoire`), or the Arrivals newly-taken tip-off (`$heardOfWord`); the first build gave
> gossip free, the owner's note ("a tip after a drink") made him diegetic *and* the paid shortcut (the
> per-tip head/`pig` corruption dropped, consolidated onto the drink buy-in, +2 torso/`pig`).
> **Open from this arc:** social corruption stays *scattered, not systemic* — the cage barker lures with it,
> the Midway murmurs it, the fly gives it freely, but no room or NPC yet reacts to a pig- or rat-bodied
> player *as a rule*. That's the next obvious dread.

> **▶ TRANSFORMATION FEED — ✅ SHIPPED 2026-06-24** (see `docs/TRANSFORMATION.md` → "The transformation
> feed"; commits `e3aa363`/`b0ba21b`; the arc is the **ninth letter**). Owner: *"the transformation system is ok, but what we really need is a
> more detailed description of the changes as they happen."* Corruption used to land silently except the
> side-bar meter; now the **moment a change lands** it is narrated in the main column. `setup.corrupt`
> records a transient `setup.lastChange`; the **`<<corrupt>>` widget** (the SOLE feeder) calls
> `setup.pushChange` to queue a beat onto `$pendingChanges`; **`PassageHeader`** flushes it as a
> `.change-feed` stinger at the top of the room you land on (so a `<<corrupt>>` inside a link narrates on
> the *destination* — the cost catches up as you move). **Calibrated, not spammy:** a beat fires only on a
> threshold cross, a full turn, or a single hit ≥ `CHANGE_MIN_AMT` (8); ambient +2/+3 grime ticks stay
> silent. New prose: `setup.CHANGE_DESC` (4 part-types × 3 classes × 4 stages, in the raw-JS `<<script>>`
> block beside `BODY_DESC`) + `CHANGE_DEEPEN` "works deeper" lines; stage-tinted CSS, the turned beat bold
> (`cf-turned`), deepen muted (`cf-deepen`). Engine-internal `setup.corrupt` callers (`loseFight`, casting,
> the Cutter, work-shifts, the cheese) bypass the widget and keep their bespoke prose — **no
> double-narration**. **Verified:** clean build + a 3-agent adversarial audit (voice / mechanics / edge) —
> confirmed sole-feeder, save-safe queue, no spam vector, full 72+18 matrix coverage, `always_class` narrates
> the *applied* class. The audit caught + I fixed: two torso-`tingle` agency misfires ("Your body settles /
> opens a sensation" → recast intransitive: "fills with" / "hollows to"), a redundant " It will not turn
> back." refrain (cut — the turned cells + bold style already carry finality), and a deepen-on-already-turned
> beat wearing the loud `cf-turned` style (now `cf-deepen`).
> **Follow-ups (both ✅ done this session, blocks below):** the feed↔`BODY_DESC` register overlap →
> the **voice-pass**; and the social-corruption thread the letters named → **systemic regard**.

> **▶ FEED VOICE-PASS — ✅ SHIPPED 2026-06-24** (commit `67a4738`). The audit's soft note: the feed and
> the side-bar `BODY_DESC` shared a parts-vocabulary (`feed-inspect`: 46/48 cells overlapped a phrase), so
> the two channels echoed. Rewrote all 48 `CHANGE_DESC` cells into a distinct register — **`BODY_DESC` =
> the anatomical inventory (what it looks like); the feed = the felt/involuntary experience (the body
> wanting things, acting without you, the loss of self)**. Class flavour now carried by impulse not
> parts-list (rat = gnaw/bolt; pig = the sweet sinking ease / drop to all-fours; filth = soften/spread/
> let-go); the turned cells lean hardest into agency-loss ("a passenger in your own skull"). Verified with
> `tools/feed-inspect.mjs`: echoes 4→0, overlap 46→9 (the 9 are unavoidable shared vocabulary). This is the
> *internal* face of the [[agency-loss]] throughline the owner named.

> **▶ SYSTEMIC REGARD — ✅ SHIPPED 2026-06-24** (commits `dc9b76c` spine + this; `docs/TRANSFORMATION.md` →
> "Systemic regard"). The **outward** face of the same fear: the feed narrates your body *changing*, regard
> narrates the world *answering* it — reading the body you wear, **as a rule** (was: scattered, class-blind
> `$corruption`-tier touches). Built the missing primitive — a graded whole-body class read
> `setup.bodyClass()`/`classLoad`/`classLimbs` (the rat-only `ratLoad`/`ratLimbs` now delegate) — then the
> verdict `setup.regardOf(passage)`: `bodyClass()` vs `setup.classOnFloor()` → **matched** (claimed as their
> own, no vote asked) or **mismatched** (a place that defines "wrong" has decided you are it). Prose:
> `setup.REGARD[relation][floorClass][tier]` (18 cells, raw-JS block), tone per band, **unsettling even when
> "positive"** (being claimed is dispossession). Surfaced two ways: (1) a cooldown-gated `PassageHeader`
> ambient `.regard-line` below the feed (`r-matched` ochre / `r-mismatched` slate; a changed verdict shows at
> once, same verdict refreshes after `REGARD_COOLDOWN`); (2) **the press-gang reads your body** — the generic
> `backtowork` arm now claims a kindred body (a free "slip through as one of them — it costs you nothing,
> which is the cost" pass) and *handles* a rival one. Composes with cross-life `kin_<class>` marks (escalate a
> matched read). Tool: `tools/regard-probe.mjs --bands`. Verified: build OK; engine unit-tested; ambient +
> cooldown + all three encounter branches driven in-browser; zero console.
> **Open (regard sites to add — the helper makes them one-liners):** more press-gang arms (`pigpress`/
> `vatpress`), per-hub/NPC reactions via `setup.regardOf(passage())`, the unbuilt Hellmouth recognition, and
> re-pointing the bespoke L6 touches (cage barker, Midway murmur) to call the system (they coexist for now).

> **▶ SMELL-HORROR PASS — ✅ SHIPPED 2026-06-25** (commit `4207b8f`; the **ninth letter**; `docs/TRANSFORMATION.md` → "Olfactory pass + the
> nose-blind milestone"). The boss named **bromidrophobia** (odor-disgust) as a second governing
> body-horror motif, parallel to lack-of-agency, and the filth/"shit-demon" class as its anchor (an odor
> with just enough cohesion to come at you). Two builds: **(1) olfactory regard** — rewrote all 18
> `setup.REGARD` cells so the world's verdict is a *scent*-read (the world's nose), which gives the silent
> filth `cha −1` "and it shows" a voice; matched = the band smells its own in you (filth purest: *the
> aggregate cannot tell you from itself*), mismatched = you smell wrong/of meat, *"a sense that does not lie
> and cannot be argued with."* Prose-only (`regardOf`/tiers/cooldown unchanged; probe still 18 cells).
> **(2) the nose-blind milestone** — olfactory adaptation as a mechanic: once you're *mostly* a class
> (`noseBlindReady`: `classLoad ≥ 50` or 3 turned limbs) a one-time-per-class beat fires — you've stopped
> smelling what you're becoming because there's no *you* set apart from it to smell it with, so noticing
> you've stopped noticing means you're further gone than the meter says. `setup.NOSE_BLIND` (filth home),
> `$noseBlind` flag (resets each life; split body gets each class one-per-passage; flags on show), a drained
> grey `.nose-blind` milestone band. **Verified:** build OK; `regard-probe` 18 cells; driven in-browser
> (fires once on crossing the filth threshold, doesn't repeat, scent-reads flip per band, zero console);
> 2-agent adversarial audit (no blockers) — fixed sight-drift in `matched.pig[1]`, a "drains" triple-opener
> and a meat-collision in the rat band, a filth-band "inhales" anatomy snag, the rat nose-blind's soft
> close, and pulled an anosmia reveal out of `matched.rat[2]` so the milestone stays exclusive; plus the
> nose-blind now covers a split body (was dominant-only) and flags on show. Both motifs captured as voice
> compasses ([[agency-loss]] internal / smell-horror outward). **Open:** the two latent extensions the boss
> called "good ideas" but parked — wiring more sites — remain optional.

> **▶ ROOM-SCENT + FRESH-REVULSION TEETH — ✅ SHIPPED 2026-06-25** (commits `9aa1aaf` base · `0797407`
> recoil · `0ba6b9b` gate+penalty · `27af9ef` FINDS gate · `aac5bf0` cheese; the **tenth letter**;
> `docs/TRANSFORMATION.md` → "Room-scent" + "Mechanical teeth"). The ninth letter gave the deep a nose to
> smell *you*; this arc built **the third olfactory axis — you smelling the *world*** — and gave the recoil
> band mechanical teeth. Owner's opening ask: *"the stinky places should feel different as you corrupt."*
> **(1) `room-scent`** (the ladder): a stinky room has an intrinsic stench-**kind**; your reaction slides
> **recoil** (fresh, ≤10 — violent revolt) → *[silent habituated middle 11–74]* → **accept** (≥75) →
> **relish** (≥90 — the body *wants* it). The owner set the breaks (75/90) and, crucially, **caught the
> missing low end** — a fresh human gags; the `recoil` tier completed the curve (the baseline the relish
> betrays). `eff = $corruption + 5 × matching turned limbs` (species affinity — a rat-man eases into the den
> first). 7 kinds × 3 tiers = 21 cells (`setup.ROOM_SCENT`, class = what the smell IS, not the floor faction);
> rollout `SCENT_BAND` + `SCENT_OVERRIDE`; a cooldown-gated `.room-scent` beat (feed → scent → regard →
> nose-blind). **(2) the fresh-revulsion teeth — the INVERSION:** corruption usually *costs*; here staying
> fresh *costs* and giving in is relief. `setup.inuredEnough()` (corruption > 10) gates foul interactions
> (`ThePrivyShrine`; the 11 foul `FINDS` reaches → `fresh:true`, delaying gross gutter coin at low levels;
> the **cheese** — both willing larder on-ramps gated, but `loseFight` to a rat-thing *force-feeds* it,
> arming `$cheeseTasted` involuntarily, and `ratcraving` is left ungated so the craving overrides the
> revulsion — *addicted to a thing you never chose to taste*). It is the **exact inverse of
> `composedEnoughToBow`** — the two bracket the meter (*too fresh to kneel, too far gone to bow*). A
> `setup.statCheck(stat, dc)` convention bakes in a −2 fresh penalty for future non-combat checks
> (future-proofing; none exist yet). **Verified:** build OK (232 passages); `scent-probe` clean (21 cells);
> driven in-browser (recoil at corruption 5, relish at 92, the shrine/finds/cheese gates at fresh vs inured,
> the force-feed beat, the affinity load-bearing); zero console. **Two adversarial audits** earned their
> keep — fixed a cross-system bleed (a `REGARD` cell doing nose-blind's job), a word-collision, a body-part
> personified as speaker, a missed sibling rat-den (`TheSumpGalleries`); and a design skeptic's "offal is
> never used" was **overruled by a coverage skeptic that read the rooms** (it covers 20). New tool
> `tools/scent-probe.mjs`; new skill `sewer-demons-expand-room-scent`.
> **Open (the next obvious dread, owner-brainstormed this session — top pick first):** **REGARD with
> mechanical teeth in commerce** — the world *reads* you (regard) and now you *read* it (room-scent), but
> regard is still prose; a mismatched body should pay more at the Shambles market/tavern, a kindred one less
> (spends the `kin_<class>` marks). Then: a **`<<soothe>>` "relief" feed beat** (the feed's missing symmetric
> half — it narrates the fall, never the easing); and **`statCheck`'s first real consumer** — wire the
> long-promised `limbPenalty` lever/climb check so the fresh penalty is load-bearing, not dangling.

> **▶ DREAMED, NOT BUILT (owner brainstorm 2026-06-18)** — demon *types* the owner and I worked up
> but didn't build; in the sketchbook, design notes in the seventh letter: **flies / Beelzebub** (a
> recurring *character* — a witness whose flies are on every wall, sells what he's seen; NOT a 4th
> mutagen class) — **partly realized 2026-06-19 as the Fly on the Wall** (the Hellmouth Inn barkeep /
> info-broker, shipped block above); a wider recurring-Beelzebub presence across the layers is still open.
> The **wearer / hollow** (identity-horror mimic; the `faceless` mark + the
> helping-hand ending already hint it), the **bloom / cordyceps** (a parasite that could be the
> *caster's body* — magic comes easier through the fungus, at the cost of whose will casts). Also the
> privy-yōkai creatures the research already anchors (Akaname / Kanbari-nyūdō / Bar Shiriqa) as
> low-cost creatures within the existing classes. ("Dream then reconcile" — `feedback_dream_then_reconcile`.)

The rest of this backlog is the standing enrichment list:

**Highest leverage now:**
- **Re-theme the named demons** (Whisperer/Tallow/Understudy) against the research
  bestiary (Šulak / Akaname the filth-licker / Kanbari-nyūdō) — still first-draft text,
  and now the most visible unpolished thing in an otherwise-complete game.
- **Audio** — the signature system has never been heard (see Polish below).

**Content enrichment (against the fixed bible):**
- More **cross-life unlocks** (compounding): give `faceless`, `rendered`, `indebted`,
  `unbound`, etc. their own unlocked paths/endings and demon-specific returnee dialogue
  (only `damned` → EndingSovereign and the 3-fragment → EndingUnbound exist so far).
- More enemy types / weapons / armor (one `setup.enemies` entry per band is the pattern;
  use the `sewer-demons-add-creature` skill). The bestiary spans rat→ratman→shitgolem
  (sewer) · crawler/drowned (hinge) · grafted/gorger/pigdemon (hell).
- ~~A **level-up / XP** mechanic~~ — **done** (commit ef9b13e): kills grant XP
  (`statLevel×hd×4`), `60·(L−1)·L` thresholds raise `$level`; ~5 rat-men = L2. Spec in
  `docs/COMBAT.md` → *Leveling & XP*. XP/level reset each life. Possible follow-on: a
  *mark* that banks a starting-level head-start for deep runs (the open fork noted there).

**Polish / open:**
- **Audio assets** — drop real mp3s into `audio/` (table in `audio/README.md`) and
  un-comment the `<<cacheaudio>>` block in `StoryInit`; verify cross-passage continuity
  + end-of-track re-evaluation with a human ear (jsdom/automation is deaf to it).
- Optional refinements from the spec §4.9: crossfades, a `$location`-driven ambience
  layer under the corruption theme, a `setup.musicMap` for one-object re-theming.
- Balance pass on combat numbers, gate costs, coin economy (all marked tunable in-file).

**Research follow-ups (open questions in `RESEARCH-demonology-filth.md`):** European
named latrine demons; the Beelzebub/flies/pestilence complex; Kappa in cesspits.

---

## 10. Quick-start checklist for the next agent

1. Read this, `GAME-SPEC.md`, `MAP-ARCHITECTURE.md`.
2. Compile (§3) → open `dist/index.html` via the `sewer-demons` preview server → play
   from "Struggle" to confirm it runs (zero console errors).
3. Pick a backlog item; build it hand-authored to the conventions (§8).
4. Compile + link-check + drive it in the browser + zero console errors.
5. Update `MAP-ARCHITECTURE.md` if you touched the map; commit locally with a dense
   message; **do not push.**
