#!/usr/bin/env python3
"""Draw each generated layer map as a labelled floorplan PNG.

The maps are 240x240 tiles of JSON and the only other way to look at one is to load it
into the Tactics editor, which is a browser app -- fine for editing, useless for reviewing
nine maps at once or for telling whether a rewire moved what you meant. This renders them
flat and overhead, which is also the more honest view for judging LAYOUT: the isometric
one the game draws is prettier and hides exactly the things you want to check here, like
whether two chambers have quietly merged or a corridor ploughs through a third room.

Writes maps/preview/layerN-<slug>.png, and with --sheet a single contact sheet of all nine.

Usage:  python tools/preview-layer-maps.py [--sheet] [--scale 3]
"""

import argparse
import glob
import json
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required: python -m pip install Pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
MAPS = os.path.join(REPO, "maps")
OUT = os.path.join(MAPS, "preview")

# floor colours, keyed the way the map keys its terrain
FLOOR = {
    "ground-asphalt":  (74, 74, 78),
    "ground-concrete": (126, 126, 120),
    "ground-dirt":     (104, 84, 62),
    "ground-gravel":   (128, 124, 112),
    "ground-tiles":    (116, 122, 122),
    "ground-grass":    (86, 110, 64),
    "water":           (48, 72, 96),
}
ROCK = (16, 18, 15)
WALL = (232, 214, 150)
DOOR = (120, 200, 140)
PROP = (196, 108, 72)
ROOM_TINT = {                       # a wash over the chamber, by what the room is for
    "room":   (255, 255, 255, 0),
    "rest":   (90, 200, 120, 46),
    "fight":  (210, 80, 70, 52),
    "lander": (110, 130, 170, 40),
    "ending": (220, 190, 90, 60),
}


def font(size):
    for name in ("consola.ttf", "DejaVuSansMono.ttf", "cour.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def render(map_path, rooms_path, scale):
    m = json.load(open(map_path, encoding="utf-8"))
    side = json.load(open(rooms_path, encoding="utf-8"))
    w, h = m["width"], m["height"]

    img = Image.new("RGB", (w * scale, h * scale), ROCK)
    px = img.load()
    for y in range(h):
        row = m["terrain"][y]
        for x in range(w):
            t = row[x]
            if t == "void":
                continue
            c = FLOOR.get(t, (150, 150, 150))
            for dy in range(scale):
                for dx in range(scale):
                    px[x * scale + dx, y * scale + dy] = c

    d = ImageDraw.Draw(img, "RGBA")

    # chamber tint + label
    for r in side["rooms"]:
        tint = ROOM_TINT.get(r["role"], ROOM_TINT["room"])
        if tint[3]:
            d.rectangle([r["x"] * scale, r["y"] * scale,
                         (r["x"] + r["w"]) * scale - 1, (r["y"] + r["h"]) * scale - 1], fill=tint)

    # walls and doorways sit ON the edge between two tiles
    for key, kind in m["edges"].items():
        axis, xs, ys = key.split(":")[:3]
        x, y = int(xs), int(ys)
        colour = DOOR if kind.startswith("doorway") else WALL
        if axis == "e":
            d.line([(x + 1) * scale, y * scale, (x + 1) * scale, (y + 1) * scale], fill=colour)
        else:
            d.line([x * scale, (y + 1) * scale, (x + 1) * scale, (y + 1) * scale], fill=colour)

    for p in m.get("props", []):
        d.rectangle([p["x"] * scale, p["y"] * scale, (p["x"] + 1) * scale - 1, (p["y"] + 1) * scale - 1], fill=PROP)

    f = font(max(9, 3 * scale))
    for r in side["rooms"]:
        label = r["name"].replace("The", "", 1) or r["name"]
        d.text((r["x"] * scale + 2, r["y"] * scale + 1), label, fill=(18, 20, 16), font=f)
        d.text((r["x"] * scale + 1, r["y"] * scale), label, fill=(240, 236, 220), font=f)

    for s in m["starts"]:
        d.ellipse([s["x"] * scale - 3, s["y"] * scale - 3, s["x"] * scale + 3, s["y"] * scale + 3], fill=(120, 220, 255))
    e = m["exits"][0]
    d.ellipse([e["x"] * scale - 4, e["y"] * scale - 4, e["x"] * scale + 4, e["y"] * scale + 4], fill=(255, 210, 80))

    title = "%s   %d rooms · %d props · band %s" % (side["name"], len(side["rooms"]), len(m.get("props", [])), side["band"])
    d.rectangle([0, 0, img.width, 22], fill=(10, 12, 9))
    d.text((6, 5), title, fill=(200, 190, 140), font=font(14))
    return img


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scale", type=int, default=3)
    ap.add_argument("--sheet", action="store_true")
    args = ap.parse_args()

    os.makedirs(OUT, exist_ok=True)
    pairs = []
    for map_path in sorted(glob.glob(os.path.join(MAPS, "layer*.json"))):
        if map_path.endswith(".rooms.json"):
            continue
        rooms_path = map_path[:-5] + ".rooms.json"
        if not os.path.exists(rooms_path):
            continue
        pairs.append((map_path, rooms_path))

    images = []
    for map_path, rooms_path in pairs:
        img = render(map_path, rooms_path, args.scale)
        name = os.path.basename(map_path)[:-5] + ".png"
        img.save(os.path.join(OUT, name), optimize=True)
        images.append((name, img))
        print("%-42s %dx%d" % (name, img.width, img.height))

    if args.sheet and images:
        cols = 3
        tw = 520
        thumbs = []
        for name, img in images:
            t = img.copy()
            t.thumbnail((tw, tw))
            thumbs.append(t)
        cw, ch = max(t.width for t in thumbs), max(t.height for t in thumbs)
        rows = (len(thumbs) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * cw, rows * ch), (8, 10, 7))
        for i, t in enumerate(thumbs):
            sheet.paste(t, ((i % cols) * cw, (i // cols) * ch))
        sheet.save(os.path.join(OUT, "all-layers.png"), optimize=True)
        print("all-layers.png  %dx%d" % sheet.size)


if __name__ == "__main__":
    main()
