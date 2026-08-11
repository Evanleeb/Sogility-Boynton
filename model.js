/* =========================================================
   Sogility · BC Commerce Center Building A
   Shared facility model. Used by index.html (ambient hero)
   and plan.html (interactive space plan).

   All dimensions in FEET. Origin at the northwest corner of
   Suite 650. x runs east, z runs south.

   Shell verified against Arcadis AS1.01 vector geometry:
     building      680'6" long x 192'6" deep
     end bays      69'6" wide, full 192'6" depth
     middle bays   54'0" wide, 135'8" depth
     column grid   37'6" and 75'0" off the north wall,
                   landing ON the demising lines, so
                   Suite 650 is clear span
   ========================================================= */
(function (global) {
"use strict";

var S650 = {x:0,    z:0, w:69.5, d:192.5};
var S600 = {x:69.5, z:0, w:54,   d:135.7};
var CUT = 15, FULL = 32;
var GRID_Z = [37.5, 75];

var ZONES = [
  {id:'tsz-a',  name:'Technical Soccer Zone A', dim:'80 x 50',      sf:4000, x:9.75,  z:18.7,  w:50,   d:80,   kind:'turf',   col:'#5C9B47'},
  {id:'tsz-b',  name:'Technical Soccer Zone B', dim:'80 x 50',      sf:4000, x:9.75,  z:100.7, w:50,   d:80,   kind:'turf',   col:'#5C9B47'},
  {id:'grid-1', name:'Training grid 1',         dim:'40 x 30',      sf:1200, x:80.4,  z:74,    w:40,   d:30,   kind:'turf',   col:'#6FAE55'},
  {id:'grid-2', name:'Training grid 2',         dim:'40 x 30',      sf:1200, x:80.4,  z:105,   w:40,   d:30,   kind:'turf',   col:'#6FAE55'},
  {id:'dev',    name:'Athlete development',     dim:'43-6 x 27',    sf:1175, x:79.5,  z:45,    w:43.5, d:27,   kind:'gym',    col:'#C6F04B'},
  {id:'party',  name:'Break / party room',      dim:'25 people',    sf:809,  x:69.5,  z:0,     w:40.3, d:20.1, kind:'wood',   col:'#CA8149'},
  {id:'entry',  name:'Entry / welcome desk',    dim:'13-8 x 20',    sf:275,  x:109.8, z:0,     w:13.7, d:20.1, kind:'carpet', col:'#B9AFA0'},
  {id:'off-1',  name:'Private office 1',        dim:'10 x 10',      sf:100,  x:112.5, z:22,    w:10,   d:10,   kind:'carpet', col:'#B9AFA0'},
  {id:'off-2',  name:'Private office 2',        dim:'10 x 10',      sf:100,  x:112.5, z:33,    w:10,   d:10,   kind:'carpet', col:'#B9AFA0'},
  {id:'wc',     name:'Restrooms',               dim:'4 at 49 SF',   sf:196,  x:32.5,  z:0,     w:26,   d:7.4,  kind:'tile',   col:'#9FB6C2'},
  {id:'futsal', name:'Outdoor futsal court',    dim:'39-9 x 62-5',  sf:2484, x:69.5,  z:135.7, w:39.8, d:62.4, kind:'turf',   col:'#4E8C3C'}
];

var COL = {
  slab:0xD6D3C9, apron:0x63686C, ground:0x8B9380,
  turf:0x3E7A3B, turfB:0x477F3F, stripe:0xF0F4EC,
  gym:0x2C3137, rubber:0x191C20, tile:0xC3CBD1, wood:0xC3A26C, carpet:0xBAB1A3,
  wall:0xEBE8E2, wallOut:0xD9D6CE, metal:0x848C93, glass:0x9CC0D4,
  dark:0x3F4449, steel:0x596069, chrome:0xB9BFC4, volt:0xC6F04B
};

var VIEWS = {
  aerial:{r:310, phi:0.60, theta:1.02, tx:60,  ty:8, tz:98},
  entry: {r:70,  phi:1.44, theta:1.74, tx:110, ty:6, tz:16},
  tsz:   {r:104, phi:1.38, theta:0.62, tx:35,  ty:5, tz:60},
  dev:   {r:70,  phi:1.34, theta:1.95, tx:101, ty:5, tz:58},
  court: {r:124, phi:1.12, theta:0.88, tx:89,  ty:4, tz:167},
  plan:  {r:284, phi:0.13, theta:1.0,  tx:60,  ty:0, tz:98}
};

/* ---------------- shared textures ---------------- */
var _tex = {};
function netTexture(key, px, line, alpha){
  if (_tex[key]) return _tex[key];
  var c = document.createElement('canvas');
  c.width = c.height = px;
  var g = c.getContext('2d');
  g.clearRect(0, 0, px, px);
  g.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
  g.lineWidth = line;
  g.beginPath();
  g.moveTo(-1, -1); g.lineTo(px + 1, px + 1);
  g.moveTo(px + 1, -1); g.lineTo(-1, px + 1);
  g.moveTo(px / 2, -1); g.lineTo(-1, px / 2);
  g.moveTo(px + 1, px / 2); g.lineTo(px / 2, px + 1);
  g.moveTo(px / 2, -1); g.lineTo(px + 1, px / 2);
  g.moveTo(-1, px / 2); g.lineTo(px / 2, px + 1);
  g.stroke();
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  _tex[key] = t;
  return t;
}
function netMaterial(repX, repY, opacity, key){
  var base = netTexture(key || 'net', 64, 2.4, 0.95);
  var t = base.clone();
  t.needsUpdate = true;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repX, repY);
  return new THREE.MeshBasicMaterial({
    map:t, transparent:true, opacity:opacity, side:THREE.DoubleSide, depthWrite:false
  });
}

/* =========================================================
   create(host, opts)
     host  - element to append the canvas to
     opts  - {ambient:bool}
   ========================================================= */
function create(host, opts){
  opts = opts || {};
  var ambient = !!opts.ambient;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0C0F11);
  scene.fog = new THREE.Fog(0x0C0F11, 560, 1320);

  var camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 1, 3000);

  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = ambient ? 1.0 : 1.08;
  host.insertBefore(renderer.domElement, host.firstChild);

  var hemi = new THREE.HemisphereLight(0xEFF4FF, 0x4E5448, 0.72);
  scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xFFF4E4, 1.12);
  sun.position.set(280, 330, 230);
  sun.castShadow = true;
  sun.shadow.mapSize.set(ambient ? 1024 : 2048, ambient ? 1024 : 2048);
  var sc = sun.shadow.camera;
  sc.left = -230; sc.right = 230; sc.top = 230; sc.bottom = -230; sc.near = 20; sc.far = 950;
  sun.shadow.bias = -0.0009;
  var st = new THREE.Object3D(); st.position.set(60, 0, 98); scene.add(st);
  sun.target = st; scene.add(sun);
  var fill = new THREE.DirectionalLight(0xC9D8E8, 0.3);
  fill.position.set(-220, 160, -150); scene.add(fill);

  var root = new THREE.Group(); scene.add(root);
  var fitOut = new THREE.Group(); root.add(fitOut);
  var PARENT = root;
  var extWalls = [], people = [], balls = [], doors = [], lamps = [];

  /* ---------------- primitives ---------------- */
  function M(c, o){
    o = o || {};
    return new THREE.MeshStandardMaterial({color:c,
      roughness:o.rough !== undefined ? o.rough : 0.9,
      metalness:o.metal !== undefined ? o.metal : 0.02,
      transparent:o.opacity !== undefined, opacity:o.opacity !== undefined ? o.opacity : 1});
  }
  function B(x, z, w, d, h, m, y0, g){
    var me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    me.position.set(x + w/2, (y0 || 0) + h/2, z + d/2);
    me.castShadow = true; me.receiveShadow = true;
    (g || PARENT).add(me); return me;
  }
  function CYL(x, y, z, r, h, m, g, lay){
    var me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12), m);
    me.position.set(x, y, z);
    if (lay) me.rotation.z = Math.PI/2;
    me.castShadow = true; (g || PARENT).add(me); return me;
  }
  function P(x, z, w, d, m, y){
    var gg = new THREE.PlaneGeometry(w, d); gg.rotateX(-Math.PI/2);
    var me = new THREE.Mesh(gg, m);
    me.position.set(x + w/2, y || 0.06, z + d/2);
    me.receiveShadow = true; PARENT.add(me); return me;
  }

  /* ---------------- equipment ---------------- */
  function squatRack(x, z){
    var g = new THREE.Group(); PARENT.add(g);
    var post = M(COL.steel, {rough:0.4, metal:0.55});
    var bar = M(COL.chrome, {rough:0.25, metal:0.85});
    var plate = M(0x1A1D21, {rough:0.85});
    var W = 4, D = 3.6, H = 8;
    [[0,0],[W-0.35,0],[0,D-0.35],[W-0.35,D-0.35]].forEach(function(p){
      B(x + p[0], z + p[1], 0.35, 0.35, H, post, 0, g);
    });
    B(x, z, W, 0.3, 0.3, post, H - 0.3, g);
    B(x, z + D - 0.3, W, 0.3, 0.3, post, H - 0.3, g);
    B(x, z, 0.3, D, 0.3, post, H - 0.3, g);
    B(x, z + 0.6, W, 0.25, 0.25, post, 2.2, g);
    B(x, z + D - 0.85, W, 0.25, 0.25, post, 2.2, g);
    CYL(x + W/2, 4.1, z + 0.9, 0.09, 6.4, bar, g, true);
    [-2.35, -2.05, 2.05, 2.35].forEach(function(o){
      var d = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.16, 20), plate);
      d.position.set(x + W/2 + o, 4.1, z + 0.9);
      d.rotation.z = Math.PI/2; d.castShadow = true; g.add(d);
    });
  }
  function dbRack(x, z, n){
    var frame = M(0x2A2E33, {rough:0.5, metal:0.4});
    var db = M(0x33383D, {rough:0.6, metal:0.3});
    B(x, z, n*1.5 + 0.6, 2.4, 0.3, frame, 1.5);
    B(x, z, n*1.5 + 0.6, 2.4, 0.3, frame, 0.55);
    B(x, z, 0.4, 2.4, 1.9, frame);
    B(x + n*1.5 + 0.2, z, 0.4, 2.4, 1.9, frame);
    for (var i = 0; i < n; i++){
      CYL(x + 0.9 + i*1.5, 2.05, z + 0.85, 0.3, 1.5, db, null, true);
      CYL(x + 0.9 + i*1.5, 1.1, z + 0.85, 0.25, 1.2, db, null, true);
    }
  }
  function plyoStack(x, z){
    var m = M(0x4A5158, {rough:0.8});
    B(x, z, 2.6, 2.2, 1.7, m);
    B(x + 3, z, 2.2, 2.0, 2.4, m);
    B(x + 5.6, z, 1.8, 1.8, 3.0, m);
  }

  /* goal with a real mesh net */
  function goal(x, z, w, deep, flip){
    var g = new THREE.Group(); PARENT.add(g);
    var post = M(0xF2F4F6, {rough:0.32, metal:0.18});
    var H = w > 16 ? 8 : 6.5, dd = deep || 3;
    var zz = flip ? z - dd : z;
    B(x, zz + (flip ? dd : 0), 0.35, 0.35, H, post, 0, g);
    B(x + w - 0.35, zz + (flip ? dd : 0), 0.35, 0.35, H, post, 0, g);
    B(x, zz + (flip ? dd : 0), w, 0.35, 0.35, post, H - 0.35, g);

    var nm = netMaterial(w * 0.9, H * 0.9, 0.72);
    var back = new THREE.Mesh(new THREE.PlaneGeometry(w, H), nm);
    back.position.set(x + w/2, H/2, zz + (flip ? 0 : dd));
    g.add(back);
    var topN = new THREE.Mesh(new THREE.PlaneGeometry(w, dd).rotateX(-Math.PI/2), netMaterial(w*0.9, dd*0.9, 0.62));
    topN.position.set(x + w/2, H, zz + dd/2);
    g.add(topN);
    [0, w].forEach(function(o){
      var s = new THREE.Mesh(new THREE.PlaneGeometry(dd, H), netMaterial(dd*0.9, H*0.9, 0.62));
      s.rotation.y = Math.PI/2;
      s.position.set(x + o, H/2, zz + dd/2);
      g.add(s);
    });
    return g;
  }

  /* perimeter containment netting */
  function netting(x, z, w, d, h){
    var post = M(0x353B41, {rough:0.55, metal:0.35});
    function panel(px, pz, len, rotY){
      var m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), netMaterial(len * 0.5, h * 0.5, 0.34));
      m.rotation.y = rotY;
      m.position.set(px, h/2, pz);
      PARENT.add(m);
    }
    panel(x + w/2, z, w, 0);
    panel(x + w/2, z + d, w, 0);
    panel(x, z + d/2, d, Math.PI/2);
    panel(x + w, z + d/2, d, Math.PI/2);
    var step = 20;
    for (var a = 0; a <= w; a += step){
      B(x + Math.min(a, w - 0.5), z - 0.25, 0.5, 0.5, h, post);
      B(x + Math.min(a, w - 0.5), z + d - 0.25, 0.5, 0.5, h, post);
    }
    for (var b = step; b < d; b += step){
      B(x - 0.25, z + b, 0.5, 0.5, h, post);
      B(x + w - 0.25, z + b, 0.5, 0.5, h, post);
    }
  }

  /* sectional overhead door. openFrac 0 = closed, 1 = fully up */
  function rollDoor(x, z, w, h, openFrac, thick){
    var g = new THREE.Group(); PARENT.add(g);
    var rail = M(0x6C737A, {rough:0.45, metal:0.55});
    var slat = M(0xC9CDD1, {rough:0.42, metal:0.35});
    var drum = M(0x565C63, {rough:0.5, metal:0.5});
    var t = thick || 0.5;
    B(x - 0.55, z, 0.55, t, h + 0.6, rail, 0, g);
    B(x + w, z, 0.55, t, h + 0.6, rail, 0, g);
    B(x - 0.55, z - 0.15, w + 1.1, t + 0.3, 1.5, drum, h + 0.6, g);
    var leaf = h * (1 - openFrac);
    var n = Math.max(1, Math.round(h / 2));
    for (var i = 0; i < n; i++){
      var y = i * (h / n);
      if (y + (h / n) <= leaf + 0.01){
        B(x, z, w, t, (h / n) - 0.12, slat, y, g);
      }
    }
    if (openFrac > 0.05){
      B(x, z + t * 0.4, w, 0.12, h * openFrac - 0.2, M(0x101316, {rough:1}), leaf + 0.2, g);
      var stack = Math.min(3, Math.round(openFrac * 4));
      for (var s = 0; s < stack; s++){
        B(x, z - 0.35 - s * 0.55, w, 0.45, 0.5, slat, h - 0.4 - s * 0.6, g);
      }
    }
    doors.push(g);
    return g;
  }

  function ballCart(x, z){
    var f = M(0x3C4147, {rough:0.6, metal:0.3});
    B(x, z, 3.2, 3.2, 0.3, f, 0.9);
    [[0,0],[2.9,0],[0,2.9],[2.9,2.9]].forEach(function(p){ B(x+p[0], z+p[1], 0.3, 0.3, 0.9, f); });
    var ball = M(0xF2F4F6, {rough:0.62});
    for (var i = 0; i < 7; i++){
      var b = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 10), ball);
      b.position.set(x + 0.7 + (i % 3) * 1.0, 1.5 + Math.floor(i/3) * 0.7, z + 0.8 + (i % 2) * 1.1);
      b.castShadow = true; PARENT.add(b);
    }
  }
  function loose(x, z){
    var b = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 12), M(0xF4F6F8, {rough:0.6}));
    b.position.set(x, 0.36, z); b.castShadow = true; PARENT.add(b);
    balls.push({m:b, ox:x, oz:z, p:Math.random() * 6.28, sp:0.4 + Math.random() * 0.5, r:6 + Math.random() * 8});
  }
  function bench(x, z, len, vert){
    var w = M(0x8E877A, {rough:0.85}), f = M(0x33383D, {rough:0.5, metal:0.4});
    var a = vert ? 2 : len, b = vert ? len : 2;
    B(x, z, a, b, 0.3, w, 1.35);
    if (vert) B(x, z, 0.25, b, 1.5, w, 1.6); else B(x, z, a, 0.25, 1.5, w, 1.6);
    B(x, z, 0.3, 0.3, 1.35, f);
    B(x + a - 0.3, z + b - 0.3, 0.3, 0.3, 1.35, f);
  }
  function screen(x, z, w, vert){
    var m = M(0x14171A, {rough:0.25, metal:0.2});
    var s = M(0x1D2A33, {rough:0.1, metal:0.4});
    if (vert){ B(x, z, 0.3, w, 3.4, m, 7); B(x + 0.31, z + 0.15, 0.06, w - 0.3, 3.1, s, 7.15); }
    else { B(x, z, w, 0.3, 3.4, m, 7); B(x + 0.15, z + 0.31, w - 0.3, 0.06, 3.1, s, 7.15); }
  }
  function padding(x, z, w, d){ B(x, z, w, d, 4, M(0x2E3A45, {rough:0.9})); }
  function table(x, z, w, d, seats){
    var t = M(0xAE8A56, {rough:0.55}), leg = M(0x4A5057, {rough:0.5, metal:0.4});
    B(x, z, w, d, 0.25, t, 2.4);
    [[0.3,0.3],[w-0.6,0.3],[0.3,d-0.6],[w-0.6,d-0.6]].forEach(function(p){ B(x+p[0], z+p[1], 0.3, 0.3, 2.4, leg); });
    var ch = M(0x3F454C, {rough:0.7});
    for (var i = 0; i < seats; i++){
      var cx = x + 0.9 + i * ((w - 2.4) / Math.max(1, seats - 1));
      B(cx, z - 1.8, 1.5, 1.5, 0.2, ch, 1.5);
      B(cx, z - 1.85, 1.5, 0.2, 1.5, ch, 1.7);
      B(cx, z + d + 0.3, 1.5, 1.5, 0.2, ch, 1.5);
      B(cx, z + d + 1.6, 1.5, 0.2, 1.5, ch, 1.7);
    }
  }

  /* welcome desk: transaction counter, return, logo wall, stools */
  function welcomeDesk(x, z){
    var body = M(0x2A2F35, {rough:0.55});
    var top = M(0xB9AC93, {rough:0.4});
    var accent = new THREE.MeshBasicMaterial({color:COL.volt});
    B(x, z, 10, 2.6, 2.6, body);
    B(x - 0.2, z - 0.2, 10.4, 3.0, 0.35, top, 2.6);
    B(x, z + 0.1, 10, 0.12, 0.25, accent, 2.2);
    B(x + 7.4, z + 2.6, 2.6, 5.4, 2.6, body);
    B(x + 7.2, z + 2.6, 3.0, 5.6, 0.35, top, 2.6);
    B(x - 0.5, z - 3.4, 11, 0.5, 9, M(0x1A1E23, {rough:0.75}));
    B(x + 1.2, z - 3.15, 7.5, 0.14, 2.4, accent, 4.2);
    var stool = M(0x3C424A, {rough:0.6, metal:0.25});
    [1.5, 4.5, 7.5].forEach(function(o){
      CYL(x + o, 1.35, z + 4.2, 0.6, 0.25, stool);
      CYL(x + o, 0.65, z + 4.2, 0.16, 1.3, stool);
    });
    var rack = M(0x50565E, {rough:0.6, metal:0.3});
    B(x + 11.2, z + 1, 1.2, 6, 6, rack);
  }

  function person(x, z, kitCol, walk){
    var g = new THREE.Group(); PARENT.add(g); people.push(g);
    var skin = M(0xC49A78, {rough:0.9}), kit = M(kitCol, {rough:0.85}), leg = M(0x2A2E33, {rough:0.85});
    CYL(x, 3.35, z, 0.5, 2.0, kit, g);
    CYL(x - 0.25, 1.15, z, 0.19, 2.3, leg, g);
    CYL(x + 0.25, 1.15, z, 0.19, 2.3, leg, g);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), skin);
    head.position.set(x, 4.7, z); head.castShadow = true; g.add(head);
    CYL(x - 0.65, 3.5, z, 0.15, 1.7, kit, g);
    CYL(x + 0.65, 3.5, z, 0.15, 1.7, kit, g);
    if (walk){ g.userData.bob = Math.random() * 6.28; }
    return g;
  }
  function highBay(x, z){
    B(x, z, 2.2, 1.2, 0.5, M(0x2F343A, {rough:0.5, metal:0.4}), 27.5);
    var lens = new THREE.MeshBasicMaterial({color:0xFFF6E2});
    B(x + 0.15, z + 0.1, 1.9, 1.0, 0.1, lens, 27.4);
    lamps.push(lens);
  }

  /* interior wall graphic */
  function graphic(x, z, w, h, y, rotY, line1, line2){
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    var g2 = c.getContext('2d');
    g2.fillStyle = '#12161A'; g2.fillRect(0, 0, 1024, 256);
    g2.fillStyle = '#C6F04B';
    g2.font = '700 132px Barlow Condensed, Impact, sans-serif';
    g2.textBaseline = 'middle';
    g2.fillText(line1, 46, 96);
    g2.fillStyle = '#8E979C';
    g2.font = '600 46px Barlow Condensed, Impact, sans-serif';
    g2.fillText(line2, 50, 186);
    var t = new THREE.CanvasTexture(c);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({map:t}));
    m.rotation.y = rotY;
    m.position.set(x, y, z);
    PARENT.add(m);
  }
  function cone(x, z){ B(x, z, 1.1, 1.1, 1.5, M(0xD9721F, {rough:0.9})); }
  function ladder(x, z, n){
    var m = M(0xE8B33A, {rough:0.9});
    for (var i = 0; i <= n; i++) P(x, z + i*1.5, 2.6, 0.18, m, 0.13);
    P(x, z, 0.15, n*1.5, m, 0.13);
    P(x + 2.45, z, 0.15, n*1.5, m, 0.13);
  }
  function dasher(x, z, w, d){
    var m = M(COL.dark, {rough:0.76}), h = 3.5, t = 0.5;
    B(x, z, w, t, h, m); B(x, z+d-t, w, t, h, m);
    B(x, z, t, d, h, m); B(x+w-t, z, t, d, h, m);
  }
  function stripes(x, z, w, d){
    var m = M(COL.stripe, {rough:1}), i = 2.5, t = 0.5;
    P(x+i, z+i, w-2*i, t, m, 0.11);
    P(x+i, z+d-i-t, w-2*i, t, m, 0.11);
    P(x+i, z+i, t, d-2*i, m, 0.11);
    P(x+w-i-t, z+i, t, d-2*i, m, 0.11);
    P(x+i, z+d/2, w-2*i, t, m, 0.11);
    var r = Math.min(w, d) * 0.14;
    var ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.3, r, 44).rotateX(-Math.PI/2), m);
    ring.position.set(x + w/2, 0.11, z + d/2); PARENT.add(ring);
  }
  function extWall(x, z, w, d){
    var g = new THREE.BoxGeometry(w, FULL, d); g.translate(0, FULL/2, 0);
    var me = new THREE.Mesh(g, M(COL.wallOut, {rough:0.96}));
    me.position.set(x + w/2, 0, z + d/2);
    me.scale.y = CUT / FULL;
    me.castShadow = true; me.receiveShadow = true;
    root.add(me); extWalls.push(me);
  }

  /* ---------------- build ---------------- */
  var gp = new THREE.PlaneGeometry(2600, 2600); gp.rotateX(-Math.PI/2);
  var gm = new THREE.Mesh(gp, M(COL.ground, {rough:1}));
  gm.position.set(60, -0.6, 98); gm.receiveShadow = true; scene.add(gm);
  P(-52, 135.7, 240, 92, M(COL.apron, {rough:1}), -0.25);
  P(-52, -74, 290, 70, M(COL.apron, {rough:1}), -0.25);
  B(S650.x, S650.z, S650.w, S650.d, 1, M(COL.slab, {rough:0.96}), -1);
  B(S600.x, S600.z, S600.w, S600.d, 1, M(COL.slab, {rough:0.96}), -1);

  ZONES.forEach(function(z){
    var m = z.kind === 'turf' ? M(z.id === 'futsal' ? COL.turfB : COL.turf, {rough:1})
      : z.kind === 'gym' ? M(COL.gym, {rough:0.84})
      : z.kind === 'tile' ? M(COL.tile, {rough:0.45})
      : z.kind === 'wood' ? M(COL.wood, {rough:0.68}) : M(COL.carpet, {rough:0.98});
    z.mesh = P(z.x, z.z, z.w, z.d, m);
    if (z.kind === 'turf') stripes(z.x, z.z, z.w, z.d);
    var glow = new THREE.Mesh(new THREE.PlaneGeometry(z.w, z.d).rotateX(-Math.PI/2),
      new THREE.MeshBasicMaterial({color:COL.volt, transparent:true, opacity:0}));
    glow.position.set(z.x + z.w/2, 0.2, z.z + z.d/2);
    root.add(glow); z.glow = glow;
  });

  var T = 0.83;
  extWall(0, 0, S650.w + S600.w, T);
  extWall(0, T, T, S650.d - T);
  extWall(0, S650.d - T, S650.w, T);
  extWall(S650.w, S600.d - T, S600.w, T);
  extWall(S650.w - T, S600.d, T, S650.d - S600.d - T);
  extWall(S650.w + S600.w - T, T, T, S600.d - 2*T);

  GRID_Z.forEach(function(z){
    [S650.w, S650.w + S600.w].forEach(function(x){
      var g = new THREE.BoxGeometry(1.6, FULL, 1.6); g.translate(0, FULL/2, 0);
      var me = new THREE.Mesh(g, M(0xCBC7BE, {rough:0.88}));
      me.position.set(x, 0, z); me.scale.y = CUT / FULL;
      me.castShadow = true; root.add(me); extWalls.push(me);
    });
  });

  var p = M(COL.wall, {rough:0.94});
  for (var i = 0; i < 5; i++) B(32.5 + i*6.5, 0, 0.5, 7.4, 9, p);
  B(32.5, 7.4, 26, 0.5, 9, p);
  B(69.5, 20.1, 40.3, 0.5, 9, p);
  B(109.3, 0, 0.5, 20.1, 9, p);
  B(111.5, 21, 0.5, 23, 9, p);
  B(112, 21, 11, 0.5, 9, p);
  B(112, 32, 11, 0.5, 9, p);
  B(112, 32.9, 11, 0.5, 9, p);
  B(112, 43.4, 11, 0.5, 9, p);

  /* overhead doors on the south wall of Suite 600, facing the futsal court */
  rollDoor(75, S600.d - 0.9, 14, 14, 0.72);
  rollDoor(95, S600.d - 0.9, 14, 14, 0.30);
  /* overhead doors on the south wall of Suite 650 */
  rollDoor(13, S650.d - 0.9, 14, 14, 0);
  rollDoor(41, S650.d - 0.9, 14, 14, 0);

  B(111, 0.1, 11, 0.6, 10, M(COL.glass, {rough:0.14, metal:0.15, opacity:0.38}));

  dasher(9.75, 18.7, 50, 80); dasher(9.75, 100.7, 50, 80);
  netting(9.75, 18.7, 50, 80, 15); netting(9.75, 100.7, 50, 80, 15);
  netting(80.4, 74, 40, 30, 12); netting(80.4, 105, 40, 30, 12);
  netting(69.5, 135.7, 39.8, 62.4, 16);

  var dl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, S600.d - 2).rotateX(-Math.PI/2),
    new THREE.MeshBasicMaterial({color:0xCA8149, transparent:true, opacity:0.6}));
  dl.position.set(69.5, 0.25, S600.d/2); root.add(dl);

  for (var hx = 13; hx < 122; hx += 22)
    for (var hz = 20; hz < 188; hz += 30)
      if (hx < 64 || hz < 132) highBay(hx, hz);

  /* fit out (toggleable as one group) */
  PARENT = fitOut;
  graphic(1.0, 60, 46, 11, 17, Math.PI/2, 'SOGILITY', 'TRAIN DIFFERENT. GET BETTER.');
  graphic(1.0, 140, 34, 8.5, 15, Math.PI/2, 'TECHNICAL ZONE', 'TSZ · TECHTOUCH · ON THE BALL');
  graphic(92, 134.6, 30, 7.5, 12, 0, 'FUTSAL', 'BOYNTON BEACH');
  squatRack(81.5, 47); squatRack(88, 47); squatRack(94.5, 47);
  dbRack(81.5, 66, 8);
  plyoStack(104.5, 47.5);
  B(100, 57, 16, 4, 0.55, M(COL.rubber, {rough:0.92}), 0.02);
  B(114.5, 47, 6.5, 5, 3.2, M(0x3A4046, {rough:0.6, metal:0.3}));
  screen(81.5, 45.3, 9); screen(97, 45.3, 9);

  goal(24.75, 19.4, 20, 3.5); goal(24.75, 98.7, 20, 3.5, true);
  goal(24.75, 101.4, 20, 3.5); goal(24.75, 180.7, 20, 3.5, true);
  padding(9.75, 18.7, 50, 1.2); padding(9.75, 97.5, 50, 1.2);
  padding(9.75, 100.7, 50, 1.2); padding(9.75, 179.5, 50, 1.2);
  ballCart(62.5, 26); ballCart(62.5, 110);
  ladder(63, 62, 6);
  [30, 40, 50].forEach(function(x){ cone(x, 63); });
  screen(9.9, 40, 8, true); screen(9.9, 124, 8, true);

  goal(93.4, 74.6, 14, 2.6); goal(93.4, 104, 14, 2.6, true);
  goal(93.4, 105.6, 14, 2.6); goal(93.4, 135, 14, 2.6, true);
  ballCart(75.5, 78);

  goal(80.4, 136.4, 18, 3); goal(80.4, 198.1, 18, 3, true);

  [26, 46, 118, 138].forEach(function(z){ bench(63.8, z, 14, true); });
  bench(72.5, 96, 12, false);

  table(72, 4, 16, 4, 5); table(72, 13.5, 16, 4, 5);
  B(92, 3, 3.5, 14, 3.4, M(0xA89272, {rough:0.55}));
  welcomeDesk(110.5, 9);
  B(113.5, 23.5, 6, 3, 2.5, M(0xA89272, {rough:0.55}));
  B(113.5, 34.5, 6, 3, 2.5, M(0xA89272, {rough:0.55}));

  var fx = M(0xE9EEF1, {rough:0.35});
  for (var r = 0; r < 4; r++){
    B(33.4 + r*6.5, 5.3, 1.5, 1.9, 1.4, fx);
    B(36.4 + r*6.5, 0.7, 2.2, 1.4, 2.7, fx);
  }

  loose(30, 55); loose(40, 140); loose(95, 90); loose(88, 165);

  var kits = [0xC6F04B, 0x2E6FBF, 0xD84A3A, 0xEFEFEF, 0x2B2E33];
  var spots = [
    [22,34],[27,38],[34,33],[40,44],[30,52],[45,60],[20,70],[38,80],[50,72],[44,90],
    [24,118],[33,126],[41,120],[28,140],[46,150],[36,162],[22,155],[50,134],
    [85,52],[90,50],[97,52],[103,60],[84,68],
    [88,82],[96,88],[104,84],[90,116],[100,120],[110,112],
    [65,30],[66,52],[65,100],[66,132],
    [78,8],[84,10],[90,16],[114,14],[117,17],
    [78,150],[86,160],[95,168],[80,180],[92,186],[74,170]
  ];
  spots.forEach(function(s, i){ person(s[0], s[1], kits[i % kits.length], i % 3 === 0); });
  PARENT = root;

  /* ---------------- dusk / match lighting ---------------- */
  var pointLights = [];
  function setDusk(on){
    scene.background = new THREE.Color(on ? 0x070909 : 0x0C0F11);
    scene.fog.color = new THREE.Color(on ? 0x070909 : 0x0C0F11);
    sun.intensity = on ? 0.34 : 1.12;
    sun.color = new THREE.Color(on ? 0xFFD9A8 : 0xFFF4E4);
    sun.position.set(on ? 420 : 280, on ? 120 : 330, on ? 60 : 230);
    fill.intensity = on ? 0.12 : 0.3;
    hemi.intensity = on ? 0.26 : 0.72;
    lamps.forEach(function(m){ m.color.setHex(on ? 0xFFFFFF : 0xFFF6E2); });
    pointLights.forEach(function(l){ l.intensity = on ? l.userData.max : 0; });
    renderer.toneMappingExposure = on ? 1.22 : (ambient ? 1.0 : 1.08);
  }
  [[35,60],[35,140],[95,60],[95,110],[89,167]].forEach(function(p){
    var l = new THREE.PointLight(0xFFF1D6, 0, 130, 2);
    l.position.set(p[0], 24, p[1]);
    l.userData.max = 1.5;
    scene.add(l); pointLights.push(l);
  });
  if (opts.dusk) setDusk(true);

  /* ---------------- camera + loop ---------------- */
  var cam = ambient
    ? {r:330, phi:0.66, theta:0.60, tx:60, ty:10, tz:98}
    : {r:310, phi:0.60, theta:1.02, tx:60, ty:8,  tz:98};
  var goal_ = null, hi = null, hiT = 0, t0 = 0;
  var par = {x:0, y:0, tx:0, ty:0};

  /* scripted hero move: wide, down to the court, inside, weight floor, back up */
  var PATH = [
    {r:340, phi:0.62, theta:0.55, tx:60,  ty:10, tz:98,  hold:5.0, ease:3.0},
    {r:150, phi:1.02, theta:1.02, tx:88,  ty:6,  tz:168, hold:4.0, ease:4.0},
    {r:96,  phi:1.36, theta:0.60, tx:35,  ty:6,  tz:70,  hold:4.5, ease:4.0},
    {r:74,  phi:1.30, theta:1.95, tx:99,  ty:6,  tz:58,  hold:4.0, ease:3.5},
    {r:250, phi:0.42, theta:1.55, tx:60,  ty:10, tz:110, hold:4.0, ease:4.0}
  ];
  var pIdx = 0, pT = 0, pFrom = null;
  function ease(u){ return u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3) / 2; }

  function setView(name){ goal_ = Object.assign({}, VIEWS[name]); hi = null; }
  function focus(z){
    goal_ = {r:Math.max(56, Math.max(z.w, z.d) * 1.7), phi:1.06,
      theta:(z.x + z.w/2) > 72 ? 1.92 : 0.70, tx:z.x + z.w/2, ty:4, tz:z.z + z.d/2};
    hi = z; hiT = 0;
  }
  function setWalls(full){ extWalls.forEach(function(m){ m.scale.y = (full ? FULL : CUT) / FULL; }); }
  function setPeople(on){ people.forEach(function(g){ g.visible = on; }); }
  function resize(){
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  }

  var frameCbs = [];
  var paused = false;
  function tick(){
    requestAnimationFrame(tick);
    if (paused) return;
    t0 += 0.016;

    if (ambient){
      if (opts.cinematic){
        var k = PATH[pIdx], nxt = PATH[(pIdx + 1) % PATH.length];
        pT += 0.016;
        if (pT < k.hold){
          if (pFrom) { cam.r = k.r; cam.phi = k.phi; cam.theta = k.theta; cam.tx = k.tx; cam.ty = k.ty; cam.tz = k.tz; }
          cam.theta += 0.00022;
        } else {
          var u = Math.min(1, (pT - k.hold) / nxt.ease), e = ease(u);
          cam.r     = k.r     + (nxt.r     - k.r)     * e;
          cam.phi   = k.phi   + (nxt.phi   - k.phi)   * e;
          cam.theta = k.theta + (nxt.theta - k.theta) * e;
          cam.tx    = k.tx    + (nxt.tx    - k.tx)    * e;
          cam.ty    = k.ty    + (nxt.ty    - k.ty)    * e;
          cam.tz    = k.tz    + (nxt.tz    - k.tz)    * e;
          if (u >= 1){ pIdx = (pIdx + 1) % PATH.length; pT = 0; pFrom = true; }
        }
      } else {
        cam.theta += 0.00055;
        cam.phi = 0.60 + Math.sin(t0 * 0.06) * 0.07;
      }
    } else if (goal_){
      var done = true;
      ['r','phi','theta','tx','ty','tz'].forEach(function(k){
        var d = goal_[k] - cam[k];
        if (Math.abs(d) > 0.004) done = false;
        cam[k] += d * 0.075;
      });
      if (done) goal_ = null;
    }
    par.x += (par.tx - par.x) * 0.045;
    par.y += (par.ty - par.y) * 0.045;
    var phiE = Math.max(0.07, Math.min(Math.PI/2 - 0.03, cam.phi + par.y * 0.06));
    var thE = cam.theta + par.x * 0.10;
    camera.position.set(
      cam.tx + cam.r * Math.sin(phiE) * Math.cos(thE),
      Math.max(2.5, cam.ty + cam.r * Math.cos(phiE)),
      cam.tz + cam.r * Math.sin(phiE) * Math.sin(thE));
    camera.lookAt(cam.tx, cam.ty, cam.tz);

    balls.forEach(function(b){
      b.p += 0.014 * b.sp;
      b.m.position.x = b.ox + Math.cos(b.p) * b.r;
      b.m.position.z = b.oz + Math.sin(b.p * 1.3) * b.r * 0.6;
      b.m.rotation.x += 0.05; b.m.rotation.z += 0.03;
    });
    people.forEach(function(g){
      if (g.userData.bob === undefined) return;
      g.position.y = Math.sin(t0 * 2.2 + g.userData.bob) * 0.12;
    });

    ZONES.forEach(function(z){
      var target = (hi && hi.id === z.id) ? 0.16 + Math.sin(hiT) * 0.07 : 0;
      z.glow.material.opacity += (target - z.glow.material.opacity) * 0.12;
    });
    hiT += 0.05;

    for (var i = 0; i < frameCbs.length; i++) frameCbs[i](camera);
    renderer.render(scene, camera);
  }
  tick();

  return {
    scene:scene, camera:camera, renderer:renderer, root:root, cam:cam,
    zones:ZONES, views:VIEWS,
    setView:setView, focus:focus, setWalls:setWalls, setPeople:setPeople,
    setDusk:setDusk,
    setFitOut:function(on){ fitOut.visible = on; },
    parallax:function(x, y){ par.tx = x; par.ty = y; },
    resize:resize, onFrame:function(fn){ frameCbs.push(fn); },
    setPaused:function(p){ paused = p; },
    setQuality:function(hi){ renderer.setPixelRatio(hi ? Math.min(window.devicePixelRatio, 2) : 1); },
    clearGoal:function(){ goal_ = null; },
    clearFocus:function(){ hi = null; }
  };
}

global.SOG = {
  create:create, ZONES:ZONES, VIEWS:VIEWS,
  S650:S650, S600:S600, CUT:CUT, FULL:FULL, GRID_Z:GRID_Z
};

})(window);
