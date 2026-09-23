#!/usr/bin/env python3
"""Import the Animal Factory Tactics environment art into the Sewer Demons sprite pack.

The Tactics art is 1254x1254 painterly 3/4-isometric props with generous transparent
margins, plus flat overhead ground textures. The game that ships it does the cropping
and scaling live, in canvas, from tables in `dist/tactics/environment*.js`. A Twine
game has no build step worth speaking of and loads its images straight off disk, so we
bake that work in instead: crop to the calibrated bounds, scale once, write a small PNG,
and record the placement numbers in a manifest the story renderer reads.

Two numbers per asset matter and both come from Tactics, not from us:

  crop      the alpha>=64 bounds its own catalog tool measured
  scale     the world size rule in `environment.js` -- a prop's drawn box is
            (w+h)*25 wide by (w+h)*11 + (43 if tall else 18) tall at zoom 1,
            unless it overrides with visualWidth/visualHeight

Re-deriving either by eye would silently break the relative scale between a barrel and
a door, so this tool transcribes them. EDGE art (walls, fences, doors, jail bars) also
carries a `baseline` quad -- the two ends of its ground line plus its pixel height in
the source -- which the renderer shears onto an isometric tile edge. Baking the crop
moves that quad, so we transform it here and write the moved one out.

Usage:  python tools/prepare-sprites.py [--from PATH] [--check]

  --from   the Animal Factory Tactics checkout (default: ../animal-factory-tactics)
  --check  verify img/sprite/ matches what this tool would write, and exit non-zero
           if it does not. The build gate uses this; it writes nothing.
"""

import argparse
import hashlib
import json
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: python -m pip install Pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "img", "sprite")

TILE = (56, 28)          # Tactics' isometric tile, 2:1. Everything below is in its units.
MAX_EDGE = 256           # runtime PNG cap; props draw at <= 87px at zoom 1, so this is 2x+
GROUND_SIZE = 256        # ground textures are square and tile, so one size fits

# ---- the import table ------------------------------------------------------------
#
# Every entry is art that already reads as a sewer. Rejected on purpose: foliage
# (tree, bush, reeds, shore, river banks), ground-grass -- nothing grows down there;
# guns and ammo -- Sewer Demons' catalog stops at the steel maul; botanical-chamber.
# `use` is why the sewer wants it, and is carried into the provenance file so a
# later reader can tell a deliberate import from a scrape.

GROUNDS = {
    "ground-concrete": "poured sewer floor -- the default for every built room",
    "ground-tiles":    "glazed brick and tile: the bathhouse, the reflecting hall, the older works",
    "ground-gravel":   "grit beds, the grit trap, silt floors that were never finished",
    "ground-dirt":     "cut-and-cover earth, the old drains, anything dug rather than poured",
    "ground-asphalt":  "under the street -- the storm drains where the topside road is the ceiling",
    "river-water":     "standing water: the drowned galleries, the cistern, the sump",
}

