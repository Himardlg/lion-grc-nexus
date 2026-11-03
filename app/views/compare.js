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
 const q=new URLSearchParams(location.hash.split('?')[1]||''),a=q.get('a')||'ens',b=q.get('b')||'iso27001',z=compareFw(a,b),
  opt=(v)=>C.frameworks.map(f=>`<option value="${f.id}" ${f.id===v?'selected':''}>${esc(f.short)}</option>`).join(''),
  pct=n=>z.A.length?Math.round(n/z.A.length*100):0,
  li=l=>l.length?l.slice(0,60).map(r=>`<a class="pn-req" href="#detail?type=requirement&id=${r.id}"><b>${esc(r.reference)}</b><span>${esc(r.title)}</span></a>`).join('')+(l.length>60?`<small class="compare-more">…y ${l.length-60} más</small>`:''):'<p class="empty">Ninguno en exclusiva</p>';
 const fa=fw(a),fb=fw(b);
 return head('COMPARAR','Dos normas frente a frente','Qué parte de una norma ya cubres si cumples la otra, y qué exige cada una en exclusiva.')+
 `<section class="panel compare-panel">
  <div class="panelhead compare-head">
   <div>
    <h2>Comparación</h2>
    <p class="compare-sub">${esc(fa.short)} frente a ${esc(fb.short)}</p>
   </div>
   <div class="pn-btns compare-pick">
    <label><span>Norma A</span><select aria-label="Norma A" onchange="location.hash='compare?a='+this.value+'&b=${b}'">${opt(a)}</select></label>
    <span class="compare-swap" aria-hidden="true">${icon('arrow-left-right')}</span>
    <label><span>Norma B</span><select aria-label="Norma B" onchange="location.hash='compare?a=${a}&b='+this.value">${opt(b)}</select></label>
   </div>
  </div>
  <div class="compare-kpis" role="group" aria-label="Resumen de comparación">
   <div><b>${z.withEq}</b><span>${pct(z.withEq)}% con equivalente</span></div>
   <div><b>${z.strong}</b><span>equivalencia plena</span></div>
   <div><b>${z.onlyA.length}</b><span>solo ${esc(fa.short)}</span></div>
   <div><b>${z.onlyB.length}</b><span>solo ${esc(fb.short)}</span></div>
  </div>
  <p class="pn-lead compare-lead"><b>${z.withEq}</b> de ${z.A.length} requisitos de ${esc(fa.short)} tienen equivalente en ${esc(fb.short)}. Abajo, lo que cada norma exige en exclusiva.</p>
  <div class="pn-cols compare-cols">
   <div class="pn-col"><div class="compare-colhead"><h3>Solo en ${esc(fa.short)}</h3><em>${z.onlyA.length}</em></div><div class="compare-scroll">${li(z.onlyA)}</div></div>
   <div class="pn-col"><div class="compare-colhead"><h3>Solo en ${esc(fb.short)}</h3><em>${z.onlyB.length}</em></div><div class="compare-scroll">${li(z.onlyB)}</div></div>
  </div>
 </section>`}
