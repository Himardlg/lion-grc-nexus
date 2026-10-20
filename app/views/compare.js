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
// Módulo: Comparador de normas.

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