# id -> (source file, crop, footprint w, footprint h, tall, visualWidth, visualHeight, use)
PROPS = {
    "barrel-single":      ("barrel-single.png",      [322, 88, 931, 1173],   1, 1, 0, None, None, "a drum of something the works would rather not name"),
    "barrels-cluster":    ("barrels-cluster.png",    [229, 164, 1047, 1125], 1, 1, 0, None, None, "drums stacked where a passage widens"),
    "crate-wood":         ("crate-wood.png",         [119, 71, 1135, 1193],  1, 1, 0, None, None, "swept-down freight -- the drum store, the lost and found"),
    "crate-steel":        ("crate-steel.png",        [63, 181, 1207, 1125],  1, 1, 0, None, None, "a chest that survived the water"),
    "crate-stack":        ("crate-stack.png",        [168, 122, 1110, 1098], 1, 1, 1, None, None, "cover, and something to climb"),
    # pallet is a flat board: Tactics special-cases it to (w+h)*11 + 1 rather than + 18,
    # so it lies down instead of standing up. Transcribed as an explicit override.
    "pallet":             ("pallet.png",             [98, 268, 1157, 974],   1, 1, 0, None, 23,   "duckboard over standing filth"),
    "sandbags":           ("sandbags.png",           [24, 280, 1230, 1091],  1, 1, 0, None, None, "a flood barrier somebody gave up on"),
    "table-wood":         ("table-wood.png",         [60, 123, 1195, 1125],  2, 1, 0, None, None, "a stall counter in the Shambles"),
    "table-steel":        ("table-steel.png",        [78, 68, 1176, 1181],   2, 1, 0, None, None, "the butcher's bench"),
    "workbench-vise":     ("workbench-vise.png",     [47, 25, 1208, 1227],   2, 1, 0, None, None, "the smith's stall, the gauge house"),
    "workbench-metal":    ("workbench-metal.png",    [38, 20, 1233, 1227],   2, 1, 0, None, None, "maintenance, the pump room"),
    "lab-bench":          ("facility/lab-bench.png", [58, 84, 1224, 1238],   2, 1, 0, None, None, "the Surgery's instrument bench"),
    "lab-control-console":("facility/lab-control-console.png", [214, 50, 1085, 1208], 1, 1, 0, None, None, "the valve puzzle, the vent control"),
    "medical-exam-table": ("facility/medical-exam-table.png",  [47, 66, 1221, 1196],  2, 1, 0, None, None, "where the Fleshcutter works"),
    "medical-surgical-table": ("facility/medical-surgical-table.png", [34, 55, 1218, 1169], 2, 1, 0, None, None, "the graft table in the Surgery"),
    "medicine-cabinet":   ("facility/medicine-cabinet.png",    [298, 20, 992, 1243],  1, 1, 1, None, None, "the salve cupboard"),
    "hospital-bed":       ("hospital/hospital-bed.png",        [26, 66, 1235, 1193],  1, 2, 0, None, None, "the Ward -- L8 keeps one"),
    "wheeled-stretcher":  ("hospital/wheeled-stretcher.png",   [42, 143, 1222, 1171], 1, 2, 0, None, None, "how the rendering works moves what it is given"),
    "instrument-trolley": ("hospital/instrument-trolley.png",  [204, 50, 1122, 1211], 1, 1, 0, None, None, "the tray the Fleshcutter wheels over"),
    "bedside-monitor":    ("hospital/bedside-monitor.png",     [265, 56, 991, 1207],  1, 1, 0, None, None, "a dial that watches something"),
    "iv-stand":           ("hospital/iv-stand.png",            [365, 32, 902, 1221],  1, 1, 0, None, 60,   "a drip stand, gone green"),
    "scrub-sink":         ("hospital/scrub-sink.png",          [75, 121, 1212, 1198], 1, 2, 0, None, None, "the only clean thing in the room"),
    "supply-chest-closed":("containers/supply-chest-closed.png", [63, 181, 1207, 1125], 1, 1, 0, None, None, "lootable, shut"),
    "supply-chest-open":  ("containers/supply-chest-open.png",   [61, 59, 1206, 1173],  1, 1, 0, None, None, "lootable, emptied"),
    "wooden-crate-closed":("containers/wooden-crate-closed.png", [119, 71, 1135, 1193], 1, 1, 0, None, None, "lootable, shut"),
    "wooden-crate-open":  ("containers/wooden-crate-open.png",   [119, 63, 1138, 1195], 1, 1, 0, None, None, "lootable, emptied"),
    "toolbox-closed":     ("containers/toolbox-closed.png",      [107, 417, 1199, 1204], 1, 1, 0, None, None, "a maintenance kit"),
    "toolbox-open":       ("containers/toolbox-open.png",        [89, 53, 1203, 1204],   1, 1, 0, None, None, "a maintenance kit, turned out"),
    "first-aid-kit":      ("loot/first-aid-kit.png",  [83, 135, 1178, 1134],  1, 1, 0, None, 12, "a salve tin on the floor"),
    "spare-parts":        ("loot/spare-parts.png",    [102, 120, 1214, 1081], 1, 1, 0, None, 12, "scrap worth coin"),
    "wire-cutters":       ("loot/wire-cutters.png",   [95, 116, 1190, 1184],  1, 1, 0, None, 12, "a tool on the ground"),
    "roof-corrugated-flat":   ("roof-corrugated-flat.png",   [67, 253, 1187, 1036],  2, 2, 0, None, None, "a Shambles shanty roof"),
    "roof-corrugated-sloped": ("roof-corrugated-sloped.png", [64, 166, 1213, 1119],  2, 2, 0, None, None, "a Shambles shanty roof"),
}
GROUND_LAYER = {"roof-corrugated-flat", "roof-corrugated-sloped"}

