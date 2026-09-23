/* atlas-viewer.js — renders window.__GRAPH__ as one force-directed flowchart
   per layer, with ↑/↓ badges on the rooms that connect to adjacent layers.
   Framework-free. Inlined into docs/MAP-ATLAS.html by passage-graph.mjs --atlas. */
(function () {
  "use strict";
  var G = window.__GRAPH__;
  var LAYER_NAME = {
    0: "Intro · combat · meta",
    1: "L1 · Storm Drains",
    2: "L2 · Trunk Mains",
    3: "L3 · Old Drains",
    4: "L4 · Drowned Galleries",
    5: "L5 · Hellmouth",
    6: "L6 · Shambles",
    7: "L7 · Belly of the Beast",
    8: "L8 · Rendering Works",
    9: "L9 · Sulphur Deep",
  };
  var BAND = {
    0: "meta", 1: "sewer", 2: "sewer", 3: "sewer",
    4: "between", 5: "between", 6: "between",
    7: "hell", 8: "hell", 9: "hell",
  };
  var ROLE_COLOR = {
    room: "#7d8893",
    rest: "#4e9a6b",
    fight: "#b4503e",
    ending: "#1c1c20",
    lander: "#566069",
  };
  var W = 1000, H = 640, NS = "http://www.w3.org/2000/svg";

  // deterministic PRNG so the layout is stable across opens
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function layout(layerKey) {
    var L = G.layers[layerKey];
    var rooms = L.rooms;
    var idx = {};
    rooms.forEach(function (r, i) { idx[r.name] = i; });

    // intra-layer undirected edge set (with directionality flags)
    var pairKey = {};
    L.edges.forEach(function (e) {
      if (e.kind !== "intra") return;
      var a = idx[e.from], b = idx[e.to];
      if (a == null || b == null) return;
      var lo = Math.min(a, b), hi = Math.max(a, b);
      var key = lo + "_" + hi;
      if (!pairKey[key]) pairKey[key] = { a: lo, b: hi, fwd: false, rev: false };
      if (e.from === rooms[lo].name) pairKey[key].fwd = true; else pairKey[key].rev = true;
    });
    var edges = Object.keys(pairKey).map(function (k) { return pairKey[k]; });

    // up/down connectors per room
    var conn = rooms.map(function () { return { up: [], down: [] }; });
    L.edges.forEach(function (e) {
      if (e.kind === "up") conn[idx[e.from]].up.push(e.toL + "·" + e.to);
      else if (e.kind === "down") conn[idx[e.from]].down.push(e.toL + "·" + e.to);
    });

    // init positions on a seeded circle
    var rnd = mulberry32(layerKey * 99991 + rooms.length);
    var n = rooms.length;
    var P = rooms.map(function (_, i) {
      var ang = (i / n) * Math.PI * 2 + rnd() * 0.6;
      var rad = 160 + rnd() * 120;
      return { x: W / 2 + Math.cos(ang) * rad, y: H / 2 + Math.sin(ang) * rad, vx: 0, vy: 0 };
    });

    // Fruchterman–Reingold
    var area = W * H, k = Math.sqrt(area / Math.max(n, 1)) * 0.72, temp = W / 9;
    for (var it = 0; it < 380; it++) {
      var disp = P.map(function () { return { x: 0, y: 0 }; });
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          var dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
          var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          var f = (k * k) / d;
          var ux = dx / d, uy = dy / d;
          disp[i].x += ux * f; disp[i].y += uy * f;
          disp[j].x -= ux * f; disp[j].y -= uy * f;
        }
      }
      edges.forEach(function (e) {
        var dx = P[e.a].x - P[e.b].x, dy = P[e.a].y - P[e.b].y;
        var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var f = (d * d) / k;
        var ux = dx / d, uy = dy / d;
        disp[e.a].x -= ux * f; disp[e.a].y -= uy * f;
        disp[e.b].x += ux * f; disp[e.b].y += uy * f;
      });
      for (var m = 0; m < n; m++) {
        // gentle pull to center
        disp[m].x += (W / 2 - P[m].x) * 0.012;
        disp[m].y += (H / 2 - P[m].y) * 0.012;
        var dl = Math.sqrt(disp[m].x * disp[m].x + disp[m].y * disp[m].y) || 0.01;
        var lim = Math.min(dl, temp);
        P[m].x += (disp[m].x / dl) * lim;
        P[m].y += (disp[m].y / dl) * lim;
        P[m].x = Math.max(54, Math.min(W - 54, P[m].x));
        P[m].y = Math.max(48, Math.min(H - 60, P[m].y));
      }
      temp *= 0.975;
    }
    return { rooms: rooms, edges: edges, conn: conn, P: P, idx: idx };
  }

  // ---- render ----
  var current = null, state = null, drag = null;
  var svg = document.getElementById("canvas");
  var panel = document.getElementById("panel");

  function el(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (text != null) e.textContent = text;
    return e;
  }

  function render() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var rooms = state.rooms, P = state.P, conn = state.conn;

    // edges
    state.edges.forEach(function (e) {
      var a = P[e.a], b = P[e.b];
      var line = el("line", {
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        stroke: "#3a4047", "stroke-width": 1.4,
        "marker-end": e.fwd ? "url(#arrow)" : "",
        "marker-start": e.rev && !e.fwd ? "url(#arrow)" : (e.rev ? "url(#arrow)" : ""),
        class: "edge", "data-a": e.a, "data-b": e.b,
      });
      svg.appendChild(line);
    });

    // nodes
    rooms.forEach(function (r, i) {
      var p = P[i];
      var g = el("g", { class: "node", "data-i": i, transform: "translate(" + p.x + "," + p.y + ")" });
      var label = r.name.replace(/^The/, "");
      var w = Math.max(46, label.length * 6.6 + 16);
      g.appendChild(el("rect", {
        x: -w / 2, y: -13, width: w, height: 26, rx: 5,
        fill: ROLE_COLOR[r.role] || "#7d8893",
        stroke: "#0c0d0f", "stroke-width": 1.5,
      }));
      g.appendChild(el("text", { x: 0, y: 4, "text-anchor": "middle",
        "font-size": 11, fill: r.role === "ending" ? "#c9b86a" : "#0c0d0f",
        "font-weight": 600 }, label));
      // up / down badges
      if (conn[i].up.length) {
        var u = el("text", { x: w / 2 + 9, y: -4, "font-size": 13, fill: "#7fb0e0",
          "text-anchor": "middle" }, "↑");
        u.appendChild(el("title", {}, "UP → " + conn[i].up.join(", ")));
        g.appendChild(u);
      }
      if (conn[i].down.length) {
        var d = el("text", { x: w / 2 + 9, y: 12, "font-size": 13, fill: "#e0925f",
          "text-anchor": "middle" }, "↓");
        d.appendChild(el("title", {}, "DOWN → " + conn[i].down.join(", ")));
        g.appendChild(d);
      }
      g.appendChild(el("title", {}, r.name + "  [" + r.role + "]"));
      svg.appendChild(g);
    });
    wire();
  }

  function wire() {
    var nodes = svg.querySelectorAll(".node");
    nodes.forEach(function (g) {
      g.addEventListener("mousedown", function (ev) {
        drag = { i: +g.getAttribute("data-i") };
        ev.preventDefault();
      });
      g.addEventListener("click", function () { select(+g.getAttribute("data-i")); });
    });
  }

  function select(i) {
    var r = state.rooms[i];
    var c = state.conn[i];
    var html = "<h3>" + r.name + "</h3>";
    html += '<div class="role role-' + r.role + '">' + r.role + "</div>";
    if (c.up.length) html += "<p><b>↑ up:</b> " + c.up.join(", ") + "</p>";
    if (c.down.length) html += "<p><b>↓ down:</b> " + c.down.join(", ") + "</p>";
    var outs = r.gotos.filter(function (t) { return state.idx[t] != null; });
    html += "<p><b>exits within layer:</b><br>" + (outs.join(", ") || "—") + "</p>";
    panel.innerHTML = html;
    svg.querySelectorAll(".node").forEach(function (g) {
      g.classList.toggle("sel", +g.getAttribute("data-i") === i);
    });
    svg.querySelectorAll(".edge").forEach(function (l) {
      var on = +l.getAttribute("data-a") === i || +l.getAttribute("data-b") === i;
      l.setAttribute("stroke", on ? "#c9b86a" : "#3a4047");
      l.setAttribute("stroke-width", on ? 2.4 : 1.4);
    });
  }

  svg.addEventListener("mousemove", function (ev) {
    if (!drag) return;
    var pt = svg.getBoundingClientRect();
    var sx = W / pt.width, sy = H / pt.height;
    state.P[drag.i].x = (ev.clientX - pt.left) * sx;
    state.P[drag.i].y = (ev.clientY - pt.top) * sy;
    render();
    if (panel.dataset.sel) select(+panel.dataset.sel);
  });
  window.addEventListener("mouseup", function () { drag = null; });

  function show(layerKey) {
    current = layerKey;
    state = layout(layerKey);
    panel.innerHTML = "<p class='hint'>Click a room to trace its exits.</p>";
    document.getElementById("layer-title").textContent = LAYER_NAME[layerKey];
    document.getElementById("layer-band").textContent = BAND[layerKey];
    document.getElementById("layer-band").className = "band band-" + BAND[layerKey];
    var counts = {};
    state.rooms.forEach(function (r) { counts[r.role] = (counts[r.role] || 0) + 1; });
    document.getElementById("layer-stats").textContent =
      state.rooms.length + " rooms · " +
      Object.keys(counts).map(function (k) { return counts[k] + " " + k; }).join(", ");
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-l") === String(layerKey));
    });
    render();
  }

  // build tabs
  var tabbar = document.getElementById("tabs");
  Object.keys(G.layers).sort(function (a, b) { return a - b; }).forEach(function (k) {
    var b = document.createElement("button");
    b.className = "tab"; b.setAttribute("data-l", k);
    b.textContent = k === "0" ? "Intro" : "L" + k;
    b.title = LAYER_NAME[k];
    b.addEventListener("click", function () { show(k); });
    tabbar.appendChild(b);
  });

  show("1");
})();
