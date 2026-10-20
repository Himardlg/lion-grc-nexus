// GRC Nexus — Herramienta de gestión de cumplimiento multinorma
// Copyright (C) 2026  hiramyclases@gmail.com
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// Catalog data (app/catalog.js) derived from Rosetta Multinorma
// by heindall92, licensed under GNU GPL v2.
// Original: https://github.com/heindall92/rosetta_multinorma

/* GRC Nexus 1.9.1 · Panel multinorma: "implanta una vez, comprueba qué cubre en cada norma". Se carga antes de app.js. */
function csvCell(v){v=String(v??'');if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
function panelData(){
 const c=ctx(),lvl=x=>c.assess[x.id]?.level??0;
 const per=c.selected.map(f=>{const rs=C.requirements.filter(r=>r.framework===f),n={cubierto:0,parcial:0,gap:0,no_aplica:0};rs.forEach(r=>n[reqState(r)]++);const t=rs.length-n.no_aplica;return{f,n,total:rs.length,pct:t?Math.round(n.cubierto/t*100):0}});
 const impact=activeControls().filter(x=>lvl(x)<c.target).map(x=>{const rs=activeReqs().filter(r=>usesCtl(r,x.id)&&!['cubierto','no_aplica'].includes(reqState(r)));return{x,n:rs.length,nf:new Set(rs.map(r=>r.framework)).size,l:lvl(x)}}).filter(z=>z.n).sort((a,b)=>b.n-a.n||b.nf-a.nf).slice(0,5);
 return{c,per,impact,lvl};
}
function panelView(){
 const {c,per,impact,lvl}=panelData(),cov=coverage();
 if(!c.selected.length)return head('PANEL','Implanta una vez, comprueba cada norma','Elige las normas de '+esc(c.name)+' para ver qué cubre cada capacidad.')+panelNorms()+panelExplorer();
 const ctls=activeControls();
 return head('PANEL','Implanta una vez, comprueba cada norma','Cobertura de '+esc(c.name)+' por norma, matriz capacidad × norma y las acciones que más requisitos cierran.')+
 `<section class="pn-kpis"><div><b>${cov.pct}%</b><span>cobertura global</span></div><div><b>${mavg().toFixed(1)}/5</b><span>madurez media</span></div><div><b>${ctls.filter(x=>lvl(x)<c.target).length}</b><span>capacidades bajo objetivo</span></div><div class="pn-btns"><button onclick="exportExcel()">Exportar Excel</button><button class="secondary" onclick="exportCoverage()">Exportar CSV</button><button class="secondary" onclick="window.print()">Imprimir / PDF</button><button class="secondary" onclick="wizStart()">Asistente</button><button class="secondary" onclick="shareLink()">Copiar enlace</button>${c.selected.includes('iso27001')?'<button class="secondary" onclick="exportSoA(\'iso27001\')">SoA ISO 27001</button>':''}${c.selected.includes('ens')?'<button class="secondary" onclick="exportSoA(\'ens\')">SoA ENS</button>':''}</div></section>
 <section class="panel"><div class="panelhead"><h2>Cobertura por norma</h2></div>${per.map(p=>`<div class="pn-row"><a href="#library?fw=${p.f}"><b>${esc(fw(p.f).short)}</b></a><div class="pn-bar" role="img" aria-label="${p.pct}% cubierto"><i class="ok" style="width:${p.total?p.n.cubierto/p.total*100:0}%"></i><i class="mid" style="width:${p.total?p.n.parcial/p.total*100:0}%"></i></div><span>${p.pct}% · ${p.n.cubierto} cubiertos · ${p.n.parcial} parciales · ${p.n.gap} gaps${p.n.no_aplica?` · ${p.n.no_aplica} n/a`:''}</span></div>`).join('')}</section>
 <section class="panel"><div class="panelhead"><h2>Mayor impacto: ¿qué implantar primero?</h2></div>${impact.length?impact.map(z=>`<div class="line"><div><b>${z.x.id} · ${esc(z.x.name)}</b><small>Llevarlo a ${c.target}/5 (hoy ${z.l}/5) avanza ${z.n} requisito(s) en ${z.nf} norma(s)</small></div><button class="tertiary" onclick="make('${z.x.id}')">Crear acción</button></div>`).join(''):'<div class="empty">Todas las capacidades alcanzan el objetivo.</div>'}</section>
 ${panelExplorer()}<section class="panel"><div class="panelhead"><h2>Matriz capacidad × norma</h2><small>Madurez 0-5 · «·» = la norma no usa esta capacidad</small></div><div class="pn-scroll"><table class="pn-matrix"><thead><tr><th>Capacidad</th>${c.selected.map(f=>`<th>${esc(fw(f).short)}</th>`).join('')}</tr></thead><tbody>${ctls.map(x=>`<tr><th scope="row"><a href="#detail?type=control&id=${x.id}">${x.id} · ${esc(x.name)}</a></th>${c.selected.map(f=>x.fw.includes(f)?`<td class="lv${lvl(x)}">${lvl(x)}</td>`:'<td class="na">·</td>').join('')}</tr>`).join('')}</tbody></table></div></section>`;
}
function exportCoverage(){
 const c=ctx(),rows=[['Norma','Requisito','Referencia','Título','Control','Madurez','Objetivo','Estado','Tipo de mapeo','Nota']];
 activeReqs().forEach(r=>{const m=C.mappings.find(x=>x.requirement===r.id);rows.push([fw(r.framework).short,r.id,r.reference,r.title,r.maps.map(k=>k.control).join(' + '),Math.min(5,...r.maps.map(k=>c.assess[k.control]?.level??0)),c.target,statusLabel(reqState(r)),m?.type,m?.rationale]);});
 const blob=new Blob(['\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='cobertura-'+(c.name||'empresa').replace(/[^a-z0-9]+/gi,'-')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

function home(){return panelView()}
function panelNorms(){const c=ctx();return panelChips(c)+panelGuidance(c)}
function panelChips(c){return `<section class="pn-norms" aria-label="Normas">${C.frameworks.map(f=>{const on=c.selected.includes(f.id);return `<button class="pn-chip ${on?'on':''}" aria-pressed="${on}" onclick="toggle('${f.id}',${!on})"><b>${esc(f.short)}</b><small>${C.requirements.filter(r=>r.framework===f.id).length} requisitos</small></button>`}).join('')}</section>`}
function panelExplorer(){
 const c=ctx(),q=new URLSearchParams((location.hash.split('?')[1]||'')),id=q.get('ctl'),x=C.controls.find(k=>k.id===id)||activeControls()[0]||C.controls[0],l=c.assess[x.id]?.level??0;
 const rs=C.requirements.filter(r=>usesCtl(r,x.id)),byFw=C.frameworks.map(f=>({f,rs:rs.filter(r=>r.framework===f.id)})).filter(g=>g.rs.length);
 return `<section class="panel"><div class="panelhead"><h2>Si implantas esto una vez… ¿qué cubres?</h2><select aria-label="Capacidad" onchange="location.hash='panel?ctl='+this.value">${C.controls.map(k=>`<option value="${k.id}" ${k.id===x.id?'selected':''}>${k.id} · ${esc(k.name)}</option>`).join('')}</select></div>
 <p class="pn-lead"><b>${esc(x.name)}</b> · madurez actual ${l}/${c.target} · cubre <b>${rs.length}</b> requisito(s) en <b>${byFw.length}</b> norma(s). <a href="#detail?type=control&id=${x.id}">Ver detalle</a></p>
 <div class="pn-cols">${byFw.map(g=>`<div class="pn-col"><h3>${esc(g.f.short)}${c.selected.includes(g.f.id)?'':' <small>(sin seleccionar)</small>'}</h3>${g.rs.map(r=>{const st=reqState(r);return `<a class="pn-req ${c.selected.includes(g.f.id)?st:'off'}" href="#detail?type=requirement&id=${r.id}"><b>${esc(r.reference)}</b><span>${esc(r.title)}</span>${c.selected.includes(g.f.id)?`<em>${esc(statusLabel(st))}</em>`:''}</a>`}).join('')}</div>`).join('')}</div></section>`}

const today=()=>new Date().toISOString().slice(0,10);
function overdue(a){return !!a.due&&a.due<today()&&!['Completada','Verificada'].includes(a.status)}
function updateActionField(i,k,v){const a=ctx().actions[i];if(!a||!['owner','due','note'].includes(k))return;a[k]=String(v).slice(0,500);ctx().updatedAt=now();save();render()}
function setSoaNote(id,v){const c=ctx();c.soa[id]={app:c.soa[id]?.app!==false,note:String(v).slice(0,500)};save()}
function shareLink(){const u=location.href;navigator.clipboard?.writeText(u).then(()=>alert('Enlace copiado a la vista actual. Los datos de la empresa no se incluyen: se guardan solo en este navegador.'),()=>prompt('Copia el enlace:',u))}
function panelGuidance(c){
 const n=[],late=c.actions.filter(overdue).length;
 if(c.selected.includes('ens'))n.push((c.ensCategory||Object.keys(c.ensLevels||{}).length)?`ENS · categoría efectiva <b>${{basica:'Básica',media:'Media',alta:'Alta'}[ensEffectiveCategory(c)]}</b>${ensEffectiveCategory(c)!==c.ensCategory?' (elevada por los niveles de dimensión)':''}: determina qué medidas del Anexo II aplican.`:'ENS · falta determinar la <b>categoría</b> (Básica/Media/Alta) en <a href="#company">Empresa</a>.');
 if(c.selected.includes('nis2'))n.push(c.nis2Class==='fuera'?'NIS2 · marcada como <b>fuera de ámbito</b>: revisa si sigue siendo necesaria.':c.nis2Class?`NIS2 · entidad <b>${c.nis2Class==='esencial'?'esencial':'importante'}</b>: condiciona el régimen de supervisión.`:'NIS2 · falta clasificar la entidad (esencial/importante) en <a href="#company">Empresa</a>.');
 if(c.selected.includes('dora'))n.push(c.doraSimplified?'DORA · marco <b>simplificado</b> (art. 16): valida que cumples las condiciones de proporcionalidad.':'DORA · marco completo de gestión del riesgo TIC.');
 if(c.wizard!=null)n.push(`Asistente de configuración sin terminar: <a href="#${WIZ[c.wizard]?.[0]||'company'}">continuar</a>.`);
 coherence(c).forEach(w=>n.push(w));
 if(late)n.push(`<b>${late}</b> acción(es) <b>vencida(s)</b> en <a href="#actions">Plan de acción</a>.`);
 return n.length?`<section class="pn-guide" aria-label="Avisos">${n.map(x=>`<p>${x}</p>`).join('')}</section>`:''}
function exportSoA(f){
 const c=ctx(),rows=[['Requisito','Referencia','Título','Aplica','Justificación','Control','Madurez','Estado','Responsable']];
 C.requirements.filter(r=>r.framework===f).forEach(r=>{const so=c.soa[r.id],a=c.assess[r.control];rows.push([r.id,r.reference,r.title,so?.app===false?'No':'Sí',so?.note||'',r.maps.map(k=>k.control).join(' + '),Math.min(5,...r.maps.map(k=>c.assess[k.control]?.level??0)),statusLabel(reqState(r)),a?.owner||'']);});
 const b=new Blob(['\ufeff'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='SoA-'+f+'.csv';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),500)}

/* Asistente de configuración: Empresa: Normativa: Situación actual: Qué necesitas: Plan de acción */
const WIZ=[['company','Empresa'],['scope','Normativa'],['current','Situación actual'],['needs','Qué necesitas'],['actions','Plan de acción']];
function goTo(h){location.hash==='#'+h?render():location.hash=h}
function wizardBar(p){
 if(!hasCompany())return '';const c=ctx(),i=WIZ.findIndex(w=>w[0]===p);if(c.wizard==null||i<0)return '';
 return `<nav class="wiz" aria-label="Asistente de configuración"><ol>${WIZ.map((w,k)=>`<li class="${k<i?'done':k===i?'now':''}" ${k===i?'aria-current="step"':''}><a href="#${w[0]}"><span>${k<i?icon('check'):k+1}</span>${w[1]}</a></li>`).join('')}</ol><div class="wizbtns">${i>0?'<button class="secondary" onclick="wizGo(-1)">'+icon('arrow-left')+' Atrás</button>':''}<button class="secondary" onclick="wizExit()">Salir del asistente</button>${p==='company'?'':`<button onclick="wizGo(1)">${i===WIZ.length-1?'Finalizar y ver el panel':'Confirmar y continuar '+icon('arrow-right')}</button>`}</div></nav>`}
function wizGo(d){
 const c=ctx(),p=location.hash.slice(1).split('?')[0],i=WIZ.findIndex(w=>w[0]===p);if(i<0)return;
 if(d>0&&p==='scope'&&!c.selected.length){alert('Selecciona al menos una norma para continuar.');return}
 const n=i+d;if(n<0)return;
 if(n>=WIZ.length){c.wizard=null;save();goTo('panel');return}
 c.wizard=n;save();goTo(WIZ[n][0])}
function wizExit(){ctx().wizard=null;save();render()}
function wizStart(){ctx().wizard=0;save();goTo('company')}

/* ===== v1.13 · Inicio, buscador global, comparador de normas y empresa de ejemplo ===== */
let _ci;const ctlReqs=()=>_ci||(_ci=Object.fromEntries(C.controls.map(c=>[c.id,C.requirements.filter(r=>usesCtl(r,c.id))])));
const norm=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function equivalents(r){const out=new Set();r.maps.forEach(m=>ctlReqs()[m.control].forEach(o=>{if(o.framework!==r.framework)out.add(o)}));return [...out]}
function searchCatalog(q,max=14){
 const tk=norm(q).split(/\s+/).filter(Boolean);if(!tk.length)return [];const hit=[];
 const sc=(txt,pri)=>{const h=norm(txt);return tk.every(k=>h.includes(k))?pri+(h.startsWith(tk[0])?2:0):0};
 C.requirements.forEach(r=>{const v=sc(r.reference+' '+r.title+' '+r.area+' '+fw(r.framework).short,1);if(v)hit.push({v,t:'req',x:r})});
 C.controls.forEach(c=>{const v=sc(c.id+' '+c.name+' '+c.area,2);if(v)hit.push({v,t:'ctl',x:c})});
 return hit.sort((a,b)=>b.v-a.v).slice(0,max)}
let _si=0;
function openSearch(){
 let o=document.getElementById('nxs');if(o){o.remove()}
 o=document.createElement('div');o.id='nxs';o.setAttribute('role','dialog');o.setAttribute('aria-label','Buscador');
 o.innerHTML='<div class="nxs-box"><input id="nxs-q" placeholder="Busca un requisito, artículo, medida o capacidad (p. ej. A.5.15, copias, proveedores)…" autocomplete="off"><div id="nxs-r"></div><small>Flechas para moverte · Enter para abrir · Esc para cerrar</small></div>';
 document.body.appendChild(o);const i=document.getElementById('nxs-q');
 const draw=()=>{const res=searchCatalog(i.value);_si=Math.min(_si,Math.max(0,res.length-1));o.dataset.n=res.length;
  document.getElementById('nxs-r').innerHTML=res.map((h,k)=>{const r=h.x,link=h.t==='req'?`#detail?type=requirement&id=${r.id}`:`#detail?type=control&id=${r.id}`;
   const sub=h.t==='req'?`${esc(r.area)} · equivale a: ${[...new Set(equivalents(r).map(e=>fw(e.framework).short))].join(', ')||'—'}`:`${esc(r.area)} · ${r.fw.map(f=>fw(f).short).join(', ')}`;
   return `<a href="${esc(link)}" class="${k===_si?'on':''}" data-h="${esc(link)}"><b>${h.t==='req'?esc(fw(r.framework).short)+' · '+esc(r.reference):esc(r.id)}</b><span>${esc(h.t==='req'?r.title:r.name)}</span><small>${sub}</small></a>`}).join('')||(i.value?'<p>Sin resultados.</p>':'')};
 i.oninput=()=>{_si=0;draw()};
 o.onclick=e=>{if(e.target===o||e.target.closest('a'))o.remove()};
 i.onkeydown=e=>{const n=+o.dataset.n||0;if(e.key==='Escape')o.remove();else if(e.key==='ArrowDown'){_si=Math.min(n-1,_si+1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){_si=Math.max(0,_si-1);draw();e.preventDefault()}else if(e.key==='Enter'){const a=document.querySelector('#nxs-r a.on');if(a){location.hash=a.dataset.h.slice(1);o.remove()}}};
 i.focus();draw()}
document.addEventListener&&document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});

function compareFw(a,b){
 const A=C.requirements.filter(r=>r.framework===a),B=C.requirements.filter(r=>r.framework===b),
  link=(r,o)=>r.maps.some(m=>o.maps.some(k=>k.control===m.control)),strong=(r,o)=>r.maps.some(m=>m.w>=1&&o.maps.some(k=>k.control===m.control&&k.w>=1));
 const eqA=A.map(r=>({r,eq:B.filter(o=>link(r,o)),st:B.some(o=>strong(r,o))})),eqB=B.map(r=>({r,eq:A.filter(o=>link(r,o))}));
 return{A,B,withEq:eqA.filter(x=>x.eq.length).length,strong:eqA.filter(x=>x.st).length,onlyA:eqA.filter(x=>!x.eq.length).map(x=>x.r),onlyB:eqB.filter(x=>!x.eq.length).map(x=>x.r)}}
function compareView(){
 const q=new URLSearchParams(location.hash.split('?')[1]||''),a=q.get('a')||'ens',b=q.get('b')||'iso27001',z=compareFw(a,b),opt=(v)=>C.frameworks.map(f=>`<option value="${f.id}" ${f.id===v?'selected':''}>${esc(f.short)}</option>`).join(''),pct=n=>z.A.length?Math.round(n/z.A.length*100):0,li=l=>l.slice(0,40).map(r=>`<a class="pn-req" href="#detail?type=requirement&id=${r.id}"><b>${esc(r.reference)}</b><span>${esc(r.title)}</span></a>`).join('')+(l.length>40?`<small>…y ${l.length-40} más</small>`:'')||'<small>Ninguno</small>';
 return head('COMPARAR','Dos normas frente a frente','Qué parte de una norma ya cubres si cumples la otra, y qué exige cada una en exclusiva.')+
 `<section class="panel"><div class="panelhead"><h2>Comparación</h2><div class="pn-btns" style="flex-direction:row"><select aria-label="Norma A" onchange="location.hash='compare?a='+this.value+'&b=${b}'">${opt(a)}</select><span>${icon('arrow-left-right')}</span><select aria-label="Norma B" onchange="location.hash='compare?a=${a}&b='+this.value">${opt(b)}</select></div></div>
 <p class="pn-lead"><b>${z.withEq}</b> de ${z.A.length} requisitos de ${esc(fw(a).short)} (${pct(z.withEq)}%) tienen equivalente en ${esc(fw(b).short)}; <b>${z.strong}</b> con equivalencia plena. Solo ${esc(fw(a).short)} exige ${z.onlyA.length} y solo ${esc(fw(b).short)} exige ${z.onlyB.length}.</p>
 <div class="pn-cols"><div class="pn-col"><h3>Solo en ${esc(fw(a).short)}</h3>${li(z.onlyA)}</div><div class="pn-col"><h3>Solo en ${esc(fw(b).short)}</h3>${li(z.onlyB)}</div></div></section>`}

function inicioView(){
 const own=hasCompany();
 return `<section class="ini"><div class="ini-hero"><div class="eyebrow">NEXUS · MAPA MULTINORMA</div><h1>Evalúa una capacidad una vez. Cuenta en todas tus normas.</h1><p>Nexus conecta ${C.controls.length} capacidades con ${C.requirements.length} requisitos de ENS, ISO 27001, NIS2, ISO 42001 y DORA, para ver qué cubres, qué te falta y qué hacer primero.</p>
 <div class="ini-btns">${own?'<a class="buttonlink" href="#panel">Ir a mi panel '+icon('arrow-right')+'</a>':'<button onclick="newCompany()">Empezar con mi empresa '+icon('arrow-right')+'</button>'}<button class="secondary" onclick="loadDemo()">Ver un ejemplo</button><button class="secondary" onclick="openSearch()">Buscar un requisito</button></div></div>
 <div class="ini-steps"><div><b>1</b><h3>Cuéntanos tu contexto</h3><p>Sector, tamaño, categoría ENS o clasificación NIS2. Nexus propone qué normas revisar.</p></div><div><b>2</b><h3>Evalúa una sola vez</h3><p>Cada capacidad se puntúa una vez y su resultado se reparte entre todas las normas que la usan.</p></div><div><b>3</b><h3>Decide con datos</h3><p>Cobertura por norma, brechas con mayor impacto, plan de acción y exportables.</p></div></div>
 <div class="ini-norms">${C.frameworks.map(f=>`<a href="#library?fw=${f.id}"><b>${esc(f.short)}</b><span>${C.requirements.filter(r=>r.framework===f.id).length} requisitos</span><small>${esc(f.desc)}</small></a>`).join('')}</div>
 <div class="ini-links"><a href="#compare">${icon('arrow-left-right')} Comparar dos normas</a><a href="#equivalences">Equivalencias</a><a href="#library">Biblioteca</a></div></section>`}

function loadDemo(){
 const c=blankCompany('TechServ · ejemplo');Object.assign(c,{sector:'Proveedor TIC del sector público',size:'Mediana',employees:'85',criticality:'alta',public:true,ensCategory:'alta',nis2Class:'importante',selected:['ens','iso27001','nis2'],target:3,wizard:null});
 C.controls.forEach((k,i)=>{const ens=k.fw.includes('ens');c.assess[k.id]={level:ens?(i%7===3?2:4):k.fw.includes('iso27001')?1:0,owner:ens?'Responsable de seguridad':'',evidence:''}});
 db.companies[c.id]=c;db.activeCompanyId=c.id;save();auto();goTo('panel')}

/* ===== v1.14 · migración, coherencia e informe ===== */
const LEGACY={'CTL-001':'GOB-01','CTL-002':'RIE-01','CTL-003':'ACC-02','CTL-004':'PRO-01','CTL-005':'INC-01','CTL-006':'CON-02','CTL-007':'OPE-10','CTL-008':'DES-01','CTL-009':'ACT-02','CTL-010':'IA-05','CTL-011':'IA-02','CTL-012':'IA-09','CTL-013':'CON-02','CTL-014':'INC-01'};
function migrateCompany(c){
 if(!c||!c.assess||!Object.keys(c.assess).some(k=>LEGACY[k]))return c;
 const a={};Object.entries(c.assess).forEach(([k,v])=>{const n=LEGACY[k]||k;if(!a[n]||(v.level||0)>(a[n].level||0))a[n]=v});c.assess=a;
 [c.actions,c.evidence,c.risks].forEach(l=>(l||[]).forEach(x=>{if(LEGACY[x.control])x.control=LEGACY[x.control]}));
 c.gapclosed={};c.migrated=true;return c}
function coherence(c){
 const lvl=k=>c.assess[k.id]?.level??0,cs=activeControls(),w=[],add=(n,t)=>n&&w.push(`Revisión · <b>${n}</b> ${t}`);
 if(c.selected.length&&cs.every(k=>!c.assess[k.id]))return ['Revisión · aún no has evaluado ninguna capacidad: empieza en <a href="#current">Situación actual</a>.'];
 add(cs.filter(k=>lvl(k)>=4&&!c.assess[k.id]?.owner&&!c.evidence.some(e=>e.control===k.id)).length,'capacidad(es) en nivel 4-5 sin responsable ni evidencia que lo respalde.');
 add(Object.values(c.soa).filter(v=>v.app===false&&!v.note).length,'exclusión(es) de la declaración de aplicabilidad sin justificar.');
 add(cs.filter(k=>lvl(k)<c.target&&!c.actions.some(a=>a.control===k.id)).length,'capacidad(es) bajo el objetivo sin ninguna acción asociada.');
 return w}
function informeView(){
 const {c,per,impact}=panelData(),cov=coverage(),f=new Date().toLocaleDateString('es-ES'),lab={basica:'Básica',media:'Media',alta:'Alta'},nl={esencial:'Entidad esencial',importante:'Entidad importante',fuera:'Fuera de ámbito'};
 const gaps=activeReqs().filter(r=>reqState(r)==='gap').slice(0,15),acts=c.actions.slice(0,15);
 return `<section class="rep"><div class="rep-bar"><button onclick="window.print()">Imprimir / guardar PDF</button></div>
 <header><div class="eyebrow">INFORME DE CUMPLIMIENTO MULTINORMA</div><h1>${esc(c.name)}</h1><p>${esc(c.sector||'Sector sin indicar')} · ${esc(c.size)} · Emitido el ${f}${c.ensCategory?' · ENS '+lab[c.ensCategory]:''}${c.nis2Class?' · '+nl[c.nis2Class]:''}</p></header>
 <div class="pn-kpis"><div><b>${cov.pct}%</b><span>cobertura global</span></div><div><b>${mavg().toFixed(1)}/5</b><span>madurez media</span></div><div><b>${c.target}/5</b><span>nivel objetivo</span></div><div><b>${per.length}</b><span>normas evaluadas</span></div></div>
 <h2>Cobertura por norma</h2><table class="pn-matrix"><thead><tr><th>Norma</th><th>Requisitos</th><th>Cubiertos</th><th>Parciales</th><th>Brechas</th><th>No aplica</th><th>%</th></tr></thead><tbody>${per.map(p=>`<tr><th scope="row">${esc(fw(p.f).short)}</th><td>${p.total}</td><td>${p.n.cubierto}</td><td>${p.n.parcial}</td><td>${p.n.gap}</td><td>${p.n.no_aplica}</td><td><b>${p.pct}%</b></td></tr>`).join('')}</tbody></table>
 <h2>Prioridades de implantación</h2>${impact.length?`<ol>${impact.map(z=>`<li><b>${z.x.id} · ${esc(z.x.name)}</b>: de ${z.l}/5 a ${c.target}/5 avanza ${z.n} requisito(s) en ${z.nf} norma(s).</li>`).join('')}</ol>`:'<p>Todas las capacidades alcanzan el objetivo.</p>'}
 <h2>Principales brechas</h2>${gaps.length?`<ul>${gaps.map(r=>`<li><b>${esc(fw(r.framework).short)} ${esc(r.reference)}</b> · ${esc(r.title)}</li>`).join('')}</ul>`:'<p>Sin brechas abiertas.</p>'}
 <h2>Plan de acción</h2>${acts.length?`<table class="pn-matrix"><thead><tr><th>Acción</th><th>Responsable</th><th>Fecha límite</th><th>Estado</th></tr></thead><tbody>${acts.map(a=>`<tr><td>${esc(a.title)}</td><td>${esc(a.owner||'—')}</td><td>${esc(a.due||'—')}</td><td>${esc(a.status)}</td></tr>`).join('')}</tbody></table>`:'<p>Sin acciones registradas.</p>'}
 <p class="rep-note">Documento orientativo generado por Nexus GRC Lion a partir de una autoevaluación. No constituye certificación ni asesoramiento legal; la conformidad con cada norma debe verificarla un auditor o asesor competente.</p></section>`}

/* ===== v1.15 · ENS por dimensión y exportación a Excel (.xlsx) ===== */
const ENS_DIMS=['C','I','D','A','T'],ENS_DIM_NAMES={C:'Confidencialidad',I:'Integridad',D:'Disponibilidad',A:'Autenticidad',T:'Trazabilidad'},ENS_ORD=['basica','media','alta'];
function ensEffectiveCategory(c){
 const lv=ENS_DIMS.map(k=>(c.ensLevels||{})[k]).filter(x=>ENS_ORD.includes(x)),by=lv.length?ENS_ORD[Math.max(...lv.map(x=>ENS_ORD.indexOf(x)))]:null,dec=ENS_ORD.includes(c.ensCategory)?c.ensCategory:null;
 if(!by)return dec||'alta';if(!dec)return by;return ENS_ORD.indexOf(by)>ENS_ORD.indexOf(dec)?by:dec}
function ensReqLevel(r,c){
 const cat=ensEffectiveCategory(c),L=c.ensLevels||{};let best=-1;
 if(!r.ensDims||r.ensDims==='Categoría')return ENS_ORD.indexOf(cat);
 for(const k of r.ensDims){if(!ENS_DIMS.includes(k))continue;const n=ENS_ORD.indexOf(ENS_ORD.includes(L[k])?L[k]:cat);if(n>best)best=n}
 return best<0?ENS_ORD.indexOf(cat):best}

const _crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=_crcT[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function zipStore(files){
 const enc=new TextEncoder(),parts=[],cen=[];let off=0;const u16=v=>[v&255,v>>8&255],u32=v=>[v&255,v>>8&255,v>>16&255,v>>>24&255];
 for(const [name,txt] of files){const n=enc.encode(name),d=enc.encode(txt),crc=crc32(d);
  const lh=Uint8Array.from([0x50,0x4b,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0)]);
  parts.push(lh,n,d);
  cen.push(Uint8Array.from([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),n);
  off+=lh.length+n.length+d.length}
 const cs=cen.reduce((s,x)=>s+x.length,0),end=Uint8Array.from([0x50,0x4b,5,6,...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cs),...u32(off),...u16(0)]);
 const all=[...parts,...cen,end],out=new Uint8Array(all.reduce((s,x)=>s+x.length,0));let p=0;all.forEach(x=>{out.set(x,p);p+=x.length});return out}
function xlsxBuild(sheets){
 const X=v=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,''),col=i=>{let s='';for(i++;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s};
 const sh=sheets.map(([n,rows])=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${(rows[0]||[]).map((_,i)=>`<col min="${i+1}" max="${i+1}" width="${Math.min(60,Math.max(10,...rows.slice(0,200).map(r=>String(r[i]??'').length+2)))}" customWidth="1"/>`).join('')}</cols><sheetData>${rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>typeof v==='number'&&isFinite(v)?`<c r="${col(ci)}${ri+1}" s="${ri?0:1}"><v>${v}</v></c>`:`<c r="${col(ci)}${ri+1}" s="${ri?0:1}" t="inlineStr"><is><t xml:space="preserve">${X(v??'')}</t></is></c>`).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:${col(Math.max(0,(rows[0]||[]).length-1))}${rows.length}"/></worksheet>`);
 const hd='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',N='http://schemas.openxmlformats.org/';
 return zipStore([['[Content_Types].xml',hd+`<Types xmlns="${N}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
 ['_rels/.rels',hd+`<Relationships xmlns="${N}package/2006/relationships"><Relationship Id="rId1" Type="${N}officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
 ['xl/workbook.xml',hd+`<workbook xmlns="${N}spreadsheetml/2006/main" xmlns:r="${N}officeDocument/2006/relationships"><sheets>${sheets.map(([n],i)=>`<sheet name="${X(n).slice(0,31)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`],
 ['xl/_rels/workbook.xml.rels',hd+`<Relationships xmlns="${N}package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="${N}officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="${N}officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
 ['xl/styles.xml',hd+`<styleSheet xmlns="${N}spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3F6212"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`],
 ...sh.map((x,i)=>[`xl/worksheets/sheet${i+1}.xml`,x])])}
function exportExcel(){
 const c=ctx(),cov=coverage(),{per}=panelData(),lvOf=r=>Math.min(5,...r.maps.map(k=>c.assess[k.control]?.level??0));
 const res=[['Indicador','Valor'],['Empresa',c.name],['Sector',c.sector||''],['Emitido',new Date().toLocaleDateString('es-ES')],['Cobertura global %',cov.pct],['Madurez media',+mavg().toFixed(2)],['Nivel objetivo',c.target],['Categoría ENS efectiva',c.selected.includes('ens')?ensEffectiveCategory(c):'']];
 per.forEach(p=>res.push([`${fw(p.f).short} · % cobertura`,p.pct],[`${fw(p.f).short} · cubiertos / parciales / brechas / n.a.`,`${p.n.cubierto} / ${p.n.parcial} / ${p.n.gap} / ${p.n.no_aplica}`]));
 const reqs=[['Norma','Requisito','Referencia','Título','Controles','Madurez mínima','Objetivo','Estado','Aplica (SoA)','Justificación']];
 activeReqs().forEach(r=>{const so=c.soa[r.id];reqs.push([fw(r.framework).short,r.id,r.reference,r.title,r.maps.map(k=>k.control).join(' + '),lvOf(r),c.target,statusLabel(reqState(r)),so?.app===false?'No':'Sí',so?.note||''])});
 const caps=[['Control','Capacidad','Dominio','Madurez','Objetivo','Responsable','Normas']];
 activeControls().forEach(k=>caps.push([k.id,k.name,k.area,c.assess[k.id]?.level??0,c.target,c.assess[k.id]?.owner||'',k.fw.map(f=>fw(f).short).join(', ')]));
 const acts=[['Acción','Control','Responsable','Fecha límite','Estado','Nota']];c.actions.forEach(a=>acts.push([a.title,a.control,a.owner||'',a.due||'',a.status,a.note||'']));
 const blob=new Blob([xlsxBuild([['Resumen',res],['Requisitos',reqs],['Capacidades',caps],['Plan de acción',acts]])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),l=document.createElement('a');
 l.href=URL.createObjectURL(blob);l.download='nexus-'+(c.name||'empresa').replace(/[^a-z0-9]+/gi,'-')+'.xlsx';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),500)}

/* ===== v1.19.1 · detalle de requisito: controles, equivalencias y nivel exigido ===== */
function reqIntro(r){
 const c=ctx(),L=r.maps.length,ENSL=['Básico','Medio','Alto'];
 const ctls=r.maps.map(m=>{const k=ctl(m.control),lv=c.assess[k.id]?.level??0,full=m.w>=1;
  return `<div class="linked lk"><div class="lk-text"><b>${esc(k.id)} · ${esc(k.name)}</b><span>${esc(k.description)}</span><div><small class="chip ${full?'full':'part'}">${full?'Equivalencia plena':'Cobertura parcial: la capacidad no agota el requisito'} · madurez ${lv}/${c.target}</small></div>${k.reason?`<small>Evidencias típicas: ${esc(k.reason)}</small>`:''}</div><button class="tertiary" onclick="openDetail('control','${esc(k.id)}')">Ver control ${icon('arrow-right')}</button></div>`}).join('');
 const eq=equivalents(r),byFw={};eq.forEach(o=>(byFw[o.framework]=byFw[o.framework]||[]).push(o));
 const eqHtml=Object.keys(byFw).length?`<h3>Se cubre también en otras normas</h3><div class="eqgrid">${Object.entries(byFw).map(([f,l])=>`<div><b>${esc(fw(f).short)}</b>${l.slice(0,6).map(o=>`<a href="#detail?type=requirement&id=${esc(o.id)}">${esc(o.reference)} · ${esc(o.title)}</a>`).join('')}${l.length>6?`<small>…y ${l.length-6} más</small>`:''}</div>`).join('')}</div>`:'';
 let ens='';
 if(r.framework==='ens'&&r.ens){const lvl=ensReqLevel(r,c),dims=r.ensDims&&r.ensDims!=='Categoría'?r.ensDims.split('').map(k=>ENS_DIM_NAMES[k]).filter(Boolean).join(', '):'la categoría del sistema';
  ens=`<p class="muted">Medida del Anexo II del ENS. Se determina por ${esc(dims)}. Con tu configuración actual el nivel considerado es <b>${ENSL[lvl]}</b>${r.ens[lvl]?'':' y la medida <b>no se exige</b> en ese nivel'}. Se exige en: ${['Básico','Medio','Alto'].filter((_,i)=>r.ens[i]).join(', ')||'ninguno'}.</p>`}
 return `<h2>${esc(r.title)}</h2><p class="muted">${esc(fw(r.framework).name)} · ${esc(r.reference)} · ${esc(r.area)}</p>${ens}<h3>Cómo lo cubre Nexus</h3><p class="muted">Se evalúa a través de ${L} capacidad${L===1?'':'es'} unificada${L===1?'':'s'}. ${L>1?'El requisito solo queda cubierto cuando lo están todas.':''}</p>${ctls}${eqHtml}`}
