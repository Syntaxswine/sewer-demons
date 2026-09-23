# Enemy portraits (drop-in)

The combat screen shows an opponent **portrait** for each enemy. It's a drop-in frame:
the game renders `img/enemy/<id>.png` as the portrait background if the file exists, and
otherwise falls back to a low-opacity **class glyph** placeholder (rat 🐀 / pig 🐗 / filth ☣,
`setup.CLASS_GLYPH`).

## To add real art

Drop a square-ish PNG named after the enemy **id** (the key in `setup.enemies`):

| file | enemy |
|------|-------|
| `rat.png`       | demon rat |
| `ratman.png`    | rat-man |
| `shitgolem.png` | shit-golem (the sewage demon) |
| `crawler.png`   | drain-crawler |
| `drowned.png`   | the drowned |
| `grafted.png`   | grafted thing |
| `gorger.png`    | Gorger |
| `pigdemon.png`  | pig-demon |

No code change needed — the frame picks them up automatically. The portrait box is roughly
5em tall and `background-size: cover`, so any aspect ratio works; square reads best.

## Where the files have to live (important)

Save committed art here, at the repo root: **`img/enemy/<id>.png`**. The compiled game lives
in `dist/` (git-ignored), and the portraits load `img/enemy/<id>.png` *relative to the HTML* —
i.e. from `dist/img/enemy/`. So the art must be copied into `dist/`. **`build.ps1` does this
for you**: it runs Tweego and then syncs `img/ → dist/img/`. After dropping a new PNG in here,
run `.\build.ps1` (instead of calling tweego directly) and the portrait appears.

To override the filename for a specific enemy, set an `img` field on its `setup.enemies` entry
(defaults to the id). The **player** portrait uses `img/player.png`, or `img/player_<class>.png`
once you've fully turned into a class (rat/pig/filth).
