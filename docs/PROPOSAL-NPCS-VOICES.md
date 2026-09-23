# Proposal — The Voices of the Damned (Dante-style lore NPCs)

> **✅ SHIPPED (2026-06-25).** This cast is **built and verified** alongside the functional
> set ([`PROPOSAL-NPCS.md`](PROPOSAL-NPCS.md)) — 46 NPCs total across all 9 layers (commits
> `db6694d` → `9b5547b`, local-only). The Warden was trimmed and the Surveyor cut per §5/§6;
> both trickster modes (braggart + the wheel **Tout** shill) shipped. Verified compile →
> `tools/npc-probe.mjs` (46/46) → in-browser drive → zero console. The trickster-safety rule
> (§2) held in testing: every dangle resolves to nothing, no forced navigation. Spec of record.

**What this is.** Owner ask (2026-06-25): *"there should also be NPCs that share lore —
talking about the level they are on or things nearby, life in hell, how they got there.
Think Dante's Inferno, but with the same motifs featured elsewhere in the game. Some
philosophical about their plight, some blue-collar, some liars and tricksters. Use an
inline link for interacting with NPCs in an environment."* This is that cast — the
**ambient damned**: a companion set to the functional clue/corrupt/flavor NPCs in
[`PROPOSAL-NPCS.md`](PROPOSAL-NPCS.md). **Nothing built; a cast to approve and trim.**

**18 souls across 8 layers** (L5 deliberately skipped — its three rooms are full), each
ground-checked against the real rooms, exits, and flags. Archetypes spread near-even:
**6 philosophical / 7 blue-collar / 7 trickster** — every band carries all three.

---

## 1. The organizing principle: room-owed, and sinned the game's way

Two rules made the cast feel like *this* game and not a generic Inferno:

- **Room-owed.** Each soul **personifies prose the room already plants** — the heads "grown
  into the lining like streetlamps" (L7 Gutway), the warm brick "a faint warmth on the far
  side" (L3 Outfall), the racked hearts that "flinch from the light" (L7 OrganTrove), the
  abscess the belly "keeps separate… easier to contain than to heal" (L7). The soul gives a
  voice to a thing the room was already describing; it doesn't import a stranger.
- **Sins that rhyme with the player's own near-future.** Nobody here committed a generic
  Dante sin. They **reached into a gutter for a coin too gross to touch** (the Sifter, the
  Donor, the Pilgrim), **signed on for a post and never clocked off** (the Warden, the
  Gauger, the Sluiceman, the Lamplighter, the Dipper, the Colourman), **stopped minding the
  smell** (the Gauger, the Lamplighter, the Colourman), **sat down because stopping felt
  like rest** (the Communicant, the Patient One), **swore blind they wouldn't, right up to
  the part where they did.** Every backstory is a thing the player is one bad choice from.

**Implementation (owner directive):** every soul is an **inline `<<linkreplace>>`** sitting
beside its own choice in the room (vague-from-outside, detail-on-entering), gated one-shot on
a `$flag`, with a short spent-NPC beat on revisit. Talk-only — **a damned soul is never a
fight.** Most are free; a few carry one **silent** knowing-cost `<<corrupt "head"
"<class>" 2-4>>` (below the feed-threshold of 8, so it ticks without narrating). The rooms
keep all their existing exits.

---

## 2. The trickster rule (adopt this verbatim as policy)

The liars are the part most likely to break the game's discipline later, so the rule is
stated once, as policy, for every future builder. There are **two trickster modes**:

**Mode A — the braggart / self-deluder.** Lies ONLY about *itself* — its history, status,
sin, prowess (reinvents how it got here, brags it beat the system, recasts being-walled-off
as conquest). It dangles one **too-good offer with a FAKE benefit** ("I'll wave you through,"
"a dry way out," "teach you the trick") that **resolves to pure flavor**: no `<<goto>>`, no
`<<link>>` to any room, sets no flag but its own `$heard`, unlocks no mechanic, costs no
death. The fake benefit is the lie. *(Timer, Optimist, Pilgrim, Lather-Man, Splinter.)*

