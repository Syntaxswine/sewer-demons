# Sewer Demons — Game Spec

A Twine interactive fiction game about a character trapped in a sewer with demons who want to corrupt them. The player's goal is to find a way out **without losing himself**.

---

## 1. Core Concept

- **Setting:** A sewer — a closed, oppressive pressure-cooker environment.
- **Antagonists:** Demons who want to corrupt the player character.
- **Dual objective:**
  - **Physical:** Find a way out.
  - **Psychological:** Stay yourself — don't succumb to corruption.
- **Central tension:** Escape and corruption pull against each other. The demons offer *real* advantages (shortcuts, knowledge of the exit, protection), but each costs a piece of the character. Pure resistance keeps you clean but can leave you lost, hurt, or stuck.

---

## 2. Engine: SugarCube (not Harlowe)

**Decision: SugarCube**, for these reasons:

- Built-in audio system (`<<audio>>`, `<<playlist>>`, `<<cacheaudio>>`, `<<createplaylist>>`, plus the `SimpleAudio` API).
- Audio persists across passage changes automatically — no page reload on navigation, so music keeps playing without losing its place.
- Supports looping, crossfading, volume fades, and layering ambience under music — all useful for a rising-dread horror game.
- Harlowe has **no** native audio support; continuous cross-passage playback would require manual HTML5 `<audio>` + JavaScript and is painful.

---

## 3. Corruption System

- Track corruption in a story variable: `$corruption` (numeric, e.g. 0–100).
- Goes **up** when the player gives in to temptation, takes demonic shortcuts, or accepts "help."
- Optionally goes **down** on resistance or acts of self-affirmation.

**Tiers (example thresholds):**

| Tier | Corruption | Tone |
|------|-----------|------|
| 0 | 0–34 | Clean / wary |
| 1 | 35–69 | Slipping |
| 2 | 70–100 | Deeply corrupted |

**Design choice to settle:** visible meter (strategy) vs. hidden (dread). Hidden is recommended for horror — the player feels consequences without seeing numbers.

