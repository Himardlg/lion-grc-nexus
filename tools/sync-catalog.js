#!/usr/bin/env node
// GRC Nexus — sincronización del catálogo desde Rosetta Multinorma
// Copyright (C) 2026  hiramyclases@gmail.com
// Licenciado bajo GNU General Public License v2. Ver LICENSE y NOTICE.md.
//
// Uso: node tools/sync-catalog.js [ruta-a-rosetta] [--check | --dry-run]
//   Ruta por defecto: $ROSETTA_DIR o ../rosetta_multinorma (relativa a la raíz del repo).
//   --check    no escribe; sale con código 1 si app/catalog.js difiere en datos.
//   --dry-run  no escribe; muestra el resumen de cambios (controles y requisitos).
// Lee <rosetta>/src/data/catalog.json y genera app/catalog.js con el formato de Nexus.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const FRAMEWORKS = ['ens', 'iso27001', 'nis2', 'iso42001'];
const OUT = path.join(ROOT, 'app', 'catalog.js');

class SyncError extends Error {}
const fail = (m) => { throw new SyncError(m); };

/* Validación del JSON de Rosetta: campos obligatorios con mensajes claros. */
function validate(cat) {
  if (!cat || typeof cat !== 'object' || Array.isArray(cat)) fail('El catálogo de Rosetta no es un objeto JSON.');
  if (typeof cat.version !== 'string' || !cat.version) fail('Falta el campo «version» (texto) en el catálogo de Rosetta.');
  for (const k of ['domains', 'controls']) if (!Array.isArray(cat[k]) || !cat[k].length) fail(`Falta la lista «${k}» o está vacía.`);
  if (!cat.frameworks || typeof cat.frameworks !== 'object') fail('Falta el objeto «frameworks».');
  const doms = new Set();
  cat.domains.forEach((d, i) => {
    for (const f of ['id', 't']) if (typeof d?.[f] !== 'string' || !d[f]) fail(`Dominio n.º ${i + 1}: falta el campo «${f}».`);
    if (doms.has(d.id)) fail(`Dominio duplicado: ${d.id}.`); doms.add(d.id);
  });
  for (const fw of FRAMEWORKS) {
    const reqs = cat.frameworks[fw]?.reqs;
    if (!Array.isArray(reqs) || !reqs.length) fail(`Falta el marco «${fw}» (frameworks.${fw}.reqs) o no tiene requisitos.`);
    const ids = new Set();
    reqs.forEach((r, i) => {
      for (const f of ['id', 'code', 't', 'g']) if (typeof r?.[f] !== 'string' || !r[f]) fail(`Requisito n.º ${i + 1} de ${fw}: falta el campo «${f}».`);
      if (ids.has(r.id)) fail(`Requisito duplicado en ${fw}: ${r.id}.`); ids.add(r.id);
      if (fw === 'ens') for (const f of ['bajo', 'medio', 'alto', 'dims']) if (typeof r[f] !== 'string') fail(`Medida ENS ${r.id}: falta el campo «${f}».`);
    });
  }
  const ids = new Set();
  cat.controls.forEach((c, i) => {
    const who = c?.id ? `Control ${c.id}` : `Control n.º ${i + 1}`;
    for (const f of ['id', 'dom', 't', 'obj', 'ev']) if (typeof c?.[f] !== 'string' || !c[f]) fail(`${who}: falta el campo «${f}».`);
    if (ids.has(c.id)) fail(`Control duplicado: ${c.id}.`); ids.add(c.id);
    if (!doms.has(c.dom)) fail(`${who}: el dominio «${c.dom}» no existe.`);
    if (!c.maps || typeof c.maps !== 'object') fail(`${who}: falta el objeto «maps».`);
    for (const fw of FRAMEWORKS) (c.maps[fw] || []).forEach((m, j) => {
      if (typeof m?.id !== 'string' || typeof m?.w !== 'number') fail(`${who}: la correspondencia n.º ${j + 1} de ${fw} necesita «id» (texto) y «w» (número).`);
      if (!cat.frameworks[fw].reqs.some((r) => r.id === m.id)) fail(`${who}: la correspondencia ${fw} «${m.id}» no existe en el marco.`);
    });
  });
}

/* Proyección al formato de Nexus (solo los campos y marcos que usa la app). */
function project(cat) {
  const lvl = (v) => (v === 'n.a.' ? 0 : 1);
  return {
    version: cat.version,
    domains: cat.domains.map((d) => ({ id: d.id, t: d.t })),
    controls: cat.controls.map((c) => {
      const maps = {};
      for (const fw of FRAMEWORKS) { const l = (c.maps[fw] || []).map((m) => [m.id, m.w]); if (l.length) maps[fw] = l; }
      return { id: c.id, dom: c.dom, t: c.t, obj: c.obj, ev: c.ev, maps };
    }),
    frameworks: Object.fromEntries(FRAMEWORKS.map((fw) => [fw, cat.frameworks[fw].reqs.map((r) =>
      fw === 'ens' ? { id: r.id, code: r.code, t: r.t, g: r.g, e: [lvl(r.bajo), lvl(r.medio), lvl(r.alto)], d: r.dims }
        : { id: r.id, code: r.code, t: r.t, g: r.g })])),
  };
}

