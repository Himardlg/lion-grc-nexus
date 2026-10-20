// Pruebas de tools/sync-catalog.js (sin dependencias). Ejecuta: node --test tests/sync-catalog.test.js
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const S = require('../tools/sync-catalog.js');
const SCRIPT = path.join(__dirname, '..', 'tools', 'sync-catalog.js');

const req = (id, extra = {}) => ({ id, code: id, t: 'T ' + id, g: 'G', t_en: 'x', g_en: 'x', ...extra });
function fixture() {
  return {
    version: '9.9.9',
    domains: [{ id: 'GOB', t: 'Gobierno', t_en: 'Gov', ic: 'landmark' }],
    frameworks: {
      ens: { id: 'ens', reqs: [req('org.1', { dims: 'Categoría', bajo: 'aplica', medio: '+ R1', alto: 'aplica', ref: 'r' }), req('op.x', { dims: 'D', bajo: 'n.a.', medio: 'n.a.', alto: 'aplica' })] },
      iso27001: { id: 'iso27001', reqs: [req('A5.1')] },
      nis2: { id: 'nis2', reqs: [req('1.1')] },
      iso42001: { id: 'iso42001', reqs: [req('C4.1')] },
      nist: { id: 'nist', reqs: [req('GV.1')] },
    },
    controls: [{ id: 'GOB-01', dom: 'GOB', t: 'Política', obj: 'O', ev: 'E', t_en: 'x', obj_en: 'x', ev_en: 'x',
      maps: { ens: [{ id: 'org.1', w: 1 }], iso27001: [{ id: 'A5.1', w: 0.5 }], nis2: [], iso42001: [], nist: [{ id: 'GV.1', w: 1 }] } }],
  };
}
function repo(cat) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ros-'));
  fs.mkdirSync(path.join(d, 'src', 'data'), { recursive: true });
  fs.writeFileSync(path.join(d, 'src', 'data', 'catalog.json'), JSON.stringify(cat));
  fs.writeFileSync(path.join(d, 'package.json'), '{"version":"2.3.0"}');
  return d;
}

test('sync-catalog: proyecta al formato de Nexus (4 marcos, tuplas, sin _en ni listas vacías)', () => {
  const p = S.project(fixture());
  assert.deepStrictEqual(Object.keys(p), ['version', 'domains', 'controls', 'frameworks']);
  assert.deepStrictEqual(p.domains, [{ id: 'GOB', t: 'Gobierno' }]);
  assert.deepStrictEqual(p.controls[0], { id: 'GOB-01', dom: 'GOB', t: 'Política', obj: 'O', ev: 'E', maps: { ens: [['org.1', 1]], iso27001: [['A5.1', 0.5]] } });
  assert.deepStrictEqual(Object.keys(p.frameworks), ['ens', 'iso27001', 'nis2', 'iso42001']);
  assert.deepStrictEqual(p.frameworks.ens[1], { id: 'op.x', code: 'op.x', t: 'T op.x', g: 'G', e: [0, 0, 1], d: 'D' });
  assert.deepStrictEqual(p.frameworks.iso27001[0], { id: 'A5.1', code: 'A5.1', t: 'T A5.1', g: 'G' });
});

test('sync-catalog: valida campos obligatorios con mensajes en español', () => {
  const bad = (mut, re) => { const c = fixture(); mut(c); assert.throws(() => S.validate(c), re); };
  bad((c) => delete c.version, /Falta el campo «version»/);
  bad((c) => delete c.frameworks.nis2, /Falta el marco «nis2»/);
  bad((c) => delete c.controls[0].obj, /Control GOB-01: falta el campo «obj»/);
  bad((c) => (c.controls[0].dom = 'XXX'), /el dominio «XXX» no existe/);
  bad((c) => c.controls[0].maps.ens.push({ id: 'org.99', w: 1 }), /«org.99» no existe/);
  bad((c) => delete c.frameworks.ens.reqs[0].alto, /Medida ENS org.1: falta el campo «alto»/);
  bad((c) => c.controls.push({ ...c.controls[0] }), /Control duplicado: GOB-01/);
});

test('sync-catalog: escribe con cabecera GPL v2 y atribución; --check y --dry-run no escriben', () => {
  const ros = repo(fixture()), out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nx-')), 'catalog.js');
  S.sync({ rosetta: ros, out });
  const txt = fs.readFileSync(out, 'utf8');
  assert.match(txt, /GNU General Public License v2/);
  assert.match(txt, /heindall92/);
  assert.match(txt, /Rosetta v2\.3\.0/);
  global.window = {}; (0, eval)(txt);
  assert.deepStrictEqual(window.NEXUS_CATALOG, S.project(fixture()));
  assert.strictEqual(S.sync({ rosetta: ros, out, mode: 'check' }).diff.same, true);
  const c2 = fixture(); c2.controls[0].t = 'Cambiado'; const ros2 = repo(c2);
  const d = S.sync({ rosetta: ros2, out, mode: 'dry-run' }).diff;
  assert.deepStrictEqual(d.controls.changed, ['GOB-01']);
  assert.strictEqual(fs.readFileSync(out, 'utf8'), txt, 'dry-run no debe escribir');
});

test('sync-catalog: el catálogo actual coincide con su propia proyección (formato estable)', () => {
  global.window = {}; (0, eval)(fs.readFileSync(path.join(__dirname, '..', 'app', 'catalog.js'), 'utf8'));
  const N = window.NEXUS_CATALOG;
  assert.deepStrictEqual(Object.keys(N), ['version', 'domains', 'controls', 'frameworks']);
  assert.deepStrictEqual(Object.keys(N.frameworks), ['ens', 'iso27001', 'nis2', 'iso42001']);
  assert.ok(N.controls.every((c) => Object.keys(c).join() === 'id,dom,t,obj,ev,maps'));
});

const ROS = process.env.ROSETTA_DIR;
test('sync-catalog --check contra Rosetta (ROSETTA_DIR) da 0 si coincide', { skip: !ROS && 'define ROSETTA_DIR para probar contra un clon de Rosetta' }, () => {
  const r = spawnSync(process.execPath, [SCRIPT, ROS, '--check'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
});

test('sync-catalog: código 1 en --check si hay diferencias y 2 con error de entrada', () => {
  const c = fixture(); const ros = repo(c);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nx-'));
  const r1 = spawnSync(process.execPath, [SCRIPT, ros, '--check'], { encoding: 'utf8' });
  assert.strictEqual(r1.status, 1, 'el catálogo real difiere del fixture');
  assert.match(r1.stdout, /Hay diferencias/);
  const r2 = spawnSync(process.execPath, [SCRIPT, tmp, '--check'], { encoding: 'utf8' });
  assert.strictEqual(r2.status, 2);
  assert.match(r2.stderr, /No encuentro/);
});