**Endings tied to state:**
- Low corruption + found exit → **true escape** (out, as yourself).
- High corruption + found exit → **pyrrhic** (escaped, but something left with you / you're changed).
- Max corruption → **become one of them**.
- Failed to escape → trapped / death endings.

**Writing-level corruption cues** (where the horror actually lives):
- Narration describing things differently as corruption rises.
- Demons becoming friendlier.
- The PC's internal voice shifting.

**Open design question:** Are demons individual named characters with distinct bargains (richer writing) or an ambient force? Named demons are recommended — each can carry its own musical motif (see audio).

---

## 4. Audio System — Fluid, State-Driven Playlist

### 4.1 Requirement

A soundtrack that **re-evaluates game state at each track boundary** and picks the next track from a pool of currently-eligible options. This is *not* a fixed/baked playlist — it must reflect what the player has done by the time each track ends.

### 4.2 Why not `<<playlist>>` / `<<createplaylist>>`

Those macros play a **baked-in snapshot** in order or shuffled. Once created, a playlist does not retroactively change when variables change. A snapshot model would go stale. So we drive **individual tracks** and hook the end-of-track event to run fresh selection logic each time.

### 4.3 Architecture

- Play **one track at a time** via the `SimpleAudio` API.
- On each track's `ended` event, call a chooser function that:
  1. Rebuilds the eligible **pool** from *current* game state.
  2. Picks the next track.
  3. Re-arms the `ended` handler.
  4. Plays.
- Result: any track unlocked, or any threshold crossed, during the previous song is automatically eligible for the next one. No mid-track restart, no snapshot staleness.

### 4.4 Variable conventions

- Use `setup.` for engine-level logic (the chooser function, last-track bookkeeping, event wiring). **Do not** put functions or event handlers in `$` story variables — those get serialized into every save and can choke on non-data.
- Use `$` only for actual game state (e.g. `$corruption`, `$metTheWhisperer`, `$tookTheBargain`).

### 4.5 Caching tracks (`StoryInit`)

```
:: StoryInit
<<cacheaudio "base" "ambient_base.mp3">>
<<cacheaudio "whisper" "whisper_motif.mp3">>
<<cacheaudio "corrupt1" "dark_a.mp3">>
<<cacheaudio "corrupt2" "dark_b.mp3">>
```

### 4.6 The chooser (end-of-track re-evaluation)

```
:: StoryInit  /* continued */
<<run setup.playNext = function () {
    var c = State.variables.corruption;
    var pool = [];

    /* base bed: always eligible, weighted so it stays somewhat likely */
    pool.push("base", "base");

    /* unlock-based eligibility (cumulative history) */
    if (State.variables.metTheWhisperer) pool.push("whisper");

    /* corruption-tier eligibility, weighted to dominate as it climbs */
    if (c >= 35) {
        for (var i = 0; i < Math.floor(c / 20); i++) pool.push("corrupt1");
    }
    if (c >= 70) {
        pool.push("corrupt2", "corrupt2", "corrupt2");
    }

    /* avoid immediate repeat of the last track */
    if (pool.length > 1 && setup.lastTrack) {
        pool.delete(setup.lastTrack);   // SugarCube array .delete()
    }

    var pick = pool.random();           // SugarCube adds .random() to arrays
    setup.lastTrack = pick;

    var track = SimpleAudio.tracks(pick);
    track.one("ended", setup.playNext); // re-arm for the next boundary
    track.play();
}>>
```

### 4.7 Kickoff + autoplay unlock

Browsers block autoplay until the user interacts with the page, so the first track must start from a click.

```
:: Start
<<link "Descend">>
  <<run setup.playNext()>>
  <<goto "Sewer1">>
<</link>>
```

### 4.8 Immediate override (optional)

Switching normally only happens at track *ends* — which suits creeping dread. If a plot beat must slam the music **immediately**, force it:

```
<<audio ":playing" stop>>
<<run setup.playNext()>>
```

### 4.9 Optional refinements

- **Track-name indirection:** store track IDs in variables / a map object so a single slot can point at different files by state, and the whole soundtrack can be re-themed by editing one object.
  ```
  <<set $exitTheme to $foundRealExit ? "exit_hope" : "exit_false">>
  ```
  ```
  <<set $musicMap to { base: "ambient_base", whisperer: "whisper_motif", deepcorrupt: "corrupt2" }>>
  ```
- **Crossfade on tonal shift:** `<<audio "..." fadeoverto 2 0>>` to fade out, then bring the new track up, so shifts feel felt rather than jump-cut. (More relevant if mixing in any playlist-style swaps.)
- **Layered selectors:** drive *ambience* by a `$location` variable (deep sewer vs. near exit) and the *musical theme* by corruption tier, for a richer matrix than corruption alone.
- **History-based scoring:** because the pool reads cumulative history, you can gate a motif on a specific moral state — e.g. a track that only enters once the player has both *met* a demon and *refused* it — scoring a state rather than a number.

---

## 5. Recommended File / Passage Structure

- `StoryInit` — cache audio, define `setup.playNext`, init `$corruption` and history flags.
- `Start` — title screen; the "Descend" click does the autoplay unlock and kicks off music.
- `PassageHeader` — good home for any per-passage music/state hooks so they run everywhere automatically without remembering to add them.
- Sewer passages (`Sewer1`, etc.) — gameplay; modify `$corruption` and set history flags (`$metTheWhisperer`, `$tookTheBargain`, …).
- Ending passages keyed off `$corruption` + whether the exit was found.

---

## 6. Open Decisions (carry into build)

1. Corruption meter **visible or hidden**?
2. Demons **named individuals** (with per-demon motifs/bargains) or **ambient force**?
3. Final corruption **thresholds** and how much resistance can lower it (if at all).
4. Whether to layer **location-driven ambience** under corruption-driven theme.
5. Audio assets: filenames, loop points, and how many motif tracks to author.

---

## 7. Build Checklist for Claude Code

- [ ] Set up SugarCube story format in Twine
- [ ] `StoryInit`: cache audio + define `setup.playNext` chooser (pool, weighting, no-repeat, re-arm).
- [ ] `Start` title screen with click-to-unlock audio kickoff.
- [ ] `$corruption` variable + history flags initialized.
- [ ] 2–3 sewer passages that modify corruption/flags so the pool shift is audible.
- [ ] Ending passages keyed off state.
- [ ] Drop in real mp3s, verify cross-passage continuity and end-of-track re-evaluation.
- [ ] (Optional) crossfade, location ambience layer, track-name map.