**Mode B — the shill / tout (owner, 2026-06-25).** Points the player at a **real local trick
or trap** and **highlights the real benefit while hiding the real risk** — the carnival
gambling wheel is the canonical case ("the wheel pays, I've seen men walk away rich" — never
mentioning the house edge, or that the self-bet costs you a piece of yourself). Unlike Mode A,
the upside is *true* and the thing pointed at is *real*; the lie is the **omission of the
cost.** This is the more dangerous, more useful trickster — it drives the player toward the
game's risk-content. Bounded by:

> 1. **Survivable faucets — shill freely.** The wheel (`setup.spinWheel`), the self-bet
>    ("asking for trouble"), the job-faucets (the cage act), grafts, pay-with-self bargains —
>    anything where the loss is "a little of you," repeatable, walk-away-able. The shill hypes
>    the jackpot / the coin / the armor and omits the house-edge / the corruption. The mechanic
>    itself delivers the honest outcome the moment the player engages it — so no warning is
>    suppressed; the player simply wasn't *told*, the way a mark is never told.
> 2. **Bad-end snares — tempt, but never force, and never strip the door's warning.** A shill
>    may talk up the molt-pit, the clean-looking foam, the warm vat — but it must **never
>    `<<goto>>` the player into an ending** (they travel there themselves), and the snare's own
>    link keeps its standing **`(an ending)` label + warning prose** (the engine already labels
>    every bad-end link this way). The shill is the hype in one ear; the door stays honest in
>    the other. *Informed death is preserved — the trickster sells it, the trap still announces
>    itself.*
> 3. **The benefit must be REAL and the hidden risk must be REAL** (that's what separates a
>    shill from a braggart — a shill never invents an upside that doesn't exist).
> 4. **The omission must be legible-on-reflection** — the player can sense it (the wheel's
>    visible brake / house edge, the shill's own ruined state, the room's prose). "Hiding the
>    risk" = spinning it as upside or not mentioning it, NOT making it undiscoverable.

**Both modes — the hard floor:** a trickster may **NEVER** point at the **Clean Pool cleanse**
(the [§7](PROPOSAL-NPCS.md) un-taught grace) or a real *bypass/escape* (the berg-burn, the
causeway, the kappa bow, a real exit) — tricksters neither know nor point at the real ways
*through*; they only point at the ways *down*. And a trickster never force-routes to a death.
**Tricksters stay free (cost is dignity, not corruption)** — though the hazard a shill points
at charges its own real cost when the player takes it.

One sharp distinction to preserve: a soul whose theory is **honest-but-bleak** (the Dripstone
Listener) is *not* a trickster — its danger is its calm making surrender sound reasonable, not
a false direction. Keep "reliable philosophical," "legibly-false braggart," and "shill who
hides the cost" from blurring.

**Mode B shill placements (a menu).** Each is a *real* local hazard a tout could hype while
hiding its cost — all survivable-and-opt-in or warned-at-the-door, none a forced death:

| Hazard (real) | Where | The benefit shilled | The cost hidden |
|---|---|---|---|
| **The gambling wheel** ← *the Tout, built below* | L6 `TheWheel` / `TheGames` | the jackpot, the 3× | the house edge; the self-bet costs a piece of you + the misspeak curse |
| **The grafts** | L7 `TheSurgery` (the Cutter) | a lamp-eye, a tireless hand, a real combat bonus | the limb is paid for in corruption and bound permanently |
| **The clean-looking foam** | L1 `TheFoamfall` (snare) | "the one clean water — wash and be yourself again" | it takes the live layer under the filth (the false-clean that rhymes with the un-taught real cleanse) |
| **The cage act / the jobs** | L6 `TheCageAct`, L8 `TheBoilHouse` | coin, every shift, easy money | each shift rubs in pig/filth corruption; the work-binding reels you back |
| **The molt-pit** | L7 `TheMolt` (snare) | "shed your old self, come out new" | it is `EndingMolt` — the door keeps its `(an ending)` label |

The Foamfall and Molt are *snares*: a shill may **tempt** toward them, but never `<<goto>>` the
player in, and the snare's own `(an ending)` warning still fires at the door. The wheel, grafts,
and jobs are survivable faucets a shill may point at freely.

---

## 3. Coverage & the honest gaps

**Motifs voiced:** work-curse (the blue-collar spine — Warden, Gauger, Sluiceman, Off-Duty
Barker, Lamplighter, Dipper, Colourman), agency-loss (the Bar-Holder's loosened finger, the
Sifter's hands "still going," the Lamplighter's *"I never felt the wall come up round me. I
was busy."*), irreversibility (the Far-Side's self-dug door), kept-not-killed (the Communicant
from the willing side, the Donor from inside the rack), belonging-clock (the Optimist, the
Patient One), smell (Gauger, Lamplighter, Colourman).

**Two honest gaps to decide on:**
1. **The filth-*agrees* thesis** — the game's central collective-mutagen claim — is voiced in
   this ambient cast only as an **inversion** (the Splinter: *"I would not agree"*). The
   straight version lives in the functional **L3 Reader** ([PROPOSAL-NPCS.md](PROPOSAL-NPCS.md)
   §3). If you want a damned soul who *embodies the agreeing* (not just the refusal), that's a
   gap to fill; otherwise the Reader covers it and the Splinter is a strong second beat.
2. **Smell-horror** is present but thin and all blue-collar/nose-blind-flavored; no
   philosophical or trickster soul touches odor. Fine as-is, flagged for awareness.

**Two single-point-of-failure seats** — protect them when trimming: the **sewer blue-collar**
voice (only the Gauger is rock-solid; the Warden is the flagged-weakest soul) and the
**carnival philosophical** voice (the Communicant is the *only* one — L5 is empty, L6 carries
no philosophical).

---

## 4. The cast (ship; KEEP unless marked REVISE)

Voice samples are the actual proposed lines (trimmed) in the game's `//italic//` convention.

### Sewer band (L1–3) — bathroom/mutagen horror

**L1 · TheRiverMouth — The Bar-Holder** *(philosophical)* · `$barHolderHeard` · silent head/filth 3
- **Sin:** washed down a storm-cull, she got both hands on the outfall bars with the far bank
  in sight and *would not let go* until someone looked down and saw a person. Nobody did. The
  not-letting-go is what kept her; she became part of the screen.
- **Voice:** *"I had both hands on it, love — just here, where you've got yours… You stop being
  someone who's holding on. You become a thing the screen holds. There's a mercy in it, when
  you let it come… Loosen one finger. See how it rests you."*
- Beside the room's "just more refuse, held" beat; exits (TheStrainer / TheTideFlap) kept. The
  strongest of L1's three — load-bearing to the room's own thesis.

**L1 · TheStormFront — The Flush-Warden** *(blue-collar)* · `$wardenTalked` · free · **REVISE**
- **Sin:** signed on to call the surge and walked his round one rain too long; the city flushed
  and kept him at his station. He owes the round forever — the indenture without a demon's
  signature.
- **Voice:** *"A man signs for a post and reckons he can put it down of an evening. You can't.
  The post puts YOU down… That's the difference between us, friend: you can still leave the
  channel."*
- **Revise:** lean the contribution onto the *scheduled-shift/indenture* framing, not the
  room's own high-water dread (which the prose at lines 322-324 already delivers). **This is
  the soul to cut first if L1 is too dense** (see §5).

**L1 · TheTideFlap — The Timer** *(trickster)* · `$timerHeard` · free
- **Sin (reinvented):** claims he was a clever man who beat every rule up top and is only
  *waiting* for the perfect gap in the tide-flap to slip into the river. He has been "timing
  it" across uncountable booms and never once attempts it.
- **Voice:** *"Boom — and a three-count — and BOOM, regular as a clock… Stick by me and I'll
  wave you through on the same one. Cost you nothing."* (He does not move toward the gap.)
- Trickster-safe: the offer resolves to nothing; the room's "the iron is a ton… not a way out"
  arms the tell. Exits kept.

**L2 · TheGritTrap — The Sifter** *(philosophical)* · `$sifterTalked` · free
- **Sin:** reached into the heavy load for a ring too gross to touch, and the *having* felt so
  like being a person that he reached for the next, and the next — never found the last handful.
- **Voice:** *"There's no clean line, no step where the man ends and the sorting starts. You
  just look up one day and your hands are still going, and you can't think why you'd want them
  to quit."*
- After the `$gritLooted` block, before the lone exit (TheScreeningHall). The gutter-reach made
  flesh.

**L2 · TheWeir — The Gauger** *(blue-collar)* · `$gaugerTalked` · free
- **Sin:** took the works post; one shift bled into the next until the place owned the shift.
  Stopped minding the smell about a week in — *"a man who's stopped minding the smell is a man
  who's stopped clocking off."*
- **Voice:** *"You get used to the smell faster than you'd credit. Week, maybe. After that it's
  just the air — and that's when you've gone, friend. Not the day you came down. The day the
  stink quit reaching you."*
- **Guardrail:** speaks the valve as job-site lore, **never the bleed-order solution** (the
  TheValvePuzzle discovery stays intact). All four exits kept.

**L2 · TheLostConduit — The Optimist** *(trickster)* · `$optimistTalked` · free
- **Sin (reinvented):** came to loot the conduit and walk out rich; the "patient bones of a
  previous optimist" the room names are near enough his own. Brags a "dry way up that skips the
  berg" he's about to finish — any minute, one more coil.
- **Voice:** *"Found a dry run that cuts the whole berg out — straight up, no grease, no toll.
  Show you, even, once I've grabbed that last coil… It's right there."* (He does not move toward
  it. He has not in a very long time.)
