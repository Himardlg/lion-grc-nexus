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
// Módulo: ENS: categoría efectiva por dimensión y nivel exigido.
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
