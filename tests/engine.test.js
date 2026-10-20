// node --test tests/  · Pruebas del motor de cobertura
const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
global.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=v}};
let _h='';global.location={get hash(){return _h},set hash(v){_h=v?(String(v).startsWith('#')?v:'#'+v):''}};global.window=global;global.scrollTo=()=>{};
global.document={documentElement:{},getElementById:()=>({innerHTML:''}),querySelector:()=>null,querySelectorAll:()=>[]};
const src=[...fs.readFileSync(path.join(path.join(__dirname,'..'),'index.html'),'utf8').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n');
(0,eval)(src+';global.T={C,ctx,ctl,reqState,coverage,csvCell,normalizeCompany,overdue,wizGo,wizardBar,wizExit,WIZ,searchCatalog,compareFw,loadDemo,equivalents,db,migrateCompany,coherence,informeView,ensEffectiveCategory,ensReqLevel,xlsxBuild,buildBackupPayload,reqIntro,page,view,getDB:()=>db};global.alert=m=>{global.lastAlert=m};');
const {C,ctx,ctl,reqState,coverage,csvCell,normalizeCompany,overdue,wizGo,wizardBar,wizExit,WIZ,searchCatalog,compareFw,loadDemo,equivalents,db,migrateCompany,coherence,informeView,ensEffectiveCategory,ensReqLevel,xlsxBuild,buildBackupPayload,reqIntro,page,view,getDB}=global.T;
const reset=()=>{const c=ctx();c.selected=C.frameworks.map(f=>f.id);c.assess={};c.soa={};c.gapclosed={};c.target=3;return c};
test('sin evaluación no hay cobertura',()=>{reset();assert.equal(coverage().pct,0)});
test('alcanzar el objetivo cubre requisitos con mapeo completo',()=>{const c=reset(),r=C.requirements.find(r=>r.maps.length===1&&r.maps[0].w===1);c.assess[r.control]={level:3};assert.equal(reqState(r),'cubierto')});
test('un mapeo parcial no se da por cubierto hasta cerrar la brecha',()=>{const c=reset(),r=C.requirements.find(r=>r.maps.length&&r.maps.every(m=>m.w<1));assert.ok(r,'debe haber requisitos con correspondencia solo parcial');r.maps.forEach(m=>c.assess[m.control]={level:5});assert.equal(reqState(r),'parcial');c.gapclosed[r.id]=true;assert.equal(reqState(r),'cubierto')});
test('«No aplica» funciona en ENS e ISO 27001',()=>{const c=reset();for(const f of ['ens','iso27001']){const r=C.requirements.find(r=>r.framework===f);c.soa[r.id]={app:false};assert.equal(reqState(r),'no_aplica')}});
test('un requisito con varios controles necesita todos',()=>{const c=reset(),r=C.requirements.find(r=>r.maps.filter(m=>m.w>=1).length>=2);r.maps.forEach(m=>c.assess[m.control]={level:3});c.assess[r.maps[0].control]={level:0};assert.notEqual(reqState(r),'cubierto');c.assess[r.maps[0].control]={level:3};assert.equal(reqState(r),'cubierto')});
test('ENS: la categoría filtra medidas no exigidas',()=>{const c=reset(),r=C.requirements.find(r=>r.framework==='ens'&&r.ens&&!r.ens[0]&&r.ens[2]);assert.ok(r);c.ensCategory='alta';assert.notEqual(reqState(r),'no_aplica');c.ensCategory='basica';assert.equal(reqState(r),'no_aplica')});
test('catálogo: todo requisito tiene control y todo control existe',()=>{for(const r of C.requirements){assert.ok(r.maps.length,r.id);r.maps.forEach(m=>assert.ok(ctl(m.control),m.control))}});
test('csv neutraliza fórmulas',()=>{assert.equal(csvCell('=1+1'),'"\'=1+1"');assert.equal(csvCell('a"b'),'"a""b"')});
test('importación acota valores y fechas',()=>{const c=normalizeCompany({target:99,ensCategory:'x',actions:[{title:'t',due:'mañana',status:'z'}]});assert.equal(c.target,5);assert.equal(c.ensCategory,'');assert.equal(c.actions[0].due,'');assert.equal(c.actions[0].status,'Pendiente')});
test('acción vencida',()=>{assert.ok(overdue({due:'2000-01-01',status:'Pendiente'}));assert.ok(!overdue({due:'2000-01-01',status:'Verificada'}))});
test('asistente: avanza paso a paso y exige norma antes de continuar',()=>{
 const c=reset();c.wizard=1;c.selected=[];location.hash='#scope';global.lastAlert=null;
 wizGo(1);assert.ok(global.lastAlert);assert.equal(location.hash,'#scope');
 c.selected=['nis2'];wizGo(1);assert.equal(location.hash,'#current');assert.equal(c.wizard,2);
 assert.match(wizardBar('current'),/Confirmar y continuar/);
 wizGo(-1);assert.equal(location.hash,'#scope');
 location.hash='#actions';c.wizard=4;assert.match(wizardBar('actions'),/Finalizar/);wizGo(1);assert.equal(c.wizard,null);assert.equal(location.hash,'#panel');
 assert.equal(wizardBar('current'),'')});
test('buscador: encuentra requisitos y controles sin tildes ni mayúsculas',()=>{const r=searchCatalog('PROVEEDORES');assert.ok(r.some(h=>h.t==='ctl')&&r.some(h=>h.t==='req'));assert.equal(searchCatalog('').length,0);const q=C.requirements.find(r=>equivalents(r).length);assert.ok(q)});
test('comparador: ENS frente a ISO 27001 es coherente',()=>{const z=compareFw('ens','iso27001');assert.equal(z.A.length,z.withEq+z.onlyA.length);assert.ok(z.withEq>0&&z.strong<=z.withEq);const y=compareFw('iso27001','ens');assert.equal(y.B.length,z.A.length)});
test('empresa de ejemplo: crea datos y da cobertura > 0',()=>{loadDemo();const c=ctx();assert.equal(c.ensCategory,'alta');assert.ok(coverage().pct>0);assert.ok(c.actions.length>0);assert.ok(Object.keys(db.companies).includes(c.id))});
test('migración: evaluaciones antiguas pasan a los controles nuevos',()=>{const c=migrateCompany({assess:{'CTL-001':{level:3},'CTL-006':{level:2},'CTL-013':{level:4}},actions:[{control:'CTL-004'}],evidence:[],risks:[]});assert.equal(c.assess['GOB-01'].level,3);assert.equal(c.assess['CON-02'].level,4);assert.equal(c.actions[0].control,'PRO-01');assert.ok(!c.assess['CTL-001'])});
test('coherencia: avisa de nivel alto sin responsable ni evidencia',()=>{const c=reset();c.actions=[];c.evidence=[];c.assess={'GOB-01':{level:5}};assert.ok(coherence(c).some(w=>/sin responsable/.test(w)))});
test('informe: incluye nombre escapado y aviso legal',()=>{loadDemo();ctx().name='<b>X</b>';const h=informeView();assert.ok(!h.includes('<b>X</b>')&&/no constituye certificación/i.test(h))});
test('ENS: un nivel alto en una dimensión eleva la categoría efectiva',()=>{const c=reset();c.ensCategory='basica';c.ensLevels={};assert.equal(ensEffectiveCategory(c),'basica');c.ensLevels={D:'alta'};assert.equal(ensEffectiveCategory(c),'alta')});
test('ENS: la medida usa el nivel de sus dimensiones, no solo el global',()=>{const c=reset();const r=C.requirements.find(r=>r.framework==='ens'&&r.ensDims&&r.ensDims!=='Categoría'&&r.ensDims.length===1);assert.ok(r);c.ensCategory='basica';c.ensLevels={};const base=ensReqLevel(r,c);assert.equal(base,0);c.ensLevels={[r.ensDims]:'alta'};assert.equal(ensReqLevel(r,c),2)});
test('xlsx: genera un zip con las partes de un libro de Excel',()=>{const u=xlsxBuild([['Hoja',[['a','b'],['x',1]]]]);assert.equal(u[0],0x50);assert.equal(u[1],0x4b);const t=Buffer.from(u).toString('latin1');for(const n of ['[Content_Types].xml','xl/workbook.xml','xl/worksheets/sheet1.xml','xl/styles.xml'])assert.ok(t.includes(n),n);require('fs').writeFileSync(process.env.XLSX_OUT||require('os').tmpdir()+'/nexus-test.xlsx',u)});

test('respaldo completo: incluye tipo, versión, empresas y preferencias',()=>{const b=buildBackupPayload();assert.equal(b.type,'grc-nexus-backup');assert.equal(b.schemaVersion,19);assert.ok(b.companies&&typeof b.companies==='object');assert.ok(b.settings&&typeof b.settings==='object');assert.ok(b.exportedAt)});
test('restauración: un respaldo válido reemplaza los proyectos con confirmación',()=>{
 const payload=buildBackupPayload();payload.companies=Object.fromEntries(Object.entries(payload.companies).slice(0,1));
 const first=Object.values(payload.companies)[0];first.name='Proyecto restaurado QA';payload.activeCompanyId=Object.keys(payload.companies)[0];
 global.confirm=()=>true;global.FileReader=class{readAsText(file){this.result=file.content;this.onload()}};
 const event={target:{files:[{size:Buffer.byteLength(JSON.stringify(payload)),content:JSON.stringify(payload)}],value:'backup.json'}};
 restoreBackup(event);assert.equal(ctx().name,'Proyecto restaurado QA');assert.equal(Object.keys(getDB().companies).length,1);assert.equal(event.target.value,'');
});
test('restauración: rechaza un JSON que no es un respaldo y mantiene los datos',()=>{
 const before=Object.keys(getDB().companies).length,oldName=ctx().name;global.FileReader=class{readAsText(file){this.result=file.content;this.onload()}};
 const event={target:{files:[{size:12,content:JSON.stringify({type:'otro',companies:{x:{name:'No importar'}}})}],value:'bad.json'}};
 restoreBackup(event);assert.equal(Object.keys(getDB().companies).length,before);assert.equal(ctx().name,oldName);assert.match(global.lastAlert,/no es válido o está dañado/i);
});

test('detalle de requisito: lista todas las capacidades y las equivalencias',()=>{reset();const r=C.requirements.find(r=>r.maps.length>=2&&equivalents(r).length);assert.ok(r);const h=reqIntro(r);r.maps.forEach(m=>assert.ok(h.includes(m.control),m.control));assert.match(h,/Cómo lo cubre Nexus/);assert.match(h,/otras normas/)});
test('detalle ENS: indica el nivel considerado y dónde se exige',()=>{const c=reset();c.ensCategory='basica';c.ensLevels={};const r=C.requirements.find(r=>r.framework==='ens'&&r.ens&&!r.ens[0]);assert.ok(r);const h=reqIntro(r);assert.match(h,/no se exige/);assert.match(h,/Se exige en/)});
test('vistas: nombre de empresa y texto hostil quedan escapados en todas las pantallas',()=>{const c=reset();c.name='<img src=x onerror=alert(1)>';c.sector='<script>x</script>';let bad=[];for(const p of ['inicio','panel','informe','compare','scope','library','equivalences','requirements','controls','current','actions','companies','company','settings','map']){location.hash='#'+p;try{const h=page(p);if(/<img src=x|<script>x/.test(h))bad.push(p)}catch(e){bad.push(p+':'+e.message)}}assert.deepEqual(bad,[])});
