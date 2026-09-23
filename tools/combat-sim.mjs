#!/usr/bin/env node
/* =====================================================================
   combat-sim.mjs — offline balance probe for the D&D-style combat engine.
   Run: node tools/combat-sim.mjs   (optionally: node tools/combat-sim.mjs 50000)

   This MIRRORS the math in setup.* (StoryInit <<run>> block of
   src/sewer-demons.twee), documented in docs/COMBAT.md. It is NOT imported by
   the game — Twee can't be required from Node — so when you change a combat
   formula, change it in BOTH places and re-run this. The CONSTANTS block below
   is the thing to keep in sync; if a sim number looks wrong, suspect drift here
   first. Reports win-rate + average rounds for the level-1 player vs every
   enemy, and a marked-build comparison (curses as a build).

   NOT MODELED: signature moves (review R12, setup.ENEMY_MOVES — telegraph/
   payoff, held/engulfed/gulp-heal/gore/squeal-adds/drag-claims). This stays a
   per-hit attrition probe; real fights vs movers are somewhat swingier (the
   wind-up round is a free window, the unanswered payoff hits harder). Read the
   win-rates as the attrition baseline, not the whole fight.

   CONSUMED BY: setup.threatRead (review R14, the pre-fight scent read) was
   calibrated against this sim's win% tables — its rung boundaries assume the
   2026-07-02 numbers. If you retune enemies, weapon dice, or player scaling,
   re-run this AND re-check the threat-read rungs (docs/COMBAT.md).

   ALSO NOT MODELED: packs (review R15 — five set-pieces + denizenPack mixes
   are multi-enemy now; this probe is 1v1 only). A pack's effective difficulty
   sits above its strongest member; the threat-read's pack formula (strongest
   full weight + half the rest) is the in-game estimate. And morale (review
   C2 — a badly-hurt enemy or one beside a fallen packmate may BREAK and flee,
   paying nothing; DC scales with the player's turned limbs), so real win% vs
   breakable enemies runs a little higher than these tables, at lower reward.
   And the blood ledger (review R17 — $blood kills-by-class; +2 morale DC at
   BLOOD_FELT, so a kin-slayer sees MORE flights = even less reward per fight;
   never touches to-hit/damage, so the win% tables themselves stand).
   ===================================================================== */

const N = Number(process.argv[2]) || 20000;

/* ---- CONSTANTS mirrored from the engine (keep in sync!) ---- */
const PLAYER_PROF = 2;
const LEVEL_BASE = { 1: 7 };
const baseScore = (lvl) => (LEVEL_BASE[lvl] != null ? LEVEL_BASE[lvl] : 7 + (lvl - 1) * 2);

/* XP & leveling (mirror setup.enemyXP / setup.xpToReach) */
const enemyXP = (e) => e.statLevel * e.hd * 4;
const xpToReach = (level) => 60 * (level - 1) * level;

/* TYPE × TIER model (mirror setup.TYPE_DIE / TIER_DMG_BONUS, owner 2026-06-07) */
const TYPE_DIE = { dagger: '1d4', hook: '1d6', spear: '1d6', sword: '1d8', axe: '1d10', hammer: '1d12' };
const TYPE_DTYPE = { dagger: 'edged', hook: 'edged', spear: 'edged', sword: 'edged', axe: 'edged', hammer: 'blunt' };
const TIER_DMG_BONUS = { rusty: 0, copper: 1, bronze: 2, iron: 3, steel: 4, magic: 4, cursed: 3 };
const weap = (type, tier) => ({ die: TIER_DMG_BONUS[tier] ? `${TYPE_DIE[type]}+${TIER_DMG_BONUS[tier]}` : TYPE_DIE[type], dtype: TYPE_DTYPE[type], kind: type });

const ITEMS = {
  fists:    { die: '1d2', ac: 0, dtype: 'blunt', kind: null },
  leathers: { die: null,  ac: 1 },
};

