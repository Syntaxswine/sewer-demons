# Sewer Demons build: compile the Twee source, then sync image assets into dist/.
# The compiled HTML lives in dist/ (git-ignored); committed art lives in img/ at the
# repo root. The combat portraits load img/enemy/<id>.png RELATIVE TO THE HTML, so the
# images must sit under dist/. This copies img/ -> dist/img/ after compiling.
#
# Run:  .\build.ps1      (then serve dist/ as usual — the preview config "sewer-demons")

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# 0) regenerate the in-game map data (baked force-layout positions + adjacency) from
#    the current passages, so src/map-data.twee never drifts from the real map.
& node (Join-Path $root "tools\passage-graph.mjs") --embed
if (-not $?) { Write-Error "map-data embed failed"; exit 1 }

# 1) compile — emit BOTH outputs: index.html (what the preview server serves at /)
#    and sewer-demons.html (the named copy). Tweego needs TWEEGO_PATH pointed at the
#    2.37 storyformat or it falls back to the bundled 2.30 and fails on the version.
$tweego = Join-Path $root ".tools\tweego.exe"
$srcDir = Join-Path $root "src"
$env:TWEEGO_PATH = Join-Path $root ".tools\storyformats"
# dist/ is git-ignored, so a fresh clone (or a new worktree) has none and tweego will
# not create the parent directory for its own output.
$distDir = Join-Path $root "dist"
if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir -Force | Out-Null }
& $tweego -o (Join-Path $root "dist\index.html")        $srcDir
if (-not $?) { Write-Error "tweego compile failed (index.html)"; exit 1 }
& $tweego -o (Join-Path $root "dist\sewer-demons.html") $srcDir
if (-not $?) { Write-Error "tweego compile failed (sewer-demons.html)"; exit 1 }

# 1b) link integrity — fail the build before art sync if any <<goto>> target is
#     missing (passage-graph.mjs --check exits 1 on a dead link). Cheap dead-link gate.
& node (Join-Path $root "tools\passage-graph.mjs") --check
if (-not $?) { Write-Error "link check failed (a <<goto>> points at a missing passage)"; exit 1 }

# 1c) reachability — fail the build if any room is unreachable from its layer's entries
#     (a disconnect; dynamic combat-return landers are accounted for). --reachable exits 1.
& node (Join-Path $root "tools\passage-graph.mjs") --reachable
if (-not $?) { Write-Error "reachability check failed (a room is disconnected - see the UNREACHABLE list)"; exit 1 }
# (Diagnostic, not gated: `node tools/passage-graph.mjs --oneway` lists one-way edges —
#  run it after a rewire to spot a break cut in only one direction.)

# 1d) sprite scenes — fail the build if a hand-authored SCENE_ROOM override names a room
#     that is not a passage, or a prop/wall/ground that is not in the sprite pack. Both
#     fail SILENTLY at runtime (an empty corner of a picture nobody inspects), so they
#     have to be caught here. Exits 1 on a fault.
& node (Join-Path $root "tools\scene-probe.mjs")
if (-not $?) { Write-Error "scene probe failed (a diorama override points at nothing - see the FAULT list)"; exit 1 }

# 1e) sprite pack — verify the committed sprites still match the Animal Factory Tactics
#     art they were baked from. SKIPS cleanly (exit 0) when that checkout is absent, so a
#     fresh clone without the private art repo can still build and play.
& python (Join-Path $root "tools\prepare-sprites.py") --check
if (-not $?) { Write-Error "sprite pack is stale - rerun tools/prepare-sprites.py"; exit 1 }

# 2) sync art into dist (so img/enemy/<id>.png resolves when serving dist/)
$srcImg = Join-Path $root "img"
$dstImg = Join-Path $root "dist\img"
if (Test-Path $srcImg) {
    if (-not (Test-Path $dstImg)) { New-Item -ItemType Directory -Path $dstImg -Force | Out-Null }
    Copy-Item -Path (Join-Path $srcImg "*") -Destination $dstImg -Recurse -Force
    Write-Host "Synced img/ -> dist/img/"
}

Write-Host "Build OK."
