import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "file:///C:/Users/heindall/.agents/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "file:///C:/Users/heindall/.agents/skills/anatomy/scripts/inline-kit.mjs";

/**
 * Figura. Una prensa de sello sobre la mesa de registro de TechServ.
 * El pisón baja con la madurez de GOB-01. Los cuatro cuños de peso 1
 * mojan el papel al llegar a Definido. El cuño corto de org.2, con tope,
 * solo deja un anillo: la política no sustituye la normativa interna.
 *
 * Base: tablero, pies, ranura, tornillos, secante, folios abiertos, plinto.
 * Estructura: dos columnas, viga, vástagos, estante de tomos cerrados.
 * Mecanismo: pisón, casquillos, cinco cuños, tope del cuño corto, sellos.
 * Mando: corona moleteada con índice 0–5.
 * Sujeto: el folio de la política, con la única leyenda, GOB-01.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 780;
const HEIGHT = 500;

const PLATE = { x: -176, y: -112, w: 352, d: 214, r: 12 };
const PLATE_H = 12;
const FOOT_H = 5;

const BLOTTER = { x: -70, y: -2, w: 140, d: 98, r: 4 };
const PAPER = { x: -58, y: 10, w: 116, d: 72, r: 1.6 };
const PAPER_Z = 1.1;
const PAPER_H = 2.2;
const PAPER_TOP = PAPER_Z + PAPER_H;

const DIE_Y = 46;
const DIE_LEN = 15;
const DIES = [
  { x: -40, w: 1, code: "org.1" },
  { x: -20, w: 0.5, code: "org.2" },
  { x: 0, w: 1, code: "5.2" },
  { x: 20, w: 1, code: "A.5.1" },
  { x: 40, w: 1, code: "1.1" },
];
const RAM_Z = PAPER_TOP + DIE_LEN;
const RAM_H = 7;
const BEAM_Z = 60;
const LIFT_GAP = 20;
const POST_X = [-104, 104];
const ROD_X = [-78, 78];

const CROWN = [146, 78];
const CROWN_R = 15;
const CROWN_H = 6;

const NAMES = ["No existe", "Inicial", "Gestionado", "Definido", "Medido", "Optimizado"];

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [-160, -90, 36],
    [160, -80, 40],
    [POST_X[1], DIE_Y, BEAM_Z + 10],
    [CROWN[0] + CROWN_R, CROWN[1] + CROWN_R, CROWN_H],
    [-78, 96, 8],
  ],
  WIDTH,
  HEIGHT,
  { pad: 34, azimuth: 38, elevation: 32 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function desk() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 26))) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.8, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.5, -PLATE_H - FOOT_H + 1.8, FOOT_H - 1.8, P, 24), { tone: "mid" }));
    out.push(D([at([x, y, -PLATE_H - FOOT_H + FOOT_H])], { size: 0.45, tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 7), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 14);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -150, y: PLATE.y + PLATE.d - 16, w: 120, d: 8, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.7, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 8, strip.x + strip.w - 8, 4, 5, strip.y + 1, 0.7, [2.2, 4.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 4, strip.y + 4, 0.7]), at([strip.x + strip.w - 4, strip.y + 4, 0.7])], { size: 0.4 }));
  return out.join("");
}

function openTome(x, y, w, d) {
  const out = [];
  const cover = { x: x - 2, y: y - 2, w: w + 4, d: d + 5, r: 1.5 };
  const pages = { x, y, w, d, r: 1 };
  out.push(S(k.slabOf(cover, 0, 1.6, P, 4, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x - 2, y: y - 2, w: w + 4, d: 2.4, r: 0.6 }, 1.6, 18, P, 3, 0.35), { tone: "mid" }));
  out.push(S(k.slabOf(pages, 1.6, 3.4, P, 4, 0.3), { tone: "hi", crease: "lo" }));
  const top = 5;
  for (let i = 1; i <= 6; i++) {
    const px = x + 2 + ((w - 4) * i) / 7;
    out.push(L(k.lineOnTop([px, y], [px, y + d], top, P), { tone: "faint" }));
  }
  out.push(S(k.slabOf({ x: x + w * 0.62, y: y - 0.2, w: 2.2, d: d + 0.4, r: 0.3 }, top, 0.45, P, 2), { tone: "lo", crease: "none" }));
  out.push(D([at([x + 4, y + 4, top]), at([x + w - 4, y + 4, top])], { size: 0.35, tone: "lo" }));
  return out.join("");
}

function closedTome(x, y) {
  const out = [];
  const book = { x, y, w: 15, d: 7, r: 0.7 };
  out.push(S(k.slabOf(book, 4, 28, P, 3, 0.4), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(book, 1.1), 32, P, 3), { tone: "faint" }));
  out.push(L(k.lineOnTop([x + 4, y], [x + 4, y + 7], 32, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([x + 8, y], [x + 8, y + 7], 32, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([x + 11.5, y], [x + 11.5, y + 7], 32, P), { tone: "faint" }));
  const band = { x: x - 0.2, y: y + 7, w: 15.4, d: 1.5, r: 0.3 };
  out.push(S(k.slabOf(band, 15, 4.2, P, 2), { tone: "mid" }));
  out.push(S(k.cylinder(x + 15.2, y + 3.5, 1.35, 15.6, 2.6, P, 14), { tone: "mid" }));
  out.push(D([at([x + 15.2, y + 3.5, 18.2])], { size: 0.35 }));
  return out.join("");
}

function library() {
  const out = [];
  out.push(openTome(-158, -86, 62, 30));
  out.push(openTome(-52, -92, 70, 28));
  out.push(openTome(48, -84, 46, 28));
  const plinth = { x: 112, y: -100, w: 50, d: 36, r: 2 };
  out.push(S(k.slabOf(plinth, 0, 4, P, 4, 0.5), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(plinth, 2.5), 4, P, 3), { tone: "faint" }));
  out.push(D(k.corners(plinth, 3.5).map(([x, y]) => at([x, y, 4])), { size: 0.4, tone: "lo" }));
  out.push(closedTome(118, -92));
  out.push(closedTome(138, -90));
  return out.join("");
}

function frame() {
  const out = [];
  for (const x of ROD_X) {
    out.push(S(k.cylinder(x, DIE_Y, 1.7, 0, BEAM_Z, P, 16), { tone: "mid", crease: "none" }));
    out.push(L(k.sideArc(x, DIE_Y, 1.7, 24, P, 12), { tone: "faint" }));
    out.push(S(k.cylinder(x, DIE_Y, 3.1, BEAM_Z - 1.4, 1.4, P, 16), { tone: "mid" }));
  }
  for (const x of POST_X) {
    out.push(S(k.slabOf({ x: x - 8, y: DIE_Y - 8, w: 16, d: 16, r: 2 }, 0, 3.2, P, 3, 0.4), { tone: "mid" }));
    out.push(S(k.cylinder(x, DIE_Y, 4.6, 3.2, BEAM_Z - 3.2, P, 24), { tone: "mid", crease: "none" }));
    out.push(L([18, 36, 52].map((z) => k.sideArc(x, DIE_Y, 4.6, z, P, 14)).join(""), { tone: "faint" }));
    out.push(S(k.cylinder(x, DIE_Y, 6.2, BEAM_Z, 2.2, P, 24), { tone: "mid" }));
    out.push(D([at([x, DIE_Y, BEAM_Z + 2.2])], { size: 0.45 }));
  }
  return out.join("");
}

function beam() {
  const out = [];
  const bar = { x: -114, y: DIE_Y - 9, w: 228, d: 18, r: 2 };
  out.push(S(k.slabOf(bar, BEAM_Z + 2.2, 7, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(bar, 3), BEAM_Z + 9.2, P, 3), { tone: "faint" }));
  out.push(D([at([-108, DIE_Y, BEAM_Z + 9.2]), at([108, DIE_Y, BEAM_Z + 9.2])], { size: 0.45 }));
  return out.join("");
}

function die(x, short) {
  const z0 = PAPER_TOP;
  const z1 = RAM_Z;
  const lit = short ? { lit: true } : {};
  const tone = short ? "hi" : "mid";
  const out = [];
  if (short) {
    out.push(S(k.cylinder(x, DIE_Y, 4.7, z0, 0.85, P, 28), { tone: "hi", lit: true }));
    out.push(L(k.ring(x, DIE_Y, 2.5, z0 + 0.85, P, 24), { tone: "lit" }));
    out.push(S(k.cylinder(x, DIE_Y, 3.05, z0 + 0.85, 5.4, P, 20), { tone: "hi", lit: true, crease: "none" }));
    out.push(S(k.cylinder(x, DIE_Y, 6.3, z0 + 6.15, 2.1, P, 28), { tone: "hi", lit: true }));
    out.push(L(k.sideArc(x, DIE_Y, 6.3, z0 + 7.2, P, 20), { tone: "lo" }));
    out.push(S(k.cylinder(x, DIE_Y, 3.05, z0 + 8.25, z1 - (z0 + 8.25), P, 20), { tone: "hi", lit: true, crease: "none" }));
  } else {
    out.push(S(k.cylinder(x, DIE_Y, 4.9, z0, 2.3, P, 28, 0.4), { tone: "hi" }));
    out.push(L(k.ring(x, DIE_Y, 3.2, z0 + 2.3, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, DIE_Y, 3.05, z0 + 2.3, z1 - z0 - 2.3, P, 20), { tone, crease: "none", ...lit }));
  }
  out.push(S(k.cylinder(x, DIE_Y, 5.3, z1 - 1.5, 1.5, P, 24), { tone, ...lit }));
  return out.join("");
}

function ram() {
  const out = [];
  const bar = { x: -90, y: DIE_Y - 10, w: 180, d: 20, r: 2 };
  out.push(S(k.slabOf(bar, RAM_Z, RAM_H, P, 4, 0.55), { tone: "hi", crease: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(bar, 3), RAM_Z + RAM_H, P, 3), { tone: "faint" }));
  for (const x of ROD_X) {
    out.push(S(k.cylinder(x, DIE_Y, 3.4, RAM_Z - 0.4, RAM_H + 0.8, P, 18), { tone: "mid" }));
    out.push(L(k.ring(x, DIE_Y, 2.5, RAM_Z + RAM_H, P, 16), { tone: "lo" }));
  }
  out.push(D(k.corners(bar, 4).map(([x, y]) => at([x, y, RAM_Z + RAM_H])), { size: 0.4 }));
  for (const item of DIES) out.push(die(item.x, item.w < 1));
  return out.join("");
}

function folio() {
  const out = [];
  out.push(S(k.slabOf(BLOTTER, 0, PAPER_Z, P, 5, 0.3), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(BLOTTER, 3), PAPER_Z, P, 4), { tone: "faint" }));
  out.push(S(k.slabOf(PAPER, PAPER_Z, PAPER_H, P, 4, 0.25), { tone: "hi", crease: "lo" }));
  const lab = { x: PAPER.x + 7, y: PAPER.y + PAPER.d - 16, w: 34, d: 9, r: 0.8 };
  const z = PAPER_TOP;
  out.push(S(k.slabOf(lab, z, 0.35, P, 3), { tone: "lo", crease: "none" }));
  for (const t of [0.28, 0.5, 0.72]) {
    const yy = lab.y + lab.d * t;
    out.push(L(k.lineOnTop([lab.x, yy], [lab.x + lab.w, yy], z + 0.35, P), { tone: "mid" }));
  }
  out.push(k.faceTextSvg(k.topMatrix([lab.x + 17, lab.y + 6.4], z + 0.4, P, "x"), "GOB-01", { size: 2.6, tone: "hi", anchor: "middle" }));
  return out.join("");
}

function ink() {
  const out = [];
  for (const item of DIES) {
    const ring = L(k.ring(item.x, DIE_Y, 6.1, PAPER_TOP + 0.15, P, 36), { tone: "mid" });
    const disc = item.w === 1
      ? `<g data-kind="disc">${S(k.cylinder(item.x, DIE_Y, 3.5, PAPER_TOP, 0.28, P, 28), { tone: "hi", crease: "none" })}${L(k.ring(item.x, DIE_Y, 3.5, PAPER_TOP + 0.3, P, 28), { tone: "green" })}</g>`
      : "";
    const ringOpacity = item.w === 1 ? "1" : "1";
    out.push(`<g data-ink="${item.code}" data-kind="ring" opacity="${ringOpacity}">${ring}</g>${disc}`);
  }
  return out.join("");
}

function crown() {
  const [x, y] = CROWN;
  const out = [];
  out.push(S(k.cylinder(x, y, 4.2, 0, 1.4, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, CROWN_R, 1.4, CROWN_H, P, 48, 0.6), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, CROWN_R, 1.8, 1.4 + CROWN_H - 0.3, 72, P, 0.25), { tone: "lo" }));
  out.push(L(k.ring(x, y, CROWN_R - 2.4, CROWN_H + 1.4, P, 48), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, CROWN_R - 3.2, 30, 5, CROWN_H + 1.4, [1.5, 3.1], P, (-150 * Math.PI) / 180, (300 * Math.PI) / 180);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(x, y, 2.2, CROWN_H + 1.4, P, 16), { tone: "mid" }));
  const angle = ((-150 + (4 / 5) * 300) * Math.PI) / 180;
  const d = k.lineOnTop(
    [x + Math.sin(angle) * 3.2, y - Math.cos(angle) * 3.2],
    [x + Math.sin(angle) * (CROWN_R - 4.2), y - Math.cos(angle) * (CROWN_R - 4.2)],
    CROWN_H + 1.6,
    P,
  );
  out.push(`<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${d}" style="stroke-width:1.15"/>`);
  return out.join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "Prensa de sello de la política de TechServ. Cinco cuños bajan con la madurez de GOB-01 sobre el folio. Cuatro cierran el sello al llegar a Definido. El cuño corto, con tope, solo deja un anillo.",
  body: [desk(), library(), frame(), folio(), ink(), `<g data-part="ram">${ram()}</g>`, beam(), crown()],
});

const live = `
const P = ${JSON.stringify(P)};
const DIES = ${JSON.stringify(DIES)};
const CROWN = ${JSON.stringify(CROWN)};
const CROWN_R = ${CROWN_R};
const CROWN_TOP = ${CROWN_H + 1.6};
const LIFT_GAP = ${LIFT_GAP};
const NAMES = ${JSON.stringify(NAMES)};
const TOUR = [4, 4, 0, 0, 2, 2, 4, 4, 5, 5];
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const ram = svg.querySelector('[data-part="ram"]');
const needle = svg.querySelector('[data-part="needle"]');
const rings = DIES.map((item) => svg.querySelector('[data-ink="' + item.code + '"][data-kind="ring"]'));
const discNodes = [...svg.querySelectorAll('[data-kind="disc"]')];
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
let maturity = 4, goal = 4, poseNow = 2;
let stampFrame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idleTimer = 0, said = "";
const poseFor = (level) => (level <= 0 ? 0 : level < 3 ? 1 : 2);
const pointerAt = (level) => {
  const angle = (-150 + (level / 5) * 300) * Math.PI / 180;
  return lineOnTop(
    [CROWN[0] + Math.sin(angle) * 3.2, CROWN[1] - Math.cos(angle) * 3.2],
    [CROWN[0] + Math.sin(angle) * (CROWN_R - 4.2), CROWN[1] - Math.cos(angle) * (CROWN_R - 4.2)],
    CROWN_TOP, P);
};
function stampWords(level, pose) {
  const shown = Math.abs(level - goal) < 0.08 ? goal : level;
  const name = NAMES[Math.max(0, Math.min(5, Math.round(shown)))];
  if (pose < 0.28) return Math.round(shown) + " " + name + " · pisón arriba · ningún sello";
  if (pose < 1.42) return Math.round(shown) + " " + name + " · 5 anillos en parcial · falta Definido";
  return Math.round(shown) + " " + name + " · 4 sellos cierran · org.2 sigue en parcial";
}
function paintPress() {
  const lift = poseNow <= 1 ? LIFT_GAP * (1 - poseNow) : 0;
  if (lift < 0.05) ram.removeAttribute("transform");
  else ram.setAttribute("transform", translateAlong(P, [0, 0, lift]));
  const touch = Math.max(0, Math.min(1, poseNow));
  const press = Math.max(0, Math.min(1, poseNow - 1));
  rings.forEach((node) => { if (node) node.setAttribute("opacity", touch.toFixed(3)); });
  discNodes.forEach((node) => node.setAttribute("opacity", press.toFixed(3)));
  needle.setAttribute("d", pointerAt(maturity));
  const text = stampWords(maturity, poseNow);
  if (readout.textContent !== text) readout.textContent = text;
  const announced = String(Math.round(Math.abs(maturity - goal) < 0.08 ? goal : maturity));
  if (announced !== said) {
    said = announced;
    stage.setAttribute("aria-valuenow", announced);
    stage.setAttribute("aria-valuetext", text);
  }
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) { clock += dt; goal = TOUR[Math.floor(clock / 1.7) % TOUR.length]; }
  const follow = (value, toward, tau) => {
    if (calm) return toward;
    const next = value + (toward - value) * (1 - Math.exp(-dt / tau));
    return Math.abs(toward - next) < 0.012 ? toward : next;
  };
  maturity = follow(maturity, goal, 0.26);
  poseNow = follow(poseNow, poseFor(goal), 0.34);
  paintPress();
  const settled = !touring && maturity === goal && poseNow === poseFor(goal);
  stampFrame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!stampFrame && visible) { last = 0; stampFrame = requestAnimationFrame(tick); } };
const steer = (next) => {
  touring = false;
  goal = Math.max(0, Math.min(5, next));
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 3600);
  run();
};
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  const share = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
  steer(Math.round(share * 5));
});
stage.addEventListener("pointerleave", () => steer(goal));
stage.addEventListener("keydown", (event) => {
  const here = Math.round(goal);
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = Math.min(5, here + 1);
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = Math.max(0, here - 1);
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = 5;
  if (to === null) return;
  event.preventDefault();
  steer(to);
});
paintPress();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Prensa de sello",
  hint: "Pasa el cursor · flechas 0–5",
  readout: "4 Medido · 4 sellos cierran · org.2 sigue en parcial",
  keys: [
    { mark: "lit", label: "Cuño corto de org.2: el tope le impide pasar del anillo" },
    { mark: "green", label: "Sello cerrado: peso 1 y nivel en Definido o más" },
    { mark: "raised", label: "Tres tomos abiertos en el alcance: ENS, ISO 27001 y NIS2" },
    { mark: "dim", label: "Dos tomos cerrados fuera del alcance: DORA e ISO 42001" },
  ],
  caption:
    "TechServ, el ejemplo, es un proveedor TIC del sector público y de criticidad alta: el ENS entra por ser entidad pública y NIS2 se propone como entidad importante. ISO 27001 está porque el ejemplo la selecciona; el contexto no la deduce solo. DORA e ISO 42001 siguen cerrados: no es entidad financiera y no declara IA. El mismo acto, la política aprobada por la dirección, es GOB-01, y en el demo está en nivel 4, Medido, con objetivo 3. Por debajo de Definido los cinco cuños solo besan el papel. Desde ahí los cuatro de peso 1 cierran, y org.2 se queda en parcial: un peso de 0,5 no se convierte en cobertura por subir a 5. Es el aporte de esta política, no el estado completo de cada requisito.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Madurez de la política GOB-01, de 0 No existe a 5 Optimizado" aria-valuemin="0" aria-valuemax="5" aria-valuenow="4" aria-valuetext="4 Medido. Cuatro sellos cierran y org.2 sigue en parcial.">${svg}</div>`,
});

const lead = `<header class="lead"><p class="kicker">GOB-01 · TECHSERV</p><h1>La política baja el pisón. Un cuño no puede cerrar.</h1><p>El movimiento es el modelo del demo: por debajo del objetivo todo queda en parcial, y el enlace de peso medio del ENS no llega a cubierto aunque la madurez suba a 5.</p></header>`;

const extra = `<style>
.lead{margin:0 0 8px}
.lead h1{margin:4px 0 8px;font-size:clamp(26px,4vw,36px);line-height:1.05;letter-spacing:-.03em;color:var(--anatomy-strong);max-width:18ch}
.lead p{margin:0;max-width:62ch}
.kicker{font:600 11px/1 var(--anatomy-mono);letter-spacing:.14em;color:var(--anatomy-text)}
.iso-stage:focus{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.iso-stage{touch-action:pan-y;cursor:ew-resize}
</style>`;

const page = k.pageHtml({
  title: "Prensa de sello · GOB-01",
  theme,
  body: extra + lead + body,
  script: kitScript() + live,
  width: 860,
}).replace("<html lang=\"en\">", "<html lang=\"es\">");

const file = theme === "light" ? "index.html" : "prensa.html";
writeFileSync(join(HERE, file), page);
console.log("wrote", file);