const ENEMIES = {
  rat:       { name: 'demon rat',     statLevel: 3,  hd: 1, weaponDie: '1d4', weakTypes: ['dagger'], resistTypes: ['hammer'] },
  ratman:    { name: 'rat-man',       statLevel: 3,  hd: 2, weaponDie: '1d4', weakTypes: ['sword', 'dagger'], resistTypes: ['hammer'] },
  crawler:   { name: 'drain-crawler', statLevel: 5,  hd: 2, weaponDie: '1d6', weakTypes: ['spear'], resistTypes: ['dagger'] },
  drowned:   { name: 'the drowned',   statLevel: 6,  hd: 3, weaponDie: '1d6', weakTypes: ['spear'], resistTypes: ['hammer'] },
  kappa:     { name: 'a kappa',        statLevel: 6,  hd: 2, weaponDie: '1d6', weakTypes: ['dagger'], resistTypes: ['hammer'] }, /* bath-attendant drowner; real weakness is the bow, not the blade */
  grafted:   { name: 'the grafted',   statLevel: 8,  hd: 3, weaponDie: '1d6', weakTypes: ['axe', 'sword'], resistTypes: ['dagger'] },
  gorger:    { name: 'a gorger',      statLevel: 9,  hd: 4, weaponDie: '1d8', weakTypes: ['hook'], resistTypes: ['spear'] },
  shitgolem: { name: 'shit-golem',    statLevel: 9,  hd: 4, weaponDie: '1d8', weakTo: 'blunt', resists: 'edged', weakTypes: ['hammer'] },
  pigdemon:  { name: 'pig-demon',     statLevel: 10, hd: 4, weaponDie: '1d8', weakTypes: ['spear'], resistTypes: ['dagger'] },
  pig_pressgang: { name: 'a sty-hand', statLevel: 6, hd: 3, weaponDie: '1d6', weakTypes: ['spear'], resistTypes: ['dagger'] }, /* press-gang recruiter (owner 2026-06-17) */
  glut:      { name: 'the Glut',      statLevel: 12, hd: 6, weaponDie: '1d10', weakTo: 'blunt', resists: 'edged', weakTypes: ['hammer'], resistTypes: ['dagger', 'sword'] }, /* BOSS shit-golem (owner 2026-06-17) */
  shortweight: { name: 'a short-weight', statLevel: 4, hd: 2, weaponDie: '1d6' }, /* WIS-ambush trickster (owner 2026-07-03); real fight vs it starts with a free enemy turn (not modelled here — this is the fair 1v1) */
  /* THE SMOKE CREATURES (owner 2026-07-20; Phase 0). Their real threat is IDENTITY DAMAGE (idmg) —
     corruption on every landed hit — which does NOT touch HP, so it does not change the win/lose read
     this sim models; the rows below are the pure lethality check (low weaponDie = they barely tear
     flesh). shadow-person: weakTo blunt / resists edged (you scatter smoke, you don't stab it), low HP
     (hd 2). smoke-wisp: fodder. */
  shadowperson: { name: 'a shadow-person', statLevel: 8, hd: 2, weaponDie: '1d3', weakTo: 'blunt', resists: 'edged', weakTypes: ['hammer'], resistTypes: ['dagger', 'sword'] },
  smokewisp:    { name: 'a smoke-wisp',    statLevel: 4, hd: 1, weaponDie: '1d2', resists: 'edged', resistTypes: ['dagger', 'sword'] },
};

const MARK_MODS = {
  damned:        { str: 1, con: 1, wis: -1 },
  faceless:      { dex: 1, cha: -2 },
  rendered:      { con: 2, dex: -1 },
  indebted:      { int: 1, wis: 1, cha: -1 },
  sovereign:     { str: 1, cha: 2 },
  marked_escape: { wis: 1 },
  survivor:      { wis: 1 },
};

/* transformed body-segment deltas (mirror setup.FORM_MODS) — one applied per TURNED limb */
const FORM_MODS = {
  rat:   { dex: 1 },
  pig:   { str: 1, con: 1 },
  filth: { con: 1, cha: -1 },
};

/* ---- engine math (mirrors setup.*) ---- */
const mod = (s) => Math.floor((s - 10) / 2);
const d = (sides) => Math.floor(Math.random() * sides) + 1;
function rollDie(spec) {
  if (!spec) return 0;
  const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(spec);
  if (!m) return 0;
  let total = m[3] ? +m[3] : 0;
  for (let i = 0; i < +m[1]; i++) total += d(+m[2]);
  return total;
}
function attack(atkMod, prof, targetAC, weaponDie, dmgMod) {
  const roll = d(20), crit = roll === 20, fumble = roll === 1;
  const hit = !fumble && (crit || roll + atkMod + prof >= targetAC);
  let dmg = 0;
  if (hit) dmg = Math.max(1, rollDie(weaponDie) + (crit ? rollDie(weaponDie) : 0) + dmgMod);
  return { hit, dmg };
}

