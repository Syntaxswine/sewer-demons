#!/usr/bin/env node
/* npc-probe.mjs — validate the NPC roster against the Twee source.
 *
 * Reads tools/npc-manifest.json + src/*.twee and, for each planned NPC, checks:
 *   - the room passage exists,
 *   - its one-shot $flag is declared in StoryInit (NPCs gated on an item carry a "token"),
 *   - the inline block is wired (the room body references the flag/token AND a <<linkreplace>>).
 * Prints a per-layer table + a "wired N/total" progress line.
 *
 * PASSIVE about unbuilt NPCs (unwired = TODO, not an error — this is a progress tracker, like
 * the feed/regard/scent probes). EXITS 1 only on a real BUG:
 *   - a manifest room that does not exist (a typo), or
 *   - a flag REFERENCED in its room but NOT declared in StoryInit (the classic half-wired bug).
 *
 * Zero deps. See the skill `sewer-demons-add-npc`.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const manifest = JSON.parse(readFileSync(join(root, "tools", "npc-manifest.json"), "utf8"));

/* split every .twee into passages: name -> body */
const passages = {};
for (const f of readdirSync(srcDir).filter((f) => f.endsWith(".twee"))) {
  const txt = readFileSync(join(srcDir, f), "utf8");
  const parts = txt.split(/^:: /m);
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const nl = seg.indexOf("\n");
    const name = (nl < 0 ? seg : seg.slice(0, nl)).split("[")[0].trim();   /* drop " [tag]" + any trailing \r */
    passages[name] = (passages[name] || "") + (nl < 0 ? "" : seg.slice(nl + 1));
  }
}

/* flags declared in StoryInit */
const declared = new Set();
for (const m of (passages.StoryInit || "").matchAll(/<<set \$(\w+) to /g)) declared.add(m[1]);

const C = { x: "\x1b[0m", dim: "\x1b[2m", red: "\x1b[31m", grn: "\x1b[32m", ylw: "\x1b[33m", cyn: "\x1b[36m" };

let wired = 0;
const bugs = [];
const byLayer = {};
for (const npc of manifest) {
  const body = passages[npc.room];
  const roomExists = body !== undefined;
  const flagDeclared = npc.flag ? declared.has(npc.flag) : true;
  const token = npc.flag ? "$" + npc.flag : npc.token || null;
  const refInRoom = roomExists && token ? body.includes(token) : false;
  /* wired = the gating flag/token is referenced in the room (the <<if not $flag>> block is in).
     linkreplace is the usual reveal, but a bargain NPC uses plain <<link>>s, so don't require it. */
  const isWired = roomExists && flagDeclared && refInRoom;

  if (!roomExists && !npc.new) bugs.push(`${npc.room} (${npc.name}) — room passage NOT FOUND`);
  if (npc.flag && refInRoom && !flagDeclared)
    bugs.push(`$${npc.flag} used in ${npc.room} but NOT declared in StoryInit`);

  if (isWired) wired++;
  (byLayer[npc.layer] ||= []).push({ ...npc, roomExists, flagDeclared, refInRoom, isWired });
}

for (const L of Object.keys(byLayer).sort((a, b) => a - b)) {
  console.log(`\n${C.cyn}L${L}${C.x}`);
  for (const n of byLayer[L]) {
    const mark = n.isWired ? `${C.grn}✓ wired${C.x}` : `${C.ylw}· todo ${C.x}`;
    const why = n.isWired
      ? ""
      : C.dim +
        [
          !n.roomExists && "no room",
          n.flag && !n.flagDeclared && "flag undeclared",
          n.roomExists && !n.refInRoom && "not wired in room",
        ]
          .filter(Boolean)
          .join(", ") +
        C.x;
    const flagCol = (n.flag ? "$" + n.flag : "(item)").padEnd(22);
    console.log(`  ${mark}  ${n.room.padEnd(20)} ${flagCol} ${n.kind.padEnd(13)} ${n.name}  ${why}`);
  }
}

console.log(`\n${C.cyn}NPCs wired: ${wired}/${manifest.length}${C.x}`);
if (bugs.length) {
  console.log(`\n${C.red}BUGS (${bugs.length}):${C.x}`);
  for (const b of bugs) console.log(`  ${C.red}✗${C.x} ${b}`);
  process.exit(1);
}
console.log(`${C.dim}(unbuilt NPCs are TODO, not errors — passive tracker)${C.x}`);
process.exit(0);