- Trickster-safe: names no room, never touches the Clean Pool or the real berg-bypass. Exits kept.

**L3 · TheOldOutfall — The One On The Far Side** *(trickster)* · `$outfallVoiceHeard` · free
- **Sin:** felt the same far-side warmth the player feels now, talked himself into believing it
  was daylight, and spent his last week scratching mortar with a spoon — *out* to the far side,
  which is one level further down. *The cast's best irreversibility beat.*
- **Voice:** *"Put your hand on the brick. Warm, isn't it. That's me, friend — that's the
  morning… Three days with a spoon and you'd be standing where I'm standing."* (It never says
  what stands where it is standing, or what the engineers walled in.)
- The warm brick is *your own heat thrown back at you* — the tell is in the room's own beat. The
  false promise resolves to nothing; the single real exit (TheBoneWeir) is untouched.

**L3 · TheDripstone — The Listener in the Flowstone** *(philosophical, honest-but-bleak)* · `$dripstoneHeard` · silent head/filth 3
- **Sin:** stood at the dripping a moment too long (as the room warns you're about to), decided
  the drip was *addressed* to him, and hummed along — stopped finding the edge where he ended
  and the cave began; the lime kept his shape.
- **Voice:** *"The trick is the relief. The drip was a stranger and now it isn't, and being
  right about a stranger feels like company… and counting your own time, friend, was the only
  thing you still had that was yours."*
- *(Flag renamed `$drippeHeard`→`$dripstoneHeard` per the verifier.)* All three exits kept.

### Carnival band (L4–6) — the seductive almost-normalcy

**L4 · TheSunkenChapel — The Communicant** *(philosophical)* · `$communicantHeard` · optional silent head/filth 4
- **Sin:** took no demon's mark — came out of the flooded dark looking for somewhere the noise
  stopped, found the chapel kept and orderly, and *knelt, because his knees were tired.* The
  bargain with **no demon on the other side.** *The purest kept-not-killed beat in the cast.*
- **Voice:** *"They told it wrong, up top — that this place takes you. It doesn't take… You
  walk in on your own two feet, and you find it warm, and you find it kept, and you kneel… Nobody
  drowned me, friend. I sat down."*
- **Protect this one** — the carnival band's only philosophical voice. Keep its tick *optional*
  (L4 already runs heavy head-corrupts). Exits kept.

**L4 · TheWeepingArch — The Sluiceman** *(blue-collar)* · `$sluicemanHeard` · free
- **Sin:** a waterworks man who signed onto a deep-maintenance gang for the overtime; the gang
  went down and the shift never ended. The indenture that **never clocked him off.** *The
  standout register beat — flat foreman's diction against an infernal backdrop.*
- **Voice:** *"I came down on a relief shift. Double-time, they said, six weeks below the old
  drains and back up by the saint's day… Nobody mentioned the up-by part again."* He works his
  shoulder. *"You're not the relief, are you. No. They never send the relief."*
- Free — a knowing-cost tick would editorialize the flat voice. Exits kept.

**L4 · TheColonnade — The Pilgrim** *(trickster)* · `$pilgrimHeard` · free
- **Sin:** reached into a fouled overflow for a coin he could have left; mythologizes the descent
  as a chosen holy pilgrimage to avoid the trivial truth. His story changes every telling.
- **Voice:** *"I gave up a throne for this road. A wife. Several wives… I know the dry way out,
  the real one, kept for them as walked it right. Come along a little further and I'll put you on
  it."* (The dry way is more colonnade. There is always more colonnade.)
- The carvings beside him — the burden only getting heavier, no bearer reaching for a way out —
  contradict him in-line. Trickster-safe; exits kept.

**L6 · TheBackAlleys — The Off-Duty Barker** *(blue-collar, co-tenant)* · `$alleyHand` · free
- **Sin:** came down a mark short on his keep, took *one* night barking an empty stall to clear
  the tab. The patter took; the stall keeps him on the rota now.
- **Voice:** *"I came down a mark, same as you. Owed a night's keep, so I took a night on a
  stall. Just the one. You only ever take the one… Now I'm on the rota. Couldn't tell you which
  half of what I say is still me talking."*
- Co-tenant **beside** the existing glowing-smoke corruptor (don't replace it); the descent-stair
  reference stays oblique flavor, not a route. Exits kept.

**L6 · TheGames — The Tout** *(trickster — **Mode B shill**, owner 2026-06-25)* · `$wheelToutHeard` · free
- **Sin (reinvented):** a mark who couldn't stop playing, now works the rope as the wheel's
  tout — sends the next mark to the wheel he is himself still paying off.
- **The shill (real benefit, hidden cost):** he points at the **real `TheWheel`** and hypes its
  **true** upside — the jackpot is real (`setup.spinWheel`, the coin-mode 3× and the rare big
  win) — while burying the **real** cost: the house edge that grinds you down over spins, and
  that the self-bet ("asking for trouble") pays in a **piece of yourself** plus the
  mouth-misspeak curse (`$mouthCursed`). He sends you toward the room's existing wheel exit; he
  never force-routes and the wheel charges its own honest cost the moment you spin.
- **Voice:** *"You've the look of a lucky one — I can always tell. The wheel pays, friend, don't
  let the long faces fool you; I watched a man clear forty on a single spin not an hour past and
  walk out of here a prince. Go on — put a coin down while the luck's standing this close to
  you."* (His own pockets don't jingle. He does not mention the brake the barker's hand never
  leaves, and you notice he does not go and spin it himself.)
- **Trickster-safe (Mode B):** the wheel is a survivable, walk-away faucet that announces its own
  cost the instant you play — the tout **suppresses no warning, he just doesn't mention it**, the
  way a mark is never told. Points the player at a real *risk*, never at a real *way out*; never
  touches the Clean Pool cleanse; no forced `<<goto>>`. The tell is legible: he's cleaned out,
  and the wheel room's own "the barker's hand never leaves the brake" is right there.
- **This resolves the prior Gaff-Mechanic fork:** the **Mechanic** sells the *insider trade* (a
  real corrupt bargain that makes you staff); the **Tout** *touts the wheel* (hypes a real faucet,
  hides its edge). Cleanly distinct now — keep both. Exits kept.

### Hell band (L7–9) — infernal

**L7 · TheGutway — The Lamplighter** *(blue-collar)* · `$lampTalked` · silent head/filth 2
- **Sin:** a council pump-man who signed for the gutway overtime knowing it was eating his sense
  of smell; adapted, stopped smelling the work, then himself, then there was no him left to mind
  the belly had grown the rest of him into the wall. *Carries two motifs — work-curse + smell.*
- **Voice:** *"You'll stop smelling it. That's the part nobody warns you of… that's not the air
  changed, son, that's you grown in. I never felt the wall come up round me. I was busy."*
- *The cast's cleanest agency-loss line.* Put the tick on the "wall came up" line (the heavy
  beat). All five exits kept.