function playerScores(level, marks = [], forms = []) {
  const base = baseScore(level);
  const s = { str: base, dex: base, con: base, int: base, wis: base, cha: base };
  for (const mk of marks) {
    const delta = MARK_MODS[mk];
    if (delta) for (const st of Object.keys(delta)) s[st] += delta[st];
  }
  for (const cls of forms) {                       // one entry per TURNED segment
    const fd = FORM_MODS[cls];
    if (fd) for (const st of Object.keys(fd)) s[st] += fd[st];
  }
  for (const st of Object.keys(s)) if (s[st] < 1) s[st] = 1;
  return s;
}
const playerMaxHp = (level, sc) => Math.max(1, (level + 3) * (5 + mod(sc.con)));

function enemyActor(id) {
  const e = ENEMIES[id], m = mod(e.statLevel);
  const hp = Math.max(1, e.hd * (5 + m));
  return { name: e.name, hp, ac: 10 + m, atkMod: m, dmgMod: m, weaponDie: e.weaponDie,
           weakTo: e.weakTo || null, resists: e.resists || null,
           weakTypes: e.weakTypes || null, resistTypes: e.resistTypes || null };
}
/* damage-type effectiveness (mirror setup.typeMult): merges the broad blunt/edged class with the
   fine weapon-TYPE affinity on the enemy sheet. net weak ×1.5, net resist ×0.5. */
function typeMult(wtype, en, wkind) {
  const weak = (en.weakTo && wtype === en.weakTo) || (wkind && en.weakTypes && en.weakTypes.includes(wkind));
  const resist = (en.resists && wtype === en.resists) || (wkind && en.resistTypes && en.resistTypes.includes(wkind));
  if (weak && !resist) return 1.5;
  if (resist && !weak) return 0.5;
  return 1;
}

/* one fight; returns {win, rounds} */
function fight({ level, scores, weaponDie, armorAc, corruptPen = 0, wtype = 'edged', wkind = null }, enemyId) {
  let php = playerMaxHp(level, scores);
  const pac = 10 + mod(scores.dex) + (armorAc || 0);
  const en = enemyActor(enemyId);
  let rounds = 0;
  while (php > 0 && en.hp > 0 && rounds < 500) {
    rounds++;
    const pa = attack(mod(scores.str) - corruptPen, PLAYER_PROF, en.ac, weaponDie, mod(scores.str));
    if (pa.hit) en.hp -= Math.max(1, Math.round(pa.dmg * typeMult(wtype, en, wkind)));
    if (en.hp > 0) {
      const ea = attack(en.atkMod, 0, pac, en.weaponDie, en.dmgMod);
      if (ea.hit) php -= ea.dmg;
    }
  }
  return { win: php > 0, rounds };
}

function run(label, loadout) {
  console.log(`\n${label}`);
  console.log('  enemy            statLvl   win%   avg rounds');
  for (const id of Object.keys(ENEMIES)) {
    let wins = 0, totRounds = 0;
    for (let i = 0; i < N; i++) {
      const r = fight(loadout, id);
      if (r.win) wins++;
      totRounds += r.rounds;
    }
    const e = ENEMIES[id];
    console.log(
      `  ${e.name.padEnd(15)} ${String(e.statLevel).padStart(4)}    ` +
      `${String(Math.round((100 * wins) / N)).padStart(5)}   ${((totRounds / N).toFixed(1)).padStart(8)}`
    );
  }
}

console.log(`Sewer Demons — combat balance sim (${N.toLocaleString()} fights/matchup)`);
console.log('Mirrors setup.* in src/sewer-demons.twee (see docs/COMBAT.md). Keep in sync.');

const L1 = playerScores(1);
const SWORD = weap('sword', 'bronze');   /* the balanced mid-line baseline (1d8+2) */
run('LEVEL 1, fists, no armor, clean:', { level: 1, scores: L1, weaponDie: ITEMS.fists.die, armorAc: 0, wtype: 'blunt' });
run('LEVEL 1, bronze sword + leathers, clean:', { level: 1, scores: L1, weaponDie: SWORD.die, armorAc: ITEMS.leathers.ac, wtype: SWORD.dtype, wkind: SWORD.kind });
run('LEVEL 1, bronze sword + leathers, corruption 75 (−3 hit):', { level: 1, scores: L1, weaponDie: SWORD.die, armorAc: ITEMS.leathers.ac, wtype: SWORD.dtype, wkind: SWORD.kind, corruptPen: 3 });

