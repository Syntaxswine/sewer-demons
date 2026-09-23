# Audio assets

The chooser in `StoryInit` expects these cached tracks (filenames relative to
the compiled HTML). Drop real `.mp3`s here; until then the game runs silently —
`setup.playNext` guards on `SimpleAudio.has(pick)` so missing files don't throw.

| Cache ID   | File                  | Role                                       |
|------------|-----------------------|--------------------------------------------|
| `base`     | `ambient_base.mp3`    | Always-eligible ambient bed                |
| `whisper`  | `whisper_motif.mp3`   | Unlocks after meeting the Whisperer        |
| `tallow`   | `tallow_motif.mp3`    | Unlocks after meeting Tallow (a Gorger)    |
| `wearer`   | `wearer_motif.mp3`    | Unlocks after meeting the Understudy       |
| `corrupt1` | `dark_a.mp3`          | Eligible at corruption ≥ 35, scales up     |
| `corrupt2` | `dark_b.mp3`          | Dominates at corruption ≥ 70               |

**Named demons each carry their own motif** (boss decision: named individuals +
generic classes). Generic-class encounters (an unnamed gorger, ambient
whispers) don't add tracks — they just nudge corruption, which the tier-based
`corrupt1`/`corrupt2` tracks already reflect.

To re-theme without touching passage code, add a `setup.musicMap` object and
look filenames up through it (see spec §4.9).
