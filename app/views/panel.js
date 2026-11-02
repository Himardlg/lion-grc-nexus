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
//
// Módulo: Panel multinorma: datos, vista, normas y explorador.
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