const marked = playerScores(1, ['rendered', 'damned']);
run(`MARKED (rendered+damned → CON ${marked.con}, STR ${marked.str}), bronze sword + leathers:`,
    { level: 1, scores: marked, weaponDie: SWORD.die, armorAc: ITEMS.leathers.ac, wtype: SWORD.dtype, wkind: SWORD.kind });

/* in-life body transformation: turned limbs grant FORM_MODS but a corrupt arm also
   autofails your swing — model 4 pig-turned limbs (STR/CON up) carrying 75 arm-corruption
   (−3 to hit). Net: tougher and harder-hitting, but less accurate — a real tradeoff. */
const pigBody = playerScores(1, [], ['pig', 'pig', 'pig', 'pig']);
run(`TRANSFORMED (4 pig limbs → STR ${pigBody.str}/CON ${pigBody.con}) w/ corrupt arm (−3 hit), bronze sword + leathers:`,
    { level: 1, scores: pigBody, weaponDie: SWORD.die, armorAc: ITEMS.leathers.ac, wtype: SWORD.dtype, wkind: SWORD.kind, corruptPen: 3 });

/* ---- WEAPON TYPE MATRIX (owner 2026-06-07): win% of each iron-tier weapon TYPE vs each enemy,
   at L3 + leathers. Shows the rock-paper-scissors the enemy-sheet affinities create — the right
   tool spikes, the wrong tool sags. (Damage RANGE differs by type too, so it's not pure affinity.) */
function typeMatrix() {
  const types = ['dagger', 'hook', 'spear', 'sword', 'axe', 'hammer'];
  const sc = playerScores(1);
  const M = Math.max(2500, Math.floor(N / 4));
  console.log('\nWEAPON TYPE MATRIX — win% at L1, bronze-tier weapon + leathers (best per row in []):');
  console.log('  (held at low power on purpose so the affinity spread shows instead of ceiling-ing at 100%)');
  console.log('  enemy            ' + types.map((t) => t.slice(0, 6).padStart(7)).join(''));
  for (const id of Object.keys(ENEMIES)) {
    const cells = types.map((ty) => {
      const w = weap(ty, 'bronze');
      let wins = 0;
      for (let i = 0; i < M; i++) if (fight({ level: 1, scores: sc, weaponDie: w.die, armorAc: ITEMS.leathers.ac, wtype: w.dtype, wkind: ty }, id).win) wins++;
      return Math.round((100 * wins) / M);
    });
    const best = Math.max(...cells);
    console.log('  ' + ENEMIES[id].name.padEnd(15) + ' ' + cells.map((c, i) => (c === best ? `[${c}]` : `${c}`).padStart(7)).join(''));
  }
  console.log('  affinity reads clearly where it flips a fight (grafted: dagger 22 → axe 95; golem: dagger 3 → hammer 84).');
  console.log('  TUNING NOTE: hammer\'s big 1d12 die can out-damage an affinity ×1.5 (it tops gorger/pig-demon despite');
  console.log('  not being their weakness). Tune TYPE_DIE spread vs the ×1.5/×0.5 affinity if you want the right TOOL');
  console.log('  to always beat raw die. (Owner call — "each type its own damage range" intends some hammer dominance.)');
}
typeMatrix();

/* ---- MAGIC (owner-goal 2026-06-18): a cast should be ~2× a weapon strike at the same level.
   MIRROR of setup.spellBase / SPELLS. A cast AUTO-HITS and ignores type resistance; a weapon strike
   can miss and is type-gated. So "effectiveness" = EXPECTED damage per action: weapon = P(hit)·E[dmg]
   (averaged over the bestiary's ACs, neutral type); cast = E[spellBase]·power (AC-independent). The
   ratio is the headline number the owner asked us to hold near 2. Tune SPELL_DIE/SPELL_FLAT here AND
   in the engine. ---- */
