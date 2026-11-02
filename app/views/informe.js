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
// Módulo: Informe imprimible.
function informeView(){
 const {c,per,impact}=panelData(),cov=coverage(),f=new Date().toLocaleDateString('es-ES'),lab={basica:'Básica',media:'Media',alta:'Alta'},nl={esencial:'Entidad esencial',importante:'Entidad importante',fuera:'Fuera de ámbito'};
 const gaps=activeReqs().filter(r=>reqState(r)==='gap').sort((a,b)=>{
  const score=r=>C.mappings.filter(m=>m.requirement===r.id).reduce((n,m)=>Math.max(n,priority(ctl(m.control)||{id:m.control})),0);
  return score(b)-score(a);
 }).slice(0,5),acts=c.actions.slice(0,15);
 return `<section class="rep"><div class="rep-bar"><button onclick="window.print()">Imprimir / guardar PDF</button><button onclick="shareCompanyLink()">Compartir solo lectura</button></div>
 <header><div class="eyebrow">INFORME DE CUMPLIMIENTO MULTINORMA</div><h1>${esc(c.name)}</h1><p>${esc(c.sector||'Sector sin indicar')} · ${esc(c.size)} · Emitido el ${f}${c.ensCategory?' · ENS '+lab[c.ensCategory]:''}${c.nis2Class?' · '+nl[c.nis2Class]:''}</p></header>
 <div class="pn-kpis"><div><b>${cov.pct}%</b><span>cobertura global</span></div><div><b>${mavg().toFixed(1)}/5</b><span>madurez media</span></div><div><b>${c.target}/5</b><span>nivel objetivo</span></div><div><b>${per.length}</b><span>normas evaluadas</span></div></div>
 <h2>Cobertura por norma</h2><table class="pn-matrix"><thead><tr><th>Norma</th><th>Requisitos</th><th>Cubiertos</th><th>Parciales</th><th>Brechas</th><th>No aplica</th><th>%</th></tr></thead><tbody>${per.map(p=>`<tr><th scope="row">${esc(fw(p.f).short)}</th><td>${p.total}</td><td>${p.n.cubierto}</td><td>${p.n.parcial}</td><td>${p.n.gap}</td><td>${p.n.no_aplica}</td><td><b>${p.pct}%</b></td></tr>`).join('')}</tbody></table>
 <h2>Prioridades de implantación</h2>${impact.length?`<ol>${impact.map(z=>`<li><b>${z.x.id} · ${esc(z.x.name)}</b>: de ${z.l}/5 a ${c.target}/5 avanza ${z.n} requisito(s) en ${z.nf} norma(s).</li>`).join('')}</ol>`:'<p>Todas las capacidades alcanzan el objetivo.</p>'}
 <h2>Principales brechas</h2>${gaps.length?`<ul>${gaps.map(r=>`<li><b>${esc(fw(r.framework).short)} ${esc(r.reference)}</b> · ${esc(r.title)}</li>`).join('')}</ul>`:'<p>Sin brechas abiertas.</p>'}
 <h2>Plan de acción</h2>${acts.length?`<table class="pn-matrix"><thead><tr><th>Acción</th><th>Responsable</th><th>Fecha límite</th><th>Estado</th></tr></thead><tbody>${acts.map(a=>`<tr><td>${esc(a.title)}</td><td>${esc(a.owner||'—')}</td><td>${esc(a.due||'—')}</td><td>${esc(a.status)}</td></tr>`).join('')}</tbody></table>`:'<p>Sin acciones registradas.</p>'}
 <p class="rep-note">Documento orientativo generado por Nexus GRC Lion a partir de una autoevaluación. No constituye certificación ni asesoramiento legal; la conformidad con cada norma debe verificarla un auditor o asesor competente.</p></section>`}
