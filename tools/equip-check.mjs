// Sewer Demons — equipment catalog linter.
//   node tools/equip-check.mjs
// Parses setup.items out of src/sewer-demons.twee and checks the DIRECTION-EQUIPMENT
// catalog invariants: every weapon tier present in blunt+edged, every armour tier
// present, dice/AC non-decreasing by tier, every curse covered, every magic-bonus
// type covered, cursed gear has a sane apparentTier. Prints the ladders + coverage +
// the drop-mismatch curse table. Exits non-zero on any failure (a real CI-style gate).
// Pure data — no engine duplication; it reads the SAME object the game ships.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src", "sewer-demons.twee"), "utf8");

// ---- extract the `setup.items = { ... };` object literal (brace-match, skipping
//      strings + comments so braces inside them don't miscount) ----
function extractObject(text, marker) {
  const start = text.indexOf(marker);
  if (start < 0) throw new Error(`could not find ${marker}`);
  let i = text.indexOf("{", start);
  const objStart = i;
  let depth = 0, inStr = null, inLine = false, inBlock = false;
  for (; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inLine) { if (c === "\n") inLine = false; continue; }
    if (inBlock) { if (c === "*" && n === "/") { inBlock = false; i++; } continue; }
    if (inStr) { if (c === "\\") { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === "/" && n === "/") { inLine = true; i++; continue; }
    if (c === "/" && n === "*") { inBlock = true; i++; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { return text.slice(objStart, i + 1); } }
  }
  throw new Error(`unbalanced braces after ${marker}`);
}

const items = eval("(" + extractObject(src, "setup.items = {") + ")");

// expected ladders (mirror the engine's setup.WEAPON_TIERS / ARMOR_TIERS)
const WANTABLE_WEAPON = ["rusty", "copper", "bronze", "iron", "steel"];
const ARMOR_ORDER = ["rags", "clothes", "robes", "leather", "copper", "bronze", "iron", "steel"];
const ALL_CURSES = ["autosurrender", "stat_down", "stat_down_all", "nopickup", "coinrot",
  "irreversible", "always_class", "norun", "noattack", "nospeak", "encounter_up"];
const ALL_MAGIC = ["str", "dex", "con", "int", "wis", "cha", "all", "hp", "ac", "encounter", "dmg"];
const MATERIAL_RANK = { rusty: 1, rags: 1, clothes: 1, robes: 1, copper: 2, leather: 2, bronze: 3, iron: 4, steel: 5 };

const fails = [];
const fail = (m) => fails.push(m);
const dieMax = (d) => { const m = /^(\d+)d(\d+)/.exec(d || ""); return m ? +m[1] * +m[2] : 0; };
const curseIds = (it) => !it.curse ? [] : (Array.isArray(it.curse) ? it.curse : [it.curse]).map(e => typeof e === "string" ? e : e.id);

const gear = Object.entries(items).filter(([, it]) => ["weapon", "armor", "accessory"].includes(it.kind));
const weapons = gear.filter(([, it]) => it.kind === "weapon");
const armors = gear.filter(([, it]) => it.kind === "armor");
const accessories = gear.filter(([, it]) => it.kind === "accessory");

// ---- WEAPON type×tier model (mirror setup.TYPE_DIE / TIER_DMG_BONUS) ----
const TYPE_DIE = { dagger: "1d4", hook: "1d6", spear: "1d6", sword: "1d8", axe: "1d10", hammer: "1d12" };
const TYPE_DTYPE = { dagger: "edged", hook: "edged", spear: "edged", sword: "edged", axe: "edged", hammer: "blunt" };
const TIER_DMG_BONUS = { rusty: 0, copper: 1, bronze: 2, iron: 3, steel: 4, magic: 4, cursed: 3 };
const WEAPON_TYPES = ["dagger", "hook", "spear", "sword", "axe", "hammer"];
const wdie = (it) => it.die || (TYPE_DIE[it.type] ? (TIER_DMG_BONUS[it.tier] ? `${TYPE_DIE[it.type]}+${TIER_DMG_BONUS[it.tier]}` : TYPE_DIE[it.type]) : null);
const wdtype = (it) => it.dtype || TYPE_DTYPE[it.type] || "edged";

// ---- WEAPONS: every weapon has a known type; every type appears; each wantable tier in blunt+edged ----
for (const [id, it] of weapons)
  if (!it.die && !(it.type in TYPE_DIE)) fail(`weapon "${id}" has no recognised type (got ${it.type})`);
for (const t of WEAPON_TYPES)
  if (!weapons.some(([, it]) => it.type === t)) fail(`weapon type "${t}" is on no weapon`);
for (const tier of WANTABLE_WEAPON) {
  for (const dt of ["blunt", "edged"]) {
    if (!weapons.some(([, it]) => it.tier === tier && wdtype(it) === dt))
      fail(`weapon tier "${tier}" missing a ${dt} option`);
  }
}
if (!weapons.some(([, it]) => it.tier === "magic")) fail("no magic-tier weapon");
if (!weapons.some(([, it]) => it.tier === "cursed")) fail("no cursed weapon");