const SPELL_DIE = 8, SPELL_FLAT = 2;
const HEX_POWER = 1.0;   /* the base spell (The Hex); higher spells multiply this */
const eSpellBase = (L) => (L > 0 ? (SPELL_DIE + 1) / 2 + L * SPELL_FLAT : 0);   /* E[1dN] + flat·L */
function weaponExpectedPerAction(level, sc, w) {
  /* expected weapon damage per Attack, averaged over every enemy's AC, neutral type (mult 1) */
  let sum = 0, n = 0;
  for (const id of Object.keys(ENEMIES)) {
    const en = enemyActor(id);
    const atk = mod(sc.str), prof = PLAYER_PROF;
    /* P(hit): nat20 always; nat1 never; else roll+atk+prof >= AC. */
    let pHit = 0;
    for (let r = 1; r <= 20; r++) {
      if (r === 20) pHit += 1; else if (r === 1) pHit += 0; else if (r + atk + prof >= en.ac) pHit += 1;
    }
    pHit /= 20;
    const eDie = (() => { const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(w.die); const flat = m[3] ? +m[3] : 0; return +m[1] * ((+m[2] + 1) / 2) + flat; })();
    const eDmg = Math.max(1, eDie + mod(sc.str));   /* (crit-doubling adds a hair; ignored for the floor estimate) */
    sum += pHit * eDmg; n++;
  }
  return sum / n;
}
function magicCompare() {
  console.log('\nMAGIC — expected damage per ACTION, weapon vs a cast (The Hex), by level (target: cast ≈ 2× weapon):');
  console.log('  level   weapon/act   cast/act   ratio');
  for (const lvl of [1, 2, 3, 4, 5]) {
    const sc = playerScores(lvl);
    const wexp = weaponExpectedPerAction(lvl, sc, SWORD);
    const cexp = eSpellBase(lvl) * HEX_POWER;
    console.log('  ' + ('L' + lvl).padStart(5) + '   ' + wexp.toFixed(2).padStart(10) + '   ' + cexp.toFixed(2).padStart(8) + '   ' + (cexp / wexp).toFixed(2).padStart(5) + '×');
  }
  console.log('  (cast auto-hits + ignores armor type, so per-cast burst is strong — but it is MANA-limited:');
  console.log('   mana ceiling = magic-level·4 + corruption/10, and every cast taints caster + victim.)');
}
magicCompare();

/* ---- POWER CURVE: win% by level (bronze sword + leathers, clean), levels 1..5 ---- */
function powerCurve() {
  const levels = [1, 2, 3, 4, 5];
  console.log('\nPOWER CURVE — win% by level (bronze sword + leathers, clean):');
  console.log('  enemy            ' + levels.map((l) => ('L' + l).padStart(5)).join('  '));
  for (const id of Object.keys(ENEMIES)) {
    const cells = levels.map((lvl) => {
      const sc = playerScores(lvl);
      let wins = 0;
      const M = Math.max(2000, Math.floor(N / 4));   /* lighter pass — 5× the matchups */
      for (let i = 0; i < M; i++) {
        if (fight({ level: lvl, scores: sc, weaponDie: SWORD.die, armorAc: ITEMS.leathers.ac, wtype: SWORD.dtype, wkind: SWORD.kind }, id).win) wins++;
      }
      return String(Math.round((100 * wins) / M)).padStart(5);
    });
    console.log('  ' + ENEMIES[id].name.padEnd(15) + ' ' + cells.join('  '));
  }
}
powerCurve();

/* ---- XP ECONOMY: yield per kill + how many of each it takes to level ---- */
function xpEconomy() {
  console.log('\nXP ECONOMY — xp per kill, and kills of THIS enemy to go L1→L2 (need ' + xpToReach(2) + '):');
  console.log('  enemy            statLvl   xp/kill   kills→L2');
  for (const id of Object.keys(ENEMIES)) {
    const e = ENEMIES[id], x = enemyXP(e);
    console.log(
      '  ' + e.name.padEnd(15) + ' ' + String(e.statLevel).padStart(4) + '    ' +
      String(x).padStart(7) + '   ' + String(Math.ceil(xpToReach(2) / x)).padStart(8)
    );
  }
  console.log('\n  cumulative XP to reach each level (60·(L-1)·L):');
  console.log('  ' + [2, 3, 4, 5, 6, 7, 8, 9].map((l) => 'L' + l + '=' + xpToReach(l)).join('  '));
}
xpEconomy();

console.log('\nSanity targets: fodder (rat/rat-man) ~100%; crawler ~99%; pig-demon near-');
console.log('unwinnable at L1. WEAPON TYPE now matters per enemy (see the matrix): the right tool');
console.log('spikes win%, the wrong one sags — e.g. only a HAMMER scatters the golem; a SPEAR');
console.log('skewers drowned/crawler/pig-demon. Marks/levels lift the whole curve.');
console.log('Leveling target: ~5 rat-men (24xp each) = level 2; combat eases as the curve climbs,');
console.log('so the late-game threat is corruption / depth / marks, not raw fights.');
console.log('NOTE: a LOSS is no longer death — it is situational partial transformation (the');
console.log('enemy’s class marks you, half-vigor revival; see CombatLost). So "win%" here = how');
console.log('often you take the enemy down rather than get marked by it, not survival odds.\n');
