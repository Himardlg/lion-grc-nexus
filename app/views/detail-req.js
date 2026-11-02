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
// Módulo: Detalle de requisito: controles, equivalencias y nivel exigido.
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