// dice non-decreasing across the wantable ladder (by min derived die per tier)
let prev = 0;
for (const tier of WANTABLE_WEAPON) {
  const ds = weapons.filter(([, it]) => it.tier === tier).map(([, it]) => dieMax(wdie(it)));
  const lo = Math.min(...ds);
  if (lo < prev) fail(`weapon ladder dips at "${tier}" (max-roll ${lo} < previous ${prev})`);
  prev = lo;
}

// ---- ARMOUR: every tier present; AC non-decreasing ----
for (const tier of ARMOR_ORDER)
  if (!armors.some(([, it]) => it.tier === tier)) fail(`armour tier "${tier}" missing`);
if (!armors.some(([, it]) => it.tier === "magic")) fail("no magic-tier armour");
if (!armors.some(([, it]) => it.tier === "cursed")) fail("no cursed armour");
prev = -1;
for (const tier of ARMOR_ORDER) {
  const a = armors.filter(([, it]) => it.tier === tier).map(([, it]) => it.ac || 0);
  const lo = Math.min(...a);
  if (lo < prev) fail(`armour AC ladder dips at "${tier}" (${lo} < previous ${prev})`);
  prev = lo;
}

// ---- cursed weapons/armour need a recognised apparentTier ----
for (const [id, it] of [...weapons, ...armors])
  if (it.tier === "cursed" && !(it.apparentTier in MATERIAL_RANK))
    fail(`cursed ${it.kind} "${id}" has no recognised apparentTier (got ${it.apparentTier})`);

// ---- ACCESSORIES: all 4 slots, blessed + cursed present ----
for (const slot of ["ring", "necklace", "boots", "gloves"])
  if (!accessories.some(([, it]) => it.slot === slot)) fail(`no accessory for slot "${slot}"`);
if (!accessories.some(([, it]) => it.blessed)) fail("no blessed accessory");
if (!accessories.some(([, it]) => it.cursed)) fail("no cursed accessory");

// ---- coverage: every curse + every magic-bonus type appears somewhere ----
const curseSeen = new Set(gear.flatMap(([, it]) => curseIds(it)));
for (const c of ALL_CURSES) if (!curseSeen.has(c)) fail(`curse "${c}" is on no item`);
const magicSeen = new Set(gear.filter(([, it]) => it.magic).map(([, it]) => it.magic.bonus));
for (const b of ALL_MAGIC) if (!magicSeen.has(b)) fail(`magic bonus "${b}" is on no item`);

// ============================ REPORT ============================
const pad = (s, n) => String(s).padEnd(n);
console.log("Sewer Demons — equipment catalog check");
console.log(`  ${gear.length} gear items: ${weapons.length} weapons, ${armors.length} armour, ${accessories.length} accessories\n`);

console.log("WEAPON TYPE × TIER (derived die)");
console.log("  " + pad("", 8) + ["rusty", "copper", "bronze", "iron", "steel"].map(t => pad(t, 8)).join(""));
for (const ty of WEAPON_TYPES) {
  const row = ["rusty", "copper", "bronze", "iron", "steel"].map(tier => {
    const it = weapons.find(([, w]) => w.type === ty && w.tier === tier);
    return pad(it ? wdie(it[1]) : "·", 8);
  });
  console.log("  " + pad(ty + (TYPE_DTYPE[ty] === "blunt" ? "*" : ""), 8) + row.join(""));
}
console.log("  (* = blunt; blank = no weapon of that type at that tier — fine, drops fill gaps)");
console.log("\nWEAPON SPECIALS (magic/cursed)");
for (const tier of ["magic", "cursed"]) {
  const ws = weapons.filter(([, it]) => it.tier === tier);
  console.log("  " + pad(tier, 8) + ws.map(([id, it]) => `${id} (${it.type}, ${wdie(it)})`).join("  ·  "));
}
console.log("\nARMOUR LADDER (AC by tier)");
for (const tier of [...ARMOR_ORDER, "magic", "cursed"]) {
  const as = armors.filter(([, it]) => it.tier === tier);
  console.log("  " + pad(tier, 8) + as.map(([, it]) => `+${it.ac || 0} AC (${it.name})`).join("  ·  "));
}

console.log("\nCURSE COVERAGE");
for (const c of ALL_CURSES) {
  const on = gear.filter(([, it]) => curseIds(it).includes(c)).map(([id]) => id);
  console.log("  " + pad(c, 14) + (on.length ? on.join(", ") : "!! MISSING"));
}
console.log("\nMAGIC-BONUS COVERAGE");
for (const b of ALL_MAGIC) {
  const on = gear.filter(([, it]) => it.magic && it.magic.bonus === b).map(([id]) => id);
  console.log("  " + pad(b, 10) + (on.length ? on.join(", ") : "!! MISSING"));
}

console.log("\nDROP MISMATCH → CURSE CHANCE (apparent-tier rank above the monster)");
const curseByGap = [8, 30, 65, 90, 95];
curseByGap.forEach((p, gap) => console.log(`  +${gap} rank: ${p}% cursed`));
console.log("  (e.g. steel [rank 5] off a level-1 rat [rank 1] = +4 → 95% cursed)");

console.log("");
if (fails.length) {
  console.log(`FAIL — ${fails.length} issue(s):`);
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
} else {
  console.log("PASS — catalog invariants all hold.");
}