# ---- NEW art, drawn for this game -------------------------------------------------
#
# Sewer Demons needs things a farm never had: a pipe mouth, a sluice gate, meat hooks,
# a rendering vat, the flesh walls of the Belly. Add them HERE, not above -- the tables
# above are transcriptions of somebody else's calibration and should stay that way, so
# that re-importing Tactics art never silently reverts a local drawing.
#
# Drop the PNG at art/source/prop/<id>.png (or art/source/edge/<id>.png), 1254x1254,
# transparent, drawn to the contract in art/SPRITES.md, then add one line. `crop: None`
# means "measure it" -- the tool finds the alpha>=64 bounds itself, so nobody has to
# read pixel coordinates off an image by hand.
#
# id -> (source file under art/source/prop/, crop or None, w, h, tall, vW, vH, use)
LOCAL_PROPS = {}

# id -> (source file under art/source/edge/, crop or None, baseline or None, height, use)
# A baseline of None is measured too: the ends of the piece's ground line are taken as
# the bottom corners of its alpha bounds and its height as their distance to the top.
# That is right for a flat slab drawn square to the tile and WRONG for anything drawn
# on a slant, so check the result in the viewer and write the quad out by hand if the
# piece skews. See art/SPRITES.md.
LOCAL_EDGES = {}

# id -> (source file, crop, baseline, drawn height, use)
# baseline is [x0, y0, x1, y1, sourceHeight] -- the ends of the ground line in source
# pixels, and how tall the piece stands there. The renderer shears the art onto a tile
# edge with it, so it must move with the crop.
EDGES = {
    "wall-concrete":    ("wall-concrete.png",    [75, 143, 1211, 1176],  [139, 1175, 1185, 578, 415], 72, "poured wall -- the default"),
    "wall-brick":       ("wall-brick.png",       [62, 96, 1206, 1210],   [143, 1209, 1200, 634, 510], 72, "Victorian brick: the old drains, the galleries"),
    "wall-corrugated":  ("wall-corrugated.png",  [154, 51, 1130, 1214],  [193, 1213, 1095, 746, 670], 72, "the Shambles -- hell builds in sheet metal"),
    "window-concrete":  ("window-concrete.png",  [113, 56, 1175, 1219],  [176, 1218, 1135, 808, 720], 72, "a gauge window, an observation slit"),
    "window-brick":     ("window-brick.png",     [36, 16, 1221, 1242],   [95, 1241, 1210, 847, 785],  72, "a light well in old brick"),
    "door-steel-closed":("door-steel-closed-v2.png",      [399.52263906856405, 67.0, 854.4773609314359, 1187.0], [405.31824062095734, 1179.7554980595085, 847.2328589909444, 992.8473479948253, 902.6649417852523], 72, "a sluice door, a valve chamber"),
    "door-wood-closed": ("door-wood-closed-v2.png",       [425.02083333333337, 67.0, 828.9791666666667, 1187.0], [430.8541666666667, 1178.25, 824.6041666666667, 997.4166666666666, 920.2083333333333],          72, "a stall door in the Shambles"),
    "doorway-concrete-open": ("doorway-concrete-open-v2.png", [377.6569343065694, 67.0, 876.3430656934306, 1187.0], [403.81751824817525, 1178.8248175182482, 846.9124087591241, 995.7007299270073, 909.0802919708029], 72, "the open arch between rooms"),
    "fence-railing":    ("fence-railing.png",    [27, 134, 1241, 1166],  [100, 1165, 1175, 652, 495], 20, "a catwalk rail over a drop"),
    "fence-chainlink":  ("fence-chainlink.png",  [119, 32, 1142, 1216],  [153, 1215, 1110, 658, 620], 44, "a grille you can see through"),
    "fence-cut":        ("fence-chainlink-cut.png", [119, 32, 1142, 1216], [230, 1165, 1110, 694, 530], 44, "the same grille, opened"),
    "jail-bars":        ("facility/jail-bars.png",       [334, 9, 920, 1205], [350, 1190, 907, 950, 900], 62, "the Holding, the Cage Act, the pens"),
    "jail-door-closed": ("facility/jail-door-closed.png",[335, 9, 920, 1204], [350, 1190, 907, 950, 900], 62, "the same, with a gate"),
}


class SourceMissing(Exception):
    """The Tactics checkout is not here. Fatal when importing, a skip when checking:
    the sprites are committed, so a stranger who clones this repo can build and play
    without the private art repo the pack came from."""


def prop_box(w, h, tall, vw, vh):
    """The drawn box in tile pixels at zoom 1 -- environment.js's rule, transcribed."""
    max_w = vw if vw is not None else (w + h) * 25
    max_h = vh if vh is not None else (w + h) * 11 + (43 if tall else 18)
    return max_w, max_h


