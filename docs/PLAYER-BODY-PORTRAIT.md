# Static player body portrait

The sidebar now assembles six painted PNG sections from the current body state: head, torso, left/right arms, and left/right legs. This is a static body inspection portrait. All parts share a fixed stance, upper-left lighting, and a 384 x 640 canvas. There is no animated rig or physics.

## Artwork and preview

- `img/player-state/index.html`: independent part selectors, full-stage gallery, and three background choices. The build copies this to `dist/img/player-state/index.html`.
- `img/player-state/`: 60 transparent PNGs and `manifest.json`.
- `art/player-state/source/`: ten full-resolution painted sources, generated with built-in ImageGen.
- `art/player-state/prompts.json`: exact prompts, reference paths, generation IDs, and the final filth refinement.
- `art/player-state/mixed-review.png`: mixed-body visual review on a light background.

One human design plus rat, pig, and filth at tainted/turning/turned gives ten variants, each exported into six sections. Human and tingle reuse the human anatomy; the existing text still distinguishes tingling. Brown filth follows the owner's preferred sludge art direction, while the existing prose retains its grey terminology. Left/right are anatomical: the player's right arm appears on the left of the portrait.

The body inspection portrait deliberately uses fixed ragged shorts and exposed limbs so the state remains visible. Equipment and surgical graft visuals, extra appearance presets, tails, smoke-specific anatomy, and additional enemy-specific transformation tracks are not part of this six-region set. Equipment mechanics and the existing combat portraits are unchanged.

## Joins

`tools/prepare-player-state.cjs` contains the common section masks measured on the 1254px source canvas. Shoulders are divided along diagonal contours, the neck overlaps at its base, and upper legs extend underneath the ragged shorts. Lower layers keep opaque underlap; the overlying torso and neck feather across it. Two half-transparent edges would make a hole, so the masks do not use that construction.

Leg masks exclude the hands that hang beside the upper thighs. All output sections receive the same final crop, not individual bounding-box crops. This preserves registration. Fully transparent RGB pixels are cleared for smaller files. Preparation does not repaint the generated anatomy.

Draw order: right leg, left leg, right arm, left arm, torso, head. File names follow `<variant>-<segment>.png`, for example `rat-turning-armL.png`.

## Game integration

`src/player-body-portrait.twee` supplies the widget, styles, and resolver. `StoryCaption` calls the widget above the existing six text readings. Sidebar formatting uses `nobr` to suppress source-code line breaks rather than inserting large empty spaces.

Selection calls the existing `segStage` and `segClass` helpers. A turned region uses its locked `$form` class, not the current dominant exposure bucket. Before turning, artwork uses total corruption and the dominant class. The portrait does not alter corruption, stats, thresholds, or saving rules.

`recomputeBody` queues a signature-checked sidebar refresh after inline actions finish, including overflow. This covers washing, graft costs, and bargains that do not navigate to a new passage. Normal navigation/save restoration still uses the standard StoryCaption render. Accessible text describes each part, its stage, and its corruption percentage; layer images are decorative.

## Rebuild and checks

With Node packages `sharp` and `playwright` available (locally or through `NODE_PATH`):

```powershell
node tools/prepare-player-state.cjs
./build.ps1
node tools/check-player-state.cjs
```

The repository's Tweego/SugarCube toolchain is required for the build. The browser check uses installed Edge on Windows (`PLAYER_BROWSER` can select another Playwright channel), or Playwright Chromium elsewhere.

Checks cover all 60 PNGs, dimensions and transparency, stray hand pixels in leg sections, 300 sampled opaque joins across mixed combinations, every region/class at the boundary values 0/29/30/49/50/74/75/99/100, independence of limbs, mixed exposure dominance, washing, permanent forms, overflow, inline sidebar refresh, gallery asset loading, and narrow-screen fit. Browser review screenshots are written to ignored `dist/`. These sampled joins support, but do not replace, visual review of arbitrary mixtures.