**L7 · TheOrganTrove — The Donor** *(philosophical)* · `$donorHeard` · silent head/filth 3 · **REVISE**
- **Sin:** reached into a gutter for a coin too gross to touch; the belly took the reach as a
  yes. Now *distributed* — a face among the hearts, a shy liver three racks over, lungs by the
  door — kept fresh by not being quite dead.
- **Voice:** *"I'm the face. The liver's mine too, three along — the shy one… It's just being set
  down — in parts, on different shelves — and not asked to be a whole thing anymore. Do you know
  how long I carried being a whole thing?"*
- **Revise:** anchor *entirely* in the inside-the-rack POV and **retire the "used / wanted / not
  wasted" vocabulary — the Breeder owns that** two rooms away. Optionally nod to her as deliberate
  counterpoint (*"She'd tell you nothing's wasted. From in here it's quieter than that"*). Co-tenant
  after the loot block; exits kept.

**L7 · TheAbscess — The Splinter** *(trickster)* · `$splinterHeard` · free
- **Sin:** bedded in the warm and went *septic* — a wrongness the belly couldn't digest or expel,
  so it walled him off and forgot him. He calls quarantine a crown. *Inverts the central
  filth-agrees thesis.*
- **Voice:** *"Everywhere else the filth pools and AGREES… Not here. I would not agree. I stuck
  in its throat… That's a kingdom, that is."* Then, too quick: *"Tell you the knack of it, if you
  like. Lean in—"* (and the dome ticks under a pressure you can feel in your fillings, and the
  offer goes nowhere, because a cyst has nothing to teach but how to be forgotten).