function gitInfo(dir) {
  try { return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
}
function appVersion(dir) {
  try { return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version || null; } catch { return null; }
}

function render(data, src) {
  const origin = [src.app ? `Rosetta v${src.app}` : 'Rosetta', src.commit ? `commit ${src.commit}` : null, `catálogo ${data.version}`].filter(Boolean).join(' · ');
  return `// GRC Nexus — Catálogo multinorma derivado de Rosetta Multinorma
// Copyright (C) 2026  hiramyclases@gmail.com
// Catálogo derivado de Rosetta Multinorma por heindall92 (https://github.com/heindall92/rosetta_multinorma)
// Licenciado bajo GNU General Public License v2. Ver LICENSE y NOTICE.md.
// Generado con tools/sync-catalog.js desde ${origin}. No editar a mano.
/* Catálogo multinorma (controles unificados y correspondencias ponderadas ENS · ISO 27001 · NIS2 · ISO 42001), incorporado desde ${origin}. */
window.NEXUS_CATALOG=${JSON.stringify(data)};
`;
}

function readCurrent(file) {
  if (!fs.existsSync(file)) return null;
  const line = fs.readFileSync(file, 'utf8').split('\n').find((l) => l.startsWith('window.NEXUS_CATALOG='));
  if (!line) fail(`${path.relative(ROOT, file)} no contiene la línea «window.NEXUS_CATALOG=…».`);
  return JSON.parse(line.slice('window.NEXUS_CATALOG='.length).replace(/;\s*$/, ''));
}

function diff(oldC, newC) {
  const s = (x) => JSON.stringify(x);
  const byId = (l) => new Map(l.map((x) => [x.id, x]));
  const out = { version: oldC?.version !== newC.version ? [oldC?.version ?? '—', newC.version] : null, controls: { added: [], removed: [], changed: [] }, reqs: {}, domains: s(oldC?.domains) !== s(newC.domains) };
  const o = byId(oldC?.controls || []), n = byId(newC.controls);
  for (const [id, c] of n) if (!o.has(id)) out.controls.added.push(id); else if (s(o.get(id)) !== s(c)) out.controls.changed.push(id);
  for (const id of o.keys()) if (!n.has(id)) out.controls.removed.push(id);
  for (const fw of FRAMEWORKS) {
    const a = byId(oldC?.frameworks?.[fw] || []), b = byId(newC.frameworks[fw]), r = { added: [], removed: [], changed: [] };
    for (const [id, x] of b) if (!a.has(id)) r.added.push(id); else if (s(a.get(id)) !== s(x)) r.changed.push(id);
    for (const id of a.keys()) if (!b.has(id)) r.removed.push(id);
    out.reqs[fw] = r;
  }
  out.same = s(oldC) === s(newC);
  return out;
}

function summary(d) {
  const l = (a) => (a.length ? `${a.length} (${a.slice(0, 12).join(', ')}${a.length > 12 ? ', …' : ''})` : '0');
  const lines = [d.same ? 'Sin diferencias de datos.' : 'Hay diferencias de datos:'];
  if (d.version) lines.push(`  versión del catálogo: ${d.version[0]} → ${d.version[1]}`);
  if (d.domains) lines.push('  dominios: modificados');
  lines.push(`  controles: añadidos ${l(d.controls.added)} · eliminados ${l(d.controls.removed)} · modificados ${l(d.controls.changed)}`);
  for (const [fw, r] of Object.entries(d.reqs)) if (r.added.length || r.removed.length || r.changed.length)
    lines.push(`  requisitos ${fw}: añadidos ${l(r.added)} · eliminados ${l(r.removed)} · modificados ${l(r.changed)}`);
  return lines.join('\n');
}

function sync({ rosetta, out = OUT, mode = 'write' }) {
  const file = path.join(rosetta, 'src', 'data', 'catalog.json');
  if (!fs.existsSync(file)) fail(`No encuentro ${file}. Indica la ruta al repositorio de Rosetta (argumento o ROSETTA_DIR).`);
  let cat; try { cat = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(`${file} no es JSON válido: ${e.message}`); }
  validate(cat);
  const data = project(cat), d = diff(readCurrent(out), data);
  if (mode === 'write') fs.writeFileSync(out, render(data, { app: appVersion(rosetta), commit: gitInfo(rosetta) }));
  return { data, diff: d };
}

if (require.main === module) {
  const args = process.argv.slice(2), flags = new Set(args.filter((a) => a.startsWith('--')));
  const pos = args.filter((a) => !a.startsWith('--'));
  const unknown = [...flags].filter((f) => !['--check', '--dry-run'].includes(f));
  if (unknown.length) { console.error(`Opción desconocida: ${unknown.join(', ')}. Usa --check o --dry-run.`); process.exit(2); }
  const rosetta = path.resolve(pos[0] || process.env.ROSETTA_DIR || path.join(ROOT, '..', 'rosetta_multinorma'));
  const mode = flags.has('--check') ? 'check' : flags.has('--dry-run') ? 'dry-run' : 'write';
  try {
    const { diff: d } = sync({ rosetta, mode });
    if (mode === 'write') console.log(`app/catalog.js generado desde ${rosetta}.\n${summary(d)}`);
    else { console.log(summary(d)); if (mode === 'check' && !d.same) process.exit(1); }
  } catch (e) {
    if (e instanceof SyncError) { console.error('✗ ' + e.message); process.exit(2); }
    throw e;
  }
}
module.exports = { sync, validate, project, diff, render, SyncError };