def measure_crop(im):
    """The alpha>=64 bounds -- the same threshold Tactics' own catalog tool used, so a
    measured crop and a transcribed one mean the same thing."""
    mask = im.getchannel("A").point(lambda a: 255 if a >= 64 else 0)
    bb = mask.getbbox()
    if not bb:
        raise ValueError("image is fully transparent at alpha>=64")
    return list(bb)


def measure_baseline(box):
    """A default ground line for a slab drawn square to the tile: left-bottom corner to
    right-bottom corner of the crop, standing the full height of it."""
    w, h = box
    return [0.0, float(h - 1), float(w - 1), float(h - 1), float(h - 1)]


def fit(im, cap):
    if max(im.size) <= cap:
        return im, 1.0
    s = cap / max(im.size)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS), s


def digest(path):
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:16]


def build(src_root, out_root):
    """Write every sprite and return the manifest. Pure apart from the file writes."""
    env = os.path.join(src_root, "dist", "assets", "environment")
    if not os.path.isdir(env):
        raise SourceMissing(env)

    manifest = {
        "version": 1,
        "tile": list(TILE),
        "note": "Baked from Animal Factory Tactics. Placement numbers are ITS calibration, "
                "not ours -- see tools/prepare-sprites.py and art/SPRITES.md.",
        "grounds": {}, "props": {}, "edges": {},
    }

    for name in ("ground", "prop", "edge"):
        os.makedirs(os.path.join(out_root, name), exist_ok=True)

    for gid, use in sorted(GROUNDS.items()):
        sub = "foliage/" if gid.startswith("river") else ""
        src = os.path.join(env, sub + gid + ".png")
        im = Image.open(src).convert("RGB").resize((GROUND_SIZE, GROUND_SIZE), Image.LANCZOS)
        rel = "ground/%s.png" % gid
        im.save(os.path.join(out_root, rel), optimize=True)
        manifest["grounds"][gid] = {"file": rel, "size": [GROUND_SIZE, GROUND_SIZE], "use": use}

    local = os.path.join(REPO, "art", "source")
    all_props = [(pid, env, v) for pid, v in PROPS.items()]
    all_props += [(pid, os.path.join(local, "prop"), v) for pid, v in LOCAL_PROPS.items()]
    for pid, root, (fname, crop, w, h, tall, vw, vh, use) in sorted(all_props):
        im = Image.open(os.path.join(root, fname)).convert("RGBA")
        im = im.crop(tuple(int(round(v)) for v in (crop or measure_crop(im))))
        im, _ = fit(im, MAX_EDGE)
        rel = "prop/%s.png" % pid
        im.save(os.path.join(out_root, rel), optimize=True)
        bw, bh = prop_box(w, h, tall, vw, vh)
        manifest["props"][pid] = {
            "file": rel, "size": list(im.size), "footprint": [w, h],
            "box": [bw, bh], "groundLayer": pid in GROUND_LAYER, "use": use,
        }

    all_edges = [(eid, env, v) for eid, v in EDGES.items()]
    all_edges += [(eid, os.path.join(local, "edge"), v) for eid, v in LOCAL_EDGES.items()]
    for eid, root, (fname, crop, base, height, use) in sorted(all_edges):
        full = Image.open(os.path.join(root, fname)).convert("RGBA")
        x0, y0, x1, y1 = (int(round(v)) for v in (crop or measure_crop(full)))
        im = full.crop((x0, y0, x1, y1))
        base = base or measure_baseline(im.size)
        pre = im.size
        im, _ = fit(im, MAX_EDGE)
        s = im.width / pre[0]
        # the baseline quad lived in SOURCE pixels; move it into the baked image
        bx0, by0, bx1, by1, sh = base
        moved = [(bx0 - x0) * s, (by0 - y0) * s, (bx1 - x0) * s, (by1 - y0) * s, sh * s]
        rel = "edge/%s.png" % eid
        im.save(os.path.join(out_root, rel), optimize=True)
        manifest["edges"][eid] = {
            "file": rel, "size": list(im.size),
            "baseline": [round(v, 3) for v in moved], "height": height, "use": use,
        }

    return manifest


TWEE_HEADER = """:: SpriteData [script]
/* GENERATED by tools/prepare-sprites.py -- DO NOT EDIT BY HAND.

   The sprite manifest, baked into the story the same way map-data.twee bakes the room
   graph. It is duplicated at img/sprite/manifest.json for tooling and the art viewer;
   this copy exists because a Twine game is one HTML file that people open off a disk,
   and fetch() on a file:// origin is blocked. Reading it from a script passage costs
   nothing and cannot fail.

   grounds  id -> square tiling texture, skewed onto the tile diamond at draw time
   props    id -> free-standing art + [w,h] tile footprint + [maxW,maxH] drawn box
   edges    id -> wall/fence/door art + the baseline quad the renderer shears it onto
*/
"""