- Keep the pressure beat *inside* the talk so it **sharpens** the room's "you would not like to be
  here when it goes" dread. Trickster-safe; exits kept.

**L8 · TheCandleWorks — The Dipper** *(blue-collar)* · `$dipperTalked` · silent head/filth 3
- **Sin:** a candle-dipper who kept dipping after he knew where the cheap fat came from — *"a man
  with a trade does not look at the wick."* Came down still holding the frame; they handed him
  another. *"Signed the same paper twice without noticing it was the same paper."*
- **Voice:** *"It's the same trade, see, that's the joke of it… Wick's hair. Aye. You get so you
  don't see it. That's the bit that gets you — not the seeing. The not."*
- Carries L8's restraint budget (the room already names hair-wicks). Both exits kept.

**L8 · TheSoapVat — The Lather-Man** *(trickster)* · `$soaperTalked` · free
- **Sin:** came down to stay clean, reached into the clean-looking foam, washed himself into the
  vat — and has reinvented the drowning as a *headhunting.* Claims he's a master perfumer the
  management courted.
- **Voice:** *"You smell that? That's bergamot. My signature. They brought me down for this."*
  (His hands end at the lye-line; the air off the vat is the reek the whole room warns of.)
  *"Friend's rate — I'll cut you a bar of the real lather. Takes the works right back off a man."*
