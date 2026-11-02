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
// Módulo: Migración de capacidades heredadas y revisión de coherencia.
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
