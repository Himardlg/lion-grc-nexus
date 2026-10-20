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
// Módulo: Buscador global (Ctrl K) y equivalencias entre requisitos.
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