- Trickster-safe: the "real lather" is pure prose (resolves to the ordinary `$soapVatLooted` skim,
  no cleanse). He doesn't know the Clean Pool exists. Exits kept.

**L8 · TheLine — The Patient One** *(philosophical)* · `$lineWalkerHeard` · silent head/filth 4 · **REVISE**
- **Sin:** walked *against* the chain (as the room teaches) for a long time, then stopped one
  shift to rest her legs, and the hook took the slack of her — *"resting and being-taken had worn
  down to the same gesture."* The belonging-clock ran out while she stood still.
- **Voice:** *"And then one shift my legs just… agreed with the chain. That's all it was. Not a
  choice… You won't feel the turn. Nobody does. You'll only notice you've stopped walking against,
  and how much lighter that is."*
- **Revise:** fix the impl note's false "narrates" claim (4 < 8 = a **silent** tick — keep 4, don't
  bump). Weld every line to the against-the-chain walk. **Cut first if L8 needs shedding** (TheLine
  is the deliberate thin atmosphere room). Four exits kept.

**L9 · TheSolfatara — The Colourman** *(blue-collar)* · `$colourmanTalked` · silent head/pig 2
- **Sin:** ground poison pigments bare-handed for forty years because the mask slowed him and the
  foreman paid by the batch; the colours got in by the inch. Walked to the Deep the day he could
  no longer tell which yellow was the wall and which his own hand. *Welds smell-horror to the
  climax layer.*
