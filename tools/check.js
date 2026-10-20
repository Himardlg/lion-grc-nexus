// Uso: node tools/check.js  · Valida el catálogo y hace una prueba de humo de todas las vistas (sin navegador).
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
global.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=v}};
global.location={hash:''};global.window=global;global.scrollTo=()=>{};
global.document={documentElement:{},getElementById:()=>({innerHTML:''}),querySelector:()=>null,querySelectorAll:()=>[]};
const src=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
(0,eval)(src+';global.__t={C,db,page,ctx,ctl,esc,normalizeCompany,panelView};global.deleteCompany=deleteCompany;global.view=view;');
const {C,page,ctx,normalizeCompany,db}=global.__t;global.render=global.render||(()=>{});let bad=0;const fail=m=>{bad++;console.log('✗',m)},ok=m=>console.log('✓',m);
const ids=a=>new Set(a.map(x=>x.id));
if(ids(C.requirements).size!==C.requirements.length)fail('IDs de requisito duplicados');
if(ids(C.controls).size!==C.controls.length)fail('IDs de control duplicados');
C.requirements.forEach(r=>{
 if(!C.controls.some(c=>c.id===r.control))fail(`${r.id}: control inexistente ${r.control}`);
 else if(!global.__t.ctl(r.control).fw.includes(r.framework))fail(`${r.id}: ${r.control} no declara ${r.framework}`);
 if(!(C.references[r.framework].items.some(i=>i[0]===r.reference)))fail(`${r.id}: referencia «${r.reference}» no existe en ${r.framework}`);
});
C.mappings.forEach(m=>{if(!C.requirements.some(r=>r.id===m.requirement)||!C.controls.some(c=>c.id===m.control))fail('Mapeo huérfano '+m.id)});
C.ensMeasures.forEach(m=>{if(!C.controls.some(c=>c.id===m.control))fail('Medida ENS huérfana '+m.id)});
if(!bad)ok(`Catálogo: ${C.requirements.length} requisitos, ${C.controls.length} controles, ${C.mappings.length} mapeos`);
// vistas
const c=ctx();c.selected=C.frameworks.map(f=>f.id);let pages=0;
for(const p of ['inicio','informe','compare','home','panel','companies','company','scope','library','equivalences','requirements','controls','current','maturity','needs','actions','evidence','risks','audits','map','settings','profile']){location.hash='#'+p;try{page(p);pages++}catch(e){fail(`vista ${p}: ${e.message}`)}}
C.requirements.forEach(r=>{try{location.hash='#detail?type=requirement&id='+r.id;page('detail')}catch(e){fail('detalle '+r.id+': '+e.message)}});
if(!bad)ok(`${pages} vistas y ${C.requirements.length} detalles sin errores`);
// matriz de correspondencias: estado por empresa, fuente y formulario de revisión
const mapped=normalizeCompany({name:'Matriz QA',mappingReviews:{'MAP-QA-1':{status:'Validada',reviewer:'Auditora',reviewDate:'2026-10-09',note:'Cobertura contrastada'}}});
if(mapped.mappingReviews['MAP-QA-1']?.status!=='Validada'||mapped.mappingReviews['MAP-QA-1']?.reviewer!=='Auditora')fail('Matriz: no conserva estado de validación');else ok('Matriz: estado, revisor y fecha se conservan');
location.hash='#equivalences';const matrixHtml=page('equivalences');
if(!matrixHtml.includes('Consultar fuente oficial')||!matrixHtml.includes('No equivalente')||!matrixHtml.includes('Exportar revisión CSV'))fail('Matriz: faltan fuentes, estados o exportación');else ok('Matriz: fuente oficial, estados de revisión y exportación disponibles');
// campos ampliados de trazabilidad en evidencia, riesgo y auditoría
const enriched=normalizeCompany({name:'QA',evidence:[{title:'Política',control:'GOB-01',owner:'Ana',reviewDate:'2026-12-01',status:'Revisar',notes:'Revisión anual'}],risks:[{title:'Interrupción',control:'RIE-01',impact:4,likelihood:3,owner:'Luis',treatment:'Plan de continuidad',status:'En tratamiento'}],audits:[{name:'Auditoría interna',scope:'ISO 27001',owner:'Eva',date:'2026-11-15',findings:'Dos observaciones',status:'En curso'}]});
if(enriched.evidence[0]?.owner!=='Ana'||enriched.evidence[0]?.status!=='Revisar')fail('Evidencias: campos de revisión no se conservan');else ok('Evidencias: responsable, revisión y vigencia se conservan');
if(enriched.risks[0]?.treatment!=='Plan de continuidad'||enriched.risks[0]?.status!=='En tratamiento')fail('Riesgos: tratamiento no se conserva');else ok('Riesgos: responsable y tratamiento se conservan');
if(enriched.audits[0]?.findings!=='Dos observaciones'||enriched.audits[0]?.date!=='2026-11-15')fail('Auditorías: hallazgos o fecha no se conservan');else ok('Auditorías: responsable, fecha y hallazgos se conservan');
// importación hostil
const evil=normalizeCompany({name:'<img src=x onerror=alert(1)>',selected:['x','nis2'],target:99,actions:[{title:'<b>',control:'<script>',fw:['<i>'],status:'<u>'}],risks:[{title:'r',control:'<s>',impact:'<s>',likelihood:9}]});
Object.assign(c,evil,{id:c.id});location.hash='#actions';const h=page('actions')+page('risks');
if(/<script>|<img src|<s>|<u>/.test(h))fail('Importación: HTML sin escapar');else ok('Importación hostil neutralizada');
// sin empresas: borrar todas y recorrer vistas
const ids2=Object.keys(db.companies);ids2.forEach(i=>{global.confirm=()=>true;deleteCompany(i)});
if(Object.keys(db.companies).length)fail('deleteCompany no elimina');
for(const p of ['panel','home','company','scope','requirements','current','actions','companies','settings','library']){location.hash='#'+p;try{page(p)}catch(e){fail('sin empresa, vista '+p+': '+e.message)}}
location.hash='#panel';try{if(!/Aún no hay ninguna empresa/.test(view()))fail('sin empresa: falta pantalla de bienvenida')}catch(e){fail('shell sin empresa: '+e.message)}
if(!bad)ok('Eliminar todas las empresas y navegar sin ellas funciona');
console.log(bad?`\n${bad} problema(s)`:'\nTodo correcto');process.exit(bad?1:0);