def write_twee(manifest):
    path = os.path.join(REPO, "src", "sprite-data.twee")
    body = json.dumps(manifest, sort_keys=True, separators=(",", ":"))
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(TWEE_HEADER)
        fh.write("setup.spriteData = " + body + ";\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="src", default=os.path.join(os.path.dirname(REPO), "animal-factory-tactics"))
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--selftest", action="store_true",
                    help="prove the auto-measured crop still reproduces Tactics' own catalog numbers")
    args = ap.parse_args()

    if args.selftest:
        # The handoff contract in art/SPRITES.md says: drop a PNG in, the tool measures
        # its crop. That promise is only worth anything if the measurement agrees with
        # the ones a person calibrated by hand -- so check it against all 33 of them.
        # (The three v2 doors are excluded: their crops are polygon cuts that deliberately
        # remove surrounding wall, not alpha bounds, so they SHOULD disagree.)
        env = os.path.join(args.src, "dist", "assets", "environment")
        if not os.path.isdir(env):
            print("SKIP: no Tactics art at %s" % env)
            return
        worst, n = (0, None), 0
        for pid, (fname, crop, *_rest) in sorted(PROPS.items()):
            auto = measure_crop(Image.open(os.path.join(env, fname)).convert("RGBA"))
            d = max(abs(a - b) for a, b in zip(auto, crop))
            n += 1
            if d > worst[0]:
                worst = (d, pid)
        if worst[0] > 1:
            sys.exit("FAIL: auto-measured crop drifts from the calibrated one by %d px on %s"
                     % worst)
        print("OK: auto-measured crop reproduces all %d calibrated crops (worst delta %d px)"
              % (n, worst[0]))
        return

    if args.check:
        # Rebuild into a scratch tree and compare byte-for-byte against what is committed.
        import tempfile, filecmp
        with tempfile.TemporaryDirectory() as tmp:
            try:
                fresh = build(args.src, tmp)
            except SourceMissing as miss:
                print("SKIP: no Tactics art at %s -- committed sprites left unchecked" % miss)
                return
            live_path = os.path.join(OUT, "manifest.json")
            if not os.path.exists(live_path):
                sys.exit("FAIL: img/sprite/manifest.json is missing")
            live = json.load(open(live_path, encoding="utf-8"))
            if live != fresh:
                sys.exit("FAIL: manifest.json is stale -- rerun tools/prepare-sprites.py")
            bad = []
            for group in ("grounds", "props", "edges"):
                for sid, entry in fresh[group].items():
                    a, b = os.path.join(tmp, entry["file"]), os.path.join(OUT, entry["file"])
                    if not os.path.exists(b) or not filecmp.cmp(a, b, shallow=False):
                        bad.append(entry["file"])
            if bad:
                sys.exit("FAIL: %d sprite(s) differ from the source art: %s" % (len(bad), ", ".join(sorted(bad)[:6])))
            twee = os.path.join(REPO, "src", "sprite-data.twee")
            if not os.path.exists(twee):
                sys.exit("FAIL: src/sprite-data.twee is missing")
            want = TWEE_HEADER + "setup.spriteData = " + json.dumps(fresh, sort_keys=True, separators=(",", ":")) + ";\n"
            if open(twee, encoding="utf-8").read().replace("\r\n", "\n") != want:
                sys.exit("FAIL: src/sprite-data.twee is stale -- rerun tools/prepare-sprites.py")
            n = sum(len(fresh[g]) for g in ("grounds", "props", "edges"))
            print("OK: %d sprites match the Tactics source art, manifest and story data in sync" % n)
        return

    try:
        manifest = build(args.src, OUT)
    except SourceMissing as miss:
        sys.exit("no environment art at %s -- pass --from <animal-factory-tactics checkout>" % miss)
    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(manifest, fh, indent=1, sort_keys=True)
        fh.write("\n")
    write_twee(manifest)

    total = sum(os.path.getsize(os.path.join(OUT, e["file"]))
                for g in ("grounds", "props", "edges") for e in manifest[g].values())
    print("%d grounds · %d props · %d edges  ->  img/sprite/  (%.1f MB)"
          % (len(manifest["grounds"]), len(manifest["props"]), len(manifest["edges"]), total / 1e6))


if __name__ == "__main__":
    main()
