# Audit — the canonical clean run (2026-06-07)

The standing prerequisite from `HANDOFF.md` §9: *nobody had ever played a full clean
traversal end-to-end*, so corruption/clock/economy tuning had no measured baseline. With the
only cleanse (the Clean Pool) and the gear economy now in, this discharges that debt.

**Method.** Two passes: (1) a live engine playthrough from `Start` making clean / keep-yourself
choices, logging per-room telemetry; (2) a graph computation (`tools/clean-run-path.mjs`) of the
*minimum possible* belonging-clock cost of a focused escape, since hand-walking all ~60 rooms of
the mandatory round-trip wasn't necessary once the topology was clear.

---

## Finding 1 — THE BLOCKER: the escape was structurally impossible (now fixed)

**Every good ending requires a full deep descent.** There is no short "just climb back out" run:
- **EndingTrueEscape / EndingPyrrhic** (the L1 rope climb) needs the **rope** (bought at HellMarket,
  **L6**) *and* passage through the **fatberg** (the L2→L1 choke), which only burns with the **brand**
  from `TheBurningTree` in the Sulphur Deep (**L9**) — plus `$foundRealExit` (set on the ascent) and
  low corruption at `ExitShaft`.
- **EndingUnbound** needs all three sigil fragments (L7 / L8 / L9).

So a "focused escape" is really a **full-map round-trip**: down to L6 (rope) and L9 (brand), then
all the way back up to L1.

**The belonging clock could not survive that trip.** `$deepTurns` adds each room's layer-number on
entry; at `SEAL_LIMIT` you're sealed in (→ EndingResident / EndingTrapped). The tool computes the
**theoretical floor** of the brand route (no backtracking, all gates free, shortest paths):

| Leg | deepTurns | rooms |
|---|---|---|
| Start → HellMarket (rope) | +27 | 8 |
| HellMarket → TheBurningTree (brand) | +72 | 10 |
| TheBurningTree → TheFatberg (climb back) | +81 | 14 |
| TheFatberg → ExitShaft (the climb out) | +3 | 4 |
| **Minimum possible** | **183** | 36 |

The old `SEAL_LIMIT` was **200**. The floor is **183** — and that floor ignores all backtracking,
the rope side-trip, dead-end looting, rest stops, lost fights, and the 4%/move random encounters. A
*real* focused run lands ≈ **1.4–1.7× the floor (~256–311)**, well past 200. And it's not a skill or
replay problem: the clock resets each life but the journey length is fixed, and **cross-life marks
boost stats, not the clock** — so no amount of grinding could ever beat it. The intended clean
escape was **provably unwinnable**, not merely hard.

**Fix applied:** `setup.SEAL_LIMIT` **200 → 360**, and the warning threshold pulled out to
`setup.SEAL_WARN` (**220**, ~60%) so the four "the way up is closing" copies scale with it (they were
hardcoded `120`). At 360: the floor keeps 49% headroom; a realistic focused run (~256–311) fits with
margin; the warning still fires mid-run for tension; a greedy re-diver (>360) still gets sealed —
which is what the mechanic is *for*. **360 is a starting value** — re-run `tools/clean-run-path.mjs`
after any map change and tune to taste.

---

## Finding 2 — Corruption on the clean path is well-behaved (not the constraint)

The live run reached the L2 ascent spine (Start → TheArrivals → Hellmouth → Confluence → TheWeir →
TheValvePuzzle → TheBlackValve → TheRisers) at **0 corruption**. Clean choices genuinely stay clean:
- The Arrivals fork's **"slip out"** keeps you yourself (no work-curse), and the free coin-sweep gave
  **10 coins** at no cost.
- The black-valve gate solved cleanly via the valve-house puzzle (the alternative is wade-for-+15).

So **the binding constraint is the clock, not corruption** — at least through the sewer band. (The
deep layers L6–L9, which the mandatory descent forces you through, are denser with snares/pay-self/
combat; a "clean" deep passage will accrue *some* corruption, which is the point of the one cleanse —
see Finding 3.)

## Finding 3 — The only cleanse is a return-leg, blunt-weapon gate (works, but unhinted)

The **Clean Pool** (off `TheRisers`, L2) cleanses 30 but is guarded by **two `statLevel`-9 shit-golems**
— unwinnable at level 1 with fists (combat-sim: fists vs *one* golem ≈ 5%). That's actually coherent
with the topology: you reach the pool on the **way back up**, by which point the forced descent has
leveled and armed you. But golems **resist edged / are weak to blunt**, so the pool effectively
*requires a blunt weapon* (pipe / mace / maul) — a nice systemic link that is **never hinted**.
**Recommendation:** a one-line tell at the pool ("the muck would scatter under something blunt"), and
ensure a blunt weapon is reliably obtainable before L2 on the ascent (the smith stall sells maces/
mauls — good, as long as the player has passed a market).

## Finding 4 — Economy & early combat are fine

10 free coins at the Arrivals covers the 5-coin rope outright (no need for the +20-corruption rope).
Early enemies (rats, `sl3`) are beatable with fists at level 1 (combat-sim 100%); the deep tiers
(`sl8–10`) need the levels the descent grants. No softlocks or dead ends hit in the live traversal,
and the gear "Manage gear" Back-button bug found this session was fixed (commit `823a011`).

---

## Recommendations (priority order)

1. **DONE — raise the seal** (`SEAL_LIMIT` 200→360, `SEAL_WARN` 220). Without it the game had no
   winnable escape. Tune by feel; the tool reports the floor.
2. **Hint the Clean Pool's blunt requirement** and verify a blunt weapon is gettable before the
   ascent's pool (prose pass).
3. **Consider** whether the brand-from-L9 gate *should* make every escape a full round-trip, or
   whether an alternative (a higher-up way past the fatberg, or finding the brand shallower) should
   exist for a genuinely shorter clean run. Design call, not a bug — flagged for the owner.
4. **Re-audit after map edits** with `tools/clean-run-path.mjs`; corruption-faucet tuning can now
   proceed against a measured baseline (the clean path is clock-bound, not corruption-bound).

## Tools
- `tools/clean-run-path.mjs` — parses the room graph + `setup.depthOf` + the seal constants, computes
  the minimum-possible escape `deepTurns` vs the warning/seal. Run after any map or depth change.

---

## Addendum — 2026-07-02 re-audit (review R10+C1, the seal economy)

Recommendation 4 earned its keep: the map had grown since this audit, and the floor with it —
**183 → 223** — so the 360 limit had quietly shrunk from 2.0× to **1.6×** of floor without anyone
touching a knob. In the same pass the clock gained its missing charges (review R10+C1): leveling
books `LEVEL_SEAL 15`/level, rests book `REST_TIME 4` × depth (only when the heal heals), shifts
`SHIFT_TIME 2` × depth, wheel/bones `GAMBLE_TIME 1` × depth — all optional acts, floor unchanged.

**Retune: `SEAL_LIMIT` 360 → 440, `SEAL_WARN` 220 → 260.** Arithmetic: floor 223; the tool's
rule-of-thumb real focused run 1.4–1.7× ≈ 312–379; + 2–3 lessons ≈ 342–424; + one mid-run rest
≈ 350–440. A double-descent re-diver (≈ 446 on moves alone) still seals. Tool re-run green:
best case 223 stays under the 260 warning, 49% headroom at 440. The knob comment in
`sewer-demons.twee` carries the same arithmetic.