- **Voice:** *"Orpiment, that one — king's-yellow… Killed three of us I could name and it never
  once looked like it would… the day you can't smell the poison is the day the poison can't tell
  you from itself. I work better since."*
- Names the room's own mineral garden by old shop-name. The L1 storm-drain foam and this crust are
  the same batch, ground finer. Three exits kept.

---

## 5. Cuts & over-population (restraint)

**Cut (collision / duplication):**
- **L5 · TheArrivals — the Waiter-Between** — Arrivals is full (clerk + wedding-ring man + grey
  reader) and already cut in [PROPOSAL-NPCS.md §5](PROPOSAL-NPCS.md); the Waiter duplicates the
  grey reader *and* the Indenture's own "you became what the post was for" beat. **L5 ships zero
  ambient souls** — its three rooms have no vacancy.
- **L9 · TheCanaryCrust — the Surveyor** — a good trickster, but his warm-crust "stay and rest"
  thesis duplicates the approved **Gypsum-Eater** one room away, and he sits one hop from the
  `EndingSublimed` snare. **Fork:** if you prefer his *trickster* framing of the warm-crust snare
  to the Gypsum-Eater's *contented-appetite* framing, swap one for the other — **don't ship both.**

**Over-population to watch (this cast sits on top of ~26 functional NPCs):**
- **L1 reaches 6 NPCs** (3 functional + 3 ambient) in a ~20-room climax layer whose restraint rule
  keeps strong rooms empty. **Cut the Flush-Warden first** (it's the weakest-justified — the room
  enacts its thesis without him); keep the Bar-Holder (room-owed) and the Timer (the band's L1
  trickster). **This is the main fork (§6).**
- **L8:** if shedding, **cut the Patient One first** (TheLine is the deliberate thin room).
- **L6:** keep the Games-House only if it's clearly differentiated from the Gaff Mechanic; else cut
  and let the Mechanic own the carnival-staff note.

---

## 6. Build order & forks

**Order** (all additive, all inline, no engine work):
1. **The standout 8** (the lead cast): Bar-Holder, Far-Side, Sluiceman, Communicant, Lamplighter,
   Splinter, Sifter, Colourman — one per layer-ish, every archetype, every band, each room-owed.
2. **The rest of the blue-collar spine + tricksters** — Gauger, Optimist, Timer, Off-Duty Barker,
   Games-House, Dipper, Lather-Man, Dripstone.
3. **The two revises** (do the fix before writing): the **Donor** (inside-the-rack POV, retire the
   Breeder's vocabulary) and the **Patient One** (silent-tick note, weld to the chain-walk).

**Forks for the owner:**
- **L1 density:** ship all 3 ambient souls (→ 6 NPCs in the climax layer), or trim the Warden to
  hold restraint? *(Recommend trim the Warden.)*
- **The filth-*agrees* gap:** the central thesis is only *inverted* (Splinter) in the ambient cast;
  the functional L3 Reader carries the straight version. Add a soul who *embodies the agreeing*, or
  leave it to the Reader?
- **Surveyor vs Gypsum-Eater** for the L9 warm-crust thesis — pick one framing.
- ~~**Games-House:** keep or cut for the Gaff Mechanic?~~ **Resolved** — reframed as the wheel
  **Tout** (a Mode B shill), now cleanly distinct from the Mechanic's insider trade (§4, §2).
- **Shills beyond the Tout (§2 Mode B):** which other real hazards want a tout? Menu below — pick
  the ones worth a voice.
- **Knowing-cost ticks:** confirm the silent sub-8 `<<corrupt>>` ticks (Bar-Holder 3, Communicant
  4, Lamplighter 2, Dipper 3, Patient One 4, Colourman 2) — all deliberately non-narrating. Free is
  the alternative for any you'd rather leave costless.

---

*Casting: a 9-layer parallel read (each scout handed the rooms already taken by the existing +
functional-proposed NPCs), a per-layer voice + grounding + trickster-safety verifier, and a
casting-director critic for archetype/motif/band balance. Every room, exit, flag, and `<<corrupt>>`
call above is real. The sample voices are the proposed lines, trimmed. — 2026-06-25*
